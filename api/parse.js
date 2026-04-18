import { requireAdmin } from "./_adminAuth";

// ── constants ─────────────────────────────────────────────────────────────────

const ANTHROPIC_API_VERSION = "2023-06-01";
const MODEL = "claude-sonnet-4-20250514";
const CARDS_PER_BATCH = 3;
const MAX_BATCH_RETRIES = 2;
const RECENCY_BOOST_AT_PUBLISH = 10;

// ── core fetch helper ─────────────────────────────────────────────────────────

const anthropicFetch = async (system, userContent, maxTokens = 16000) => {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": ANTHROPIC_API_VERSION,
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      system,
      messages: [{ role: "user", content: userContent }],
    }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data?.error?.message || "Anthropic request failed");
  return data.content.map(i => i.text || "").join("");
};

const parseJSON = (text) => {
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
};

// ── scoring helpers ───────────────────────────────────────────────────────────

const clampScore = (value) => {
  const num = Number(value);
  if (!Number.isFinite(num)) return 1;
  return Math.max(1, Math.min(10, Math.round(num)));
};

const computeHomepageScore = (shock, moduleRelevance, recencyBoost = RECENCY_BOOST_AT_PUBLISH) => {
  const raw =
    (clampScore(shock) * 0.70) +
    (clampScore(recencyBoost) * 0.20) +
    (clampScore(moduleRelevance) * 0.10);
  return clampScore(raw);
};

// ── stat candidate generation ─────────────────────────────────────────────────

const sentenceSplit = (text) =>
  String(text || "")
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(Boolean);

const numberRegex = /(\$\s?\d[\d,]*(?:\.\d+)?(?:\s?(?:million|billion|thousand|m|b|k))?|\d[\d,]*(?:\.\d+)?\s?%|\d[\d,]*(?:\.\d+)?x|\d[\d,]*(?:\.\d+)?)/ig;

const compactWords = (text, limit = 7) =>
  String(text || "")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean)
    .slice(0, limit)
    .join(" ");

const labelFromSentence = (sentence, value, fallbackTitle) => {
  const stripped = String(sentence || "")
    .replace(String(value || ""), " ")
    .replace(/[()]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const label = compactWords(stripped, 6);
  return label || compactWords(fallbackTitle || "Key number", 6) || "Key number";
};

// Quality gate: reject stat candidates that are clearly bad data
const isValidStatValue = (value) => {
  if (!value || !value.trim()) return false;
  const v = value.trim();
  // Reject zero-dollar values
  if (/^\$\s*0+(\.0+)?$/.test(v)) return false;
  // Reject bare zeros or near-zero numbers with no unit meaning
  if (/^0+(\.0+)?$/.test(v)) return false;
  // Reject values that are just a number with no magnitude (e.g. "1", "0")
  const num = parseFloat(v.replace(/[$,%x,]/g, ""));
  if (Number.isFinite(num) && Math.abs(num) < 1 && !v.includes("%") && !v.includes("x")) return false;
  return true;
};

const buildGeneratedStatCandidates = (issueCards) => {
  const generated = [];
  (issueCards || []).forEach((card, cardIndex) => {
    const textPool = [
      card.title, card.summary, card.details,
      card.decoder?.whatsHappening, card.decoder?.connections,
      card.decoder?.whoBenefits, card.decoder?.impact,
    ].filter(Boolean).join(" ");

    const sentences = sentenceSplit(textPool);
    const seenValues = new Set();
    let localCount = 0;

    for (const sentence of sentences) {
      const matches = sentence.match(numberRegex) || [];
      for (const match of matches) {
        const value = String(match || "").trim();
        if (!value || seenValues.has(value.toLowerCase())) continue;
        // Quality gate: skip bad values
        if (!isValidStatValue(value)) continue;
        seenValues.add(value.toLowerCase());

        const lowerSentence = sentence.toLowerCase();
        const color = value.includes("$")
          ? "gold"
          : lowerSentence.includes("pay") || lowerSentence.includes("poverty") || lowerSentence.includes("jail")
            ? "red"
            : lowerSentence.includes("board") || lowerSentence.includes("vote") || lowerSentence.includes("approved")
              ? "blue"
              : "red";

        generated.push({
          module: card.module,
          tab: card.tab || "overview",
          type: "key-number",
          color,
          value,
          label: labelFromSentence(sentence, value, card.title),
          context: sentence.trim(),
          title: card.title,
          source_pool: "generated",
          generated_from_card_index: cardIndex,
        });

        localCount += 1;
        if (localCount >= 3) break;
      }
      if (localCount >= 3) break;
    }
  });
  return generated;
};

// ── normalization ─────────────────────────────────────────────────────────────

const MODULE_NORMALIZE = {
  "policing": "policing",
  "housing": "housing_crisis",
  "housing crisis": "housing_crisis",
  "criminal justice": "criminal_justice",
  "utilities": "utilities",
  "workers": "workers_childcare",
  "workers childcare": "workers_childcare",
  "worker rights & child care": "workers_childcare",
  "worker rights and child care": "workers_childcare",
  "worker rights": "workers_childcare",
  "workers rights": "workers_childcare",
  "taxes": "taxation",
  "taxation": "taxation",
  "officials": "officials_elections",
  "officials & elections": "officials_elections",
  "officials elections": "officials_elections",
  "environment": "environment",
  "unhoused": "housing_crisis",
  "annexation": "landuse",
  "land": "landuse",
  "land use": "landuse",
  "land: annexation, zoning, & development": "landuse",
  "transit": "housing_crisis",
  "education": "equity",
  "insurance": "insurance_burdens",
  "insurance burdens": "insurance_burdens",
  "boards": "boards_oversight",
  "boards, directors, & school boards": "boards_oversight",
  "boards directors & school boards": "boards_oversight",
  "voting": "voting_rights",
  "the ballot & your access": "voting_rights",
  "data": "data_collection",
  "money": "money",
  "follow the money": "money",
  "information": "information_warfare",
  "information warfare": "information_warfare",
  "proposals": "proposals",
  "a better huntsville: the blueprint": "proposals",
  "action": "action",
  "take action": "action",
  "health system": "health",
  "health": "health",
  "healthcare & hospital system": "health",
  "healthcare and hospital system": "health",
  "equity": "equity",
  "the two huntsvilles": "equity",
  "criminal justice: sentencing & prisons": "criminal_justice",
  "law enforcement & accountability": "policing",
  "surveillance & data collection": "data_collection",
};

const TAB_MAP = {
  insurance_burdens: {
    "health insurance": "health", "health": "health",
    "auto insurance": "auto", "auto": "auto",
    "dental": "dental_vision", "dental & vision": "dental_vision", "dental and vision": "dental_vision",
    "homeowners": "homeowners", "homeowners insurance": "homeowners",
  },
  workers_childcare: {
    "worker rights": "worker_rights", "workers rights": "worker_rights",
    "child care": "child_care", "childcare": "child_care",
  },
  policing: { "hpd": "hpd", "madison county sheriff": "sheriff", "sheriff": "sheriff" },
  criminal_justice: {
    "bail": "bail_pretrial", "pretrial": "bail_pretrial", "bail & pretrial": "bail_pretrial",
    "sentencing": "sentencing",
    "prison": "incarceration", "incarceration": "incarceration",
  },
  data_collection: {
    "surveillance": "surveillance",
    "data collection": "data_collection", "data": "data_collection",
  },
  voting_rights: {
    "voter registration": "voter_registration", "registration": "voter_registration",
    "polling": "polling_access", "polling & access": "polling_access",
    "representatives": "your_reps", "your representatives": "your_reps",
  },
  money: {
    "connections map": "connections_map", "connections": "connections_map",
    "donor profiles": "donor_profiles", "donors": "donor_profiles",
    "executive compensation": "exec_compensation", "exec vs worker": "exec_vs_worker",
    "exec pay vs worker pay": "exec_vs_worker", "ceo pay": "exec_vs_worker",
    "contracts": "contracts_vendors", "contracts & vendors": "contracts_vendors",
  },
  information_warfare: {
    "narrative control": "narrative_control", "narrative": "narrative_control",
    "disinformation": "disinformation", "disinformation campaigns": "disinformation",
    "media capture": "media_capture", "media": "media_capture",
  },
  proposals: {
    "economic justice": "economic_justice",
    "housing & infrastructure": "housing_infrastructure", "housing": "housing_infrastructure",
    "public safety reform": "public_safety", "public safety": "public_safety",
    "governance & democracy": "governance", "governance": "governance",
  },
  equity: {
    "overview": "overview",
    "schools": "schools",
    "infrastructure": "infrastructure",
  },
};

const normalizeTab = (module, tab) => {
  if (!tab) return null;
  const modMap = TAB_MAP[module] || {};
  return modMap[tab.toLowerCase().trim()] || tab.toLowerCase().trim().replace(/\s+/g, "_");
};

const normalizeModule = (m) => {
  if (!m) return m;
  const key = m.toLowerCase().trim();
  return MODULE_NORMALIZE[key] || key.replace(/\s+/g, "_");
};

// ── step 1: pre-split raw paste into chunks ───────────────────────────────────

const preSplitChunks = async (rawPaste) => {
  const system = `You are a text segmentation tool for HSV Civic Watch.

Your ONLY job is to find every — ISSUE CARD START — / — ISSUE CARD END — block and every — STAT BLOCK START — / — STAT BLOCK END — block in the raw text and return each one as a separate chunk.

Rules:
- Copy each chunk's raw text VERBATIM. Do not alter a single character.
- Do not parse, interpret, summarize, or reformat any content.
- Every chunk must include its opening and closing delimiter lines.
- Count every chunk. If you find 7 issue cards and 9 stat blocks, return 16 chunks total.
- Return ONLY valid JSON. No markdown. No explanation.

Output shape:
{
  "chunks": [
    { "index": 0, "type": "issueCard", "rawText": "— ISSUE CARD START —\\n...\\n— ISSUE CARD END —" },
    { "index": 1, "type": "statBlock", "rawText": "— STAT BLOCK START —\\n...\\n— STAT BLOCK END —" }
  ],
  "issueCardCount": 7,
  "statBlockCount": 9
}`;

  const text = await anthropicFetch(system, rawPaste, 32000);
  return parseJSON(text);
};

// ── step 2: parse one batch of up to 3 cards + their stat blocks ──────────────

const PARSE_SYSTEM = `You are a structured data parser for HSV Civic Watch, a civic accountability and investigative transparency platform for Huntsville, Alabama residents.

Your ONLY job is to parse the raw formatted research text and convert it into structured JSON - preserving all content VERBATIM. Do not summarize. Do not soften. Do not rephrase. Do not editorialize. Do not omit details. Copy the text exactly as written.

=== CRITICAL RULES ===
- Each — ISSUE CARD START — to — ISSUE CARD END — block is exactly ONE issue card object. Never combine two blocks into one object. Never split one block into two objects.
- Each — STAT BLOCK START — to — STAT BLOCK END — block is exactly ONE stat block object.
- Preserve ALL text verbatim across every field. Never paraphrase, summarize, or soften.
- The decoder fields especially must be copied exactly - do not condense them, do not smooth their tone, do not remove names or dollar amounts.
- UNKNOWN values store as null.
- If APPLIES is NO set applies: false, all other fields null.
- mediaOutreach: parse the 5 Huntsville outlets exactly as written in the template.
- Return ONLY valid JSON. No markdown fences. No explanation. No preamble. Nothing before or after the JSON object.

=== OUTPUT SHAPE ===

Return a single JSON object:
{
  "issueCards": [...],
  "statBlocks": [...]
}

Issue card shape:
{
  "module": string,
  "label": string,
  "title": string,
  "summary": string,
  "details": string,
  "sources": [{ "label": string, "url": string }],
  "decoder": {
    "whatsHappening": string,
    "connections": string,
    "whoBenefits": string,
    "impact": string
  },
  "tab": string|null,
  "actions": {
    "intro": string|null,
    "contacts": [{ "name": string, "role": string|null, "phone": string|null, "email": string|null, "address": string|null, "officialLink": string|null }],
    "meetings": [{ "title": string, "frequency": string|null, "location": string|null, "why": string|null, "link": string|null }],
    "paths": [{ "destination": string, "type": string|null, "why": string|null, "link": string|null }],
    "actions": [{ "label": string, "kind": string, "href": string|null, "template": { "email": string|null, "subject": string|null, "body": string|null }|null }],
    "mediaOutreach": { "applies": boolean, "outlets": [{ "name": string, "tipEmail": string, "subject": string|null, "body": string|null }] }
  }
}

Stat block shape:
{
  "module": string,
  "tab": string,
  "type": string,
  "color": string,
  "value": string|null,
  "label": string|null,
  "context": string|null,
  "title": string|null,
  "unit": string|null,
  "note": string|null,
  "leftLabel": string|null,
  "leftValue": number|null,
  "rightLabel": string|null,
  "rightValue": number|null,
  "slices": [{ "name": string, "value": number }]|null,
  "points": [{ "year": string, "value": number }]|null,
  "bars": [{ "name": string, "value": number }]|null,
  "annualAmount": number|null,
  "zones": [{ "name": string, "value": string, "status": string }]|null
}`;

const parseBatch = async (cardChunks, statChunks, expectedCardCount, attempt = 1) => {
  const retryPrefix = attempt > 1
    ? `RETRY ATTEMPT ${attempt}. The previous parse returned the wrong number of issue cards. You MUST return EXACTLY ${expectedCardCount} issue card objects — one per — ISSUE CARD START — block. Never combine two cards into one object.\n\n`
    : "";

  const batchText = [
    ...cardChunks.map(c => c.rawText),
    ...statChunks.map(c => c.rawText),
  ].join("\n\n");

  const text = await anthropicFetch(PARSE_SYSTEM, retryPrefix + batchText, 16000);
  const result = parseJSON(text);

  // self-correct: retry if card count is wrong
  if (result.issueCards.length !== expectedCardCount) {
    if (attempt < MAX_BATCH_RETRIES) {
      console.warn(`Batch returned ${result.issueCards.length} cards, expected ${expectedCardCount}. Retrying (attempt ${attempt + 1})...`);
      return parseBatch(cardChunks, statChunks, expectedCardCount, attempt + 1);
    }
    throw new Error(
      `Batch failed after ${MAX_BATCH_RETRIES} attempts: expected ${expectedCardCount} cards, got ${result.issueCards.length}. ` +
      `Check formatting of these card chunks: ${cardChunks.map((_, i) => `card chunk ${i + 1}`).join(", ")}`
    );
  }

  return result;
};

// ── step 3: visual scoring ────────────────────────────────────────────────────

const scoreVisuals = async (issueCards) => {
  const visualPrompt = issueCards.map((card, i) =>
    `CARD ${i}: Title: ${card.title} Summary: ${card.summary} Details: ${card.details || ""} What's Happening: ${card.decoder?.whatsHappening || ""} Connections: ${card.decoder?.connections || ""} Who Benefits: ${card.decoder?.whoBenefits || ""} Impact: ${card.decoder?.impact || ""}`
  ).join("\n\n---\n\n");

  const visualSystem = `You are a data visualization advisor for HSV Civic Watch.

For each issue card:
1. Score 1-10 for how much it benefits from an inline visualization (7+ = generate visual)
2. If score >= 7, generate a visual_config JSON object
3. Decide show_on_overview: true/false

=== OVERVIEW TAB RULES ===
- show_on_overview: true if the card explains the overall issue broadly
- show_on_overview: true for the single most important card on a subtopic
- show_on_overview: false for highly specific cards that assume prior context
- When in doubt: false

=== SCORING ===
- 9-10: Multiple specific numbers, percentages, dollar amounts, or comparative data
- 7-8: Clear data points that benefit from visual context
- 5-6: Some data but text is sufficient
- 1-4: No meaningful data to visualize

=== VISUAL TYPES ===
Available: "horizontal-bars", "heatmap-comparison", "wage-bars", "flow-chain", "funnel", "grouped-bars", "escalation", "scorecard-grid", "bar", "trend", "pie"
NEVER use "tiles". NEVER invent data not in the card text.

=== COLOR SEMANTICS ===
- "gold": money, budgets, the mechanism
- "red": harm, alarming outcomes
- "blue": baseline, context, normal comparison
- "green": positive contrast, what good looks like
- "lavender": who benefits, the advantaged side

Chart title must be a "So What?" headline naming the dollar amount or gap if possible.

Return ONLY a JSON array, one object per card:
[{ "cardIndex": 0, "visual_score": 9, "show_on_overview": true, "visual_config": { "type": "...", "title": "...", "data": [...] } }]

Return ONLY valid JSON array. No markdown. No explanation.`;

  try {
    const text = await anthropicFetch(visualSystem, visualPrompt, 8000);
    return parseJSON(text);
  } catch (err) {
    console.error("Visual scoring failed:", err);
    return [];
  }
};

// ── step 4: issue card scoring ────────────────────────────────────────────────

const scoreIssueCards = async (issueCards) => {
  const prompt = issueCards.map((card, i) =>
    `CARD ${i} Module: ${card.module} Tab: ${card.tab || "overview"} Title: ${card.title} Summary: ${card.summary} Details: ${card.details || ""} What's Happening: ${card.decoder?.whatsHappening || ""} Connections: ${card.decoder?.connections || ""} Who Benefits: ${card.decoder?.whoBenefits || ""} Impact: ${card.decoder?.impact || ""}`
  ).join("\n\n---\n\n");

  const system = `You score HSV Civic Watch issue cards.

Return ONLY valid JSON array. For each card return:
- cardIndex
- shock_score (1-10)
- module_relevance_score (1-10)
- homepage_teaser

Rules:
- Shock score: how alarming or stop-scrolling this card is for a general Huntsville resident with no prior context.
- Module relevance score: whether the card represents a truth about the whole module, not just a narrow side issue.
- homepage_teaser: 1-2 short punchy newsy expose-style sentences. Says what happened and why it matters. No bullet points. No labels.
- 8-10 shock: extreme disparity, named official/company, large harms, monopoly/power abuse.
- 5-7 shock: meaningful and real but not an immediate gut punch.
- 1-4 shock: background or administrative context.
- Return integers only for scores.

Format:
[{ "cardIndex": 0, "shock_score": 8, "module_relevance_score": 7, "homepage_teaser": "..." }]`;

  try {
    const text = await anthropicFetch(system, prompt, 4000);
    return parseJSON(text);
  } catch (err) {
    console.error("Issue card scoring failed:", err);
    return [];
  }
};

// ── step 5: stat block ranking ────────────────────────────────────────────────

const rankCombinedStatBlocks = async (providedBlocks, generatedBlocks) => {
  const combined = [
    ...(providedBlocks || []).map((block, idx) => ({ ...block, source_pool: "provided", candidate_index: idx })),
    ...(generatedBlocks || []).map((block, idx) => ({ ...block, source_pool: "generated", candidate_index: (providedBlocks || []).length + idx })),
  ];

  if (!combined.length) return [];

  const rankingPrompt = combined.map((block, idx) =>
    `CANDIDATE ${idx} Source Pool: ${block.source_pool} Module: ${block.module} Tab: ${block.tab || "overview"} Type: ${block.type || "unknown"} Label: ${block.label || ""} Title: ${block.title || ""} Value: ${block.value || block.annualAmount || ""} Context: ${block.context || ""}`
  ).join("\n\n---\n\n");

  const rankingSystem = `You score HSV Civic Watch stat block candidates.

Return ONLY valid JSON array. For each candidate return:
- candidate_index
- shock_score (1-10)
- module_relevance_score (1-10)

Rules:
- Shock score: how alarming or jaw-dropping this would be to a general Huntsville resident with no prior context.
- Module relevance score: how strongly this represents a truth about the whole module, not just one isolated card.
- Higher scores: direct contradictions, named officials, large dollar amounts, major disparities, harms, monopoly patterns.
- Lower scores: setup facts, administrative context, narrow details needing lots of explanation.

Format:
[{ "candidate_index": 0, "shock_score": 8, "module_relevance_score": 7 }]`;

  try {
    const text = await anthropicFetch(rankingSystem, rankingPrompt, 4000);
    const ranked = parseJSON(text);

    combined.forEach((candidate, idx) => {
      const match = ranked.find(item => item.candidate_index === idx) || {};
      candidate.strength_score = clampScore(match.shock_score || 1);
      candidate.module_relevance_score = clampScore(match.module_relevance_score || 1);
    });
  } catch (err) {
    console.error("Stat ranking failed:", err);
    combined.forEach(candidate => {
      candidate.strength_score = 1;
      candidate.module_relevance_score = 1;
    });
  }

  const grouped = {};
  combined.forEach(candidate => {
    const key = `${candidate.module || "unknown"}::${candidate.tab || "overview"}`;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(candidate);
  });

  const selected = [];
  Object.values(grouped).forEach(group => {
    group
      .sort((a, b) => {
        const aScore = (a.module_relevance_score * 0.55) + (a.strength_score * 0.45);
        const bScore = (b.module_relevance_score * 0.55) + (b.strength_score * 0.45);
        if (bScore !== aScore) return bScore - aScore;
        if (b.module_relevance_score !== a.module_relevance_score) return b.module_relevance_score - a.module_relevance_score;
        if (b.strength_score !== a.strength_score) return b.strength_score - a.strength_score;
        if (a.source_pool !== b.source_pool) return a.source_pool === "provided" ? -1 : 1;
        return 0;
      })
      .slice(0, 5)
      .forEach(candidate => {
        const { source_pool, candidate_index, generated_from_card_index, ...rest } = candidate;
        selected.push(rest);
      });
  });

  return selected;
};

// ── main handler ──────────────────────────────────────────────────────────────

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  if (!(await requireAdmin(req, res))) return;

  try {
    const { rawPaste } = req.body;
    if (!rawPaste || !rawPaste.trim()) {
      return res.status(400).json({ error: "No content provided" });
    }

    // ── 1. pre-split into chunks ──────────────────────────────────────────────
    console.log("Step 1: Pre-splitting raw paste into chunks...");
    const { chunks, issueCardCount, statBlockCount } = await preSplitChunks(rawPaste);

    const cardChunks = chunks.filter(c => c.type === "issueCard");
    const statChunks = chunks.filter(c => c.type === "statBlock");

    console.log(`Found ${cardChunks.length} issue cards and ${statChunks.length} stat blocks.`);

    if (cardChunks.length !== issueCardCount) {
      console.warn(`Pre-split count mismatch: reported ${issueCardCount} cards but found ${cardChunks.length} chunks.`);
    }

    // ── 2. batch cards into groups of CARDS_PER_BATCH ─────────────────────────
    const batches = [];
    for (let i = 0; i < cardChunks.length; i += CARDS_PER_BATCH) {
      batches.push(cardChunks.slice(i, i + CARDS_PER_BATCH));
    }

    console.log(`Step 2: Parsing ${batches.length} batch(es) of up to ${CARDS_PER_BATCH} cards in parallel...`);

    // ── 3. parse all batches in parallel ──────────────────────────────────────
    const batchResults = await Promise.all(
      batches.map((batchCardChunks) => {
        // staple stat blocks to their batch by module+tab match
        const batchModuleTabs = new Set(
          batchCardChunks.map(c => {
            const moduleMatch = c.rawText.match(/MODULE:\s*(.+)/i);
            const tabMatch = c.rawText.match(/TAB:\s*(.+)/i);
            const m = moduleMatch ? moduleMatch[1].trim().toLowerCase() : "";
            const t = tabMatch ? tabMatch[1].trim().toLowerCase() : "";
            return `${m}::${t}`;
          })
        );

        const batchStatChunks = statChunks.filter(s => {
          const moduleMatch = s.rawText.match(/MODULE:\s*(.+)/i);
          const tabMatch = s.rawText.match(/TAB:\s*(.+)/i);
          const m = moduleMatch ? moduleMatch[1].trim().toLowerCase() : "";
          const t = tabMatch ? tabMatch[1].trim().toLowerCase() : "";
          return batchModuleTabs.has(`${m}::${t}`);
        });

        return parseBatch(batchCardChunks, batchStatChunks, batchCardChunks.length);
      })
    );

    // ── 4. merge all batch results ────────────────────────────────────────────
    console.log("Step 3: Merging batch results...");
    let allCards = batchResults.flatMap(r => r.issueCards || []);
    let allStatBlocks = batchResults.flatMap(r => r.statBlocks || []);

    // safety assertion
    if (allCards.length !== cardChunks.length) {
      throw new Error(
        `Card count mismatch after merge: expected ${cardChunks.length}, got ${allCards.length}. ` +
        `Check your paste for missing or malformed — ISSUE CARD START/END — delimiters.`
      );
    }

    console.log(`Merged ${allCards.length} cards and ${allStatBlocks.length} stat blocks.`);

    // ── 5. normalize module + tab ─────────────────────────────────────────────
    allCards = allCards.map(c => ({
      ...c,
      module: normalizeModule(c.module),
      tab: normalizeTab(normalizeModule(c.module), c.tab),
    }));

    allStatBlocks = allStatBlocks.map(b => ({
      ...b,
      module: normalizeModule(b.module),
      tab: normalizeTab(normalizeModule(b.module), b.tab),
    }));

    // ── 6. parallel: visual scoring + issue scoring ───────────────────────────
    console.log("Step 4: Running visual scoring and issue scoring in parallel...");
    const [visualResults, issueScores] = await Promise.all([
      scoreVisuals(allCards),
      scoreIssueCards(allCards),
    ]);

    // apply visual results
    visualResults.forEach(result => {
      if (allCards[result.cardIndex]) {
        const inlineVisualScore = clampScore(result.visual_score || 1);
        allCards[result.cardIndex].inline_visual_score = inlineVisualScore;
        allCards[result.cardIndex].visual_score = inlineVisualScore;
        allCards[result.cardIndex].visual_config = inlineVisualScore >= 7 ? (result.visual_config || null) : null;
        allCards[result.cardIndex].show_on_overview = result.show_on_overview || false;
      }
    });

    // apply issue scores
    issueScores.forEach(result => {
      if (allCards[result.cardIndex]) {
        const shock = clampScore(result.shock_score || 1);
        const moduleRelevance = clampScore(result.module_relevance_score || 1);
        allCards[result.cardIndex].shock_score = shock;
        allCards[result.cardIndex].module_relevance_score = moduleRelevance;
        allCards[result.cardIndex].homepage_teaser = String(result.homepage_teaser || "").trim();
      }
    });

    // finalize all card scores
    allCards = allCards.map(card => {
      const shock = clampScore(card.shock_score || 1);
      const moduleRelevance = clampScore(card.module_relevance_score || 1);
      const inlineVisual = clampScore(card.inline_visual_score || card.visual_score || 1);
      return {
        ...card,
        shock_score: shock,
        module_relevance_score: moduleRelevance,
        inline_visual_score: inlineVisual,
        visual_score: inlineVisual,
        homepage_score: computeHomepageScore(shock, moduleRelevance),
        homepage_teaser: String(card.homepage_teaser || "").trim(),
      };
    });

    // ── 7. stat block ranking ─────────────────────────────────────────────────
    console.log("Step 5: Ranking stat blocks...");
    const generatedStatCandidates = buildGeneratedStatCandidates(allCards);
    const rankedStatBlocks = await rankCombinedStatBlocks(allStatBlocks, generatedStatCandidates);

    // ── 8. return ─────────────────────────────────────────────────────────────
    console.log(`Done. Returning ${allCards.length} cards and ${rankedStatBlocks.length} stat blocks.`);
    return res.status(200).json({
      issueCards: allCards,
      statBlocks: rankedStatBlocks,
    });

  } catch (error) {
    console.error("Parse failed:", error);
    return res.status(500).json({ error: "Parse failed: " + error.message });
  }
}