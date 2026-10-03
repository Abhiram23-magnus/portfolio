// Single source of truth: Abhiram_Choudhary_Embedded_Resume.pdf
// Do not add claims, metrics, skills or links that are not in the resume.

export const profile = {
  name: "Bikkina Abhiram Choudhary",
  shortName: "Abhiram Choudhary",
  title: "Entry-Level Embedded Systems Engineer",
  subtitle: "B.Tech ECE Graduate (2026)",
  tagline: "Embedded C · ARM Cortex-M · STM32 · ESP32 · RTOS",
  location: "Bargarh, India",
  email: "abhiramchoudhary005@gmail.com",
  phone: "+91 94398 95696",
  phoneHref: "tel:+919439895696",
  linkedin: "https://www.linkedin.com/in/abhiram-choudhary-/",
  github: "https://github.com/Abhiram23-magnus",
  resumeUrl: "/resume/Abhiram_Choudhary_Embedded_Resume.pdf",
  resumeFileName: "Abhiram_Choudhary_Embedded_Resume.pdf",
  pitch:
    "Building reliable firmware and embedded systems with Embedded C, ARM Cortex-M, STM32 and ESP32.",
  summary:
    "B.Tech graduate in Electronics & Communication Engineering (KL University, May 2026) and Embedded Systems fresher. Develops Embedded C firmware on ARM Cortex-M (STM32) and ESP32 microcontrollers: register-level GPIO, UART, timers/PWM, interrupts (ISR, NVIC) and ADC sensor acquisition, applied in hands-on projects covering RTOS task scheduling, ECG signal acquisition and Wi-Fi video streaming. Debugs firmware on hardware with ST-Link and a logic analyzer; targeting Embedded Software and Firmware Engineer roles.",
};

export const heroChips = [
  "Embedded C",
  "ARM Cortex-M",
  "STM32",
  "ESP32",
  "FreeRTOS",
  "UART · SPI · I2C",
];

export type SkillGroup = {
  group: string;
  items: string[];
  /** key of the signal visual shown on hover/focus (see SignalViz) */
  viz?: "uart" | "spi" | "i2c" | "adc" | "rtos" | "pwm" | "isr";
  /** which item triggers which visual */
  vizItems?: Record<string, "uart" | "spi" | "i2c" | "adc" | "rtos" | "pwm" | "isr">;
};

export const skills: SkillGroup[] = [
  {
    group: "Programming",
    items: ["C", "Embedded C", "C++", "Python"],
  },
  {
    group: "Embedded Systems",
    items: [
      "Firmware development",
      "Register-level programming",
      "Bare-metal",
      "GPIO",
      "Interrupts (ISR, NVIC)",
      "Timers",
      "PWM",
      "ADC",
      "Modular C",
    ],
    vizItems: {
      "Interrupts (ISR, NVIC)": "isr",
      PWM: "pwm",
      ADC: "adc",
    },
  },
  {
    group: "Microcontrollers",
    items: ["STM32 (ARM Cortex-M)", "ESP32", "ESP32-CAM"],
  },
  {
    group: "Protocols",
    items: ["UART", "SPI", "I2C"],
    vizItems: { UART: "uart", SPI: "spi", I2C: "i2c" },
  },
  {
    group: "RTOS",
    items: [
      "FreeRTOS",
      "Tasks",
      "Queues",
      "Semaphores",
      "Mutexes",
      "Task scheduling",
      "Task priorities",
      "Task states",
    ],
    viz: "rtos",
  },
  {
    group: "Tools & IDEs",
    items: [
      "STM32CubeIDE",
      "STM32CubeMX",
      "Keil µVision",
      "Arduino IDE",
      "Git/GitHub",
    ],
  },
  {
    group: "Debugging",
    items: [
      "ST-Link",
      "Logic analyzer",
      "Keil µVision simulator",
      "Register-level debugging",
    ],
  },
  {
    group: "IoT / Networking",
    items: ["Wi-Fi", "HTTP server", "ESP32 networking"],
  },
];

export type Project = {
  id: "rtos" | "ecg" | "cam";
  title: string;
  period?: string;
  stack: string[];
  summary: string;
  bullets: string[];
  github?: string;
  note?: string;
};

export const projects: Project[] = [
  {
    id: "rtos",
    title: "Mini RTOS Scheduler Simulator",
    stack: ["Embedded C"],
    summary:
      "Modular Embedded C simulator of RTOS task creation, task states and priority-based scheduling, driven by a simulated system tick.",
    bullets: [
      "Developed a modular Embedded C simulator modeling RTOS task creation, task states and priority-based scheduling driven by a simulated system tick.",
      "Implemented task control blocks and queue management using structures and pointers, with each task's routine bound through function pointers.",
      "Designed scheduler logic that selects the next task from task priority and state on every tick, showing how real-time schedulers make decisions.",
      "Organized the code into separate source and header modules for tasks, queues and the scheduler, keeping interfaces small and each module testable on its own.",
      "Documented the design and sample scheduling output on GitHub; built as a learning simulator of RTOS scheduling, not a kernel running on hardware.",
    ],
    github: "https://github.com/Abhiram23-magnus/RTOS-Scheduler",
    note: "Learning simulator of RTOS scheduling — not a kernel running on hardware.",
  },
  {
    id: "ecg",
    title: "ECG Acquisition Firmware with PQRST Analysis",
    period: "Jan 2025 – Feb 2025",
    stack: ["ESP32", "AD8232", "Embedded C/C++", "ADC", "Python"],
    summary:
      "Single-lead ECG acquisition on ESP32 with a Python host tool for R-peak detection, PQRST segmentation and SVM rhythm classification.",
    bullets: [
      "Built single-lead ECG acquisition firmware on ESP32, sampling an AD8232 analog front-end through the on-chip ADC at a fixed sampling rate.",
      "Implemented signal filtering and buffering in firmware and streamed ECG samples over Wi-Fi to a host application.",
      "Developed a Python host tool that detects R-peaks, segments PQRST waves, extracts RR-interval and heart-rate features, and classifies heart rhythm with an SVM classifier.",
      "Documented the system design and results in an IEEE-format research paper.",
    ],
  },
  {
    id: "cam",
    title: "ESP32-CAM Wireless Surveillance System",
    period: "Oct 2024 – Dec 2024",
    stack: ["ESP32-CAM", "OV2640", "Embedded C", "HTTP"],
    summary:
      "Wireless camera streaming JPEG video to a browser through an on-board HTTP server, with motion-triggered capture.",
    bullets: [
      "Built a wireless camera on ESP32-CAM with an OV2640 sensor, streaming JPEG video to a browser through an on-board HTTP server.",
      "Implemented frame-differencing motion detection in firmware so images are captured only on motion, instead of continuous capture.",
      "Configured camera resolution and frame buffers in firmware to keep the live stream stable over local Wi-Fi.",
    ],
  },
];

export const experience = {
  role: "Embedded Systems Intern",
  company: "InternzLearn",
  period: "Aug 2024 – Sep 2024",
  bullets: [
    "Developed bare-metal Embedded C firmware for ARM Cortex-M microcontrollers: GPIO control, timer-based PWM, UART communication and interrupt service routines at register level, without HAL.",
    "Configured NVIC interrupt priorities and verified ISR timing by toggling GPIO pins and capturing them on a logic analyzer.",
    "Tested firmware logic in the Keil µVision simulator before flashing, then debugged it on target hardware.",
  ],
  highlights: [
    "Bare-metal Embedded C",
    "ARM Cortex-M",
    "GPIO",
    "Timer-based PWM",
    "UART",
    "ISR",
    "NVIC",
    "Keil µVision",
    "Logic analyzer",
  ],
  workflow: [
    "Code",
    "Compile",
    "Simulator",
    "Flash",
    "Target hardware",
    "Logic analyzer",
    "Debug",
  ],
};

export const education = [
  {
    degree: "B.Tech, Electronics & Communication Engineering",
    institution: "KL University (KLEF), Guntur",
    period: "Aug 2023 – May 2026",
    detail: "CGPA 8.3/10 (lateral entry)",
    coursework: [
      "Microprocessors & Microcontrollers",
      "Embedded Systems",
      "DSP",
      "Computer Architecture",
    ],
  },
  {
    degree: "Diploma, ECE",
    institution: "Vikash Polytechnic College, Bargarh",
    period: "Jun 2020 – Jun 2023",
    detail: "72.5%",
    coursework: [],
  },
];

export const certifications = [
  {
    name: "Embedded Systems Training",
    issuer: "Emertxe Information Technologies, Bengaluru",
    date: "Jul 2026 – Present",
  },
  {
    name: "IIoT Programming & Automation",
    issuer: "Tessolve Semiconductors",
    date: "Apr 2025",
  },
  {
    name: "NI Certified LabVIEW Associate Developer (CLAD)",
    issuer: "National Instruments",
    date: "Feb 2024",
  },
];

export const navItems = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "certifications", label: "Certifications" },
  { id: "contact", label: "Contact" },
] as const;
