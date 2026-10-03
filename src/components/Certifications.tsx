import { certifications } from "@/lib/data";
import Section from "./Section";
import { ChipIcon } from "./icons";

export default function Certifications() {
  return (
    <Section id="certifications" eyebrow="06 / Certifications" title="Training and credentials.">
      <ul className="grid gap-5 md:grid-cols-3">
        {certifications.map((c, i) => (
          <li
            key={c.name}
            className="panel group relative overflow-hidden p-6 transition-transform duration-300 hover:-translate-y-1.5 motion-reduce:transform-none"
            style={{ transform: `perspective(900px) rotateX(0deg)` }}
          >
            <span
              aria-hidden
              className="absolute right-4 top-4 text-[color:var(--accent)] opacity-60 transition-opacity group-hover:opacity-100"
            >
              <ChipIcon size={22} />
            </span>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[color:var(--accent)]">
              Credential 0{i + 1}
            </p>
            <h3 className="mt-3 pr-8 text-lg font-semibold leading-snug">{c.name}</h3>
            <p className="mt-2 text-sm text-[#c4d2dd]">{c.issuer}</p>
            <p className="mt-4 font-mono text-sm text-[color:var(--muted)]">{c.date}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
