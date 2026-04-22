import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";

const BOARDS_MODULE = "boards_oversight";

function asObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeScopes(row, data) {
  const rawScopes = [
    ...(Array.isArray(row.scopes) ? row.scopes : []),
    ...(Array.isArray(data.scopes) ? data.scopes : []),
    row.scope,
    data.scope,
  ]
    .flat()
    .map((value) => String(value || "").trim())
    .filter(Boolean);

  const scopes = Array.from(new Set(rawScopes));
  return scopes.length ? scopes : ["overview"];
}

function normalizeMetrics(row, data) {
  const metrics = asArray(row.metrics).length ? row.metrics : asArray(data.metrics);
  return metrics
    .map((metric) => ({
      label: String(metric?.label || "").trim(),
      value: String(metric?.value || "").trim(),
    }))
    .filter((metric) => metric.label && metric.value);
}

function normalizeQuickFacts(row, data) {
  const quickFacts =
    asArray(row.quick_facts).length ? row.quick_facts : asArray(row.quickFacts).length ? row.quickFacts : asArray(data.quickFacts);

  return quickFacts
    .map((fact) => ({
      label: String(fact?.label || "").trim(),
      value: String(fact?.value || "").trim(),
    }))
    .filter((fact) => fact.label && fact.value);
}

function normalizeTimeline(profileSection) {
  return asArray(profileSection.timeline)
    .map((item) => ({
      date: String(item?.date || "").trim(),
      title: String(item?.title || "").trim(),
      detail: String(item?.detail || "").trim(),
    }))
    .filter((item) => item.date || item.title || item.detail);
}

function normalizeOnRecord(row, data) {
  const items = asArray(row.on_record).length ? row.on_record : asArray(row.onRecord).length ? row.onRecord : asArray(data.onRecord);
  return items
    .map((item) => ({
      title: String(item?.title || "").trim(),
      body: String(item?.body || "").trim(),
      sourceLabel: String(item?.sourceLabel || item?.source_label || "").trim(),
    }))
    .filter((item) => item.title || item.body || item.sourceLabel);
}

function normalizeVotes(row, data) {
  const items = asArray(row.votes).length ? row.votes : asArray(data.votes);
  return items
    .map((item) => ({
      title: String(item?.title || "").trim(),
      date: String(item?.date || "").trim(),
      position: String(item?.position || "").trim(),
      summary: String(item?.summary || "").trim(),
      sourceLabel: String(item?.sourceLabel || item?.source_label || "").trim(),
    }))
    .filter((item) => item.title || item.summary || item.date || item.position);
}

function normalizeContact(row, data) {
  const rowContact = asObject(row.contact);
  const contact = Object.keys(rowContact).length > 0 ? row.contact : data.contact;
  const source = asObject(contact);
  return {
    phone: String(source.phone || "").trim(),
    email: String(source.email || "").trim(),
    address: String(source.address || "").trim(),
    officeHours: String(source.officeHours || source.office_hours || "").trim(),
    website: String(source.website || "").trim(),
  };
}

function normalizeDecoder(row, data) {
  const rowDecoder = asObject(row.decoder);
  const decoder = Object.keys(rowDecoder).length > 0 ? row.decoder : data.decoder;
  const source = asObject(decoder);
  return {
    rise: String(source.rise || "").trim(),
    affiliations: String(source.affiliations || "").trim(),
    beneficiaries: String(source.beneficiaries || "").trim(),
    track_record: String(source.track_record || source.trackRecord || "").trim(),
  };
}

function normalizeConflicts(row, data) {
  const rowConflicts = asObject(row.conflicts);
  const conflicts = Object.keys(rowConflicts).length > 0 ? row.conflicts : data.conflicts;
  const source = asObject(conflicts);
  const items = asArray(source.items)
    .map((item) => ({
      title: String(item?.title || "").trim(),
      body: String(item?.body || "").trim(),
      sourceLabel: String(item?.sourceLabel || item?.source_label || "").trim(),
    }))
    .filter((item) => item.title || item.body || item.sourceLabel);
  const summary = String(source.summary || "").trim();

  if (!summary && !items.length) {
    return null;
  }

  return { summary, items };
}

function normalizeProfileRow(row) {
  const data = asObject(row.data);
  const rowProfile = asObject(row.profile);
  const profileSection = Object.keys(rowProfile).length > 0 ? row.profile : data.profile;
  const profile = asObject(profileSection);

  return {
    id: String(row.id || row.slug || row.ref_number || row.name || Math.random()).trim(),
    module: String(row.module || data.module || BOARDS_MODULE).trim(),
    scopes: normalizeScopes(row, data),
    featured: Boolean(row.featured ?? data.featured),
    sortOrder: Number(row.sort_order ?? data.sort_order ?? row.sortOrder ?? data.sortOrder ?? 0) || 0,
    kind: String(row.kind || data.kind || "board_member").trim(),
    name: String(row.name || data.name || "").trim(),
    office: String(row.office || data.office || "").trim(),
    role: String(row.role || data.role || "").trim(),
    geography: String(row.geography || data.geography || "").trim(),
    roleLabel: String(row.role_label || row.roleLabel || data.role_label || data.roleLabel || "").trim(),
    statusLine: String(row.status_line || row.statusLine || data.status_line || data.statusLine || "").trim(),
    headshotUrl: String(row.headshot_url || row.headshotUrl || data.headshot_url || data.headshotUrl || "").trim(),
    metrics: normalizeMetrics(row, data),
    quickFacts: normalizeQuickFacts(row, data),
    profile: {
      summary: String(profile.summary || "").trim(),
      timeline: normalizeTimeline(profile),
    },
    onRecord: normalizeOnRecord(row, data),
    votes: normalizeVotes(row, data),
    contact: normalizeContact(row, data),
    decoder: normalizeDecoder(row, data),
    conflicts: normalizeConflicts(row, data),
  };
}

export function scopeMatches(profile, scope) {
  if (!scope || scope === "overview") return true;
  return Array.isArray(profile.scopes) && profile.scopes.includes(scope);
}

export default function useBoardProfiles(activeScope = "overview") {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function fetchProfiles() {
      if (!supabase) {
        if (!cancelled) {
          setProfiles([]);
          setLoading(false);
          setError("Supabase is not configured.");
        }
        return;
      }

      setLoading(true);
      setError("");

      const { data, error: fetchError } = await supabase
        .from("board_profiles")
        .select("*")
        .order("featured", { ascending: false })
        .order("sort_order", { ascending: true })
        .order("name", { ascending: true });

      if (cancelled) return;

      if (fetchError) {
        console.error("useBoardProfiles fetch error:", fetchError);
        setProfiles([]);
        setLoading(false);
        setError(fetchError.message || "Could not load board profiles.");
        return;
      }

      const normalized = asArray(data)
        .map(normalizeProfileRow)
        .filter((profile) => profile.name)
        .filter((profile) => !profile.module || profile.module === BOARDS_MODULE);

      setProfiles(normalized);
      setLoading(false);
    }

    fetchProfiles();

    return () => {
      cancelled = true;
    };
  }, []);

  const visibleProfiles = useMemo(() => {
    return profiles
      .filter((profile) => scopeMatches(profile, activeScope))
      .sort((a, b) => {
        if (a.featured !== b.featured) return a.featured ? -1 : 1;
        if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
        return a.name.localeCompare(b.name);
      });
  }, [activeScope, profiles]);

  return { profiles: visibleProfiles, loading, error };
}
