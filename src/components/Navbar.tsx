"use client";

import { useEffect, useState } from "react";
import { profile } from "@/lib/data";
import { DownloadIcon, MenuIcon, CloseIcon } from "./icons";

const links = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#experience", label: "Experience" },
  { href: "#resume", label: "Resume" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-200 ${
        scrolled
          ? "backdrop-blur-md bg-[color:var(--background)]/70 border-b border-[color:var(--border)]"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#top" className="font-mono text-sm tracking-tight">
          <span className="text-[color:var(--accent)]">$</span>{" "}
          <span className="text-[color:var(--foreground)]">abhiram</span>
          <span className="text-[color:var(--muted)]">.dev</span>
        </a>

        <ul className="hidden md:flex items-center gap-7 text-sm text-[color:var(--muted)]">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="hover:text-[color:var(--foreground)] transition-colors"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-3">
          <a
            href={profile.resumeUrl}
            download={profile.resumeFileName}
            className="btn-primary inline-flex items-center gap-2 rounded-full px-4 h-10 text-sm font-medium"
          >
            <DownloadIcon size={16} />
            Resume
          </a>
        </div>

        <button
          aria-label="Toggle menu"
          className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-md border border-[color:var(--border)]"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <CloseIcon size={18} /> : <MenuIcon size={18} />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden border-t border-[color:var(--border)] bg-[color:var(--background)]/95 backdrop-blur-md">
          <ul className="px-6 py-4 flex flex-col gap-3 text-sm">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block py-1 text-[color:var(--muted)] hover:text-[color:var(--foreground)]"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href={profile.resumeUrl}
                download={profile.resumeFileName}
                onClick={() => setOpen(false)}
                className="btn-primary inline-flex items-center gap-2 rounded-full px-4 h-10 text-sm font-medium mt-2"
              >
                <DownloadIcon size={16} />
                Download Resume
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
