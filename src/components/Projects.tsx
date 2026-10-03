"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { projects, type Project } from "@/lib/data";
import { usePrefersReducedMotion } from "@/lib/hooks";
import Section from "./Section";
import Flow from "./viz/Flow";
import { RtosScheduler } from "./viz/Waveforms";
import { ChevronIcon, ExternalLinkIcon, GithubIcon } from "./icons";

/* ------------------------------------------------------------------ */
/* Visuals                                                              */
/* ------------------------------------------------------------------ */

function EcgWave() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  // the trace also sweeps with the page scroll
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -400]);

  // one beat: baseline, P, Q, R, S, T
  const beat = (o: number) =>
    `L${o + 0} 45 L${o + 10} 45 Q${o + 16} 35 ${o + 22} 45 L${o + 30} 45 L${o + 34} 52 L${o + 40} 8 L${o + 46} 66 L${o + 50} 45 L${o + 58} 45 Q${o + 70} 28 ${o + 82} 45 L${o + 100} 45`;
  let d = "M0 45";
  for (let i = 0; i < 6; i++) d += " " + beat(i * 100);

  return (
    <div ref={ref}>
      <svg
        className="sig"
        viewBox="0 0 200 90"
        role="img"
        aria-label="Animated ECG waveform showing P, QRS and T waves"
      >
        <rect x="0" y="0" width="200" height="90" rx="6" fill="rgba(3,10,14,0.7)" />
        <g stroke="rgba(120,190,210,0.12)" strokeWidth="0.5">
          {Array.from({ length: 10 }, (_, i) => (
            <line key={`v${i}`} x1={i * 20} x2={i * 20} y1="0" y2="90" />
          ))}
          {Array.from({ length: 5 }, (_, i) => (
            <line key={`h${i}`} x1="0" x2="200" y1={i * 20 + 5} y2={i * 20 + 5} />
          ))}
        </g>
        <motion.g style={{ x: reduced ? 0 : x }}>
          <g className="scroll-x">
            <path d={d} fill="none" stroke="#34d399" strokeWidth="1.5" strokeLinejoin="round" />
          </g>
        </motion.g>
        <g fontFamily="monospace" fontSize="6" fill="#8fa6b6">
          <text x="6" y="12">ECG · single lead</text>
        </g>
      </svg>
    </div>
  );
}

/** A CSS-3D ESP32-CAM style board that tilts with the pointer. */
function CamBoard() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const reduced = usePrefersReducedMotion();
  return (
    <div
      className="relative flex h-[190px] items-center justify-center"
      style={{ perspective: 700 }}
      onPointerMove={(e) => {
        if (reduced) return;
        const r = e.currentTarget.getBoundingClientRect();
        setTilt({
          x: ((e.clientX - r.left) / r.width - 0.5) * 30,
          y: ((e.clientY - r.top) / r.height - 0.5) * -22,
        });
      }}
      onPointerLeave={() => setTilt({ x: 0, y: 0 })}
      role="img"
      aria-label="3D illustration of an ESP32-CAM board with an OV2640 camera lens"
    >
      <div
        className="relative h-[120px] w-[190px] transition-transform duration-200"
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateX(${52 + tilt.y}deg) rotateZ(${-28 + tilt.x}deg)`,
        }}
      >
        {/* board */}
        <div className="absolute inset-0 rounded-md border border-cyan-300/30 bg-[#0a1c24] shadow-[0_0_30px_rgba(34,211,238,0.15)]">
          <svg viewBox="0 0 190 120" className="absolute inset-0 h-full w-full" aria-hidden>
            <path className="trace trace-dash" d="M20 20 H70 V60 H120" fill="none" strokeWidth="1.5" />
            <path className="trace trace-dash" d="M20 100 H90 V80 H160" fill="none" strokeWidth="1.5" />
            <path className="trace" d="M170 20 l8 8 -8 8 8 8 -8 8" fill="none" strokeWidth="1.5" />
          </svg>
        </div>
        {/* ESP32 shield */}
        <div
          className="absolute left-[18px] top-[34px] h-[46px] w-[58px] rounded-sm bg-[#c3ccd4]"
          style={{ transform: "translateZ(8px)" }}
        />
        {/* lens stack */}
        <div
          className="absolute right-[26px] top-[26px] h-[56px] w-[56px] rounded-full border border-cyan-200/40 bg-[#0d1218]"
          style={{ transform: "translateZ(22px)" }}
        >
          <div
            className="absolute inset-[10px] rounded-full bg-[radial-gradient(circle_at_35%_35%,#3b6fe0,#050912_70%)]"
            style={{ transform: "translateZ(10px)" }}
          />
        </div>
        {/* status LED */}
        <div
          className="absolute bottom-3 left-3 h-2 w-3 rounded-[1px] bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.9)]"
          style={{ transform: "translateZ(4px)" }}
        />
      </div>
    </div>
  );
}

function Visual({ id }: { id: Project["id"] }) {
  if (id === "rtos") {
    return (
      <div>
        <RtosScheduler />
        <Flow
          className="mt-4 wrap"
          keepHorizontal
          label="Scheduler data structures"
          nodes={["TCB", "Queue", "Scheduler", "Next task"]}
        />
      </div>
    );
  }
  if (id === "ecg") {
    return (
      <div>
        <EcgWave />
        <Flow
          className="mt-4 wrap"
          label="ECG sensor to ESP32 ADC, filtering, Wi-Fi, Python, R-peak detection, PQRST, SVM"
          nodes={["ECG sensor", "ESP32 ADC", "Filtering", "Wi-Fi", "Python", "R-peak", "PQRST", "SVM"]}
        />
      </div>
    );
  }
  return (
    <div>
      <CamBoard />
      <Flow
        className="mt-2 wrap"
        label="Camera to ESP32-CAM, Wi-Fi, HTTP server, browser"
        nodes={["Camera", "ESP32-CAM", "Wi-Fi", "HTTP server", "Browser"]}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Card                                                                 */
/* ------------------------------------------------------------------ */

function ProjectCard({ p, index }: { p: Project; index: number }) {
  const [open, setOpen] = useState(false);
  const reduced = usePrefersReducedMotion();
  const panelId = `project-${p.id}-details`;

  return (
    <motion.article
      className="module panel relative flex flex-col overflow-hidden p-5 sm:p-6"
      initial={reduced ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={reduced ? undefined : { y: -6, scale: 1.01 }}
      aria-labelledby={`project-${p.id}-title`}
    >
      {/* PCB trace decoration along the top edge */}
      <svg className="pointer-events-none absolute inset-x-0 top-0 h-3 w-full" aria-hidden preserveAspectRatio="none" viewBox="0 0 400 12">
        <path className="trace trace-dash" d="M0 6 H120 L132 2 H260 L272 6 H400" fill="none" strokeWidth="1.5" />
      </svg>

      <div className="mt-2 flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[color:var(--accent)]">
            Module 0{index + 1}
            {p.period ? ` · ${p.period}` : ""}
          </p>
          <h3 id={`project-${p.id}-title`} className="mt-2 text-xl font-semibold leading-snug">
            {p.title}
          </h3>
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-[color:var(--border)] bg-black/25 p-3">
        <Visual id={p.id} />
      </div>

      <p className="mt-5 text-sm leading-relaxed text-[#c4d2dd]">{p.summary}</p>
      {p.note && (
        <p className="mt-3 rounded-lg border border-amber-300/25 bg-amber-300/5 px-3 py-2 text-xs text-amber-100/90">
          {p.note}
        </p>
      )}

      <ul className="mt-4 flex flex-wrap gap-2" aria-label="Technologies">
        {p.stack.map((s) => (
          <li key={s} className="chip">
            {s}
          </li>
        ))}
      </ul>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        {p.github && (
          <a href={p.github} target="_blank" rel="noopener noreferrer" className="btn btn-ghost !min-h-[40px]">
            <GithubIcon size={16} />
            View on GitHub
            <ExternalLinkIcon size={14} />
          </a>
        )}
        <button
          type="button"
          className="btn btn-ghost !min-h-[40px]"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? "Hide details" : "View details"}
          <ChevronIcon size={16} className={`transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            initial={reduced ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduced ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <ul className="mt-5 list-disc space-y-2 pl-5 text-sm leading-relaxed text-[#c4d2dd] marker:text-[color:var(--accent)]">
              {p.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

export default function Projects() {
  return (
    <Section
      id="projects"
      eyebrow="03 / Project lab"
      title="Three projects, each a hardware module."
      description="Firmware, signal processing and networking work from my resume. Hover a module to power its traces."
    >
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((p, i) => (
          <ProjectCard key={p.id} p={p} index={i} />
        ))}
      </div>
    </Section>
  );
}
