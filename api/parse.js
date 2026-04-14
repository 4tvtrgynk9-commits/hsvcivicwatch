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
  
  Your ONLY job is to parse the raw formatted research text and convert it into structured JSON — preserving all content VERBATIM. Do not summarize. Do not soften. Do not rephrase. Do not editorialize. Do not omit details. Copy the text exactly as written.
  
  === THE THREE TONES — UNDERSTAND AND PRESERVE EACH EXACTLY ===
  
  TONE 1 — WEBSITE OVERALL (context only, not a parsed field):
  Serious. Credible. Civic. The editorial voice of an investigative newsroom focused on one metro area. Clean and authoritative. Earns trust before it earns outrage. Everything else is built on this foundation.
  
  TONE 2 — ISSUE CARD (title, summary, details fields):
  Investigative journalism. The opening of a newspaper exposé. Punchy. Newsy. Skeptical by default.
  - Names names and drops striking facts but does not connect every dot.
  - Raises the question without answering it. Makes the reader feel something is off without telling them exactly who is behind it.
  - Never sensational. Pointed because the facts are pointed, not because the writer is editorializing.
  - The reader finishes and wants more. That wanting drives them to hit Decode This.
  - Feels like: a reporter just handed you a document and said "you should probably read this."
  
  TONE 3 — DECODER (whatsHappening, connections, whoBenefits, impact fields):
  This is where the gloves come off — factually. The full investigation.
  - Direct, sharp, and explicit in a way the issue card never is.
  - Connects every dot. Names every name. Follows every dollar.
  - Does not raise questions — it answers them. Does not soften the answers.
  - Never hedges. Never says "some critics suggest." Says: here is the money, here is who received it, here is the decision that followed, here is who paid the price.
  - Everything traceable to public records. Nothing speculative. Nothing softened.
  - Feels like: a prosecutor laying out a case. Every fact placed deliberately. Every connection named. By the end the reader understands not just what happened but exactly why it keeps happening and who needs it to.
  
  Decoder field rules — apply these without exception:
  - WHATS HAPPENING → whatsHappening: The full mechanism of the problem stripped of all official language. Specific throughout. Names the entity, the dollar amount, the contradiction. No hedging.
  - CONNECTIONS → connections: The why. Donor relationships, board overlaps, revolving doors, votes against stated positions, public promises broken by documented actions. They said X. They did Y. Named. Dated. Dollared.
  - WHO BENEFITS → whoBenefits: Named individuals only. No vague categories ever. CEO names, board member names, company names, PAC names, developer names. Dollar amounts and specific stakes for each named party.
  - IMPACT → impact: Who bears the cost. Specific neighborhoods, specific populations, specific dollar losses or harms. Never abstract. Never generic.
  
  === CRITICAL PARSING RULES ===
  - Preserve ALL text verbatim across every field. Never paraphrase, summarize, or soften under any circumstances.
  - The decoder fields especially must be copied exactly — do not condense them, do not smooth their tone, do not remove names or dollar amounts.
  - UNKNOWN values → store as null.
  - If APPLIES is NO → set applies: false, all other fields null.
  - mediaOutreach → parse the 5 Huntsville outlets exactly as written in the template.
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
        return res.status(response.status).json({
          error: data?.error?.message || "Anthropic request failed",
        });
      }
  
      const text = data.content.map(i => i.text || "").join("");
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);

      // Normalize module names to snake_case IDs matching Supabase
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
      };

      // Tab label normalization map per module
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
        policing: {
          "hpd": "hpd", "madison county sheriff": "sheriff", "sheriff": "sheriff",
        },
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
          "executive compensation": "exec_compensation", "ceo pay": "exec_compensation",
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

        const visualSystem = `You are a data visualization advisor for HSV Civic Watch, a civic accountability platform.

For each issue card, you must:
1. Score it 1-10 for how much it would benefit from an inline data visualization (7+ = generate a visual)
2. If score >= 7, generate a visual_config JSON object for that card

Scoring criteria:
- 9-10: Card has multiple specific numbers, percentages, dollar amounts, or comparative data that tell a stronger story visually than in text
- 7-8: Card has clear data points that would benefit from visual context
- 5-6: Some data but text is sufficient
- 1-4: No meaningful data to visualize

Visual config rules:
CORE PRINCIPLE: The visual must tell the full story WITHOUT the summary text. A reader should glance at the graphic and immediately understand what is wrong, how bad it is, and who it affects. If the visual does not do that alone, choose a different type or score lower.

Available types: "bar", "trend", "comparison", "tiles", "pie"

TYPE SELECTION RULES (follow in order):
1. Year-over-year or time-series data (3+ time points): DEFAULT to "bar" (vertical columns per year/period). Bars show dramatic jumps far better than trend lines. Only use "trend" if the slope shape itself is the story (e.g. an accelerating curve).
2. Exactly 2 values being compared (CEO vs worker, north vs south, before vs after): Use "comparison" (horizontal bars side by side). This is the DEFAULT for two-value contrasts. The gap should be visually shocking.
3. 3+ named entities being compared (multiple salaries, multiple cities, multiple budget lines): Use "bar".
4. 1-2 standalone shocking numbers with no pattern to show: Use "tiles". Only use tiles when the raw number is more powerful than any chart.
5. Budget or spending breakdown (how a whole is divided): Use "pie".
6. When in doubt: DEFAULT to "bar" or "comparison". Never default to "trend" or "tiles".

COLOR RULES:
- red: alarming data, bad outcomes, things that harm residents
- gold: money, budgets, costs, dollar amounts
- blue: baseline comparison, the "normal" or lower value in a comparison
- green: positive contrast, best-practice comparison, what things should look like
- In comparisons: the worse/higher/more alarming value = red, the baseline or contrast = blue

CHART QUALITY RULES:
- Every bar must have its value label shown directly on or above the bar
- Title must be punchy and specific — name the dollar amount or percentage if possible (e.g. "BCBS Premiums: $310 to $490 in 4 Years" not "Premium Increases")
- Data must come ONLY from the card content — never invent or estimate numbers
- All values must be explicitly stated in the card text
- If you cannot extract at least 2 real data points from the card text, set visual_config to null

Return ONLY a JSON array with one object per card, in order:
[
  {
    "cardIndex": 0,
    "visual_score": 8,
    "visual_config": {
      "type": "comparison",
      "title": "CEO Pay vs. CNA Starting Wage",
      "data": [
        { "label": "CEO David Spillers", "value": 4200000, "unit": "$", "color": "red" },
        { "label": "CNA Starting Wage", "value": 30160, "unit": "$", "color": "blue" }
      ]
    }
  },
  {
    "cardIndex": 1,
    "visual_score": 4,
    "visual_config": null
  }
]

For "trend" type, data should be: [{ "label": "2022", "value": 310, "unit": "$" }, ...]
For "bar" type, data should be: [{ "label": "name", "value": number, "unit": "$" or "%" }, ...]
For "tiles" type, data should be: [{ "label": "LABEL", "value": "display value", "context": "short note", "color": "red|gold|blue|green|lavender" }, ...]
For "pie" type, data should be: [{ "label": "slice name", "value": number }, ...]
For "comparison" type, data should be exactly 2 items.

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
              }
            });
          }
        } catch(visualErr) {
          console.error("Visual scoring failed:", visualErr);
          // Non-fatal — cards still publish without visuals
        }
      }

      return res.status(200).json(parsed);
  
    } catch (error) {
      return res.status(500).json({ error: "Parse failed: " + error.message });
    }
  }