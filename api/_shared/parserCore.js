import { fieldStatus, filterPublicFields } from "./visibility.js";

export function cleanText(value) {
  return String(value || "").replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim();
}

export function parseBlocks(rawText, startMarker, endMarker) {
  const text = cleanText(rawText);
  const blocks = [];
  let cursor = 0;
  while (cursor < text.length) {
    const start = text.indexOf(startMarker, cursor);
    if (start === -1) break;
    const bodyStart = start + startMarker.length;
    const end = text.indexOf(endMarker, bodyStart);
    if (end === -1) { blocks.push({ body: text.slice(bodyStart).trim(), hasEnd: false }); break; }
    blocks.push({ body: text.slice(bodyStart, end).trim(), hasEnd: true });
    cursor = end + endMarker.length;
  }
  return blocks;
}

export function parseKeyValueLines(blockText) {
  const lines = cleanText(blockText).split("\n");
  const data = {};
  let currentKey = null;
  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    if (!line.trim()) continue;
    const keyMatch = line.match(/^([A-Z0-9_ \/()'.-]+):\s*(.*)$/);
    if (keyMatch) {
      currentKey = keyMatch[1].trim().toLowerCase().replace(/[\s\/()'.-]+/g, "_");
      data[currentKey] = keyMatch[2].trim();
    } else if (currentKey) {
      data[currentKey] = `${data[currentKey]}\n${line}`.trim();
    }
  }
  return data;
}

export function extractFirstUrl(text) {
  const match = String(text || "").match(/https?:\/\/[^\s)]+/i);
  return match ? match[0] : "";
}

export function parseCsv(value) {
  if (Array.isArray(value)) return value;
  return String(value || "").split(/[,;\n]/).map((v) => v.trim()).filter(Boolean);
}

export function parseBoolean(value, fallback = false) {
  if (value === true || value === false) return value;
  const normalized = String(value || "").trim().toLowerCase();
  if (!normalized) return fallback;
  return ["yes", "true", "1", "public", "visible"].includes(normalized);
}

export function parseSection(rawText, startLabel, stopLabels = []) {
  const text = cleanText(rawText);
  const start = text.indexOf(startLabel);
  if (start === -1) return "";
  const bodyStart = start + startLabel.length;
  let bodyEnd = text.length;
  for (const stopLabel of stopLabels) {
    const idx = text.indexOf(stopLabel, bodyStart);
    if (idx !== -1 && idx < bodyEnd) bodyEnd = idx;
  }
  return text.slice(bodyStart, bodyEnd).trim();
}

export function parseGenericRecordBlocks(rawText, recordName) {
  return parseBlocks(rawText, `--- ${recordName} START ---`, `--- ${recordName} END ---`).map((block, index) => ({ index, hasEnd: block.hasEnd, raw: block.body, data: parseKeyValueLines(block.body) }));
}

export function parseSourceList(sectionText) {
  return cleanText(sectionText).split("\n").map((l) => l.trim()).filter((l) => l.startsWith("-")).map((line, index) => ({ source_id: `source_inline_${String(index + 1).padStart(3, "0")}`, title: line.replace(/^-\s*/, "").trim(), url: extractFirstUrl(line), source_type: "inline", status: "active" }));
}

export function parseSourceRecords(rawText) {
  return parseGenericRecordBlocks(rawText, "SOURCE RECORD").map(({ data }, index) => ({ source_id: data.source_id || `source_${String(index + 1).padStart(3, "0")}`, title: data.title || data.source || "", url: data.url || extractFirstUrl(data.source || ""), publisher: data.publisher || "", date: data.date || "", source_type: data.source_type || "document", status: data.status || "active", raw: data }));
}

export function parseClaimRecords(rawText) {
  return parseGenericRecordBlocks(rawText, "CLAIM RECORD").map(({ data }, index) => ({ claim_id: data.claim_id || `claim_${String(index + 1).padStart(3, "0")}`, claim_text: data.claim_text || data.text || "", claim_type: data.claim_type || "general", source_ids: parseCsv(data.source_ids || data.sources || ""), support_level: data.support_level || "needs_review", public_visibility: data.public_visibility || "backend_only", status: data.status || "needs_review", raw: data }));
}

export function parseEstimateRecords(rawText) {
  return parseGenericRecordBlocks(rawText, "ESTIMATE RECORD").map(({ data }, index) => ({ estimate_id: data.estimate_id || `estimate_${String(index + 1).padStart(3, "0")}`, field_name: data.field_name || "", value: data.value || "", display_value: data.display_value || (data.value ? `Est. ${data.value}` : ""), estimate_basis: data.estimate_basis || "", source_ids: parseCsv(data.source_ids || data.sources || ""), source_notes: data.source_notes || "", confidence: data.confidence || "unknown", set_by: data.set_by || "gem", last_checked: data.last_checked || "", next_review_due: data.next_review_due || "", public_visible: parseBoolean(data.public_visible, true), raw: data }));
}

export function parseRelationshipRecords(rawText) {
  return parseGenericRecordBlocks(rawText, "RELATIONSHIP RECORD").map(({ data }, index) => ({ relationship_id: data.relationship_id || `relationship_${String(index + 1).padStart(3, "0")}`, from_entity: data.from_entity || "", relationship_type: data.relationship_type || data.type || "", to_entity: data.to_entity || "", source_ids: parseCsv(data.source_ids || data.sources || ""), support_level: data.support_level || "needs_review", public_visibility: data.public_visibility || "backend_only", status: data.status || "needs_review", raw: data }));
}

function splitIssueCardSections(body) {
  const decoder = parseSection(body, "--- DECODER ---", ["--- ACTIONS ---"]);
  const actions = parseSection(body, "--- ACTIONS ---", []);
  const top = body.split("--- DECODER ---")[0] || body;
  const topData = parseKeyValueLines(top);
  const decoderData = parseKeyValueLines(decoder);
  const sourcesText = parseSection(top, "SOURCES:", ["--- DECODER ---"]);
  return { ...topData, sources_text: sourcesText, sources: parseSourceList(sourcesText), decoder: { whatsHappening: decoderData.whats_happening || "", connections: decoderData.connections || "", whoBenefits: decoderData.who_benefits || "", impact: decoderData.impact || "" }, actions_raw: actions };
}

function toNumberMaybe(value) {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(String(value).replace(/[$,%\s,]/g, ""));
  return Number.isFinite(n) ? n : value;
}

function parseStatBlock(body) {
  const data = parseKeyValueLines(body);
  if (data.type === "key-number") data.data = { value: data.value || "", label: data.label || "", context: data.context || "" };
  else if (data.type === "comparison-bar") data.data = { title: data.title || "", leftLabel: data.left_label || "", leftValue: toNumberMaybe(data.left_value), rightLabel: data.right_label || "", rightValue: toNumberMaybe(data.right_value), unit: data.unit || "", context: data.context || "", note: data.note || "" };
  else if (data.type === "pay-clock") data.data = { label: data.label || "", annualAmount: toNumberMaybe(data.annual_amount), context: data.context || "" };
  else data.data = { ...data };
  return data;
}

function mergeSources(...lists) {
  const seen = new Set();
  const merged = [];
  for (const list of lists) for (const source of list || []) {
    const key = source.source_id || source.url || source.title;
    if (!key || seen.has(key)) continue;
    seen.add(key); merged.push(source);
  }
  return merged;
}

export function validateRecord({ workspace, draftType, payload, sources, claims }) {
  const warnings = [];
  const errors = [];
  if (!["hsv", "veritas"].includes(workspace)) errors.push(`Invalid workspace: ${workspace}`);
  const requiredByType = { hsv_issue_card: ["module", "label", "title", "summary", "details"], hsv_stat_block: ["module", "tab", "type", "color"], hsv_bright_file: ["title", "summary"], veritas_scandal_card: ["headline", "satire_body_copy"], veritas_profile: ["display_name"], veritas_weird_file: ["title", "body"], veritas_useful_fact: ["title", "body"] };
  for (const key of requiredByType[draftType] || []) if (fieldStatus(payload?.[key]) !== "present") warnings.push(`Missing or hidden public field: ${key}`);
  for (const claim of (claims || []).filter((c) => c.public_visibility === "public")) {
    if (!claim.source_ids?.length) warnings.push(`Public claim ${claim.claim_id} has no source_ids`);
    if (claim.support_level === "needs_more_research") warnings.push(`Public claim ${claim.claim_id} is marked NEEDS_MORE_RESEARCH`);
  }
  if (!sources?.length && ["hsv_issue_card", "veritas_scandal_card"].includes(draftType)) warnings.push("No sources found for public-facing record");
  return { ok: errors.length === 0, errors, warnings, publicPayload: filterPublicFields(payload || {}) };
}

export function parseStructuredPacket({ workspace, rawText }) {
  const text = cleanText(rawText);
  const packetSources = parseSourceRecords(text);
  const packetClaims = parseClaimRecords(text);
  const packetEstimates = parseEstimateRecords(text);
  const packetRelationships = parseRelationshipRecords(text);
  const drafts = [];
  if (workspace === "hsv") {
    parseBlocks(text, "--- ISSUE CARD START ---", "--- ISSUE CARD END ---").forEach((block, index) => {
      const payload = splitIssueCardSections(block.body);
      drafts.push({ workspace, draft_type: payload.content_type === "Evidence of Change" ? "hsv_bright_file" : "hsv_issue_card", title: payload.title || `HSV Issue Card ${index + 1}`, raw_text: block.body, parsed_payload: payload, source_records: mergeSources(packetSources, payload.sources || []), claim_records: packetClaims, estimate_records: packetEstimates, relationship_records: packetRelationships, has_end_marker: block.hasEnd });
    });
    parseBlocks(text, "--- STAT BLOCK START ---", "--- STAT BLOCK END ---").forEach((block, index) => {
      const payload = parseStatBlock(block.body);
      drafts.push({ workspace, draft_type: "hsv_stat_block", title: payload.label || payload.title || `HSV Stat Block ${index + 1}`, raw_text: block.body, parsed_payload: payload, source_records: packetSources, claim_records: packetClaims, estimate_records: packetEstimates, relationship_records: packetRelationships, has_end_marker: block.hasEnd });
    });
  }
  if (workspace === "veritas") {
    [["VERITAS SCANDAL CARD", "veritas_scandal_card"], ["VERITAS PROFILE", "veritas_profile"], ["VERITAS WEIRD FILE", "veritas_weird_file"], ["VERITAS USEFUL FACT", "veritas_useful_fact"]].forEach(([marker, draftType]) => {
      parseGenericRecordBlocks(text, marker).forEach((block, index) => drafts.push({ workspace, draft_type: draftType, title: block.data.headline || block.data.title || block.data.display_name || `${draftType} ${index + 1}`, raw_text: block.raw, parsed_payload: block.data, source_records: packetSources, claim_records: packetClaims, estimate_records: packetEstimates, relationship_records: packetRelationships, has_end_marker: block.hasEnd }));
    });
  }
  return { workspace, draft_count: drafts.length, drafts, packet_level: { sources: packetSources, claims: packetClaims, estimates: packetEstimates, relationships: packetRelationships } };
}
