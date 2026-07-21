"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const LINKS = ["Headphones", "Earbuds", "Speakers", "Technology"];

export default function Navbar() {
  const ref = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(ref.current, {
        yPercent: -100,
        opacity: 0,
        duration: 1,
        ease: "power4.out",
        delay: 0.35,
      });
      ScrollTrigger.create({
        start: 80,
        onToggle: (self) => setScrolled(self.isActive),
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <header
      ref={ref}
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ${
        scrolled || open
          ? "border-b border-line/70 bg-void/70 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-[1560px] items-center justify-between px-5 md:h-[72px] md:px-10">
        {/* Brand */}
        <a href="#top" className="display-type text-xl tracking-tight text-bone md:text-2xl">
          AURIC<span className="text-ember">.</span>
        </a>

        {/* Desktop links */}
        <ul className="hidden items-center gap-9 lg:flex">
          {LINKS.map((l) => (
            <li key={l}>
              <a
                href={`#${l.toLowerCase()}`}
                className="group relative text-[13px] font-medium tracking-wide text-steel transition-colors duration-300 hover:text-bone"
              >
                {l}
                <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-ember transition-all duration-300 group-hover:w-full" />
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2 md:gap-3">
          {/* Search */}
          <button
            aria-label="Search"
            className="flex h-10 w-10 items-center justify-center rounded-full text-steel transition-colors duration-300 hover:bg-carbon hover:text-bone"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" strokeLinecap="round" />
            </svg>
          </button>
          {/* Cart */}
          <button
            aria-label="Cart, 0 items"
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-steel transition-colors duration-300 hover:bg-carbon hover:text-bone"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M6 7h12l-1.2 12.2a1.5 1.5 0 0 1-1.5 1.3H8.7a1.5 1.5 0 0 1-1.5-1.3L6 7Z" />
              <path d="M9 9V6a3 3 0 0 1 6 0v3" strokeLinecap="round" />
            </svg>
            <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-ember" />
          </button>

          <a
            href="#collection"
            className="ml-1 hidden items-center gap-2 rounded-full bg-bone px-5 py-2.5 text-[13px] font-semibold text-void transition-colors duration-300 hover:bg-ember hover:text-bone md:inline-flex"
          >
            Shop
          </a>

          {/* Mobile menu toggle */}
          <button
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] rounded-full text-bone lg:hidden"
          >
            <span
              className={`h-px w-5 bg-current transition-transform duration-300 ${open ? "translate-y-[3px] rotate-45" : ""}`}
            />
            <span
              className={`h-px w-5 bg-current transition-transform duration-300 ${open ? "-translate-y-[3px] -rotate-45" : ""}`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile panel */}
      <div
        className={`grid overflow-hidden transition-[grid-template-rows] duration-500 lg:hidden ${
          open ? "grid-rows-[1fr] border-t border-line/60" : "grid-rows-[0fr]"
        }`}
      >
        <div className="min-h-0">
          <ul className="space-y-1 px-6 py-5">
            {LINKS.map((l) => (
              <li key={l}>
                <a
                  href={`#${l.toLowerCase()}`}
                  onClick={() => setOpen(false)}
                  className="display-type block py-2 text-3xl text-bone/90 transition-colors hover:text-ember"
                >
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
}
