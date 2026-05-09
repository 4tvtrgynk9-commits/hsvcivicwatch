import React, { useEffect, useMemo, useState } from "react";

const API_KEY_STORAGE = "hsv_admin_api_key";

function copyText(text) {
  if (!text) return;
  navigator.clipboard?.writeText(text);
}

function scoreLabel(row) {
  const parts = [];
  if (row.readiness_score_50 !== null && row.readiness_score_50 !== undefined) {
    parts.push(`Readiness ${row.readiness_score_50}/50`);
  }
  if (row.primary_score_50 !== null && row.primary_score_50 !== undefined) {
    parts.push(`Primary ${row.primary_score_50}/50`);
  }
  if (row.public_score_10 !== null && row.public_score_10 !== undefined) {
    parts.push(`Public ${row.public_score_10}/10`);
  }
  return parts.join(" • ") || "No score yet";
}

function Pill({ children, tone = "neutral" }) {
  return <span className={`admin-infra-pill admin-infra-pill-${tone}`}>{children}</span>;
}

function MiniCard({ title, children, actions }) {
  return (
    <div className="admin-infra-card">
      <div className="admin-infra-card-head">
        <h4>{title}</h4>
        {actions ? <div className="admin-infra-actions">{actions}</div> : null}
      </div>
      {children}
    </div>
  );
}

export default function AdminInfrastructurePanel() {
  const [apiKey, setApiKey] = useState(() => sessionStorage.getItem(API_KEY_STORAGE) || "");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [workspace, setWorkspace] = useState("hsv");

  const headers = useMemo(() => ({
    "Content-Type": "application/json",
    ...(apiKey ? { "x-admin-api-key": apiKey } : {}),
  }), [apiKey]);

  async function loadDashboard() {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin-infrastructure-dashboard", { headers });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Dashboard failed");
      setData(json);
    } catch (err) {
      setMessage(err.message || "Dashboard failed");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (apiKey) sessionStorage.setItem(API_KEY_STORAGE, apiKey);
  }, [apiKey]);

  async function generateSocialDrafts() {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/generate-social-drafts", {
        method: "POST",
        headers,
        body: JSON.stringify({
          workspace,
          dryRun: false,
          limit: workspace === "hsv" ? 1 : undefined,
          scheduled_for: new Date().toISOString(),
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Generate social drafts failed");
      setMessage(`Generated ${json.draft_count} ${workspace.toUpperCase()} social draft(s).`);
      await loadDashboard();
    } catch (err) {
      setMessage(err.message || "Generate social drafts failed");
    } finally {
      setLoading(false);
    }
  }

  async function refreshHashtags(row) {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/social-hashtag-scout", {
        method: "POST",
        headers,
        body: JSON.stringify({
          workspace: row.workspace || workspace,
          platform: "instagram",
          content_type: row.category || row.source_record_type || "social_post",
          category: row.category,
          module: row.category,
          linked_record_id: row.source_record_id,
          headline: row.share_payload?.share_title || row.source_ref || row.category,
          description: row.share_payload?.share_description || "",
          dryRun: false,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Hashtag scout failed");
      setMessage(`Hashtag Scout saved ${json.hashtag_set?.recommended_final_set?.length || 0} hashtags.`);
      await loadDashboard();
    } catch (err) {
      setMessage(`${err.message || "Hashtag scout failed"} — fallback tags may still be available while AI gateway is off.`);
    } finally {
      setLoading(false);
    }
  }

  async function updateSocialStatus(row, status) {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/update-social-draft", {
        method: "POST",
        headers,
        body: JSON.stringify({ id: row.id, status }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Update social draft failed");
      setMessage(`Marked social draft ${status}.`);
      await loadDashboard();
    } catch (err) {
      setMessage(err.message || "Update social draft failed");
    } finally {
      setLoading(false);
    }
  }

  const budget = data?.budget;
  const socialRows = data?.social_queue || [];
  const draftRows = data?.drafts || [];
  const hashtagRows = data?.hashtag_sets || [];
  const pollRows = data?.polls || [];

  return (
    <section className="admin-infra-panel">
      <style>{`
        .admin-infra-panel {
          margin: 24px 0;
          padding: 20px;
          border-radius: 18px;
          background: #f1e8db;
          border: 1px solid #d8cfbf;
          color: #193150;
          box-shadow: 0 8px 22px rgba(25,49,80,0.08);
        }
        .admin-infra-panel h2 { margin: 0 0 6px; font-size: 1.35rem; }
        .admin-infra-panel p { margin: 0 0 12px; line-height: 1.45; }
        .admin-infra-toolbar {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          align-items: center;
          margin: 14px 0;
        }
        .admin-infra-toolbar input, .admin-infra-toolbar select {
          border: 1px solid #d8cfbf;
          border-radius: 10px;
          padding: 9px 10px;
          min-height: 40px;
        }
        .admin-infra-toolbar button, .admin-infra-card button {
          border: 0;
          border-radius: 999px;
          background: #193150;
          color: white;
          padding: 9px 13px;
          cursor: pointer;
          font-weight: 700;
        }
        .admin-infra-toolbar button.secondary, .admin-infra-card button.secondary {
          background: #C6A34D;
          color: #193150;
        }
        .admin-infra-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 14px;
          margin-top: 14px;
        }
        .admin-infra-card {
          background: rgba(255,255,255,0.74);
          border: 1px solid #d8cfbf;
          border-radius: 16px;
          padding: 14px;
        }
        .admin-infra-card-head {
          display: flex;
          justify-content: space-between;
          gap: 8px;
          align-items: flex-start;
          margin-bottom: 8px;
        }
        .admin-infra-card h4 { margin: 0; font-size: 1rem; }
        .admin-infra-list {
          display: grid;
          gap: 10px;
          max-height: 440px;
          overflow: auto;
          padding-right: 4px;
        }
        .admin-infra-row {
          border-top: 1px solid #d8cfbf;
          padding-top: 9px;
        }
        .admin-infra-row:first-child { border-top: 0; padding-top: 0; }
        .admin-infra-meta { font-size: 0.82rem; color: #6b778a; margin-top: 4px; }
        .admin-infra-pill {
          display: inline-flex;
          margin: 2px 4px 2px 0;
          padding: 4px 8px;
          border-radius: 999px;
          font-size: 0.75rem;
          font-weight: 800;
          background: #d8cfbf;
        }
        .admin-infra-pill-good { background: #d7ecdE; color: #1f6b3d; }
        .admin-infra-pill-warn { background: #f3ead1; color: #7A4F00; }
        .admin-infra-pill-bad { background: #f2d2cd; color: #7A1F1A; }
        .admin-infra-actions { display: flex; flex-wrap: wrap; gap: 6px; }
        .admin-infra-actions button { font-size: .75rem; padding: 7px 9px; }
        .admin-infra-message {
          background: #193150;
          color: white;
          padding: 9px 12px;
          border-radius: 10px;
          margin-top: 10px;
        }
      `}</style>

      <h2>Admin Infrastructure Desk</h2>
      <p>
        Parser drafts, AI budget, social queue, hashtag scout, poll records, and share payloads.
        This is infrastructure only: no auto-posting, and AI remains controlled by gateway flags.
      </p>

      <div className="admin-infra-toolbar">
        <input
          type="password"
          placeholder="Admin API key if required"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          aria-label="Admin API key"
        />
        <select value={workspace} onChange={(e) => setWorkspace(e.target.value)}>
          <option value="hsv">HSV Civic Watch</option>
          <option value="veritas">Veritas Chronicle</option>
        </select>
        <button onClick={loadDashboard} disabled={loading}>
          {loading ? "Loading..." : "Refresh dashboard"}
        </button>
        <button className="secondary" onClick={generateSocialDrafts} disabled={loading}>
          Generate {workspace.toUpperCase()} social draft(s)
        </button>
      </div>

      {message ? <div className="admin-infra-message">{message}</div> : null}

      <div className="admin-infra-grid">
        <MiniCard title="AI Budget Status">
          {budget ? (
            <>
              <p><strong>${budget.estimated_spend_usd}</strong> used of <strong>${budget.monthly_budget_usd}</strong></p>
              <p><strong>${budget.remaining_usd}</strong> remaining</p>
              <Pill tone={budget.gateway_enabled ? "warn" : "good"}>
                AI Gateway: {budget.gateway_enabled ? "ON" : "OFF"}
              </Pill>
            </>
          ) : <p>Refresh dashboard to load budget.</p>}
        </MiniCard>

        <MiniCard title="Draft Records">
          <div className="admin-infra-list">
            {draftRows.length ? draftRows.map((row) => (
              <div className="admin-infra-row" key={row.id}>
                <strong>{row.title || row.draft_type}</strong>
                <div className="admin-infra-meta">{row.workspace} • {row.draft_type} • {row.status}</div>
                <div className="admin-infra-meta">{scoreLabel(row)}</div>
                {row.needs_review ? <Pill tone="warn">Needs review</Pill> : <Pill tone="good">Parsed</Pill>}
              </div>
            )) : <p>No draft records loaded.</p>}
          </div>
        </MiniCard>

        <MiniCard title="Social Queue">
          <div className="admin-infra-list">
            {socialRows.length ? socialRows.map((row) => {
              const caption = row.platform_captions?.instagram || "";
              const tags = row.hashtags?.recommended_final_set || [];
              return (
                <div className="admin-infra-row" key={row.id}>
                  <strong>{row.share_payload?.share_title || row.category}</strong>
                  <div className="admin-infra-meta">{row.workspace} • {row.category} • {row.status}</div>
                  <div className="admin-infra-actions">
                    <button onClick={() => copyText(caption)}>Copy caption</button>
                    <button onClick={() => copyText(tags.join(" "))}>Copy hashtags</button>
                    <button onClick={() => copyText(row.share_payload?.email_body || "")}>Copy email</button>
                    <button onClick={() => refreshHashtags(row)}>Refresh hashtags</button>
                    <button onClick={() => updateSocialStatus(row, "posted")}>Posted</button>
                    <button onClick={() => updateSocialStatus(row, "skipped")}>Skip</button>
                  </div>
                </div>
              );
            }) : <p>No social drafts yet.</p>}
          </div>
        </MiniCard>

        <MiniCard title="Latest Hashtag Sets">
          <div className="admin-infra-list">
            {hashtagRows.length ? hashtagRows.map((row) => (
              <div className="admin-infra-row" key={row.id}>
                <strong>{row.workspace} • {row.content_type || row.scope}</strong>
                <div className="admin-infra-meta">{(row.recommended_final_set || []).join(" ")}</div>
                {row.reasoning_summary ? <div className="admin-infra-meta">{row.reasoning_summary}</div> : null}
                <button onClick={() => copyText((row.recommended_final_set || []).join(" "))}>Copy set</button>
              </div>
            )) : <p>No hashtag sets yet.</p>}
          </div>
        </MiniCard>

        <MiniCard title="Poll Records">
          <div className="admin-infra-list">
            {pollRows.length ? pollRows.map((row) => (
              <div className="admin-infra-row" key={row.id}>
                <strong>{row.question}</strong>
                <div className="admin-infra-meta">{row.workspace} • {row.poll_type} • {row.status}</div>
                <div className="admin-infra-meta">{row.option_a} / {row.option_b}</div>
              </div>
            )) : <p>No poll records yet.</p>}
          </div>
        </MiniCard>
      </div>
    </section>
  );
}
