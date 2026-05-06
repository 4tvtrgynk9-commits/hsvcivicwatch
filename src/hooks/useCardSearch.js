import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "";
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || "";
const searchClient = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

function escapeSearchValue(value) {
  return String(value || "").replace(/[%_,]/g, "\\$&");
}

export default function useCardSearch(query) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const trimmed = String(query || "").trim();
    if (trimmed.length < 3 || !searchClient) {
      setResults([]);
      setLoading(false);
      return undefined;
    }

    let cancelled = false;
    setLoading(true);

    const timeout = setTimeout(async () => {
      try {
        const pattern = `%${escapeSearchValue(trimmed)}%`;
        const { data, error } = await searchClient
          .from("issue_cards")
          .select("id, title, module, tab, ref_number, shock_factor")
          .or(`title.ilike.${pattern},summary.ilike.${pattern},details.ilike.${pattern}`)
          .limit(8);

        if (error) throw error;
        if (!cancelled) setResults(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!cancelled) setResults([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [query]);

  return { results, loading };
}
