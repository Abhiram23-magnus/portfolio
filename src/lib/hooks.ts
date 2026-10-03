"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { navItems } from "./data";

/* ---------- prefers-reduced-motion ---------- */

function subscribeReduced(cb: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeReduced,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

/* ---------- 3D capability tier ---------- */

export type PerfTier = "off" | "low" | "high";

let webglSupported: boolean | null = null;

// Probed once: creating a context on every call leaks GL contexts, and the
// browser eventually evicts the live scene's context to make room.
function hasWebGL(): boolean {
  if (webglSupported !== null) return webglSupported;
  try {
    const c = document.createElement("canvas");
    const gl = (c.getContext("webgl2") || c.getContext("webgl")) as WebGLRenderingContext | null;
    webglSupported = !!gl;
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    webglSupported = false;
  }
  return webglSupported;
}

/**
 * Decides how much 3D to render.
 *  off  – reduced motion, no WebGL, or Save-Data: static CSS background only
 *  low  – phones / low-memory / few cores: lighter scene
 *  high – everything
 * The scene can further downgrade itself at runtime (see Scene.tsx).
 */
export function detectTier(): PerfTier {
  if (typeof window === "undefined") return "off";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "off";
  if (!hasWebGL()) return "off";

  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
  };
  if (nav.connection?.saveData) return "off";

  const small = window.innerWidth < 768;
  const lowMem = (nav.deviceMemory ?? 8) <= 4;
  const fewCores = (nav.hardwareConcurrency ?? 8) <= 4;
  return small || lowMem || fewCores ? "low" : "high";
}

/* ---------- active section (scroll-spy) ---------- */

export function useActiveSection(): string {
  const [active, setActive] = useState<string>("home");

  useEffect(() => {
    const els = navItems
      .map((n) => document.getElementById(n.id))
      .filter((el): el is HTMLElement => !!el);
    if (!els.length) return;

    const visible = new Map<string, number>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.set(e.target.id, e.intersectionRatio);
          else visible.delete(e.target.id);
        }
        // pick the first nav section (in page order) that is meaningfully visible
        for (const n of navItems) {
          if (visible.has(n.id)) {
            setActive(n.id);
            document.documentElement.dataset.section = n.id;
            return;
          }
        }
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: [0, 0.01, 0.1] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return active;
}
