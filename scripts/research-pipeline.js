#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");

const MODEL = "claude-sonnet-4-20250514";
const LOCAL_URL = "http://localhost:3001/api/parse";
const PROD_URL = "https://hsvcivicwatch.vercel.app/api/parse";
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

const QA_SYSTEM = `You are a final QA and formatting agent for HSV Civic Watch, a civic accountability platform covering the full Huntsville metro area.

TONE:
- Summaries/details: investigative journalism voice. Punchy. Names names. Exposes the mechanism.
- Decoder fields: prosecutor voice. Gloves off. No hedging. Every dot connected.
- Every card should feel like something the subject did not want published.

CONTENT RULES:
- Expand acronyms on first use: TIF, HCS, HHHS, HEMSI, DAC, BCBS, NAPED
- Write UNKNOWN for any unverified field. Never invent data.
- WHO BENEFITS: named individuals only, never categories or institutions
- CONNECTIONS: must follow format exactly: They said X. They did Y.
- Voter registration link: https://myinfo.alabamavotes.gov
- Include media outlets on every card:
  WAFF 48: news@waff.com
  WAAY 31: newsroom@waaytv.com
  WHNT 19: whnt.com/contact
  AL.com: news@al.com
  WZDX 54: rocketcitynow.com/contact-us

OUTPUT: Exact parser template format only. No preamble. No explanation. No markdown outside the template.

Each issue card formatted as:

— ISSUE CARD START —
MODULE: [snake_case id]
TAB: [tab id or overview]
LABEL: [2-4 word tag]
TITLE: [headline — what happened and who did it]
SUMMARY: [2-3 sentences, investigative voice]
DETAILS: [full paragraph, dollar amounts, dates, vote records]
SOURCES:
- [Label — URL]
WHATS HAPPENING: [2-3 plain sentences, core contradiction]
CONNECTIONS: [They said X. They did Y. Names, amounts, dates.]
WHO BENEFITS: [Named individuals with dollar amounts only]
IMPACT: [Who harmed, which neighborhoods, dollar amounts]
CONTACTS:
- Name: [name and title]
- Phone: [number or UNKNOWN]
- Email: [email or UNKNOWN]
- Address: [address or UNKNOWN]
MEETINGS:
- Body: [board or council name]
- Next Meeting: [date time location or UNKNOWN]
- How to Speak: [instructions or UNKNOWN]
RECORDS REQUEST: YES/NO
COMPLAINT: YES/NO
INVESTIGATION REQUEST: YES/NO
MISCONDUCT REPORT: YES/NO
ELECTIONS: YES/NO
MEDIA OUTREACH: YES
- WAFF 48: news@waff.com
- WAAY 31: newsroom@waaytv.com
- WHNT 19: whnt.com/contact
- AL.com: news@al.com
- WZDX 54: rocketcitynow.com/contact-us
EMAIL TEMPLATE:
Subject: [subject line]
Body: [3-5 sentences, civic tone]
— ISSUE CARD END —

Each stat block formatted as:

— STAT BLOCK START —
MODULE: [snake_case id]
TAB: [tab id]
TYPE: key-number
COLOR: [gold/red/blue/green]
VALUE: [number, dollar amount, or percentage]
LABEL: [6 words max]
CONTEXT: [one sentence explaining what this number means]
— STAT BLOCK END —`;

function parseArgs(argv) {
  const args = {
    input: null,
    module: null,
    prod: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (arg === "--input") {
      args.input = argv[i + 1] || null;
      i += 1;
    } else if (arg === "--module") {
      args.module = argv[i + 1] || null;
      i += 1;
    } else if (arg === "--prod") {
      args.prod = true;
    }
  }

  return args;
}

function exitWithError(message) {
  console.error(`✗ ${message}`);
  process.exit(1);
}

function requestJson(urlString, payload, headers) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlString);
    const body = JSON.stringify(payload);
    const client = url.protocol === "https:" ? https : http;

    const req = client.request(
      {
        protocol: url.protocol,
        hostname: url.hostname,
        port: url.port || undefined,
        path: `${url.pathname}${url.search}`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(body),
          ...headers,
        },
      },
      (res) => {
        let responseBody = "";

        res.setEncoding("utf8");
        res.on("data", (chunk) => {
          responseBody += chunk;
        });
        res.on("end", () => {
          let data = null;

          if (responseBody.trim()) {
            try {
              data = JSON.parse(responseBody);
            } catch (error) {
              reject(new Error(`Invalid JSON response from ${urlString}: ${error.message}`));
              return;
            }
          }

          resolve({
            statusCode: res.statusCode || 0,
            body: data,
            rawBody: responseBody,
          });
        });
      }
    );

    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (!args.input) {
    exitWithError("Missing required --input <file>");
  }

  if (!args.module) {
    exitWithError("Missing required --module <module_id>");
  }

  if (!ANTHROPIC_API_KEY) {
    exitWithError("Add ANTHROPIC_API_KEY to .env.local");
  }

  const moduleId = args.module;
  const inputPath = path.resolve(process.cwd(), args.input);
  const parseUrl = args.prod ? PROD_URL : LOCAL_URL;

  console.log("◌ Reading input file...");
  const rawResearch = await fs.promises.readFile(inputPath, "utf8");
  console.log(`✓ Read ${rawResearch.length} characters from ${inputPath}`);

  console.log("◌ Sending research to Claude for final QA...");
  const userPrompt = `MODULE: ${moduleId}

Research from Gemini + ChatGPT passes. Apply all HSV Civic Watch content rules and format into exact parser template.

===
${rawResearch}
===`;

  const claudeResponse = await requestJson(
    "https://api.anthropic.com/v1/messages",
    {
      model: MODEL,
      max_tokens: 16000,
      system: QA_SYSTEM,
      messages: [{ role: "user", content: userPrompt }],
    },
    {
      "x-api-key": ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    }
  );

  if (claudeResponse.statusCode !== 200) {
    const message =
      claudeResponse.body?.error?.message ||
      claudeResponse.rawBody ||
      `Anthropic request failed with status ${claudeResponse.statusCode}`;
    throw new Error(message);
  }

  const formattedOutput = (claudeResponse.body?.content || [])
    .map((block) => (typeof block.text === "string" ? block.text : ""))
    .join("");

  console.log(`✓ Claude output contains ${formattedOutput.length} characters`);

  console.log("◌ Saving formatted output...");
  const outputDir = path.resolve(process.cwd(), "scripts", "output");
  await fs.promises.mkdir(outputDir, { recursive: true });

  const timestamp = new Date().toISOString();
  const outputPath = path.join(outputDir, `${moduleId}-${timestamp}.txt`);
  await fs.promises.writeFile(outputPath, formattedOutput, "utf8");
  console.log(`✓ Saved formatted output to ${outputPath}`);

  console.log(`◌ Posting formatted output to ${parseUrl}...`);
  let parserResponse;

  try {
    parserResponse = await requestJson(parseUrl, { rawPaste: formattedOutput }, {});
  } catch (error) {
    console.error(`✗ Parser POST failed: ${error.message}`);
    console.error(`Paste manually from saved file: ${outputPath}`);
    process.exit(1);
  }

  if (parserResponse.statusCode !== 200) {
    const message =
      parserResponse.body?.error ||
      parserResponse.body?.message ||
      parserResponse.rawBody ||
      `Parser returned status ${parserResponse.statusCode}`;
    console.error(`✗ Parser POST failed: ${message}`);
    console.error(`Paste manually from saved file: ${outputPath}`);
    process.exit(1);
  }

  const issueCards = Array.isArray(parserResponse.body?.issueCards)
    ? parserResponse.body.issueCards.length
    : 0;
  const statBlocks = Array.isArray(parserResponse.body?.statBlocks)
    ? parserResponse.body.statBlocks.length
    : 0;

  console.log(`✓ Uploaded ${issueCards} issue cards and ${statBlocks} stat blocks`);
  console.log("✓ Review in admin panel");
}

main().catch((error) => {
  console.error(`✗ ${error.message}`);
  process.exit(1);
});
