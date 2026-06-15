import { useState } from "react";

const API = "/api/claude";

async function callClaude(system, user, maxTokens = 700) {
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

// ── DEMO DATA ──────────────────────────────────────────────────────────────
const DEMO_DISCOVER = {
  ecosystem_theme: "Dust's partnership strategy should centre on becoming the connective tissue between enterprise AI adoption and the tools teams already live in — making Dust the platform that makes every other tool smarter.",
  archetypes: [
    {
      type: "Tech Integration",
      archetype_name: "Productivity & Knowledge Platforms",
      why: "Notion, Confluence, and Google Workspace users are Dust's core ICP — deep integrations create distribution and stickiness simultaneously.",
      examples: ["Notion", "Confluence", "Google Workspace"],
      revenue_potential: "High",
      effort: "Medium",
      first_move: "Launch a co-built Notion integration template and pitch to Notion's partner marketplace for featured placement.",
    },
    {
      type: "Co-Sell",
      archetype_name: "CRM & RevOps Platforms",
      why: "Salesforce and HubSpot customers already have the data Dust agents need — a co-sell motion positions Dust as the AI layer on top of existing RevOps stacks.",
      examples: ["Salesforce", "HubSpot", "Pipedrive"],
      revenue_potential: "High",
      effort: "High",
      first_move: "Identify 5 shared enterprise customers and propose a joint QBR where both teams present combined ROI data.",
    },
    {
      type: "Channel",
      archetype_name: "AI Implementation Consultancies",
      why: "System integrators and AI consultancies are already advising enterprise clients on AI strategy — a channel program makes them Dust advocates with a financial incentive.",
      examples: ["Accenture AI", "Deloitte Digital", "BCG X"],
      revenue_potential: "Medium",
      effort: "High",
      first_move: "Build a certified Dust Partner program with training materials, co-selling playbooks, and a revenue share model.",
    },
    {
      type: "Tech Integration",
      archetype_name: "Communication & Workflow Tools",
      why: "Slack and Microsoft Teams are where work actually happens — embedding Dust agents directly into these surfaces removes the adoption barrier entirely.",
      examples: ["Slack", "Microsoft Teams", "Zoom"],
      revenue_potential: "High",
      effort: "Medium",
      first_move: "Publish a Dust bot for Slack in the Slack App Directory and create a 5-minute setup guide for self-serve activation.",
    },
  ],
};

const DEMO_FIT = {
  overall_score: 84,
  verdict: "Strong fit",
  dimensions: [
    { name: "Audience Overlap", score: 91, insight: "Both serve the same mid-market and enterprise B2B SaaS buyer — nearly identical ICP with minimal channel conflict." },
    { name: "Revenue Alignment", score: 78, insight: "Co-sell motion is clean: Notion expands usage, Dust drives AI layer adoption — both sides win on expansion revenue." },
    { name: "Product Complementarity", score: 88, insight: "Notion holds the knowledge; Dust activates it with agents — the combination is meaningfully stronger than either alone." },
    { name: "Strategic Timing", score: 80, insight: "Both companies are in active enterprise expansion phases — a joint motion accelerates both without competing roadmaps." },
  ],
  biggest_opportunity: "A joint 'AI-ready workspace' bundle targets the exact enterprise buyer both companies are chasing — and neither can credibly offer it alone.",
  biggest_risk: "Notion may develop native AI agent capabilities that reduce their incentive to promote Dust as the AI layer over time.",
  recommended_structure: "Tech integration partnership with co-sell overlay — start with a deep integration, then build a joint go-to-market motion for enterprise accounts.",
  next_step: "Schedule an executive sponsor meeting between Dust's Head of Partnerships and Notion's BD lead to align on a 90-day pilot scope.",
};

const DEMO_BRIEF = {
  headline: "Dust × Notion: The AI-Ready Enterprise Workspace",
  executive_summary: "Notion holds the institutional knowledge enterprises have spent years building. Dust turns that knowledge into active, intelligent agents that work across every team. Together, they offer the first truly AI-native enterprise workspace where knowledge compounds rather than sits idle.",
  the_opportunity: "Enterprises are adopting AI point solutions that don't connect — Dust and Notion together close the gap between where knowledge lives and where AI can act on it.",
  what_we_bring: [
    "Multiplayer AI agent platform with 70%+ weekly active usage and zero churn in 2025",
    "300,000+ agents deployed across 3,000 enterprise organizations",
    "Enterprise-grade governance: SOC 2, GDPR, HIPAA compliance built in",
  ],
  what_they_bring: [
    "20M+ users and deep enterprise penetration across knowledge management",
    "Trusted brand with existing relationships in Dust's exact target accounts",
    "App marketplace and partner ecosystem with built-in distribution reach",
  ],
  joint_customer_profile: "Mid-market to enterprise B2B SaaS companies (200–2,000 employees) with knowledge-heavy operations — RevOps, CS, Product, and Engineering teams who need AI that understands their company context.",
  success_metrics: [
    "10 co-sold enterprise accounts within 90 days of launch",
    "25% of new Dust customers acquired via Notion referral channel within 6 months",
    "Integration achieves 4.5+ star rating in Notion's app marketplace",
  ],
  proposed_structure: "Phase 1: Deep technical integration (Dust agents pull from Notion databases natively). Phase 2: Co-sell pilot with 5 shared accounts. Phase 3: Joint marketplace listing and partner marketing.",
  timeline: "Days 1–30: Integration build and internal alignment. Days 31–60: Pilot launch with 5 shared accounts and joint success metrics defined. Days 61–90: Marketplace listing live, co-marketing activated, expansion motion designed.",
};

const DEMO_PITCH = {
  joint_tagline: "Your knowledge, finally at work.",
  combined_value_prop: "Notion organizes everything your company knows. Dust turns that knowledge into AI agents that actually do things — answering questions, drafting outputs, and running workflows without anyone having to prompt from scratch. Together, they give enterprise teams an AI workspace that gets smarter every day.",
  target_segment: "RevOps and GTM teams at Series B–D SaaS companies (150–800 employees) who already use Notion for documentation but struggle to make that knowledge accessible at the speed their teams work.",
  key_messages: [
    "Stop starting from scratch — your agents already know what's in Notion",
    "One setup, every team: sales, CS, product, and ops all work from the same shared AI layer",
    "Enterprise-ready on day one: SOC 2, GDPR, and role-based access controls built in",
  ],
  objection_responses: [
    { objection: "We already use Notion AI — why do we need Dust too?", response: "Notion AI is single-player — it helps one person at a time and the context disappears. Dust makes AI multiplayer across your whole team, with agents that remember, learn, and work together." },
    { objection: "Our team won't adopt another tool.", response: "Dust agents live inside Slack and your existing workflows — your team never has to open another app. Adoption happens where work already happens." },
  ],
  pilot_proposal: "30-day co-sell pilot with 3 shared accounts: Dust and Notion each assign one CS rep to the accounts, jointly onboard teams in Week 1, run a shared success review in Week 3, and present combined ROI data to account stakeholders in Week 4. Success metric: all 3 accounts activate at least 2 Dust agents connected to Notion data within 30 days.",
  talk_track: "Most AI tools help one person — we've built something that helps your whole team compound, and when it sits on top of everything already in Notion, your team is up and running in under a day.",
};
// ── END DEMO DATA ──────────────────────────────────────────────────────────

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
    <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 9px", borderRadius: 4, background: s.bg, color: s.color, letterSpacing: 0.4, whiteSpace: "nowrap" }}>{label}</span>
  );
}

function DemoBadge() {
  return <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4, background: "#fef9c3", color: "#92400e", letterSpacing: 0.8, marginLeft: 8 }}>DEMO</span>;
}

const TABS = [
  { id: "discover", label: "Partner Discovery", sub: "Find the right partners" },
  { id: "score", label: "Fit Scorer", sub: "Evaluate strategic alignment" },
  { id: "brief", label: "Partnership Brief", sub: "One-pager for any partner" },
  { id: "pitch", label: "Co-Sell Pitch", sub: "Joint value proposition" },
];

export default function PartnerOS() {
  const [tab, setTab] = useState("discover");

  const [discProduct, setDiscProduct] = useState("Dust — multiplayer AI platform for enterprise human-agent collaboration");
  const [discCategory, setDiscCategory] = useState("tech integrations and co-sell");
  const [discResult, setDiscResult] = useState(DEMO_DISCOVER);
  const [loadingDisc, setLoadingDisc] = useState(false);

  const [fitYours, setFitYours] = useState("Dust — AI agent platform, 3,000+ enterprise customers, zero churn, Series B Sequoia-backed");
  const [fitPartner, setFitPartner] = useState("Notion — 20M+ users, knowledge management platform, strong enterprise and SMB penetration");
  const [fitResult, setFitResult] = useState(DEMO_FIT);
  const [loadingFit, setLoadingFit] = useState(false);

  const [briefYours, setBriefYours] = useState("Dust");
  const [briefPartner, setBriefPartner] = useState("Notion");
  const [briefGoal, setBriefGoal] = useState("Joint enterprise sales motion and shared integration roadmap");
  const [briefResult, setBriefResult] = useState(DEMO_BRIEF);
  const [loadingBrief, setLoadingBrief] = useState(false);

  const [pitchYours, setPitchYours] = useState("Dust");
  const [pitchPartner, setPitchPartner] = useState("Notion");
  const [pitchSegment, setPitchSegment] = useState("RevOps and GTM teams at Series B–D SaaS companies");
  const [pitchResult, setPitchResult] = useState(DEMO_PITCH);
  const [loadingPitch, setLoadingPitch] = useState(false);

  async function runDiscover() {
    if (!discProduct.trim()) return;
    setLoadingDisc(true); setDiscResult(null);
    try {
      const raw = await callClaude(
        `You are a partnerships strategist. Return ONLY valid JSON: { "ecosystem_theme": "one sentence", "archetypes": [ { "type": "Tech Integration/Channel/Co-sell/Reseller", "archetype_name": "short name", "why": "one sentence", "examples": ["A","B","C"], "revenue_potential": "High/Medium/Low", "effort": "High/Medium/Low", "first_move": "one sentence" } ] }. Return exactly 4 archetypes. All fields under 20 words.`,
        `Product: ${discProduct}\nFocus: ${discCategory || "all types"}`, 700
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
        `You are a partnerships strategist. Return ONLY valid JSON: { "overall_score": 0-100, "verdict": "Strong/Moderate/Weak fit", "dimensions": [{"name":"Audience Overlap","score":0-100,"insight":"one sentence"},{"name":"Revenue Alignment","score":0-100,"insight":"one sentence"},{"name":"Product Complementarity","score":0-100,"insight":"one sentence"},{"name":"Strategic Timing","score":0-100,"insight":"one sentence"}], "biggest_opportunity": "one sentence", "biggest_risk": "one sentence", "recommended_structure": "one sentence", "next_step": "one sentence" }`,
        `Our company: ${fitYours}\nPartner: ${fitPartner}`, 700
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
        `You are a partnerships director. Return ONLY valid JSON: { "headline": "title", "executive_summary": "2 sentences", "the_opportunity": "one sentence", "what_we_bring": ["p1","p2","p3"], "what_they_bring": ["p1","p2","p3"], "joint_customer_profile": "one sentence", "success_metrics": ["m1","m2","m3"], "proposed_structure": "one sentence", "timeline": "one sentence per 30-day phase" }. All fields under 20 words.`,
        `Our company: ${briefYours}\nPartner: ${briefPartner}\nGoal: ${briefGoal}`, 700
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
        `You are a partnerships strategist. Return ONLY valid JSON: { "joint_tagline": "one line", "combined_value_prop": "2 sentences", "target_segment": "one sentence", "key_messages": ["msg1","msg2","msg3"], "objection_responses": [{"objection":"objection1","response":"response1"},{"objection":"objection2","response":"response2"}], "pilot_proposal": "one paragraph", "talk_track": "one sentence" }. Be concise, under 50 words per field.`,
        `Our company: ${pitchYours}\nPartner: ${pitchPartner}\nSegment: ${pitchSegment}`, 700
      );
      setPitchResult(JSON.parse(raw.replace(/```json|```/g, "").trim()));
    } catch (e) { setPitchResult({ error: e.message }); }
    setLoadingPitch(false);
  }

  const scoreColor = (s) => s >= 70 ? "#166534" : s >= 45 ? "#854d0e" : "#991b1b";
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
        textarea, input[type="text"] { font-family: inherit; font-size: 13px; border: 1.5px solid #e8e0d0; border-radius: 8px; padding: 9px 12px; width: 100%; background: white; color: #2d1f0e; outline: none; resize: vertical; transition: border 0.15s; }
        textarea:focus, input[type="text"]:focus { border-color: #8B6914; box-shadow: 0 0 0 3px rgba(139,105,20,0.08); }
        .run-btn { background: #2d1f0e; color: #f5f0e8; border: none; border-radius: 8px; padding: 10px 20px; font-size: 13px; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; transition: background 0.15s; font-family: inherit; }
        .run-btn:hover { background: #3d2f1e; }
        .run-btn:disabled { background: #c4b89a; cursor: not-allowed; }
        .pcard { background: white; border: 1.5px solid #ede6d8; border-radius: 12px; padding: 16px 18px; }
        .anim { animation: fadein 0.25s ease; }
        .tab-btn { cursor: pointer; border: none; background: transparent; font-family: inherit; transition: all 0.15s; }
        label { font-size: 11px; font-weight: 700; color: #9c8060; letter-spacing: 0.8px; display: block; margin-bottom: 5px; }
        .arch-card:hover { border-color: #c4a96b !important; }
      `}</style>

      {/* Header */}
      <div style={{ background: "#faf8f4", borderBottom: "1.5px solid #ede6d8", padding: "18px 28px 0" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: "#2d1f0e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🤝</div>
            <div>
              <div style={{ fontFamily: "'Lora', serif", fontWeight: 600, fontSize: 19, color: "#2d1f0e" }}>PartnerOS</div>
              <div style={{ fontSize: 11, color: "#9c8060", fontWeight: 600, letterSpacing: 0.8 }}>AI PARTNERSHIP INTELLIGENCE</div>
            </div>
          </div>
          <div style={{ fontSize: 12, color: "#9c8060" }}>Powered by <span style={{ color: "#8B6914", fontWeight: 700 }}>Claude AI</span></div>
        </div>
        <div style={{ display: "flex", gap: 2 }}>
          {TABS.map(t => (
            <button key={t.id} className="tab-btn" onClick={() => setTab(t.id)}
              style={{ padding: "10px 18px 12px", borderBottom: tab === t.id ? "2px solid #8B6914" : "2px solid transparent", color: tab === t.id ? "#2d1f0e" : "#9c8060" }}>
              <div style={{ fontSize: 13, fontWeight: tab === t.id ? 700 : 500 }}>{t.label}</div>
              <div style={{ fontSize: 10, color: tab === t.id ? "#8B6914" : "#c4b89a", fontWeight: 500, marginTop: 1 }}>{t.sub}</div>
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: "24px 28px 0" }}>

        {/* PARTNER DISCOVERY */}
        {tab === "discover" && (
          <div style={{ maxWidth: 820 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 10 }}>
              <div><label>YOUR PRODUCT / COMPANY</label><input type="text" value={discProduct} onChange={e => setDiscProduct(e.target.value)} /></div>
              <div><label>PARTNERSHIP FOCUS</label><input type="text" value={discCategory} onChange={e => setDiscCategory(e.target.value)} /></div>
            </div>
            <button className="run-btn" onClick={runDiscover} disabled={loadingDisc || !discProduct.trim()} style={{ marginBottom: 24 }}>
              {loadingDisc ? <><Spinner /> Mapping...</> : "Map Partner Ecosystem →"}
            </button>

            {discResult && !discResult.error && (
              <div className="anim">
                <div style={{ background: "#2d1f0e", borderRadius: 10, padding: "11px 16px", marginBottom: 16, display: "flex", gap: 10, alignItems: "center" }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#9c8060", letterSpacing: 0.8, whiteSpace: "nowrap" }}>ECOSYSTEM STRATEGY</span>
                  <span style={{ fontSize: 13, color: "#f5f0e8" }}>{discResult.ecosystem_theme}</span>
                  <DemoBadge />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {(discResult.archetypes || []).map((a, i) => (
                    <div key={i} className="pcard arch-card" style={{ transition: "border-color 0.15s", borderTop: "3px solid #8B6914" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                        <div>
                          <div style={{ fontSize: 10, fontWeight: 700, color: "#9c8060", letterSpacing: 0.8, marginBottom: 2 }}>{a.type}</div>
                          <div style={{ fontWeight: 700, fontSize: 14, color: "#2d1f0e" }}>{a.archetype_name}</div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end" }}>
                          <Pill label={`${a.revenue_potential} revenue`} type={revColor(a.revenue_potential)} />
                          <Pill label={`${a.effort} effort`} type={effortColor(a.effort)} />
                        </div>
                      </div>
                      <div style={{ fontSize: 12, color: "#5c4a2e", lineHeight: 1.55, marginBottom: 10 }}>{a.why}</div>
                      <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 10 }}>
                        {(a.examples || []).map((ex, j) => (
                          <span key={j} style={{ fontSize: 11, background: "#f3f0e8", color: "#5c4a2e", padding: "2px 7px", borderRadius: 4, fontWeight: 500 }}>{ex}</span>
                        ))}
                      </div>
                      <div style={{ background: "#faf8f4", borderRadius: 8, padding: "9px 11px" }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: "#8B6914", letterSpacing: 0.8, marginBottom: 3 }}>FIRST MOVE</div>
                        <div style={{ fontSize: 12, color: "#2d1f0e" }}>{a.first_move}</div>
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
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 10 }}>
              <div><label>YOUR COMPANY / PRODUCT</label><textarea rows={2} value={fitYours} onChange={e => setFitYours(e.target.value)} /></div>
              <div><label>POTENTIAL PARTNER</label><textarea rows={2} value={fitPartner} onChange={e => setFitPartner(e.target.value)} /></div>
            </div>
            <button className="run-btn" onClick={runFit} disabled={loadingFit || !fitYours.trim() || !fitPartner.trim()} style={{ marginBottom: 24 }}>
              {loadingFit ? <><Spinner /> Scoring...</> : "Score Partnership Fit →"}
            </button>

            {fitResult && !fitResult.error && (
              <div className="anim">
                <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 18 }}>
                  <div style={{ width: 76, height: 76, borderRadius: "50%", background: scoreBg(fitResult.overall_score), display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", border: `3px solid ${scoreHex(fitResult.overall_score)}`, flexShrink: 0 }}>
                    <div style={{ fontWeight: 800, fontSize: 24, color: scoreHex(fitResult.overall_score), lineHeight: 1 }}>{fitResult.overall_score}</div>
                    <div style={{ fontSize: 10, color: scoreHex(fitResult.overall_score), fontWeight: 600 }}>/ 100</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Lora', serif", fontWeight: 600, fontSize: 19, color: "#2d1f0e" }}>{fitResult.verdict} <DemoBadge /></div>
                    <div style={{ fontSize: 12, color: "#9c8060", marginTop: 2 }}>{fitResult.recommended_structure}</div>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
                  {(fitResult.dimensions || []).map((d, i) => (
                    <div key={i} className="pcard">
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "#5c4a2e" }}>{d.name}</div>
                        <Pill label={`${d.score}/100`} type={d.score >= 70 ? "green" : d.score >= 45 ? "amber" : "red"} />
                      </div>
                      <div style={{ height: 4, background: "#ede6d8", borderRadius: 2, marginBottom: 7 }}>
                        <div style={{ height: 4, width: `${d.score}%`, background: scoreHex(d.score), borderRadius: 2 }} />
                      </div>
                      <div style={{ fontSize: 12, color: "#9c8060", lineHeight: 1.5 }}>{d.insight}</div>
                    </div>
                  ))}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
                  <div style={{ background: "#dcfce7", borderRadius: 10, padding: 13 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "#166534", letterSpacing: 0.8, marginBottom: 5 }}>BIGGEST OPPORTUNITY</div>
                    <div style={{ fontSize: 13, color: "#14532d" }}>{fitResult.biggest_opportunity}</div>
                  </div>
                  <div style={{ background: "#fee2e2", borderRadius: 10, padding: 13 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "#991b1b", letterSpacing: 0.8, marginBottom: 5 }}>BIGGEST RISK</div>
                    <div style={{ fontSize: 13, color: "#7f1d1d" }}>{fitResult.biggest_risk}</div>
                  </div>
                </div>

                <div style={{ background: "#2d1f0e", borderRadius: 10, padding: "13px 16px", display: "flex", gap: 10, alignItems: "center" }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#8B6914", letterSpacing: 0.8, whiteSpace: "nowrap" }}>NEXT STEP</span>
                  <span style={{ fontSize: 13, color: "#f5f0e8", fontWeight: 500 }}>{fitResult.next_step}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* PARTNERSHIP BRIEF */}
        {tab === "brief" && (
          <div style={{ maxWidth: 760 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 10 }}>
              <div><label>YOUR COMPANY</label><input type="text" value={briefYours} onChange={e => setBriefYours(e.target.value)} /></div>
              <div><label>PARTNER COMPANY</label><input type="text" value={briefPartner} onChange={e => setBriefPartner(e.target.value)} /></div>
            </div>
            <div style={{ marginBottom: 12 }}><label>PARTNERSHIP GOAL</label><input type="text" value={briefGoal} onChange={e => setBriefGoal(e.target.value)} /></div>
            <button className="run-btn" onClick={runBrief} disabled={loadingBrief || !briefYours.trim() || !briefPartner.trim()} style={{ marginBottom: 24 }}>
              {loadingBrief ? <><Spinner /> Writing...</> : "Generate Partnership Brief →"}
            </button>

            {briefResult && !briefResult.error && (
              <div className="anim">
                <div style={{ borderLeft: "4px solid #8B6914", paddingLeft: 14, marginBottom: 16 }}>
                  <div style={{ fontFamily: "'Lora', serif", fontWeight: 600, fontSize: 19, color: "#2d1f0e", marginBottom: 5 }}>{briefResult.headline} <DemoBadge /></div>
                  <div style={{ fontSize: 13, color: "#5c4a2e", lineHeight: 1.65 }}>{briefResult.executive_summary}</div>
                </div>

                <div className="pcard" style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#9c8060", letterSpacing: 0.8, marginBottom: 6 }}>THE OPPORTUNITY</div>
                  <div style={{ fontSize: 13, color: "#2d1f0e", lineHeight: 1.6 }}>{briefResult.the_opportunity}</div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                  <div className="pcard" style={{ borderTop: "3px solid #8B6914" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#8B6914", letterSpacing: 0.8, marginBottom: 8 }}>WHAT WE BRING</div>
                    {(briefResult.what_we_bring || []).map((p, i) => (
                      <div key={i} style={{ fontSize: 12, color: "#2d1f0e", marginBottom: 7, paddingLeft: 9, borderLeft: "2px solid #c4a96b" }}>{p}</div>
                    ))}
                  </div>
                  <div className="pcard" style={{ borderTop: "3px solid #5c8a6b" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#3d6b50", letterSpacing: 0.8, marginBottom: 8 }}>WHAT THEY BRING</div>
                    {(briefResult.what_they_bring || []).map((p, i) => (
                      <div key={i} style={{ fontSize: 12, color: "#2d1f0e", marginBottom: 7, paddingLeft: 9, borderLeft: "2px solid #5c8a6b" }}>{p}</div>
                    ))}
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                  <div className="pcard">
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#9c8060", letterSpacing: 0.8, marginBottom: 6 }}>JOINT CUSTOMER PROFILE</div>
                    <div style={{ fontSize: 13, color: "#2d1f0e", lineHeight: 1.6 }}>{briefResult.joint_customer_profile}</div>
                  </div>
                  <div className="pcard">
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#9c8060", letterSpacing: 0.8, marginBottom: 6 }}>SUCCESS METRICS</div>
                    {(briefResult.success_metrics || []).map((m, i) => (
                      <div key={i} style={{ fontSize: 12, color: "#2d1f0e", marginBottom: 5, display: "flex", gap: 7 }}><span style={{ color: "#8B6914", fontWeight: 700 }}>→</span>{m}</div>
                    ))}
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div className="pcard">
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#9c8060", letterSpacing: 0.8, marginBottom: 6 }}>PROPOSED STRUCTURE</div>
                    <div style={{ fontSize: 13, color: "#2d1f0e", lineHeight: 1.6 }}>{briefResult.proposed_structure}</div>
                  </div>
                  <div className="pcard" style={{ background: "#faf8f4" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#9c8060", letterSpacing: 0.8, marginBottom: 6 }}>90-DAY TIMELINE</div>
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
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 10 }}>
              <div><label>YOUR COMPANY</label><input type="text" value={pitchYours} onChange={e => setPitchYours(e.target.value)} /></div>
              <div><label>PARTNER COMPANY</label><input type="text" value={pitchPartner} onChange={e => setPitchPartner(e.target.value)} /></div>
            </div>
            <div style={{ marginBottom: 12 }}><label>TARGET CUSTOMER SEGMENT</label><input type="text" value={pitchSegment} onChange={e => setPitchSegment(e.target.value)} /></div>
            <button className="run-btn" onClick={runPitch} disabled={loadingPitch || !pitchYours.trim() || !pitchPartner.trim()} style={{ marginBottom: 24 }}>
              {loadingPitch ? <><Spinner /> Building...</> : "Build Co-Sell Pitch →"}
            </button>

            {pitchResult && !pitchResult.error && (
              <div className="anim">
                <div style={{ background: "#2d1f0e", borderRadius: 12, padding: "18px 22px", marginBottom: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#8B6914", letterSpacing: 0.8, marginBottom: 6 }}>JOINT TAGLINE <DemoBadge /></div>
                  <div style={{ fontFamily: "'Lora', serif", fontWeight: 600, fontSize: 19, color: "#f5f0e8", marginBottom: 10 }}>{pitchResult.joint_tagline}</div>
                  <div style={{ fontSize: 13, color: "#c4b89a", lineHeight: 1.65 }}>{pitchResult.combined_value_prop}</div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                  <div className="pcard">
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#9c8060", letterSpacing: 0.8, marginBottom: 8 }}>KEY MESSAGES</div>
                    {(pitchResult.key_messages || []).map((m, i) => (
                      <div key={i} style={{ fontSize: 12, color: "#2d1f0e", marginBottom: 7, paddingLeft: 9, borderLeft: "2px solid #8B6914", lineHeight: 1.5 }}>{m}</div>
                    ))}
                  </div>
                  <div className="pcard">
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#9c8060", letterSpacing: 0.8, marginBottom: 8 }}>TARGET SEGMENT</div>
                    <div style={{ fontSize: 13, color: "#2d1f0e", lineHeight: 1.6, marginBottom: 10 }}>{pitchResult.target_segment}</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#9c8060", letterSpacing: 0.8, marginBottom: 5 }}>OPENING LINE</div>
                    <div style={{ fontSize: 13, color: "#2d1f0e", fontStyle: "italic", background: "#faf8f4", padding: "9px 11px", borderRadius: 8, lineHeight: 1.6 }}>"{pitchResult.talk_track}"</div>
                  </div>
                </div>

                <div className="pcard" style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#9c8060", letterSpacing: 0.8, marginBottom: 10 }}>OBJECTION RESPONSES</div>
                  {(pitchResult.objection_responses || []).map((o, i) => (
                    <div key={i} style={{ marginBottom: 10, paddingBottom: 10, borderBottom: i < pitchResult.objection_responses.length - 1 ? "1px solid #ede6d8" : "none" }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#991b1b", marginBottom: 4 }}>"{o.objection}"</div>
                      <div style={{ fontSize: 13, color: "#2d1f0e", lineHeight: 1.55 }}>{o.response}</div>
                    </div>
                  ))}
                </div>

                <div style={{ background: "#faf8f4", border: "1.5px solid #c4a96b", borderRadius: 10, padding: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
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