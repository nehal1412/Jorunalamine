import { useMemo, useState } from "react";
import Calendar from "react-calendar";
import GrowthPage from "./Pages/GrowthPage.jsx";

const styles = `
:root{
  --beige: #f5e9d4;
  --beige-strong: #efd9b7;
  --ink-dark: #111827;
  --ink: #e5e7eb;
  --muted: #cbd5e1;
  --brand: #60a5fa;
}

/* Buttons (safety) */
.btn{
  border:1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.08);
  color: var(--ink);
  padding:10px 14px; border-radius:999px; font-weight:700; cursor:pointer;
  transition: all .18s ease;
}
.btn:hover{ background: rgba(255,255,255,0.14); }
.btn.primary{ background: var(--brand); color:#0b1220; border-color: transparent; }
.btn.primary:hover{ filter:brightness(.96); }

/* Big date */
.big-wrap{ min-height: 60vh; display:grid; place-items:center; margin: 26px 0 28px; }
.big-date{
  display:grid; place-items:center; text-align:center;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.10);
  border-radius: 28px; padding: 32px 28px; width:min(980px, 92vw);
  box-shadow: 0 24px 80px rgba(0,0,0,0.38);
  cursor: pointer; transition: transform .22s ease, background .22s ease;
  animation: cardFloat 6s ease-in-out infinite;
}
@keyframes cardFloat{ 0%,100%{ transform: translateY(0);} 50%{ transform: translateY(-6px);} }
.big-date-heading{
  font-weight: 900; font-size: clamp(40px, 9vw, 120px); line-height: 1;
  letter-spacing: -1px; color: var(--beige);
  text-shadow: 0 2px 14px rgba(0,0,0,0.5);
  background: linear-gradient(120deg, rgba(245,233,212,1) 20%, rgba(255,255,255,0.9) 45%, rgba(245,233,212,1) 70%) no-repeat;
  background-size: 200% 100%;
  -webkit-background-clip: text; background-clip: text;
  animation: auroraText 3.2s ease-in-out infinite;
}
@keyframes auroraText { 0%{ background-position: 200% 0; } 50%{ background-position: 100% 0; } 100%{ background-position: 0% 0; } }

/* Chooser */
.chooser{ display:grid; gap: 16px; margin: 16px 0 32px; grid-template-columns: repeat(12, 1fr); }
.tile{
  grid-column: span 4; position:relative; overflow:hidden;
  background: rgba(255,255,255,0.08);
  border:1px solid rgba(255,255,255,0.10);
  border-radius: 20px; padding: 22px; box-shadow: 0 20px 60px rgba(0,0,0,0.35);
  transition: transform .18s ease, background .18s ease; cursor: pointer;
}
.tile:hover{ transform: translateY(-2px); background: rgba(255,255,255,0.1); }
.tile-title{ color:#fff; font-weight:900; font-size: 22px; letter-spacing: .2px; }
.tile-sub{ color: var(--muted); margin-top: 6px; }
@media (max-width: 1100px){ .tile{ grid-column: span 6; } }
@media (max-width: 720px){ .tile{ grid-column: span 12; } }

/* Calendar */
.calendar-actions{ display:flex; gap:10px; justify-content:center; margin-bottom: 10px; }
.calendar-shell{ display:grid; place-items:center; margin-bottom: 40px; animation: cfade .28s ease both; }
@keyframes cfade { from{ opacity:0; transform: scale(.985);} to{ opacity:1; transform:none;} }

.react-calendar {
  width: min(980px,96vw); border: none; background: rgba(255,255,255,0.06);
  border-radius: 14px; padding: 10px; color:#e5e7eb;
  box-shadow: 0 12px 36px rgba(0,0,0,0.28); border: 1px solid rgba(255,255,255,0.10);
  backdrop-filter: blur(4px);
}
.react-calendar__navigation {
  display: flex; align-items: center; gap: 8px; margin-bottom: 8px; padding: 8px; border-radius: 12px;
  background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.10);
}
.react-calendar__navigation button { min-width: 40px; background: transparent; border: 0; font-size: 14px; padding: 8px 10px; color: #e5e7eb; border-radius: 10px; transition: all .18s ease; }
.react-calendar__navigation button:enabled:hover { background: rgba(255,255,255,0.08); }
.react-calendar__navigation__label { flex: 1; text-align: center; font-weight: 600; letter-spacing: .2px; }

.react-calendar__month-view__weekdays { text-transform: uppercase; font-size: 11px; color: #94a3b8; letter-spacing: .6px; padding: 6px 0; }
.react-calendar__month-view__weekdays__weekday { padding: 6px; }
.react-calendar__month-view__weekdays__weekday abbr[title] { text-decoration: none; }

.react-calendar__month-view__days { gap: 6px; padding: 6px; }
.react-calendar__tile {
  position: relative; padding: 12px 6px; border-radius: 12px; transition: all .18s ease;
  background: var(--beige); color: var(--ink-dark); box-shadow: inset 0 0 0 1px rgba(0,0,0,0.04);
}
.react-calendar__tile:enabled:hover { background: var(--beige-strong); transform: translateY(-1px); }
.react-calendar__month-view__days__day--neighboringMonth { filter: grayscale(20%) opacity(.8); }
.react-calendar__tile--now { background: var(--beige); box-shadow: inset 0 0 0 2px rgba(96,165,250,0.55); color: var(--ink-dark); }
.react-calendar__tile--active { background: var(--beige-strong); color: var(--ink-dark); box-shadow: inset 0 0 0 2px rgba(17,24,39,0.75), 0 6px 14px rgba(0,0,0,0.18); }
.day-badge { position: absolute; right: 6px; top: 6px; min-width: 18px; height: 18px; border-radius: 9px; background: rgba(17,24,39,.08); color: var(--ink-dark); font-size: 11px; line-height: 18px; text-align: center; font-weight: 700; padding: 0 6px; }
.selected-text{ margin-top:10px; color:#cbd5e1; font-size:14px; text-align:center; }
`;

function formatLong(date) {
  return date.toLocaleDateString("en-IN", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });
}

export default function CalendarPage() {
  const [mode, setMode] = useState("date"); // 'date' | 'chooser' | 'calendar'
  const [value, setValue] = useState(new Date());
  const [showGrowth, setShowGrowth] = useState(false);

  const countsByDate = useMemo(() => {
    const map = new Map();
    const now = new Date();
    [1, 3, 8, 12, 17, 21, 27].forEach((d, i) => {
      const dt = new Date(now.getFullYear(), now.getMonth(), d);
      map.set(dt.toDateString(), (i % 3) + 1);
    });
    return map;
  }, []);

  return (
    <div>
      <style>{styles}</style>

      {showGrowth && (
        <GrowthPage
          dateLabel={formatLong(value)}
          onBack={() => setShowGrowth(false)}
        />
      )}

      {!showGrowth && (
        <>
          {mode === "date" && (
            <div className="big-wrap">
              <div className="big-date" onClick={() => setMode("chooser")} role="button" aria-label="Open options">
                <div className="big-date-heading">{formatLong(value)}</div>
              </div>
              <div style={{ marginTop: 14 }}>
                <button className="btn" onClick={() => setMode("calendar")}>Open Calendar</button>
              </div>
            </div>
          )}

          {mode === "chooser" && (
            <div className="fade-in">
              <div style={{ display:"flex", justifyContent:"center", gap:10, margin:"10px 0 14px" }}>
                <button className="btn" onClick={() => setMode("date")}>Back</button>
                <button className="btn" onClick={() => setMode("calendar")}>Calendar</button>
              </div>
              <div className="chooser">
                <div className="tile" onClick={() => alert("Open Health entry for " + formatLong(value))}>
                  <div className="tile-title">Health</div>
                  <div className="tile-sub">Sleep • Workout • Energy</div>
                </div>
                <div className="tile" onClick={() => alert("Open Expense entry for " + formatLong(value))}>
                  <div className="tile-title">Expense</div>
                  <div className="tile-sub">Spend • Save • Notes</div>
                </div>
                <div className="tile" onClick={() => setShowGrowth(true)}>
                  <div className="tile-title">Growth</div>
                  <div className="tile-sub">Deep Work • Learning • Wins</div>
                </div>
              </div>
            </div>
          )}

          {mode === "calendar" && (
            <div className="fade-in">
              <div className="calendar-actions">
                <button className="btn" onClick={() => setMode("date")}>Back to Today</button>
                <button className="btn primary" onClick={() => setMode("chooser")}>Add for {formatLong(value)}</button>
              </div>

              <div className="calendar-shell">
                <Calendar
                  onChange={(val) => setValue(Array.isArray(val) ? val[0] : val)}
                  value={value}
                  calendarType="gregory"
                  locale="en-IN"
                  next2Label={null}
                  prev2Label={null}
                  showNeighboringMonth={false}
                  selectRange={false}
                  tileContent={({ date, view }) =>
                    view === "month" && countsByDate.get(date.toDateString()) ? (
                      <span className="day-badge">{countsByDate.get(date.toDateString())}</span>
                    ) : null
                  }
                />
                <div className="selected-text">
                  Selected: {Array.isArray(value) ? `${value[0].toDateString()} – ${value[1].toDateString()}` : value.toDateString()}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
