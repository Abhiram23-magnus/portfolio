"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Grid, PerformanceMonitor, RoundedBox, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { scrollStore } from "@/lib/scrollStore";
import type { PerfTier } from "@/lib/hooks";

/* ------------------------------------------------------------------ */
/* Helpers                                                              */
/* ------------------------------------------------------------------ */

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

type V = [number, number]; // x,z on the board plane

function polylineLength(pts: V[]) {
  let l = 0;
  for (let i = 1; i < pts.length; i++) {
    l += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  }
  return l;
}

function pointAt(pts: V[], t: number): V {
  const total = polylineLength(pts);
  let d = t * total;
  for (let i = 1; i < pts.length; i++) {
    const seg = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    if (d <= seg || i === pts.length - 1) {
      const k = seg === 0 ? 0 : Math.min(1, d / seg);
      return [
        pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * k,
        pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * k,
      ];
    }
    d -= seg;
  }
  return pts[pts.length - 1];
}

/** L-shaped Manhattan route a -> b */
function route(a: V, b: V, horizontalFirst: boolean): V[] {
  const mid: V = horizontalFirst ? [b[0], a[1]] : [a[0], b[1]];
  return [a, mid, b];
}

/* ------------------------------------------------------------------ */
/* Layout of the "board"                                                */
/* ------------------------------------------------------------------ */

const MCU_POS: V = [2.4, 0];
const MODULES = {
  mcu: MCU_POS,
  wifi: [-6, -4.5] as V,
  header: [-3.2, -9.5] as V,
  scope: [6.2, -9] as V,
  cam: [0, -14.5] as V,
};

type Trace = { pts: V[]; width: number };

function buildTraces(tier: PerfTier): Trace[] {
  const r = rng(7);
  const traces: Trace[] = [];

  // 1. fan-out from the MCU pins
  const half = 1.05; // half chip width
  const perSide = tier === "high" ? 8 : 5;
  for (let side = 0; side < 4; side++) {
    for (let i = 0; i < perSide; i++) {
      const u = -0.8 + (1.6 * (i + 0.5)) / perSide;
      let start: V;
      let dir: V;
      if (side === 0) {
        start = [MCU_POS[0] + u, MCU_POS[1] + half + 0.15];
        dir = [0, 1];
      } else if (side === 1) {
        start = [MCU_POS[0] + u, MCU_POS[1] - half - 0.15];
        dir = [0, -1];
      } else if (side === 2) {
        start = [MCU_POS[0] + half + 0.15, MCU_POS[1] + u];
        dir = [1, 0];
      } else {
        start = [MCU_POS[0] - half - 0.15, MCU_POS[1] + u];
        dir = [-1, 0];
      }
      const l1 = 0.5 + r() * 1.2;
      const p1: V = [start[0] + dir[0] * l1, start[1] + dir[1] * l1];
      const turn = r() > 0.5 ? 1 : -1;
      const l2 = 0.8 + r() * 2.2;
      const p2: V =
        dir[0] === 0
          ? [p1[0] + turn * l2, p1[1]]
          : [p1[0], p1[1] + turn * l2];
      const l3 = 0.4 + r() * 1.4;
      const p3: V =
        dir[0] === 0
          ? [p2[0], p2[1] + dir[1] * l3]
          : [p2[0] + dir[0] * l3, p2[1]];
      traces.push({ pts: [start, p1, p2, p3], width: 0.03 });
    }
  }

  // 2. buses connecting the modules (the "journey" path)
  const chain: V[] = [MODULES.mcu, MODULES.wifi, MODULES.header, MODULES.scope, MODULES.cam];
  const lanes = tier === "high" ? 6 : 3;
  for (let seg = 0; seg < chain.length - 1; seg++) {
    for (let k = 0; k < lanes; k++) {
      const off = (k - (lanes - 1) / 2) * 0.16;
      const a: V = [chain[seg][0] + off, chain[seg][1] + off];
      const b: V = [chain[seg + 1][0] + off, chain[seg + 1][1] + off];
      traces.push({ pts: route(a, b, seg % 2 === 0), width: 0.035 });
    }
  }
  return traces;
}

/* ------------------------------------------------------------------ */
/* Traces + signal pulses                                               */
/* ------------------------------------------------------------------ */

const _m = new THREE.Matrix4();
const _q = new THREE.Quaternion();
const _s = new THREE.Vector3();
const _p = new THREE.Vector3();
const _up = new THREE.Vector3(0, 1, 0);

function Traces({ tier }: { tier: PerfTier }) {
  const traces = useMemo(() => buildTraces(tier), [tier]);

  const segments = useMemo(() => {
    const list: { x: number; z: number; len: number; rotY: number; w: number }[] = [];
    for (const t of traces) {
      for (let i = 1; i < t.pts.length; i++) {
        const a = t.pts[i - 1];
        const b = t.pts[i];
        const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
        if (len < 0.001) continue;
        list.push({
          x: (a[0] + b[0]) / 2,
          z: (a[1] + b[1]) / 2,
          len: len + t.width,
          rotY: Math.abs(b[0] - a[0]) > Math.abs(b[1] - a[1]) ? 0 : Math.PI / 2,
          w: t.width,
        });
      }
    }
    return list;
  }, [traces]);

  const segRef = useRef<THREE.InstancedMesh>(null);
  const pulseRef = useRef<THREE.InstancedMesh>(null);
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  const pulsesPerTrace = tier === "high" ? 2 : 1;
  const pulseCount = traces.length * pulsesPerTrace;

  // mutable animation state lives in a ref so useFrame can advance it freely
  const phases = useRef<{ t: number; speed: number }[]>([]);
  useEffect(() => {
    const r = rng(21);
    phases.current = Array.from({ length: pulseCount }, () => ({
      t: r(),
      speed: 0.04 + r() * 0.07,
    }));
  }, [pulseCount]);

  useEffect(() => {
    const mesh = segRef.current;
    if (!mesh) return;
    segments.forEach((s, i) => {
      _p.set(s.x, 0.012, s.z);
      _q.setFromAxisAngle(_up, s.rotY);
      _s.set(s.len, 0.012, s.w);
      _m.compose(_p, _q, _s);
      mesh.setMatrixAt(i, _m);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [segments]);

  useFrame((_, dt) => {
    const mesh = pulseRef.current;
    if (!mesh) return;
    const boost = 1 + scrollStore.velocity * 6;
    // traces "activate" as the user scrolls deeper into the board
    if (matRef.current) {
      const target = 0.25 + scrollStore.progress * 0.9;
      matRef.current.emissiveIntensity = THREE.MathUtils.damp(
        matRef.current.emissiveIntensity,
        target,
        3,
        dt,
      );
    }
    let n = 0;
    for (let ti = 0; ti < traces.length; ti++) {
      for (let k = 0; k < pulsesPerTrace; k++) {
        const ph = phases.current[n];
        if (!ph) break;
        ph.t = (ph.t + ph.speed * boost * dt) % 1;
        const [x, z] = pointAt(traces[ti].pts, ph.t);
        _p.set(x, 0.05, z);
        _q.identity();
        const sc = 0.028 + Math.sin(ph.t * Math.PI) * 0.02;
        _s.set(sc, sc, sc);
        _m.compose(_p, _q, _s);
        mesh.setMatrixAt(n, _m);
        n++;
      }
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      <instancedMesh ref={segRef} args={[undefined, undefined, segments.length]} frustumCulled={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          ref={matRef}
          color="#2a1a10"
          emissive="#C0764A"
          emissiveIntensity={0.3}
          roughness={0.5}
          metalness={0.6}
        />
      </instancedMesh>
      <instancedMesh ref={pulseRef} args={[undefined, undefined, pulseCount]} frustumCulled={false}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial color="#F0CF8A" toneMapped={false} />
      </instancedMesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* The MCU                                                              */
/* ------------------------------------------------------------------ */

function McuChip({ tier }: { tier: PerfTier }) {
  const group = useRef<THREE.Group>(null);
  const pinsPerSide = tier === "high" ? 16 : 10;

  const pinMatrices = useMemo(() => {
    const out: THREE.Matrix4[] = [];
    const half = 1.05;
    for (let side = 0; side < 4; side++) {
      for (let i = 0; i < pinsPerSide; i++) {
        const u = -0.88 + (1.76 * (i + 0.5)) / pinsPerSide;
        const m = new THREE.Matrix4();
        const horiz = side < 2;
        const sign = side % 2 === 0 ? 1 : -1;
        const pos = horiz
          ? new THREE.Vector3(u, -0.02, sign * (half + 0.07))
          : new THREE.Vector3(sign * (half + 0.07), -0.02, u);
        const scl = horiz
          ? new THREE.Vector3(0.07, 0.04, 0.2)
          : new THREE.Vector3(0.2, 0.04, 0.07);
        m.compose(pos, new THREE.Quaternion(), scl);
        out.push(m);
      }
    }
    return out;
  }, [pinsPerSide]);

  const pinsRef = useRef<THREE.InstancedMesh>(null);
  useEffect(() => {
    const mesh = pinsRef.current;
    if (!mesh) return;
    pinMatrices.forEach((m, i) => mesh.setMatrixAt(i, m));
    mesh.instanceMatrix.needsUpdate = true;
  }, [pinMatrices]);

  const dieRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    const px = state.pointer.x;
    const py = state.pointer.y;
    // subtle reaction to the mouse + a little extra spin while scrolling
    g.rotation.y = THREE.MathUtils.damp(
      g.rotation.y,
      px * 0.25 + scrollStore.progress * 0.8,
      3,
      dt,
    );
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, -py * 0.12, 3, dt);
    if (dieRef.current) {
      dieRef.current.emissiveIntensity =
        0.35 + Math.sin(state.clock.elapsedTime * 1.6) * 0.1 + scrollStore.velocity * 1.5;
    }
  });

  return (
    <group position={[MCU_POS[0], 0.32, MCU_POS[1]]}>
      <group ref={group}>
        {/* package */}
        <RoundedBox args={[2.1, 0.3, 2.1]} radius={0.05} smoothness={3}>
          <meshStandardMaterial color="#0d1218" roughness={0.35} metalness={0.7} />
        </RoundedBox>
        {/* top face inset */}
        <mesh position={[0, 0.151, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.7, 1.7]} />
          <meshStandardMaterial color="#10171f" roughness={0.25} metalness={0.8} />
        </mesh>
        {/* die glow */}
        <mesh position={[0, 0.155, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.7, 0.7]} />
          <meshStandardMaterial
            ref={dieRef}
            color="#1d160c"
            emissive="#D4A24E"
            emissiveIntensity={0.4}
            roughness={0.3}
          />
        </mesh>
        {/* pin-1 marker */}
        <mesh position={[-0.75, 0.156, -0.75]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.07, 16]} />
          <meshBasicMaterial color="#9aa7b4" />
        </mesh>
        {/* pins */}
        <instancedMesh ref={pinsRef} args={[undefined, undefined, pinMatrices.length]} frustumCulled={false}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#b9c3cc" metalness={0.9} roughness={0.25} />
        </instancedMesh>
      </group>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Secondary modules                                                    */
/* ------------------------------------------------------------------ */

function WifiModule() {
  const [x, z] = MODULES.wifi;
  return (
    <group position={[x, 0, z]}>
      <RoundedBox args={[2.6, 0.12, 1.6]} radius={0.03} position={[0, 0.06, 0]}>
        <meshStandardMaterial color="#1B4A36" roughness={0.55} metalness={0.2} />
      </RoundedBox>
      <RoundedBox args={[1.0, 0.16, 1.0]} radius={0.04} position={[-0.45, 0.2, 0]}>
        <meshStandardMaterial color="#c3ccd4" metalness={0.95} roughness={0.3} />
      </RoundedBox>
      {/* antenna meander */}
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={i} position={[0.78 + (i % 2 ? 0.14 : -0.04) * 0.5, 0.13, -0.5 + i * 0.25]}>
          <boxGeometry args={[0.5, 0.02, 0.05]} />
          <meshStandardMaterial color="#d6a35c" metalness={0.9} roughness={0.35} />
        </mesh>
      ))}
      <Blink position={[1.1, 0.14, 0.62]} color="#5FAE8A" speed={2.2} />
    </group>
  );
}

function PinHeader() {
  const [x, z] = MODULES.header;
  return (
    <group position={[x, 0, z]}>
      <RoundedBox args={[3.4, 0.14, 0.6]} radius={0.02} position={[0, 0.07, 0]}>
        <meshStandardMaterial color="#0a0e13" roughness={0.6} />
      </RoundedBox>
      {Array.from({ length: 10 }, (_, i) => (
        <mesh key={i} position={[-1.35 + i * 0.3, 0.3, 0]}>
          <boxGeometry args={[0.07, 0.4, 0.07]} />
          <meshStandardMaterial color="#e2c276" metalness={1} roughness={0.25} />
        </mesh>
      ))}
    </group>
  );
}

function Scope() {
  const [x, z] = MODULES.scope;
  const lineObj = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(96 * 3), 3));
    const m = new THREE.LineBasicMaterial({ color: "#E3B968", toneMapped: false });
    return new THREE.Line(g, m);
  }, []);

  useFrame((state) => {
    const pos = lineObj.geometry.getAttribute("position") as THREE.BufferAttribute;
    const t = state.clock.elapsedTime * (1 + scrollStore.velocity * 4);
    for (let i = 0; i < 96; i++) {
      const u = i / 95;
      const sq = Math.sign(Math.sin((u * 6 + t * 0.8) * Math.PI)) * 0.28; // square-ish digital signal
      const sn = Math.sin((u * 5 + t) * Math.PI * 2) * 0.22; // analog
      const y = u < 0.5 ? sn : sq;
      pos.setXYZ(i, -1.45 + u * 2.9, y, 0.01);
    }
    pos.needsUpdate = true;
  });

  return (
    <group position={[x, 1.6, z]} rotation={[0, -0.35, 0]}>
      <RoundedBox args={[3.3, 1.9, 0.12]} radius={0.06} smoothness={3}>
        <meshStandardMaterial color="#0c1218" metalness={0.6} roughness={0.4} />
      </RoundedBox>
      <mesh position={[0, 0, 0.065]}>
        <planeGeometry args={[3.0, 1.6]} />
        <meshStandardMaterial color="#060d09" emissive="#0f2418" emissiveIntensity={0.7} />
      </mesh>
      {/* graticule */}
      {Array.from({ length: 5 }, (_, i) => (
        <mesh key={`h${i}`} position={[0, -0.64 + i * 0.32, 0.07]}>
          <planeGeometry args={[3.0, 0.004]} />
          <meshBasicMaterial color="#2F5A47" transparent opacity={0.6} />
        </mesh>
      ))}
      {Array.from({ length: 9 }, (_, i) => (
        <mesh key={`v${i}`} position={[-1.2 + i * 0.3, 0, 0.07]}>
          <planeGeometry args={[0.004, 1.6]} />
          <meshBasicMaterial color="#2F5A47" transparent opacity={0.6} />
        </mesh>
      ))}
      <group position={[0, 0, 0.08]}>
        <primitive object={lineObj} />
      </group>
      {/* stand */}
      <mesh position={[0, -1.35, -0.1]}>
        <boxGeometry args={[0.3, 0.8, 0.12]} />
        <meshStandardMaterial color="#0c1218" metalness={0.6} roughness={0.4} />
      </mesh>
    </group>
  );
}

function CamModule() {
  const [x, z] = MODULES.cam;
  const lens = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (lens.current) lens.current.rotation.z = state.clock.elapsedTime * 0.3;
  });
  return (
    <group position={[x, 0, z]}>
      <RoundedBox args={[2.2, 0.1, 2.2]} radius={0.04} position={[0, 0.05, 0]}>
        <meshStandardMaterial color="#1B4A36" roughness={0.55} metalness={0.2} />
      </RoundedBox>
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.55, 0.6, 0.4, 32]} />
        <meshStandardMaterial color="#12181f" metalness={0.8} roughness={0.35} />
      </mesh>
      <mesh ref={lens} position={[0, 0.51, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.18, 0.42, 32]} />
        <meshStandardMaterial color="#1a120a" emissive="#8a5a2a" emissiveIntensity={0.7} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.515, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.18, 24]} />
        <meshBasicMaterial color="#020407" />
      </mesh>
      <Blink position={[0.85, 0.12, 0.85]} color="#f87171" speed={1.4} />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Small floating electronic components                                 */
/* ------------------------------------------------------------------ */

function Blink({
  position,
  color,
  speed = 2,
}: {
  position: [number, number, number];
  color: string;
  speed?: number;
}) {
  const mat = useRef<THREE.MeshStandardMaterial>(null);
  useFrame((state) => {
    if (mat.current) {
      mat.current.emissiveIntensity = 0.5 + (Math.sin(state.clock.elapsedTime * speed) * 0.5 + 0.5) * 2.2;
    }
  });
  return (
    <mesh position={position}>
      <boxGeometry args={[0.16, 0.08, 0.1]} />
      <meshStandardMaterial ref={mat} color={color} emissive={color} emissiveIntensity={1} />
    </mesh>
  );
}

function FloatingParts({ tier }: { tier: PerfTier }) {
  const parts = useMemo(() => {
    const r = rng(99);
    const n = tier === "high" ? 16 : 7;
    return Array.from({ length: n }, (_, i) => ({
      key: i,
      kind: i % 4, // 0 capacitor, 1 resistor, 2 smd chip, 3 led
      pos: [(r() - 0.5) * 18, 0.8 + r() * 3.2, -r() * 17 + 1] as [number, number, number],
      rot: [r() * 3, r() * 3, r() * 3] as [number, number, number],
      scale: 0.5 + r() * 0.5,
    }));
  }, [tier]);

  return (
    <>
      {parts.map((p) => (
        <Float key={p.key} speed={1 + (p.key % 3) * 0.4} rotationIntensity={0.6} floatIntensity={0.9}>
          <group position={p.pos} rotation={p.rot} scale={p.scale}>
            {p.kind === 0 && (
              <mesh>
                <cylinderGeometry args={[0.16, 0.16, 0.32, 16]} />
                <meshStandardMaterial color="#1f3b57" metalness={0.6} roughness={0.4} />
              </mesh>
            )}
            {p.kind === 1 && (
              <mesh>
                <boxGeometry args={[0.4, 0.14, 0.14]} />
                <meshStandardMaterial color="#2a2118" metalness={0.3} roughness={0.6} />
              </mesh>
            )}
            {p.kind === 2 && (
              <mesh>
                <boxGeometry args={[0.38, 0.08, 0.38]} />
                <meshStandardMaterial color="#0d1218" metalness={0.8} roughness={0.35} />
              </mesh>
            )}
            {p.kind === 3 && (
              <mesh>
                <sphereGeometry args={[0.1, 12, 12]} />
                <meshStandardMaterial color="#D4A24E" emissive="#D4A24E" emissiveIntensity={1.2} />
              </mesh>
            )}
          </group>
        </Float>
      ))}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Camera rig: scroll-driven journey through the board                   */
/* ------------------------------------------------------------------ */

const KEYS: { p: number; pos: [number, number, number]; look: [number, number, number] }[] = [
  { p: 0.0, pos: [0.4, 3.6, 8.8], look: [1.2, 0.2, 0] }, // home
  { p: 0.14, pos: [3.6, 1.5, 3.8], look: [2.4, 0.3, 0] }, // closer on the MCU (about)
  { p: 0.28, pos: [-3.2, 2.2, -1.2], look: [-5, 0.3, -4.5] }, // wifi module (skills)
  { p: 0.44, pos: [-1.6, 1.8, -6.2], look: [-3, 0.4, -9.5] }, // header (projects)
  { p: 0.6, pos: [3.4, 2.4, -6], look: [6.2, 1.4, -9] }, // scope (projects)
  { p: 0.76, pos: [1.6, 1.9, -10.5], look: [0, 0.3, -14.5] }, // camera module
  { p: 0.9, pos: [0, 4.2, -9], look: [0, 0, -12] },
  { p: 1.0, pos: [0, 7.2, -4], look: [0, 0, -9] }, // top-down (contact)
];

const posCurve = new THREE.CatmullRomCurve3(KEYS.map((k) => new THREE.Vector3(...k.pos)), false, "centripetal");
const lookCurve = new THREE.CatmullRomCurve3(KEYS.map((k) => new THREE.Vector3(...k.look)), false, "centripetal");

const _cam = new THREE.Vector3();
const _look = new THREE.Vector3();
const _smoothLook = new THREE.Vector3(1.2, 0.2, 0);

function CameraRig() {
  const progress = useRef(0);
  useFrame((state, dt) => {
    // smooth the scroll value so the camera glides
    progress.current = THREE.MathUtils.damp(progress.current, scrollStore.progress, 2.6, dt);
    const p = progress.current;
    posCurve.getPoint(p, _cam);
    lookCurve.getPoint(p, _look);

    const mobile = state.size.width < 768;
    if (mobile) {
      // pull back and raise so the scene stays framed on a narrow screen
      _cam.y += 0.9;
      _cam.z += p < 0.1 ? 3.2 : 1.6;
    }

    // mouse parallax
    _cam.x += state.pointer.x * 0.45;
    _cam.y += state.pointer.y * 0.25;

    state.camera.position.lerp(_cam, 1 - Math.exp(-6 * dt));
    _smoothLook.lerp(_look, 1 - Math.exp(-6 * dt));
    state.camera.lookAt(_smoothLook);
  });
  return null;
}

/* ------------------------------------------------------------------ */
/* Lights that shift tint with scroll                                   */
/* ------------------------------------------------------------------ */

const TINTS = ["#D4A24E", "#C0764A", "#5FAE8A", "#D4A24E"].map((c) => new THREE.Color(c));
const _tint = new THREE.Color();

function Lights() {
  const key = useRef<THREE.PointLight>(null);
  useFrame(() => {
    const f = scrollStore.progress * (TINTS.length - 1);
    const i = Math.min(TINTS.length - 2, Math.floor(f));
    _tint.copy(TINTS[i]).lerp(TINTS[i + 1], f - i);
    key.current?.color.copy(_tint);
  });
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 8, 4]} intensity={0.9} color="#FFF1D6" />
      <pointLight ref={key} position={[2.4, 3, 1]} intensity={10} distance={16} color="#D4A24E" />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Board + grid                                                         */
/* ------------------------------------------------------------------ */

function Board() {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, -7]}>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#09100c" roughness={0.9} metalness={0.2} />
      </mesh>
      <Grid
        position={[0, 0, -7]}
        args={[60, 60]}
        cellSize={0.5}
        cellThickness={0.5}
        cellColor="#15221b"
        sectionSize={2.5}
        sectionThickness={1}
        sectionColor="#2F5A47"
        fadeDistance={26}
        fadeStrength={1.4}
        infiniteGrid
      />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Root                                                                 */
/* ------------------------------------------------------------------ */

export default function Scene({ initialTier }: { initialTier: Exclude<PerfTier, "off"> }) {
  const [tier, setTier] = useState<Exclude<PerfTier, "off">>(initialTier);
  const [dpr, setDpr] = useState(initialTier === "high" ? 1.5 : 1);

  return (
    <Canvas
      dpr={[1, dpr]}
      camera={{ position: [0.4, 3.6, 8.8], fov: 42, near: 0.1, far: 80 }}
      gl={{ antialias: tier === "high", powerPreference: "high-performance", alpha: true }}
      frameloop="always"
      aria-hidden
      onCreated={({ scene }) => {
        scene.fog = new THREE.Fog("#0B100E", 14, 34);
      }}
    >
      {/* Automatic degradation: drop quality if the frame rate falls */}
      <PerformanceMonitor
        onDecline={() => {
          setDpr(1);
          setTier("low");
        }}
        flipflops={3}
      />
      <Lights />
      <Board />
      <Traces tier={tier} />
      <McuChip tier={tier} />
      <WifiModule />
      <PinHeader />
      <Scope />
      <CamModule />
      <FloatingParts tier={tier} />
      {tier === "high" && (
        <Sparkles count={70} scale={[22, 7, 24]} position={[0, 2.5, -7]} size={2} speed={0.25} opacity={0.5} color="#C9A86A" />
      )}
      <CameraRig />
    </Canvas>
  );
}
