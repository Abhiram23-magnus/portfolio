import { experience } from "@/lib/data";
import Section from "./Section";
import Flow from "./viz/Flow";

export default function Experience() {
  const e = experience;
  return (
    <Section
      id="experience"
      eyebrow="04 / Experience"
      title="Internship: bare-metal firmware on Cortex-M."
    >
      <ol className="relative border-l border-[color:var(--border-strong)] pl-6 sm:pl-8">
        <li className="relative">
          <span
            aria-hidden
            className="absolute -left-[31px] top-2 h-3 w-3 rounded-full border-2 border-[color:var(--accent)] bg-[color:var(--background)] shadow-[0_0_10px_var(--accent)] sm:-left-[39px]"
          />
          <div className="panel p-6 sm:p-8">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-xl font-semibold">
                {e.role} <span className="text-[color:var(--muted)]">·</span>{" "}
                <span className="text-[color:var(--accent-strong)]">{e.company}</span>
              </h3>
              <p className="font-mono text-sm text-[color:var(--muted)]">{e.period}</p>
            </div>

            <ul className="mt-5 list-disc space-y-2 pl-5 text-[0.95rem] leading-relaxed text-[#D5D1C5] marker:text-[color:var(--accent)]">
              {e.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>

            <ul className="mt-6 flex flex-wrap gap-2" aria-label="Highlights">
              {e.highlights.map((h) => (
                <li key={h} className="chip">
                  {h}
                </li>
              ))}
            </ul>

            <div className="mt-8 rounded-xl border border-[color:var(--border)] bg-black/25 p-4">
              <p className="eyebrow mb-4">Firmware debugging workflow</p>
              <Flow
                label="Code, compile, simulator, flash, target hardware, logic analyzer, debug"
                nodes={e.workflow}
              />
            </div>
          </div>
        </li>
      </ol>
    </Section>
  );
}
