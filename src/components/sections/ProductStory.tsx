"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

const HeadphoneScene = dynamic(() => import("@/components/HeadphoneScene"), { ssr: false });

const FEATURES = [
  {
    n: "01",
    title: "SPATIAL AUDIO",
    copy: "A rendered soundstage that tracks the recording, not your head. Instruments hold their place in the room while you move through it.",
    spec: "OBJECT-BASED RENDERING",
  },
  {
    n: "02",
    title: "ACTIVE NOISE CANCELLATION",
    copy: "Hybrid feed-forward and feed-back microphones sample the world 48,000 times a second — and quietly subtract it.",
    spec: "HYBRID ANC · −45 dB",
  },
  {
    n: "03",
    title: "DEEP BASS",
    copy: "A 40 mm graphene diaphragm with excursion to spare. Sub-bass you feel in your chest, never in your ears.",
    spec: "40 MM GRAPHENE DRIVER",
  },
  {
    n: "04",
    title: "50H BATTERY",
    copy: "Two full work weeks of listening. Ten minutes on the cable buys you another eight hours.",
    spec: "50 H · USB-C FAST CHARGE",
  },
  {
    n: "05",
    title: "CRYSTAL CLEAR CALLS",
    copy: "Eight beam-forming microphones isolate your voice from wind, traffic and the espresso machine behind you.",
    spec: "8-MIC BEAMFORMING ARRAY",
  },
];

export default function ProductStory() {
  const scope = useRef<HTMLElement>(null);
  const progressRef = useRef(0);
  const counterRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const features = gsap.utils.toArray<HTMLElement>("[data-ps-feature]");
      gsap.set(features, { yPercent: -50 });
      gsap.set(features.slice(1), { autoAlpha: 0, y: 60 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: scope.current,
          start: "top top",
          end: () => "+=" + window.innerHeight * FEATURES.length,
          pin: true,
          scrub: 0.65,
          anticipatePin: 1,
          onUpdate: (self) => {
            progressRef.current = self.progress;
            if (counterRef.current) {
              const idx = Math.min(
                FEATURES.length,
                Math.floor(self.progress * FEATURES.length) + 1
              );
              counterRef.current.textContent = `0${idx}`;
            }
          },
        },
      });

      FEATURES.forEach((_, i) => {
        if (i === 0) return;
        tl.to(
          features[i - 1],
          { autoAlpha: 0, y: -60, duration: 0.38, ease: "power2.in" },
          i - 0.42
        ).to(
          features[i],
          { autoAlpha: 1, y: 0, duration: 0.38, ease: "power2.out" },
          i - 0.04
        );
      });
      // dead time at the end so the last feature breathes before unpinning
      tl.to({}, { duration: 0.5 }, FEATURES.length - 0.04);

      gsap.to("[data-ps-rail]", {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: scope.current,
          start: "top top",
          end: () => "+=" + window.innerHeight * FEATURES.length,
          scrub: true,
        },
      });
    },
    { scope }
  );

  return (
    <section ref={scope} id="technology" className="relative overflow-hidden bg-void">
      <div className="relative flex h-[100svh] flex-col lg:flex-row">
        {/* Faint backdrop word */}
        <div
          aria-hidden
          className="display-type pointer-events-none absolute left-1/2 top-6 z-0 -translate-x-1/2 whitespace-nowrap text-[13vw] text-bone/[0.03]"
        >
          ENGINEERED
        </div>

        {/* Pinned 3D product */}
        <div className="relative z-10 h-[44svh] w-full lg:h-full lg:w-[55%]">
          <HeadphoneScene variant="story" progressRef={progressRef} className="h-full w-full" />
          {/* progress rail */}
          <div className="absolute bottom-10 left-5 hidden items-center gap-4 md:left-10 lg:flex">
            <span className="font-mono text-sm text-bone">
              <span ref={counterRef}>01</span>
              <span className="text-smoke"> / 0{FEATURES.length}</span>
            </span>
            <span className="relative block h-24 w-px bg-line">
              <span
                data-ps-rail
                className="absolute inset-0 origin-top scale-y-0 bg-ember"
              />
            </span>
          </div>
        </div>

        {/* Feature copy */}
        <div className="relative z-10 flex-1 lg:w-[45%]">
          {FEATURES.map((f) => (
            <div
              key={f.n}
              data-ps-feature
              className="absolute inset-x-5 top-1/2 md:inset-x-10 lg:left-0 lg:right-[8%]"
            >
              <div className="display-outline display-type text-[clamp(2.6rem,8vw,8rem)] leading-none text-steel/60">
                {f.n}
              </div>
              <h3 className="display-type mt-3 max-w-xl text-[clamp(1.55rem,3.6vw,3.6rem)] text-bone md:mt-4">
                {f.title}
              </h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-steel md:mt-5 md:text-[15px]">
                {f.copy}
              </p>
              <div className="mt-5 inline-flex items-center gap-3 border border-line px-4 py-2 md:mt-7">
                <span className="h-1.5 w-1.5 rounded-full bg-ember" />
                <span className="eyebrow text-bone/80">{f.spec}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
