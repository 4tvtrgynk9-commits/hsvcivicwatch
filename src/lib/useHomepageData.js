import { useEffect, useMemo, useState } from "react";
import { supabase } from "./supabase";

const COLOR_MAP = {
  red: "#B4473E",
  gold: "#C6A34D",
  purple: "#7A4FA3",
  green: "#3E8B5B",
  blue: "#2F5D8A",
  lavender: "#7A4FA3",
  orange: "#cf7b2f",
};

function statValueText(block) {
  const d = block.data || block;

  if (d.type === "key-number") return d.value || "";
  if (d.type === "pay-clock") {
    const amount = Number(d.annualAmount || 0);
    if (!amount) return "$0";
    if (amount >= 1000000000) return "$" + (amount / 1000000000).toFixed(1) + "B";
    if (amount >= 1000000) return "$" + (amount / 1000000).toFixed(1) + "M";
    if (amount >= 1000) return "$" + (amount / 1000).toFixed(0) + "K";
    return "$" + amount.toLocaleString();
  }
  if (d.type === "comparison-bar") {
    return `${d.leftValue || 0} vs ${d.rightValue || 0}`;
  }
  return d.value || d.title || d.label || "";
}

function statLabelText(block) {
  const d = block.data || block;
  return d.label || d.title || d.type || "Stat";
}

function statContextText(block) {
  const d = block.data || block;
  return d.context || d.note || "";
}

function toKeyNumber(block) {
  const d = block.data || block;
  return {
    id: block.ref_number || block.id,
    label: statLabelText(block),
    value: statValueText(block),
    sub: statContextText(block),
    color: COLOR_MAP[d.color] || COLOR_MAP.red,
    target: block.module,
    strength_score: block.strength_score || 0,
    ref_number: block.ref_number || "",
  };
}

function toActiveInvestigation(card) {
  const score = Number(card.homepage_score || 0);
  const shock = Number(card.shock_score || 0);
  const color =
    shock >= 9 ? COLOR_MAP.red :
    shock >= 7 ? COLOR_MAP.gold :
    shock >= 5 ? COLOR_MAP.blue :
    COLOR_MAP.lavender;

  return {
    id: card.ref_number || card.id,
    module: card.module,
    tag: card.label || card.module,
    color,
    title: card.title || "",
    summary: card.summary || "",
    homepage_score: score,
    ref_number: card.ref_number || "",
    published_at: card.published_at || card.created_at || null,
  };
}

export default function useHomepageData() {
  const [issueCards, setIssueCards] = useState([]);
  const [statBlocks, setStatBlocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    async function fetchHomepageData() {
      setLoading(true);
      try {
        const [{ data: issues }, { data: stats }] = await Promise.all([
          supabase
            .from("issue_cards")
            .select("*")
            .order("homepage_score", { ascending: false })
            .order("published_at", { ascending: false, nullsFirst: false }),
          supabase
            .from("stat_blocks")
            .select("*")
            .order("strength_score", { ascending: false })
            .order("created_at", { ascending: false }),
        ]);

        setIssueCards(issues || []);
        setStatBlocks(stats || []);
      } catch (error) {
        console.error("useHomepageData fetch error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchHomepageData();
  }, []);

  const activeInvestigations = useMemo(() => {
    const filtered = issueCards
      .filter(card =>
        card.show_on_overview &&
        Number(card.homepage_score || 0) >= 5 &&
        card.module &&
        card.title &&
        card.ref_number
      )
      .sort((a, b) => {
        if ((b.homepage_score || 0) !== (a.homepage_score || 0)) {
          return (b.homepage_score || 0) - (a.homepage_score || 0);
        }
        if ((b.shock_score || 0) !== (a.shock_score || 0)) {
          return (b.shock_score || 0) - (a.shock_score || 0);
        }
        return new Date(b.published_at || b.created_at || 0) - new Date(a.published_at || a.created_at || 0);
      });

    const perModuleCap = {};
    const selected = [];
    for (const card of filtered) {
      const module = card.module || "unknown";
      const count = perModuleCap[module] || 0;
      if (count >= 2) continue;
      perModuleCap[module] = count + 1;
      selected.push(card);
    }

    return selected.map(toActiveInvestigation);
  }, [issueCards]);

  const keyNumbers = useMemo(() => {
    const allowedTypes = new Set(["key-number", "comparison-bar", "pay-clock", "trend-line", "bar-chart"]);
    return statBlocks
      .filter(block => {
        const d = block.data || block;
        return (
          Number(block.strength_score || 0) >= 5 &&
          allowedTypes.has(d.type || block.type) &&
          statLabelText(block) &&
          statValueText(block)
        );
      })
      .sort((a, b) => {
        if ((b.strength_score || 0) !== (a.strength_score || 0)) {
          return (b.strength_score || 0) - (a.strength_score || 0);
        }
        return new Date(b.created_at || 0) - new Date(a.created_at || 0);
      })
      .map(toKeyNumber);
  }, [statBlocks]);

  const moduleCounts = useMemo(() => {
    const counts = {};
    issueCards.forEach(card => {
      const module = card.module || "unknown";
      counts[module] = (counts[module] || 0) + 1;
    });
    return counts;
  }, [issueCards]);

  const latestByModule = useMemo(() => {
    const latest = {};
    issueCards.forEach(card => {
      const module = card.module || "unknown";
      const dateValue = new Date(card.published_at || card.created_at || 0).getTime();
      if (!latest[module] || dateValue > latest[module].dateValue) {
        latest[module] = {
          title: card.title || "",
          dateValue,
        };
      }
    });
    return latest;
  }, [issueCards]);

  return {
    loading,
    activeInvestigations,
    keyNumbers,
    moduleCounts,
    latestByModule,
  };
}
