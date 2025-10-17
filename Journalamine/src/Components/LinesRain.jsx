// src/components/ShootingStars.jsx
import React, { useMemo } from "react";

// Neon palette
const defaultColors = [
  "#60A5FA", // neon blue
  "#22D3EE", // cyan
  "#34D399", // green
  "#F472B6", // pink
  "#F59E0B", // amber
  "#A78BFA"  // violet
];

function rnd(min, max) {
  return Math.random() * (max - min) + min;
}

export default function ShootingStars({
  starCount = 24,
  colors = defaultColors,
  minAngle = 20,     // degrees
  maxAngle = 45,     // degrees
  minDuration = 2.5, // seconds
  maxDuration = 5.0, // seconds
  tailLengthVh = 28,
  tailWidthPx = 3,
  blurPx = 3,
  zIndex = -1
}) {
  // Generate per-star CSS with randomized parameters
  const styleTag = useMemo(() => {
    const rules = Array.from({ length: starCount }).map((_, i) => {
      const angle = rnd(minAngle, maxAngle) * (Math.random() < 0.5 ? 1 : -1); // left or right
      const duration = rnd(minDuration, maxDuration).toFixed(2);
      const delay = rnd(0, 3).toFixed(2);
      const color = colors[i % colors.length];
      // Spawn: random just off-screen on top and left to allow entry slant
      const spawnXvw = rnd(-10, 30).toFixed(2);
      const spawnYvh = rnd(-10, 5).toFixed(2);
      // Travel distance across viewport (diagonal)
      const travelXvw = (angle > 0 ? rnd(60, 120) : rnd(-120, -60)).toFixed(2);
      const travelYvh = rnd(100, 160).toFixed(2);

      // Neon multi-glow using drop-shadow stack and box-shadow
      const glow = `
        drop-shadow(0 0 ${blurPx * 1.5}px ${color})
        drop-shadow(0 0 ${blurPx * 3}px ${color})
        drop-shadow(0 0 ${blurPx * 5}px ${color})
      `;

      return `
.shooting .star:nth-child(${i + 1}) {
  --spawn-x: ${spawnXvw}vw;
  --spawn-y: ${spawnYvh}vh;
  --dx: ${travelXvw}vw;
  --dy: ${travelYvh}vh;
  --angle: ${angle}deg;
  --dur: ${duration}s;
  --del: ${delay}s;
  --col: ${color};
}
.shooting .star:nth-child(${i + 1})::after {
  background: linear-gradient(
    to bottom,
    rgba(255,255,255,0) 0%,
    var(--col) 55%,
    var(--col) 100%
  );
  box-shadow:
    0 0 ${blurPx}px var(--col),
    0 0 ${blurPx * 2}px var(--col),
    0 0 ${blurPx * 3.5}px var(--col);
  filter: ${glow};
}
`;
    }).join("\n");

    return `
.shooting {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: ${zIndex};
  overflow: hidden;
}
.shooting .field {
  position: absolute;
  inset: 0;
}

/* Each star is a positioned holder that moves diagonally via keyframes */
.shooting .star {
  position: absolute;
  width: 1px;
  height: 1px;
  top: var(--spawn-y);
  left: var(--spawn-x);
  animation: star_flight var(--dur) linear var(--del) infinite;
  will-change: transform;
}

/* The glowing comet tail */
.shooting .star::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: ${tailWidthPx}px;
  height: ${tailLengthVh}vh;
  transform-origin: top left;
  transform: rotate(var(--angle));
  opacity: 0.95;
  border-radius: 999px;
}

/* Motion path: from spawn to translated offset */
@keyframes star_flight {
  0% {
    transform: translate(0, 0);
    opacity: 0;
  }
  8% {
    opacity: 1;
  }
  92% {
    opacity: 1;
  }
  100% {
    transform: translate(var(--dx), var(--dy));
    opacity: 0;
  }
}

${rules}
`;
  }, [starCount, colors, minAngle, maxAngle, minDuration, maxDuration, tailLengthVh, tailWidthPx, blurPx, zIndex]);

  return (
    <div className="shooting">
      <style>{styleTag}</style>
      <div className="field">
        {Array.from({ length: starCount }).map((_, i) => (
          <div className="star" key={i} />
        ))}
      </div>
    </div>
  );
}
