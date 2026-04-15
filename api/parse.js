export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const { rawPaste } = req.body;
    if (!rawPaste || !rawPaste.trim()) {
      return res.status(400).json({ error: "No content provided" });
    }

    const system = `You are a structured data parser for HSV Civic Watch, a civic accountability and investigative transparency platform for Huntsville, Alabama residents.

Your ONLY job is to parse the raw formatted research text and convert it into structured JSON - preserving all content VERBATIM. Do not summarize. Do not soften. Do not rephrase. Do not editorialize. Do not omit details. Copy the text exactly as written.

=== THE THREE TONES - UNDERSTAND AND PRESERVE EACH EXACTLY ===

TONE 1 - WEBSITE OVERALL (context only, not a parsed field):
Serious. Credible. Civic. The he issue card never is.
- Connects every dot. Names every name. Follows every dollar.
- Does not raise questions - it answers them. Does not soften the answers.
- Never hedges. Never says "some critics suggest." Says: here is the money, here is who received it, here is the decision that followed, here is who paid the price.
- Everything traceable to public records. Nothing speculative. Nothing softened.
- Feels like: a prosecutor laying out a case. Every fact placed deliberately. Every connection named. By the end the reader understands not just what happened but exactly why it keeps happening and who needs it to.

Decoder field rules - apply these without exception:
- WHATS HAPPENING: The full mechanism of the problem stripped of all official language. Specific throughout. Names the entity, the dollar amount, the contradiction. No hedging.
- CONNECTIONS: The why. Donor relationships, board overlaps, revolving doors, votes against stated positions, public promises broken by documented actions. They said X. They did Y. Named. Dated. Dollared.
- WHO BENEFITS: Named individuals only. No vague categories ever. CEO names, board member names, company names, PAC names, developer names. Dollar amounts and specific stakes for each named party.
- IMPACT: Who bears the cost. Specific neighborhoods, specific populations, specific dollar losses or harms. Never abstract. Never generic.

=== CRITICAL PARSING RULES ===
- Preserve ALL text verbatim across every field. Never paraphrase, summarize, or soften under any circumstances.
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

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 8000,
        system,
        messages: [{ role: "user", content: rawPaste }],
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data?.error?.message || "Anthropic request failed" });
    }

    const text = data.content.map(i => i.text || "").join("");
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    const MODULE_NORMALIZE = {
      "policing": "policing",
      "housing": "housing_crisis",
      "housing crisis": "housing_crisis",
      "criminal justice": "criminal_justice",
      "utilities": "utilities",
      "workers": "workers_childcare",
      "workers childcare": "workers_childcare",
      "taxes": "taxation",
      "taxation": "taxation",
      "officials": "officials_elections",
      "officials elections": "officials_elections",
      "environment": "environment",
      "unhoused": "housing_crisis",
      "annexation": "landuse",
      "land": "landuse",
      "land use": "landuse",
      "transit": "housing_crisis",
      "education": "equity",
      "insurance": "insurance_burdens",
      "boards": "boards_oversight",
      "voting": "voting_rights",
      "data": "data_collection",
      "money": "money",
      "information": "information_warfare",
      "proposals": "proposals",
      "action": "action",
      "health system": "health",
      "health": "health",
      "equity": "equity",
      "worker rights": "workers_childcare",
      "workers rights": "workers_childcare",
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

    if (parsed.issueCards) {
      parsed.issueCards = parsed.issueCards.map(c => ({
        ...c,
        module: normalizeModule(c.module),
        tab: normalizeTab(normalizeModule(c.module), c.tab)
      }));
    }
    if (parsed.statBlocks) {
      parsed.statBlocks = parsed.statBlocks.map(b => ({ ...b, module: normalizeModule(b.module) }));
    }

    // === VISUAL SCORING + GENERATION ===
    if (parsed.issueCards && parsed.issueCards.length > 0) {
      const visualPrompt = parsed.issueCards.map((card, i) => {
        return `CARD ${i}:
Title: ${card.title}
Summary: ${card.summary}
Details: ${card.details || ""}
What's Happening: ${card.decoder?.whatsHappening || ""}
Connections: ${card.decoder?.connections || ""}
Who Benefits: ${card.decoder?.whoBenefits || ""}
Impact: ${card.decoder?.impact || ""}`;
      }).join("\n\n---\n\n");

      const visualSystem = `You are a data visualization advisor for HSV Civic Watch, a civic accountability platform for Huntsville, Alabama.

For each issue card:
1. Score 1-10 for how much it benefits from an inline visualization (7+ = generate visual)
2. If score >= 7, generate a visual_config JSON object
3. Decide show_on_overview: true/false

=== OVERVIEW TAB RULES ===
- show_on_overview: true if the card explains the overall issue broadly and a reader with no context benefits from seeing it first
- show_on_overview: true for the single most important card on a subtopic
- show_on_overview: false for highly specific cards that assume prior context
- When in doubt: false. Overview should be curated, not a dump.

=== SCORING ===
- 9-10: Multiple specific numbers, percentages, dollar amounts, or comparative data that tell a stronger story visually than in text
- 7-8: Clear data points that benefit from visual context
- 5-6: Some data but text is sufficient
- 1-4: No meaningful data to visualize

=== VISUAL TYPES - CHOOSE THE RIGHT ONE ===

CORE PRINCIPLE: The visual must tell the full story WITHOUT the summary text. A reader should glance at it and immediately understand what is wrong, how bad it is, and who it affects.

AVAILABLE TYPES:

1. "horizontal-bars"
   Best for: 2 or more values compared on the same scale. Budget lines, spending comparisons, any ranked or proportional data.
   Data: [{ "label": string, "value": number, "unit": "$"|"%"|"", "color": string, "context": string|null }]
   Colors: use decoder colors semantically - "gold" for money/mechanism, "red" for harm, "blue" for baseline/context, "green" for positive contrast, "lavender" for who benefits

2. "heatmap-comparison"
   Best for: North vs South, neighborhood vs neighborhood, any geographic or group disparity across multiple metrics.
   Data: [{ "metric": string, "baselineValue": number, "harmedValue": number, "unit": string, "context": string|null }]
   Also include: "baselineLabel": string (e.g. "South Huntsville")
   Harmed side auto-colors by gap severity. Baseline side is always muted gray.

3. "wage-bars"
   Best for: Wages, salaries, or any values compared against a threshold or living standard.
   Data: [{ "label": string, "value": number, "unit": string, "color": string|null }]
   Also include: "referenceValue": number, "referenceLabel": string, "referenceUnit": string

4. "flow-chain"
   Best for: How money, power, or resources move through a system. Utility chains, funding pipelines, approval chains.
   Data: [{ "label": string, "value": string|null, "fact": string|null, "color": string }]

5. "funnel"
   Best for: Processes where people or money drop off at each stage. Complaints to discipline, grants to recipients, referrals to outcomes.
   Data: [{ "label": string, "value": number, "unit": string|null, "color": string|null }]
   First item is the largest. Each subsequent item shows dropoff automatically.

6. "grouped-bars"
   Best for: Budgeted vs actual, promised vs delivered, before vs after - multiple categories each with 2+ sub-values.
   Data: [{ "category": string, "values": [{ "label": string, "value": number, "unit": string, "color": string }] }]

7. "escalation"
   Best for: Mandatory minimums, fee structures, penalty ladders - anything that escalates in severity.
   Data: [{ "trigger": string, "outcome": string, "color": string|null }]
   Colors escalate automatically if not specified.

8. "scorecard-grid"
   Best for: Comparing multiple entities across the same set of metrics. CEO pay across companies, district scores, official ratings.
   Data: [{ "entity": string, "fields": [{ "label": string, "value": string, "color": string|null }] }]

9. "bar" (vertical)
   Best for: Time series comparisons (year over year), ranked lists of 3+ items where vertical orientation reads better.
   Data: [{ "label": string, "value": number, "unit": string, "color": string }]

10. "trend"
    Best for: A single metric tracked over 4+ time points where the slope or acceleration is the story.
    Data: [{ "label": string, "value": number }]

11. "pie"
    Best for: Budget or spending breakdowns showing how a whole is divided (2-5 slices max).
    Data: [{ "label": string, "value": number }]

=== TYPE SELECTION RULES ===
- 2+ values being compared proportionally -> "horizontal-bars" (NOT "bar" which is vertical)
- Geographic or group disparity across multiple metrics -> "heatmap-comparison"
- Wages/salaries vs a threshold -> "wage-bars"
- Money/power flowing through a system -> "flow-chain"
- Process with dropoff at each stage -> "funnel"
- Budgeted vs actual, multiple categories -> "grouped-bars"
- Escalating penalties or tiers -> "escalation"
- Multiple entities, same metrics -> "scorecard-grid"
- Time series (4+ points) or ranked vertical list -> "bar"
- Single trend line, slope is the story -> "trend"
- Budget breakdown as proportion of whole -> "pie"
- NEVER use "tiles" - it is never appropriate for issue cards
- NEVER invent data not explicitly stated in the card text
- If you cannot extract at least 2 real data points, set visual_config to null

=== COLOR SEMANTICS ===
Use decoder colors to encode meaning:
- "gold": money, budgets, the mechanism, total amounts
- "red": harm, alarming outcomes, things that hurt residents  
- "blue": baseline, context, the normal or lower comparison value
- "green": positive contrast, what good looks like, best practice
- "lavender": who benefits, the advantaged side
- "muted": neutral baseline in heatmap comparisons (auto-applied)

=== CHART QUALITY ===
- Title must be a "So What?" headline - name the dollar amount or gap if possible
  GOOD: "$60M Diverted - Only $5.5M Returned to Schools"
  BAD: "TIF District Overview"
- Every bar must have its value visible
- Data must come ONLY from card content - never estimate or invent
- If the visual does not tell the story alone, score lower and skip it

Return ONLY a JSON array, one object per card:
[
  {
    "cardIndex": 0,
    "visual_score": 9,
    "show_on_overview": true,
    "visual_config": {
      "type": "horizontal-bars",
      "title": "$60M Diverted - Only $5.5M Returned to Schools",
      "data": [
        { "label": "Total TIF infrastructure funded", "value": 60000000, "unit": "$", "color": "gold", "context": "Decades of diverted school tax revenue" },
        { "label": "Directed to school capital projects", "value": 23000000, "unit": "$", "color": "blue", "context": "Lee High rebuild, Butler renovation" },
        { "label": "Returned as surplus gift", "value": 5500000, "unit": "$", "color": "red", "context": "Presented by Mayor Battle, Feb 2026" }
      ]
    }
  }
]

Return ONLY valid JSON array. No markdown. No explanation.`;

      try {
        const visualResponse = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.ANTHROPIC_API_KEY,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 4000,
            system: visualSystem,
            messages: [{ role: "user", content: visualPrompt }],
          }),
        });

        const visualData = await visualResponse.json();
        if (visualResponse.ok) {
          const visualText = visualData.content.map(i => i.text || "").join("");
          const visualClean = visualText.replace(/```json|```/g, "").trim();
          const visualResults = JSON.parse(visualClean);
          visualResults.forEach(result => {
            if (parsed.issueCards[result.cardIndex]) {
              parsed.issueCards[result.cardIndex].visual_score = result.visual_score || 0;
              parsed.issueCards[result.cardIndex].visual_config = result.visual_config || null;
              parsed.issueCards[result.cardIndex].show_on_overview = result.show_on_overview || false;
            }
          });
        }
      } catch(visualErr) {
        console.error("Visual scoring failed:", visualErr);
      }
    }

    return res.status(200).json(parsed);

  } catch (error) {
    return res.status(500).json({ error: "Parse failed: " + error.message });
  }
}
