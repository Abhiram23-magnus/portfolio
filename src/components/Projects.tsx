import { projects } from "@/lib/data";
import Section from "./Section";

export default function Projects() {
  return (
    <Section
      id="projects"
      eyebrow="03 / Projects"
      title="End-to-end embedded builds."
      description="Each project shipped working firmware on real hardware — from sensor interfacing and ISRs to cloud streaming and mobile control."
    >
      <div className="space-y-6">
        {projects.map((p, i) => (
          <article
            key={p.title}
            className="card rounded-2xl p-6 md:p-8 transition-colors"
          >
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
              <div>
                <div className="font-mono text-xs text-[color:var(--accent)]">
                  PROJECT.{String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="mt-2 text-xl md:text-2xl font-semibold tracking-tight">
                  {p.title}
                </h3>
              </div>
              <div className="font-mono text-xs text-[color:var(--muted)] md:text-right">
                {p.period}
              </div>
            </div>

            <ul className="mt-5 flex flex-wrap gap-2">
              {p.stack.map((s) => (
                <li
                  key={s}
                  className="chip rounded-full px-3 py-1 text-xs text-[color:var(--foreground)]/85"
                >
                  {s}
                </li>
              ))}
            </ul>

            <ul className="mt-6 space-y-3 text-sm md:text-[15px] text-[color:var(--muted)] leading-relaxed">
              {p.bullets.map((b, j) => (
                <li key={j} className="flex gap-3">
                  <span
                    aria-hidden
                    className="mt-2 inline-block w-1.5 h-1.5 rounded-full bg-[color:var(--accent)] shrink-0"
                  />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </Section>
  );
}
