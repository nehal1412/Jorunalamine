import { useEffect, useMemo } from "react";
//navbar
const styles = `
.fullbar {
  position: sticky; top: 0; z-index: 40;
  width: 100vw;
  margin-left: calc(50% - 50vw);
  margin-right: calc(50% - 50vw);
  padding: 10px 0; /* vertical padding; horizontal comes from inner */
  backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
  background: linear-gradient(180deg, rgba(255,255,255,0.86), rgba(255,255,255,0.72));
  border-bottom: 1px solid rgba(255,255,255,0.6);
  box-shadow: 0 6px 18px rgba(2,6,23,0.06);
}

/* Centered inner row so content aligns to your page container width */
.fullbar-inner {
  width: min(1200px, 94vw);
  margin: 0 auto;
  display: flex; align-items: center; gap: 10px;
}

.tab {
  border: 1px solid rgba(2,6,23,0.12);
  background: #fff; color: #0f172a;
  padding: 10px 14px; border-radius: 999px;
  font-weight: 700; font-size: 14px; cursor: pointer;
  transition: all .18s ease;
}
.tab:hover { background: #f3f5f7; }
.tab.active {
  background: #1976d2; color: #fff; border-color: #1976d2;
  box-shadow: 0 8px 20px rgba(25,118,210,0.28);
}
`;

const scrollToId = (id) => {
  const el = document.getElementById(id);
  el?.scrollIntoView({ behavior: "smooth", block: "start" });
};

export default function Navbar({ sections = [], active = "" }) {
  useEffect(() => {}, []);
  const items = useMemo(() => sections, [sections]);

  return (
    <>
      <style>{styles}</style>
      <div className="fullbar">
        <nav className="fullbar-inner" aria-label="Section navigation">
          {items.map((s) => (
            <button
              key={s.id}
              className={`tab ${active === s.id ? "active" : ""}`}
              onClick={() => scrollToId(s.id)}
              aria-label={`Go to ${s.label}`}
            >
              {s.label}
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}
