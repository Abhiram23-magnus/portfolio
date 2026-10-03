import { education } from "@/lib/data";
import Section from "./Section";

export default function Education() {
  return (
    <Section id="education" eyebrow="05 / Education" title="Electronics & Communication, from diploma to B.Tech.">
      <ol className="relative grid gap-6 border-l border-[color:var(--border-strong)] pl-6 sm:pl-8">
        {education.map((e) => (
          <li key={e.degree} className="relative">
            <span
              aria-hidden
              className="absolute -left-[31px] top-2 h-3 w-3 rounded-full border-2 border-[color:var(--accent)] bg-[color:var(--background)] sm:-left-[39px]"
            />
            <div className="panel p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-lg font-semibold">{e.degree}</h3>
                <p className="font-mono text-sm text-[color:var(--muted)]">{e.period}</p>
              </div>
              <p className="mt-1 text-[color:var(--accent-strong)]">{e.institution}</p>
              <p className="mt-2 text-sm text-[#c4d2dd]">{e.detail}</p>

              {e.coursework.length > 0 && (
                <>
                  <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.2em] text-[color:var(--muted)]">
                    Coursework
                  </p>
                  <ul className="mt-2 grid gap-2 sm:grid-cols-2">
                    {e.coursework.map((c) => (
                      <li
                        key={c}
                        className="flex items-center gap-2 rounded-lg border border-[color:var(--border)] bg-black/20 px-3 py-2 text-sm"
                      >
                        <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[color:var(--accent)]" />
                        {c}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
