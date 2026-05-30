import { education, certifications } from "@/lib/data";
import Section from "./Section";

export default function Education() {
  return (
    <Section id="education" eyebrow="05 / Education" title="Education & Certifications.">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card rounded-2xl p-6 md:p-8">
          <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-[color:var(--accent)] mb-5">
            Education
          </h3>
          <div className="space-y-6">
            {education.map((e) => (
              <div key={e.degree}>
                <div className="flex items-baseline justify-between gap-3">
                  <h4 className="font-medium">{e.degree}</h4>
                  <span className="font-mono text-xs text-[color:var(--muted)] whitespace-nowrap">
                    {e.period}
                  </span>
                </div>
                <div className="mt-1 text-sm text-[color:var(--accent)]">
                  {e.institution}
                </div>
                <div className="mt-2 text-sm text-[color:var(--muted)] leading-relaxed">
                  {e.detail}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card rounded-2xl p-6 md:p-8">
          <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-[color:var(--accent)] mb-5">
            Certifications
          </h3>
          <ul className="space-y-5">
            {certifications.map((c) => (
              <li key={c.name}>
                <div className="font-medium">{c.name}</div>
                <div className="mt-1 text-sm text-[color:var(--muted)]">
                  {c.issuer} · {c.date}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
