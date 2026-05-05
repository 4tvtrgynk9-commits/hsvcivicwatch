const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const MODULE_MAP = {
  EQ: "equity", UT: "utilities", HS: "health", IN: "insurance_burdens",
  WK: "workers_childcare", TX: "taxation", HO: "housing_crisis",
  OF: "officials_elections", BO: "boards_oversight", VT: "voting_rights",
  CJ: "criminal_justice", PO: "policing", DA: "data_collection",
  MO: "money", LA: "landuse", EN: "environment", IW: "information_warfare",
  PR: "proposals", AC: "action",
};

function getModuleFromRef(ref) {
  if (!ref) return null;
  const prefix = ref.split("-")[0].toUpperCase();
  return MODULE_MAP[prefix] || null;
}

function slugify(name) {
  return String(name || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

module.exports = async function handler(req, res) {
  const url = req.url || "";
  const base = "https://hsvcivicwatch.org";

  // /c/:ref — issue card deep link
  const cardMatch = url.match(/^\/c\/([^?#]+)/);
  if (cardMatch) {
    const ref = decodeURIComponent(cardMatch[1]);
    const module = getModuleFromRef(ref);
    if (module) {
      return res.redirect(302, `${base}/#${module}?card=${encodeURIComponent(ref)}`);
    }
    // fallback — look up in Supabase
    const { data } = await supabase
      .from("issue_cards")
      .select("module, ref_number")
      .eq("ref_number", ref)
      .single();
    if (data?.module) {
      return res.redirect(302, `${base}/#${data.module}?card=${encodeURIComponent(ref)}`);
    }
    return res.redirect(302, base);
  }

  // /p/:slug — profile deep link
  const profileMatch = url.match(/^\/p\/([^?#]+)/);
  if (profileMatch) {
    const slug = decodeURIComponent(profileMatch[1]);
    // Look up profile by name slug
    const { data: profiles } = await supabase
      .from("official_profiles")
      .select("id, name")
      .order("name");
    const match = (prof| []).find(p => slugify(p.name) === slug);
    if (match) {
      return res.redirect(302, `${base}/#officials_elections?profile=${encodeURIComponent(match.id)}`);
    }
    return res.redirect(302, `${base}/#officials_elections`);
  }

  return res.redirect(302, base);
};
