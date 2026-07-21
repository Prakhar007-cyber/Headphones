"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import Magnet from "@/components/Magnet";

const HeadphoneScene = dynamic(() => import("@/components/HeadphoneScene"), { ssr: false });

export default function FinalCta() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from("[data-fin-line] > span", {
        yPercent: 112,
        duration: 1.3,
        ease: "power4.out",
        stagger: 0.14,
        scrollTrigger: { trigger: scope.current, start: "top 62%" },
      });
      gsap.from("[data-fin-canvas]", {
        opacity: 0,
        scale: 0.85,
        y: 60,
        duration: 1.6,
        ease: "power4.out",
        scrollTrigger: { trigger: scope.current, start: "top 60%" },
      });
      gsap.from("[data-fin-cta]", {
        opacity: 0,
        y: 30,
        duration: 1,
        delay: 0.3,
        scrollTrigger: { trigger: scope.current, start: "top 55%" },
      });
    },
    { scope }
  );

  return (
    <section
      ref={scope}
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-void"
    >
      {/* Ambient ember glow */}
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 h-[60vh] w-[60vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember/[0.07] blur-[120px]"
      />

      <div className="relative z-10 flex w-full flex-col items-center px-5 py-28">
        <div className="relative w-full">
          {/* 3D headphone floats between the two headline lines */}
          <div className="pointer-events-auto absolute left-1/2 top-1/2 z-[10] h-[54vh] w-[86vw] -translate-x-1/2 -translate-y-1/2 md:h-[64vh] md:w-[54vw]">
            <div data-fin-canvas className="h-full w-full">
              <HeadphoneScene variant="finale" draggable className="h-full w-full" />
            </div>
          </div>

          <h2
            aria-label="Turn up your world"
            className="display-type relative w-full text-center text-[clamp(2.8rem,11vw,11rem)] leading-[0.92] text-bone"
          >
            <span data-fin-line className="relative z-[5] block overflow-hidden">
              <span className="block">TURN UP</span>
            </span>
            <span data-fin-line className="pointer-events-none relative z-[20] block overflow-hidden">
              <span className="block">
                YOUR <span className="text-ember">WORLD.</span>
              </span>
            </span>
          </h2>
        </div>

        <div data-fin-cta className="relative z-[30] mt-14 md:mt-20">
          <Magnet padding={90} magnetStrength={7}>
            <a
              href="#collection"
              className="group inline-flex items-center gap-4 rounded-full border border-bone/30 bg-bone/[0.03] px-10 py-5 text-sm font-semibold tracking-[0.15em] text-bone backdrop-blur-sm transition-all duration-500 hover:border-ember hover:bg-ember hover:text-void"
            >
              EXPLORE HEADPHONES
              <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1.5">
                →
              </span>
            </a>
          </Magnet>
        </div>
      </div>
    </section>
  );
}
