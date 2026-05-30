import { skills } from "@/lib/data";
import Section from "./Section";

export default function Skills() {
  return (
    <Section
      id="skills"
      eyebrow="02 / Skills"
      title="The toolchain."
      description="From register-level programming on Cortex-M to MQTT pipelines in the cloud — the full embedded-to-IoT stack."
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {skills.map((group) => (
          <div
            key={group.group}
            className="card rounded-2xl p-6 transition-colors"
          >
            <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-[color:var(--accent)]">
              {group.group}
            </h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {group.items.map((item) => (
                <li
                  key={item}
                  className="chip rounded-full px-3 py-1 text-xs text-[color:var(--foreground)]/85"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
