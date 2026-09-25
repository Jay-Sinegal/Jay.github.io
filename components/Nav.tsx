"use client";

import { useEffect, useState } from "react";
import { NAV_LINKS, SITE } from "@/lib/links";
import { ArrowRight, Menu, X } from "lucide-react";

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors ${
        scrolled
          ? "border-white/10 bg-midnight/90 backdrop-blur-md"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <a href="/" className="flex flex-col leading-tight" aria-label="Jaylen Sinegal home">
          <span className="text-sm font-extrabold tracking-[0.14em] text-white">
            {SITE.name}
          </span>
          <span className="text-[10px] font-medium tracking-[0.22em] text-gold uppercase">
            Executive Brand Strategist
          </span>
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-white/70 transition hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="#contact"
            className="hidden items-center gap-2 rounded-md bg-cobalt px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-cobalt/25 transition hover:bg-blue-600 sm:inline-flex"
          >
            Book Consultation
            <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/10 text-white lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-midnight/95 backdrop-blur-md lg:hidden">
          <nav aria-label="Mobile" className="container-page flex flex-col py-4">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="border-b border-white/5 py-3 text-sm font-medium text-white/80 transition hover:text-white"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-md bg-cobalt px-4 py-3 text-sm font-semibold text-white"
            >
              Book Consultation
              <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}