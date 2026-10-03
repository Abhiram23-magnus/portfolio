import { heroChips, profile } from "@/lib/data";
import { ArrowRightIcon, DownloadIcon, GithubIcon, LinkedinIcon, MailIcon } from "./icons";

export default function Hero() {
  return (
    <section
      id="home"
      aria-labelledby="hero-title"
      className="relative mx-auto flex min-h-[100svh] w-full max-w-6xl items-center px-4 pb-16 pt-28 sm:px-6"
    >
      <div className="max-w-2xl">
        <p className="eyebrow flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[color:var(--ok)] opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[color:var(--ok)]" />
          </span>
          System status: ready · Open to embedded / firmware roles
        </p>

        <h1
          id="hero-title"
          className="mt-5 text-[2.6rem] font-semibold uppercase leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl"
        >
          Bikkina Abhiram
          <br />
          <span className="text-[color:var(--accent-strong)]">Choudhary</span>
        </h1>

        <p className="mt-5 text-xl font-medium text-white sm:text-2xl">{profile.title}</p>
        <p className="mt-1 font-mono text-sm text-[color:var(--muted)]">
          {profile.subtitle} · {profile.location}
        </p>

        <p className="mt-6 max-w-xl text-base leading-relaxed text-[#c4d2dd] sm:text-lg">
          {profile.pitch}
        </p>

        <ul className="mt-6 flex flex-wrap gap-2" aria-label="Core technologies">
          {heroChips.map((c) => (
            <li key={c} className="chip">
              {c}
            </li>
          ))}
        </ul>

        <div className="mt-9 flex flex-wrap gap-3">
          <a href="#projects" className="btn btn-primary">
            View Projects
            <ArrowRightIcon size={16} />
          </a>
          <a href={profile.resumeUrl} download={profile.resumeFileName} className="btn btn-ghost">
            <DownloadIcon size={16} />
            Download Resume
          </a>
          <a href="#contact" className="btn btn-ghost">
            Contact Me
          </a>
        </div>

        <div className="mt-8 flex items-center gap-5 text-sm text-[color:var(--muted)]">
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 hover:text-white"
          >
            <GithubIcon size={18} /> GitHub
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 hover:text-white"
          >
            <LinkedinIcon size={18} /> LinkedIn
          </a>
          <a href={`mailto:${profile.email}`} className="inline-flex items-center gap-2 hover:text-white">
            <MailIcon size={18} /> Email
          </a>
        </div>
      </div>

      <a
        href="#about"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-[color:var(--muted)] hover:text-white sm:flex"
      >
        Scroll to enter the board
        <span className="h-8 w-px bg-gradient-to-b from-[color:var(--accent)] to-transparent" />
      </a>
    </section>
  );
}
