// src/Components/DigitalDeskWatch.jsx
import React, { useMemo } from "react";

export default function DigitalDeskWatch({ ymd, hms, startLabel = "22 AUGUST 2025" }) {
  const pad2 = (n) => String(n).padStart(2, "0");

  const css = useMemo(() => `
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
`, []);

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
          <span className="dw-years">{ymd.years}<small>Years</small></span>
          <span className="dw-sep">:</span>
          <span className="dw-months">{ymd.months}<small>Months</small></span>
          <span className="dw-sep">:</span>
          <span className="dw-days">{ymd.days}<small>Days</small></span>
          <span className="dw-dot">•</span>
          <span className="dw-hms">
            {pad2(hms.hours)}<span className="dw-colon">:</span>
            {pad2(hms.minutes)}<span className="dw-colon">:</span>
            {pad2(hms.seconds)}
          </span>
        </div>
         
      </div>
    </div>
  );
}
