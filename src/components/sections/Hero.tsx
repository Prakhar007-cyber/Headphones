"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import Aurora from "@/components/Aurora";
import SplitText from "@/components/SplitText";
import Magnet from "@/components/Magnet";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const HeadphoneScene = dynamic(() => import("@/components/HeadphoneScene"), { ssr: false });

const headlineSplit = {
  splitType: "chars" as const,
  delay: 32,
  duration: 1.15,
  ease: "power4.out",
  from: { opacity: 0, y: 110, rotateX: -35 },
  to: { opacity: 1, y: 0, rotateX: 0 },
  threshold: 0.05,
  rootMargin: "0px",
  textAlign: "left" as const,
  tag: "span" as const,
};

export default function Hero() {
  const scope = useRef<HTMLElement>(null);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [auroraLive, setAuroraLive] = useState(true);

  // stop the Aurora WebGL loop entirely once the hero scrolls away
  useEffect(() => {
    const el = scope.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setAuroraLive(entry.isIntersecting), {
      rootMargin: "120px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.from("[data-hero-aurora]", { opacity: 0, duration: 1.6, ease: "power2.out" }, 0)
        .from(".hero-canvas", { opacity: 0, scale: 0.88, y: 50, duration: 1.5 }, 0.45)
        .from("[data-hero-copy]", { opacity: 0, y: 34, duration: 1 }, 0.95)
        .from("[data-hero-cta] > *", { opacity: 0, y: 26, stagger: 0.09, duration: 0.9 }, 1.1)
        .from("[data-hero-chip]", { opacity: 0, y: 14, stagger: 0.08, duration: 0.7 }, 1.3)
        .from("[data-hero-scroll]", { opacity: 0, duration: 0.8 }, 1.55);

      gsap.to("[data-hero-scroll-line]", {
        scaleY: 0.15,
        transformOrigin: "top",
        duration: 1.1,
        ease: "power2.inOut",
        repeat: -1,
        yoyo: true,
      });
    },
    { scope }
  );

  return (
    <section
      ref={scope}
      id="top"
      className="relative flex min-h-[100svh] flex-col overflow-hidden bg-void"
    >
      {/* Aurora backdrop — heavily subdued so the product stays the focus */}
      <div
        data-hero-aurora
        className="absolute inset-x-0 top-0 h-[72%] opacity-45"
        style={{
          maskImage: "linear-gradient(to bottom, black 30%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 30%, transparent 100%)",
        }}
        aria-hidden
      >
        {auroraLive && (
          <Aurora colorStops={["#3b1503", "#ff4d00", "#1a0b33"]} amplitude={0.8} blend={0.55} speed={0.6} />
        )}
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[1560px] flex-1 flex-col px-5 pt-24 md:px-10 lg:pt-0">
        <div className="relative flex-1">
          {/* Headline — line one sits behind the headphone, line two in front */}
          <h1
            aria-label="Feel every frequency"
            className="display-type text-[clamp(2.7rem,11.5vw,11.5rem)] leading-[0.9] text-bone lg:absolute lg:left-0 lg:top-[24%] lg:w-full"
          >
            <span className="relative z-[5] block">
              <SplitText {...headlineSplit} text="FEEL EVERY" className="align-top" />
            </span>
            <span className="pointer-events-none relative z-[30] block lg:mt-[-0.05em] lg:pl-[14vw]">
              <SplitText {...headlineSplit} text="FREQUENCY" className="align-top" />
              <span className="text-ember">.</span>
            </span>
          </h1>

          {/* 3D headphone — layered between the two headline lines on desktop */}
          <div className="hero-canvas relative mx-auto mt-2 h-[42svh] w-full max-w-[480px] lg:absolute lg:right-[-4%] lg:top-[6vh] lg:z-[10] lg:m-0 lg:h-[82vh] lg:w-[52vw] lg:max-w-none">
            <HeadphoneScene
              variant="hero"
              draggable={isDesktop}
              className="h-full w-full"
            />
          </div>
        </div>

        {/* Bottom row */}
        <div className="relative z-[35] flex flex-col gap-8 pb-14 md:pb-16 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-md">
            <p data-hero-copy className="text-[15px] leading-relaxed text-steel">
              Reference-grade 40&nbsp;mm drivers. Adaptive silence. A soundstage engineered to
              disappear — until all that&apos;s left is the music.
            </p>
            <div data-hero-cta className="mt-7 flex flex-wrap items-center gap-4">
              <Magnet padding={60} magnetStrength={9}>
                <a
                  href="#collection"
                  className="group inline-flex items-center gap-3 rounded-full bg-ember px-7 py-3.5 text-[13px] font-semibold tracking-wide text-void transition-colors duration-300 hover:bg-bone"
                >
                  EXPLORE COLLECTION
                  <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </a>
              </Magnet>
              <Magnet padding={60} magnetStrength={9}>
                <a
                  href="#headphones"
                  className="group inline-flex items-center gap-3 rounded-full border border-line px-7 py-3.5 text-[13px] font-semibold tracking-wide text-bone transition-colors duration-300 hover:border-bone"
                >
                  SHOP HEADPHONES
                  <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </a>
              </Magnet>
            </div>
          </div>

          {/* Technical indicators */}
          <div className="hidden items-end gap-10 md:flex">
            {[
              ["DRIVER", "40 MM"],
              ["ANC", "−45 dB"],
              ["PLAYBACK", "50 H"],
            ].map(([k, v]) => (
              <div key={k} data-hero-chip className="border-l border-line pl-4">
                <div className="eyebrow text-smoke">{k}</div>
                <div className="mt-1.5 font-mono text-lg text-bone">{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div
        data-hero-scroll
        className="absolute bottom-5 left-1/2 z-[35] hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex"
      >
        <span className="eyebrow text-smoke">SCROLL</span>
        <span data-hero-scroll-line className="block h-10 w-px bg-steel/60" />
      </div>
    </section>
  );
}
