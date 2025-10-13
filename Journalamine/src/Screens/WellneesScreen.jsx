import { useEffect, useMemo, useRef, useState } from "react";
import Navbar from "../Components/Navbar";

const pageStyles = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&display=swap');

:root{
  --beige: #f5e9d4;
  --beige-weak: #f1e2c9;
  --beige-soft: #e9d6b8;
  --ink-dark: #0b1020;
}

/* Optional background video (enable if you have /bg.mp4) */
/*
.bg-video{
  position: fixed; inset:0; z-index:-2; object-fit: cover; width:100%; height:100%;
  filter: saturate(110%) contrast(105%) brightness(80%);
}
*/

.wrap{ padding-bottom: 44px; }

/* Section Title */
.section-title{
  font-family: "Playfair Display", ui-serif, Georgia, Cambria, "Times New Roman", serif;
  color: var(--beige);
  font-weight: 900; letter-spacing: 0;
  font-size: clamp(24px, 4.6vw, 44px);
  margin: 10px 0 14px; text-align:center;
  text-shadow: 0 2px 18px rgba(245,233,212,0.16);
}

/* Boards */
.board{
  margin: 18px auto 28px; display:grid; grid-template-columns: repeat(12, 1fr); gap: 16px;
  width: min(1100px, 96vw);
}

/* Cards with glass look */
.card{
  grid-column: span 4;
  background: linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.08));
  border:1px solid rgba(255,255,255,0.14);
  border-radius: 18px; box-shadow: 0 16px 44px rgba(0,0,0,0.28), inset 0 0 0 1px rgba(255,255,255,0.05);
  padding:14px; transition: transform .18s ease, background .18s ease, box-shadow .18s ease;
  position: relative; overflow: hidden;
}
.card:before{
  content:""; position:absolute; inset:auto; top:-30%; left:-10%;
  width: 40%; height: 180%; transform: rotate(25deg);
  background: radial-gradient(closest-side, rgba(255,255,255,0.18), transparent);
  opacity:.0; transition: transform .4s ease, opacity .4s ease;
}
.card:hover{ transform: translateY(-2px); background: rgba(255,255,255,0.10); box-shadow: 0 20px 56px rgba(0,0,0,0.32); }
.card:hover:before{ transform: rotate(25deg) translateX(160%); opacity:.5; }

.card-title{
  color: var(--beige); font-weight:800; margin-bottom:4px; letter-spacing:.2px;
}
.card-sub{ color: var(--beige-soft); font-size:12px; margin-bottom:8px; }
.value{
  font-family: "Playfair Display", ui-serif, Georgia, Cambria, "Times New Roman", serif;
  font-weight:900; font-size: clamp(18px, 3.2vw, 28px); color: var(--beige);
  text-shadow: 0 2px 12px rgba(245,233,212,0.14);
}

/* Responsive */
@media (max-width: 1100px){ .card{ grid-column: span 6; } }
@media (max-width: 720px){ .card{ grid-column: span 12; } }
`;

export default function WellnessScreen() {
  const physicalRef = useRef(null);
  const mentalRef = useRef(null);
  const recreationalRef = useRef(null);
  const [active, setActive] = useState("physical");

  const sections = useMemo(
    () => [
      { id: "physical", label: "Physical" },
      { id: "mental", label: "Mental" },
      { id: "recreational", label: "Recreational" },
    ],
    []
  );

  useEffect(() => {
    const opts = { root: null, rootMargin: "-20% 0px -60% 0px", threshold: 0 };
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) setActive(e.target.id);
      });
    }, opts);
    [physicalRef, mentalRef, recreationalRef].forEach((r) => r.current && obs.observe(r.current));
    return () => obs.disconnect();
  }, []);

  const today = useMemo(() => new Date().toDateString(), []);
  const demo = {
    steps: 8000,
    sleep: "7.5h",
    workout: "Push/Pull",
    mood: 4,
    deepWork: 120,
    stress: 2,
    play: "Cricket nets",
    funTime: "1.0h",
    social: "Tea with friends",
  };

  return (
    <div className="wrap">
      <style>{pageStyles}</style>

      {/* Optional background video
      <video className="bg-video" autoPlay muted loop playsInline>
        <source src="/bg.mp4" type="video/mp4" />
      </video> */}

      <Navbar sections={sections} active={active} />

      <div className="section-title">Daily wellness overview — {today}</div>

      <section id="physical" ref={physicalRef} className="board">
        <div className="card">
          <div className="card-title">Steps</div>
          <div className="card-sub">Movement</div>
          <div className="value">{demo.steps.toLocaleString()}</div>
        </div>
        <div className="card">
          <div className="card-title">Sleep</div>
          <div className="card-sub">Recovery</div>
          <div className="value">{demo.sleep}</div>
        </div>
        <div className="card">
          <div className="card-title">Workout</div>
          <div className="card-sub">Training block</div>
          <div className="value">{demo.workout}</div>
        </div>
      </section>

      <section id="mental" ref={mentalRef} className="board">
        <div className="card">
          <div className="card-title">Mood</div>
          <div className="card-sub">1–5</div>
          <div className="value">{demo.mood}</div>
        </div>
        <div className="card">
          <div className="card-title">Deep work</div>
          <div className="card-sub">Minutes</div>
          <div className="value">{demo.deepWork}</div>
        </div>
        <div className="card">
          <div className="card-title">Stress</div>
          <div className="card-sub">1–5</div>
          <div className="value">{demo.stress}</div>
        </div>
      </section>

      <section id="recreational" ref={recreationalRef} className="board">
        <div className="card">
          <div className="card-title">Activity</div>
          <div className="card-sub">Play</div>
          <div className="value">{demo.play}</div>
        </div>
        <div className="card">
          <div className="card-title">Fun time</div>
          <div className="card-sub">Hours</div>
          <div className="value">{demo.funTime}</div>
        </div>
        <div className="card">
          <div className="card-title">Social</div>
          <div className="card-sub">Connection</div>
          <div className="value">{demo.social}</div>
        </div>
      </section>
    </div>
  );
}
