import { useState } from "react";

const API = "/api/claude";

async function callClaude(system, user, maxTokens = 800) {
  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-5",
      max_tokens: maxTokens,
      system,
      messages: [{ role: "user", content: user }],
    }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data.content[0].text;
}

function Spinner() {
  return (
    <span style={{
      display: "inline-block", width: 14, height: 14,
      border: "2px solid rgba(180,160,120,0.3)", borderTopColor: "#8B6914",
      borderRadius: "50%", animation: "spin 0.7s linear infinite", flexShrink: 0,
    }} />
  );
}

function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
      style={{
        background: "transparent", color: copied ? "#166534" : "#9ca3af",
        border: `1px solid ${copied ? "#bbf7d0" : "#e5e7eb"}`,
        borderRadius: 5, padding: "3px 9px", fontSize: 11, fontWeight: 600,
        cursor: "pointer", letterSpacing: 0.3, transition: "all 0.15s",
      }}>
      {copied ? "✓ COPIED" : "COPY"}
    </button>
  );
}

function Pill({ label, type = "neutral" }) {
  const styles = {
    neutral: { bg: "#f3f0e8", color: "#6b5c3e" },
    green: { bg: "#dcfce7", color: "#166534" },
    amber: { bg: "#fef9c3", color: "#854d0e" },
    red: { bg: "#fee2e2", color: "#991b1b" },
    blue: { bg: "#dbeafe", color: "#1e40af" },
    teal: { bg: "#ccfbf1", color: "#115e59" },
    purple: { bg: "#ede9fe", color: "#5b21b6" },
  };
  const s = styles[type] || styles.neutral;
  return (
    <span style={{
      fontSize: 11, fontWeight: 600, padding: "2px 9px", borderRadius: 4,
      background: s.bg, color: s.color, letterSpacing: 0.4, whiteSpace: "nowrap",
    }}>{label}</span>
  );
}

const TABS = [
  { id: "discover", label: "Partner Discovery", sub: "Find the right partners" },
  { id: "score", label: "Fit Scorer", sub: "Evaluate strategic alignment" },
  { id: "brief", label: "Partnership Brief", sub: "One-pager for any partner" },
  { id: "pitch", label: "Co-Sell Pitch", sub: "Joint value proposition" },
];

export default function PartnerOS() {
  const [tab, setTab] = useState("discover");

  // Discovery
  const [discProduct, setDiscProduct] = useState("");
  const [discCategory, setDiscCategory] = useState("");
  const [discResult, setDiscResult] = useState(null);
  const [loadingDisc, setLoadingDisc] = useState(false);

  // Fit Scorer
  const [fitYours, setFitYours] = useState("");
  const [fitPartner, setFitPartner] = useState("");
  const [fitResult, setFitResult] = useState(null);
  const [loadingFit, setLoadingFit] = useState(false);

  // Partnership Brief
  const [briefYours, setBriefYours] = useState("");
  const [briefPartner, setBriefPartner] = useState("");
  const [briefGoal, setBriefGoal] = useState("");
  const [briefResult, setBriefResult] = useState(null);
  const [loadingBrief, setLoadingBrief] = useState(false);

  // Co-Sell Pitch
  const [pitchYours, setPitchYours] = useState("");
  const [pitchPartner, setPitchPartner] = useState("");
  const [pitchSegment, setPitchSegment] = useState("");
  const [pitchResult, setPitchResult] = useState(null);
  const [loadingPitch, setLoadingPitch] = useState(false);

  async function runDiscover() {
    if (!discProduct.trim()) return;
    setLoadingDisc(true); setDiscResult(null);
    try {
      const raw = await callClaude(
        `You are a senior partnerships strategist. Given a product and category, identify 4 high-value partner archetypes. Return ONLY valid JSON: { "ecosystem_theme": "one sentence on the partnership strategy", "archetypes": [ { "type": "Tech Integration/Channel/Co-sell/Reseller", "archetype_name": "short name e.g. CRM Platforms", "why": "specific strategic reason", "examples": ["Company A", "Company B", "Company C"], "revenue_potential": "High/Medium/Low", "effort": "High/Medium/Low", "first_move": "concrete first action to pursue this" } ] }`,
        `Product: ${discProduct}\nPartnership category focus: ${discCategory || "all types"}`,
        900
      );
      setDiscResult(JSON.parse(raw.replace(/```json|```/g, "").trim()));
    } catch (e) { setDiscResult({ error: e.message }); }
    setLoadingDisc(false);
  }

  async function runFit() {
    if (!fitYours.trim() || !fitPartner.trim()) return;
    setLoadingFit(true); setFitResult(null);
    try {
      const raw = await callClaude(
        `You are a partnerships strategist evaluating strategic fit. Return ONLY valid JSON: { "overall_score": 0-100, "verdict": "Strong/Moderate/Weak fit", "dimensions": [ { "name": "dimension name", "score": 0-100, "insight": "one sentence" } ], "biggest_opportunity": "one sentence", "biggest_risk": "one sentence", "recommended_structure": "what kind of partnership structure works best here", "next_step": "the single most important next action" }. Include 4 dimensions: Audience Overlap, Revenue Alignment, Product Complementarity, Strategic Timing.`,
        `Our company/product: ${fitYours}\nPotential partner: ${fitPartner}`,
        800
      );
      setFitResult(JSON.parse(raw.replace(/```json|```/g, "").trim()));
    } catch (e) { setFitResult({ error: e.message }); }
    setLoadingFit(false);
  }

  async function runBrief() {
    if (!briefYours.trim() || !briefPartner.trim()) return;
    setLoadingBrief(true); setBriefResult(null);
    try {
      const raw = await callClaude(
        `You are a partnerships director writing an internal one-pager. Return ONLY valid JSON: { "headline": "partnership name/title", "executive_summary": "2 sentences max", "the_opportunity": "what market gap this addresses", "what_we_bring": ["point 1", "point 2", "point 3"], "what_they_bring": ["point 1", "point 2", "point 3"], "joint_customer_profile": "who benefits most from this partnership", "success_metrics": ["metric 1", "metric 2", "metric 3"], "proposed_structure": "how the partnership works operationally", "timeline": "suggested milestones for first 90 days" }`,
        `Our company: ${briefYours}\nPartner: ${briefPartner}\nPartnership goal: ${briefGoal || "grow revenue and expand market reach"}`,
        900
      );
      setBriefResult(JSON.parse(raw.replace(/```json|```/g, "").trim()));
    } catch (e) { setBriefResult({ error: e.message }); }
    setLoadingBrief(false);
  }

  async function runPitch() {
    if (!pitchYours.trim() || !pitchPartner.trim()) return;
    setLoadingPitch(true); setPitchResult(null);
    try {
      const raw = await callClaude(
        `You are a partnerships strategist building a joint go-to-market pitch. Return ONLY valid JSON: { "joint_tagline": "one punchy line for the combined offering", "combined_value_prop": "2 sentences on what customers get together that they can't get separately", "target_segment": "specific customer profile to lead with", "key_messages": ["message 1", "message 2", "message 3"], "objection_responses": [ { "objection": "common objection", "response": "how to handle it" }, { "objection": "second objection", "response": "how to handle it" } ], "pilot_proposal": "how to structure a 30-day co-sell pilot", "talk_track": "opening line for a joint customer call" }`,
        `Our company: ${pitchYours}\nPartner: ${pitchPartner}\nTarget customer segment: ${pitchSegment || "mid-market B2B SaaS companies"}`,
        900
      );
      setPitchResult(JSON.parse(raw.replace(/```json|```/g, "").trim()));
    } catch (e) { setPitchResult({ error: e.message }); }
    setLoadingPitch(false);
  }

  const scoreColor = (s) => s >= 70 ? "green" : s >= 45 ? "amber" : "red";
  const scoreHex = (s) => s >= 70 ? "#166534" : s >= 45 ? "#854d0e" : "#991b1b";
  const scoreBg = (s) => s >= 70 ? "#dcfce7" : s >= 45 ? "#fef9c3" : "#fee2e2";
  const effortColor = (e) => e === "Low" ? "green" : e === "Medium" ? "amber" : "red";
  const revColor = (r) => r === "High" ? "green" : r === "Medium" ? "teal" : "neutral";

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif", maxWidth: 980, margin: "0 auto", background: "#faf8f4", minHeight: "100vh", paddingBottom: 60 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Lora:wght@600&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadein { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        * { box-sizing: border-box; }
        textarea, input[type="text"] {
          font-family: inherit; font-size: 14px;
          border: 1.5px solid #e8e0d0; border-radius: 8px;
          padding: 10px 12px; width: 100%; background: white;
          color: #2d1f0e; outline: none; resize: vertical; transition: border 0.15s;
        }
        textarea:focus, input[type="text"]:focus { border-color: #8B6914; box-shadow: 0 0 0 3px rgba(139,105,20,0.08); }
        .run-btn {
          background: #2d1f0e; color: #f5f0e8; border: none; border-radius: 8px;
          padding: 11px 22px; font-size: 13px; font-weight: 700; cursor: pointer;
          display: inline-flex; align-items: center; gap: 8px; letter-spacing: 0.3px;
          transition: background 0.15s; font-family: inherit;
        }
        .run-btn:hover { background: #3d2f1e; }
        .run-btn:disabled { background: #c4b89a; cursor: not-allowed; }
        .pcard { background: white; border: 1.5px solid #ede6d8; border-radius: 12px; padding: 20px; }
        .anim { animation: fadein 0.25s ease; }
        .tab-btn { cursor: pointer; border: none; background: transparent; font-family: inherit; transition: all 0.15s; }
        label { font-size: 11px; font-weight: 700; color: #9c8060; letter-spacing: 0.8px; display: block; margin-bottom: 6px; }
        .arch-card:hover { border-color: #c4a96b !important; }
      `}</style>

      {/* Header */}
      <div style={{ background: "#faf8f4", borderBottom: "1.5px solid #ede6d8", padding: "20px 28px 0" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "#2d1f0e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🤝</div>
            <div>
              <div style={{ fontFamily: "'Lora', serif", fontWeight: 600, fontSize: 20, color: "#2d1f0e", letterSpacing: -0.3 }}>PartnerOS</div>
              <div style={{ fontSize: 11, color: "#9c8060", fontWeight: 600, letterSpacing: 0.8 }}>AI PARTNERSHIP INTELLIGENCE</div>
            </div>
          </div>
          <div style={{ fontSize: 12, color: "#9c8060", fontWeight: 500 }}>Powered by Claude AI</div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 2 }}>
          {TABS.map(t => (
            <button key={t.id} className="tab-btn" onClick={() => setTab(t.id)}
              style={{
                padding: "10px 20px 12px",
                borderBottom: tab === t.id ? "2px solid #8B6914" : "2px solid transparent",
                color: tab === t.id ? "#2d1f0e" : "#9c8060",
              }}>
              <div style={{ fontSize: 13, fontWeight: tab === t.id ? 700 : 500 }}>{t.label}</div>
              <div style={{ fontSize: 10, color: tab === t.id ? "#8B6914" : "#c4b89a", fontWeight: 500, marginTop: 1 }}>{t.sub}</div>
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: "28px 28px 0" }}>

        {/* PARTNER DISCOVERY */}
        {tab === "discover" && (
          <div style={{ maxWidth: 760 }}>
            <div style={{ marginBottom: 22 }}>
              <div style={{ fontFamily: "'Lora', serif", fontWeight: 600, fontSize: 18, color: "#2d1f0e", marginBottom: 4 }}>Map your partnership ecosystem</div>
              <div style={{ fontSize: 13, color: "#9c8060" }}>Describe what you sell and get 4 high-value partner archetypes ranked by revenue potential and effort.</div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
              <div>
                <label>YOUR PRODUCT / COMPANY</label>
                <input type="text" value={discProduct} onChange={e => setDiscProduct(e.target.value)} placeholder="e.g. AI workflow automation for RevOps teams" />
              </div>
              <div>
                <label>PARTNERSHIP FOCUS (optional)</label>
                <input type="text" value={discCategory} onChange={e => setDiscCategory(e.target.value)} placeholder="e.g. tech integrations, channel, co-sell..." />
              </div>
            </div>

            <button className="run-btn" onClick={runDiscover} disabled={loadingDisc || !discProduct.trim()}>
              {loadingDisc ? <><Spinner /> Mapping ecosystem...</> : "Map Partner Ecosystem →"}
            </button>

            {discResult && !discResult.error && (
              <div className="anim" style={{ marginTop: 24 }}>
                <div style={{ background: "#2d1f0e", borderRadius: 10, padding: "12px 18px", marginBottom: 18, display: "flex", gap: 10, alignItems: "center" }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#9c8060", letterSpacing: 0.8 }}>ECOSYSTEM STRATEGY</span>
                  <span style={{ fontSize: 13, color: "#f5f0e8" }}>{discResult.ecosystem_theme}</span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  {(discResult.archetypes || []).map((a, i) => (
                    <div key={i} className="pcard arch-card" style={{ transition: "border-color 0.15s", borderTop: "3px solid #8B6914" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                        <div>
                          <div style={{ fontSize: 11, fontWeight: 700, color: "#9c8060", letterSpacing: 0.8, marginBottom: 3 }}>{a.type}</div>
                          <div style={{ fontWeight: 700, fontSize: 15, color: "#2d1f0e" }}>{a.archetype_name}</div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end" }}>
                          <Pill label={`${a.revenue_potential} revenue`} type={revColor(a.revenue_potential)} />
                          <Pill label={`${a.effort} effort`} type={effortColor(a.effort)} />
                        </div>
                      </div>

                      <div style={{ fontSize: 13, color: "#5c4a2e", lineHeight: 1.55, marginBottom: 12 }}>{a.why}</div>

                      <div style={{ marginBottom: 12 }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: "#9c8060", letterSpacing: 0.8, marginBottom: 6 }}>EXAMPLE COMPANIES</div>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                          {(a.examples || []).map((ex, j) => (
                            <span key={j} style={{ fontSize: 12, background: "#f3f0e8", color: "#5c4a2e", padding: "2px 8px", borderRadius: 4, fontWeight: 500 }}>{ex}</span>
                          ))}
                        </div>
                      </div>

                      <div style={{ background: "#faf8f4", borderRadius: 8, padding: "10px 12px" }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: "#8B6914", letterSpacing: 0.8, marginBottom: 4 }}>FIRST MOVE</div>
                        <div style={{ fontSize: 13, color: "#2d1f0e" }}>{a.first_move}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* FIT SCORER */}
        {tab === "score" && (
          <div style={{ maxWidth: 720 }}>
            <div style={{ marginBottom: 22 }}>
              <div style={{ fontFamily: "'Lora', serif", fontWeight: 600, fontSize: 18, color: "#2d1f0e", marginBottom: 4 }}>Score partnership fit</div>
              <div style={{ fontSize: 13, color: "#9c8060" }}>Evaluate a specific partner across 4 strategic dimensions — get a fit score, risk flags, and a recommended structure.</div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
              <div>
                <label>YOUR COMPANY / PRODUCT</label>
                <textarea rows={2} value={fitYours} onChange={e => setFitYours(e.target.value)} placeholder="e.g. Notion — productivity platform, 20M users, strong SMB and enterprise base..." />
              </div>
              <div>
                <label>POTENTIAL PARTNER</label>
                <textarea rows={2} value={fitPartner} onChange={e => setFitPartner(e.target.value)} placeholder="e.g. Zapier — automation platform, 6M users, serves same SMB audience..." />
              </div>
            </div>

            <button className="run-btn" onClick={runFit} disabled={loadingFit || !fitYours.trim() || !fitPartner.trim()}>
              {loadingFit ? <><Spinner /> Scoring fit...</> : "Score Partnership Fit →"}
            </button>

            {fitResult && !fitResult.error && (
              <div className="anim" style={{ marginTop: 24 }}>
                {/* Score header */}
                <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 20 }}>
                  <div style={{ width: 80, height: 80, borderRadius: "50%", background: scoreBg(fitResult.overall_score), display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", border: `3px solid ${scoreHex(fitResult.overall_score)}` }}>
                    <div style={{ fontWeight: 800, fontSize: 24, color: scoreHex(fitResult.overall_score), lineHeight: 1 }}>{fitResult.overall_score}</div>
                    <div style={{ fontSize: 10, color: scoreHex(fitResult.overall_score), fontWeight: 600 }}>/ 100</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Lora', serif", fontWeight: 600, fontSize: 20, color: "#2d1f0e" }}>{fitResult.verdict}</div>
                    <div style={{ fontSize: 13, color: "#9c8060", marginTop: 2 }}>Recommended: {fitResult.recommended_structure}</div>
                  </div>
                </div>

                {/* Dimensions */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                  {(fitResult.dimensions || []).map((d, i) => (
                    <div key={i} className="pcard">
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "#5c4a2e" }}>{d.name}</div>
                        <Pill label={`${d.score}/100`} type={scoreColor(d.score)} />
                      </div>
                      <div style={{ height: 4, background: "#ede6d8", borderRadius: 2, marginBottom: 8 }}>
                        <div style={{ height: 4, width: `${d.score}%`, background: scoreHex(d.score), borderRadius: 2, transition: "width 0.6s ease" }} />
                      </div>
                      <div style={{ fontSize: 12, color: "#9c8060", lineHeight: 1.5 }}>{d.insight}</div>
                    </div>
                  ))}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                  <div style={{ background: "#dcfce7", borderRadius: 10, padding: 14 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "#166534", letterSpacing: 0.8, marginBottom: 6 }}>BIGGEST OPPORTUNITY</div>
                    <div style={{ fontSize: 13, color: "#14532d" }}>{fitResult.biggest_opportunity}</div>
                  </div>
                  <div style={{ background: "#fee2e2", borderRadius: 10, padding: 14 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "#991b1b", letterSpacing: 0.8, marginBottom: 6 }}>BIGGEST RISK</div>
                    <div style={{ fontSize: 13, color: "#7f1d1d" }}>{fitResult.biggest_risk}</div>
                  </div>
                </div>

                <div style={{ background: "#2d1f0e", borderRadius: 10, padding: "14px 18px", display: "flex", gap: 12, alignItems: "center" }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#8B6914", letterSpacing: 0.8, whiteSpace: "nowrap" }}>NEXT STEP</span>
                  <span style={{ fontSize: 14, color: "#f5f0e8", fontWeight: 500 }}>{fitResult.next_step}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* PARTNERSHIP BRIEF */}
        {tab === "brief" && (
          <div style={{ maxWidth: 760 }}>
            <div style={{ marginBottom: 22 }}>
              <div style={{ fontFamily: "'Lora', serif", fontWeight: 600, fontSize: 18, color: "#2d1f0e", marginBottom: 4 }}>Generate a partnership one-pager</div>
              <div style={{ fontSize: 13, color: "#9c8060" }}>Internal brief covering the opportunity, what each side brings, joint customer profile, and 90-day milestones.</div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 12 }}>
              <div>
                <label>YOUR COMPANY</label>
                <input type="text" value={briefYours} onChange={e => setBriefYours(e.target.value)} placeholder="e.g. Salesforce" />
              </div>
              <div>
                <label>PARTNER COMPANY</label>
                <input type="text" value={briefPartner} onChange={e => setBriefPartner(e.target.value)} placeholder="e.g. Slack" />
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label>PARTNERSHIP GOAL</label>
              <input type="text" value={briefGoal} onChange={e => setBriefGoal(e.target.value)} placeholder="e.g. joint enterprise sales motion, shared integration roadmap..." />
            </div>

            <button className="run-btn" onClick={runBrief} disabled={loadingBrief || !briefYours.trim() || !briefPartner.trim()}>
              {loadingBrief ? <><Spinner /> Writing brief...</> : "Generate Partnership Brief →"}
            </button>

            {briefResult && !briefResult.error && (
              <div className="anim" style={{ marginTop: 24 }}>
                <div style={{ borderLeft: "4px solid #8B6914", paddingLeft: 16, marginBottom: 20 }}>
                  <div style={{ fontFamily: "'Lora', serif", fontWeight: 600, fontSize: 20, color: "#2d1f0e", marginBottom: 6 }}>{briefResult.headline}</div>
                  <div style={{ fontSize: 14, color: "#5c4a2e", lineHeight: 1.65 }}>{briefResult.executive_summary}</div>
                </div>

                <div className="pcard" style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#9c8060", letterSpacing: 0.8, marginBottom: 8 }}>THE OPPORTUNITY</div>
                  <div style={{ fontSize: 14, color: "#2d1f0e", lineHeight: 1.6 }}>{briefResult.the_opportunity}</div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                  <div className="pcard" style={{ borderTop: "3px solid #8B6914" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#8B6914", letterSpacing: 0.8, marginBottom: 10 }}>WHAT WE BRING</div>
                    {(briefResult.what_we_bring || []).map((p, i) => (
                      <div key={i} style={{ fontSize: 13, color: "#2d1f0e", marginBottom: 8, paddingLeft: 10, borderLeft: "2px solid #c4a96b" }}>{p}</div>
                    ))}
                  </div>
                  <div className="pcard" style={{ borderTop: "3px solid #5c8a6b" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#3d6b50", letterSpacing: 0.8, marginBottom: 10 }}>WHAT THEY BRING</div>
                    {(briefResult.what_they_bring || []).map((p, i) => (
                      <div key={i} style={{ fontSize: 13, color: "#2d1f0e", marginBottom: 8, paddingLeft: 10, borderLeft: "2px solid #5c8a6b" }}>{p}</div>
                    ))}
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                  <div className="pcard">
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#9c8060", letterSpacing: 0.8, marginBottom: 8 }}>JOINT CUSTOMER PROFILE</div>
                    <div style={{ fontSize: 13, color: "#2d1f0e", lineHeight: 1.6 }}>{briefResult.joint_customer_profile}</div>
                  </div>
                  <div className="pcard">
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#9c8060", letterSpacing: 0.8, marginBottom: 8 }}>SUCCESS METRICS</div>
                    {(briefResult.success_metrics || []).map((m, i) => (
                      <div key={i} style={{ fontSize: 13, color: "#2d1f0e", marginBottom: 6, display: "flex", gap: 8, alignItems: "flex-start" }}>
                        <span style={{ color: "#8B6914", fontWeight: 700, marginTop: 1 }}>→</span>{m}
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div className="pcard">
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#9c8060", letterSpacing: 0.8, marginBottom: 8 }}>PROPOSED STRUCTURE</div>
                    <div style={{ fontSize: 13, color: "#2d1f0e", lineHeight: 1.6 }}>{briefResult.proposed_structure}</div>
                  </div>
                  <div className="pcard" style={{ background: "#faf8f4" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#9c8060", letterSpacing: 0.8, marginBottom: 8 }}>90-DAY TIMELINE</div>
                    <div style={{ fontSize: 13, color: "#2d1f0e", lineHeight: 1.6 }}>{briefResult.timeline}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* CO-SELL PITCH */}
        {tab === "pitch" && (
          <div style={{ maxWidth: 760 }}>
            <div style={{ marginBottom: 22 }}>
              <div style={{ fontFamily: "'Lora', serif", fontWeight: 600, fontSize: 18, color: "#2d1f0e", marginBottom: 4 }}>Build a joint co-sell pitch</div>
              <div style={{ fontSize: 13, color: "#9c8060" }}>Generate a joint value proposition, key messages, objection responses, and a pilot proposal for a specific customer segment.</div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 12 }}>
              <div>
                <label>YOUR COMPANY</label>
                <input type="text" value={pitchYours} onChange={e => setPitchYours(e.target.value)} placeholder="e.g. HubSpot" />
              </div>
              <div>
                <label>PARTNER COMPANY</label>
                <input type="text" value={pitchPartner} onChange={e => setPitchPartner(e.target.value)} placeholder="e.g. Zoom" />
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label>TARGET CUSTOMER SEGMENT</label>
              <input type="text" value={pitchSegment} onChange={e => setPitchSegment(e.target.value)} placeholder="e.g. Series B SaaS companies with remote sales teams" />
            </div>

            <button className="run-btn" onClick={runPitch} disabled={loadingPitch || !pitchYours.trim() || !pitchPartner.trim()}>
              {loadingPitch ? <><Spinner /> Building pitch...</> : "Build Co-Sell Pitch →"}
            </button>

            {pitchResult && !pitchResult.error && (
              <div className="anim" style={{ marginTop: 24 }}>
                <div style={{ background: "#2d1f0e", borderRadius: 12, padding: "20px 24px", marginBottom: 20 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#8B6914", letterSpacing: 0.8, marginBottom: 8 }}>JOINT TAGLINE</div>
                  <div style={{ fontFamily: "'Lora', serif", fontWeight: 600, fontSize: 20, color: "#f5f0e8", marginBottom: 12 }}>{pitchResult.joint_tagline}</div>
                  <div style={{ fontSize: 14, color: "#c4b89a", lineHeight: 1.65 }}>{pitchResult.combined_value_prop}</div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                  <div className="pcard">
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#9c8060", letterSpacing: 0.8, marginBottom: 10 }}>KEY MESSAGES</div>
                    {(pitchResult.key_messages || []).map((m, i) => (
                      <div key={i} style={{ fontSize: 13, color: "#2d1f0e", marginBottom: 8, paddingLeft: 10, borderLeft: "2px solid #8B6914", lineHeight: 1.5 }}>{m}</div>
                    ))}
                  </div>
                  <div className="pcard">
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#9c8060", letterSpacing: 0.8, marginBottom: 10 }}>TARGET SEGMENT</div>
                    <div style={{ fontSize: 13, color: "#2d1f0e", lineHeight: 1.6, marginBottom: 12 }}>{pitchResult.target_segment}</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#9c8060", letterSpacing: 0.8, marginBottom: 6 }}>OPENING LINE</div>
                    <div style={{ fontSize: 13, color: "#2d1f0e", fontStyle: "italic", background: "#faf8f4", padding: "10px 12px", borderRadius: 8, lineHeight: 1.6 }}>"{pitchResult.talk_track}"</div>
                  </div>
                </div>

                <div className="pcard" style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#9c8060", letterSpacing: 0.8, marginBottom: 12 }}>OBJECTION RESPONSES</div>
                  {(pitchResult.objection_responses || []).map((o, i) => (
                    <div key={i} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: i < pitchResult.objection_responses.length - 1 ? "1px solid #ede6d8" : "none" }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#991b1b", marginBottom: 4 }}>"{o.objection}"</div>
                      <div style={{ fontSize: 13, color: "#2d1f0e", lineHeight: 1.55 }}>{o.response}</div>
                    </div>
                  ))}
                </div>

                <div style={{ background: "#faf8f4", border: "1.5px solid #c4a96b", borderRadius: 10, padding: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#8B6914", letterSpacing: 0.8 }}>30-DAY PILOT PROPOSAL</div>
                    <CopyBtn text={pitchResult.pilot_proposal} />
                  </div>
                  <div style={{ fontSize: 13, color: "#2d1f0e", lineHeight: 1.65 }}>{pitchResult.pilot_proposal}</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}