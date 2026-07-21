"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { IMG } from "@/lib/images";

const SHOTS = [
  {
    img: IMG.macroSilver,
    alt: "Close-up of silver and black over-ear headphones on a dark background",
    caption: "DRIVER HOUSING — MACHINED ALUMINIUM",
    speed: -7,
    cls: "md:col-start-7 md:col-span-6 aspect-[4/5]",
  },
  {
    img: IMG.macroTopDown,
    alt: "Top-down view of grey wired over-ear headphones showing the headband stitching",
    caption: "HEADBAND — BALANCED CLAMP FORCE",
    speed: 6,
    cls: "md:col-start-1 md:col-span-5 md:-mt-40 aspect-[4/4.4]",
  },
  {
    img: IMG.macroFolded,
    alt: "Studio headphones folded on a woven blanket, ear cushions facing up",
    caption: "EAR CUSHIONS — SLOW-REBOUND MEMORY FOAM",
    speed: -3,
    cls: "md:col-start-6 md:col-span-4 md:mt-10 aspect-square",
  },
  {
    img: IMG.redBluePortrait,
    alt: "Cinematic close-up of a listener in red and blue light wearing headphones",
    caption: "WORN — HOUR SEVEN, STILL WEIGHTLESS",
    speed: 9,
    cls: "md:col-start-10 md:col-span-3 md:-mt-64 aspect-[3/4]",
  },
];

export default function MacroDetails() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>("[data-mac-shot]").forEach((el) => {
        const speed = Number(el.dataset.speed || 0);
        gsap.fromTo(
          el,
          { yPercent: speed },
          {
            yPercent: -speed,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
          }
        );
        gsap.from(el.querySelector("img"), {
          scale: 1.18,
          duration: 1.4,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
        });
      });

      gsap.from("[data-mac-head] span", {
        yPercent: 110,
        duration: 1.2,
        ease: "power4.out",
        stagger: 0.12,
        scrollTrigger: { trigger: "[data-mac-head]", start: "top 75%" },
      });

      gsap.from("[data-mac-copy] > *", {
        opacity: 0,
        y: 26,
        duration: 0.9,
        stagger: 0.14,
        scrollTrigger: { trigger: "[data-mac-copy]", start: "top 80%" },
      });
    },
    { scope }
  );

  return (
    <section ref={scope} className="relative overflow-hidden bg-paper text-void">
      <div className="mx-auto max-w-[1560px] px-5 py-28 md:px-10 md:py-44">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-6">
            <div className="eyebrow mb-8 text-void/50">MATERIALS &amp; COMFORT</div>
            <h2 data-mac-head className="display-type text-[clamp(2.5rem,8vw,8rem)] text-void">
              <span className="block overflow-hidden">
                <span className="block">BUILT</span>
              </span>
              <span className="block overflow-hidden">
                <span className="block">
                  FOR HOURS<span className="text-ember">.</span>
                </span>
              </span>
            </h2>
            <div data-mac-copy className="mt-10 max-w-sm">
              <p className="text-lg leading-relaxed text-void/80">
                Soft memory foam. Balanced pressure. Designed for all-day listening.
              </p>
              <p className="mt-5 text-[14px] leading-relaxed text-void/60">
                Every touchpoint is a material decision — protein leather that breathes, steel that
                flexes a million times without fatigue, foam that remembers the shape of your day.
              </p>
            </div>
          </div>

          {/* Asymmetric parallax grid */}
          <div className="grid gap-6 md:col-span-12 md:mt-8 md:grid-cols-12 md:gap-x-8">
            {SHOTS.map((s) => (
              <figure key={s.caption} data-mac-shot data-speed={s.speed} className={`relative ${s.cls}`}>
                <div className="relative h-full w-full overflow-hidden">
                  <Image
                    src={s.img}
                    alt={s.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 45vw"
                    className="object-cover"
                  />
                </div>
                <figcaption className="eyebrow mt-3 text-void/50">{s.caption}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
