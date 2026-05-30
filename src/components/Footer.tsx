import { profile } from "@/lib/data";
import { DownloadIcon, MailIcon, LinkedinIcon } from "./icons";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-[color:var(--border)] mt-12">
      <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-10">
        <div>
          <div className="font-mono text-sm">
            <span className="text-[color:var(--accent)]">$</span>{" "}
            <span>abhiram</span>
            <span className="text-[color:var(--muted)]">.dev</span>
          </div>
          <p className="mt-3 text-sm text-[color:var(--muted)] leading-relaxed max-w-xs">
            Embedded firmware engineer building reliable systems on STM32, ESP32, and ARM Cortex-M.
          </p>
        </div>

        <div>
          <div className="font-mono text-xs uppercase tracking-[0.18em] text-[color:var(--muted)] mb-3">
            Quick links
          </div>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#about" className="hover:text-[color:var(--accent)]">About</a>
            </li>
            <li>
              <a href="#projects" className="hover:text-[color:var(--accent)]">Projects</a>
            </li>
            <li>
              <a href="#resume" className="hover:text-[color:var(--accent)]">Resume</a>
            </li>
            <li>
              <a
                href={profile.resumeUrl}
                download={profile.resumeFileName}
                className="inline-flex items-center gap-2 hover:text-[color:var(--accent)]"
              >
                <DownloadIcon size={14} /> Download Resume
              </a>
            </li>
          </ul>
        </div>

        <div>
          <div className="font-mono text-xs uppercase tracking-[0.18em] text-[color:var(--muted)] mb-3">
            Contact
          </div>
          <ul className="space-y-3 text-sm">
            <li>
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex items-center gap-2 hover:text-[color:var(--accent)]"
              >
                <MailIcon size={16} /> {profile.email}
              </a>
            </li>
            <li>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:text-[color:var(--accent)]"
              >
                <LinkedinIcon size={16} /> LinkedIn
              </a>
            </li>
            <li className="text-[color:var(--muted)]">{profile.phone}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[color:var(--border)]">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between text-xs text-[color:var(--muted)]">
          <span>© {year} {profile.shortName}. All rights reserved.</span>
          <span className="font-mono">Built with Next.js · Tailwind</span>
        </div>
      </div>
    </footer>
  );
}
