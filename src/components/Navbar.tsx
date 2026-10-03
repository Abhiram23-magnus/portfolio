"use client";

import { useEffect, useRef, useState } from "react";
import { navItems, profile } from "@/lib/data";
import { useActiveSection } from "@/lib/hooks";
import { ChipIcon, CloseIcon, DownloadIcon, MenuIcon } from "./icons";

export default function Navbar() {
  const active = useActiveSection();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close the mobile menu with Escape and return focus to the button
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuBtn.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-[color:var(--border)] bg-[rgba(5,8,12,0.72)] backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <nav
        aria-label="Primary"
        className={`mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 transition-all duration-300 sm:px-6 ${
          scrolled ? "h-14" : "h-20"
        }`}
      >
        <a href="#home" className="flex items-center gap-2 font-mono text-sm font-semibold">
          <ChipIcon size={scrolled ? 20 : 24} className="text-[color:var(--accent)] transition-all" />
          <span className="hidden sm:inline">{profile.shortName}</span>
          <span className="sm:hidden">A.C.</span>
        </a>

        <ul className="hidden items-center gap-0.5 lg:flex">
          {navItems.map((n) => (
            <li key={n.id}>
              <a
                href={`#${n.id}`}
                aria-current={active === n.id ? "location" : undefined}
                className={`rounded-full px-3 py-1.5 text-[13px] transition-colors ${
                  active === n.id
                    ? "bg-[rgba(34,211,238,0.14)] text-[color:var(--accent-strong)]"
                    : "text-[color:var(--muted)] hover:text-white"
                }`}
              >
                {n.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href={profile.resumeUrl}
            download={profile.resumeFileName}
            className="btn btn-primary !min-h-[38px] !px-4 !text-[13px]"
          >
            <DownloadIcon size={15} />
            <span className="hidden sm:inline">Download Resume</span>
            <span className="sm:hidden">Resume</span>
          </a>
          <button
            ref={menuBtn}
            type="button"
            className="btn btn-ghost !px-3 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <CloseIcon size={20} /> : <MenuIcon size={20} />}
          </button>
        </div>
      </nav>

      {open && (
        <div
          id="mobile-menu"
          className="border-t border-[color:var(--border)] bg-[rgba(5,8,12,0.95)] backdrop-blur-xl lg:hidden"
        >
          <ul className="mx-auto grid max-w-6xl gap-1 px-4 py-3">
            {navItems.map((n) => (
              <li key={n.id}>
                <a
                  href={`#${n.id}`}
                  onClick={() => setOpen(false)}
                  aria-current={active === n.id ? "location" : undefined}
                  className={`block rounded-lg px-3 py-3 text-base ${
                    active === n.id
                      ? "bg-[rgba(34,211,238,0.14)] text-[color:var(--accent-strong)]"
                      : "text-[color:var(--foreground)]"
                  }`}
                >
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
