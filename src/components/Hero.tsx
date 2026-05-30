import { profile } from "@/lib/data";
import { DownloadIcon, ArrowRightIcon, MapPinIcon } from "./icons";

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30" aria-hidden />
      <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-24 md:pt-28 md:pb-32">
        <div className="inline-flex items-center gap-2 rounded-full chip px-3 py-1 text-xs font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--accent)] animate-pulse" />
          Open to Embedded / Firmware Engineer roles
        </div>

        <h1 className="mt-6 text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05]">
          {profile.name.split(" ").slice(0, 2).join(" ")}
          <br />
          <span className="text-[color:var(--accent)]">
            {profile.name.split(" ").slice(2).join(" ")}
          </span>
        </h1>

        <p className="mt-5 text-lg md:text-xl text-[color:var(--muted)] max-w-2xl">
          {profile.title}. {profile.pitch}
        </p>

        <div className="mt-4 flex items-center gap-2 text-sm text-[color:var(--muted)]">
          <MapPinIcon size={16} />
          <span>{profile.location}</span>
        </div>

        <div className="mt-9 flex flex-col sm:flex-row gap-3">
          <a
            href="#projects"
            className="btn-primary inline-flex items-center justify-center gap-2 rounded-full px-6 h-12 text-sm font-medium"
          >
            View Projects
            <ArrowRightIcon size={16} />
          </a>
          <a
            href={profile.resumeUrl}
            download={profile.resumeFileName}
            className="btn-secondary inline-flex items-center justify-center gap-2 rounded-full px-6 h-12 text-sm font-medium"
          >
            <DownloadIcon size={16} />
            Download Resume
          </a>
        </div>
      </div>
    </section>
  );
}
