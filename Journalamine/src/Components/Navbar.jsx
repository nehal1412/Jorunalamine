// src/components/Navbar.jsx
import { useEffect, useState } from "react";

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@900&display=swap');

.logoBar {
  position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
  width: 100vw;
  margin-left: calc(50% - 50vw);
  margin-right: calc(50% - 50vw);
  background: transparent !important;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  pointer-events: none;
}
.logoBar-inner {
  width: min(1200px, 96vw);
  margin: 0 auto;
  min-height: 90px;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  padding: 10px 0 8px;
  pointer-events: none;
  position: relative;
}

/* Premium gradient text, no glow */
.brandWord {
  grid-column: 2 / 3;
  justify-self: center;
  pointer-events: auto;
  padding: 6px 8px;
  color: transparent;
  font-family: "Playfair Display", ui-serif, Georgia, Cambria, "Times New Roman", serif;
  font-weight: 900;
  font-size: clamp(22px, 3vw, 36px);
  letter-spacing: 0.8px;
  line-height: 1.05;
  background-image: linear-gradient(92deg, #f5e9d4 0%, #ffcc66 35%, #ffd08a 60%, #fff5d6 100%);
  -webkit-background-clip: text;
          background-clip: text;
  -webkit-text-fill-color: transparent;

  /* Smooth linear slide */
  transition: transform .9s ease, letter-spacing .4s ease;
  will-change: transform;
}

/* Compute 70% of the previous viewport-left shift:
   previous: translateX(calc(-50vw + 16px))
   new:      translateX(calc(0.7 * (-50vw + 16px)))  -> CSS doesn't multiply, so approximate by splitting:
   We'll blend to a container-aligned offset and then add a viewport offset portion.
   Simpler robust approach: use a smaller fixed viewport offset. */
.logoBar.scrolled .brandWord {
  /* Move partially toward the left, but stop early so it's always visible */
  transform: translateX(calc(-35vw + 12px)); /* about 70% of -50vw; adjust as desired */
  letter-spacing: 0.85px;
}

@media (max-width: 768px) {
  .logoBar.scrolled .brandWord {
    /* On small screens, shorter travel to avoid clipping */
    transform: translateX(calc(-22vw + 8px));
  }
}
`;

export default function Navbar({ brand = "Journalamine" }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <style>{styles}</style>
      <header className={`logoBar ${scrolled ? "scrolled" : ""}`} role="banner" aria-label="Brand header">
        <div className="logoBar-inner">
          <div aria-hidden="true" />
          <div className="brandWord" aria-label="Journalamine logo">{brand}</div>
          <div aria-hidden="true" />
        </div>
      </header>
    </>
  );
}
