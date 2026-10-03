import { profile } from "@/lib/data";
import Section from "./Section";
import Flow from "./viz/Flow";
import { DownloadIcon } from "./icons";

const focus = [
  "Embedded C",
  "ARM Cortex-M",
  "STM32",
  "ESP32",
  "Firmware development",
  "Bare-metal programming",
  "RTOS concepts",
  "Hardware debugging",
  "UART · SPI · I2C",
];

export default function About() {
  return (
    <Section
      id="about"
      eyebrow="01 / Engineer profile"
      title="Firmware that talks to real hardware."
    >
      <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr]">
        <div className="panel p-6 sm:p-8">
          <p className="text-base leading-relaxed text-[#DAD6CA] sm:text-[1.05rem]">{profile.summary}</p>

          <ul className="mt-6 flex flex-wrap gap-2" aria-label="Focus areas">
            {focus.map((f) => (
              <li key={f} className="chip">
                {f}
              </li>
            ))}
          </ul>

          <a href={profile.resumeUrl} download={profile.resumeFileName} className="btn btn-primary mt-8">
            <DownloadIcon size={16} />
            Download Resume
          </a>
        </div>

        <div className="panel p-6 sm:p-8">
          <p className="eyebrow">System view</p>
          <p className="mt-2 text-sm text-[color:var(--muted)]">
            How the pieces I work with fit together, from the microcontroller to the application.
          </p>
          <Flow
            className="mt-6"
            label="MCU, firmware, sensors, communication, debugging, application"
            nodes={["MCU", "Firmware", "Sensors", "Communication", "Debugging", "Application"]}
          />
          <dl className="mt-8 grid grid-cols-2 gap-x-4 gap-y-5 text-sm">
            <div>
              <dt className="font-mono text-[11px] uppercase tracking-widest text-[color:var(--muted)]">Degree</dt>
              <dd className="mt-1">B.Tech ECE, KL University (May 2026)</dd>
            </div>
            <div>
              <dt className="font-mono text-[11px] uppercase tracking-widest text-[color:var(--muted)]">Target roles</dt>
              <dd className="mt-1">Embedded Software &amp; Firmware Engineer</dd>
            </div>
            <div>
              <dt className="font-mono text-[11px] uppercase tracking-widest text-[color:var(--muted)]">Based in</dt>
              <dd className="mt-1">{profile.location}</dd>
            </div>
            <div>
              <dt className="font-mono text-[11px] uppercase tracking-widest text-[color:var(--muted)]">Debug stack</dt>
              <dd className="mt-1">ST-Link · logic analyzer</dd>
            </div>
          </dl>
        </div>
      </div>
    </Section>
  );
}
