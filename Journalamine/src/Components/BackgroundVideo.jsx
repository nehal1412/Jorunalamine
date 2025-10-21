// src/Components/BackgroundVideo.jsx
import React from "react";
import bgVideo from "../assets/bg.mp4"; // place your local file here

export default function BackgroundVideo({
  src = bgVideo,
  zIndex = -1,
  opacity = 1,
  overlay = "linear-gradient(0deg, rgba(0,0,0,0.35), rgba(0,0,0,0.35))",
  blurPx = 0,
  muted = true,
  loop = true,
  autoPlay = true
}) {
  return (
    <div
      className="bg-video-wrap"
      style={{
        position: "fixed",
        inset: 0,
        zIndex,
        pointerEvents: "none",
        overflow: "hidden",
        filter: blurPx ? `blur(${blurPx}px)` : "none"
      }}
      aria-hidden="true"
    >
      <video
        className="bg-video"
        src={src}
        muted={muted}
        loop={loop}
        autoPlay={autoPlay}
        playsInline
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity
        }}
      />
      {overlay && (
        <div
          className="bg-video-overlay"
          style={{
            position: "absolute",
            inset: 0,
            background: overlay
          }}
        />
      )}
    </div>
  );
}
