"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { IMG } from "@/lib/images";

export default function Lifestyle() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: scope.current,
          start: "top top",
          end: "+=170%",
          pin: true,
          scrub: 0.7,
        },
      });

      tl.fromTo(
        "[data-ls-frame]",
        { clipPath: "inset(26% 31% 26% 31%)" },
        { clipPath: "inset(0% 0% 0% 0%)", ease: "power1.inOut", duration: 1 },
        0
      )
        .fromTo(
          "[data-ls-img]",
          { scale: 1.32, yPercent: -6 },
          { scale: 1.02, yPercent: 4, ease: "none", duration: 1.35 },
          0
        )
        .fromTo(
          "[data-ls-line='0']",
          { xPercent: -34, autoAlpha: 0 },
          { xPercent: 0, autoAlpha: 1, ease: "power2.out", duration: 0.55 },
          0.35
        )
        .fromTo(
          "[data-ls-line='1']",
          { xPercent: 30, autoAlpha: 0 },
          { xPercent: 0, autoAlpha: 1, ease: "power2.out", duration: 0.55 },
          0.5
        )
        .fromTo(
          "[data-ls-caption]",
          { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0, duration: 0.3 },
          0.95
        );
    },
    { scope }
  );

  return (
    <section ref={scope} className="relative bg-void">
      <div className="relative h-[100svh] overflow-hidden">
        {/* Expanding frame */}
        <div data-ls-frame className="absolute inset-0" style={{ clipPath: "inset(26% 31% 26% 31%)" }}>
          <div data-ls-img className="absolute inset-0">
            <Image
              src={IMG.urbanListener}
              alt="Young man wearing black wireless over-ear headphones on a city rooftop, lost in the music"
              fill
              sizes="100vw"
              className="object-cover object-[62%_30%]"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-void/60 via-transparent to-void/20" />
        </div>

        {/* Overlay typography */}
        <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-5">
          <h2 className="display-type text-center text-[clamp(2.5rem,9.5vw,9.5rem)] leading-[0.95] text-bone">
            <span data-ls-line="0" className="block">
              YOUR WORLD.
            </span>
            <span data-ls-line="1" className="block">
              YOUR <span className="text-ember">SOUND.</span>
            </span>
          </h2>
          <p data-ls-caption className="eyebrow mt-8 text-bone/70">
            ANC ON. WORLD OFF.
          </p>
        </div>
      </div>
    </section>
  );
}
