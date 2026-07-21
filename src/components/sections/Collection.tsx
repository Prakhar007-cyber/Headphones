"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { IMG } from "@/lib/images";
import SpotlightCard from "@/components/SpotlightCard";

const PRODUCTS = [
  {
    name: "AURIC ONE",
    category: "WIRELESS OVER-EAR",
    price: "$349",
    spec: "ADAPTIVE ANC · 50 H · SPATIAL AUDIO",
    img: IMG.productOne,
    alt: "Matte black wireless over-ear headphones photographed on a warm beige studio background",
    tone: "The flagship. Everything AURIC knows about sound, in one instrument.",
  },
  {
    name: "AURIC STUDIO NOIR",
    category: "REFERENCE STUDIO",
    price: "$429",
    spec: "45 MM DRIVER · WIRED + BT · FLAT TUNING",
    img: IMG.productNoir,
    alt: "Black premium leather headphones photographed against a black backdrop",
    tone: "Mastering-room honesty. Black on black on black.",
  },
  {
    name: "AURIC POP",
    category: "EVERYDAY WIRELESS",
    price: "$199",
    spec: "35 H · FAST CHARGE · PUNCH-TUNED BASS",
    img: IMG.productPop,
    alt: "Black on-ear wireless headphones on a vivid yellow background",
    tone: "Loud colors, louder low end. The commute killer.",
  },
  {
    name: "AURIC HERITAGE",
    category: "STEEL & LEATHER EDITION",
    price: "$279",
    spec: "MACHINED STEEL · 40 H · MEMORY LEATHER",
    img: IMG.productHeritage,
    alt: "Vintage-styled headphones with brushed steel ear cups and tan leather headband",
    tone: "Analog soul, wireless heart.",
  },
];

export default function Collection() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>("[data-col-row]").forEach((row) => {
        gsap.from(row.querySelectorAll("[data-col-img]"), {
          clipPath: "inset(0% 0% 100% 0%)",
          duration: 1.3,
          ease: "power4.inOut",
          scrollTrigger: { trigger: row, start: "top 78%" },
        });
        gsap.from(row.querySelectorAll("[data-col-info] > *"), {
          opacity: 0,
          y: 40,
          duration: 1,
          stagger: 0.09,
          scrollTrigger: { trigger: row, start: "top 70%" },
        });
      });

      gsap.from("[data-col-head] span", {
        yPercent: 110,
        duration: 1.2,
        ease: "power4.out",
        stagger: 0.1,
        scrollTrigger: { trigger: "[data-col-head]", start: "top 75%" },
      });
    },
    { scope }
  );

  return (
    <section ref={scope} id="collection" className="relative bg-graphite">
      <div className="mx-auto max-w-[1560px] px-5 py-28 md:px-10 md:py-40">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 data-col-head className="display-type text-[clamp(2.4rem,7vw,7rem)] text-bone">
            <span className="block overflow-hidden">
              <span className="block">THE</span>
            </span>
            <span className="block overflow-hidden">
              <span className="block">
                COLLECTION<span className="text-ember">.</span>
              </span>
            </span>
          </h2>
          <p className="eyebrow max-w-[220px] pb-4 text-smoke">
            FOUR INSTRUMENTS. ONE OBSESSION WITH SOUND.
          </p>
        </div>

        <div className="mt-20 space-y-24 md:mt-28 md:space-y-36" id="headphones">
          {PRODUCTS.map((p, i) => {
            const flip = i % 2 === 1;
            return (
              <article
                key={p.name}
                data-col-row
                className="group grid items-stretch gap-8 lg:grid-cols-12"
              >
                {/* Image */}
                <a
                  href="#collection"
                  data-col-img
                  className={`relative block overflow-hidden ${
                    flip
                      ? "lg:order-2 lg:col-span-6 lg:col-start-7"
                      : "lg:col-span-7"
                  } ${i === 3 ? "lg:col-span-6" : ""}`}
                  style={{ clipPath: "inset(0% 0% 0% 0%)" }}
                  aria-label={`View ${p.name}`}
                >
                  <div className={`relative ${flip ? "aspect-[4/3.4]" : "aspect-[16/11]"} w-full`}>
                    <Image
                      src={p.img}
                      alt={p.alt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 55vw"
                      className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                    />
                  </div>
                  <div className="display-type pointer-events-none absolute bottom-4 right-5 text-[clamp(3rem,6vw,6rem)] text-bone/90 mix-blend-difference">
                    0{i + 1}
                  </div>
                </a>

                {/* Info */}
                <div
                  className={`flex items-end ${
                    flip ? "lg:order-1 lg:col-span-6 lg:pr-10" : "lg:col-span-5 lg:pl-6"
                  }`}
                >
                  <SpotlightCard
                    className="w-full border border-line bg-carbon/60 p-7 transition-colors duration-500 group-hover:border-steel/40 md:p-9"
                    spotlightColor="rgba(255, 77, 0, 0.14)"
                  >
                    <div data-col-info>
                      <div className="eyebrow text-smoke">{p.category}</div>
                      <h3 className="display-type mt-3 text-[clamp(1.8rem,3.4vw,3.2rem)] text-bone transition-transform duration-500 group-hover:translate-x-2">
                        {p.name}
                      </h3>
                      <p className="mt-4 max-w-sm text-[14px] leading-relaxed text-steel">{p.tone}</p>
                      <div className="mt-6 flex items-center justify-between border-t border-line pt-5">
                        <span className="font-mono text-xs tracking-wider text-smoke">{p.spec}</span>
                      </div>
                      <div className="mt-6 flex items-center justify-between">
                        <span className="font-mono text-2xl text-bone">{p.price}</span>
                        <span className="inline-flex translate-y-1 items-center gap-2 text-[13px] font-semibold tracking-wide text-bone opacity-60 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                          ADD TO BAG
                          <span aria-hidden className="text-ember transition-transform duration-500 group-hover:translate-x-1.5">
                            →
                          </span>
                        </span>
                      </div>
                    </div>
                  </SpotlightCard>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
