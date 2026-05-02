"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";

const INJECTED_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Syne:wght@600;700;800&display=swap');

  .xa-tunnel-wrapper {
    position: relative;
    width: 100%;
    /* 100dvh recalculates as the mobile browser toolbar slides in/out,
       causing the centred content to jump. 100svh is locked to the
       *smallest* stable viewport (toolbar visible) so it never reflows. */
    height: 100svh;
    /* Fallback for browsers that don't support svh yet */
    height: 100vh;
    height: 100svh;
    background-color: #050508;
    overflow: hidden;
    perspective: 600px;
  }

  .xa-tunnel-scene {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    transform-style: preserve-3d;
  }

  .xa-wall {
    position: absolute;
    backface-visibility: hidden;
    overflow: hidden;
    display: flex;
    justify-content: center;
  }

  .xa-wall-top {
    top: 0; left: 0; right: 0;
    height: 4000px;
    transform-origin: top;
    transform: rotateX(-90deg);
    align-items: flex-start;
  }

  .xa-wall-bottom {
    bottom: 0; left: 0; right: 0;
    height: 4000px;
    transform-origin: bottom;
    transform: rotateX(90deg);
    align-items: flex-end;
  }

  .xa-wall-left {
    top: 0; bottom: 0; left: 0;
    width: 4000px;
    transform-origin: left;
    transform: rotateY(90deg);
    align-items: center;
    flex-direction: row;
    justify-content: flex-start;
  }

  .xa-wall-right {
    top: 0; bottom: 0; right: 0;
    width: 4000px;
    transform-origin: right;
    transform: rotateY(-90deg);
    align-items: center;
    flex-direction: row;
    justify-content: flex-end;
  }

  /* Shared purple gradient — single source of truth for brand color */
  .xa-text {
    font-family: 'Archivo Black', sans-serif;
    text-transform: uppercase;
    white-space: nowrap;
    line-height: 0.82;
    background: linear-gradient(135deg, #7c5cfc 0%, #a78bfa 40%, #5b3fcf 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    opacity: 0.95;
  }

  .xa-wall-top .xa-text,
  .xa-wall-bottom .xa-text {
    font-size: 18vw;
    margin-top: -1vw;
    letter-spacing: -0.02em;
  }

  .xa-wall-left .xa-text,
  .xa-wall-right .xa-text {
    font-size: 28vh;
    letter-spacing: -0.02em;
  }

  .xa-vanishing-point {
    position: absolute;
    inset: -20%;
    background: radial-gradient(
      ellipse at center,
      rgba(5,5,8,1) 0%,
      rgba(5,5,8,0.7) 18%,
      transparent 60%
    );
    pointer-events: none;
    z-index: 10;
  }

  .xa-vignette {
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at center, transparent 40%, rgba(5,5,8,0.8) 100%);
    pointer-events: none;
    z-index: 11;
  }

  .xa-depth-fade {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }
  .xa-wall-top    .xa-depth-fade { background: linear-gradient(to bottom, rgba(5,5,8,0.1) 0%, rgba(5,5,8,0.95) 100%); }
  .xa-wall-bottom .xa-depth-fade { background: linear-gradient(to top,   rgba(5,5,8,0.1) 0%, rgba(5,5,8,0.95) 100%); }
  .xa-wall-left   .xa-depth-fade { background: linear-gradient(to right,  rgba(5,5,8,0.1) 0%, rgba(5,5,8,0.95) 100%); }
  .xa-wall-right  .xa-depth-fade { background: linear-gradient(to left,   rgba(5,5,8,0.1) 0%, rgba(5,5,8,0.95) 100%); }

  /* ─── Mobile background ─────────────────────────────────────────────────────
     Uses a single radial-gradient instead of a blurred div.
     CSS gradients are GPU-composited natively — zero paint cost.
  ──────────────────────────────────────────────────────────────────────────── */
  .xa-mobile-bg {
    position: absolute;
    inset: 0;
    /* Ambient glow via gradient — matches desktop purple exactly */
    background:
      radial-gradient(ellipse 120% 60% at 50% 50%, rgba(124,92,252,0.18) 0%, transparent 70%),
      #050508;
    pointer-events: none;
    /* Promote to its own compositor layer to avoid triggering repaints */
    will-change: transform;
    transform: translateZ(0);
  }

  /* Top & bottom text watermarks — GPU-friendly, single layer each */
  .xa-mobile-word {
    font-family: 'Archivo Black', sans-serif;
    text-transform: uppercase;
    letter-spacing: -0.03em;
    line-height: 0.85;
    background: linear-gradient(135deg, #7c5cfc 0%, #a78bfa 40%, #5b3fcf 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    opacity: 0.13;
    user-select: none;
    pointer-events: none;
  }

  /* Ensure the foreground content composites cleanly on mobile */
  .xa-foreground {
    position: relative;
    z-index: 20;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    height: 100svh;
    text-align: center;
    padding: 0 1.5rem;
    will-change: opacity, transform;
    transform: translateZ(0);
  }
`;

export function LeonardoHero({ className }: { className?: string }) {
  return (
    <div className={cn("xa-tunnel-wrapper", className)}>
      <style dangerouslySetInnerHTML={{ __html: INJECTED_STYLES }} />

      {/* ── Desktop 3D tunnel ─────────────────────────────────────────────── */}
      <div className="xa-tunnel-scene hidden md:block">
        <div className="xa-wall xa-wall-top">
          <div className="flex flex-col items-center w-full">
            <span className="xa-text">XACRES</span>
            <span className="xa-text">.COM</span>
          </div>
          <div className="xa-depth-fade" />
        </div>

        <div className="xa-wall xa-wall-bottom">
          <div className="flex flex-col items-center w-full pb-[5vh]">
            <span className="xa-text">LAND</span>
            <span className="xa-text">DISCOVER</span>
            <span className="xa-text">PLATFORM</span>
          </div>
          <div className="xa-depth-fade" />
        </div>

        <div className="xa-wall xa-wall-left">
          <div className="flex flex-col items-start justify-center h-full pl-[2vw]">
            <span className="xa-text">LANDS &nbsp;</span>
            <span className="xa-text">FARMLANDS &nbsp;</span>
            <span className="xa-text">HARYANA &nbsp;</span>
          </div>
          <div className="xa-depth-fade" />
        </div>

        <div className="xa-wall xa-wall-right">
          <div className="flex flex-col items-end justify-center h-full pr-[2vw]">
            <span className="xa-text">&nbsp; INVEST </span>
            <span className="xa-text">&nbsp; TODAY</span>
            <span className="xa-text">&nbsp; GROWTH</span>
            <span className="xa-text">&nbsp; TOMORROW </span>
          </div>
          <div className="xa-depth-fade" />
        </div>
      </div>

      <div className="xa-vanishing-point hidden md:block" />
      <div className="xa-vignette hidden md:block" />

      {/* ── Mobile background ─────────────────────────────────────────────────
          Single composited layer: gradient glow + two text watermarks.
          NO blur filters — those force a full rasterisation pass on mobile.
      ──────────────────────────────────────────────────────────────────────── */}
      <div className="xa-mobile-bg md:hidden" aria-hidden="true">
        {/* Top watermark */}
        <div className="absolute top-10 inset-x-0 flex justify-center">
          <span
            className="xa-mobile-word text-[19vw] text-center"
            style={{ lineHeight: 0.85 }}
          >
            XACRES<br />.COM
          </span>
        </div>

        {/* Bottom watermark */}
        <div className="absolute bottom-10 inset-x-0 flex justify-center">
          <span
            className="xa-mobile-word text-[19vw] text-center"
            style={{ lineHeight: 0.85 }}
          >
            LAND<br />PLATFORM
          </span>
        </div>
      </div>

      {/* ── Foreground UI ─────────────────────────────────────────────────── */}
      <motion.div
        className="xa-foreground"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
      >
        <div className="max-w-4xl flex flex-col items-center mt-0 md:mt-[-10vh]">
          <h1 className="font-['Archivo_Black'] text-white text-4xl md:text-5xl lg:text-7xl tracking-tighter mb-8 md:mb-4 uppercase leading-[1.05] drop-shadow-2xl">
            Discover Lands <br /> Across Haryana
          </h1>

          <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto px-4 sm:px-0">
            <Link
              href="/lands"
              className="w-full sm:w-auto px-8 py-4 bg-white text-[#050508] rounded-full font-['Syne'] font-bold text-sm tracking-wide uppercase hover:bg-[#e8e0ff] hover:shadow-[0_0_20px_rgba(124,92,252,0.3)] transition-all duration-300 transform hover:-translate-y-0.5 text-center"
            >
              Start now
            </Link>
            <Link
              href="/"
              className="w-full sm:w-auto px-8 py-4 bg-transparent border border-white/20 text-white rounded-full font-['Syne'] font-bold text-sm tracking-wide uppercase hover:bg-white/10 hover:border-white/40 transition-all duration-300 transform hover:-translate-y-0.5 text-center"
            >
              Explore Map
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}