import { createClient } from "@supabase/supabase-js";
import { requireAdmin } from "./_adminAuth";

const ANTHROPIC_API_VERSION = "2023-06-01";
const MODEL = "claude-sonnet-4-20250514";

const PROFILE_PARSE_SYSTEM = `You are a structured data parser for HSV Civic Watch. Parse the profile research document into a JSON object. Extract every field verbatim — do not summarize, soften, or omit. Return valid JSON first, then append the FIELD COMPLETION REPORT comment block only after the JSON object. Output shape: { name, office, kind, jurisdiction, geography, appointed_by, term_start, term_end, election_date, party, salary, net_worth, status, module, scopes, scope_category, role_label, status_line, headshot_url, date_of_birth, residency, criminal_record, ethics_complaints, education, military_service, school_name, district_name, current_roles: [{ title, kind, jurisdiction, start_year, election_date, is_candidate, is_primary }], former_offices: [{ title, jurisdiction, start_year, end_year }], metrics: [{label, value}], quick_facts: [{label, value}], profile: { summary, timeline: [{date, title, detail}] }, networks: { born_into, elite_connections, professional_network, board_seats, organizational_ties, named_orbit: [{name, relationship, amount}] }, donors: { grand_total, totals_by_cycle: [{cycle, total}], top_individuals: [{name, amount, relationship}], top_pacs: [{name, amount, relationship}], individual_total, pac_total, dark_money, summary }, family: { spouse_name, has_children, children_count, parents_siblings, business_ties }, conflicts: { summary, items: [{title, body, sourceLabel}] }, on_record: [{title, body, sourceLabel}], votes: [{title, date, position, summary, sourceLabel}], contact: { phone, email, address, office_hours, website, finance_url, twitter, facebook, instagram, linkedin, campaign_website }, decoder: { rise, affiliations, beneficiaries, track_record }, ro_fields: { agency, total_years_officer, current_school_assignment, current_assignment_duration, previous_assignments: [{school, district, duration}], previous_agencies: [{name, years, departure_reason}], has_children, children_count, spouse_name, use_of_force_incidents, complaints, civil_suits, disciplinary_history } }.

MULTI-ROLE DETECTION:
Extract ALL roles this person currently holds simultaneously.
Each role is a separate object in the current_roles array.

current_roles shape:
[{
  title: string,
  kind: string,
  jurisdiction: string,
  start_year: string,
  election_date: string,
  is_candidate: boolean,
  is_primary: boolean
}]

Examples:
- U.S. Senator running for Governor:
  current_roles: [
    { title: "U.S. Senator", kind: "elected", jurisdiction: "Alabama", start_year: "2021", is_candidate: false, is_primary: true },
    { title: "Candidate for Governor", kind: "candidate", jurisdiction: "Alabama", election_date: "November 3, 2026", is_candidate: true, is_primary: false }
  ]

- School principal also on city council also on nonprofit board:
  current_roles: [
    { title: "Principal", kind: "appointed", jurisdiction: "Hazel Green High School", start_year: "2018", is_candidate: false, is_primary: true },
    { title: "City Council Member", kind: "elected", jurisdiction: "City of X", start_year: "2020", is_candidate: false, is_primary: false },
    { title: "Board Member", kind: "board_member", jurisdiction: "XYZ Nonprofit", start_year: "2022", is_candidate: false, is_primary: false }
  ]

Set status based on current_roles:
- If any role has is_candidate: true AND another role has is_candidate: false → "active" (dual/multi-role)
- If ALL roles have is_candidate: true → "candidate"
- If NO roles have is_candidate: true → "active"

Set office to the primary role title (where is_primary: true).
Set kind to the primary role kind.

former_offices: array of ALL previously held roles no longer active
[{ title, jurisdiction, start_year, end_year }]

The donors field must be a JSON object with this exact structure:
{
  "grand_total": "$322,000+",
  "totals_by_cycle": [
    { "cycle": "2018", "total": "$84,000" },
    { "cycle": "2022", "total": "$143,000" }
  ],
  "top_individuals": [
    { "name": "Mark McDaniel", "amount": "$15,000", "relationship": "Attorney operating in Madison County courts" },
    { "name": "Woody Anderson Ford", "amount": "$12,784", "relationship": "Vehicle dealership; sheriff office maintains fleet" },
    { "name": "Angel Rey Almodovar", "amount": "$6,000", "relationship": "Identity and interests not publicly disclosed" }
  ],
  "top_pacs": [
    { "name": "TSA PAC", "amount": "$10,000", "relationship": "Organizational identity not publicly disclosed" },
    { "name": "Alabama Republican Executive Committee", "amount": "$6,919.65", "relationship": "State party apparatus" },
    { "name": "Alabama Realtors PAC", "amount": "$6,000", "relationship": "Real estate industry; sheriff enforces evictions" }
  ],
  "individual_total": "$89,000",
  "pac_total": "$233,000",
  "summary": "Turner's campaign has collected over $322,000 since 2017..."
}

Always extract exactly 3 top individuals and 3 top PACs where data is available.
If fewer than 3 exist for either category, include however many exist.
grand_total covers all cycles combined.
totals_by_cycle covers each election year or reporting period separately.

DECODER FIELD FORMATTING:
Apply these rules to decoder.rise, decoder.affiliations, decoder.beneficiaries, and decoder.track_record:
- NEVER start entries with "—" or "-" or any dash/bullet character.
- NEVER start entries with a bare date like "Feb. 4, 2022:" — always lead with what happened, then put the date in parentheses or in a clause.
- Each entry must be a complete declarative sentence or clause, written in prosecutor voice.
- No shorthand, no fragments, no lazy em-dash list formatting.
- Entries are separated by a single line break, not bullet points or dashes.

WRONG:
— Feb. 4, 2022: 48-year-old woman died by suicide in Madison County jail.

CORRECT:
A 48-year-old woman died by suicide in Madison County Detention Facility in February 2022. Cause of death listed as bedsheet. No disciplinary action taken.

MANDATORY OUTPUT CHECKLIST — every profile must include all of the following.
If a field cannot be filled from available research, write exactly what is known
and flag it with [VERIFY] — never leave a field null or empty without explanation:

1. name — full legal name
2. office — current or most recent office
3. kind — exactly one of: elected, appointed, candidate, former, deceased
4. party — full party name
5. salary — exact figure with source
6. net_worth — Est. range with source, always show a figure
7. term_start — month and year
8. term_end — month and year if applicable
9. ethics_complaints — MUST be a JSON object in this shape:
   {
     "count": 0,
     "items": [],
     "summary": "No ethics complaints located in public records as of [year]."
   }
   If complaints exist, each item must include:
   { "type": "...", "filed_by": "...", "date": "...", "status": "resolved/pending/dismissed", "description": "..." }
   NEVER store ethics_complaints as a plain string.

10. decoder.rise — full career path in prosecutor voice, complete sentences
11. decoder.affiliations — all organizational ties, PAC relationships, institutional networks
    Must include every contractor relationship (healthcare, food, phone, communications)
    Must name Securus, Wellpath, Summit, NCIC, or any jail contractor by name if present
12. decoder.beneficiaries — named individuals only with dollar amounts, never categories
13. decoder.track_record — all votes, decisions, deaths in custody, lawsuits, budget actions
    Each entry must be a complete declarative sentence
    Never start with a dash, bullet, or bare date
    Deaths in custody: always name the person, age, date, cause, outcome
    Lawsuits: always name the case, parties, outcome
    Budget decisions: always include dollar amount and percentage change
14. donors — MUST be a JSON object in this exact shape:
    {
      "grand_total": "$322,000+",
      "totals_by_cycle": [
        { "cycle": "2018", "total": "$84,000" },
        { "cycle": "2022", "total": "$143,000" }
      ],
      "top_individuals": [
        { "name": "...", "amount": "...", "relationship": "..." }
      ],
      "top_pacs": [
        { "name": "...", "amount": "...", "relationship": "..." }
      ],
      "individual_total": "$89,000",
      "pac_total": "$233,000",
      "dark_money": "...",
      "summary": "..."
    }
    Always separate individuals from PACs.
    Always include grand_total and totals_by_cycle.
    Always include dark_money note if any PAC has undisclosed funding.

15. contact — phone, email, address, website at minimum
16. on_record — at least 3 public statements or quotes with source and date
17. votes — all significant votes or policy decisions with date and outcome

After generating output, the AI must output a FIELD COMPLETION REPORT as a
comment block listing which fields were filled, which were flagged [VERIFY],
and which could not be found. This report is stripped before saving to Supabase
but helps John verify completeness before publishing.

scopes rules: elected/judge/candidate — local jurisdiction sets [local], state sets [state], federal sets [federal]. board_member/director/authority_member sets [appointed_boards]. superintendent/asst_superintendent sets [directors_executives, school_boards_staff]. principal/vice_principal/resource_officer/district_staff sets [school_boards_staff]. module rules: official_profiles table sets module to officials_elections. board_profiles and school_profiles set module to boards_oversight. ro_fields only populated if kind is resource_officer.`;

const DECODER_SCORE_SYSTEM = `Score these HSV Civic Watch profile decoder fields. Return ONLY valid JSON: { shock_factor: number, module_relevance: number } both integers 1-10.`;

const SCHOOL_RESEARCH_SYSTEM = `You are a civic research assistant. Use web search to find the most current verifiable public numbers for a named Alabama school or school district. Return ONLY valid JSON: { enrollment: string, staff_count: string, annual_budget: string, as_of_date: string, sources: [{ label, url }] }. Use empty strings if a figure cannot be verified.`;

const OFFICIAL_KINDS = new Set(["elected", "appointed", "candidate", "former", "deceased", "judge", "sheriff", "tax_official"]);
const BOARD_KINDS = new Set(["board_member", "director", "authority_member"]);
const SCHOOL_KINDS = new Set(["superintendent", "asst_superintendent", "principal", "vice_principal", "resource_officer", "district_staff"]);

function json(res, status, body) {
  res.status(status).json(body);
}

function generateSlug(name) {
  return name?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "";
}

function getAdminClient() {
  const url = process.env.SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || "";
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function normalizeSeatId(value) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(trimmed)
    ? trimmed
    : null;
}

async function anthropicFetch(system, userContent, maxTokens = 16000, { enableWebSearch = false } = {}) {
  const body = {
    model: MODEL,
    max_tokens: maxTokens,
    system,
    messages: [{ role: "user", content: userContent }],
  };

  if (enableWebSearch) {
    body.tools = [{ type: "web_search_20250305", name: "web_search" }];
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": ANTHROPIC_API_VERSION,
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data?.error?.message || "Anthropic request failed");
  return (data.content || [])
    .filter((item) => item?.type === "text")
    .map((item) => item.text || "")
    .join("");
}

function parseJSON(text) {
  const clean = String(text || "")
    .replace(/```json|```/g, "")
    .replace(/\/\*\s*FIELD COMPLETION REPORT[\s\S]*?\*\//gi, "")
    .trim();
  return JSON.parse(clean);
}

function clampScore(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return 1;
  return Math.max(1, Math.min(10, Math.round(num)));
}

function computeHomepageScore(shock, moduleRelevance) {
  const raw = (clampScore(shock) * 0.7) + (5 * 0.2) + (clampScore(moduleRelevance) * 0.1);
  return clampScore(raw);
}

function asObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function cleanString(value) {
  return typeof value === "string" ? value.trim() : value == null ? "" : String(value).trim();
}

function getKindFromRawPaste(rawPaste) {
  const match = String(rawPaste || "").match(/^\s*KIND:\s*([^\n\r]+)/im);
  return cleanString(match?.[1]).toLowerCase();
}

function resolveTargetTable(kind) {
  if (OFFICIAL_KINDS.has(kind)) return "official_profiles";
  if (BOARD_KINDS.has(kind)) return "board_profiles";
  if (SCHOOL_KINDS.has(kind)) return "school_profiles";
  return "";
}

function normalizeProfile(parsedProfile, targetTable) {
  const profile = asObject(parsedProfile);
  const kind = cleanString(profile.kind).toLowerCase();

  return {
    ...profile,
    name: cleanString(profile.name),
    office: cleanString(profile.office),
    kind,
    jurisdiction: cleanString(profile.jurisdiction),
    geography: cleanString(profile.geography),
    appointed_by: cleanString(profile.appointed_by),
    term_start: cleanString(profile.term_start),
    term_end: cleanString(profile.term_end),
    election_date: cleanString(profile.election_date),
    party: cleanString(profile.party),
    salary: cleanString(profile.salary),
    net_worth: cleanString(profile.net_worth),
    status: cleanString(profile.status),
    module:
      targetTable === "official_profiles"
        ? "officials_elections"
        : "boards_oversight",
    scopes: asArray(profile.scopes).map((value) => cleanString(value)).filter(Boolean),
    scope_category: cleanString(profile.scope_category),
    role_label: cleanString(profile.role_label),
    status_line: cleanString(profile.status_line),
    headshot_url: cleanString(profile.headshot_url),
    date_of_birth: cleanString(profile.date_of_birth),
    residency: cleanString(profile.residency),
    criminal_record: cleanString(profile.criminal_record),
    ethics_complaints: typeof profile.ethics_complaints === "string"
      ? cleanString(profile.ethics_complaints)
      : {
        count: Number.isFinite(Number(profile.ethics_complaints?.count)) ? Number(profile.ethics_complaints.count) : asArray(profile.ethics_complaints?.items).length,
        items: asArray(profile.ethics_complaints?.items).map((item) => ({
          type: cleanString(item?.type),
          filed_by: cleanString(item?.filed_by),
          date: cleanString(item?.date),
          status: cleanString(item?.status),
          description: cleanString(item?.description),
        })).filter((item) => item.type || item.filed_by || item.date || item.status || item.description),
        summary: cleanString(profile.ethics_complaints?.summary),
      },
    education: cleanString(profile.education),
    military_service: cleanString(profile.military_service),
    school_name: cleanString(profile.school_name),
    district_name: cleanString(profile.district_name),
    current_roles: asArray(profile.current_roles).map((item) => ({
      title: cleanString(item?.title),
      kind: cleanString(item?.kind),
      jurisdiction: cleanString(item?.jurisdiction),
      start_year: cleanString(item?.start_year),
      election_date: cleanString(item?.election_date),
      is_candidate: Boolean(item?.is_candidate),
      is_primary: Boolean(item?.is_primary),
    })).filter((item) => item.title),
    former_offices: asArray(profile.former_offices).map((item) => ({
      title: cleanString(item?.title),
      jurisdiction: cleanString(item?.jurisdiction),
      start_year: cleanString(item?.start_year),
      end_year: cleanString(item?.end_year),
    })).filter((item) => item.title),
    metrics: asArray(profile.metrics).map((item) => ({
      label: cleanString(item?.label),
      value: cleanString(item?.value),
    })).filter((item) => item.label && item.value),
    quick_facts: asArray(profile.quick_facts || profile.quickFacts).map((item) => ({
      label: cleanString(item?.label),
      value: cleanString(item?.value),
    })).filter((item) => item.label && item.value),
    profile: {
      summary: cleanString(profile.profile?.summary),
      timeline: asArray(profile.profile?.timeline).map((item) => ({
        date: cleanString(item?.date),
        title: cleanString(item?.title),
        detail: cleanString(item?.detail),
      })).filter((item) => item.date || item.title || item.detail),
    },
    networks: {
      born_into: cleanString(profile.networks?.born_into),
      elite_connections: cleanString(profile.networks?.elite_connections),
      professional_network: cleanString(profile.networks?.professional_network),
      board_seats: cleanString(profile.networks?.board_seats),
      organizational_ties: cleanString(profile.networks?.organizational_ties),
      named_orbit: asArray(profile.networks?.named_orbit).map((item) => ({
        name: cleanString(item?.name),
        relationship: cleanString(item?.relationship),
        amount: cleanString(item?.amount),
      })).filter((item) => item.name || item.relationship || item.amount),
    },
    donors: {
      grand_total: cleanString(profile.donors?.grand_total),
      totals_by_cycle: asArray(profile.donors?.totals_by_cycle).map((item) => ({
        cycle: cleanString(item?.cycle),
        total: cleanString(item?.total),
      })).filter((item) => item.cycle || item.total),
      top_individuals: asArray(profile.donors?.top_individuals).map((item) => ({
        name: cleanString(item?.name),
        amount: cleanString(item?.amount),
        relationship: cleanString(item?.relationship),
      })).filter((item) => item.name || item.amount || item.relationship),
      top_pacs: asArray(profile.donors?.top_pacs).map((item) => ({
        name: cleanString(item?.name),
        amount: cleanString(item?.amount),
        relationship: cleanString(item?.relationship),
      })).filter((item) => item.name || item.amount || item.relationship),
      individual_total: cleanString(profile.donors?.individual_total),
      pac_total: cleanString(profile.donors?.pac_total),
      dark_money: cleanString(profile.donors?.dark_money),
      summary: cleanString(profile.donors?.summary),
    },
    family: {
      spouse_name: cleanString(profile.family?.spouse_name),
      has_children: cleanString(profile.family?.has_children),
      children_count: cleanString(profile.family?.children_count),
      parents_siblings: cleanString(profile.family?.parents_siblings),
      business_ties: cleanString(profile.family?.business_ties),
    },
    conflicts: {
      summary: cleanString(profile.conflicts?.summary),
      items: asArray(profile.conflicts?.items).map((item) => ({
        title: cleanString(item?.title),
        body: cleanString(item?.body),
        sourceLabel: cleanString(item?.sourceLabel || item?.source_label),
      })).filter((item) => item.title || item.body || item.sourceLabel),
    },
    on_record: asArray(profile.on_record || profile.onRecord).map((item) => ({
      title: cleanString(item?.title),
      body: cleanString(item?.body),
      sourceLabel: cleanString(item?.sourceLabel || item?.source_label),
    })).filter((item) => item.title || item.body || item.sourceLabel),
    votes: asArray(profile.votes).map((item) => ({
      title: cleanString(item?.title),
      date: cleanString(item?.date),
      position: cleanString(item?.position),
      summary: cleanString(item?.summary),
      sourceLabel: cleanString(item?.sourceLabel || item?.source_label),
    })).filter((item) => item.title || item.date || item.position || item.summary || item.sourceLabel),
    contact: {
      phone: cleanString(profile.contact?.phone),
      email: cleanString(profile.contact?.email),
      address: cleanString(profile.contact?.address),
      office_hours: cleanString(profile.contact?.office_hours),
      website: cleanString(profile.contact?.website),
      finance_url: cleanString(profile.contact?.finance_url),
      twitter: cleanString(profile.contact?.twitter),
      facebook: cleanString(profile.contact?.facebook),
      instagram: cleanString(profile.contact?.instagram),
      linkedin: cleanString(profile.contact?.linkedin),
      campaign_website: cleanString(profile.contact?.campaign_website),
    },
    decoder: {
      rise: cleanString(profile.decoder?.rise),
      affiliations: cleanString(profile.decoder?.affiliations),
      beneficiaries: cleanString(profile.decoder?.beneficiaries),
      track_record: cleanString(profile.decoder?.track_record),
    },
    ro_fields: {
      agency: cleanString(profile.ro_fields?.agency),
      total_years_officer: cleanString(profile.ro_fields?.total_years_officer),
      current_school_assignment: cleanString(profile.ro_fields?.current_school_assignment),
      current_assignment_duration: cleanString(profile.ro_fields?.current_assignment_duration),
      previous_assignments: asArray(profile.ro_fields?.previous_assignments).map((item) => ({
        school: cleanString(item?.school),
        district: cleanString(item?.district),
        duration: cleanString(item?.duration),
      })).filter((item) => item.school || item.district || item.duration),
      previous_agencies: asArray(profile.ro_fields?.previous_agencies).map((item) => ({
        name: cleanString(item?.name),
        years: cleanString(item?.years),
        departure_reason: cleanString(item?.departure_reason),
      })).filter((item) => item.name || item.years || item.departure_reason),
      has_children: cleanString(profile.ro_fields?.has_children),
      children_count: cleanString(profile.ro_fields?.children_count),
      spouse_name: cleanString(profile.ro_fields?.spouse_name),
      use_of_force_incidents: cleanString(profile.ro_fields?.use_of_force_incidents),
      complaints: cleanString(profile.ro_fields?.complaints),
      civil_suits: cleanString(profile.ro_fields?.civil_suits),
      disciplinary_history: cleanString(profile.ro_fields?.disciplinary_history),
    },
  };
}

function toDateValue(value) {
  const timestamp = Date.parse(cleanString(value));
  return Number.isFinite(timestamp) ? timestamp : 0;
}

function parseResearchMetricValue(value) {
  const text = cleanString(value);
  if (!text) return "";
  return text;
}

function mergeMetrics(metrics, updates) {
  const next = asArray(metrics).map((item) => ({
    label: cleanString(item?.label),
    value: cleanString(item?.value),
  })).filter((item) => item.label && item.value);

  for (const update of updates) {
    if (!update.value) continue;
    const index = next.findIndex((item) => item.label.toLowerCase() === update.label.toLowerCase());
    if (index >= 0) next[index] = update;
    else next.push(update);
  }

  return next;
}

async function researchEntity(entityType, name) {
  if (!cleanString(name)) return null;
  const prompt = `Research the current ${entityType} named "${cleanString(name)}" in the Huntsville Alabama metro context. Find the most current enrollment, staff count, and annual budget you can verify.`;
  const text = await anthropicFetch(SCHOOL_RESEARCH_SYSTEM, prompt, 6000, { enableWebSearch: true });
  const result = parseJSON(text);

  return {
    enrollment: parseResearchMetricValue(result.enrollment),
    staff_count: parseResearchMetricValue(result.staff_count),
    annual_budget: parseResearchMetricValue(result.annual_budget),
    as_of_date: cleanString(result.as_of_date),
    sources: asArray(result.sources).map((item) => ({
      label: cleanString(item?.label),
      url: cleanString(item?.url),
    })).filter((item) => item.label && item.url),
  };
}

async function upsertEntityRow(supabase, tableName, name, researched) {
  if (!cleanString(name) || !researched) return;

  try {
    const { data: existingRows, error: selectError } = await supabase
      .from(tableName)
      .select("*")
      .ilike("name", cleanString(name))
      .limit(1);

    if (selectError) throw selectError;

    const existing = existingRows?.[0] || null;
    const existingDate = Math.max(
      toDateValue(existing?.last_verified_at),
      toDateValue(existing?.as_of_date),
      toDateValue(existing?.updated_at)
    );
    const nextDate = toDateValue(researched.as_of_date) || Date.now();

    if (existing && existingDate >= nextDate) {
      return existing;
    }

    const payload = {
      name: cleanString(name),
      enrollment: researched.enrollment,
      staff_count: researched.staff_count,
      annual_budget: researched.annual_budget,
      as_of_date: researched.as_of_date || null,
      last_verified_at: researched.as_of_date || new Date().toISOString(),
      sources: researched.sources,
      updated_at: new Date().toISOString(),
    };

    if (existing?.id) {
      const { data, error } = await supabase
        .from(tableName)
        .update(payload)
        .eq("id", existing.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    const { data, error } = await supabase
      .from(tableName)
      .insert(payload)
      .select()
      .single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Failed to upsert ${tableName} row for ${name}:`, error);
    return null;
  }
}

async function updateMatchingSchoolProfiles(supabase, matchField, matchValue, metricUpdates) {
  if (!cleanString(matchValue) || !metricUpdates.length) return;

  try {
    const { data: rows, error } = await supabase
      .from("school_profiles")
      .select("id, metrics, data")
      .ilike(matchField, cleanString(matchValue));

    if (error) throw error;

    for (const row of rows || []) {
      const nextMetrics = mergeMetrics(row.metrics || row.data?.metrics, metricUpdates);
      const nextData = {
        ...asObject(row.data),
        metrics: nextMetrics,
      };

      await supabase
        .from("school_profiles")
        .update({
          metrics: nextMetrics,
          data: nextData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", row.id);
    }
  } catch (error) {
    console.error(`Failed to update school_profiles by ${matchField}:`, error);
  }
}

function buildProfilePayload(profile, targetTable, scoring) {
  const homepageScore = computeHomepageScore(scoring.shock_factor, scoring.module_relevance);
  const shockFactor = clampScore(scoring.shock_factor);

  if (targetTable === "official_profiles") {
    return {
      name: profile.name,
      slug: generateSlug(profile.name),
      office: profile.office,
      kind: profile.kind,
      jurisdiction: profile.jurisdiction,
      geography: profile.geography,
      appointed_by: profile.appointed_by,
      term_start: profile.term_start,
      term_end: profile.term_end,
      election_date: profile.election_date,
      party: profile.party,
      salary: profile.salary,
      net_worth: profile.net_worth,
      status: profile.status,
      module: "officials_elections",
      scopes: profile.scopes,
      scope_category: profile.scope_category,
      featured: false,
      sort_order: 0,
      date_of_birth: profile.date_of_birth,
      residency: profile.residency,
      criminal_record: profile.criminal_record,
      ethics_complaints: profile.ethics_complaints,
      education: profile.education,
      military_service: profile.military_service,
      headshot_url: profile.headshot_url,
      role_label: profile.role_label,
      status_line: profile.status_line,
      metrics: profile.metrics,
      quick_facts: profile.quick_facts,
      profile: profile.profile,
      networks: profile.networks,
      donors: profile.donors,
      family: profile.family,
      on_record: profile.on_record,
      votes: profile.votes,
      contact: profile.contact,
      decoder: profile.decoder,
      shock_factor: shockFactor,
      homepage_score: homepageScore,
      level: profile.scopes?.[0] || profile.scope_category || null,
    };
  }

  return {
    ...profile,
    module: "boards_oversight",
    quick_facts: profile.quick_facts,
    on_record: profile.on_record,
    headshot_url: profile.headshot_url,
    role_label: profile.role_label,
    status_line: profile.status_line,
    shock_factor: shockFactor,
    module_relevance: clampScore(scoring.module_relevance),
    homepage_score: homepageScore,
    data: {
      ...profile,
      shock_factor: shockFactor,
      module_relevance: clampScore(scoring.module_relevance),
      homepage_score: homepageScore,
    },
  };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return json(res, 405, { error: "Method not allowed" });
  }

  if (!(await requireAdmin(req, res))) return;

  const supabase = getAdminClient();
  if (!supabase) {
    return json(res, 500, { error: "Missing Supabase service role configuration" });
  }

  try {
    const { rawPaste, mode = "parse", profileId = null, seatId = null } = req.body || {};
    const normalizedSeatId = normalizeSeatId(seatId);

    if (!cleanString(rawPaste)) {
      return json(res, 400, { error: "Missing rawPaste" });
    }

    if (!["parse", "publish"].includes(mode)) {
      return json(res, 400, { error: "Invalid mode" });
    }

    const kind = getKindFromRawPaste(rawPaste);
    const targetTable = resolveTargetTable(kind);
    if (!targetTable) {
      return json(res, 400, { error: "Could not determine target table from KIND field" });
    }

    const parsedText = await anthropicFetch(PROFILE_PARSE_SYSTEM, rawPaste, 16000);
    const normalizedProfile = normalizeProfile(parseJSON(parsedText), targetTable);

    if (normalizedProfile.school_name) {
      const schoolResearch = await researchEntity("school", normalizedProfile.school_name);
      if (schoolResearch) {
        await upsertEntityRow(supabase, "schools", normalizedProfile.school_name, schoolResearch);
        await updateMatchingSchoolProfiles(supabase, "school_name", normalizedProfile.school_name, [
          { label: "Enrollment", value: schoolResearch.enrollment },
          { label: "Staff Count", value: schoolResearch.staff_count },
          { label: "Annual Budget", value: schoolResearch.annual_budget },
        ]);
      }
    }

    if (normalizedProfile.district_name) {
      const districtResearch = await researchEntity("school district", normalizedProfile.district_name);
      if (districtResearch) {
        await upsertEntityRow(supabase, "districts", normalizedProfile.district_name, districtResearch);
        await updateMatchingSchoolProfiles(supabase, "district_name", normalizedProfile.district_name, [
          { label: "District Enrollment", value: districtResearch.enrollment },
          { label: "District Staff", value: districtResearch.staff_count },
          { label: "District Budget", value: districtResearch.annual_budget },
        ]);
      }
    }

    const decoderScoreText = await anthropicFetch(
      DECODER_SCORE_SYSTEM,
      JSON.stringify({
        rise: normalizedProfile.decoder?.rise || "",
        affiliations: normalizedProfile.decoder?.affiliations || "",
        beneficiaries: normalizedProfile.decoder?.beneficiaries || "",
        track_record: normalizedProfile.decoder?.track_record || "",
      }),
      1000
    );

    const scoring = parseJSON(decoderScoreText);
    const finalProfile = buildProfilePayload(normalizedProfile, targetTable, scoring);

    if (mode === "parse") {
      return json(res, 200, { success: true, profile: finalProfile });
    }

    if (profileId) {
      const { data, error } = await supabase
        .from(targetTable)
        .update({
          ...finalProfile,
          seat_id: normalizedSeatId,
        })
        .eq("id", profileId)
        .select()
        .single();

      if (error) throw error;
      return json(res, 200, { success: true, id: data.id, profile: data });
    }

    const { data, error } = await supabase
      .from(targetTable)
      .insert({
        ...finalProfile,
        seat_id: normalizedSeatId,
      })
      .select()
      .single();

    if (error) throw error;
    return json(res, 200, { success: true, id: data.id, profile: data });
  } catch (error) {
    console.error("parse-profile failed:", error);
    return json(res, 500, { error: "Parse failed: " + error.message });
  }
}
