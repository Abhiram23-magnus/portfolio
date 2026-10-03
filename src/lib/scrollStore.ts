// Mutable scroll state shared with the 3D scene. Kept outside React state so
// scrolling never triggers re-renders; the scene reads it inside useFrame.

export const scrollStore = {
  /** 0..1 progress through the whole page */
  progress: 0,
  /** smoothed absolute scroll velocity, roughly 0..1 */
  velocity: 0,
};

let lastY = 0;
let lastT = 0;
let attached = false;

function update() {
  const doc = document.documentElement;
  const max = Math.max(1, doc.scrollHeight - window.innerHeight);
  const y = window.scrollY;
  scrollStore.progress = Math.min(1, Math.max(0, y / max));

  const now = performance.now();
  const dt = Math.max(1, now - lastT);
  const v = Math.abs(y - lastY) / dt; // px per ms
  scrollStore.velocity += (Math.min(1, v / 3) - scrollStore.velocity) * 0.2;
  lastY = y;
  lastT = now;
}

/** Attach once; returns a cleanup function. */
export function attachScrollStore(): () => void {
  if (typeof window === "undefined" || attached) return () => {};
  attached = true;
  lastY = window.scrollY;
  lastT = performance.now();
  update();

  const onScroll = () => update();
  // velocity decays when scrolling stops
  const decay = window.setInterval(() => {
    scrollStore.velocity *= 0.85;
    if (scrollStore.velocity < 0.002) scrollStore.velocity = 0;
  }, 50);

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  return () => {
    attached = false;
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onScroll);
    window.clearInterval(decay);
  };
}
