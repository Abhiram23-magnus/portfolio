"use client";

import { profile, heroSkills } from "@/lib/data";
import Section from "./Section";
import { DownloadIcon, ExternalLinkIcon, CheckIcon, ChipIcon } from "./icons";

export default function Resume() {
  const trackDownload = () => {
    if (typeof window !== "undefined") {
      // eslint-disable-next-line no-console
      console.log("[analytics] resume_downloaded", {
        ts: new Date().toISOString(),
      });
    }
  };

  return (
    <Section
      id="resume"
      eyebrow="06 / Resume"
      title="Recruiter-ready resume."
      description="Preview the PDF inline or download the ATS-friendly version directly. No login, no gate — single click."
    >
      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        <div className="card rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between gap-3 px-5 py-3 border-b border-[color:var(--border)] bg-white/[0.02]">
            <div className="flex items-center gap-2 text-sm">
              <span className="w-2 h-2 rounded-full bg-red-400/70" />
              <span className="w-2 h-2 rounded-full bg-yellow-400/70" />
              <span className="w-2 h-2 rounded-full bg-green-400/70" />
              <span className="ml-3 font-mono text-xs text-[color:var(--muted)]">
                {profile.resumeFileName}
              </span>
            </div>
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs text-[color:var(--muted)] hover:text-[color:var(--foreground)]"
            >
              Open in new tab
              <ExternalLinkIcon size={14} />
            </a>
          </div>
          <div className="relative bg-zinc-900">
            <object
              data={`${profile.resumeUrl}#toolbar=0&navpanes=0`}
              type="application/pdf"
              className="w-full h-[720px] block"
              aria-label="Embedded resume preview"
            >
              <div className="p-10 text-center text-sm text-[color:var(--muted)]">
                Your browser can&apos;t display the embedded preview.{" "}
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[color:var(--accent)] underline"
                >
                  Open the PDF
                </a>{" "}
                instead.
              </div>
            </object>
          </div>
        </div>

        <aside className="space-y-5">
          <div className="card rounded-2xl p-6">
            <div className="flex items-center gap-2 text-[color:var(--accent)]">
              <ChipIcon size={18} />
              <span className="font-mono text-xs uppercase tracking-[0.18em]">
                Core expertise
              </span>
            </div>
            <ul className="mt-5 space-y-3">
              {heroSkills.map((s) => (
                <li
                  key={s}
                  className="flex items-center gap-3 text-sm text-[color:var(--foreground)]"
                >
                  <CheckIcon
                    size={16}
                    className="text-[color:var(--accent)] shrink-0"
                  />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card rounded-2xl p-6">
            <a
              href={profile.resumeUrl}
              download={profile.resumeFileName}
              onClick={trackDownload}
              className="btn-primary w-full inline-flex items-center justify-center gap-2 rounded-full h-12 text-sm font-medium"
            >
              <DownloadIcon size={16} />
              Download Resume
            </a>
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary mt-3 w-full inline-flex items-center justify-center gap-2 rounded-full h-12 text-sm font-medium"
            >
              <ExternalLinkIcon size={16} />
              View Resume
            </a>
            <div className="mt-5 pt-5 border-t border-[color:var(--border)] flex items-center justify-between text-xs">
              <span className="text-[color:var(--muted)]">Last updated</span>
              <span className="font-mono text-[color:var(--foreground)]">
                {profile.resumeLastUpdated}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-[color:var(--muted)]">Format</span>
              <span className="font-mono text-[color:var(--foreground)]">
                PDF · ATS-friendly
              </span>
            </div>
          </div>
        </aside>
      </div>
    </Section>
  );
}
