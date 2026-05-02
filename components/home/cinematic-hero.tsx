// Xacres Cinematic Landing Hero — GSAP ScrollTrigger powered
// Adapted from 21st.dev cinematic-landing-hero pattern
//this component is not being used but it was made for the home page
"use client";

import React, { useEffect, useLayoutEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { MapPin, ArrowRight, Search, Phone } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const INJECTED_STYLES = `


  .film-grain {
    position: absolute; inset: 0; width: 100%; height: 100%;
    pointer-events: none; z-index: 50; opacity: 0.03; mix-blend-mode: overlay;
    background: url('data:image/svg+xml;utf8,<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><filter id="noiseFilter"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23noiseFilter)"/></svg>');
  }

  .bg-grid-xacres {
    background-size: 48px 48px;
    background-image: 
      linear-gradient(to right, rgba(0,0,0,0.04) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(0,0,0,0.04) 1px, transparent 1px);
    mask-image: radial-gradient(ellipse at center, black 0%, transparent 70%);
    -webkit-mask-image: radial-gradient(ellipse at center, black 0%, transparent 70%);
  }

  .text-hero-main {
    color: #111827;
    text-shadow: 0 4px 20px rgba(0,0,0,0.06);
  }

  .text-hero-accent {
    background: linear-gradient(180deg, #2563eb 0%, #1d4ed8 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    transform: translateZ(0);
    filter: drop-shadow(0px 4px 12px rgba(37,99,235,0.25));
  }

  .text-card-heading {
    background: linear-gradient(180deg, #FFFFFF 0%, #CBD5E1 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    transform: translateZ(0);
    filter: drop-shadow(0px 8px 16px rgba(0,0,0,0.6));
  }

  .xacres-depth-card {
    background: linear-gradient(145deg, #1a3a2a 0%, #0a1a12 100%);
    box-shadow: 
      0 40px 100px -20px rgba(0, 0, 0, 0.8),
      0 20px 40px -20px rgba(0, 0, 0, 0.6),
      inset 0 1px 2px rgba(255, 255, 255, 0.1),
      inset 0 -2px 4px rgba(0, 0, 0, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.04);
    position: relative;
  }

  .card-sheen-xacres {
    position: absolute; inset: 0; border-radius: inherit; pointer-events: none; z-index: 50;
    background: radial-gradient(800px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.04) 0%, transparent 40%);
    mix-blend-mode: screen; transition: opacity 0.3s ease;
  }

  .map-mockup-frame {
    background-color: #0d1117;
    box-shadow: 
      inset 0 0 0 1px rgba(255,255,255,0.08),
      0 30px 60px -10px rgba(0,0,0,0.7),
      0 15px 25px -5px rgba(0,0,0,0.5);
  }

  .floating-ui-pill {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.02) 100%);
    backdrop-filter: blur(24px); 
    -webkit-backdrop-filter: blur(24px);
    box-shadow: 
      0 0 0 1px rgba(255, 255, 255, 0.1),
      0 20px 40px -10px rgba(0, 0, 0, 0.6),
      inset 0 1px 1px rgba(255,255,255,0.15);
  }

  .map-widget-depth {
    background: linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%);
    box-shadow: 
      0 8px 16px rgba(0,0,0,0.3),
      inset 0 1px 1px rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.04);
  }

  .btn-xacres-primary {
    background: linear-gradient(180deg, #2563eb 0%, #1d4ed8 100%);
    color: #FFFFFF;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2), 0 12px 24px -4px rgba(37,99,235,0.4), inset 0 1px 1px rgba(255,255,255,0.2);
    transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
  }
  .btn-xacres-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px -2px rgba(0,0,0,0.2), 0 20px 32px -6px rgba(37,99,235,0.5), inset 0 1px 1px rgba(255,255,255,0.25);
  }
  .btn-xacres-primary:active {
    transform: translateY(1px);
    box-shadow: inset 0 2px 4px rgba(0,0,0,0.3);
  }

  .btn-xacres-outline {
    background: linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%);
    color: #111827;
    box-shadow: 0 0 0 1px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.06), 0 8px 16px -4px rgba(0,0,0,0.1), inset 0 1px 1px rgba(255,255,255,1);
    transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
  }
  .btn-xacres-outline:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 0 1px rgba(0,0,0,0.08), 0 6px 12px rgba(0,0,0,0.08), 0 16px 32px -4px rgba(0,0,0,0.15), inset 0 1px 1px rgba(255,255,255,1);
  }
  .btn-xacres-outline:active {
    transform: translateY(1px);
    background: #F1F5F9;
    box-shadow: inset 0 2px 4px rgba(0,0,0,0.08);
  }

  .district-counter {
    stroke-dasharray: 282;
    stroke-dashoffset: 282;
    stroke-linecap: round;
    transform: rotate(-90deg);
    transform-origin: center;
  }
`;

export function CinematicHero({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mainCardRef = useRef<HTMLDivElement>(null);
  const mockupRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>(0);
  const ctxRef = useRef<ReturnType<typeof gsap.context> | null>(null);

  // Mouse-tracking 3D effect on map mockup
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (window.scrollY > window.innerHeight * 2) return;

      cancelAnimationFrame(requestRef.current);
      requestRef.current = requestAnimationFrame(() => {
        if (mainCardRef.current && mockupRef.current) {
          const rect = mainCardRef.current.getBoundingClientRect();
          mainCardRef.current.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
          mainCardRef.current.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);

          const xVal = (e.clientX / window.innerWidth - 0.5) * 2;
          const yVal = (e.clientY / window.innerHeight - 0.5) * 2;
          gsap.to(mockupRef.current, {
            rotationY: xVal * 8,
            rotationX: -yVal * 8,
            ease: "power3.out",
            duration: 1.2,
          });
        }
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  // Initial hidden state before paint
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(".text-line-1", { autoAlpha: 0, y: 50, scale: 0.9, filter: "blur(16px)", rotationX: -15 });
      gsap.set(".text-line-2", { autoAlpha: 0, clipPath: "inset(0 100% 0 0)" });
      gsap.set(".main-card-xacres", { y: window.innerHeight + 200, autoAlpha: 0 });
      gsap.set([".card-left-content", ".card-right-content", ".mockup-area", ".float-pill", ".map-ui-item"], { autoAlpha: 0 });
      gsap.set(".cta-area", { autoAlpha: 0, scale: 0.85, filter: "blur(24px)" });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  // GSAP ScrollTrigger Cinematic Timeline
  useEffect(() => {
    const isMobile = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      // Intro animation — reveal hero text
      const introTl = gsap.timeline({ delay: 0.1 });
      introTl
        .to(".text-line-1", { duration: 1.2, autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)", rotationX: 0, ease: "expo.out" })
        .to(".text-line-2", { duration: 1.0, autoAlpha: 1, clipPath: "inset(0 0% 0 0)", ease: "power4.inOut" }, "-=0.8");

      // Scroll timeline
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=6000",
          pin: true,
          scrub: 1.2,
          anticipatePin: 1,
        },
      });

      scrollTl
        .to([".hero-text-area", ".bg-grid-xacres"], { scale: 1.1, filter: "blur(16px)", opacity: 0, ease: "power2.inOut", duration: 2 }, 0)
        .to(".main-card-xacres", { y: 0, autoAlpha: 1, ease: "power3.inOut", duration: 2 }, 0)
        .to(".main-card-xacres", { width: "100%", height: "100%", borderRadius: "0px", ease: "power3.inOut", duration: 1.5 })
        .fromTo(".mockup-area",
          { y: 250, z: -400, rotationX: 40, rotationY: -25, autoAlpha: 0, scale: 0.6 },
          { y: 0, z: 0, rotationX: 0, rotationY: 0, autoAlpha: 1, scale: 1, ease: "expo.out", duration: 2.5 }, "-=0.6"
        )
        .fromTo(".map-ui-item", { y: 30, autoAlpha: 0, scale: 0.95 }, { y: 0, autoAlpha: 1, scale: 1, stagger: 0.12, ease: "back.out(1.2)", duration: 1.2 }, "-=1.5")
        .to(".district-counter", { strokeDashoffset: 40, duration: 1.8, ease: "power3.inOut" }, "-=1.0")
        .to(".counter-number", { innerHTML: 22, snap: { innerHTML: 1 }, duration: 1.8, ease: "expo.out" }, "-=1.8")
        .fromTo(".float-pill", { y: 80, autoAlpha: 0, scale: 0.7, rotationZ: -8 }, { y: 0, autoAlpha: 1, scale: 1, rotationZ: 0, ease: "back.out(1.5)", duration: 1.2, stagger: 0.15 }, "-=1.5")
        .fromTo(".card-left-content", { x: -40, autoAlpha: 0 }, { x: 0, autoAlpha: 1, ease: "power4.out", duration: 1.2 }, "-=1.2")
        .fromTo(".card-right-content", { x: 40, autoAlpha: 0, scale: 0.85 }, { x: 0, autoAlpha: 1, scale: 1, ease: "expo.out", duration: 1.2 }, "<")
        .to({}, { duration: 2 })
        .set(".hero-text-area", { autoAlpha: 0 })
        .set(".cta-area", { autoAlpha: 1 })
        .to({}, { duration: 1 })
        .to([".mockup-area", ".float-pill", ".card-left-content", ".card-right-content"], {
          scale: 0.9, y: -30, z: -150, autoAlpha: 0, ease: "power3.in", duration: 1, stagger: 0.04,
        })
        .to(".main-card-xacres", {
          width: isMobile ? "92vw" : "88vw",
          height: isMobile ? "92vh" : "88vh",
          borderRadius: isMobile ? "28px" : "36px",
          ease: "expo.inOut",
          duration: 1.6,
        }, "pullback")
        .to(".cta-area", { scale: 1, filter: "blur(0px)", ease: "expo.inOut", duration: 1.6 }, "pullback")
        .to(".main-card-xacres", { y: -window.innerHeight - 300, ease: "power3.in", duration: 1.5 });

    }, containerRef);

    ctxRef.current = ctx;

    return () => {
      if (ctxRef.current) ctxRef.current.revert();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn("relative w-screen h-screen overflow-hidden flex items-center justify-center bg-white text-gray-900 font-sans antialiased", className)}
      style={{ perspective: "1500px" }}
      {...props}
    >
      <style dangerouslySetInnerHTML={{ __html: INJECTED_STYLES }} />
      <div className="film-grain" aria-hidden="true" />
      <div className="bg-grid-xacres absolute inset-0 z-0 pointer-events-none opacity-60" aria-hidden="true" />

      {/* ===== BACKGROUND: Hero Text ===== */}
      <div className="hero-text-area absolute z-10 flex flex-col items-center justify-center text-center w-screen px-5 will-change-transform">
        <h1 className="text-line-1 text-hero-main text-4xl md:text-6xl lg:text-[5.5rem] font-bold tracking-tight mb-2 leading-[1.1]">
          Find agricultural land,
        </h1>
        <h1 className="text-line-2 text-hero-accent text-4xl md:text-6xl lg:text-[5.5rem] font-extrabold tracking-tight leading-[1.1]">
          on the map.
        </h1>
      </div>

      {/* ===== BACKGROUND: CTA (revealed after card pulls back) ===== */}
      <div className="cta-area absolute z-10 flex flex-col items-center justify-center text-center w-screen px-5 pointer-events-auto will-change-transform">
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-5 tracking-tight text-hero-main leading-[1.1]">
          Start exploring land.
        </h2>
        <p className="text-gray-500 text-base md:text-lg mb-10 max-w-md mx-auto leading-relaxed">
          Verified agricultural land across 22 districts in Haryana.
          Direct seller contact. No middlemen.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/"
            className="btn-xacres-primary flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-base font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Open Map
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/lands"
            className="btn-xacres-outline flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-base font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Browse Listings
          </Link>
        </div>
      </div>

      {/* ===== FOREGROUND: The Deep Green Card ===== */}
      <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none" style={{ perspective: "1500px" }}>
        <div
          ref={mainCardRef}
          className="main-card-xacres xacres-depth-card relative overflow-hidden flex items-center justify-center pointer-events-auto w-[92vw] md:w-[88vw] h-[92vh] md:h-[88vh] rounded-[28px] md:rounded-[36px]"
        >
          <div className="card-sheen-xacres" aria-hidden="true" />

          {/* Card Inner Layout */}
          <div className="relative w-full h-full max-w-7xl mx-auto px-4 lg:px-10 flex flex-col justify-evenly lg:grid lg:grid-cols-3 items-center lg:gap-6 z-10 py-6 lg:py-0">

            {/* RIGHT: Brand */}
            <div className="card-right-content order-1 lg:order-3 flex justify-center lg:justify-end z-20 w-full">
              <h2 className="text-5xl md:text-7xl lg:text-[7rem] font-black uppercase tracking-tighter text-card-heading">
                Xacres
              </h2>
            </div>

            {/* CENTER: Map Mockup */}
            <div className="mockup-area order-2 relative w-full h-[340px] lg:h-[520px] flex items-center justify-center z-10" style={{ perspective: "1000px" }}>
              <div className="relative w-full h-full flex items-center justify-center transform scale-[0.7] md:scale-90 lg:scale-100">
                <div
                  ref={mockupRef}
                  className="relative w-[300px] h-[440px] md:w-[320px] md:h-[480px] rounded-[2rem] map-mockup-frame flex flex-col will-change-transform overflow-hidden"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Map interface content */}
                  <div className="absolute inset-[3px] bg-[#0a0f1a] rounded-[1.8rem] overflow-hidden">
                    {/* Map background */}
                    <div className="absolute inset-0 opacity-30 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=60&w=600')] bg-cover bg-center" />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1a]/60 via-transparent to-[#0a0f1a]/80" />

                    {/* Top bar */}
                    <div className="map-ui-item relative z-10 flex items-center gap-2 px-5 pt-12 pb-3">
                      <div className="flex-1 flex items-center gap-2 bg-white/[0.08] rounded-xl px-3 py-2 border border-white/[0.06]">
                        <Search className="w-3.5 h-3.5 text-white/40" />
                        <span className="text-white/40 text-xs">Search Haryana...</span>
                      </div>
                    </div>

                    {/* Map pins */}
                    <div className="relative flex-1">
                      {/* Pin 1 */}
                      <div className="map-ui-item absolute top-[18%] left-[22%]">
                        <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/50 text-xs font-bold">
                          <MapPin className="w-3.5 h-3.5" />
                        </div>
                      </div>
                      {/* Pin 2 with tooltip */}
                      <div className="map-ui-item absolute top-[35%] left-[55%]">
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-1 bg-white rounded-lg shadow-xl text-[10px] font-bold text-gray-900">
                          ₹18L · 4 Acres
                        </div>
                        <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/50 animate-pulse">
                          <MapPin className="w-3.5 h-3.5" />
                        </div>
                      </div>
                      {/* Pin 3 */}
                      <div className="map-ui-item absolute top-[58%] left-[35%]">
                        <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/40">
                          <MapPin className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>

                    {/* Bottom detail card */}
                    <div className="map-ui-item absolute bottom-4 left-3 right-3 z-20">
                      <div className="map-widget-depth rounded-2xl p-4 flex items-center gap-3">
                        <div className="w-14 h-14 rounded-xl bg-white/[0.06] border border-white/[0.08] overflow-hidden flex-shrink-0">
                          <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=60&w=100')] bg-cover bg-center opacity-60" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-semibold truncate">4 Acres Agricultural</p>
                          <p className="text-white/40 text-xs truncate">Samargopalpur · Rohtak</p>
                          <p className="text-emerald-400 text-xs font-bold mt-0.5">₹18 Lakh</p>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-400/20 flex items-center justify-center flex-shrink-0">
                          <Phone className="w-3.5 h-3.5 text-blue-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Badges */}
                <div className="float-pill absolute top-4 lg:top-8 left-[-10px] lg:left-[-70px] floating-ui-pill rounded-xl p-3 lg:p-3.5 flex items-center gap-3 z-30">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-400/20">
                    <span className="text-base">🌾</span>
                  </div>
                  <div>
                    <p className="text-white text-xs font-bold">Agricultural Only</p>
                    <p className="text-white/40 text-[10px]">Verified farmland</p>
                  </div>
                </div>

                <div className="float-pill absolute bottom-10 lg:bottom-16 right-[-10px] lg:right-[-70px] floating-ui-pill rounded-xl p-3 lg:p-3.5 flex items-center gap-3 z-30">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-400/20">
                    <span className="text-base">📍</span>
                  </div>
                  <div>
                    <p className="text-white text-xs font-bold">Haryana Focused</p>
                    <p className="text-white/40 text-[10px]">All 22 districts</p>
                  </div>
                </div>

                {/* District counter ring */}
                <div className="float-pill absolute top-[50%] -translate-y-1/2 right-[-5px] lg:right-[-55px] floating-ui-pill rounded-xl p-3 flex flex-col items-center z-30">
                  <div className="relative w-14 h-14 flex items-center justify-center">
                    <svg className="absolute inset-0 w-full h-full" aria-hidden="true">
                      <circle cx="28" cy="28" r="22" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
                      <circle className="district-counter" cx="28" cy="28" r="22" fill="none" stroke="#2563eb" strokeWidth="4" />
                    </svg>
                    <span className="counter-number text-white text-lg font-bold z-10">0</span>
                  </div>
                  <p className="text-white/40 text-[9px] font-semibold uppercase tracking-wider mt-1">Districts</p>
                </div>
              </div>
            </div>

            {/* LEFT: Description */}
            <div className="card-left-content order-3 lg:order-1 flex flex-col justify-center text-center lg:text-left z-20 w-full px-2 lg:px-0">
              <h3 className="text-white text-xl md:text-2xl lg:text-3xl font-bold mb-0 lg:mb-4 tracking-tight">
                Land discovery,
                <br />
                reimagined.
              </h3>
              <p className="hidden md:block text-emerald-100/50 text-sm lg:text-base leading-relaxed max-w-sm lg:max-w-none mx-auto lg:mx-0">
                <span className="text-white font-semibold">Xacres</span> is a map-first platform for discovering agricultural land across Haryana. Search by district, explore parcels on the map, and contact sellers directly.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
