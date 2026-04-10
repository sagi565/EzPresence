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

// Edges drawn in over time — at: ms from start, each animated over DRAW_DUR ms
const EDGE_SCHEDULE: Array<{ a: number; b: number; at: number }> = [
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

const DRAW_DUR = 500; // ms per edge

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
  angularVel: number; // always positive = clockwise
  size:       number;
  born:       number;
  life:       number;
}

interface PulseEdge {
  a: number; b: number;
  born: number;
  fadeIn: number; hold: number; fadeOut: number;
}

// ─── Component ───────────────────────────────────────────────────────────────
const PlanningCanvas: React.FC = () => {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const beamsRef   = useRef<Beam[]>([]);
  const dotsRef    = useRef<OrbitDot[]>([]);
  const pulseEdges = useRef<PulseEdge[]>([]);
  const rafRef     = useRef<number>(0);
  const sizeRef    = useRef({ w: 0, h: 0 });
  const startRef   = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const DPR = window.devicePixelRatio || 1;

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      sizeRef.current = { w, h };
      canvas.width        = w * DPR;
      canvas.height       = h * DPR;
      canvas.style.width  = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    // Fire 2–4 beams from different nodes
    const fireBurst = () => {
      const count     = 2 + Math.floor(Math.random() * 3);
      const usedNodes = new Set<number>();
      for (let i = 0; i < count; i++) {
        let n = Math.floor(Math.random() * NODES.length);
        if (usedNodes.size < NODES.length) while (usedNodes.has(n)) n = Math.floor(Math.random() * NODES.length);
        usedNodes.add(n);
        setTimeout(() => {
          beamsRef.current.push({
            nodeIdx: n,
            toAngle: Math.random() * Math.PI * 2,
            ringR:   RING_RADII[Math.floor(Math.random() * RING_RADII.length)],
            born:    performance.now(),
            drawDur: 350 + Math.random() * 400,
            dotBorn: false,
          });
        }, i * (80 + Math.random() * 180));
      }
    };

    fireBurst();
    setTimeout(fireBurst, 900);
    const interval = setInterval(fireBurst, 1600 + Math.random() * 800);

    const SHAPE_DONE = EDGE_SCHEDULE[EDGE_SCHEDULE.length - 1].at + DRAW_DUR + 400;
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

      // ── breathing scale ───────────────────────────────────────────────────
      const breathe = 1 + 0.03 * Math.sin(now / 1200);

      // ── scheduled edges draw in one by one ───────────────────────────────
      EDGE_SCHEDULE.forEach(({ a, b, at }) => {
        const edgeElapsed = elapsed - at;
        if (edgeElapsed < 0) return;
        const t = Math.min(1, edgeElapsed / DRAW_DUR);
        const [ax, ay] = NODES[a];
        const [bx, by] = NODES[b];
        const x1 = CX + ax * breathe, y1 = CY + ay * breathe;
        const x2 = CX + bx * breathe, y2 = CY + by * breathe;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x1 + (x2 - x1) * t, y1 + (y2 - y1) * t);
        ctx.strokeStyle = 'rgba(167,139,250,0.28)';
        ctx.lineWidth = 0.9;
        ctx.stroke();
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
        const [ax, ay] = NODES[pe.a];
        const [bx, by] = NODES[pe.b];
        ctx.beginPath();
        ctx.moveTo(CX + ax * breathe, CY + ay * breathe);
        ctx.lineTo(CX + bx * breathe, CY + by * breathe);
        ctx.strokeStyle = `rgba(167,139,250,${alpha})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
        return true;
      });

      // ── shape nodes — crisp dot, appears with first edge ─────────────────
      NODES.forEach(([nx, ny], i) => {
        const firstEdge = EDGE_SCHEDULE.find(e => e.a === i || e.b === i);
        if (!firstEdge || elapsed < firstEdge.at) return;
        const pulse = 0.5 + 0.5 * Math.sin(now / 1000 + i * 0.9);
        const r = 2.0 + pulse * 0.7;
        ctx.beginPath();
        ctx.arc(CX + nx * breathe, CY + ny * breathe, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(167,139,250,${0.5 + pulse * 0.4})`;
        ctx.fill();
      });

      // ── beams ─────────────────────────────────────────────────────────────
      beamsRef.current = beamsRef.current.filter(b => {
        const age = now - b.born;
        const t   = Math.min(1, age / b.drawDur);
        const [nx, ny] = NODES[b.nodeIdx];
        const fromX = CX + nx * breathe, fromY = CY + ny * breathe;
        const toX   = CX + Math.cos(b.toAngle) * b.ringR;
        const toY   = CY + Math.sin(b.toAngle) * b.ringR;

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
        const FADE = 320;
        const beamAlpha = t < 1 ? t * 0.6 : Math.max(0, 0.6 * (1 - afterLand / FADE));
        if (age > b.drawDur + FADE) return false;

        if (beamAlpha > 0.01) {
          const tipX = fromX + (toX - fromX) * t;
          const tipY = fromY + (toY - fromY) * t;
          const grad = ctx.createLinearGradient(fromX, fromY, tipX, tipY);
          grad.addColorStop(0,    `rgba(139,92,246,0)`);
          grad.addColorStop(0.25, `rgba(167,139,250,${beamAlpha * 0.7})`);
          grad.addColorStop(1,    `rgba(210,190,255,${beamAlpha})`);
          ctx.beginPath();
          ctx.moveTo(fromX, fromY);
          ctx.lineTo(tipX, tipY);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.1;
          ctx.stroke();
          if (t < 1) {
            ctx.beginPath();
            ctx.arc(tipX, tipY, 2.0, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(220,200,255,${t * 0.85})`;
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
        ctx.beginPath();
        ctx.arc(CX + Math.cos(d.angle) * d.ringR, CY + Math.sin(d.angle) * d.ringR, d.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139,92,246,${Math.max(0, alpha) * 0.72})`;
        ctx.fill();
        return true;
      });

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafRef.current);
      clearInterval(interval);
      clearInterval(pulseInterval);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <CanvasEl ref={canvasRef} />;
};

export default PlanningCanvas;
