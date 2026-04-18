import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

function buildAdminUrl() {
  const url = new URL(window.location.href);
  url.searchParams.delete("admin-reset");
  return `${url.pathname}${url.search}#admin`;
}

export default function AdminResetPassword() {
  const [checking, setChecking] = useState(true);
  const [ready, setReady] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const syncSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!active) return;
      setReady(Boolean(data.session));
      setChecking(false);

      if (data.session) {
        const url = new URL(window.location.href);
        url.searchParams.delete("code");
        url.searchParams.delete("type");
        url.searchParams.delete("access_token");
        url.searchParams.delete("refresh_token");
        url.searchParams.delete("expires_in");
        url.searchParams.delete("token_type");
        url.searchParams.set("admin-reset", "1");
        window.history.replaceState({ route: "admin-reset" }, "", `${url.pathname}${url.search}#admin-reset`);
      }
    };

    const timeoutId = window.setTimeout(syncSession, 150);
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return;
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN" || event === "INITIAL_SESSION") {
        setReady(Boolean(session));
        setChecking(false);
        setError("");
      }
    });

    return () => {
      active = false;
      window.clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, []);

  const goToAdminLogin = async () => {
    await supabase.auth.signOut();
    window.location.assign(buildAdminUrl());
  };

  const handleSubmit = async () => {
    if (!newPassword.trim()) {
      setError("Enter a new password.");
      return;
    }
    if (newPassword.length < 10) {
      setError("Use at least 10 characters for the new password.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }

    setSaving(true);
    setError("");

    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
    if (updateError) {
      setError(updateError.message || "Could not update the password.");
      setSaving(false);
      return;
    }

    setSuccess(true);
    setSaving(false);
  };

  return (
    <div style={{ minHeight:"100vh", background:"#2e3440", display:"flex", alignItems:"center", justifyContent:"center", padding:24, fontFamily:"Georgia,serif" }}>
      <div style={{ width:"100%", maxWidth:500, padding:44, background:"#353b48", border:"1px solid #4a5268", borderRadius:12, boxShadow:"0 20px 60px rgba(0,0,0,0.35)" }}>
        <div style={{ textAlign:"center", marginBottom:30 }}>
          <div style={{ color:"#b8860b", fontSize:12, fontWeight:700, letterSpacing:4, textTransform:"uppercase", marginBottom:12 }}>HSV Civic Watch</div>
          <div style={{ color:"#fff", fontSize:28, fontWeight:700, marginBottom:10 }}>Reset Admin Password</div>
          <div style={{ color:"#aaa", fontSize:15, lineHeight:1.6 }}>
            Set the password you want to use the next time you open the admin panel.
          </div>
        </div>

        {checking ? (
          <div style={{ color:"#ccc", fontSize:15, textAlign:"center", lineHeight:1.7 }}>
            Verifying your reset link...
          </div>
        ) : null}

        {!checking && !ready && !success ? (
          <div>
            <div style={{ background:"#2a0a0a", border:"1px solid #c0392b", color:"#f5b7b1", borderRadius:8, padding:"14px 16px", fontSize:14, lineHeight:1.6, marginBottom:18 }}>
              This reset link is missing, expired, or has already been used. Request a fresh reset link from the admin sign-in page.
            </div>
            <button
              onClick={goToAdminLogin}
              style={{ width:"100%", background:"#b8860b", color:"#fff", border:"none", borderRadius:6, padding:15, fontSize:15, fontWeight:700, cursor:"pointer", textTransform:"uppercase", letterSpacing:1.5 }}
            >
              Back to Admin Sign In
            </button>
          </div>
        ) : null}

        {!checking && ready && !success ? (
          <div>
            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              style={{ width:"100%", background:"#2e3440", border:"1px solid #4a5268", borderRadius:6, padding:"15px 16px", color:"#fff", fontSize:16, boxSizing:"border-box", outline:"none", marginBottom:12 }}
            />
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !saving && handleSubmit()}
              style={{ width:"100%", background:"#2e3440", border:"1px solid #4a5268", borderRadius:6, padding:"15px 16px", color:"#fff", fontSize:16, boxSizing:"border-box", outline:"none", marginBottom:12 }}
            />
            {error ? (
              <div style={{ color:"#f5b7b1", fontSize:14, lineHeight:1.6, marginBottom:14 }}>
                {error}
              </div>
            ) : null}
            <button
              onClick={handleSubmit}
              disabled={saving}
              style={{ width:"100%", background:saving ? "#6b7280" : "#1a7a3a", color:"#fff", border:"none", borderRadius:6, padding:15, fontSize:15, fontWeight:700, cursor:saving ? "not-allowed" : "pointer", textTransform:"uppercase", letterSpacing:1.5 }}
            >
              {saving ? "Saving..." : "Save New Password"}
            </button>
          </div>
        ) : null}

        {success ? (
          <div>
            <div style={{ background:"#0f2b1c", border:"1px solid rgba(26,122,58,0.4)", color:"#d7f3e0", borderRadius:8, padding:"14px 16px", fontSize:14, lineHeight:1.7, marginBottom:18 }}>
              Your admin password has been updated. Use that new password the next time you sign in, and your second factor will still be required after it.
            </div>
            <button
              onClick={goToAdminLogin}
              style={{ width:"100%", background:"#b8860b", color:"#fff", border:"none", borderRadius:6, padding:15, fontSize:15, fontWeight:700, cursor:"pointer", textTransform:"uppercase", letterSpacing:1.5 }}
            >
              Return to Admin Sign In
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
