import { experience } from "@/lib/data";
import Section from "./Section";

export default function Experience() {
  return (
    <Section
      id="experience"
      eyebrow="04 / Experience"
      title="Internship."
    >
      <div className="space-y-6">
        {experience.map((e) => (
          <article key={e.company} className="card rounded-2xl p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-1">
              <h3 className="text-xl md:text-2xl font-semibold tracking-tight">
                {e.role}{" "}
                <span className="text-[color:var(--accent)] font-normal">
                  · {e.company}
                </span>
              </h3>
              <div className="font-mono text-xs text-[color:var(--muted)]">
                {e.period}
              </div>
            </div>
            <ul className="mt-5 space-y-3 text-sm md:text-[15px] text-[color:var(--muted)] leading-relaxed">
              {e.bullets.map((b, i) => (
                <li key={i} className="flex gap-3">
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
