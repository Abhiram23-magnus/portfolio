"use client";

import { useState } from "react";
import { skills } from "@/lib/data";
import Section from "./Section";
import { SignalViz, signalTitle, type SignalKind } from "./viz/Waveforms";

/**
 * Skill groups. Items that have a signal behind them (UART, SPI, ADC, RTOS…)
 * are buttons: hover, focus or tap shows an animated visual of that concept.
 */
export default function Skills() {
  const [active, setActive] = useState<SignalKind | null>(null);

  return (
    <Section
      id="skills"
      eyebrow="02 / Technical skills"
      title="The toolkit, grouped by layer."
      description="Hover, focus or tap a highlighted skill to see the signal behind it."
    >
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="grid gap-4 sm:grid-cols-2">
          {skills.map((g) => (
            <div key={g.group} className="panel p-5">
              <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-[color:var(--accent)]">
                {g.group}
              </h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {g.items.map((item) => {
                  const kind = g.vizItems?.[item] ?? (item === "FreeRTOS" ? g.viz : undefined);
                  if (!kind) {
                    return (
                      <li key={item} className="chip">
                        {item}
                      </li>
                    );
                  }
                  return (
                    <li key={item}>
                      <button
                        type="button"
                        className="chip cursor-pointer !border-[color:var(--border-strong)] !text-[color:var(--accent-strong)] hover:!bg-[rgba(212,162,78,0.12)]"
                        aria-pressed={active === kind}
                        onMouseEnter={() => setActive(kind)}
                        onFocus={() => setActive(kind)}
                        onClick={() => setActive(kind)}
                      >
                        {item}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="panel p-5" aria-live="polite">
            <p className="eyebrow">Live signal</p>
            <h3 className="mt-2 text-lg font-semibold">
              {active ? signalTitle[active] : "Pick a skill"}
            </h3>
            <div className="mt-4 min-h-[210px]">
              {active ? (
                <SignalViz kind={active} />
              ) : (
                <div className="flex h-[210px] items-center justify-center rounded-lg border border-dashed border-[color:var(--border)] px-6 text-center text-sm text-[color:var(--muted)]">
                  UART, SPI, I2C, ADC, PWM, interrupts and FreeRTOS are interactive.
                </div>
              )}
            </div>
            <p className="mt-3 text-xs text-[color:var(--muted)]">
              Illustrative waveforms of the concepts, not captures from a specific project.
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
