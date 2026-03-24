export async function callAI(prompt){
  try{
    const r = await fetch("/api/analyze", {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ prompt })
    });
    const d = await r.json();
    if(!r.ok) throw new Error(d.error || "Request failed");
    return d.analysis || "Analysis unavailable.";
  }catch(e){
    return "Analysis unavailable — please try again.";
  }
}
