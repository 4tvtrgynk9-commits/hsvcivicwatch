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

const FALLBACK_ACTIVE_INVESTIGATIONS = [
  {
    id: "utilities-fallback",
    module: "utilities",
    tag: "Utilities",
    color: COLOR_MAP.blue,
    title: "The risk is in Alabama. The control is not.",
    summary: "",
    homepage_score: 10,
    ref_number: "",
    published_at: null,
  },
  {
    id: "health-fallback",
    module: "health",
    tag: "Health System",
    color: COLOR_MAP.red,
    title: "Nonprofit on paper. Monopoly in practice.",
    summary: "",
    homepage_score: 9,
    ref_number: "",
    published_at: null,
  },
  {
    id: "equity-fallback",
    module: "equity",
    tag: "Equity",
    color: COLOR_MAP.gold,
    title: "One growth story. Two very different cities.",
    summary: "",
    homepage_score: 8,
    ref_number: "",
    published_at: null,
  },
  {
    id: "money-fallback",
    module: "money",
    tag: "Follow the Money",
    color: COLOR_MAP.lavender,
    title: "The same names keep showing up.",
    summary: "",
    homepage_score: 8,
    ref_number: "",
    published_at: null,
  },
];

const FALLBACK_KEY_NUMBERS = [
  {
    id: "tva-debt-fallback",
    label: "TVA Debt",
    value: "$20B+",
    sub: "Debt tied to the monopoly power system residents still fund.",
    color: COLOR_MAP.red,
    target: "utilities",
    strength_score: 10,
    ref_number: "",
  },
  {
    id: "hospital-buyout-fallback",
    label: "Hospital Buyout",
    value: "$450M",
    sub: "Crestwood acquisition accelerated monopoly concerns.",
    color: COLOR_MAP.lavender,
    target: "health",
    strength_score: 9,
    ref_number: "",
  },
  {
    id: "pretrial-fallback",
    label: "Pretrial Detention",
    value: "61%",
    sub: "People jailed before conviction, punished by poverty first.",
    color: COLOR_MAP.green,
    target: "criminal_justice",
    strength_score: 8,
    ref_number: "",
  },
  {
    id: "covid-prisons-fallback",
    label: "COVID Funds to Prisons",
    value: "$400M",
    sub: "Pandemic relief redirected into prison construction.",
    color: COLOR_MAP.gold,
    target: "criminal_justice",
    strength_score: 8,
    ref_number: "",
  },
  {
    id: "subsidy-fallback",
    label: "Front Row Subsidy",
    value: "$16M",
    sub: "City investment helping underwrite luxury downtown development.",
    color: COLOR_MAP.orange,
    target: "housing_crisis",
    strength_score: 7,
    ref_number: "",
  },
  {
    id: "grocery-tax-fallback",
    label: "Grocery Tax",
    value: "7%",
    sub: "A tax on food that hits working households first.",
    color: COLOR_MAP.blue,
    target: "taxation",
    strength_score: 7,
    ref_number: "",
  },
];

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

function visualConfigToKeyNumber(card) {
  const visual = card.visual_config || {};
  const data = Array.isArray(visual.data) ? visual.data : [];
  const first = data.find(item => item && (item.value !== undefined && item.value !== null));
  if (!first) return null;

  return {
    id: card.ref_number || card.id,
    label: first.label || card.label || "Key number",
    value: typeof first.value === "number" ? String(first.value) : (first.value || ""),
    sub: first.context || card.summary || "",
    color: COLOR_MAP[first.color] || COLOR_MAP.gold,
    target: card.module,
    strength_score: card.shock_score || card.visual_score || 0,
    ref_number: card.ref_number || "",
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
    const ranked = issueCards
      .filter(card => card.module && card.title && card.ref_number)
      .sort((a, b) => {
        const aHomepage = Number(a.homepage_score || a.shock_score || a.visual_score || 0);
        const bHomepage = Number(b.homepage_score || b.shock_score || b.visual_score || 0);
        if (bHomepage !== aHomepage) return bHomepage - aHomepage;

        const aShock = Number(a.shock_score || a.visual_score || 0);
        const bShock = Number(b.shock_score || b.visual_score || 0);
        if (bShock !== aShock) return bShock - aShock;

        return new Date(b.published_at || b.created_at || 0) - new Date(a.published_at || a.created_at || 0);
      });

    const preferred = ranked.filter(card => card.show_on_overview || !card.tab || card.tab === "overview");
    const source = preferred.length ? preferred : ranked;

    const perModuleCap = {};
    const selected = [];
    for (const card of source) {
      const module = card.module || "unknown";
      const count = perModuleCap[module] || 0;
      if (count >= 2) continue;
      perModuleCap[module] = count + 1;
      selected.push(card);
      if (selected.length >= 12) break;
    }

    const mapped = selected.map(toActiveInvestigation);
    return mapped.length ? mapped : FALLBACK_ACTIVE_INVESTIGATIONS;
  }, [issueCards]);

  const keyNumbers = useMemo(() => {
    const allowedTypes = new Set(["key-number", "comparison-bar", "pay-clock", "trend-line", "bar-chart"]);
    const rankedStats = statBlocks
      .filter(block => {
        const d = block.data || block;
        return (
          allowedTypes.has(d.type || block.type) &&
          statLabelText(block) &&
          statValueText(block)
        );
      })
      .sort((a, b) => {
        if ((b.strength_score || 0) !== (a.strength_score || 0)) {
          return (b.strength_score || 0) - (a.strength_score || 0);
        }
        return new Date(b.created_at || 0) - new Date(a.created_at || a.created_at || 0);
      })
      .map(toKeyNumber);

    if (rankedStats.length) return rankedStats;

    const visualFallback = issueCards
      .filter(card => card.visual_config && Array.isArray(card.visual_config.data) && card.visual_config.data.length)
      .sort((a, b) => {
        const aScore = Number(a.shock_score || a.visual_score || 0);
        const bScore = Number(b.shock_score || b.visual_score || 0);
        if (bScore !== aScore) return bScore - aScore;
        return new Date(b.published_at || b.created_at || 0) - new Date(a.published_at || a.created_at || 0);
      })
      .map(visualConfigToKeyNumber)
      .filter(Boolean);

    if (visualFallback.length) return visualFallback;

    const recentIssueFallback = issueCards
      .filter(card => card.module && card.title)
      .sort((a, b) => new Date(b.published_at || b.created_at || 0) - new Date(a.published_at || a.created_at || 0))
      .slice(0, 6)
      .map(card => ({
        id: card.ref_number || card.id,
        label: card.label || "Investigation",
        value: card.shock_score ? `${card.shock_score}/10` : "LIVE",
        sub: card.title || "",
        color: COLOR_MAP.gold,
        target: card.module,
        ref_number: card.ref_number || "",
      }));

    return recentIssueFallback.length ? recentIssueFallback : FALLBACK_KEY_NUMBERS;
  }, [statBlocks, issueCards]);

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
