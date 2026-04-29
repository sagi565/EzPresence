import React, { useRef, useEffect } from 'react';
import { CanvasEl } from './styles';

// ─── Node positions (offsets from viewport center) ───────────────────────────
// 11 nodes: outer heptagon (0-6) + inner triangle (7-9) + center (10)
const NODES: [number, number][] = [
  [   0,  -72],  // 0  top
  [  60,  -36],  // 1  upper-right
  [  66,   24],  // 2  lower-right
  [  24,   68],  // 3  bottom-right
  [ -28,   62],  // 4  bottom-left
  [ -62,   12],  // 5  left
  [ -40,  -54],  // 6  upper-left
  [  26,  -28],  // 7  inner right
  [   0,   36],  // 8  inner bottom
  [ -28,  -16],  // 9  inner left
  [   0,    0],  // 10 center
];

// Schedule stretched 2.4× → full build ~23.7s.
const TIME_SCALE = 2.4;
const RAW_SCHEDULE: Array<{ a: number; b: number; at: number }> = [
  // outer ring — draws around clockwise
  { a: 0, b: 1, at:    0 },
  { a: 1, b: 2, at:  360 },
  { a: 2, b: 3, at:  720 },
  { a: 3, b: 4, at: 1080 },
  { a: 4, b: 5, at: 1440 },
  { a: 5, b: 6, at: 1800 },
  { a: 6, b: 0, at: 2160 },
  // outer cross-connections
  { a: 0, b: 3, at: 3000 },
  { a: 1, b: 5, at: 3420 },
  { a: 2, b: 6, at: 3840 },
  { a: 0, b: 4, at: 4260 },
  { a: 2, b: 5, at: 4650 },
  // inner triangle
  { a: 7, b: 8, at: 5250 },
  { a: 8, b: 9, at: 5580 },
  { a: 9, b: 7, at: 5910 },
  // spokes: outer nodes to inner ring
  { a: 1, b: 7, at: 6600 },
  { a: 3, b: 8, at: 6900 },
  { a: 5, b: 9, at: 7200 },
  // center node connections — final reveal
  { a: 10, b: 7, at: 8100 },
  { a: 10, b: 8, at: 8400 },
  { a: 10, b: 9, at: 8700 },
  { a: 10, b: 0, at: 9300 },
  { a: 10, b: 3, at: 9600 },
  { a: 10, b: 5, at: 9900 },
];
const EDGE_SCHEDULE = RAW_SCHEDULE.map(e => ({ ...e, at: e.at * TIME_SCALE }));

const DRAW_DUR = 750; // ms per edge — slower, more deliberate

// Orbit ring radii
const RING_RADII = [150, 225, 300, 375];

// ─── Types ───────────────────────────────────────────────────────────────────
interface Beam {
  nodeIdx: number;
  toAngle: number;
  ringR:   number;
  born:    number;
  drawDur: number;
  dotBorn: boolean;
}

interface OrbitDot {
  ringR:      number;
  angle:      number;
  angularVel: number;
  size:       number;
  born:       number;
  life:       number;
}

interface PulseEdge {
  a: number; b: number;
  born: number;
  fadeIn: number; hold: number; fadeOut: number;
}

interface Shimmer {
  edgeIdx: number;
  born: number;
  dur: number;
}

interface Star {
  x: number; y: number;
  size: number;
  baseAlpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
}

// Per-node organic wobble — small independent drift so the body feels alive.
const wobbleX = (i: number, now: number) => 0.9 * Math.sin(now / (900 + i * 70) + i);
const wobbleY = (i: number, now: number) => 0.9 * Math.cos(now / (1100 + i * 60) + i * 1.7);

// ─── Component ───────────────────────────────────────────────────────────────
const PlanningCanvas: React.FC = () => {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const beamsRef   = useRef<Beam[]>([]);
  const dotsRef    = useRef<OrbitDot[]>([]);
  const pulseEdges = useRef<PulseEdge[]>([]);
  const shimmersRef = useRef<Shimmer[]>([]);
  const starsRef   = useRef<Star[]>([]);
  const rafRef     = useRef<number>(0);
  const sizeRef    = useRef({ w: 0, h: 0 });
  const startRef   = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const DPR = window.devicePixelRatio || 1;
    const SUPERSAMPLE = 2;
    const SCALE = DPR * SUPERSAMPLE;

    const seedStars = (w: number, h: number) => {
      const count = Math.min(120, Math.floor((w * h) / 16000));
      const stars: Star[] = [];
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          size: 0.4 + Math.random() * 1.3,
          baseAlpha: 0.15 + Math.random() * 0.45,
          twinkleSpeed: 0.0008 + Math.random() * 0.0022,
          twinklePhase: Math.random() * Math.PI * 2,
        });
      }
      starsRef.current = stars;
    };

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      sizeRef.current = { w, h };
      canvas.width        = w * SCALE;
      canvas.height       = h * SCALE;
      canvas.style.width  = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(SCALE, 0, 0, SCALE, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      seedStars(w, h);
    };
    resize();
    window.addEventListener('resize', resize);

    const SHAPE_DONE = EDGE_SCHEDULE[EDGE_SCHEDULE.length - 1].at + DRAW_DUR + 600;

    const getBuildProgress = () => {
      if (!startRef.current) return 0;
      const elapsed = performance.now() - startRef.current;
      return Math.max(0, Math.min(1, elapsed / SHAPE_DONE));
    };

    // Beams scale with build progress.
    let burstTimeoutId: number | null = null;
    let shimmerTimeoutId: number | null = null;
    let cancelled = false;

    const fireBurst = () => {
      const progress  = getBuildProgress();
      const count     = 1 + Math.floor(progress * 3 + Math.random() * (1 + progress));
      const usedNodes = new Set<number>();
      for (let i = 0; i < count; i++) {
        let n = Math.floor(Math.random() * NODES.length);
        if (usedNodes.size < NODES.length) while (usedNodes.has(n)) n = Math.floor(Math.random() * NODES.length);
        usedNodes.add(n);

        const [nx, ny] = NODES[n];
        const isCenter = nx * nx + ny * ny < 4;
        const sourceAngle = isCenter
          ? Math.random() * Math.PI * 2
          : Math.atan2(ny, nx);
        const jitter  = isCenter ? 0 : (Math.random() - 0.5) * (Math.PI / 3);
        const toAngle = sourceAngle + jitter;

        setTimeout(() => {
          beamsRef.current.push({
            nodeIdx: n,
            toAngle,
            ringR:   RING_RADII[Math.floor(Math.random() * RING_RADII.length)],
            born:    performance.now(),
            drawDur: 350 + Math.random() * 400,
            dotBorn: false,
          });
        }, i * (80 + Math.random() * 180));
      }
    };

    const scheduleNextBurst = () => {
      if (cancelled) return;
      const progress = getBuildProgress();
      const interval = 3200 + (1500 - 3200) * progress + (Math.random() - 0.5) * 300;
      burstTimeoutId = window.setTimeout(() => {
        fireBurst();
        scheduleNextBurst();
      }, Math.max(700, interval));
    };

    // Edge shimmer — small bright pulse traveling along an already-drawn edge.
    const scheduleNextShimmer = () => {
      if (cancelled) return;
      const progress = getBuildProgress();
      const interval = 1300 + (500 - 1300) * progress + Math.random() * 500;
      shimmerTimeoutId = window.setTimeout(() => {
        if (!startRef.current) { scheduleNextShimmer(); return; }
        const elapsed = performance.now() - startRef.current;
        const ready = EDGE_SCHEDULE
          .map((e, idx) => ({ idx, at: e.at }))
          .filter(e => elapsed >= e.at + DRAW_DUR);
        if (ready.length > 0) {
          const pick = ready[Math.floor(Math.random() * ready.length)];
          shimmersRef.current.push({
            edgeIdx: pick.idx,
            born: performance.now(),
            dur: 800 + Math.random() * 500,
          });
        }
        scheduleNextShimmer();
      }, Math.max(300, interval));
    };

    fireBurst();
    scheduleNextBurst();
    scheduleNextShimmer();

    const pulseInterval = setInterval(() => {
      if (!startRef.current) return;
      if (performance.now() - startRef.current < SHAPE_DONE) return;
      const a = Math.floor(Math.random() * NODES.length);
      let b = Math.floor(Math.random() * NODES.length);
      while (b === a) b = Math.floor(Math.random() * NODES.length);
      pulseEdges.current.push({ a, b, born: performance.now(), fadeIn: 700, hold: 1200 + Math.random() * 1400, fadeOut: 1000 });
    }, 1400 + Math.random() * 1000);

    let lastT = 0;
    const draw = (now: number) => {
      if (!startRef.current) startRef.current = now;
      const elapsed = now - startRef.current;
      const dt = lastT ? Math.min(now - lastT, 50) : 16;
      lastT = now;

      const { w, h } = sizeRef.current;
      const CX = w / 2;
      const CY = h / 2;
      ctx.clearRect(0, 0, w, h);

      // ── background blobs ──────────────────────────────────────────────────
      const blob1 = ctx.createRadialGradient(w * -0.10, h * -0.18, 0, w * -0.10, h * -0.18, 275);
      blob1.addColorStop(0, 'rgba(139,92,246,0.04)');
      blob1.addColorStop(1, 'rgba(139,92,246,0)');
      ctx.fillStyle = blob1;
      ctx.fillRect(0, 0, w, h);

      const blob2 = ctx.createRadialGradient(w * 0.70, h * 0.50, 0, w * 0.70, h * 0.50, 190);
      blob2.addColorStop(0, 'rgba(109,40,217,0.03)');
      blob2.addColorStop(1, 'rgba(109,40,217,0)');
      ctx.fillStyle = blob2;
      ctx.fillRect(0, 0, w, h);

      // ── twinkling background stars ───────────────────────────────────────
      starsRef.current.forEach(s => {
        const tw = 0.5 + 0.5 * Math.sin(now * s.twinkleSpeed + s.twinklePhase);
        const a = s.baseAlpha * (0.35 + 0.65 * tw);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,180,255,${a})`;
        ctx.fill();
      });

      // ── orbit rings ───────────────────────────────────────────────────────
      const dashOffset = -(now / 280) % 14;
      ctx.setLineDash([6, 8]);
      ctx.lineDashOffset = dashOffset;
      RING_RADII.forEach(r => {
        ctx.beginPath();
        ctx.arc(CX, CY, r, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(139,92,246,0.12)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });
      ctx.setLineDash([]);
      ctx.lineDashOffset = 0;

      // ── breathing scale + slow global rotation ────────────────────────────
      const breathe = 1 + 0.025 * Math.sin(now / 1200);
      const globalAngle = now * 0.00004; // very slow, ~0.04 rad/sec
      const cosG = Math.cos(globalAngle);
      const sinG = Math.sin(globalAngle);

      // Resolve a node's current screen position (rotation + breathe + wobble).
      const nodePos = (i: number): [number, number] => {
        const [nx, ny] = NODES[i];
        const rx = nx * cosG - ny * sinG;
        const ry = nx * sinG + ny * cosG;
        return [
          CX + rx * breathe + wobbleX(i, now),
          CY + ry * breathe + wobbleY(i, now),
        ];
      };

      // ── central core glow — grows with build progress ─────────────────────
      const buildProgress = Math.max(0, Math.min(1, elapsed / SHAPE_DONE));
      const corePulse = 0.85 + 0.15 * Math.sin(now / 700);
      const coreRadius = 22 + 60 * buildProgress * corePulse;
      const coreAlpha  = 0.04 + 0.18 * buildProgress;
      const coreGrad = ctx.createRadialGradient(CX, CY, 0, CX, CY, coreRadius);
      coreGrad.addColorStop(0,   `rgba(220,200,255,${coreAlpha})`);
      coreGrad.addColorStop(0.4, `rgba(167,139,250,${coreAlpha * 0.5})`);
      coreGrad.addColorStop(1,   `rgba(139,92,246,0)`);
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(CX, CY, coreRadius, 0, Math.PI * 2);
      ctx.fill();

      // ── scheduled edges draw in one by one ───────────────────────────────
      EDGE_SCHEDULE.forEach(({ a, b, at }) => {
        const edgeElapsed = elapsed - at;
        if (edgeElapsed < 0) return;
        const t = Math.min(1, edgeElapsed / DRAW_DUR);
        const [x1, y1] = nodePos(a);
        const [x2, y2] = nodePos(b);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x1 + (x2 - x1) * t, y1 + (y2 - y1) * t);
        ctx.strokeStyle = 'rgba(167,139,250,0.32)';
        ctx.lineWidth = 0.9;
        ctx.stroke();
      });

      // ── shimmers traveling along established edges ───────────────────────
      shimmersRef.current = shimmersRef.current.filter(s => {
        const age = now - s.born;
        if (age > s.dur) return false;
        const edge = EDGE_SCHEDULE[s.edgeIdx];
        if (!edge) return false;
        const [x1, y1] = nodePos(edge.a);
        const [x2, y2] = nodePos(edge.b);
        const t = age / s.dur;
        // Eased travel — accelerate then ease out.
        const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        const px = x1 + (x2 - x1) * ease;
        const py = y1 + (y2 - y1) * ease;
        // Soft halo
        const haloR = 6;
        const halo = ctx.createRadialGradient(px, py, 0, px, py, haloR);
        const haloA = (1 - Math.abs(0.5 - t) * 2) * 0.55;
        halo.addColorStop(0, `rgba(230,210,255,${haloA})`);
        halo.addColorStop(1, 'rgba(167,139,250,0)');
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(px, py, haloR, 0, Math.PI * 2);
        ctx.fill();
        // Bright dot
        ctx.beginPath();
        ctx.arc(px, py, 1.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245,235,255,${0.4 + (1 - Math.abs(0.5 - t) * 2) * 0.5})`;
        ctx.fill();
        return true;
      });

      // ── pulse edges ───────────────────────────────────────────────────────
      pulseEdges.current = pulseEdges.current.filter(pe => {
        const age   = now - pe.born;
        const total = pe.fadeIn + pe.hold + pe.fadeOut;
        if (age > total) return false;
        let alpha: number;
        if (age < pe.fadeIn)                alpha = age / pe.fadeIn;
        else if (age < pe.fadeIn + pe.hold) alpha = 1;
        else                                alpha = 1 - (age - pe.fadeIn - pe.hold) / pe.fadeOut;
        alpha = Math.max(0, alpha) * 0.20;
        const [x1, y1] = nodePos(pe.a);
        const [x2, y2] = nodePos(pe.b);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = `rgba(167,139,250,${alpha})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
        return true;
      });

      // ── shape nodes — pop-in scale + halo glow ───────────────────────────
      NODES.forEach(([, ], i) => {
        const firstEdge = EDGE_SCHEDULE.find(e => e.a === i || e.b === i);
        if (!firstEdge || elapsed < firstEdge.at) return;
        const sinceFirst = elapsed - firstEdge.at;
        const fadeIn = Math.min(1, sinceFirst / 700);
        // Pop-in: 0 → 1.4 → 1.0 over 700ms
        let scale: number;
        if (sinceFirst < 350)        scale = 1.4 * (sinceFirst / 350);
        else if (sinceFirst < 700)   scale = 1.4 - 0.4 * ((sinceFirst - 350) / 350);
        else                         scale = 1.0;
        const pulse = 0.5 + 0.5 * Math.sin(now / 1000 + i * 0.9);
        const r = (2.0 + pulse * 0.7) * scale;
        const [px, py] = nodePos(i);

        // Crisp dot, no halo
        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(196,170,255,${(0.65 + pulse * 0.35) * fadeIn})`;
        ctx.fill();
      });

      // ── beams ─────────────────────────────────────────────────────────────
      beamsRef.current = beamsRef.current.filter(b => {
        const age = now - b.born;
        const t   = Math.min(1, age / b.drawDur);
        const [fromX, fromY] = nodePos(b.nodeIdx);
        const toX = CX + Math.cos(b.toAngle) * b.ringR;
        const toY = CY + Math.sin(b.toAngle) * b.ringR;

        if (t >= 1 && !b.dotBorn) {
          b.dotBorn = true;
          if (dotsRef.current.length < 32) {
            dotsRef.current.push({
              ringR:      b.ringR,
              angle:      b.toAngle,
              angularVel: 0.00012 + Math.random() * 0.00045,
              size:       1.8 + Math.random() * 2.4,
              born:       now,
              life:       9000 + Math.random() * 8000,
            });
          }
        }

        const afterLand = age - b.drawDur;
        const FADE = 380;
        const beamAlpha = t < 1 ? t * 0.65 : Math.max(0, 0.65 * (1 - afterLand / FADE));
        if (age > b.drawDur + FADE) return false;

        if (beamAlpha > 0.01) {
          const tipX = fromX + (toX - fromX) * t;
          const tipY = fromY + (toY - fromY) * t;
          const grad = ctx.createLinearGradient(fromX, fromY, tipX, tipY);
          grad.addColorStop(0,    `rgba(139,92,246,0)`);
          grad.addColorStop(0.25, `rgba(167,139,250,${beamAlpha * 0.7})`);
          grad.addColorStop(1,    `rgba(230,210,255,${beamAlpha})`);
          ctx.beginPath();
          ctx.moveTo(fromX, fromY);
          ctx.lineTo(tipX, tipY);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.2;
          ctx.stroke();
          if (t < 1) {
            // Tip halo
            const tipHalo = ctx.createRadialGradient(tipX, tipY, 0, tipX, tipY, 7);
            tipHalo.addColorStop(0, `rgba(240,225,255,${t * 0.55})`);
            tipHalo.addColorStop(1, 'rgba(167,139,250,0)');
            ctx.fillStyle = tipHalo;
            ctx.beginPath();
            ctx.arc(tipX, tipY, 7, 0, Math.PI * 2);
            ctx.fill();
            // Bright core
            ctx.beginPath();
            ctx.arc(tipX, tipY, 2.2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(245,235,255,${t * 0.9})`;
            ctx.fill();
          }
        }
        return true;
      });

      // ── orbit dots — crisp, clockwise ─────────────────────────────────────
      dotsRef.current = dotsRef.current.filter(d => {
        const age  = now - d.born;
        const frac = age / d.life;
        if (frac >= 1) return false;
        const EASE_DUR = 1000;
        const speedMult = age < EASE_DUR ? Math.pow(age / EASE_DUR, 2) : 1;
        d.angle += d.angularVel * speedMult * dt;
        let alpha: number;
        if (frac < 0.06)       alpha = frac / 0.06;
        else if (frac < 0.65)  alpha = 1;
        else                   alpha = 1 - (frac - 0.65) / 0.35;
        const dx = CX + Math.cos(d.angle) * d.ringR;
        const dy = CY + Math.sin(d.angle) * d.ringR;
        // Subtle glow
        const dotGrad = ctx.createRadialGradient(dx, dy, 0, dx, dy, d.size * 3);
        dotGrad.addColorStop(0, `rgba(196,170,255,${Math.max(0, alpha) * 0.35})`);
        dotGrad.addColorStop(1, 'rgba(139,92,246,0)');
        ctx.fillStyle = dotGrad;
        ctx.beginPath();
        ctx.arc(dx, dy, d.size * 3, 0, Math.PI * 2);
        ctx.fill();
        // Core
        ctx.beginPath();
        ctx.arc(dx, dy, d.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(167,139,250,${Math.max(0, alpha) * 0.85})`;
        ctx.fill();
        return true;
      });

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      cancelled = true;
      cancelAnimationFrame(rafRef.current);
      if (burstTimeoutId !== null) clearTimeout(burstTimeoutId);
      if (shimmerTimeoutId !== null) clearTimeout(shimmerTimeoutId);
      clearInterval(pulseInterval);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <CanvasEl ref={canvasRef} />;
};

export default PlanningCanvas;
