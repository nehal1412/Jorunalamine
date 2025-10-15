// src/Pages/AnalyticsStandalone.jsx
import { useState, useMemo } from "react";
import AnalyticsPanel from "./AnalyticsPanel.jsx";
import { isoWeekRange, toYMD } from "./GrowthPage";

/* Styles: vertical layout + progress-outline cards */
const enhanceStyles = `
.analytics-shell{ width: min(880px, 96vw); margin: 0 auto; }
.analytics-stack{ display: grid; gap: 16px; margin-top: 14px; }

/* Progress outline card
   Uses a conic-gradient around the card as the progress outline driven by --pct */
.stat-card{
  --pct: 0;
  --angle: calc(var(--pct) * 1deg);
  position: relative;
  border-radius: 18px;
  padding: 16px;
  background: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.04));
  box-shadow: 0 16px 44px rgba(0,0,0,0.28), inset 0 0 0 1px rgba(255,255,255,0.06);
  display: grid; grid-template-columns: 180px 1fr; gap: 16px; align-items: center;
}
.stat-card::before{
  content: "";
  position: absolute; inset: -2px;
  border-radius: 20px;
  background:
    conic-gradient(from 90deg,
      rgba(96,165,250,.95) 0deg,
      rgba(96,165,250,.95) var(--angle),
      rgba(255,255,255,0.10) var(--angle));
  -webkit-mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
          mask-composite: exclude;
  padding: 2px;
  pointer-events: none;
  filter: drop-shadow(0 10px 24px rgba(96,165,250,.24));
}
.stat-card.motion::before{
  background:
    conic-gradient(from 90deg,
      rgba(52,211,153,.95) 0deg,
      rgba(52,211,153,.95) var(--angle),
      rgba(255,255,255,0.10) var(--angle));
  filter: drop-shadow(0 10px 24px rgba(52,211,153,.24));
}
.stat-card.presence::before{
  background:
    conic-gradient(from 90deg,
      rgba(245,158,11,.95) 0deg,
      rgba(245,158,11,.95) var(--angle),
      rgba(255,255,255,0.10) var(--angle));
  filter: drop-shadow(0 10px 24px rgba(245,158,11,.24));
}

@media (max-width: 680px){
  .stat-card{ grid-template-columns: 1fr; }
}

.stat-title{ font-size: 12px; letter-spacing: .4px; opacity: .95; margin-bottom: 8px; }
.stat-value{ font-size: 28px; font-weight: 900; }
.stat-delta{ font-size: 12px; margin-left: 10px; }
.spark{ display: flex; gap: 4px; height: 22px; align-items: flex-end; }
.spark div{
  width: 6px; border-radius: 3px;
  background: linear-gradient(180deg, rgba(255,255,255,.9), rgba(255,255,255,.3));
  box-shadow: 0 6px 16px rgba(96,165,250,.25);
  mix-blend-mode: screen; opacity: .9;
}

/* Radial gauge */
.gauge{ width: 160px; height: 160px; position: relative; display: grid; place-items: center; }
.gauge svg{ transform: rotate(-90deg); }
.gauge .txt{ position: absolute; text-align: center; line-height: 1.1; color: #f5e9d4; font-weight: 900; }

/* Panel + controls */
.analytics-panel{ margin-top: 12px; padding: 12px; border: 1px solid rgba(255,255,255,0.12);
  border-radius: 16px; background: rgba(3,7,18,0.28); backdrop-filter: blur(6px); }
.control-strip{ display: flex; flex-wrap: wrap; gap: 10px; align-items: center; }
.input-chip{ display: inline-flex; align-items: center; gap: 8px; padding: 8px 10px;
  border-radius: 999px; border: 1px solid rgba(255,255,255,0.16);
  background: rgba(255,255,255,0.10); color: #f5e9d4; height: 36px; }
.input-chip input{ padding: 0 6px; height: 28px; color: #f5e9d4; background: transparent; border: none; outline: none; }

/* Form inputs */
.field, .area{ background: rgba(255,255,255,0.08) !important; border: 1px solid rgba(255,255,255,0.16) !important;
  border-radius: 12px !important; box-shadow: inset 0 0 0 1px rgba(255,255,255,0.06); }
input[type="number"], input[type="date"], input[type="week"], input[type="month"]{
  width: 100%; box-sizing: border-box; background: transparent; border: none; outline: none;
  color: #f5e9d4; font: 500 14px/1.3 ui-sans-serif, system-ui, -apple-system, "Segoe UI", Inter, Roboto, Arial;
  padding: 10px 12px; height: 40px; }
input[type="number"].compact{ width: 120px; }
input:focus{ box-shadow: 0 0 0 2px rgba(96,165,250,0.45); border-radius: 10px; }

/* AnalyticsPanel rows */
.list .row{ align-items: center !important; grid-template-columns: 220px 1fr 1.2fr auto !important; }
@media (max-width: 960px){ .list .row{ grid-template-columns: 1fr !important; } }
.progress-track{ height: 12px !important; }
.btn, .btn.small{ height: 36px; display: inline-flex; align-items: center; }
.time-chip{ height: 28px; display: inline-flex; align-items: center; }
.compact-col{ max-width: 360px; }

/* Readonly lock */
.readonly{ opacity: .65; pointer-events: none; filter: grayscale(.1); }
`;

/* Mini spark helper */
function SparkBars({ data = [], max = 100 }) {
  const h = 22;
  return (
    <div className="spark">
      {data.map((v, i) => (
        <div key={i} style={{ height: Math.max(2, Math.round((Math.min(max, v) / max) * h)) }} title={`${v}%`} />
      ))}
    </div>
  );
}

/* Radial gauge */
function Gauge({ pct, color = "#60a5fa" }) {
  const R = 70;
  const C = 2 * Math.PI * R;
  const val = Math.max(0, Math.min(100, pct ?? 0));
  const dash = (val / 100) * C;
  return (
    <div className="gauge">
      <svg width="160" height="160" viewBox="0 0 160 160">
        <circle cx="80" cy="80" r={R} stroke="rgba(255,255,255,0.18)" strokeWidth="12" fill="none" />
        <circle
          cx="80" cy="80" r={R}
          stroke={color} strokeWidth="12" fill="none"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${C - dash}`}
        />
      </svg>
      <div className="txt">
        <div style={{ fontSize: 28 }}>{val}%</div>
        <div style={{ fontSize: 11, opacity: .8 }}>of target</div>
      </div>
    </div>
  );
}

function currentIsoWeekString(d = new Date()) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
  const year = date.getUTCFullYear();
  const ww = String(weekNo).padStart(2, "0");
  return `${year}-W${ww}`;
}
function formatWeekLabel(isoWeekStr, locale = "en-IN") {
  const { start, end } = isoWeekRange(isoWeekStr);
  const fmt = new Intl.DateTimeFormat(locale, { month: "short", day: "numeric" });
  const fmtY = new Intl.DateTimeFormat(locale, { year: "numeric" });
  const weekNum = isoWeekStr.split("-W")[1];
  return `Week ${weekNum} • ${fmt.format(start)}–${fmt.format(end)}, ${fmtY.format(end)}`;
}
function monthLabel(ym, locale = "en-IN") {
  const [y, m] = ym.split("-").map(Number);
  const d = new Date(y, m - 1, 1);
  return d.toLocaleDateString(locale, { month: "long", year: "numeric" });
}

export default function AnalyticsStandalone() {
  const [analyticsScope, setAnalyticsScope] = useState("Daily");
  const [analyticsByDay, setAnalyticsByDay] = useState({});
  const todayYMD = toYMD(new Date());
  const [analyticsDate, setAnalyticsDate] = useState(todayYMD);
  const [analyticsWeek, setAnalyticsWeek] = useState(() => currentIsoWeekString());
  const [analyticsMonth, setAnalyticsMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });

  const [mfdi, setMfdi] = useState(0);
  const [motion, setMotion] = useState(0);
  const [presence, setPresence] = useState(0);

  const [monthlyHours, setMonthlyHours] = useState(0);
  const [addHours, setAddHours] = useState("");

  const clampPct = (n) => Math.max(0, Math.min(100, Number.isFinite(+n) ? +n : 0));
  const pctStyle = (n) => ({ width: `${clampPct(n)}%` });

  function getDatesInWeek(isoWeekStr) {
    const { start } = isoWeekRange(isoWeekStr);
    const out = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setUTCDate(start.getUTCDate() + i);
      out.push(toYMD(new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())));
    }
    return out;
  }
  function daysInMonth(ym) {
    const [y, m] = ym.split("-").map(Number);
    return new Date(y, m, 0).getDate();
  }
  function getDatesInMonth(ym) {
    const [y, m] = ym.split("-").map(Number);
    const days = daysInMonth(ym);
    const out = [];
    for (let d = 1; d <= days; d++) {
      out.push(`${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`);
    }
    return out;
  }

  const last7Keys = useMemo(() => {
    const base = analyticsScope === "Daily" ? new Date(analyticsDate) : new Date();
    const keys = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(base);
      d.setDate(base.getDate() - i);
      keys.push(toYMD(d));
    }
    return keys;
  }, [analyticsScope, analyticsDate]);

  const trend7 = useMemo(() => {
    const seq = (k) => last7Keys.map((d) => analyticsByDay[d]?.[k] ?? 0);
    return { mfdiSeq: seq("mfdi"), motionSeq: seq("motion"), presenceSeq: seq("presence") };
  }, [analyticsByDay, last7Keys]);

  const average = (arr) => (arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0);

  const compareBlock = useMemo(() => {
    if (analyticsScope === "Daily") {
      const prevKey = toYMD(new Date(new Date(analyticsDate).setDate(new Date(analyticsDate).getDate() - 1)));
      const prev = analyticsByDay[prevKey] || { mfdi: 0, motion: 0, presence: 0 };
      return { prevMfdi: prev.mfdi ?? 0, prevMotion: prev.motion ?? 0, prevPresence: prev.presence ?? 0 };
    }
    if (analyticsScope === "Weekly") {
      const [yStr, wStr] = analyticsWeek.split("-W");
      const wPrev = Math.max(1, Number(wStr) - 1);
      const prevWk = `${yStr}-W${String(wPrev).padStart(2, "0")}`;
      const prevDates = getDatesInWeek(prevWk);
      const vals = prevDates.map((d) => analyticsByDay[d]).filter(Boolean);
      const avg = (k) => (vals.length ? Math.round(vals.reduce((s, v) => s + (v[k] ?? 0), 0) / vals.length) : 0);
      return { prevMfdi: avg("mfdi"), prevMotion: avg("motion"), prevPresence: avg("presence") };
    }
    const [y, m] = analyticsMonth.split("-").map(Number);
    const prevM = m === 1 ? 12 : m - 1;
    const prevY = m === 1 ? y - 1 : y;
    const prevKey = `${prevY}-${String(prevM).padStart(2, "0")}`;
    const prevDates = getDatesInMonth(prevKey);
    const vals = prevDates.map((d) => analyticsByDay[d]).filter(Boolean);
    const avg = (k) => (vals.length ? Math.round(vals.reduce((s, v) => s + (v[k] ?? 0), 0) / vals.length) : 0);
    return { prevMfdi: avg("mfdi"), prevMotion: avg("motion"), prevPresence: avg("presence") };
  }, [analyticsScope, analyticsDate, analyticsWeek, analyticsMonth, analyticsByDay]);

  function loadFieldsForSelection() {
    if (analyticsScope === "Daily") {
      const v = analyticsByDay[analyticsDate] || { mfdi: 0, motion: 0, presence: 0 };
      setMfdi(v.mfdi ?? 0);
      setMotion(v.motion ?? 0);
      setPresence(v.presence ?? 0);
    } else if (analyticsScope === "Weekly") {
      const dates = getDatesInWeek(analyticsWeek);
      const vals = dates.map((d) => analyticsByDay[d]).filter(Boolean);
      const avg = (key) => (vals.length ? Math.round(vals.reduce((s, v) => s + (v[key] ?? 0), 0) / vals.length) : 0);
      setMfdi(avg("mfdi"));
      setMotion(avg("motion"));
      setPresence(avg("presence"));
    } else {
      const dates = getDatesInMonth(analyticsMonth);
      const vals = dates.map((d) => analyticsByDay[d]).filter(Boolean);
      const avg = (key) => (vals.length ? Math.round(vals.reduce((s, v) => s + (v[key] ?? 0), 0) / vals.length) : 0);
      setMfdi(avg("mfdi"));
      setMotion(avg("motion"));
      setPresence(avg("presence"));
    }
  }
  useMemo(loadFieldsForSelection, [analyticsScope, analyticsDate, analyticsWeek, analyticsMonth, analyticsByDay]);

  function saveAnalyticsForSelection() {
    if (analyticsScope === "Daily") {
      setAnalyticsByDay((prev) => ({
        ...prev,
        [analyticsDate]: { mfdi: clampPct(mfdi), motion: clampPct(motion), presence: clampPct(presence) },
      }));
      alert("Analytics saved for day");
    } else {
      alert("Editing is only allowed in Daily scope");
    }
  }

  const commitAddHours = () => {
    const v = parseFloat(addHours);
    if (!isNaN(v) && v > 0) {
      setMonthlyHours((h) => +(h + v).toFixed(2));
      setAddHours("");
    }
  };

  const readonly = analyticsScope !== "Daily";

  // Card builder with progress outline (via CSS var)
  const StatRow = ({ kind, title, value, prev, trend, color }) => {
    const delta = (value ?? 0) - (prev ?? 0);
    const up = delta >= 0;
    const pct = clampPct(value);
    return (
      <div
        className={`stat-card ${kind}`}
        style={{ ["--pct"]: `${pct * 3.6}` }} // 100% -> 360deg
      >
        <Gauge pct={pct} color={color} />
        <div>
          <div className="stat-title">{title}</div>
          <div style={{ display: "flex", alignItems: "baseline" }}>
            <div className="stat-value">{pct}%</div>
            <div className="stat-delta" style={{ color: up ? "rgba(52,211,153,0.9)" : "rgba(248,113,113,0.9)" }}>
              {up ? "▲" : "▼"} {Math.abs(delta)}%
            </div>
          </div>
          <div style={{ marginTop: 8 }}>
            <SparkBars data={trend} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="growth-wrap fade-in">
      <style>{enhanceStyles}</style>
      <div className="analytics-shell">
        <div className="growth-card" style={{ paddingTop: 18 }}>
          <div className="edge-glow" />
          <div className="header" style={{ textAlign: "left" }}>
            <div className="kicker">Planner</div>
            <div className="growth-title" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
              <span>Analytics</span>
              <span style={{
                fontSize: 12, fontWeight: 800, letterSpacing: .2,
                padding: "8px 12px", borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.16)", background: "rgba(255,255,255,0.10)"
              }}>
                {analyticsScope === "Daily" && new Date(analyticsDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                {analyticsScope === "Weekly" && formatWeekLabel(analyticsWeek)}
                {analyticsScope === "Monthly" && monthLabel(analyticsMonth)}
              </span>
            </div>
          </div>

          {/* Vertical stat stack with border as progress */}
          <div className="analytics-stack">
            <StatRow
              kind="mfdi"
              title="MFDI"
              value={mfdi}
              prev={compareBlock.prevMfdi}
              trend={trend7.mfdiSeq}
              color="#60a5fa"
            />
            <StatRow
              kind="motion"
              title="Motion"
              value={motion}
              prev={compareBlock.prevMotion}
              trend={trend7.motionSeq}
              color="#34d399"
            />
            <StatRow
              kind="presence"
              title="Presence"
              value={presence}
              prev={compareBlock.prevPresence}
              trend={trend7.presenceSeq}
              color="#f59e0b"
            />
          </div>

          {/* Interactive panel (Daily editable, Weekly/Monthly readonly) */}
          <div className={`analytics-panel ${readonly ? "readonly" : ""}`}>
            <AnalyticsPanel
              analyticsScope={analyticsScope}
              setAnalyticsScope={setAnalyticsScope}
              analyticsDate={analyticsDate}
              setAnalyticsDate={setAnalyticsDate}
              analyticsWeek={analyticsWeek}
              setAnalyticsWeek={setAnalyticsWeek}
              analyticsMonth={analyticsMonth}
              setAnalyticsMonth={setAnalyticsMonth}
              mfdi={mfdi}
              setMfdi={readonly ? () => {} : setMfdi}
              motion={motion}
              setMotion={readonly ? () => {} : setMotion}
              presence={presence}
              setPresence={readonly ? () => {} : setPresence}
              monthlyHours={monthlyHours}
              setMonthlyHours={setMonthlyHours}
              addHours={addHours}
              setAddHours={setAddHours}
              clampPct={clampPct}
              pctStyle={pctStyle}
              formatWeekLabel={formatWeekLabel}
              monthLabel={monthLabel}
              saveAnalyticsForSelection={saveAnalyticsForSelection}
              commitAddHours={commitAddHours}
            />
          </div>

          {/* Footer summary */}
          <div className="actions" style={{ justifyContent: "space-between", marginTop: 14 }}>
            <div className="btn small" style={{ cursor: "default" }}>
              Last 7-day averages • MFDI {average(trend7.mfdiSeq)}% • Motion {average(trend7.motionSeq)}% • Presence {average(trend7.presenceSeq)}%
            </div>
            <button className="btn" onClick={() => window.history.back()}>Back</button>
          </div>
        </div>
      </div>
    </div>
  );
}
