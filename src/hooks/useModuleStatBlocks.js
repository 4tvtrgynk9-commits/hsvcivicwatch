import { supabase } from "../lib/supabase";
import { useEffect, useState } from "react";


export default function useModuleStatBlocks(moduleId, tab) {
  const [statBlocks, setStatBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchModuleStatBlocks() {
      setLoading(true);
      setError(null);

      if (!supabase || !moduleId) {
        if (!cancelled) {
          setStatBlocks([]);
          setError(!supabase ? "Supabase environment variables are not configured." : null);
          setLoading(false);
        }
        return;
      }

      let query = supabase
        .from("stat_blocks")
        .select("*")
        .eq("module", moduleId);

      if (tab) query = query.eq("tab", tab);

      const { data, error: queryError } = await query
        .order("strength_score", { ascending: false })
        .limit(5);

      if (cancelled) return;
      setStatBlocks(data || []);
      setError(queryError || null);
      setLoading(false);
    }

    fetchModuleStatBlocks();

    return () => {
      cancelled = true;
    };
  }, [moduleId, tab]);

  return { statBlocks, loading, error };
}
