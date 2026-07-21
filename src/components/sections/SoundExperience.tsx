"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { IMG } from "@/lib/images";

const LINES = ["HEAR WHAT", "YOU'VE BEEN", "MISSING."];

export default function SoundExperience() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // dark → light hand-off as the section arrives
      gsap.fromTo(
        scope.current,
        { backgroundColor: "#0a0a0b" },
        {
          backgroundColor: "#f2f0eb",
          ease: "none",
          scrollTrigger: {
            trigger: scope.current,
            start: "top 85%",
            end: "top 40%",
            scrub: true,
          },
        }
      );

      // headline lines rise in
      gsap.from("[data-se-line] > span", {
        yPercent: 110,
        duration: 1.2,
        ease: "power4.out",
        stagger: 0.12,
        scrollTrigger: { trigger: "[data-se-headline]", start: "top 72%" },
      });

      // …then drift independently while scrolling
      gsap.to("[data-se-line='0']", {
        xPercent: 5,
        ease: "none",
        scrollTrigger: { trigger: scope.current, start: "top 60%", end: "bottom top", scrub: true },
      });
      gsap.to("[data-se-line='2']", {
        xPercent: -4,
        ease: "none",
        scrollTrigger: { trigger: scope.current, start: "top 60%", end: "bottom top", scrub: true },
      });

      // main image mask reveal + slow zoom-out
      gsap.fromTo(
        "[data-se-image]",
        { clipPath: "inset(14% 10% 22% 10%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          ease: "none",
          scrollTrigger: {
            trigger: "[data-se-image]",
            start: "top 85%",
            end: "top 25%",
            scrub: true,
          },
        }
      );
      gsap.fromTo(
        "[data-se-image] img",
        { scale: 1.22 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: "[data-se-image]",
            start: "top 85%",
            end: "bottom 30%",
            scrub: true,
          },
        }
      );

      // secondary image floats on its own parallax lane
      gsap.fromTo(
        "[data-se-side]",
        { yPercent: 16 },
        {
          yPercent: -14,
          ease: "none",
          scrollTrigger: {
            trigger: "[data-se-side]",
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );

      gsap.from("[data-se-copy]", {
        opacity: 0,
        y: 36,
        duration: 1,
        stagger: 0.12,
        scrollTrigger: { trigger: "[data-se-copy]", start: "top 80%" },
      });
    },
    { scope }
  );

  return (
    <section ref={scope} className="relative overflow-hidden bg-bone text-void">
      <div className="mx-auto max-w-[1560px] px-5 py-28 md:px-10 md:py-40">
        <div className="grid gap-14 lg:grid-cols-12">
          {/* Headline */}
          <div className="lg:col-span-8">
            <div className="eyebrow mb-8 text-void/50">THE SOUND EXPERIENCE</div>
            <h2
              data-se-headline
              className="display-type text-[clamp(2.9rem,7.5vw,7.5rem)] text-void"
            >
              {LINES.map((line, i) => (
                <span key={line} data-se-line={i} className="block overflow-hidden">
                  <span className={`block ${i === 2 ? "display-outline" : ""}`} style={i === 2 ? { WebkitTextStroke: "2px #0a0a0b" } : undefined}>
                    {line}
                  </span>
                </span>
              ))}
            </h2>
          </div>

          {/* Supporting copy */}
          <div className="flex flex-col justify-end gap-10 lg:col-span-4">
            <p data-se-copy className="max-w-sm text-[15px] leading-relaxed text-void/70">
              Most headphones play music. AURIC reconstructs it — every layer placed exactly where
              the artist left it. Voices in front of you. Strings behind. Air everywhere else.
            </p>
            <div data-se-copy className="flex gap-10 border-t border-void/15 pt-6">
              <div>
                <div className="font-mono text-2xl">20Hz</div>
                <div className="eyebrow mt-1 text-void/50">LOW REACH</div>
              </div>
              <div>
                <div className="font-mono text-2xl">20kHz</div>
                <div className="eyebrow mt-1 text-void/50">HIGH REACH</div>
              </div>
              <div>
                <div className="font-mono text-2xl">±0.5dB</div>
                <div className="eyebrow mt-1 text-void/50">TUNING</div>
              </div>
            </div>
          </div>
        </div>

        {/* Imagery */}
        <div className="mt-16 grid gap-6 md:mt-24 md:grid-cols-12 md:gap-8">
          <div
            data-se-image
            className="relative aspect-[4/5] overflow-hidden md:col-span-7 md:aspect-[4/4.6] lg:col-span-8 lg:aspect-[16/10]"
          >
            <Image
              src={IMG.editorialSuit}
              alt="Editorial black-and-white portrait of a man in a tailored suit listening through over-ear headphones"
              fill
              sizes="(max-width: 768px) 100vw, 60vw"
              className="object-cover object-[50%_20%]"
            />
          </div>
          <div className="md:col-span-5 lg:col-span-4">
            <div data-se-side className="relative mx-auto mt-6 aspect-[3/4] max-w-[340px] overflow-hidden md:mt-24">
              <Image
                src={IMG.streetJoy}
                alt="Young woman in a patterned sweater singing along in white headphones on a city street"
                fill
                sizes="(max-width: 768px) 80vw, 26vw"
                className="object-cover"
              />
            </div>
            <p className="eyebrow mt-5 text-center text-void/50 md:text-left md:pl-10">
              TUNED IN LISTENING ROOMS. LIVED IN THE STREET.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
