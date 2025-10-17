// src/Pages/AnalyticsStandalone.jsx
import { useState, useEffect, useMemo } from "react";
import { toYMD } from "./GrowthPage";

function LinesRainBackground({
  lineCount = 10,
  colors = [
    "#FF4500","#32CD32","#1E90FF","#FFD700","#8A2BE2",
    "#20B2AA","#DC143C","#00FA9A","#FF1493","#00BFFF"
  ],
  durationSec = 7,
  widthVW = 90,
  zIndex = -1
}) {
  const css = useMemo(() => {
    const colorRules = colors.slice(0, lineCount).map((c, i) => `
.linesrain .line:nth-child(${i + 1})::after {
  background: linear-gradient(to bottom, rgba(255,255,255,0) 0%, ${c} 75%, ${c} 100%);
  animation-delay: ${0.5 * (i + 1)}s;
}`).join("\n");

    return `
.linesrain { position: fixed; inset: 0; pointer-events: none; z-index: ${zIndex}; }
.linesrain .lines {
  position: absolute; inset: 0; margin: auto; width: ${widthVW}vw; height: 100%;
  display: flex; justify-content: space-between;
}
.linesrain .line { position: relative; width: 1px; height: 100%; overflow: hidden; }
.linesrain .line::after {
  content: ''; position: absolute; height: 15vh; width: 100%; top: -50%; left: 0;
  background: linear-gradient(to bottom, rgba(255,255,255,0) 0%, #ffffff 75%, #ffffff 100%);
  animation: linesrain_drop ${durationSec}s 0s infinite;
  animation-fill-mode: forwards;
  animation-timing-function: cubic-bezier(0.4, 0.26, 0, 0.97);
}
@keyframes linesrain_drop { 0% { top: -50%; } 100% { top: 110%; } }
${colorRules}
`;
  }, [lineCount, colors, durationSec, widthVW, zIndex]);

  return (
    <div className="linesrain">
      <style>{css}</style>
      <div className="lines">
        {Array.from({ length: lineCount }).map((_, i) => <div className="line" key={i} />)}
      </div>
    </div>
  );
}

const enhanceStyles = `
:root {
  --beige-bg: rgba(245, 233, 212, 0.12);
  --beige-border: rgba(245, 233, 212, 0.35);
  --beige-text: #f5e9d4;
  --glass-bg: rgba(3,7,18,0.28);
  --glass-border: rgba(255,255,255,0.12);
  --panel-bg: rgba(15, 23, 42, 0.6);
  --panel-border: rgba(255,255,255,0.08);
  --lift-shadow: 0 14px 36px rgba(0,0,0,0.45);
  --card-shadow: 0 10px 30px rgba(0,0,0,0.35);
}

/* Page container + entrance */
.analytics-shell {
  width: min(880px, 96vw);
  margin: 0 auto;
  padding-bottom: 40px;
  animation: fadeIn .6s ease both;
}
@keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }

/* Gauges */
.analytics-stack {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  margin-top: 24px;
}

.stat-card {
  position: relative;
  width: 100%;
  max-width: 720px;
  border-radius: 20px;
  padding: 24px;
  background: rgba(30, 41, 59, 0.75);
  box-shadow: var(--card-shadow), inset 0 0 0 1px rgba(255,255,255,0.08);
  display: flex;
  align-items: center;
  gap: 24px;
  backdrop-filter: blur(10px);
  transition: transform .28s ease, box-shadow .28s ease, background .28s ease;
}
.stat-card:hover { transform: translateY(-4px); box-shadow: var(--lift-shadow); }

.stat-title { font-size: 13px; letter-spacing: 0.5px; opacity: 0.9; text-transform: uppercase; }
.stat-value { font-size: 34px; font-weight: 800; margin-top: 6px; }
.stat-delta { font-size: 13px; margin-left: 8px; }

.gauge { width: 120px; height: 120px; display: grid; place-items: center; }
.gauge svg { transform: rotate(-90deg); }
.gauge .txt { position: absolute; text-align: center; font-weight: 800; color: var(--beige-text); }

/* Header */
.growth-title span:first-child { position: relative; }
.growth-title span:first-child::after {
  content: ""; position: absolute; bottom: -4px; left: 0; width: 60%; height: 2px;
  background: linear-gradient(90deg, #60a5fa, transparent); border-radius: 1px;
}
.header-right { display: flex; align-items: center; gap: 8px; }
.date-pill {
  font-size: 12px; font-weight: 800; letter-spacing: 0.2px; padding: 8px 12px; border-radius: 999px;
  border: 1px solid var(--beige-border); background: var(--beige-bg); color: var(--beige-text);
}
.header-date {
  height: 34px; border-radius: 999px; border: 1px solid rgba(255,255,255,0.14); background: rgba(255,255,255,0.06);
  padding: 0 10px; color: #e5e7eb; transition: background .25s ease, border-color .25s ease;
}
.header-date:focus { outline: none; background: rgba(255,255,255,0.10); border-color: var(--beige-border); }

/* Glass sections */
.section {
  width: 100%; max-width: 720px; margin: 24px auto 0; padding: 16px;
  border: 1px solid var(--glass-border); border-radius: 16px; background: var(--glass-bg); backdrop-filter: blur(8px);
  transform: translateY(0); transition: transform .25s ease, background .25s ease, border-color .25s ease;
  animation: sectionIn .5s ease both;
}
.section:hover { transform: translateY(-2px); }
@keyframes sectionIn { from { opacity: 0; transform: translateY(6px);} to { opacity: 1; transform: translateY(0);} }

.section-header { display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-bottom: 12px; }
.section-title { font-weight: 800; letter-spacing: .3px; font-size: 14px; opacity: .95; }

/* Beige buttons */
.add-btn, .delete-btn, .add-confirm, .secondary-btn {
  border-radius: 999px; border: 1px solid var(--beige-border); background: var(--beige-bg); color: var(--beige-text);
  font-size: 12px; font-weight: 800; letter-spacing: .3px; transition: transform .18s ease, box-shadow .18s ease, background .25s ease;
}
.add-btn, .secondary-btn { padding: 8px 12px; }
.add-confirm { padding: 8px 14px; }
.delete-btn { padding: 6px 10px; border-radius: 10px; }
.add-btn:hover, .delete-btn:hover, .add-confirm:hover, .secondary-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 14px rgba(0,0,0,0.25); }
.add-btn:active, .delete-btn:active, .add-confirm:active, .secondary-btn:active { transform: translateY(0); box-shadow: none; }

/* Lists */
.item-list { display: grid; gap: 10px; }
.item {
  display: flex; align-items: center; gap: 12px; padding: 12px; border-radius: 12px;
  background: var(--panel-bg); border: 1px solid var(--panel-border); animation: itemIn .4s ease both;
}
@keyframes itemIn { from { opacity: 0; transform: translateY(4px);} to { opacity: 1; transform: translateY(0);} }
.item-left { flex: 1; min-width: 0; }
.item-title { font-weight: 700; margin-bottom: 4px; }
.item-meta { display: flex; gap: 10px; font-size: 12px; opacity: 0.85; flex-wrap: wrap; }
.badge { padding: 2px 8px; border-radius: 999px; font-size: 11px; border: 1px solid rgba(255,255,255,0.16); background: rgba(255,255,255,0.06); }

/* Inputs */
.quick-add {
  margin-top: 10px;
  display: grid;
  grid-template-columns: 1.1fr .7fr .7fr auto;
  gap: 8px;
}
.metrics-grid {
  display: grid;
  grid-template-columns: 1.1fr .7fr .7fr .7fr auto;
  gap: 12px;
  margin-top: 10px;
  align-items: end;
}
.input, .select {
  height: 36px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.14); background: rgba(255,255,255,0.06);
  padding: 0 10px; color: #e5e7eb; transition: background .25s ease, border-color .25s ease;
}
.input:focus, .select:focus { outline: none; background: rgba(255,255,255,0.1); border-color: var(--beige-border); }

/* Labels */
.form-field { display: grid; gap: 6px; }
.form-label { font-size: 12px; letter-spacing: .2px; color: var(--beige-text); opacity: 0.9; padding-left: 4px; }

/* Utility */
.visually-hidden {
  position: absolute !important; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden;
  clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;
}
`;

function Gauge({ pct, color = "#60a5fa" }) {
  const R = 55;
  const C = 2 * Math.PI * R;
  const val = Math.max(0, Math.min(100, pct ?? 0));
  const dash = (val / 100) * C;
  return (
    <div className="gauge">
      <svg width="130" height="130" viewBox="0 0 130 130">
        <circle cx="65" cy="65" r={R} stroke="rgba(255,255,255,0.15)" strokeWidth="10" fill="none" />
        <circle cx="65" cy="65" r={R} stroke={color} strokeWidth="10" fill="none" strokeLinecap="round" strokeDasharray={`${dash} ${C - dash}`} />
      </svg>
      <div className="txt" style={{ fontSize: 20 }}>{val}%</div>
    </div>
  );
}

export default function AnalyticsStandalone() {
  const todayYMD = toYMD(new Date());
  const [selectedDate, setSelectedDate] = useState(todayYMD);

  const [mfdi] = useState(72);
  const [motion] = useState(58);
  const [presence] = useState(64);

  const [distractions, setDistractions] = useState([
    { id: 1, title: "YouTube rabbit hole", category: "Media", time: "14:20", minutes: 18, note: "Watched shorts" },
    { id: 2, title: "WhatsApp chats", category: "Social", time: "16:05", minutes: 12, note: "Non-urgent" },
    { id: 3, title: "Random browsing", category: "Web", time: "18:40", minutes: 25, note: "Tech news spiral" },
  ]);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [qaTitle, setQaTitle] = useState("");
  const [qaCategory, setQaCategory] = useState("Media");
  const [qaMinutes, setQaMinutes] = useState(5);

  const [postponings, setPostponings] = useState([
    { id: 101, title: "Write DSA notes", category: "Study", time: "10:00", minutes: 30, note: "Arrays recap" },
    { id: 102, title: "System design read", category: "Study", time: "12:30", minutes: 20, note: "Caching basics" },
  ]);
  const [showQuickAddP, setShowQuickAddP] = useState(false);
  const [qaTitleP, setQaTitleP] = useState("");
  const [qaCategoryP, setQaCategoryP] = useState("Study");
  const [qaMinutesP, setQaMinutesP] = useState(10);

  const [metricsDate, setMetricsDate] = useState(todayYMD);
  const [mMfdi, setMMfdi] = useState(72);
  const [mMotion, setMMotion] = useState(58);
  const [mPresence, setMPresence] = useState(64);

  const clampPct = (n) => Math.max(0, Math.min(100, Number.isFinite(+n) ? +n : 0));

  const StatRow = ({ kind, title, value, prev = 0, color }) => {
    const delta = (value ?? 0) - (prev ?? 0);
    const up = delta >= 0;
    const pct = clampPct(value);
    return (
      <div className={`stat-card ${kind}`}>
        <Gauge pct={pct} color={color} />
        <div>
          <div className="stat-title">{title}</div>
          <div style={{ display: "flex", alignItems: "baseline" }}>
            <div className="stat-value">{pct}%</div>
            <div className="stat-delta" style={{ color: up ? "rgba(52,211,153,0.9)" : "rgba(248,113,113,0.9)" }}>
              {up ? "▲" : "▼"} {Math.abs(delta)}%
            </div>
          </div>
        </div>
      </div>
    );
  };

  const addDistraction = () => {
    if (!qaTitle?.trim()) return;
    const id = Date.now();
    const now = new Date();
    const time = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
    setDistractions((d) => [{ id, title: qaTitle.trim(), category: qaCategory, time, minutes: Number(qaMinutes) || 0, note: "" }, ...d]);
    setQaTitle(""); setQaMinutes(5); setShowQuickAdd(false);
  };
  const removeDistraction = (id) => setDistractions((d) => d.filter((x) => x.id !== id));

  const addPostponing = () => {
    if (!qaTitleP?.trim()) return;
    const id = Date.now() + 1000;
    const now = new Date();
    const time = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
    setPostponings((d) => [{ id, title: qaTitleP.trim(), category: qaCategoryP, time, minutes: Number(qaMinutesP) || 0, note: "" }, ...d]);
    setQaTitleP(""); setQaMinutesP(10); setShowQuickAddP(false);
  };
  const removePostponing = (id) => setPostponings((d) => d.filter((x) => x.id !== id));

  const saveTodayMetrics = () => {
    const payload = { date: metricsDate, mfdi: clampPct(mMfdi), motion: clampPct(mMotion), presence: clampPct(mPresence) };
    // TODO: POST /api/metrics/daily
    console.log("Save metrics payload", payload);
  };

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      document.querySelectorAll(".section").forEach((el) => { el.style.transform = `translateY(${Math.min(0, -y * 0.02)}px)`; });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="growth-wrap fade-in" style={{ position: "relative", minHeight: "100vh" }}>
      <LinesRainBackground />
      <style>{enhanceStyles}</style>
      <div className="analytics-shell">
        <div className="growth-card" style={{ paddingTop: 18 }}>
          <div className="header" style={{ textAlign: "left" }}>
            <div className="kicker">Planner</div>
            <div className="growth-title" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
              <span>Analytics</span>
              <div className="header-right">
                <span className="date-pill">
                  {new Date(selectedDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </span>
                <input
                  type="date"
                  className="header-date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  title="Select date to view analytics"
                />
              </div>
            </div>
          </div>

          {/* Gauges */}
          <div className="analytics-stack">
            <StatRow kind="mfdi" title="MFDI" value={mfdi} color="#60a5fa" />
            <StatRow kind="motion" title="Motion" value={motion} color="#34d399" />
            <StatRow kind="presence" title="Presence" value={presence} color="#f59e0b" />
          </div>

          {/* Distractions */}
          <div className="section">
            <div className="section-header">
              <div className="section-title">Distractions</div>
              <button className="add-btn" onClick={() => setShowQuickAdd((v) => !v)}>{showQuickAdd ? "Close" : "Add Distraction"}</button>
            </div>

            {showQuickAdd && (
              <div className="quick-add">
                <input className="input" placeholder="What distracted you?" value={qaTitle} onChange={(e) => setQaTitle(e.target.value)} />
                <select className="select" value={qaCategory} onChange={(e) => setQaCategory(e.target.value)}>
                  <option>Media</option><option>Social</option><option>Web</option><option>Games</option><option>Other</option>
                </select>
                <input className="input" type="number" min="0" placeholder="Minutes" value={qaMinutes} onChange={(e) => setQaMinutes(e.target.value)} />
                <button className="add-confirm" onClick={addDistraction}>Add</button>
              </div>
            )}

            <div className="item-list">
              {distractions.map((d) => (
                <div key={d.id} className="item">
                  <div className="item-left">
                    <div className="item-title">{d.title}</div>
                    <div className="item-meta">
                      <span className="badge">{d.category}</span>
                      <span className="badge">{d.minutes} min</span>
                      <span className="badge">{d.time}</span>
                      {d.note ? <span className="badge">{d.note}</span> : null}
                    </div>
                  </div>
                  <button className="delete-btn" onClick={() => removeDistraction(d.id)}>Remove</button>
                </div>
              ))}
              {distractions.length === 0 && <div style={{ opacity: 0.8, fontSize: 13, padding: "6px 2px" }}>No distractions logged today.</div>}
            </div>
          </div>

          {/* Things I'm Postponing */}
          <div className="section">
            <div className="section-header">
              <div className="section-title">Things I’m Postponing</div>
              <button className="add-btn" onClick={() => setShowQuickAddP((v) => !v)}>{showQuickAddP ? "Close" : "Add Item"}</button>
            </div>

            {showQuickAddP && (
              <div className="quick-add">
                <input className="input" placeholder="What are you postponing?" value={qaTitleP} onChange={(e) => setQaTitleP(e.target.value)} />
                <select className="select" value={qaCategoryP} onChange={(e) => setQaCategoryP(e.target.value)}>
                  <option>Study</option><option>Chore</option><option>Health</option><option>Work</option><option>Other</option>
                </select>
                <input className="input" type="number" min="0" placeholder="Minutes" value={qaMinutesP} onChange={(e) => setQaMinutesP(e.target.value)} />
                <button className="add-confirm" onClick={addPostponing}>Add</button>
              </div>
            )}

            <div className="item-list">
              {postponings.map((p) => (
                <div key={p.id} className="item">
                  <div className="item-left">
                    <div className="item-title">{p.title}</div>
                    <div className="item-meta">
                      <span className="badge">{p.category}</span>
                      <span className="badge">{p.minutes} min</span>
                      <span className="badge">{p.time}</span>
                      {p.note ? <span className="badge">{p.note}</span> : null}
                    </div>
                  </div>
                  <button className="delete-btn" onClick={() => removePostponing(p.id)}>Remove</button>
                </div>
              ))}
              {postponings.length === 0 && <div style={{ opacity: 0.8, fontSize: 13, padding: "6px 2px" }}>Nothing is being postponed right now.</div>}
            </div>
          </div>

          {/* Add Metrics for Date with visible labels */}
          <div className="section">
            <div className="section-header">
              <div className="section-title">Add Metrics for Date</div>
            </div>

            <div className="metrics-grid">
              <div className="form-field">
                <label className="form-label" htmlFor="metrics-date">Date</label>
                <input id="metrics-date" type="date" className="input" value={metricsDate} onChange={(e) => setMetricsDate(e.target.value)} title="Date you are saving metrics for" placeholder="YYYY-MM-DD" />
              </div>

              <div className="form-field">
                <label className="form-label" htmlFor="mfdi-input">MFDI (%)</label>
                <input id="mfdi-input" type="number" className="input" min={0} max={100} value={mMfdi} onChange={(e) => setMMfdi(clampPct(e.target.value))} placeholder="0–100" title="MFDI (0–100)" />
              </div>

              <div className="form-field">
                <label className="form-label" htmlFor="motion-input">Motion (%)</label>
                <input id="motion-input" type="number" className="input" min={0} max={100} value={mMotion} onChange={(e) => setMMotion(clampPct(e.target.value))} placeholder="0–100" title="Motion (0–100)" />
              </div>

              <div className="form-field">
                <label className="form-label" htmlFor="presence-input">Presence (%)</label>
                <input id="presence-input" type="number" className="input" min={0} max={100} value={mPresence} onChange={(e) => setMPresence(clampPct(e.target.value))} placeholder="0–100" title="Presence (0–100)" />
              </div>

              <button className="add-confirm" style={{ alignSelf: "end", height: 36 }} onClick={saveTodayMetrics}>Save</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
