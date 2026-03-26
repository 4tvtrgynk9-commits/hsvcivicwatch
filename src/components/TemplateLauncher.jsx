export function buildMailto(template) {
  if (!template || !template.email) return null;
  const subject = encodeURIComponent(template.subject || "");
  const body = encodeURIComponent(template.body || "");
  return `mailto:${template.email}?subject=${subject}&body=${body}`;
}