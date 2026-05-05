import { useEffect, useState } from "react";
import { COLORS } from "../config/theme";
import { supabase } from "./supabase";

const MODULE_COLOR = {
  equity: COLORS.red,
  utilities: COLORS.orange,
  health: COLORS.red,
  insurance_burdens: COLORS.blue,
  workers_childcare: COLORS.green,
  taxation: COLORS.gold,
  housing_crisis: COLORS.orange,
  officials_elections: COLORS.navy,
  boards_oversight: COLORS.navy,
  voting_rights: COLORS.blue,
  criminal_justice: COLORS.red,
  policing: COLORS.red,
  data_collection: COLORS.lavender,
  money: COLORS.gold,
  landuse: COLORS.orange,
  environment: COLORS.green,
  information_warfare: COLORS.red,
  proposals: COLORS.green,
  action: COLORS.blue,
};

const STAT_COLOR = {
  red: COLORS.red,
  gold: COLORS.gold,
  blue: COLORS.blue,
  green: COLORS.green,
  purple: COLORS.lavender,
};

const EMPTY_DATA = {
  activeInvestigations: [],
  keyNumbers: [],
  moduleCounts: {},
  latestByModule: {},
};

function moduleColor(moduleId) {
  return MODULE_COLOR[moduleId] || COLORS.gold;
}

function statColor(colorName, moduleId) {
  return STAT_COLOR[colorName] || moduleColor(moduleId);
}

function toActiveInvestigation(card) {
  return {
    ref_number: card.ref_number || "",
    id: card.id,
    module: card.module || "",
    tab: card.tab || "overview",
    title: card.title || "",
    summary: card.homepage_teaser || card.summary || "",
    color: moduleColor(card.module),
    tag: card.label || "",
  };
}

function toKeyNumber(block) {
  const data = block.data && typeof block.data === "object" ? block.data : {};

  return {
    ref_number: block.ref_number || "",
    label: data.label || "",
    value: data.value || "",
    sub: data.context || "",
    color: statColor(block.color || data.color, block.module),
    target: block.module || "",
  };
}

export default function useHomepageData() {
  const [homepageData, setHomepageData] = useState(EMPTY_DATA);

  useEffect(() => {
    let cancelled = false;

    async function loadHomepageData() {
      if (!supabase) return;

      try {
        const [{ data: issueCards }, { data: statBlocks }] = await Promise.all([
          supabase
            .from("issue_cards")
            .select("*")
            .gte("homepage_score", 7)
            .order("homepage_score", { ascending: false })
            .order("created_at", { ascending: false }),
          supabase
            .from("stat_blocks")
            .select("*")
            .filter("data->>type", "eq", "key-number")
            .order("strength_score", { ascending: false })
            .order("created_at", { ascending: false }),
        ]);

        if (cancelled) return;

        const moduleCounts = {};
        const latestByModule = {};

        (issueCards || []).forEach((card) => {
          const moduleId = card.module || "";
          if (!moduleId) return;

          moduleCounts[moduleId] = (moduleCounts[moduleId] || 0) + 1;

          const cardTime = new Date(card.created_at || 0).getTime();
          const knownTime = latestByModule[moduleId]?.createdAt || 0;

          if (!latestByModule[moduleId] || cardTime > knownTime) {
            latestByModule[moduleId] = {
              title: card.title || "",
              createdAt: cardTime,
            };
          }
        });

        Object.keys(latestByModule).forEach((moduleId) => {
          latestByModule[moduleId] = { title: latestByModule[moduleId].title };
        });

        setHomepageData({
          activeInvestigations: (issueCards || []).map(toActiveInvestigation),
          keyNumbers: (statBlocks || []).map(toKeyNumber),
          moduleCounts,
          latestByModule,
        });
      } catch {
        if (!cancelled) setHomepageData(EMPTY_DATA);
      }
    }

    loadHomepageData();

    return () => {
      cancelled = true;
    };
  }, []);

  return homepageData;
}
