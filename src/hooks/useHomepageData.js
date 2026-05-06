import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

export default function useHomepageData() {
  const [cards, setCards] = useState([]);
  const [statBlocks, setStatBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchHomepageData() {
      setLoading(true);
      setError(null);

      if (!supabase) {
        if (!cancelled) {
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

      if (cancelled) return;

      setCards(cardsResult.data || []);
      setStatBlocks(statBlocksResult.error ? [] : (statBlocksResult.data || []));
      setError(cardsResult.error || null);
      setLoading(false);
    }

    fetchHomepageData();

    return () => {
      cancelled = true;
    };
  }, []);

  return { cards, statBlocks, loading, error };
}
