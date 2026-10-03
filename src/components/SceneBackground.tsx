"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { attachScrollStore } from "@/lib/scrollStore";
import { detectTier, type PerfTier } from "@/lib/hooks";

// three.js is only downloaded when the device can actually use it.
const Scene = dynamic(() => import("./three/Scene"), { ssr: false });

/**
 * Fixed, full-viewport background. Always renders the lightweight CSS
 * "circuit" fallback underneath; the WebGL scene mounts on top only when the
 * device/user preferences allow it.
 */
export default function SceneBackground() {
  const [tier, setTier] = useState<PerfTier>("off");

  useEffect(() => {
    const detach = attachScrollStore();
    // Only ever upgrade/downgrade between the three tiers when the answer
    // actually changes, so resizing never remounts the canvas needlessly.
    const apply = () => setTier((cur) => {
      const next = detectTier();
      return next === cur ? cur : next;
    });
    apply();
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    mq.addEventListener("change", apply);
    let timer: number | undefined;
    const onResize = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(apply, 250);
    };
    window.addEventListener("resize", onResize);
    return () => {
      detach();
      window.clearTimeout(timer);
      mq.removeEventListener("change", apply);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className="scene-bg" aria-hidden="true">
      <div className="circuit-fallback" />
      {tier !== "off" && (
        <div className="scene-canvas">
          <Scene initialTier={tier} />
        </div>
      )}
      <div className="scene-tint" />
      <div className="scene-vignette" />
    </div>
  );
}
