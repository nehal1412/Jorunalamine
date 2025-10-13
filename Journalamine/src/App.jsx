import { useState } from "react";
import CalendarPage from "./CalendarPage";
import WellnessScreen from "./Screens/WellneesScreen.jsx"; // fixed path

const theme = `
:root{
  --overlay: linear-gradient(180deg, rgba(3, 7, 18, 0.45) 0%, rgba(3, 7, 18, 0.35) 40%, rgba(3, 7, 18, 0.30) 100%);
  --ink: #e5e7eb;
  --muted: #cbd5e1;
  --brand: #60a5fa;
  --border: rgba(255,255,255,0.1);
}
html,body,#root{height:100%;}
body{
  margin:0;
  color: var(--ink);
  font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Inter, Arial;
  background: var(--overlay), url("/bg.jpg") center/cover no-repeat fixed;
}
.container{ width: min(1200px, 94vw); margin: 0 auto; }
.topbar{
  display:flex; align-items:center; justify-content:space-between;
  padding:16px 0; position: sticky; top:0; z-index:10;
  background: linear-gradient(180deg, rgba(3,7,18,0.55), rgba(3,7,18,0.32));
  backdrop-filter: blur(8px);
}
.logo{ font-weight:900; letter-spacing:.5px; }
.menu{ display:flex; gap:12px; }
.btn{
  border:1px solid var(--border); background: rgba(255,255,255,0.08); color: var(--ink);
  padding:10px 14px; border-radius:999px; font-weight:700; cursor:pointer;
  transition: all .18s ease;
}
.btn:hover{ background: rgba(255,255,255,0.14); }
.btn.primary{ background: var(--brand); color:#0b1220; border-color: transparent; }
.btn.primary:hover{ filter:brightness(.96); }
.switcher{ display:flex; gap:8px; justify-content:flex-end; padding:8px 0 6px; }

/* Animated background overlays */
.bg-layer{ position: fixed; inset:0; pointer-events:none; z-index:0; }

/* Nebula drift */
.nebula-1,.nebula-2,.nebula-3{
  position:absolute; inset:0; mix-blend-mode:screen; opacity:.35;
  filter: blur(30px) saturate(120%);
  background-repeat:no-repeat; background-position:center; background-size:140% 140%;
  will-change: transform;
}
.nebula-1{
  background-image:
    radial-gradient(600px 400px at 15% 20%, rgba(96,165,250,.25), transparent 60%),
    radial-gradient(500px 360px at 80% 10%, rgba(56,189,248,.22), transparent 60%);
  animation: drift1 40s ease-in-out infinite alternate;
}
.nebula-2{
  background-image:
    radial-gradient(700px 480px at 30% 70%, rgba(244,114,182,.18), transparent 65%),
    radial-gradient(520px 360px at 75% 60%, rgba(167,139,250,.18), transparent 60%);
  animation: drift2 55s ease-in-out infinite alternate;
}
.nebula-3{
  background-image:
    radial-gradient(900px 540px at 50% 30%, rgba(34,197,94,.12), transparent 70%),
    radial-gradient(700px 460px at 60% 80%, rgba(253,224,71,.10), transparent 65%);
  animation: drift3 75s ease-in-out infinite alternate;
}
@keyframes drift1{from{transform:translate3d(-2%,-1%,0) scale(1.02);}to{transform:translate3d(2%,1%,0) scale(1.06);}}
@keyframes drift2{from{transform:translate3d(1%,-2%,0)  scale(1.03);}to{transform:translate3d(-1%,2%,0) scale(1.07);}}
@keyframes drift3{from{transform:translate3d(-1%,2%,0)  scale(1.01);}to{transform:translate3d(1%,-2%,0) scale(1.05);}}

/* Twinkling stars */
.stars, .stars2{
  position:absolute; inset:0; background-repeat: repeat;
  background-size: 600px 600px; opacity:.5; pointer-events:none;
  mix-blend-mode: screen; filter: saturate(120%);
  will-change: opacity, transform;
}
.stars{
  background-image:
    radial-gradient(1px 1px at 20% 30%, rgba(255,255,255,.7), rgba(255,255,255,0) 60%),
    radial-gradient(1px 1px at 70% 80%, rgba(255,255,255,.6), rgba(255,255,255,0) 60%),
    radial-gradient(1px 1px at 40% 60%, rgba(255,255,255,.65), rgba(255,255,255,0) 60%);
  animation: twinkle 6s ease-in-out infinite;
}
.stars2{
  background-image:
    radial-gradient(1px 1px at 10% 20%, rgba(255,255,255,.55), rgba(255,255,255,0) 60%),
    radial-gradient(1px 1px at 80% 40%, rgba(255,255,255,.5), rgba(255,255,255,0) 60%),
    radial-gradient(1px 1px at 50% 10%, rgba(255,255,255,.6), rgba(255,255,255,0) 60%);
  animation: twinkle 7.5s ease-in-out infinite reverse;
}
@keyframes twinkle{
  0%,100%{ opacity:.45; transform: translateY(0); }
  50%{ opacity:.7; transform: translateY(-0.6%); }
}

/* Aurora */
.aurora{
  position:absolute; inset:-10% -10% -10% -10%;
  background: conic-gradient(from 220deg at 50% 50%,
    rgba(96,165,250,.18),
    rgba(167,139,250,.14),
    rgba(244,114,182,.12),
    rgba(96,165,250,.18));
  filter: blur(60px) saturate(140%);
  opacity:.28; mix-blend-mode: screen; pointer-events:none;
  animation: auroraWave 50s linear infinite;
  will-change: transform;
}
@keyframes auroraWave{
  0%{   transform: translate3d(-2%,0,0) rotate(0deg)   scale(1.05); }
  50%{  transform: translate3d( 2%,0,0) rotate(180deg) scale(1.07); }
  100%{ transform: translate3d(-2%,0,0) rotate(360deg) scale(1.05); }
}

/* Conic surge */
.conic-surge{
  position:absolute; inset:0; mix-blend-mode:screen; opacity:.22;
  background:
    radial-gradient(60% 60% at 50% 50%, rgba(255,255,255,.06), transparent 60%),
    conic-gradient(from 90deg at 50% 50%,
      rgba(59,130,246,.14), rgba(99,102,241,.12),
      rgba(236,72,153,.10), rgba(59,130,246,.14));
  filter: blur(50px) saturate(130%);
  animation: surge 80s linear infinite;
  will-change: transform;
}
@keyframes surge{ from{ transform: rotate(0deg) scale(1.02);} to{ transform: rotate(360deg) scale(1.06);} }
`;

export default function App() {
  const [view, setView] = useState("calendar"); // "calendar" | "wellness"

  return (
    <div>
      <style>{theme}</style>

      {/* Animated background overlays */}
      <div className="bg-layer">
        <div className="nebula-1" />
        <div className="nebula-2" />
        <div className="nebula-3" />
        <div className="stars" />
        <div className="stars2" />
        <div className="aurora" />
        <div className="conic-surge" />
      </div>

      <div className="container topbar">
        <div className="logo">Journalamine</div>
      </div>

      <div className="container">
        <div className="switcher">
          <button className={`btn ${view === "calendar" ? "primary" : ""}`} onClick={() => setView("calendar")}>Calendar</button>
          <button className={`btn ${view === "wellness" ? "primary" : ""}`} onClick={() => setView("wellness")}>Wellness</button>
        </div>

        {view === "calendar" ? <CalendarPage /> : <WellnessScreen />}
      </div>
    </div>
  );
}
