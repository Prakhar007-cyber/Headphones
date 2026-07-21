"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { IMG } from "@/lib/images";

const MODELS = [
  { name: "AURIC ONE", img: IMG.productOne, price: "$349", tag: "THE FLAGSHIP" },
  { name: "STUDIO NOIR", img: IMG.productNoir, price: "$429", tag: "THE REFERENCE" },
  { name: "AURIC POP", img: IMG.productPop, price: "$199", tag: "THE DAILY" },
];

interface SpecRow {
  label: string;
  values: [string, string, string];
  /** normalized bar lengths 0..1 */
  bars: [number, number, number];
  best: number;
}

const SPECS: SpecRow[] = [
  { label: "ANC DEPTH", values: ["−45 dB", "−30 dB", "−35 dB"], bars: [0.92, 0.6, 0.7], best: 0 },
  { label: "BATTERY", values: ["50 H", "40 H", "35 H"], bars: [0.95, 0.76, 0.66], best: 0 },
  { label: "DRIVER", values: ["40 MM", "45 MM", "40 MM"], bars: [0.82, 0.94, 0.82], best: 1 },
  { label: "WEIGHT", values: ["255 G", "310 G", "235 G"], bars: [0.78, 0.6, 0.9], best: 2 },
  { label: "LATENCY", values: ["45 MS", "38 MS", "60 MS"], bars: [0.8, 0.92, 0.62], best: 1 },
  { label: "SPATIAL AUDIO", values: ["ADAPTIVE", "STUDIO MODE", "—"], bars: [0.95, 0.7, 0.08], best: 0 },
];

export default function Comparison() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from("[data-cmp-model]", {
        opacity: 0,
        y: 44,
        duration: 1,
        stagger: 0.1,
        scrollTrigger: { trigger: "[data-cmp-models]", start: "top 78%" },
      });

      gsap.utils.toArray<HTMLElement>("[data-cmp-row]").forEach((row) => {
        gsap.from(row, {
          opacity: 0,
          y: 26,
          duration: 0.8,
          scrollTrigger: { trigger: row, start: "top 88%" },
        });
        gsap.from(row.querySelectorAll("[data-cmp-bar]"), {
          scaleX: 0,
          transformOrigin: "left center",
          duration: 1.2,
          ease: "power3.inOut",
          stagger: 0.08,
          scrollTrigger: { trigger: row, start: "top 85%" },
        });
      });
    },
    { scope }
  );

  return (
    <section ref={scope} className="relative bg-graphite">
      <div className="mx-auto max-w-[1560px] px-5 py-28 md:px-10 md:py-40">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="display-type text-[clamp(2.7rem,6vw,6rem)] text-bone">
            PICK YOUR
            <br />
            <span className="text-ember">POISON.</span>
          </h2>
          <p className="eyebrow max-w-[230px] pb-3 text-smoke">
            THREE TUNINGS. NO WRONG ANSWER.
          </p>
        </div>

        <div className="mt-16 overflow-x-auto pb-2 md:mt-24 md:overflow-visible">
          <div className="min-w-[760px] md:min-w-0">
            {/* Product header */}
            <div
              data-cmp-models
              className="grid grid-cols-[140px_repeat(3,1fr)] gap-x-6 md:grid-cols-[200px_repeat(3,1fr)] md:gap-x-10"
            >
              <div />
              {MODELS.map((m) => (
                <div key={m.name} data-cmp-model className="group">
                  <div className="relative aspect-[5/4] overflow-hidden">
                    <Image
                      src={m.img}
                      alt={`${m.name} headphones product photo`}
                      fill
                      sizes="(max-width: 768px) 40vw, 26vw"
                      className="object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
                    />
                  </div>
                  <div className="eyebrow mt-4 text-smoke">{m.tag}</div>
                  <div className="display-type mt-1 text-xl text-bone md:text-2xl">{m.name}</div>
                  <div className="mt-1 font-mono text-sm text-steel">{m.price}</div>
                </div>
              ))}
            </div>

            {/* Spec rows */}
            <div className="mt-12 space-y-0">
              {SPECS.map((row) => (
                <div
                  key={row.label}
                  data-cmp-row
                  className="grid grid-cols-[140px_repeat(3,1fr)] items-center gap-x-6 border-t border-line py-5 md:grid-cols-[200px_repeat(3,1fr)] md:gap-x-10 md:py-6"
                >
                  <div className="eyebrow text-smoke">{row.label}</div>
                  {row.values.map((v, i) => (
                    <div key={i}>
                      <div
                        className={`font-mono text-sm md:text-base ${
                          row.best === i ? "text-ember" : "text-bone"
                        }`}
                      >
                        {v}
                        {row.best === i && (
                          <span className="ml-2 align-middle text-[9px] tracking-[0.2em] text-ember/70">
                            ●
                          </span>
                        )}
                      </div>
                      <div className="mt-2.5 h-px w-full bg-line">
                        <div
                          data-cmp-bar
                          className={`h-px ${row.best === i ? "bg-ember" : "bg-steel/70"}`}
                          style={{ width: `${row.bars[i] * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ))}
              <div className="border-t border-line" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
