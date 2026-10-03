import { profile } from "@/lib/data";
import Section from "./Section";
import { DownloadIcon, GithubIcon, LinkedinIcon, MailIcon, PhoneIcon } from "./icons";

export default function Contact() {
  return (
    <Section id="contact" eyebrow="07 / Connect" title="Open a channel.">
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div
          className="panel overflow-hidden font-mono text-sm"
          role="group"
          aria-label="Status terminal"
        >
          <div className="flex items-center gap-2 border-b border-[color:var(--border)] bg-white/[0.03] px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
            <span className="ml-2 text-xs text-[color:var(--muted)]">uart0 — 115200 8N1</span>
          </div>
          <div className="space-y-2 p-5 leading-relaxed">
            <p>
              <span className="text-[color:var(--muted)]">&gt;</span> SYSTEM STATUS:{" "}
              <span className="text-[color:var(--ok)]">READY</span>
            </p>
            <p>
              <span className="text-[color:var(--muted)]">&gt;</span> AVAILABLE FOR:{" "}
              <span className="text-[color:var(--accent-strong)]">EMBEDDED / FIRMWARE OPPORTUNITIES</span>
            </p>
            <p>
              <span className="text-[color:var(--muted)]">&gt;</span>{" "}
              TARGET ROLES: Embedded Software &amp; Firmware Engineer
            </p>
            <p>
              <span className="text-[color:var(--muted)]">&gt;</span> LOCATION: {profile.location}
            </p>
            <p>
              <span className="text-[color:var(--muted)]">&gt;</span> AWAITING INPUT
              <span aria-hidden className="ml-1 inline-block h-4 w-2 translate-y-0.5 animate-pulse bg-[color:var(--accent)]" />
            </p>
          </div>
          <div className="border-t border-[color:var(--border)] p-5">
            <a
              href={profile.resumeUrl}
              download={profile.resumeFileName}
              className="btn btn-primary w-full sm:w-auto"
            >
              <DownloadIcon size={16} />
              Download Resume
            </a>
          </div>
        </div>

        <ul className="grid gap-4">
          <li>
            <a
              href={`mailto:${profile.email}`}
              className="panel flex min-h-[64px] items-center gap-4 p-4 transition-colors hover:border-[color:var(--accent)]"
            >
              <MailIcon size={22} className="shrink-0 text-[color:var(--accent)]" />
              <span className="min-w-0">
                <span className="block font-mono text-[11px] uppercase tracking-widest text-[color:var(--muted)]">
                  Email
                </span>
                <span className="block break-all">{profile.email}</span>
              </span>
            </a>
          </li>
          <li>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="panel flex min-h-[64px] items-center gap-4 p-4 transition-colors hover:border-[color:var(--accent)]"
            >
              <LinkedinIcon size={22} className="shrink-0 text-[color:var(--accent)]" />
              <span className="min-w-0">
                <span className="block font-mono text-[11px] uppercase tracking-widest text-[color:var(--muted)]">
                  LinkedIn
                </span>
                <span className="block break-all">linkedin.com/in/abhiram-choudhary-</span>
              </span>
            </a>
          </li>
          <li>
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="panel flex min-h-[64px] items-center gap-4 p-4 transition-colors hover:border-[color:var(--accent)]"
            >
              <GithubIcon size={22} className="shrink-0 text-[color:var(--accent)]" />
              <span className="min-w-0">
                <span className="block font-mono text-[11px] uppercase tracking-widest text-[color:var(--muted)]">
                  GitHub
                </span>
                <span className="block break-all">github.com/Abhiram23-magnus</span>
              </span>
            </a>
          </li>
          <li>
            <a
              href={profile.phoneHref}
              className="panel flex min-h-[64px] items-center gap-4 p-4 transition-colors hover:border-[color:var(--accent)]"
            >
              <PhoneIcon size={22} className="shrink-0 text-[color:var(--accent)]" />
              <span className="min-w-0">
                <span className="block font-mono text-[11px] uppercase tracking-widest text-[color:var(--muted)]">
                  Phone
                </span>
                <span className="block">{profile.phone}</span>
              </span>
            </a>
          </li>
        </ul>
      </div>
    </Section>
  );
}
