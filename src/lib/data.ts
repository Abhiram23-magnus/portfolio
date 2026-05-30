export const profile = {
  name: "Bikkina Abhiram Choudhary",
  shortName: "Abhiram Choudhary",
  title: "Embedded Systems & Firmware Engineer",
  location: "Bargarh, India",
  email: "abhiramchoudhary005@gmail.com",
  phone: "+91 94398 95696",
  linkedin: "https://linkedin.com/in/abhiram-choudhary",
  github: "https://github.com/",
  resumeUrl: "/resume/Abhiram_Choudhary_Embedded_Firmware_Engineer_Resume.pdf",
  resumeFileName: "Abhiram_Choudhary_Embedded_Firmware_Engineer_Resume.pdf",
  resumeLastUpdated: "May 2026",
  summary:
    "B.Tech ECE student specializing in embedded firmware development and IoT systems, with proven expertise in bare-metal C/C++ programming for ARM Cortex-M microcontrollers (STM32, ESP32, LPC2148) and hardware communication protocols (UART, SPI, I2C, GPIO, PWM). Delivered end-to-end embedded projects including an IoT-based cardiovascular disease detection system and an ESP32-CAM surveillance platform, translating hardware specifications into optimized, interrupt-driven firmware. Holds NI CLAD certification with internship experience in ARM-based firmware and HAL/LL driver development using Keil µVision. Actively advancing in FreeRTOS, BSP development, and Embedded Linux.",
  pitch:
    "Translating hardware specs into optimized, interrupt-driven firmware. Bare-metal C, STM32, ESP32, ARM Cortex-M.",
};

export const skills = [
  {
    group: "Languages",
    items: [
      "C (Expert)",
      "Embedded C (Expert)",
      "C++ (Proficient)",
      "Python (Intermediate)",
      "Assembly (ARM)",
    ],
  },
  {
    group: "Microcontrollers",
    items: [
      "STM32 (Cortex-M3/M4)",
      "ESP32",
      "LPC2148",
      "Arduino Uno",
      "8051",
      "ARM Cortex-M",
    ],
  },
  {
    group: "Firmware Development",
    items: [
      "Bare-metal firmware",
      "HAL/LL drivers",
      "BSP development",
      "Register-level programming",
      "Memory-mapped I/O",
      "Bootloaders (basic)",
    ],
  },
  {
    group: "Protocols",
    items: [
      "UART",
      "SPI",
      "I2C",
      "GPIO",
      "PWM",
      "ADC/DAC",
      "Bluetooth (HC-05)",
      "Wi-Fi",
      "MQTT",
      "CAN (learning)",
    ],
  },
  {
    group: "RTOS / OS",
    items: [
      "FreeRTOS",
      "Task scheduling",
      "Semaphores",
      "Embedded Linux (Yocto/Buildroot basics)",
    ],
  },
  {
    group: "Tools & IDEs",
    items: [
      "Keil µVision",
      "STM32CubeIDE",
      "Arduino IDE",
      "STM Studio",
      "EasyEDA",
      "Tinkercad",
    ],
  },
  {
    group: "Debug & Test",
    items: ["GDB / OpenOCD", "JTAG / SWD", "Logic Analyzer", "Oscilloscope"],
  },
  {
    group: "Cloud / IoT",
    items: ["Blynk", "ThingSpeak", "MQTT"],
  },
  {
    group: "Other",
    items: ["Git", "LabVIEW (CLAD Certified)", "EasyEDA PCB Design"],
  },
];

export const heroSkills = [
  "Embedded Systems",
  "Firmware Development",
  "STM32 / ESP32",
  "IoT Systems",
  "ARM Cortex-M",
];

export type Project = {
  title: string;
  period: string;
  stack: string[];
  bullets: string[];
};

export const projects: Project[] = [
  {
    title: "IoT-Based Cardiovascular Disease Detection System",
    period: "Jan 2025 – Feb 2025",
    stack: [
      "ESP32",
      "MAX30102",
      "AD8232 ECG",
      "SPI",
      "I2C",
      "MQTT",
      "ThingSpeak",
      "Blynk",
      "Wi-Fi",
    ],
    bullets: [
      "Engineered a non-invasive cardiovascular disease (CVD) early-detection system using ESP32, fusing data from MAX30102 (PPG-based SpO2/heart rate) and AD8232 ECG module via I2C and SPI to extract clinical cardiac biomarkers in real time.",
      "Implemented Heart Rate Variability (HRV) analysis and R-peak detection algorithm in Embedded C to identify arrhythmia patterns (bradycardia, tachycardia) with ~88% detection accuracy validated against reference ECG traces.",
      "Designed a multi-threshold alert engine in firmware that classifies cardiac risk into three severity levels (Normal / Warning / Critical) and triggers instant Blynk push notifications, reducing alert response time to under 3 seconds over Wi-Fi.",
      "Built an MQTT pipeline to stream time-stamped cardiac data to ThingSpeak cloud at 50 Hz, enabling remote cardiologist review and longitudinal trend analysis across 7-day rolling datasets.",
      "Optimized firmware with interrupt-driven ADC sampling and digital band-pass filtering (0.5–40 Hz), reducing signal noise by 45% and cutting false-positive CVD alerts by 30% compared to raw unfiltered readings.",
    ],
  },
  {
    title: "ESP32-CAM Wireless Surveillance System",
    period: "Oct 2024 – Dec 2024",
    stack: [
      "ESP32-CAM",
      "OV2640",
      "Wi-Fi",
      "HTTP Server",
      "Motion Detection",
      "Embedded C",
    ],
    bullets: [
      "Engineered a low-cost wireless surveillance camera using ESP32-CAM and OV2640 image sensor, streaming HD video (1600×1200) over Wi-Fi via an onboard HTTP server.",
      "Implemented frame-differencing–based motion detection algorithm in firmware, reducing false alerts by 60% and triggering push notifications only on actual motion events.",
      "Configured camera frame buffer with DMA transfers for real-time JPEG encoding, achieving stable 15–20 fps streaming with under 80 ms end-to-end latency on a local network.",
      "Improved overall security monitoring efficiency by 30% compared to the baseline passive camera system through intelligent event-triggered capture and logging.",
    ],
  },
  {
    title: "Arduino-Based Home Automation (Android + Bluetooth)",
    period: "Mar 2023 – Apr 2023",
    stack: [
      "Arduino Uno",
      "HC-05 Bluetooth",
      "Relay Module",
      "MIT App Inventor",
      "UART",
    ],
    bullets: [
      "Developed a smart home automation system enabling control of 4 AC appliances via an Android app, communicating over UART/Bluetooth (HC-05) at 9600 baud.",
      "Wrote Arduino firmware to parse AT commands from the HC-05 module and toggle relay outputs with <50 ms response time, ensuring responsive and reliable switching.",
      "Designed the Android control interface using MIT App Inventor with on/off toggles and real-time device status feedback, reducing manual switch interaction by ~80% in testing scenarios.",
    ],
  },
];

export const experience = [
  {
    role: "Embedded Systems Engineer",
    company: "InternzLearn",
    period: "May 2024 – Sep 2024",
    bullets: [
      "Developed embedded C firmware for ARM Cortex-M3/M4 microcontrollers, implementing GPIO control, timer PWM, UART communication, and interrupt service routines from scratch.",
      "Simulated and validated hardware designs virtually before flashing to physical targets using Keil µVision, reducing hardware debug cycles by ~30%.",
      "Performed code optimization (loop unrolling, register-level access, stack analysis) to reduce firmware footprint by 15% and meet strict memory constraints on resource-limited MCUs.",
      "Gained hands-on experience in system-level integration for embedded IoT applications, including sensor interfacing, data parsing, and real-time control loops.",
    ],
  },
];

export const education = [
  {
    degree: "B.Tech — Electronics & Communication Engineering",
    institution: "KL University (KLEF), Guntur",
    period: "Aug 2023 – Present",
    detail:
      "CGPA: 8.3 / 10.0 · Coursework: Microprocessors & Microcontrollers, VLSI Design, Embedded Systems, DSP, IoT",
  },
  {
    degree: "Diploma — Electronics & Communication Engineering",
    institution: "Vikash Polytechnic College, Bargarh",
    period: "Jun 2020 – Oct 2023",
    detail: "Percentage: 72.5%",
  },
  {
    degree: "Class X (CBSE)",
    institution: "The Kosala School, Nua Khairpali",
    period: "Jun 2019 – May 2020",
    detail: "Percentage: 56%",
  },
];

export const certifications = [
  {
    name: "NI Certified LabVIEW Associate Developer (CLAD)",
    issuer: "National Instruments",
    date: "Feb 2024",
  },
  {
    name: "IIoT Programming & Automation",
    issuer: "Tessolve Semiconductors",
    date: "April 2025",
  },
];
