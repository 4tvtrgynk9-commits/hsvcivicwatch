from pathlib import Path

HSV_URL = "https://idtzqminkklydbuooilk.supabase.co"

# 1. Replace the shared Supabase client with a safe locked version.
lib = Path("src/lib/supabase.js")
lib.write_text(f'''import {{ createClient }} from "@supabase/supabase-js";

const HSV_SUPABASE_URL = "{HSV_URL}";

function cleanSupabaseUrl(value) {{
  const raw = String(value || "").trim();

  if (!raw) return HSV_SUPABASE_URL;

  const cleaned = raw
    .replace(/\\/rest\\/v1\\/?$/i, "")
    .replace(/\\/+$/g, "");

  if (/^https:\\/\\/[a-z0-9-]+\\.supabase\\.co$/i.test(cleaned)) {{
    return cleaned;
  }}

  return HSV_SUPABASE_URL;
}}

const supabaseUrl = cleanSupabaseUrl(process.env.REACT_APP_SUPABASE_URL);
const supabaseKey = String(process.env.REACT_APP_SUPABASE_ANON_KEY || "").trim();

if (!supabaseKey) {{
  // Keep this visible for debugging without exposing secrets.
  console.warn("Missing REACT_APP_SUPABASE_ANON_KEY. Supabase requests may fail.");
}}

export const supabase = createClient(supabaseUrl, supabaseKey);
export default supabase;
''', encoding="utf-8")

print("Wrote locked src/lib/supabase.js")

# 2. Patch other frontend files that create their own supabaseUrl from env.
for path in list(Path("src").rglob("*.js")) + list(Path("src").rglob("*.jsx")):
    text = path.read_text(encoding="utf-8")
    original = text

    text = text.replace(
        'const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;',
        f'const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "{HSV_URL}";'
    )

    text = text.replace(
        'const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "";',
        f'const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "{HSV_URL}";'
    )

    text = text.replace(
        'const url = process.env.REACT_APP_SUPABASE_URL;',
        f'const url = process.env.REACT_APP_SUPABASE_URL || "{HSV_URL}";'
    )

    if text != original:
        path.write_text(text, encoding="utf-8")
        print(f"Patched {path}")

print("Frontend Supabase URL fallback patch complete.")
