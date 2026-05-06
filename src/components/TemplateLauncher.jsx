export function buildMailto(template) {
  if (!template || !template.email) return null;
  const params = [];
  if (template.subject) params.push(`subject=${encodeURIComponent(template.subject)}`);
  if (template.body) params.push(`body=${encodeURIComponent(template.body)}`);
  return `mailto:${template.email}${params.length ? "?" + params.join("&") : ""}`;
}
