// src/pages/GrowthPage.jsx
import { useMemo, useState } from "react";

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&display=swap');
:root{
  --beige: #f5e9d4;
  --beige-weak: #f1e2c9;
  --beige-soft: #e9d6b8;
  --ink-dark: #0b1020;
}
.bg-video{
  position: fixed; inset:0; z-index:-2; object-fit: cover; width:100%; height:100%;
  filter: saturate(110%) contrast(105%) brightness(80%);
}
.growth-wrap{ min-height: 58vh; display:grid; place-items:center; margin: 24px 0 32px; }
.growth-card{
  position: relative;
  background: linear-gradient(180deg, rgba(10,15,28,0.50), rgba(10,15,28,0.42));
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 22px; padding: 26px; width:min(1040px, 96vw);
  box-shadow: 0 28px 90px rgba(0,0,0,0.48), inset 0 0 0 1px rgba(255,255,255,0.06);
  overflow: hidden;
}
.edge-glow{
  pointer-events:none; position:absolute; inset:-2px;
  background:
    radial-gradient(800px 220px at 50% -40px, rgba(245,233,212,0.12), transparent 70%),
    radial-gradient(900px 260px at 50% 110%, rgba(245,233,212,0.10), transparent 70%);
  animation: floatGlow 18s ease-in-out infinite alternate;
}
@keyframes floatGlow{ from{ transform: translateY(-2px) } to{ transform: translateY(2px) } }
.header{ text-align:center; margin-bottom: 10px; position: relative; z-index: 1; }
.kicker{
  color: var(--beige-soft); letter-spacing: 1.6px; text-transform: uppercase;
  font-weight: 800; font-size: 12px;
}
.growth-title{
  font-family: "Playfair Display", ui-serif, Georgia, Cambria, "Times New Roman", serif;
  color: var(--beige);
  font-weight: 900; letter-spacing: 0px;
  font-size: clamp(28px, 5vw, 56px); line-height: 1.05;
  text-shadow: 0 2px 18px rgba(245,233,212,0.16);
}
.scope-wrap{ display:flex; justify-content:center; }
.scope-row{
  display:flex; gap:10px; justify-content:center; flex-wrap: wrap; margin: 14px 0 18px;
  padding: 6px; border-radius: 999px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.10);
  box-shadow: inset 0 0 0 1px rgba(255,255,255,0.05);
}
.scope-btn{
  background: var(--beige); color: var(--ink-dark);
  border: 1px solid rgba(0,0,0,0.08);
  padding: 10px 18px; border-radius: 999px; font-weight: 900; cursor: pointer;
  transition: transform .16s ease, filter .16s ease, box-shadow .16s ease;
  font-size: 13px; letter-spacing: .2px;
  position: relative;
}
.scope-btn:hover{ transform: translateY(-1px); filter: brightness(0.98); }
.scope-btn.active{ box-shadow: 0 16px 36px rgba(245,233,212,0.34); }
.section-title{
  color: var(--beige); font-weight: 800; letter-spacing: .2px;
  font-size: 14px; margin: 14px 6px 8px;
  text-transform: uppercase;
}
.mount-enter{ animation: slideIn .28s ease both; }
@keyframes slideIn { from{ opacity:0; transform: translateY(10px) scale(.98);} to{ opacity:1; transform:none;} }
.list{ display:grid; gap: 12px; margin: 10px 0 16px; }
.row{
  display:grid; grid-template-columns: 260px 1fr 1.2fr auto; gap: 12px; align-items: start;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 16px; padding: 12px;
  box-shadow: 0 14px 36px rgba(0,0,0,0.22);
  transition: transform .18s ease, background .18s ease, box-shadow .18s ease;
}
.row:hover{ transform: translateY(-2px); background: rgba(255,255,255,0.08); box-shadow: 0 18px 46px rgba(0,0,0,0.26); }
@media (max-width: 960px){
  .row{ grid-template-columns: 1fr; }
  .cell-actions{ justify-content: flex-end; }
}
.toggle-cluster{ display:flex; align-items:center; gap:10px; flex-wrap: wrap; }
.label-chip{
  color: var(--beige-soft); font-weight:700; font-size: 12px; letter-spacing: .2px;
}
.task-toggle{
  display:flex; align-items:center; gap:10px;
  background: rgba(255,255,255,0.10);
  border: 1px solid rgba(255,255,255,0.16);
  border-radius: 999px; padding: 8px 10px; color: var(--beige);
  cursor: pointer; user-select: none; justify-content:center;
  box-shadow: inset 0 0 0 1px rgba(255,255,255,0.06);
  position: relative; overflow: hidden;
}
.task-toggle input{ display:none; }
.knob{
  width: 40px; height: 22px; border-radius: 12px; background: rgba(255,255,255,0.22);
  position: relative; transition: background .16s ease; box-shadow: inset 0 0 0 1px rgba(0,0,0,0.08);
}
.dot{
  position:absolute; top: 3px; left: 3px; width: 16px; height: 16px; border-radius: 8px;
  background: var(--beige); transition: left .16s ease; box-shadow: 0 4px 10px rgba(245,233,212,0.35);
}
.on .knob{ background: rgba(46,204,113,0.55); }
.on .dot{ left: 21px; }
.time-chip{
  background: rgba(245,233,212,0.18); color: var(--beige);
  border: 1px solid rgba(245,233,212,0.32);
  border-radius: 999px; padding: 6px 10px; font-size: 12px;
  box-shadow: 0 6px 14px rgba(245,233,212,0.18);
}
.field, .area{
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 14px; padding: 10px 12px; color: var(--beige);
  box-shadow: inset 0 0 0 1px rgba(255,255,255,0.06);
}
input[type="text"], input[type="number"], input[type="date"], input[type="week"], input[type="month"]{
  width: 100%; background: transparent; color: var(--beige); border: none; outline: none;
  font-family: inherit; font-size: 14px;
}
textarea{
  width: 100%; min-height: 86px; resize: vertical; background: transparent; color: var(--beige); border: none; outline: none;
  font-family: inherit; font-size: 14px;
}
.actions{ display:flex; gap:10px; justify-content:flex-end; margin-top: 10px; }
.inline-actions{ display:flex; gap:8px; }
.btn{
  border:1px solid rgba(255,255,255,0.16);
  background: rgba(255,255,255,0.10); color: var(--beige);
  padding:10px 14px; border-radius:999px; font-weight:800; cursor:pointer;
  transition: all .18s ease; letter-spacing: .2px;
}
.btn.small{ padding:6px 10px; font-size: 12px; }
.btn:hover{ background: rgba(255,255,255,0.14); transform: translateY(-1px); }
.btn.primary{
  background: var(--beige); color: var(--ink-dark); border-color: rgba(0,0,0,0.06);
  box-shadow: 0 12px 28px rgba(245,233,212,0.28);
}
.btn.primary:hover{ filter: brightness(.98); transform: translateY(-1px); }
.progress-track{
  width: 100%; height: 10px; border-radius: 999px; background: rgba(255,255,255,0.14);
  overflow: hidden; position: relative; box-shadow: inset 0 0 2px rgba(0,0,0,0.25);
}
.progress-fill{
  height: 100%; background: linear-gradient(90deg, #7dd56f, #2ecc71);
  transition: width .18s ease; border-radius: 999px;
}
.fade-in{ animation: fade .24s ease both; }
@keyframes fade{ from{opacity:0; transform: translateY(6px);} to{opacity:1; transform:none;} }
`;

// Formatting helpers
function formatLong(date) {
  return date.toLocaleDateString("en-IN", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });
}
function formatTimeStamp(d) {
  return d.toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

// ISO week helpers: compute Monday–Sunday range for YYYY-Www
function isoWeekRange(isoWeekStr) {
  const [yearStr, weekStrRaw] = isoWeekStr.split("-W");
  const year = parseInt(yearStr, 10);
  const week = parseInt(weekStrRaw, 10);
  const jan4 = new Date(Date.UTC(year, 0, 4));
  const jan4Day = jan4.getUTCDay() || 7; // 1..7 (Mon..Sun)
  const week1Monday = new Date(jan4);
  week1Monday.setUTCDate(jan4.getUTCDate() - (jan4Day - 1));
  const start = new Date(week1Monday);
  start.setUTCDate(week1Monday.getUTCDate() + (week - 1) * 7);
  const end = new Date(start);
  end.setUTCDate(start.getUTCDate() + 6);
  return { start, end };
}
function formatWeekLabel(isoWeekStr, locale = "en-IN") {
  const { start, end } = isoWeekRange(isoWeekStr);
  const fmt = new Intl.DateTimeFormat(locale, { month: "short", day: "numeric" });
  const fmtY = new Intl.DateTimeFormat(locale, { year: "numeric" });
  const weekNum = isoWeekStr.split("-W")[1];
  return `Week ${weekNum} • ${fmt.format(start)}–${fmt.format(end)}, ${fmtY.format(end)}`;
}
// Get current ISO week in YYYY-Www
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
// Month helpers
function monthLabel(ym, locale = "en-IN") {
  const [y, m] = ym.split("-").map(Number);
  const d = new Date(y, m - 1, 1);
  return d.toLocaleDateString(locale, { month: "long", year: "numeric" });
}
function daysInMonth(ym) {
  const [y, m] = ym.split("-").map(Number);
  return new Date(y, m, 0).getDate();
}
// Date formatting to YYYY-MM-DD
function toYMD(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function GrowthPage() {
  const [now] = useState(() => new Date());
  const dateLabel = useMemo(() => formatLong(now), [now]);

  const [scope, setScope] = useState("Daily");

  // Daily: fixed three tasks
  const [dailyTasks, setDailyTasks] = useState([
    { done: false, title: "", notes: "", doneAt: null },
    { done: false, title: "", notes: "", doneAt: null },
    { done: false, title: "", notes: "", doneAt: null },
  ]);

  // Weekly: dynamic
  const [weeklyWeek, setWeeklyWeek] = useState(() => currentIsoWeekString());
  const weeklyLabel = useMemo(() => formatWeekLabel(weeklyWeek), [weeklyWeek]);
  const [weeklyGoals, setWeeklyGoals] = useState([]);
  const addWeeklyGoal = () => {
    setWeeklyGoals((prev) => [
      ...prev,
      { id: crypto.randomUUID(), done: false, title: "", notes: "", doneAt: null },
    ]);
  };
  const removeWeeklyGoal = (id) => setWeeklyGoals((p) => p.filter((g) => g.id !== id));
  const toggleWeekly = (id) =>
    setWeeklyGoals((p) =>
      p.map((g) => (g.id === id ? { ...g, done: !g.done, doneAt: !g.done ? new Date().toISOString() : null } : g))
    );
  const setWeeklyTitle = (id, val) => setWeeklyGoals((p) => p.map((g) => (g.id === id ? { ...g, title: val } : g)));
  const setWeeklyNotes = (id, val) => setWeeklyGoals((p) => p.map((g) => (g.id === id ? { ...g, notes: val } : g)));

  // Monthly: dynamic
  const [monthlyGoals, setMonthlyGoals] = useState([]);
  const addMonthlyGoal = () => {
    setMonthlyGoals((prev) => [
      ...prev,
      { id: crypto.randomUUID(), done: false, title: "", notes: "", doneAt: null },
    ]);
  };
  const removeMonthlyGoal = (id) => setMonthlyGoals((p) => p.filter((g) => g.id !== id));
  const toggleMonthly = (id) =>
    setMonthlyGoals((p) =>
      p.map((g) => (g.id === id ? { ...g, done: !g.done, doneAt: !g.done ? new Date().toISOString() : null } : g))
    );
  const setMonthlyTitle = (id, val) => setMonthlyGoals((p) => p.map((g) => (g.id === id ? { ...g, title: val } : g)));
  const setMonthlyNotes = (id, val) => setMonthlyGoals((p) => p.map((g) => (g.id === id ? { ...g, notes: val } : g)));

  // Analytics storage: values keyed by date YYYY-MM-DD
  const todayYMD = toYMD(new Date());
  const [analyticsByDay, setAnalyticsByDay] = useState({
    // Example seed; real app would persist/load
    // [todayYMD]: { mfdi: 60, motion: 50, presence: 70 }
  });

  // Analytics UI state
  const [analyticsScope, setAnalyticsScope] = useState("Daily"); // Daily | Weekly | Monthly
  const [analyticsDate, setAnalyticsDate] = useState(todayYMD); // yyyy-mm-dd
  const [analyticsWeek, setAnalyticsWeek] = useState(() => currentIsoWeekString()); // yyyy-Www
  const [analyticsMonth, setAnalyticsMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`; // yyyy-mm
  });

  // Editing fields (bound to current selection)
  const [mfdi, setMfdi] = useState(0);
  const [motion, setMotion] = useState(0);
  const [presence, setPresence] = useState(0);

  // Monthly hours accumulator
  const [monthlyHours, setMonthlyHours] = useState(0);
  const [addHours, setAddHours] = useState("");

  const clampPct = (n) => Math.max(0, Math.min(100, Number.isFinite(+n) ? +n : 0));
  const pctStyle = (n) => ({ width: `${clampPct(n)}%` });

  // Helpers for ranges
  function getDatesInWeek(isoWeekStr) {
    const { start } = isoWeekRange(isoWeekStr);
    const out = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setUTCDate(start.getUTCDate() + i);
      out.push(toYMD(new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))); // normalize to local YMD
    }
    return out;
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

  // Load current selection values into edit fields when selection changes
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

  // On mount and when selection changes
  useMemo(loadFieldsForSelection, [analyticsScope, analyticsDate, analyticsWeek, analyticsMonth, analyticsByDay]);

  // Commit current edit fields into the data store
  function saveAnalyticsForSelection() {
    if (analyticsScope === "Daily") {
      setAnalyticsByDay((prev) => ({
        ...prev,
        [analyticsDate]: { mfdi: clampPct(mfdi), motion: clampPct(motion), presence: clampPct(presence) },
      }));
    } else if (analyticsScope === "Weekly") {
      // Distribute weekly average back to each day that exists, or create entries
      const dates = getDatesInWeek(analyticsWeek);
      setAnalyticsByDay((prev) => {
        const next = { ...prev };
        dates.forEach((d) => {
          next[d] = { mfdi: clampPct(mfdi), motion: clampPct(motion), presence: clampPct(presence) };
        });
        return next;
      });
    } else {
      const dates = getDatesInMonth(analyticsMonth);
      setAnalyticsByDay((prev) => {
        const next = { ...prev };
        dates.forEach((d) => {
          next[d] = { mfdi: clampPct(mfdi), motion: clampPct(motion), presence: clampPct(presence) };
        });
        return next;
      });
    }
    alert("Analytics saved");
  }

  const commitAddHours = () => {
    const v = parseFloat(addHours);
    if (!isNaN(v) && v > 0) {
      setMonthlyHours((h) => +(h + v).toFixed(2));
      setAddHours("");
    }
  };

  // Daily helpers
  const toggleDaily = (idx) =>
    setDailyTasks((prev) => {
      const next = [...prev];
      const c = next[idx];
      const done = !c.done;
      next[idx] = { ...c, done, doneAt: done ? new Date().toISOString() : null };
      return next;
    });
  const setDailyTitle = (idx, val) =>
    setDailyTasks((p) => {
      const n = [...p]; n[idx] = { ...n[idx], title: val }; return n;
    });
  const setDailyNotes = (idx, val) =>
    setDailyTasks((p) => {
      const n = [...p]; n[idx] = { ...n[idx], notes: val }; return n;
    });

  const handleBack = () => { if (window.history.length > 1) window.history.back(); };
  const handleSave = () => {
    const payload = {
      date: dateLabel,
      scope,
      weeklyKey: weeklyWeek,
      weeklyRange: isoWeekRange(weeklyWeek),
      daily: dailyTasks,
      weekly: weeklyGoals,
      monthly: monthlyGoals,
      analytics: {
        scope: analyticsScope,
        date: analyticsDate,
        week: analyticsWeek,
        month: analyticsMonth,
        mfdi: clampPct(mfdi),
        motion: clampPct(motion),
        presence: clampPct(presence),
        monthlyHours,
        byDay: analyticsByDay
      }
    };
    console.log("Growth entry:", payload);
    alert("Saved");
  };

  return (
    <div className="growth-wrap fade-in">
      <style>{styles}</style>

      <video className="bg-video" autoPlay muted loop playsInline>
        <source src="/bg.mp4" type="video/mp4" />
      </video>

      <div className="growth-card">
        <div className="edge-glow" />

        <div className="header">
          <div className="kicker">Planner</div>
          <div className="growth-title">Growth for {dateLabel}</div>
        </div>

        <div className="scope-wrap">
          <div className="scope-row">
            {["Daily", "Weekly", "Monthly", "Analytics", "Long Term"].map((s) => (
              <button
                key={s}
                className={`scope-btn ${scope === s ? "active" : ""}`}
                onClick={() => setScope(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {scope === "Daily" && (
          <div className="mount-enter">
            <div className="section-title">Daily tasks</div>
            <div className="list">
              {dailyTasks.map((t, i) => (
                <div key={i} className="row">
                  <div className="toggle-cluster">
                    <span className="label-chip">Task {i + 1}</span>
                    <label className={`task-toggle ${t.done ? "on" : ""}`} onClick={() => toggleDaily(i)}>
                      <span className="knob"><span className="dot" /></span>
                      <input type="checkbox" checked={t.done} readOnly />
                    </label>
                    {t.doneAt && <span className="time-chip">{formatTimeStamp(new Date(t.doneAt))}</span>}
                  </div>
                  <div className="field">
                    <input type="text" placeholder="Title" value={t.title} onChange={(e) => setDailyTitle(i, e.target.value)} />
                  </div>
                  <div className="area">
                    <textarea placeholder="Notes / details" value={t.notes} onChange={(e) => setDailyNotes(i, e.target.value)} />
                  </div>
                  <div className="cell-actions" />
                </div>
              ))}
            </div>
          </div>
        )}

        {scope === "Weekly" && (
          <div className="mount-enter">
            <div className="section-title">Weekly goals</div>

            <div className="actions" style={{ justifyContent: "flex-start", marginBottom: 8, gap: 12 }}>
              <label className="btn small" style={{ cursor: "default" }}>
                <span style={{ marginRight: 8 }}>Select week</span>
                <input
                  type="week"
                  value={weeklyWeek}
                  onChange={(e) => setWeeklyWeek(e.target.value)}
                  style={{ background: "transparent", border: "none", color: "inherit" }}
                />
              </label>

              <div className="btn small" style={{ cursor: "default" }}>
                {weeklyLabel}
              </div>

              <button className="btn primary small" onClick={addWeeklyGoal}>+ Add weekly goal</button>
            </div>

            <div className="list">
              {weeklyGoals.length === 0 && (
                <div className="field">No weekly goals yet. Use “+ Add weekly goal”.</div>
              )}
              {weeklyGoals.map((g) => (
                <div key={g.id} className="row">
                  <div className="toggle-cluster">
                    <span className="label-chip">Goal</span>
                    <label className={`task-toggle ${g.done ? "on" : ""}`} onClick={() => toggleWeekly(g.id)}>
                      <span className="knob"><span className="dot" /></span>
                      <input type="checkbox" checked={g.done} readOnly />
                    </label>
                    {g.doneAt && <span className="time-chip">{formatTimeStamp(new Date(g.doneAt))}</span>}
                  </div>
                  <div className="field">
                    <input
                      type="text"
                      placeholder="Goal title"
                      value={g.title}
                      onChange={(e) => setWeeklyTitle(g.id, e.target.value)}
                    />
                  </div>
                  <div className="area">
                    <textarea
                      placeholder="Notes / details"
                      value={g.notes}
                      onChange={(e) => setWeeklyNotes(g.id, e.target.value)}
                    />
                  </div>
                  <div className="cell-actions inline-actions">
                    <button className="btn small" onClick={() => removeWeeklyGoal(g.id)}>Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {scope === "Monthly" && (
          <div className="mount-enter">
            <div className="section-title">Monthly goals</div>
            <div className="actions" style={{ justifyContent: "flex-start", marginBottom: 8 }}>
              <button className="btn primary small" onClick={addMonthlyGoal}>+ Add monthly goal</button>
            </div>
            <div className="list">
              {monthlyGoals.length === 0 && (
                <div className="field">No monthly goals yet. Use “+ Add monthly goal”.</div>
              )}
              {monthlyGoals.map((g) => (
                <div key={g.id} className="row">
                  <div className="toggle-cluster">
                    <span className="label-chip">Goal</span>
                    <label className={`task-toggle ${g.done ? "on" : ""}`} onClick={() => toggleMonthly(g.id)}>
                      <span className="knob"><span className="dot" /></span>
                      <input type="checkbox" checked={g.done} readOnly />
                    </label>
                    {g.doneAt && <span className="time-chip">{formatTimeStamp(new Date(g.doneAt))}</span>}
                  </div>
                  <div className="field">
                    <input type="text" placeholder="Goal title" value={g.title} onChange={(e) => setMonthlyTitle(g.id, e.target.value)} />
                  </div>
                  <div className="area">
                    <textarea placeholder="Notes / details" value={g.notes} onChange={(e) => setMonthlyNotes(g.id, e.target.value)} />
                  </div>
                  <div className="cell-actions inline-actions">
                    <button className="btn small" onClick={() => removeMonthlyGoal(g.id)}>Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {scope === "Analytics" && (
          <div className="mount-enter">
            <div className="section-title">Analytics</div>

            {/* Granularity + pickers + selected label */}
            <div className="actions" style={{ justifyContent: "flex-start", marginBottom: 8, gap: 12 }}>
              {["Daily", "Weekly", "Monthly"].map((g) => (
                <button
                  key={g}
                  className={`btn small ${analyticsScope === g ? "primary" : ""}`}
                  onClick={() => setAnalyticsScope(g)}
                >
                  {g}
                </button>
              ))}

              {analyticsScope === "Daily" && (
                <label className="btn small" style={{ cursor: "default" }}>
                  <span style={{ marginRight: 8 }}>Date</span>
                  <input
                    type="date"
                    value={analyticsDate}
                    onChange={(e) => setAnalyticsDate(e.target.value)}
                  />
                </label>
              )}

              {analyticsScope === "Weekly" && (
                <label className="btn small" style={{ cursor: "default" }}>
                  <span style={{ marginRight: 8 }}>Week</span>
                  <input
                    type="week"
                    value={analyticsWeek}
                    onChange={(e) => setAnalyticsWeek(e.target.value)}
                  />
                </label>
              )}

              {analyticsScope === "Monthly" && (
                <label className="btn small" style={{ cursor: "default" }}>
                  <span style={{ marginRight: 8 }}>Month</span>
                  <input
                    type="month"
                    value={analyticsMonth}
                    onChange={(e) => setAnalyticsMonth(e.target.value)}
                  />
                </label>
              )}

              <div className="btn small" style={{ cursor: "default" }}>
                {analyticsScope === "Daily" && `Selected: ${new Date(analyticsDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`}
                {analyticsScope === "Weekly" && `Selected: ${formatWeekLabel(analyticsWeek)}`}
                {analyticsScope === "Monthly" && `Selected: ${monthLabel(analyticsMonth)}`}
              </div>
            </div>

            {/* Metrics rows show current average (for Weekly/Monthly) or the day's value */}
            <div className="list">
              {/* MFDI */}
              <div className="row">
                <div className="toggle-cluster" style={{ alignItems: "center" }}>
                  <span className="label-chip">MFDI (%)</span>
                </div>
                <div className="field">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    value={mfdi}
                    onChange={(e) => setMfdi(clampPct(e.target.value))}
                    placeholder="0 – 100"
                  />
                </div>
                <div className="area" style={{ display: "flex", alignItems: "center" }}>
                  <div className="progress-track" aria-label="MFDI progress">
                    <div className="progress-fill" style={pctStyle(mfdi)} />
                  </div>
                </div>
                <div className="cell-actions inline-actions">
                  <span className="time-chip">{clampPct(mfdi)}%</span>
                </div>
              </div>

              {/* Motion */}
              <div className="row">
                <div className="toggle-cluster" style={{ alignItems: "center" }}>
                  <span className="label-chip">Motion (%)</span>
                </div>
                <div className="field">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    value={motion}
                    onChange={(e) => setMotion(clampPct(e.target.value))}
                    placeholder="0 – 100"
                  />
                </div>
                <div className="area" style={{ display: "flex", alignItems: "center" }}>
                  <div className="progress-track" aria-label="Motion progress">
                    <div className="progress-fill" style={pctStyle(motion)} />
                  </div>
                </div>
                <div className="cell-actions inline-actions">
                  <span className="time-chip">{clampPct(motion)}%</span>
                </div>
              </div>

              {/* Presence */}
              <div className="row">
                <div className="toggle-cluster" style={{ alignItems: "center" }}>
                  <span className="label-chip">Presence (%)</span>
                </div>
                <div className="field">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    value={presence}
                    onChange={(e) => setPresence(clampPct(e.target.value))}
                    placeholder="0 – 100"
                  />
                </div>
                <div className="area" style={{ display: "flex", alignItems: "center" }}>
                  <div className="progress-track" aria-label="Presence progress">
                    <div className="progress-fill" style={pctStyle(presence)} />
                  </div>
                </div>
                <div className="cell-actions inline-actions">
                  <span className="time-chip">{clampPct(presence)}%</span>
                </div>
              </div>

              {/* Monthly hours accumulator */}
              <div className="row">
                <div className="toggle-cluster" style={{ alignItems: "center" }}>
                  <span className="label-chip">Monthly hours</span>
                </div>
                <div className="field">
                  <input
                    type="number"
                    min="0"
                    step="0.25"
                    value={addHours}
                    onChange={(e) => setAddHours(e.target.value)}
                    placeholder="Add hours (e.g., 1.5)"
                  />
                </div>
                <div className="area" style={{ display: "flex", alignItems: "center" }}>
                  <button className="btn small" onClick={commitAddHours}>Add to total</button>
                </div>
                <div className="cell-actions inline-actions">
                  <span className="time-chip">{monthlyHours.toFixed(2)} h</span>
                </div>
              </div>

              {/* Save analytics changes for current selection */}
              <div className="actions" style={{ justifyContent: "flex-start" }}>
                <button className="btn primary small" onClick={saveAnalyticsForSelection}>Save analytics for selected period</button>
              </div>
            </div>
          </div>
        )}

        {scope === "Long Term" && (
          <div className="mount-enter">
            <div className="section-title">Long-term goals</div>
            <div className="field">Coming soon: structure mirroring monthly with timelines.</div>
          </div>
        )}

        <div className="actions">
          <button className="btn" onClick={handleBack}>Back</button>
          <button className="btn primary" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
}
