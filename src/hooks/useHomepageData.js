import { supabase } from "../lib/supabase";
import { useCallback, useEffect, useRef, useState } from "react";


export default function useHomepageData() {
  const [cards, setCards] = useState([]);
  const [statBlocks, setStatBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const cancelledRef = useRef(false);

  const fetchHomepageData = useCallback(async () => {
    if (cancelledRef.current) return;
    setLoading(true);
    setError(null);

    if (!supabase) {
      if (!cancelledRef.current) {
        setCards([]);
        setStatBlocks([]);
        setError("Supabase environment variables are not configured.");
        setLoading(false);
      }
      return;
    }

    const [cardsResult, statBlocksResult] = await Promise.all([
      supabase
        .from("issue_cards")
        .select("*")
        .eq("show_on_overview", true)
        .order("homepage_score", { ascending: false })
        .limit(20),
      supabase
        .from("stat_blocks")
        .select("*")
        .order("strength_score", { ascending: false })
        .limit(10),
    ]);

    if (cancelledRef.current) return;

    setCards(cardsResult.data || []);
    setStatBlocks(statBlocksResult.error ? [] : (statBlocksResult.data || []));
    setError(cardsResult.error || null);
    setLoading(false);
  }, []);

  useEffect(() => {
    cancelledRef.current = false;

    fetchHomepageData();
    const interval = setInterval(() => {
      fetchHomepageData();
    }, 300000);

    return () => {
      cancelledRef.current = true;
      clearInterval(interval);
    };
  }, [fetchHomepageData]);

  return { cards, statBlocks, loading, error, refetch: fetchHomepageData };
}
