import { useEffect, useMemo, useState } from "react";
import { toStatTuple } from "./useSupabaseModule";

function getBlockTabs(block) {
  const data = block?.data || {};
  const tabs = [
    ...(Array.isArray(block?.effectiveTabs) ? block.effectiveTabs : []),
    ...(Array.isArray(data.tabs) ? data.tabs : []),
    block?.effectiveTab,
    block?.tab,
    data.tab,
  ];
  return Array.from(new Set(tabs.map(v => String(v || "").trim()).filter(Boolean)));
}

function weightedPickWithoutReplacement(items, count) {
  const pool = [...items];
  const picked = [];

  while (pool.length && picked.length < count) {
    const weights = pool.map(item => Math.max(1, Number(item.strength_score || 1)));
    const total = weights.reduce((sum, value) => sum + value, 0);
    let roll = Math.random() * total;
    let index = 0;

    for (let i = 0; i < pool.length; i += 1) {
      roll -= weights[i];
      if (roll <= 0) {
        index = i;
        break;
      }
    }

    picked.push(pool[index]);
    pool.splice(index, 1);
  }

  return picked;
}

export default function useRotatingStats({
  liveStatBlocks = [],
  fallbackStats = [],
  activeTabId = "overview",
  maxItems = 3,
  intervalMs = 10000,
}) {
  const [rotationKey, setRotationKey] = useState(0);
  const [displayStats, setDisplayStats] = useState([]);

  const filteredLiveStats = useMemo(() => {
    const relevant = (liveStatBlocks || []).filter(block => {
      const blockTabs = getBlockTabs(block);
      if (activeTabId === "overview") {
        return !blockTabs.length || blockTabs.includes("overview");
      }
      return blockTabs.includes(activeTabId);
    });

    return relevant.sort((a, b) => {
      if ((b.strength_score || 0) !== (a.strength_score || 0)) {
        return (b.strength_score || 0) - (a.strength_score || 0);
      }
      return new Date(b.created_at || 0) - new Date(a.created_at || 0);
    });
  }, [liveStatBlocks, activeTabId]);

  useEffect(() => {
    if (!filteredLiveStats.length) {
      setDisplayStats((fallbackStats || []).slice(0, maxItems));
      setRotationKey(prev => prev + 1);
      return;
    }

    const initial = filteredLiveStats.slice(0, maxItems).map(toStatTuple);
    setDisplayStats(initial);
    setRotationKey(prev => prev + 1);

    if (filteredLiveStats.length <= maxItems) return;

    const id = setInterval(() => {
      const next = weightedPickWithoutReplacement(filteredLiveStats, maxItems)
        .sort((a, b) => (b.strength_score || 0) - (a.strength_score || 0))
        .map(toStatTuple);

      setDisplayStats(next);
      setRotationKey(prev => prev + 1);
    }, intervalMs);

    return () => clearInterval(id);
  }, [filteredLiveStats, fallbackStats, maxItems, intervalMs]);

  return {
    stats: displayStats.length ? displayStats : (fallbackStats || []).slice(0, maxItems),
    rotationKey,
  };
}
