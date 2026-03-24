export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = req.body || {};

    const {
      prompt,
      pageTitle,
      tabLabel,
      overviewStats,
      stats,
      coreFacts,
      facts,
      connections,
      whoBenefits,
      whoPays,
      actionData,
      contacts,
      meetings,
      complaints,
      elections,
      comparisonExamples,
      extraContext,
    } = body;

    const normalized = normalizePayload({
      prompt,
      pageTitle,
      tabLabel,
      overviewStats,
      stats,
      coreFacts,
      facts,
      connections,
      whoBenefits,
      whoPays,
      actionData,
      contacts,
      meetings,
      complaints,
      elections,
      comparisonExamples,
      extraContext,
    });

    if (!normalized.hasUsableInput) {
      return res.status(400).json({ error: "Missing prompt or structured page data" });
    }

    const system = buildSystemPrompt();
    const userPrompt = buildUserPrompt(normalized);

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1200,
        system,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data?.error?.message || "Anthropic request failed",
      });
    }

    const analysis =
      data?.content?.map((block) => block.text || "").join("") ||
      "Analysis unavailable.";

    return res.status(200).json({ analysis });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
}

function normalizePayload(input) {
  const safeArray = (value) => (Array.isArray(value) ? value.filter(Boolean) : []);
  const factObjects = safeArray(input.coreFacts).concat(safeArray(input.facts));

  const factTexts = factObjects
    .map((item) => {
      if (typeof item === "string") return item;
      if (!item) return "";
      const label = item.label ? `${item.label}: ` : "";
      const text = item.text || "";
      return `${label}${text}`.trim();
    })
    .filter(Boolean);

  const statItems = safeArray(input.overviewStats).concat(safeArray(input.stats));
  const statTexts = statItems
    .map((item) => {
      if (typeof item === "string") return item;
      if (!Array.isArray(item)) return "";
      const [label, value, sublabel] = item;
      return [label, value, sublabel].filter(Boolean).join(" — ");
    })
    .filter(Boolean);

  return {
    prompt: typeof input.prompt === "string" ? input.prompt.trim() : "",
    pageTitle: typeof input.pageTitle === "string" ? input.pageTitle.trim() : "",
    tabLabel: typeof input.tabLabel === "string" ? input.tabLabel.trim() : "",
    statTexts,
    factTexts,
    connections: safeArray(input.connections),
    whoBenefits: safeArray(input.whoBenefits),
    whoPays: safeArray(input.whoPays),
    actionData: safeArray(input.actionData),
    contacts: safeArray(input.contacts),
    meetings: safeArray(input.meetings),
    complaints: safeArray(input.complaints),
    elections: safeArray(input.elections),
    comparisonExamples: safeArray(input.comparisonExamples),
    extraContext: safeArray(input.extraContext),
    hasUsableInput:
      Boolean(
        (typeof input.prompt === "string" && input.prompt.trim()) ||
          (typeof input.pageTitle === "string" && input.pageTitle.trim()) ||
          factTexts.length ||
          statTexts.length
      ),
  };
}

function buildSystemPrompt() {
  return `You are the civic explainer for Huntsville Civic Watch.

Your job is to turn approved page facts into a clear public-interest explanation for residents.

Rules:
- Use only the facts, names, and action information provided below.
- Do not invent, assume, or add outside facts.
- Do not add new allegations, names, meeting schedules, election details, or complaint routes unless they are explicitly included in the provided data.
- If something is unclear or missing, say so plainly.
- Write at about an 8th-grade reading level.
- Be concrete, direct, and easy to follow.
- Focus on power, money, public accountability, and resident impact.
- Do not use vague filler language.
- Do not use markdown tables.
- Keep the tone serious, factual, and public-facing.

Return the response using exactly these section labels:

Break it down
What's happening
The connections
Who benefits
Who pays the cost
What you can do

Extra rules for each section:
- "Break it down" should be 2-4 short sentences explaining the issue simply.
- "What's happening" should explain the larger pattern, system, or decision behind the issue.
- "The connections" should name the people, institutions, donors, boards, businesses, or agencies only if they are in the provided data, and explain how they connect.
- "Who benefits" should name who gains money, power, protection, leverage, or convenience from the current setup.
- "Who pays the cost" should say who is harmed, burdened, or exposed to the downside.
- "What you can do" should only include actions supported by the provided data. If key action information is missing, say what residents should ask for next.

Do not include bullet points unless the information becomes unreadable without them.`;
}

function buildUserPrompt(data) {
  const sections = [];

  sections.push("Use only the approved information below.");

  if (data.pageTitle) {
    sections.push(`Page: ${data.pageTitle}`);
  }

  if (data.tabLabel) {
    sections.push(`Tab: ${data.tabLabel}`);
  }

  if (data.prompt) {
    sections.push(`Page instruction: ${data.prompt}`);
  }

  if (data.statTexts.length) {
    sections.push(`Approved stats:\n${data.statTexts.map((s) => `- ${s}`).join("\n")}`);
  }

  if (data.factTexts.length) {
    sections.push(`Approved facts:\n${data.factTexts.map((f) => `- ${f}`).join("\n")}`);
  }

  if (data.connections.length) {
    sections.push(
      `Known connected people/entities:\n${data.connections.map((c) => `- ${stringifyItem(c)}`).join("\n")}`
    );
  }

  if (data.whoBenefits.length) {
    sections.push(
      `Known beneficiaries:\n${data.whoBenefits.map((b) => `- ${stringifyItem(b)}`).join("\n")}`
    );
  }

  if (data.whoPays.length) {
    sections.push(
      `Known harms / who pays the cost:\n${data.whoPays.map((p) => `- ${stringifyItem(p)}`).join("\n")}`
    );
  }

  if (data.contacts.length) {
    sections.push(
      `Official contact info:\n${data.contacts.map((c) => `- ${stringifyItem(c)}`).join("\n")}`
    );
  }

  if (data.meetings.length) {
    sections.push(
      `Meetings / public forums:\n${data.meetings.map((m) => `- ${stringifyItem(m)}`).join("\n")}`
    );
  }

  if (data.complaints.length) {
    sections.push(
      `Complaint or oversight routes:\n${data.complaints.map((c) => `- ${stringifyItem(c)}`).join("\n")}`
    );
  }

  if (data.elections.length) {
    sections.push(
      `Election information:\n${data.elections.map((e) => `- ${stringifyItem(e)}`).join("\n")}`
    );
  }

  if (data.comparisonExamples.length) {
    sections.push(
      `Examples from other cities or states:\n${data.comparisonExamples.map((c) => `- ${stringifyItem(c)}`).join("\n")}`
    );
  }

  if (data.actionData.length) {
    sections.push(
      `Other approved action data:\n${data.actionData.map((a) => `- ${stringifyItem(a)}`).join("\n")}`
    );
  }

  if (data.extraContext.length) {
    sections.push(
      `Extra context:\n${data.extraContext.map((x) => `- ${stringifyItem(x)}`).join("\n")}`
    );
  }

  sections.push(`Remember:
- If something is missing, say that clearly.
- Do not act like you independently verified anything outside this data.
- Do not add extra names, dates, schedules, challengers, or agencies unless they are listed above.`);

  return sections.join("\n\n");
}

function stringifyItem(item) {
  if (typeof item === "string") return item;
  if (!item || typeof item !== "object") return "";
  return Object.entries(item)
    .map(([key, value]) => `${key}: ${value}`)
    .join(" | ");
}
