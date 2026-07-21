"use client";

import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import CountUp from "@/components/CountUp";

const STATS: { value: React.ReactNode; label: string }[] = [
  {
    value: (
      <>
        <CountUp to={40} duration={1.6} />
        <span className="text-steel"> MM</span>
      </>
    ),
    label: "GRAPHENE DRIVERS",
  },
  {
    value: (
      <>
        <CountUp to={20} duration={1.6} />
        <span className="text-steel">Hz — </span>
        <CountUp to={20} duration={1.6} />
        <span className="text-steel">kHz</span>
      </>
    ),
    label: "FREQUENCY RESPONSE",
  },
  {
    value: (
      <>
        <span className="text-steel">−</span>
        <CountUp to={45} duration={1.6} />
        <span className="text-steel"> dB</span>
      </>
    ),
    label: "ACTIVE NOISE CANCELLATION",
  },
  {
    value: (
      <>
        <span className="text-steel">BT </span>
        <CountUp to={5.4} duration={1.6} />
      </>
    ),
    label: "BLUETOOTH · MULTIPOINT",
  },
  {
    value: (
      <>
        <CountUp to={45} duration={1.6} />
        <span className="text-steel"> ms</span>
      </>
    ),
    label: "LOW-LATENCY MODE",
  },
  {
    value: (
      <>
        <CountUp to={50} duration={1.6} />
        <span className="text-steel"> H</span>
      </>
    ),
    label: "PLAYBACK PER CHARGE",
  },
];

export default function Visualizer() {
  const scope = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 0.5, y: 0.5, energy: 0 });
  const scroll = useRef(0);

  /* Abstract waveform — layered travelling sines with a gaussian envelope,
     excited by cursor proximity and scroll position. */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let running = false;
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const LAYERS = [
      { amp: 0.32, freq: 0.011, speed: 0.9, phase: 0, color: "rgba(156,160,166,0.35)", width: 1 },
      { amp: 0.5, freq: 0.007, speed: 0.6, phase: 2.1, color: "rgba(156,160,166,0.2)", width: 1 },
      { amp: 0.42, freq: 0.016, speed: 1.3, phase: 4.2, color: "rgba(255,77,0,0.85)", width: 1.6 },
    ];

    let t = 0;
    const draw = () => {
      t += 0.016;
      // cursor energy eases away when idle
      mouse.current.energy *= 0.985;
      ctx.clearRect(0, 0, w, h);
      const mid = h / 2;

      for (const layer of LAYERS) {
        ctx.beginPath();
        ctx.lineWidth = layer.width;
        ctx.strokeStyle = layer.color;
        const excite = 0.55 + mouse.current.energy * 1.6 + scroll.current * 0.35;
        for (let x = 0; x <= w; x += 4) {
          const nx = x / w;
          // gaussian envelope, biased toward the cursor
          const d = nx - mouse.current.x;
          const envelope =
            Math.exp(-Math.pow((nx - 0.5) * 2.4, 2)) * 0.7 +
            Math.exp(-Math.pow(d * 5, 2)) * 0.55 * (0.4 + mouse.current.energy);
          const y =
            mid +
            Math.sin(x * layer.freq + t * layer.speed + layer.phase) *
              Math.sin(x * layer.freq * 0.37 + t * 0.4) *
              layer.amp *
              mid *
              envelope *
              excite;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      // center hairline
      ctx.beginPath();
      ctx.strokeStyle = "rgba(156,160,166,0.14)";
      ctx.lineWidth = 1;
      ctx.moveTo(0, mid);
      ctx.lineTo(w, mid);
      ctx.stroke();

      raf = requestAnimationFrame(draw);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !running) {
          running = true;
          raf = requestAnimationFrame(draw);
        } else if (!entry.isIntersecting && running) {
          running = false;
          cancelAnimationFrame(raf);
        }
      },
      { rootMargin: "80px" }
    );
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  useEffect(() => {
    const section = scope.current;
    if (!section) return;
    const onMove = (e: PointerEvent) => {
      const rect = section.getBoundingClientRect();
      mouse.current.x = (e.clientX - rect.left) / rect.width;
      mouse.current.y = (e.clientY - rect.top) / rect.height;
      mouse.current.energy = Math.min(1, mouse.current.energy + 0.05);
    };
    section.addEventListener("pointermove", onMove);
    return () => section.removeEventListener("pointermove", onMove);
  }, []);

  useGSAP(
    () => {
      gsap.to(scroll, {
        current: 1,
        ease: "none",
        scrollTrigger: {
          trigger: scope.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.from("[data-vz-head] span", {
        yPercent: 110,
        duration: 1.15,
        ease: "power4.out",
        stagger: 0.1,
        scrollTrigger: { trigger: "[data-vz-head]", start: "top 75%" },
      });

      gsap.from("[data-vz-stat]", {
        opacity: 0,
        y: 30,
        duration: 0.9,
        stagger: 0.08,
        scrollTrigger: { trigger: "[data-vz-grid]", start: "top 78%" },
      });
    },
    { scope }
  );

  return (
    <section ref={scope} className="relative overflow-hidden bg-void">
      <div className="mx-auto max-w-[1560px] px-5 py-28 md:px-10 md:py-40">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 data-vz-head className="display-type text-[clamp(2.9rem,6.5vw,6.5rem)] text-bone">
            <span className="block overflow-hidden">
              <span className="block">MEASURED.</span>
            </span>
            <span className="block overflow-hidden">
              <span className="display-outline block" style={{ WebkitTextStroke: "1.5px #9ca0a6" }}>
                THEN MASTERED.
              </span>
            </span>
          </h2>
          <p className="eyebrow max-w-[240px] pb-3 text-smoke">
            EVERY UNIT IS SWEPT, PLOTTED AND TUNED BEFORE IT SHIPS.
          </p>
        </div>

        {/* Waveform */}
        <div className="relative mt-16 h-[240px] md:mt-20 md:h-[320px]">
          <canvas ref={canvasRef} className="h-full w-full" aria-hidden />
          <div className="pointer-events-none absolute left-0 top-0 font-mono text-[10px] tracking-[0.25em] text-smoke">
            FREQUENCY SWEEP — UNIT NO. 0148
          </div>
          <div className="pointer-events-none absolute bottom-0 right-0 font-mono text-[10px] tracking-[0.25em] text-smoke">
            INPUT: LIVE ROOM · 24-BIT
          </div>
        </div>

        {/* Spec grid */}
        <div data-vz-grid className="mt-16 grid grid-cols-2 border-l border-t border-line lg:grid-cols-3">
          {STATS.map((s) => (
            <div
              key={s.label}
              data-vz-stat
              className="group border-b border-r border-line p-6 transition-colors duration-500 hover:bg-carbon/60 md:p-9"
            >
              <div className="font-mono text-2xl text-bone md:text-4xl">{s.value}</div>
              <div className="eyebrow mt-3 text-smoke transition-colors duration-500 group-hover:text-ember">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
