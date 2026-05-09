function clamp(value, min = 0, max = 10) {
  const n = Number(value || 0);
  if (!Number.isFinite(n)) return min;
  return Math.max(min, Math.min(max, Math.round(n)));
}
function textBundle(payload) { return JSON.stringify(payload || {}); }
function has(pattern, text) { return pattern.test(text || ""); }
function sourceScore(sources = [], claims = []) {
  let score = 0;
  if (sources.length >= 1) score += 3;
  if (sources.length >= 2) score += 2;
  if (claims.some((c) => c.support_level === "verified")) score += 3;
  if (claims.some((c) => c.source_ids?.length >= 2)) score += 2;
  return clamp(score);
}
export function computeReadinessScore50({ validation = {}, sources = [], claims = [] }) {
  const warnings = validation.warnings || [];
  const errors = validation.errors || [];
  const breakdown = {
    required_fields_complete: errors.length ? 2 : warnings.some((w) => /Missing/i.test(w)) ? 6 : 10,
    sources_attached: sourceScore(sources, claims),
    claims_source_backed: sourceScore(sources, claims),
    public_facing_fields_clean: warnings.some((w) => /NEEDS_MORE_RESEARCH|hidden/i.test(w)) ? 6 : 10,
    admin_format_valid: errors.length ? 3 : warnings.length ? 8 : 10,
  };
  return { readiness_score_50: Object.values(breakdown).reduce((sum, v) => sum + clamp(v), 0), readiness_breakdown: breakdown };
}
export function computeHSVImpactScore50({ payload = {}, sources = [], claims = [] }) {
  const text = textBundle(payload);
  const breakdown = {
    resident_impact: clamp((has(/residents|students|workers|patients|neighborhood|families|ratepayers|taxpayers/i, text) ? 6 : 3) + (has(/\d+%|\$|million|billion/i, text) ? 2 : 0)),
    public_money_power: clamp((has(/\$|million|billion|budget|contract|salary|donation|taxpayer/i, text) ? 6 : 2) + (has(/vote|ordinance|commission|council|board|agency/i, text) ? 3 : 0)),
    named_accountability: clamp((has(/mayor|council|commission|board|official|agency|contractor|developer|CEO|PAC|LLC|Inc\./i, text) ? 5 : 2) + ((text.match(/[A-Z][a-z]+ [A-Z][a-z]+/g) || []).length ? 3 : 0)),
    actionability: clamp(has(/contact|meeting|records request|complaint|election|public comment|email|vote|speak/i, text) ? 7 : 3),
    evidence_strength: sourceScore(sources, claims),
  };
  return { civic_impact_score_50: Object.values(breakdown).reduce((sum, v) => sum + clamp(v), 0), civic_impact_breakdown: breakdown };
}
export function computeVeritasAbsurdityScore50({ payload = {}, sources = [], claims = [] }) {
  const text = textBundle(payload);
  const breakdown = {
    contradiction_hypocrisy: clamp(has(/they said|record shows|contradiction|hypocrisy|what they said|what the record shows|flip|said .* but/i, text) ? 7 : 3),
    money_private_benefit: clamp(has(/\$|million|billion|contract|donor|PAC|lobbyist|private|crypto|company|industry/i, text) ? 7 : 2),
    public_harm_taxpayer_impact: clamp(has(/taxpayer|public|families|workers|patients|students|harm|cost|burden|risk|fees|cuts/i, text) ? 7 : 2),
    power_actor_shamelessness: clamp(has(/self-dealing|conflict|revolving door|donor|VIP|press release|campaign promise|repeat|pattern|again|same playbook/i, text) ? 7 : 3),
    receipt_strength: sourceScore(sources, claims),
  };
  const internal = Object.values(breakdown).reduce((sum, v) => sum + clamp(v), 0);
  return { internal_absurdity_score_50: internal, public_absurdity_score_10: Number((internal / 5).toFixed(1)), absurdity_breakdown: breakdown };
}
export function computeScoreBundle({ workspace, payload, sources, claims, validation }) {
  const readiness = computeReadinessScore50({ validation, sources, claims });
  if (workspace === "hsv") return { ...readiness, ...computeHSVImpactScore50({ payload, sources, claims }) };
  if (workspace === "veritas") return { ...readiness, ...computeVeritasAbsurdityScore50({ payload, sources, claims }) };
  return readiness;
}
