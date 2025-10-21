// src/Pages/AnalyticsStandalone.jsx
import { useState, useEffect, useMemo } from "react";
import { toYMD } from "./GrowthPage";
import BackgroundVideo from "../Components/BackgroundVideo";

// ---------- Utility helpers ----------
const nowTime = () =>
  new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

const matchesSearch = (item, q) => {
  if (!q?.trim()) return true;
  const s = q.trim().toLowerCase();
  return [item.title, item.category, item.note, item.time, String(item.minutes ?? "")]
    .filter(Boolean)
    .some((v) => String(v).toLowerCase().includes(s));
};

// Calendar-aware Y/M/D difference
function diffYMD(start, end) {
  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate();

  if (days < 0) {
    const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
    days += prevMonth.getDate();
    months -= 1;
  }
  if (months < 0) {
    months += 12;
    years -= 1;
  }
  return { years, months, days };
}

// Residual H/M/S after removing whole Y/M/D
function diffHMS(start, end) {
  const ymd = diffYMD(start, end);
  const shifted = new Date(start.getTime());
  shifted.setFullYear(shifted.getFullYear() + ymd.years);
  shifted.setMonth(shifted.getMonth() + ymd.months);
  shifted.setDate(shifted.getDate() + ymd.days);

  let ms = Math.max(0, end.getTime() - shifted.getTime());
  const hours = Math.floor(ms / (1000 * 60 * 60));
  ms -= hours * (1000 * 60 * 60);
  const minutes = Math.floor(ms / (1000 * 60));
  ms -= minutes * (1000 * 60);
  const seconds = Math.floor(ms / 1000);
  return { hours, minutes, seconds };
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

/* Gauges container (horizontal) */
.analytics-stack {
  width: 100%;
  margin: 24px 0 0 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}
.gauges-row {
  width: 100%;
  max-width: 720px;
  display: flex;
  gap: 16px;
}
.gauge-card {
  flex: 1;
  border-radius: 16px;
  padding: 16px;
  background: rgba(30, 41, 59, 0.75);
  box-shadow: var(--card-shadow), inset 0 0 0 1px rgba(255,255,255,0.08);
  display: flex;
  align-items: center;
  gap: 16px;
  backdrop-filter: blur(10px);
  transition: transform .28s ease, box-shadow .28s ease, background .28s ease;
}
.gauge-card:hover { transform: translateY(-4px); box-shadow: var(--lift-shadow); }
.stat-title { font-size: 12px; letter-spacing: 0.5px; opacity: 0.9; text-transform: uppercase; }
.stat-value { font-size: 28px; font-weight: 800; margin-top: 6px; }
.stat-delta { font-size: 12px; margin-left: 8px; }

.gauge { width: 110px; height: 110px; display: grid; place-items: center; }
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

/* Search row */
.search-row {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 8px;
  margin: 10px 0 6px 0;
}

/* Completed styling */
.item.completed { opacity: 0.7; background: rgba(15, 23, 42, 0.5); }
.badge.done { border-color: rgba(34,197,94,0.5); background: rgba(34,197,94,0.08); color: #86efac; }
`;

// ---------- Digital Desk Watch component (inline to keep standalone) ----------
function DigitalDeskWatch({ ymd, hms, startLabel = "22 August 2025" }) {
  const pad2 = (n) => String(n).padStart(2, "0");

  const css = useMemo(
    () => `
.deskwatch-scope { width: 100%; display: grid; place-items: center; margin-top: 12px; }
.deskwatch-surface {
  width: min(820px, 96vw); height: 38px; margin-bottom: -10px;
  background: radial-gradient(60% 100% at 50% 100%, rgba(0,0,0,0.45), transparent 70%);
  filter: blur(8px); transform: translateY(12px);
}
.deskwatch {
  position: relative; width: min(720px, 96vw); border-radius: 18px;
  padding: 18px 18px 14px;
  background:
    linear-gradient(180deg, rgba(2,6,23,0.7), rgba(2,6,23,0.4)),
    radial-gradient(120% 80% at 80% 0%, rgba(96,165,250,0.15), transparent 60%),
    radial-gradient(120% 80% at 20% 0%, rgba(34,197,94,0.08), transparent 60%);
  border: 1px solid rgba(255,255,255,0.12);
  box-shadow:
    0 18px 50px rgba(0,0,0,0.55),
    inset 0 0 0 1px rgba(255,255,255,0.06),
    inset 0 14px 36px rgba(255,255,255,0.05);
  backdrop-filter: blur(10px) saturate(110%);
  transform: perspective(1200px) rotateX(6deg) rotateY(-6deg) translateY(0);
  animation: dwIn .6s ease both;
}
@keyframes dwIn {
  from { opacity: 0; transform: perspective(1200px) rotateX(10deg) rotateY(-14deg) translateY(6px); }
  to { opacity: 1; transform: perspective(1200px) rotateX(6deg) rotateY(-6deg) translateY(0); }
}
.deskwatch-topridge {
  position: absolute; inset: 0; border-radius: 18px; pointer-events: none;
  background: linear-gradient(180deg, rgba(255,255,255,0.18), transparent 40%) top / 100% 12px no-repeat;
}
.deskwatch-gloss {
  position: absolute; inset: 0; border-radius: 18px; pointer-events: none;
  background:
    radial-gradient(80% 30% at 50% 0%, rgba(255,255,255,0.18), transparent 55%),
    radial-gradient(60% 20% at 30% 0%, rgba(255,255,255,0.10), transparent 60%);
  mix-blend-mode: screen;
}
.deskwatch-shadow {
  position: absolute; left: 10%; right: 10%; bottom: -14px; height: 20px;
  border-radius: 999px;
  background: radial-gradient(60% 100% at 50% 0%, rgba(0,0,0,0.5), transparent 75%);
  filter: blur(8px);
}
.deskwatch-header {
  display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 6px;
}
.dw-kicker { font-size: 11px; letter-spacing: .28px; text-transform: uppercase; color: rgba(229,231,235,0.85); }
.dw-date { font-size: 12px; color: rgba(229,231,235,0.9); }
.deskwatch-time {
  display: flex; align-items: baseline; justify-content: center; gap: 10px;
  padding: 12px 8px; border-radius: 14px;
  background:
    linear-gradient(180deg, rgba(15,23,42,0.55), rgba(2,6,23,0.45)),
    radial-gradient(100% 60% at 50% 0%, rgba(96,165,250,0.08), transparent 70%);
  border: 1px solid rgba(255,255,255,0.08);
  box-shadow: inset 0 0 0 1px rgba(255,255,255,0.06), 0 12px 28px rgba(0,0,0,0.35);
}
.deskwatch-time > span {
  color: #dbeafe;
  text-shadow: 0 0 10px rgba(96,165,250,0.4), 0 0 24px rgba(96,165,250,0.25);
}
.dw-years, .dw-months, .dw-days { font-size: 34px; font-weight: 900; letter-spacing: 1px; }
.deskwatch-time small { font-size: 12px; margin-left: 4px; opacity: 0.85; color: #93c5fd; }
.dw-sep { font-size: 24px; opacity: 0.6; color: #e5e7eb; }
.dw-dot { margin: 0 4px; opacity: 0.6; color: #e5e7eb; }
.dw-hms {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
  font-size: 30px; font-weight: 800; letter-spacing: 1px; color: #d1fae5;
  text-shadow: 0 0 12px rgba(16,185,129,0.45), 0 0 28px rgba(16,185,129,0.25);
  padding: 6px 10px; border-radius: 10px;
  background: linear-gradient(180deg, rgba(6,78,59,0.35), rgba(2,6,23,0.3));
  border: 1px solid rgba(16,185,129,0.25); box-shadow: inset 0 0 0 1px rgba(255,255,255,0.05);
}
.dw-colon { animation: blink 1s steps(1) infinite; }
@keyframes blink { 50% { opacity: 0.2; } }
.deskwatch-foot {
  margin-top: 10px; display: flex; justify-content: center; gap: 8px; flex-wrap: wrap;
}
.dw-chip {
  padding: 6px 10px; font-size: 11px; font-weight: 800; letter-spacing: .3px; color: #e5e7eb;
  border-radius: 999px; border: 1px solid rgba(255,255,255,0.14); background: rgba(255,255,255,0.06);
}
.dw-chip.glow {
  color: #bfdbfe; border-color: rgba(96,165,250,0.35);
  box-shadow: 0 0 16px rgba(96,165,250,0.28), inset 0 0 0 1px rgba(255,255,255,0.06);
}
`,
    []
  );

  return (
    <div className="deskwatch-scope">
      <style>{css}</style>
      <div className="deskwatch-surface" aria-hidden="true" />
      <div className="deskwatch">
        <div className="deskwatch-gloss" aria-hidden="true" />
        <div className="deskwatch-topridge" aria-hidden="true" />
        <div className="deskwatch-shadow" aria-hidden="true" />

        <div className="deskwatch-header">
          <span className="dw-kicker">Elapsed since</span>
          <span className="dw-date">{startLabel}</span>
        </div>

        <div className="deskwatch-time">
          <span className="dw-years">{ymd.years}<small>y</small></span>
          <span className="dw-sep">:</span>
          <span className="dw-months">{ymd.months}<small>m</small></span>
          <span className="dw-sep">:</span>
          <span className="dw-days">{ymd.days}<small>d</small></span>
          <span className="dw-dot">•</span>
          <span className="dw-hms">
            {String(hms.hours).padStart(2, "0")}<span className="dw-colon">:</span>
            {String(hms.minutes).padStart(2, "0")}<span className="dw-colon">:</span>
            {String(hms.seconds).padStart(2, "0")}
          </span>
        </div>

        <div className="deskwatch-foot">
          <span className="dw-chip">DIGITAL</span>
          <span className="dw-chip glow">STOPWATCH</span>
          <span className="dw-chip">V1</span>
        </div>
      </div>
    </div>
  );
}

// ---------- Gauge ----------
function Gauge({ pct, color = "#60a5fa" }) {
  const R = 50;
  const C = 2 * Math.PI * R;
  const val = Math.max(0, Math.min(100, pct ?? 0));
  const dash = (val / 100) * C;
  return (
    <div className="gauge">
      <svg width="120" height="120" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={R} stroke="rgba(255,255,255,0.15)" strokeWidth="10" fill="none" />
        <circle
          cx="60" cy="60" r={R}
          stroke={color}
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${C - dash}`}
        />
      </svg>
      <div className="txt" style={{ fontSize: 18 }}>{val}%</div>
    </div>
  );
}

// ---------- Page ----------
export default function AnalyticsStandalone() {
  const todayYMD = toYMD(new Date());
  const [selectedDate, setSelectedDate] = useState(todayYMD);

  // Stopwatch since 22 Sep 2025 00:00:00 local
  const startDate = useMemo(() => new Date(2025, 7, 22, 0, 0, 0, 0), []);
  const [ymd, setYmd] = useState(() => diffYMD(startDate, new Date()));
  const [hms, setHms] = useState(() => diffHMS(startDate, new Date()));
  useEffect(() => {
    const t = setInterval(() => {
      const now = new Date();
      setYmd(diffYMD(startDate, now));
      setHms(diffHMS(startDate, now));
    }, 1000);
    return () => clearInterval(t);
  }, [startDate]);

  // Gauges
  const [mfdi] = useState(72);
  const [motion] = useState(58);
  const [presence] = useState(64);

  // Distractions
  const [distractions, setDistractions] = useState([
    { id: 1, title: "YouTube rabbit hole", category: "Media", time: "14:20", minutes: 18, note: "Watched shorts", completed: false },
    { id: 2, title: "WhatsApp chats", category: "Social", time: "16:05", minutes: 12, note: "Non-urgent", completed: true },
    { id: 3, title: "Random browsing", category: "Web", time: "18:40", minutes: 25, note: "Tech news spiral", completed: false },
  ]);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [qaTitle, setQaTitle] = useState("");
  const [qaCategory, setQaCategory] = useState("Media");
  const [qaMinutes, setQaMinutes] = useState(5);
  const [qDistractions, setQDistractions] = useState("");
  const [showCompletedDistractions, setShowCompletedDistractions] = useState(false);

  // Postponings
  const [postponings, setPostponings] = useState([
    { id: 101, title: "Write DSA notes", category: "Study", time: "10:00", minutes: 30, note: "Arrays recap", completed: false },
    { id: 102, title: "System design read", category: "Study", time: "12:30", minutes: 20, note: "Caching basics", completed: false },
  ]);
  const [showQuickAddP, setShowQuickAddP] = useState(false);
  const [qaTitleP, setQaTitleP] = useState("");
  const [qaCategoryP, setQaCategoryP] = useState("Study");
  const [qaMinutesP, setQaMinutesP] = useState(10);
  const [qPostponings, setQPostponings] = useState("");
  const [showCompletedPostponings, setShowCompletedPostponings] = useState(false);

  // In Motion
  const [inMotion, setInMotion] = useState([
    { id: 201, title: "Resume refactor for product roles", time: "09:30", completed: false },
    { id: 202, title: "Set up Redis cache POC", time: "11:15", completed: false },
  ]);
  const [showQuickAddM, setShowQuickAddM] = useState(false);
  const [qaMotionTitle, setQaMotionTitle] = useState("");
  const [qInMotion, setQInMotion] = useState("");
  const [showCompletedInMotion, setShowCompletedInMotion] = useState(false);

  const [metricsDate, setMetricsDate] = useState(todayYMD);
  const [mMfdi, setMMfdi] = useState(72);
  const [mMotion, setMMotion] = useState(58);
  const [mPresence, setMPresence] = useState(64);
  const clampPct = (n) => Math.max(0, Math.min(100, Number.isFinite(+n) ? +n : 0));

  const StatInline = ({ title, value, prev = 0, color }) => {
    const delta = (value ?? 0) - (prev ?? 0);
    const up = delta >= 0;
    const pct = clampPct(value);
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <Gauge pct={pct} color={color} />
        <div>
          <div className="stat-title">{title}</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <div className="stat-value">{pct}%</div>
            <div className="stat-delta" style={{ color: up ? "rgba(52,211,153,0.9)" : "rgba(248,113,113,0.9)" }}>
              {up ? "▲" : "▼"} {Math.abs(delta)}%
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Add/toggle handlers
  const addDistraction = async () => {
    if (!qaTitle?.trim()) return;
    const newItem = {
      id: Date.now(),
      title: qaTitle.trim(),
      category: qaCategory,
      time: nowTime(),
      minutes: Number(qaMinutes) || 0,
      note: "",
      completed: false
    };
    setDistractions((d) => [newItem, ...d]);
    setQaTitle(""); setQaMinutes(5); setShowQuickAdd(false);
  };
  const toggleDistractionDone = async (id) => {
    setDistractions((d) => d.map((x) => (x.id === id ? { ...x, completed: !x.completed } : x)));
  };

  const addPostponing = async () => {
    if (!qaTitleP?.trim()) return;
    const newItem = {
      id: Date.now() + 1000,
      title: qaTitleP.trim(),
      category: qaCategoryP,
      time: nowTime(),
      minutes: Number(qaMinutesP) || 0,
      note: "",
      completed: false
    };
    setPostponings((d) => [newItem, ...d]);
    setQaTitleP(""); setQaMinutesP(10); setShowQuickAddP(false);
  };
  const togglePostponingDone = async (id) => {
    setPostponings((d) => d.map((x) => (x.id === id ? { ...x, completed: !x.completed } : x)));
  };

  const addInMotion = async () => {
    const title = qaMotionTitle?.trim();
    if (!title) return;
    const newItem = {
      id: Date.now() + 2000,
      title,
      time: nowTime(),
      completed: false
    };
    setInMotion((d) => [newItem, ...d]);
    setQaMotionTitle("");
    setShowQuickAddM(false);
  };
  const toggleInMotionDone = async (id) => {
    setInMotion((d) => d.map((x) => (x.id === id ? { ...x, completed: !x.completed } : x)));
  };

  const saveTodayMetrics = () => {
    const payload = {
      date: metricsDate,
      mfdi: clampPct(mMfdi),
      motion: clampPct(mMotion),
      presence: clampPct(mPresence)
    };
    console.log("Save metrics payload", payload);
  };

  // Optional backend fetching on date change
  useEffect(() => {
    // fetch lists if needed
  }, [selectedDate]);

  return (
    <div className="growth-wrap fade-in" style={{ position: "relative", minHeight: "100vh" }}>
      <BackgroundVideo zIndex={-1} />
      <style>{enhanceStyles}</style>

      <div className="analytics-shell">
        <div className="growth-card" style={{ paddingTop: 18 }}>
          <div className="header" style={{ textAlign: "left" }}>
            <div className="kicker">Planner</div>
            <div
              className="growth-title"
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}
            >
              <span>Analytics</span>
              <div className="header-right">
                <span className="date-pill">
                  {new Date(selectedDate).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                  })}
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

          {/* Digital Desk Watch */}
          <DigitalDeskWatch ymd={ymd} hms={hms} startLabel="22 August 2025" />

          {/* Gauges in one horizontal container */}
          <div className="analytics-stack">
            <div className="gauges-row">
              <div className="gauge-card">
                <StatInline title="MFDI" value={mfdi} color="#60a5fa" />
              </div>
              <div className="gauge-card">
                <StatInline title="Motion" value={motion} color="#34d399" />
              </div>
              <div className="gauge-card">
                <StatInline title="Presence" value={presence} color="#f59e0b" />
              </div>
            </div>
          </div>

          {/* Distractions */}
          <div className="section">
            <div className="section-header" style={{ gap: 8 }}>
              <div className="section-title">Distractions</div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="add-btn" onClick={() => setShowQuickAdd((v) => !v)}>
                  {showQuickAdd ? "Close" : "Add"}
                </button>
                <button
                  className="secondary-btn"
                  onClick={() => setShowCompletedDistractions((v) => !v)}
                >
                  {showCompletedDistractions ? "Hide Completed" : "View Completed"}
                </button>
              </div>
            </div>

            <div className="search-row">
              <input
                className="input"
                value={qDistractions}
                onChange={(e) => setQDistractions(e.target.value)}
                placeholder="Search distractions (title, category, note, time)"
              />
              <button className="secondary-btn">Search</button>
              <button className="secondary-btn" onClick={() => setQDistractions("")}>
                Clear
              </button>
            </div>

            {showQuickAdd && (
              <div className="quick-add">
                <input
                  className="input"
                  placeholder="What distracted you?"
                  value={qaTitle}
                  onChange={(e) => setQaTitle(e.target.value)}
                />
                <select
                  className="select"
                  value={qaCategory}
                  onChange={(e) => setQaCategory(e.target.value)}
                >
                  <option>Media</option>
                  <option>Social</option>
                  <option>Web</option>
                  <option>Games</option>
                  <option>Other</option>
                </select>
                <input
                  className="input"
                  type="number"
                  min="0"
                  placeholder="Minutes"
                  value={qaMinutes}
                  onChange={(e) => setQaMinutes(e.target.value)}
                />
                <button className="add-confirm" onClick={addDistraction}>
                  Add
                </button>
              </div>
            )}

            <div className="item-list">
              {distractions
                .filter((x) => !x.completed)
                .filter((x) => matchesSearch(x, qDistractions))
                .map((d) => (
                  <div key={d.id} className={`item ${d.completed ? "completed" : ""}`}>
                    <div className="item-left">
                      <div className="item-title">{d.title}</div>
                      <div className="item-meta">
                        <span className="badge">{d.category}</span>
                        <span className="badge">{d.minutes} min</span>
                        <span className="badge">{d.time}</span>
                        {d.note ? <span className="badge">{d.note}</span> : null}
                      </div>
                    </div>
                    <button className="add-confirm" onClick={() => toggleDistractionDone(d.id)}>
                      {d.completed ? "Mark Active" : "Completed"}
                    </button>
                  </div>
                ))}
              {distractions.filter((x) => !x.completed).filter((x) => matchesSearch(x, qDistractions)).length === 0 && (
                <div style={{ opacity: 0.8, fontSize: 13, padding: "6px 2px" }}>
                  No active distractions match your search.
                </div>
              )}
            </div>

            {showCompletedDistractions && (
              <>
                <div className="section-header" style={{ marginTop: 12 }}>
                  <div className="section-title">Completed</div>
                </div>
                <div className="item-list">
                  {distractions
                    .filter((x) => x.completed)
                    .filter((x) => matchesSearch(x, qDistractions))
                    .map((d) => (
                      <div key={d.id} className="item completed">
                        <div className="item-left">
                          <div className="item-title">{d.title}</div>
                          <div className="item-meta">
                            <span className="badge done">Done</span>
                            <span className="badge">{d.category}</span>
                            <span className="badge">{d.minutes} min</span>
                            <span className="badge">{d.time}</span>
                          </div>
                        </div>
                        <button className="secondary-btn" onClick={() => toggleDistractionDone(d.id)}>
                          Mark Active
                        </button>
                      </div>
                    ))}
                  {distractions.filter((x) => x.completed).filter((x) => matchesSearch(x, qDistractions)).length === 0 && (
                    <div style={{ opacity: 0.8, fontSize: 13, padding: "6px 2px" }}>
                      No completed distractions match your search.
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Postponings */}
          <div className="section">
            <div className="section-header" style={{ gap: 8 }}>
              <div className="section-title">Things I’m Postponing</div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="add-btn" onClick={() => setShowQuickAddP((v) => !v)}>
                  {showQuickAddP ? "Close" : "Add"}
                </button>
                <button
                  className="secondary-btn"
                  onClick={() => setShowCompletedPostponings((v) => !v)}
                >
                  {showCompletedPostponings ? "Hide Completed" : "View Completed"}
                </button>
              </div>
            </div>

            <div className="search-row">
              <input
                className="input"
                value={qPostponings}
                onChange={(e) => setQPostponings(e.target.value)}
                placeholder="Search postponings (title, category, note, time)"
              />
              <button className="secondary-btn">Search</button>
              <button className="secondary-btn" onClick={() => setQPostponings("")}>
                Clear
              </button>
            </div>

            {showQuickAddP && (
              <div className="quick-add">
                <input
                  className="input"
                  placeholder="What are you postponing?"
                  value={qaTitleP}
                  onChange={(e) => setQaTitleP(e.target.value)}
                />
                <select
                  className="select"
                  value={qaCategoryP}
                  onChange={(e) => setQaCategoryP(e.target.value)}
                >
                  <option>Study</option>
                  <option>Chore</option>
                  <option>Health</option>
                  <option>Work</option>
                  <option>Other</option>
                </select>
                <input
                  className="input"
                  type="number"
                  min="0"
                  placeholder="Minutes"
                  value={qaMinutesP}
                  onChange={(e) => setQaMinutesP(e.target.value)}
                />
                <button className="add-confirm" onClick={addPostponing}>
                  Add
                </button>
              </div>
            )}

            <div className="item-list">
              {postponings
                .filter((x) => !x.completed)
                .filter((x) => matchesSearch(x, qPostponings))
                .map((p) => (
                  <div key={p.id} className={`item ${p.completed ? "completed" : ""}`}>
                    <div className="item-left">
                      <div className="item-title">{p.title}</div>
                      <div className="item-meta">
                        <span className="badge">{p.category}</span>
                        <span className="badge">{p.minutes} min</span>
                        <span className="badge">{p.time}</span>
                        {p.note ? <span className="badge">{p.note}</span> : null}
                      </div>
                    </div>
                    <button className="add-confirm" onClick={() => togglePostponingDone(p.id)}>
                      {p.completed ? "Mark Active" : "Completed"}
                    </button>
                  </div>
                ))}
              {postponings.filter((x) => !x.completed).filter((x) => matchesSearch(x, qPostponings)).length === 0 && (
                <div style={{ opacity: 0.8, fontSize: 13, padding: "6px 2px" }}>
                  No active postponings match your search.
                </div>
              )}
            </div>

            {showCompletedPostponings && (
              <>
                <div className="section-header" style={{ marginTop: 12 }}>
                  <div className="section-title">Completed</div>
                </div>
                <div className="item-list">
                  {postponings
                    .filter((x) => x.completed)
                    .filter((x) => matchesSearch(x, qPostponings))
                    .map((p) => (
                      <div key={p.id} className="item completed">
                        <div className="item-left">
                          <div className="item-title">{p.title}</div>
                          <div className="item-meta">
                            <span className="badge done">Done</span>
                            <span className="badge">{p.category}</span>
                            <span className="badge">{p.minutes} min</span>
                            <span className="badge">{p.time}</span>
                          </div>
                        </div>
                        <button className="secondary-btn" onClick={() => togglePostponingDone(p.id)}>
                          Mark Active
                        </button>
                      </div>
                    ))}
                  {postponings.filter((x) => x.completed).filter((x) => matchesSearch(x, qPostponings)).length === 0 && (
                    <div style={{ opacity: 0.8, fontSize: 13, padding: "6px 2px" }}>
                      No completed postponings match your search.
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Things I'm Setting in Motion */}
          <div className="section">
            <div className="section-header" style={{ gap: 8 }}>
              <div className="section-title">Things I’m Setting in Motion</div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="add-btn" onClick={() => setShowQuickAddM((v) => !v)}>
                  {showQuickAddM ? "Close" : "Add"}
                </button>
                <button
                  className="secondary-btn"
                  onClick={() => setShowCompletedInMotion((v) => !v)}
                >
                  {showCompletedInMotion ? "Hide Completed" : "View Completed"}
                </button>
              </div>
            </div>

            <div className="search-row">
              <input
                className="input"
                value={qInMotion}
                onChange={(e) => setQInMotion(e.target.value)}
                placeholder="Search in motion (title, time)"
              />
              <button className="secondary-btn">Search</button>
              <button className="secondary-btn" onClick={() => setQInMotion("")}>
                Clear
              </button>
            </div>

            {showQuickAddM && (
              <div className="quick-add" style={{ gridTemplateColumns: "1fr auto" }}>
                <input
                  className="input"
                  placeholder="What are you starting to move?"
                  value={qaMotionTitle}
                  onChange={(e) => setQaMotionTitle(e.target.value)}
                />
                <button className="add-confirm" onClick={addInMotion}>
                  Add
                </button>
              </div>
            )}

            <div className="item-list">
              {inMotion
                .filter((x) => !x.completed)
                .filter((x) => matchesSearch(x, qInMotion))
                .map((m) => (
                  <div key={m.id} className={`item ${m.completed ? "completed" : ""}`}>
                    <div className="item-left">
                      <div className="item-title">{m.title}</div>
                      <div className="item-meta">
                        <span className="badge">{m.time}</span>
                      </div>
                    </div>
                    <button className="add-confirm" onClick={() => toggleInMotionDone(m.id)}>
                      {m.completed ? "Mark Active" : "Completed"}
                    </button>
                  </div>
                ))}
              {inMotion.filter((x) => !x.completed).filter((x) => matchesSearch(x, qInMotion)).length === 0 && (
                <div style={{ opacity: 0.8, fontSize: 13, padding: "6px 2px" }}>
                  No active items set in motion match your search.
                </div>
              )}
            </div>

            {showCompletedInMotion && (
              <>
                <div className="section-header" style={{ marginTop: 12 }}>
                  <div className="section-title">Completed</div>
                </div>
                <div className="item-list">
                  {inMotion
                    .filter((x) => x.completed)
                    .filter((x) => matchesSearch(x, qInMotion))
                    .map((m) => (
                      <div key={m.id} className="item completed">
                        <div className="item-left">
                          <div className="item-title">{m.title}</div>
                          <div className="item-meta">
                            <span className="badge done">Done</span>
                            <span className="badge">{m.time}</span>
                          </div>
                        </div>
                        <button className="secondary-btn" onClick={() => toggleInMotionDone(m.id)}>
                          Mark Active
                        </button>
                      </div>
                    ))}
                  {inMotion.filter((x) => x.completed).filter((x) => matchesSearch(x, qInMotion)).length === 0 && (
                    <div style={{ opacity: 0.8, fontSize: 13, padding: "6px 2px" }}>
                      No completed 'in motion' items match your search.
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Add Metrics */}
          <div className="section">
            <div className="section-header">
              <div className="section-title">Add Metrics for Date</div>
            </div>

            <div className="metrics-grid">
              <div className="form-field">
                <label className="form-label" htmlFor="metrics-date">Date</label>
                <input
                  id="metrics-date"
                  type="date"
                  className="input"
                  value={metricsDate}
                  onChange={(e) => setMetricsDate(e.target.value)}
                  title="Date you are saving metrics for"
                  placeholder="YYYY-MM-DD"
                />
              </div>

              <div className="form-field">
                <label className="form-label" htmlFor="mfdi-input">MFDI (%)</label>
                <input
                  id="mfdi-input"
                  type="number"
                  className="input"
                  min={0}
                  max={100}
                  value={mMfdi}
                  onChange={(e) => setMMfdi(clampPct(e.target.value))}
                  placeholder="0–100"
                  title="MFDI (0–100)"
                />
              </div>

              <div className="form-field">
                <label className="form-label" htmlFor="motion-input">Motion (%)</label>
                <input
                  id="motion-input"
                  type="number"
                  className="input"
                  min={0}
                  max={100}
                  value={mMotion}
                  onChange={(e) => setMMotion(clampPct(e.target.value))}
                  placeholder="0–100"
                  title="Motion (0–100)"
                />
              </div>

              <div className="form-field">
                <label className="form-label" htmlFor="presence-input">Presence (%)</label>
                <input
                  id="presence-input"
                  type="number"
                  className="input"
                  min={0}
                  max={100}
                  value={mPresence}
                  onChange={(e) => setMPresence(clampPct(e.target.value))}
                  placeholder="0–100"
                  title="Presence (0–100)"
                />
              </div>

              <button className="add-confirm" style={{ alignSelf: "end", height: 36 }} onClick={saveTodayMetrics}>
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
