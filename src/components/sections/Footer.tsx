"use client";

import { useRef, useState, type FormEvent } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

const NAV: Record<string, string[]> = {
  HEADPHONES: ["Auric One", "Studio Noir", "Auric Pop", "Heritage"],
  EARBUDS: ["Pulse Buds", "Pulse Pro", "Sport Loop"],
  SPEAKERS: ["Roomkit 1", "Roomkit Duo", "Outpost"],
  TECHNOLOGY: ["Spatial Engine", "ANC Lab", "Drivers", "Firmware"],
  SUPPORT: ["Setup", "Repairs", "Warranty", "Contact"],
};

const SOCIALS = ["Instagram", "YouTube", "TikTok", "X"];

export default function Footer() {
  const scope = useRef<HTMLElement>(null);
  const [subscribed, setSubscribed] = useState(false);

  useGSAP(
    () => {
      gsap.from("[data-ft-col]", {
        opacity: 0,
        y: 34,
        duration: 0.9,
        stagger: 0.07,
        scrollTrigger: { trigger: scope.current, start: "top 80%" },
      });
      gsap.from("[data-ft-brand]", {
        yPercent: 42,
        opacity: 0,
        duration: 1.4,
        ease: "power4.out",
        scrollTrigger: { trigger: "[data-ft-brand]", start: "top 96%" },
      });
    },
    { scope }
  );

  const onSubscribe = (e: FormEvent) => {
    e.preventDefault();
    setSubscribed(true);
  };

  return (
    <footer ref={scope} className="relative overflow-hidden border-t border-line bg-void">
      {/* Marquee strip */}
      <div className="border-b border-line py-5" aria-hidden>
        <div className="animate-marquee flex w-max gap-10 whitespace-nowrap">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="display-type flex items-center gap-10 text-2xl text-bone/25">
              FEEL EVERY FREQUENCY <span className="h-2 w-2 rounded-full bg-ember/60" />
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-[1560px] px-5 pt-20 md:px-10 md:pt-28">
        <div className="grid gap-14 lg:grid-cols-12">
          {/* Newsletter */}
          <div data-ft-col className="lg:col-span-4">
            <h3 className="display-type text-3xl text-bone md:text-4xl">
              STAY IN
              <br />
              THE MIX<span className="text-ember">.</span>
            </h3>
            <p className="mt-4 max-w-xs text-[14px] leading-relaxed text-steel">
              Drops, firmware notes and listening-room stories. One email a month, tuned like
              everything else we make.
            </p>
            {subscribed ? (
              <p className="mt-6 inline-flex items-center gap-3 border border-ember/40 px-4 py-3 font-mono text-sm text-ember">
                <span className="h-1.5 w-1.5 rounded-full bg-ember" /> YOU&apos;RE ON THE LIST
              </p>
            ) : (
              <form onSubmit={onSubscribe} className="mt-6 flex max-w-sm border-b border-steel/40 focus-within:border-ember">
                <label htmlFor="ft-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="ft-email"
                  type="email"
                  required
                  placeholder="your@email.com"
                  className="w-full bg-transparent py-3 text-sm text-bone outline-none placeholder:text-smoke"
                />
                <button
                  type="submit"
                  className="shrink-0 px-2 font-mono text-sm tracking-widest text-bone transition-colors hover:text-ember"
                >
                  SUBSCRIBE →
                </button>
              </form>
            )}

            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2">
              {SOCIALS.map((s) => (
                <a
                  key={s}
                  href="#top"
                  className="group relative font-mono text-xs tracking-[0.2em] text-smoke transition-colors duration-300 hover:text-bone"
                >
                  {s.toUpperCase()}
                  <span className="absolute -bottom-1 left-0 h-px w-0 bg-ember transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-8 lg:grid-cols-5">
            {Object.entries(NAV).map(([head, items]) => (
              <div key={head} data-ft-col>
                <div className="eyebrow text-smoke">{head}</div>
                <ul className="mt-5 space-y-3">
                  {items.map((item) => (
                    <li key={item}>
                      <a
                        href="#top"
                        className="text-[13.5px] text-steel transition-colors duration-300 hover:text-ember"
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Giant brand type */}
        <div className="mt-20 overflow-hidden md:mt-28">
          <div
            data-ft-brand
            className="display-type select-none text-center text-[clamp(5rem,19vw,19rem)] leading-[0.8] text-transparent transition-colors duration-700 hover:text-bone/[0.06]"
            style={{ WebkitTextStroke: "1px #2a2d33" }}
            aria-hidden
          >
            AURIC
          </div>
        </div>

        {/* Legal */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-line py-7 md:flex-row">
          <p className="font-mono text-[11px] tracking-wider text-smoke">
            © 2026 AURIC AUDIO — A CONCEPT STUDY. PHOTOGRAPHY VIA UNSPLASH.
          </p>
          <div className="flex gap-7">
            {["PRIVACY", "TERMS", "IMPRINT"].map((l) => (
              <a
                key={l}
                href="#top"
                className="font-mono text-[11px] tracking-wider text-smoke transition-colors hover:text-bone"
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
