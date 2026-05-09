const HIDDEN_VALUES = new Set([
  "", "unknown", "not found", "needs more research", "needs_more_research",
  "n/a", "na", "null", "undefined", "tbd",
]);

export function normalizeStatusValue(value) {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

export function isMissingPublicValue(value) {
  return HIDDEN_VALUES.has(normalizeStatusValue(value).toLowerCase());
}

export function isPublicVisibleValue(value) {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return !isMissingPublicValue(value);
  if (Array.isArray(value)) return value.some(isPublicVisibleValue);
  if (typeof value === "object") return Object.values(value).some(isPublicVisibleValue);
  return true;
}

export function filterPublicFields(input) {
  if (Array.isArray(input)) return input.map(filterPublicFields).filter(isPublicVisibleValue);
  if (input && typeof input === "object") {
    const output = {};
    for (const [key, value] of Object.entries(input)) {
      const filtered = filterPublicFields(value);
      if (isPublicVisibleValue(filtered)) output[key] = filtered;
    }
    return output;
  }
  return isPublicVisibleValue(input) ? input : undefined;
}

export function fieldStatus(value) {
  const normalized = normalizeStatusValue(value).toLowerCase();
  if (!normalized) return "missing";
  if (normalized === "unknown" || normalized === "not found") return "unknown";
  if (normalized === "needs more research" || normalized === "needs_more_research") return "needs_more_research";
  return "present";
}
