"use client";

import { useEffect, useState } from "react";
import { LayoutGroup, motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/hooks";

export type SignalKind = "uart" | "spi" | "i2c" | "adc" | "rtos" | "pwm" | "isr";

const C = {
  hi: "#67e8f9",
  lo: "#3b8a99",
  grid: "rgba(120,190,210,0.12)",
  label: "#8fa6b6",
  warn: "#fbbf24",
};

/** Build a digital waveform path from bit levels. One bit = `w` units. */
function digital(bits: number[], x0: number, yHigh: number, yLow: number, w: number) {
  let d = "";
  let prev: number | null = null;
  bits.forEach((b, i) => {
    const x = x0 + i * w;
    const y = b ? yHigh : yLow;
    if (prev === null) d += `M${x} ${y}`;
    else if (prev !== b) d += ` L${x} ${y}`;
    d += ` L${x + w} ${y}`;
    prev = b;
  });
  return d;
}

function clockBits(n: number) {
  const out: number[] = [];
  for (let i = 0; i < n; i++) out.push(0, 1);
  return out;
}

/** two copies of a 200-unit-wide pattern so a -200px translate loops seamlessly */
function Loop({ children, slow }: { children: (dx: number) => React.ReactNode; slow?: boolean }) {
  return (
    <g className={slow ? "scroll-x-slow" : "scroll-x"}>
      {children(0)}
      {children(200)}
    </g>
  );
}

function Row({ y, label }: { y: number; label: string }) {
  return (
    <text x="3" y={y} fill={C.label} fontSize="7" fontFamily="var(--font-geist-mono), monospace">
      {label}
    </text>
  );
}

function Frame({ children, caption }: { children: React.ReactNode; caption: string }) {
  return (
    <figure className="m-0">
      <svg
        className="sig"
        viewBox="0 0 200 90"
        role="img"
        aria-label={caption}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <clipPath id="sigclip">
            <rect x="26" y="0" width="174" height="90" />
          </clipPath>
        </defs>
        <rect x="0" y="0" width="200" height="90" fill="rgba(3,10,14,0.7)" rx="6" />
        <g stroke={C.grid} strokeWidth="0.5">
          {[15, 30, 45, 60, 75].map((y) => (
            <line key={y} x1="0" x2="200" y1={y} y2={y} />
          ))}
        </g>
        {children}
      </svg>
      <figcaption className="sr-only">{caption}</figcaption>
    </figure>
  );
}

/* ---------------- individual signals ---------------- */

function Uart() {
  // idle, start(0), D0..D7 = 0x41 LSB first, stop(1)
  const frame = [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1];
  const bits = frame.slice(0, 20);
  while (bits.length < 20) bits.push(1);
  return (
    <Frame caption="UART serial frame: start bit, eight data bits, stop bit, shifting across the screen">
      <Row y={20} label="TX" />
      <g clipPath="url(#sigclip)">
        <Loop>
          {(dx) => (
            <g transform={`translate(${dx} 0)`}>
              <path d={digital(bits, 30, 26, 56, 9)} fill="none" stroke={C.hi} strokeWidth="1.5" strokeLinejoin="round" />
              <text x="39" y="72" fill={C.label} fontSize="6" fontFamily="monospace">START</text>
              <text x="75" y="72" fill={C.label} fontSize="6" fontFamily="monospace">D0 … D7</text>
              <text x="140" y="72" fill={C.label} fontSize="6" fontFamily="monospace">STOP</text>
            </g>
          )}
        </Loop>
      </g>
    </Frame>
  );
}

function Spi() {
  const clk = clockBits(8);
  const mosi = [1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 0];
  const miso = [0, 1, 1, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1];
  const cs = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  return (
    <Frame caption="SPI bus: chip select, serial clock, MOSI and MISO signals">
      <Row y={14} label="CS" />
      <Row y={34} label="SCLK" />
      <Row y={54} label="MOSI" />
      <Row y={74} label="MISO" />
      <g clipPath="url(#sigclip)">
        <Loop>
          {(dx) => (
            <g transform={`translate(${dx} 0)`} fill="none" strokeWidth="1.3" strokeLinejoin="round">
              <path d={digital([1, 1, ...cs.slice(0, 14), 1, 1].slice(0, 18), 30, 8, 18, 9.5)} stroke={C.warn} />
              <path d={digital([0, 0, ...clk, 0, 0].slice(0, 18), 30, 28, 38, 9.5)} stroke={C.hi} />
              <path d={digital([0, ...mosi, 0].slice(0, 18), 30, 48, 58, 9.5)} stroke={C.hi} />
              <path d={digital([0, ...miso, 0].slice(0, 18), 30, 68, 78, 9.5)} stroke={C.lo} />
            </g>
          )}
        </Loop>
      </g>
    </Frame>
  );
}

function I2c() {
  const scl = [1, 1, ...clockBits(8), 1, 1, 1, 1].slice(0, 20);
  const sda = [1, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1];
  return (
    <Frame caption="I2C bus: SCL clock and SDA data lines">
      <Row y={26} label="SCL" />
      <Row y={58} label="SDA" />
      <g clipPath="url(#sigclip)">
        <Loop>
          {(dx) => (
            <g transform={`translate(${dx} 0)`} fill="none" strokeWidth="1.4" strokeLinejoin="round">
              <path d={digital(scl, 30, 16, 36, 8.5)} stroke={C.hi} />
              <path d={digital(sda, 30, 48, 68, 8.5)} stroke={C.lo} />
              <text x="32" y="86" fill={C.label} fontSize="6" fontFamily="monospace">START</text>
              <text x="130" y="86" fill={C.label} fontSize="6" fontFamily="monospace">ACK / STOP</text>
            </g>
          )}
        </Loop>
      </g>
    </Frame>
  );
}

function Pwm() {
  const mk = (duty: number, y: number) => {
    const bits: number[] = [];
    for (let i = 0; i < 5; i++) {
      for (let k = 0; k < 10; k++) bits.push(k < duty ? 1 : 0);
    }
    return digital(bits, 30, y, y + 14, 3.4);
  };
  return (
    <Frame caption="PWM waveforms at three different duty cycles">
      <Row y={16} label="25%" />
      <Row y={46} label="50%" />
      <Row y={76} label="75%" />
      <g clipPath="url(#sigclip)">
        <Loop>
          {(dx) => (
            <g transform={`translate(${dx} 0)`} fill="none" strokeWidth="1.3" strokeLinejoin="round">
              <path d={mk(3, 8)} stroke={C.hi} />
              <path d={mk(5, 38)} stroke={C.hi} />
              <path d={mk(8, 68)} stroke={C.hi} />
            </g>
          )}
        </Loop>
      </g>
    </Frame>
  );
}

function Adc() {
  // analog sine sampled and quantised to steps
  const pts: string[] = [];
  const steps: string[] = [];
  const dots: [number, number][] = [];
  const N = 20;
  for (let i = 0; i <= 160; i += 2) {
    const y = 45 - Math.sin((i / 160) * Math.PI * 4) * 28;
    pts.push(`${i === 0 ? "M" : "L"}${30 + i} ${y.toFixed(1)}`);
  }
  for (let i = 0; i < N; i++) {
    const x = 30 + (i * 160) / N;
    const y = 45 - Math.sin(((i * 160) / N / 160) * Math.PI * 4) * 28;
    const q = Math.round(y / 6) * 6;
    steps.push(`${i === 0 ? "M" : "L"}${x.toFixed(1)} ${q} L${(x + 160 / N).toFixed(1)} ${q}`);
    dots.push([x, y]);
  }
  return (
    <Frame caption="ADC: an analog waveform being converted into discrete digital samples">
      <Row y={14} label="ADC" />
      <g clipPath="url(#sigclip)">
        <Loop slow>
          {(dx) => (
            <g transform={`translate(${dx} 0)`} fill="none" strokeLinejoin="round">
              <path d={pts.join(" ")} stroke={C.lo} strokeWidth="1" strokeDasharray="2 2" />
              <path d={steps.join(" ")} stroke={C.hi} strokeWidth="1.4" />
              {dots.map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r="1.6" fill={C.warn} />
              ))}
            </g>
          )}
        </Loop>
      </g>
    </Frame>
  );
}

function Isr() {
  return (
    <Frame caption="Interrupt: the main loop is paused, the ISR runs, then the main loop resumes">
      <Row y={22} label="IRQ" />
      <Row y={56} label="CPU" />
      <g clipPath="url(#sigclip)">
        <Loop>
          {(dx) => (
            <g transform={`translate(${dx} 0)`} fill="none" strokeWidth="1.4" strokeLinejoin="round">
              <path d="M30 28 H70 V16 H78 V28 H150 V16 H158 V28 H200" stroke={C.warn} />
              <rect x="30" y="50" width="42" height="12" fill="rgba(103,232,249,0.18)" stroke={C.hi} rx="2" />
              <rect x="72" y="50" width="14" height="12" fill="rgba(251,191,36,0.3)" stroke={C.warn} rx="2" />
              <rect x="86" y="50" width="72" height="12" fill="rgba(103,232,249,0.18)" stroke={C.hi} rx="2" />
              <rect x="158" y="50" width="14" height="12" fill="rgba(251,191,36,0.3)" stroke={C.warn} rx="2" />
              <rect x="172" y="50" width="28" height="12" fill="rgba(103,232,249,0.18)" stroke={C.hi} rx="2" />
              <text x="40" y="72" fill={C.label} fontSize="6" fontFamily="monospace">main()</text>
              <text x="73" y="72" fill={C.label} fontSize="6" fontFamily="monospace">ISR</text>
            </g>
          )}
        </Loop>
      </g>
    </Frame>
  );
}

/* ---------------- RTOS scheduler ---------------- */

const STATES = ["READY", "RUNNING", "BLOCKED"] as const;
type TaskState = (typeof STATES)[number];
type Task = { id: string; prio: number; state: TaskState };

const SEQ: Task[][] = [
  [
    { id: "Task A", prio: 2, state: "READY" },
    { id: "Task B", prio: 3, state: "RUNNING" },
    { id: "Task C", prio: 1, state: "BLOCKED" },
  ],
  [
    { id: "Task A", prio: 2, state: "RUNNING" },
    { id: "Task B", prio: 3, state: "BLOCKED" },
    { id: "Task C", prio: 1, state: "READY" },
  ],
  [
    { id: "Task A", prio: 2, state: "READY" },
    { id: "Task B", prio: 3, state: "READY" },
    { id: "Task C", prio: 1, state: "BLOCKED" },
  ],
  [
    { id: "Task A", prio: 2, state: "READY" },
    { id: "Task B", prio: 3, state: "RUNNING" },
    { id: "Task C", prio: 1, state: "READY" },
  ],
];

const stateColor: Record<TaskState, string> = {
  READY: "border-sky-400/60 text-sky-200",
  RUNNING: "border-emerald-400/70 text-emerald-200 bg-emerald-400/10",
  BLOCKED: "border-amber-400/60 text-amber-200",
};

export function RtosScheduler({ compact = false }: { compact?: boolean }) {
  const reduced = usePrefersReducedMotion();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => setStep((s) => (s + 1) % SEQ.length), 1500);
    return () => window.clearInterval(id);
  }, [reduced]);

  const tasks = SEQ[step];
  const running = tasks.find((t) => t.state === "RUNNING");
  const next = tasks
    .filter((t) => t.state === "READY")
    .sort((a, b) => b.prio - a.prio)[0];

  return (
    <div
      role="img"
      aria-label="Animated RTOS scheduler: tasks move between READY, RUNNING and BLOCKED states while the scheduler picks the highest priority ready task on each tick"
    >
      <div className="mb-2 flex items-center justify-between font-mono text-[11px] text-[#8fa6b6]">
        <span>SYSTEM TICK #{String(step + 1).padStart(2, "0")}</span>
        <span>{running ? `scheduler → ${running.id}` : next ? `next → ${next.id}` : "idle"}</span>
      </div>
      <LayoutGroup>
        <div className={`grid grid-cols-3 gap-2 ${compact ? "" : "sm:gap-3"}`}>
          {STATES.map((s) => (
            <div key={s} className="rounded-lg border border-white/10 bg-black/30 p-2">
              <div className="mb-2 text-center font-mono text-[10px] tracking-widest text-[#8fa6b6]">{s}</div>
              <div className="flex min-h-[88px] flex-col gap-1.5">
                {tasks
                  .filter((t) => t.state === s)
                  .map((t) => (
                    <motion.div
                      key={t.id}
                      layout={!reduced}
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      className={`rounded-md border px-2 py-1.5 text-center font-mono text-[11px] ${stateColor[s]}`}
                    >
                      {t.id}
                      <span className="block text-[9px] opacity-70">prio {t.prio}</span>
                    </motion.div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </LayoutGroup>
    </div>
  );
}

/* ---------------- public component ---------------- */

export function SignalViz({ kind }: { kind: SignalKind }) {
  switch (kind) {
    case "uart":
      return <Uart />;
    case "spi":
      return <Spi />;
    case "i2c":
      return <I2c />;
    case "pwm":
      return <Pwm />;
    case "adc":
      return <Adc />;
    case "isr":
      return <Isr />;
    case "rtos":
      return <RtosScheduler compact />;
  }
}

export const signalTitle: Record<SignalKind, string> = {
  uart: "UART frame",
  spi: "SPI bus",
  i2c: "I2C bus",
  pwm: "PWM duty cycles",
  adc: "ADC sampling",
  isr: "Interrupt (ISR)",
  rtos: "RTOS task states",
};
