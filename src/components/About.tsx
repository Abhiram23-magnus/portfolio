import { profile } from "@/lib/data";
import Section from "./Section";

export default function About() {
  return (
    <Section id="about" eyebrow="01 / About" title="From hardware spec to flashed firmware.">
      <div className="grid md:grid-cols-3 gap-10">
        <div className="md:col-span-2">
          <p className="text-base md:text-lg text-[color:var(--muted)] leading-relaxed">
            {profile.summary}
          </p>
          <p className="mt-5 text-base md:text-lg text-[color:var(--muted)] leading-relaxed">
            Seeking a full-time Embedded Software Engineer or Firmware Engineer
            role to contribute to reliable, low-level hardware-software
            development.
          </p>
        </div>
        <div className="card rounded-2xl p-6 h-fit">
          <div className="font-mono text-xs uppercase tracking-[0.18em] text-[color:var(--muted)] mb-4">
            Snapshot
          </div>
          <dl className="space-y-3 text-sm">
            <Row label="Focus" value="Bare-metal firmware, IoT" />
            <Row label="Targets" value="STM32, ESP32, Cortex-M" />
            <Row label="Stack" value="C / Embedded C / C++" />
            <Row label="Cert" value="NI CLAD (LabVIEW)" />
            <Row label="Status" value="B.Tech ECE · 8.3 CGPA" />
          </dl>
        </div>
      </div>
    </Section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-[color:var(--muted)]">{label}</dt>
      <dd className="text-right text-[color:var(--foreground)]">{value}</dd>
    </div>
  );
}
