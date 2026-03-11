import React, { useRef, useEffect } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  z: number;
  size: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotationSpeed: number;
  baseRotationSpeed: number;
  opacity: number;
  img: HTMLImageElement;
  flutterPhase: number;
  flutterSpeed: number;
  swayXAmplitude: number;
  swayYAmplitude: number;
  isExtra?: boolean;
  markedForDeletion?: boolean;

  // Heart formation — only set on chosen particles
  inHeart: boolean;
  heartOffsetX: number;
  heartOffsetY: number;
  heartArrivalDelay: number;
  // Initial positional offset that decays to zero — creates a curved arc without overshoot
  windStartOffsetX: number;
  windStartOffsetY: number;

  // Wind ramp: 0 = just released (current velocity), 1 = fully back to wind speed
  windRampT: number;
}

const ICON_PATHS = [
  '/icons/social/youtube.png',
  '/icons/social/facebook.png',
  '/icons/social/tiktok.png',
  '/icons/social/instagram.png',
];

// ─────────────────────────────────────────────
//  WIND / PARTICLE BEHAVIOUR
// ─────────────────────────────────────────────

/** Total number of background particles floating at once. */
const COUNT = 30;

/** Base horizontal wind speed (px/frame). Higher = icons drift right faster. */
const WIND = 1.5;

/** Base downward drift speed (px/frame). Higher = icons fall faster. */
const GRAVITY_MIN = 1;

/** Smallest icon size in CSS px. */
const SIZE_MIN = 14;

/** Largest icon size in CSS px. */
const SIZE_MAX = 32;

/** Minimum icon opacity (most transparent). */
const OPACITY_MIN = 0.10;

/** Maximum icon opacity (most visible). */
const OPACITY_MAX = 0.30;

// ─────────────────────────────────────────────
//  MOUSE INTERACTION
// ─────────────────────────────────────────────

/** Pixel radius around the cursor within which icons get pushed away. */
const INTERACTION_RADIUS = 70;

/** How hard icons are pushed away from the cursor (multiplier). */
const REPULSION_FORCE = 1;

/** How much swirl/spin is added on top of the repulsion push. */
const SWIRL_FORCE = 0.2;

// ─────────────────────────────────────────────
//  HEART FORMATION — COUNTS & SCALE
// ─────────────────────────────────────────────

/** Maximum icons that join the heart shape. Must be ≤ COUNT. */
const HEART_PARTICLE_COUNT = 40;

/** Minimum icons that must join. If fewer are nearby, closest ones are pulled in regardless of distance. */
const HEART_MIN_PARTICLE_COUNT = 30;

/** Heart size as a fraction of the smaller canvas dimension (width or height).
 *  0.011 = small heart. Increase for larger. */
const HEART_SCALE_FACTOR = 0.011;

/** Max pixel distance from the heart center a particle can be and still volunteer to join.
 *  Particles beyond this are only used if needed to meet HEART_MIN_PARTICLE_COUNT. */
const HEART_MAX_JOIN_DISTANCE = 500;

/** Min/max random pixel offset applied to each particle's starting target position.
 *  Creates the initial wind-drift arc. Smaller = heart looks more like a heart immediately. */
const HEART_WIND_OFFSET_MIN = 20;
const HEART_WIND_OFFSET_MAX = 45;

// ─────────────────────────────────────────────
//  HEART FORMATION — TIMING  (all in milliseconds)
// ─────────────────────────────────────────────

/** How long it takes for icons to travel into the heart shape. */
const HEART_GATHER_DURATION = 4500;

/** How long the completed heart is held before dissolving.
 *  Set to 0 to skip holding entirely and jump straight to releasing. */
const HEART_HOLD_DURATION = 0;

/** How long it takes for icons to drift back to normal wind flow after the heart dissolves.
 *  Set to 0 to snap instantly back to wind — icons resume normal movement immediately. */
const HEART_RELEASE_DURATION = 100;

/** How long the icon burst (extra spawned icons) lasts after a platform is connected. */
const HEART_BURST_DURATION = 2000;

/** How many frames it takes for a released icon to ease back to its natural wind speed.
 *  Higher = longer gentle float before resuming full drift. ~60 frames = ~1 second. */
const WIND_RAMP_FRAMES = 40;

// ─────────────────────────────────────────────
//  HEART FORMATION — SPRING PHYSICS
// ─────────────────────────────────────────────

/** Starting spring stiffness at the beginning of the gather (t=0).
 *  Very low → icons barely move at first, like caught lazily by wind. */
const SPRING_K_START = 0.004;

/** Ending spring stiffness at the end of the gather (t=1).
 *  Higher → icons lock firmly into their heart slot near the finish. */
const SPRING_K_END = 0.032;

/** Starting velocity damping at t=0. Higher = more of the existing velocity is kept each frame,
 *  so icons carry their wind momentum longer. */
const SPRING_DAMP_START = 0.92;

/** Ending velocity damping at t=1. Lower = snappier, settles quicker into position. */
const SPRING_DAMP_END = 0.86;

/** Exponent for the offset-decay curve. Higher = offset holds longer at the start
 *  and collapses rapidly near the end. Controls how "late" the convergence feels. */
const OFFSET_DECAY_EXPONENT = 2.6;

// ─────────────────────────────────────────────
//  HEART DRIFT  (idle float while holding)
// ─────────────────────────────────────────────

/** Horizontal amplitude of the whole heart's gentle float while holding (px). */
const DRIFT_AMP_X = 4;

/** Vertical amplitude of the whole heart's gentle float while holding (px). */
const DRIFT_AMP_Y = 3;

/** Horizontal drift oscillation speed (rad/ms). Lower = slower sway. */
const DRIFT_FREQ_X = 0.0008;

/** Vertical drift oscillation speed (rad/ms). Slightly different from X for organic figure-eight motion. */
const DRIFT_FREQ_Y = 0.0012;

type HeartPhase = 'idle' | 'gathering' | 'holding' | 'releasing';

interface HeartState {
  phase: HeartPhase;
  startTime: number;
  cx: number;
  cy: number;
  gatherDuration: number;
  holdDuration: number;
  releaseDuration: number;
}

// Pure outline: N evenly spaced points on the heart perimeter
const generateHeartOffsets = (count: number, scale: number): { x: number; y: number }[] =>
  Array.from({ length: count }, (_, i) => {
    const t = (i / count) * Math.PI * 2;
    return {
      x:  16 * Math.pow(Math.sin(t), 3) * scale,
      y: -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * scale,
    };
  });

// Max pixel distance from heart center a particle can be and still join
const MAX_JOIN_DISTANCE = HEART_MAX_JOIN_DISTANCE;

const assignHeartSlots = (
  particles: Particle[],
  cx: number,
  cy: number,
  scale: number,
  minCount: number,
  maxCount: number,
) => {
  for (const p of particles) { p.inHeart = false; }

  const allByDist = [...particles]
    .map(p => ({ p, dist: Math.sqrt((p.x - cx) ** 2 + (p.y - cy) ** 2) }))
    .sort((a, b) => a.dist - b.dist);

  const withinRange = allByDist.filter(({ dist }) => dist <= MAX_JOIN_DISTANCE);
  const nearCount = Math.min(maxCount, withinRange.length);
  const needed = Math.max(nearCount, Math.min(minCount, allByDist.length));
  const chosen = allByDist.slice(0, needed).map(({ p }) => p);

  const actualCount = chosen.length;
  if (actualCount === 0) return;

  const offsets = generateHeartOffsets(actualCount, scale);

  const usedSlot = new Set<number>();
  for (const p of chosen) {
    let bestDist = Infinity;
    let bestIdx = -1;
    for (let j = 0; j < offsets.length; j++) {
      if (usedSlot.has(j)) continue;
      const tx = cx + offsets[j].x;
      const ty = cy + offsets[j].y;
      const d = (p.x - tx) ** 2 + (p.y - ty) ** 2;
      if (d < bestDist) { bestDist = d; bestIdx = j; }
    }
    if (bestIdx !== -1) {
      usedSlot.add(bestIdx);
      p.inHeart = true;
      p.heartOffsetX = offsets[bestIdx].x;
      p.heartOffsetY = offsets[bestIdx].y;
      p.heartArrivalDelay = 0;
      p.vx = p.speedX;
      p.vy = p.speedY;
      const offMag = HEART_WIND_OFFSET_MIN + Math.random() * (HEART_WIND_OFFSET_MAX - HEART_WIND_OFFSET_MIN);
      const offAngle = Math.random() * Math.PI * 2;
      p.windStartOffsetX = Math.cos(offAngle) * offMag;
      p.windStartOffsetY = Math.sin(offAngle) * offMag;
    }
  }
};

const densityHeartCenter = (
  particles: Particle[],
  w: number,
  h: number,
  heartScale: number,
): { cx: number; cy: number } => {
  const padX = Math.ceil(16 * heartScale) + 20;
  const padY = Math.ceil(17 * heartScale) + 20;

  const stripW = w * 0.28;
  const COLS_PER_STRIP = 3;
  const ROWS = 5;
  const RADIUS = 280;
  const candidates: { cx: number; cy: number; score: number }[] = [];

  for (let row = 0; row < ROWS; row++) {
    const cy = padY + (row / (ROWS - 1)) * (h - padY * 2);

    for (let col = 0; col < COLS_PER_STRIP; col++) {
      const cx = padX + (col / (COLS_PER_STRIP - 1)) * (stripW - padX * 2);
      if (cx < padX || cx > w - padX) continue;
      let score = 0;
      for (const p of particles) {
        if ((p.x - cx) ** 2 + (p.y - cy) ** 2 < RADIUS * RADIUS) score++;
      }
      candidates.push({ cx, cy, score });
    }

    for (let col = 0; col < COLS_PER_STRIP; col++) {
      const cx = (w - stripW) + padX + (col / (COLS_PER_STRIP - 1)) * (stripW - padX * 2);
      if (cx < padX || cx > w - padX) continue;
      let score = 0;
      for (const p of particles) {
        if ((p.x - cx) ** 2 + (p.y - cy) ** 2 < RADIUS * RADIUS) score++;
      }
      candidates.push({ cx, cy, score });
    }
  }

  candidates.sort((a, b) => b.score - a.score);
  const topN = Math.max(1, Math.floor(candidates.length * 0.35));
  const pick = candidates[Math.floor(Math.random() * topN)];

  const nudge = Math.min(w, h) * 0.04;
  const cx = Math.max(padX, Math.min(w - padX, pick.cx + (Math.random() - 0.5) * nudge));
  const cy = Math.max(padY, Math.min(h - padY, pick.cy + (Math.random() - 0.5) * nudge));
  return { cx, cy };
};

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/**
 * Release all heart particles back to wind — but keep their current velocity
 * so they ease back to wind speed naturally rather than snapping.
 * windRampT = 0 means "just released, blend from current velocity".
 */
const releaseToWind = (particles: Particle[], heart: HeartState) => {
  heart.phase = 'idle';
  for (const p of particles) {
    p.inHeart = false;
    p.windRampT = 0; // start the ramp from current velocity, not from wind speed
  }
};

const SocialsBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>();
  const sizeRef = useRef<{ cssW: number; cssH: number; dpr: number }>({ cssW: 0, cssH: 0, dpr: 1 });
  const mouseRef = useRef<{ x: number; y: number }>({ x: -9999, y: -9999 });

  const burstRef = useRef<{ active: boolean; platform: string | null; endTime: number; extrasSpawned: number }>({
    active: false, platform: null, endTime: 0, extrasSpawned: 0,
  });

  const heartRef = useRef<HeartState>({
    phase: 'idle', startTime: 0, cx: 0, cy: 0,
    gatherDuration: HEART_GATHER_DURATION,
    holdDuration: HEART_HOLD_DURATION,
    releaseDuration: HEART_RELEASE_DURATION,
  });

  const loadIcons = (): Promise<Record<string, HTMLImageElement>> =>
    Promise.all(
      ICON_PATHS.map(path =>
        new Promise<{ name: string; img: HTMLImageElement }>((resolve, reject) => {
          const img = new Image();
          img.src = path;
          img.onload = () => resolve({ name: path.split('/').pop()!.replace('.png', ''), img });
          img.onerror = reject;
        })
      )
    ).then(results => {
      const dict: Record<string, HTMLImageElement> = {};
      results.forEach(r => { dict[r.name] = r.img; });
      return dict;
    });

  const makeParticle = (img: HTMLImageElement, w: number, h: number, isExtra = false): Particle => {
    const z = 0.2 + Math.random() * 0.6;
    const size = SIZE_MIN + z * (SIZE_MAX - SIZE_MIN);
    let x, y;
    if (isExtra) {
      const fromTop = Math.random() < 0.5;
      x = fromTop ? Math.random() * w : -size * 2;
      y = fromTop ? -size * 2 : Math.random() * h;
    } else {
      const fromTop = Math.random() < 0.5;
      x = fromTop ? Math.random() * w : -Math.random() * w * 0.2;
      y = fromTop ? -Math.random() * h * 0.2 : Math.random() * h * 0.6;
    }
    const speedX = WIND * (0.9 + Math.random() * 0.3) + z * 0.2;
    const speedY = GRAVITY_MIN * (0.9 + Math.random() * 0.3) + z * 0.2;
    const baseRotationSpeed = (Math.random() - 0.5) * 0.02;
    return {
      x, y, vx: speedX, vy: speedY, z, size, speedX, speedY,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: baseRotationSpeed, baseRotationSpeed,
      opacity: OPACITY_MIN + z * (OPACITY_MAX - OPACITY_MIN),
      img,
      flutterPhase: Math.random() * Math.PI * 2,
      flutterSpeed: Math.random() * 0.02 + 0.01,
      swayXAmplitude: Math.random() * 1.5 + 0.5,
      swayYAmplitude: Math.random() * 0.5 + 0.2,
      isExtra, markedForDeletion: false,
      inHeart: false, heartOffsetX: 0, heartOffsetY: 0, heartArrivalDelay: 0,
      windStartOffsetX: 0, windStartOffsetY: 0,
      windRampT: 1, // 1 = already at full wind speed (normal state)
    };
  };

  const initParticles = (dict: Record<string, HTMLImageElement>, w: number, h: number) => {
    const imgs = Object.values(dict);
    particlesRef.current = Array.from({ length: COUNT }, () =>
      makeParticle(imgs[Math.floor(Math.random() * imgs.length)], w, h)
    );
  };

  const respawn = (p: Particle, dict: Record<string, HTMLImageElement>, w: number, h: number) => {
    const bc = burstRef.current;
    const imgs = bc.active && bc.platform && dict[bc.platform]
      ? [dict[bc.platform]] : Object.values(dict);
    Object.assign(p, makeParticle(imgs[Math.floor(Math.random() * imgs.length)], w, h));
  };

  const configureCanvas = () => {
    const canvas = canvasRef.current!;
    const ctx = ctxRef.current!;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const oldW = sizeRef.current.cssW || rect.width;
    const oldH = sizeRef.current.cssH || rect.height;
    const newW = Math.max(1, Math.round(rect.width * dpr));
    const newH = Math.max(1, Math.round(rect.height * dpr));
    if (canvas.width !== newW || canvas.height !== newH) {
      canvas.width = newW; canvas.height = newH;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    sizeRef.current = { cssW: rect.width, cssH: rect.height, dpr };
    const rx = rect.width / oldW, ry = rect.height / oldH;
    if (isFinite(rx) && isFinite(ry) && rx > 0 && ry > 0) {
      for (const p of particlesRef.current) { p.x *= rx; p.y *= ry; }
    }
  };

  const checkDpr = () => {
    if (Math.abs(sizeRef.current.dpr - (window.devicePixelRatio || 1)) > 0.001) configureCanvas();
  };

  const animate = (dict: Record<string, HTMLImageElement>) => {
    const ctx = ctxRef.current!;
    const { cssW: w, cssH: h } = sizeRef.current;
    const { x: mX, y: mY } = mouseRef.current;
    const now = Date.now();

    // Burst housekeeping
    if (burstRef.current.active && now > burstRef.current.endTime) {
      burstRef.current = { active: false, platform: null, endTime: 0, extrasSpawned: 0 };
    }
    const isBursting = burstRef.current.active;
    if (isBursting && burstRef.current.extrasSpawned < 40 && burstRef.current.platform && dict[burstRef.current.platform]) {
      if (Math.random() < 0.2) {
        burstRef.current.extrasSpawned++;
        particlesRef.current.push(makeParticle(dict[burstRef.current.platform!], w, h, true));
      }
    }

    // Heart state machine — skip zero-duration phases immediately
    const heart = heartRef.current;
    const phaseElapsed = now - heart.startTime;
    if (heart.phase === 'gathering' && phaseElapsed >= heart.gatherDuration) {
      if (heart.holdDuration <= 0) {
        if (heart.releaseDuration <= 0) {
          releaseToWind(particlesRef.current, heart);
        } else {
          heart.phase = 'releasing'; heart.startTime = now;
        }
      } else {
        heart.phase = 'holding'; heart.startTime = now;
      }
    } else if (heart.phase === 'holding' && phaseElapsed >= heart.holdDuration) {
      if (heart.releaseDuration <= 0) {
        releaseToWind(particlesRef.current, heart);
      } else {
        heart.phase = 'releasing'; heart.startTime = now;
      }
    } else if (heart.phase === 'releasing' && phaseElapsed >= heart.releaseDuration) {
      releaseToWind(particlesRef.current, heart);
    }

    const isForming = heart.phase !== 'idle';

    // Live heart center drift
    const driftX = isForming ? Math.sin(now * DRIFT_FREQ_X) * DRIFT_AMP_X : 0;
    const driftY = isForming ? Math.cos(now * DRIFT_FREQ_Y) * DRIFT_AMP_Y : 0;
    const heartCX = heart.cx + driftX;
    const heartCY = heart.cy + driftY;

    ctx.clearRect(0, 0, w, h);
    particlesRef.current.sort((a, b) => a.z - b.z);

    for (const p of particlesRef.current) {
      p.flutterPhase += isBursting ? p.flutterSpeed * 1.5 : p.flutterSpeed;

      if (isForming && p.inHeart) {
        // ── Heart particle ──
        const elapsed = now - heart.startTime;

        if (heart.phase === 'gathering') {
          const afterDelay = elapsed - p.heartArrivalDelay;

          if (afterDelay <= 0) {
            p.x += p.speedX + Math.cos(p.flutterPhase) * p.swayXAmplitude;
            p.y += p.speedY + Math.sin(p.flutterPhase) * p.swayYAmplitude;
            p.rotationSpeed = p.baseRotationSpeed;
          } else {
            const trueTargetX = heartCX + p.heartOffsetX;
            const trueTargetY = heartCY + p.heartOffsetY;

            const gatherT = Math.min(afterDelay / heart.gatherDuration, 1);
            const offsetDecay = Math.pow(1 - gatherT, OFFSET_DECAY_EXPONENT);
            const curTargetX = trueTargetX + p.windStartOffsetX * offsetDecay;
            const curTargetY = trueTargetY + p.windStartOffsetY * offsetDecay;

            const toX = curTargetX - p.x;
            const toY = curTargetY - p.y;

            const SPRING_K    = SPRING_K_START + gatherT * gatherT * (SPRING_K_END - SPRING_K_START);
            const SPRING_DAMP = SPRING_DAMP_START - gatherT * (SPRING_DAMP_START - SPRING_DAMP_END);
            p.vx = (p.vx + toX * SPRING_K) * SPRING_DAMP;
            p.vy = (p.vy + toY * SPRING_K) * SPRING_DAMP;

            const distToTrue = Math.sqrt(
              (trueTargetX - p.x) ** 2 + (trueTargetY - p.y) ** 2
            );
            const farness = Math.min(1, distToTrue / 60);
            p.vx += Math.cos(p.flutterPhase) * p.swayXAmplitude * 0.025 * farness;
            p.vy += Math.sin(p.flutterPhase) * p.swayYAmplitude * 0.025 * farness;

            p.x += p.vx;
            p.y += p.vy;

            const nearness = Math.max(0, 1 - distToTrue / 80);
            p.rotationSpeed = p.baseRotationSpeed * (1 - nearness * 0.88);
          }

        } else if (heart.phase === 'holding') {
          const targetX = heartCX + p.heartOffsetX;
          const targetY = heartCY + p.heartOffsetY;
          const swayX = Math.cos(p.flutterPhase * 0.6 + p.heartOffsetX * 0.1) * p.swayXAmplitude * 0.45;
          const swayY = Math.sin(p.flutterPhase * 0.5 + p.heartOffsetY * 0.1) * p.swayYAmplitude * 0.45;
          p.vx = (p.vx + (targetX + swayX - p.x) * 0.07) * 0.72;
          p.vy = (p.vy + (targetY + swayY - p.y) * 0.07) * 0.72;
          p.x += p.vx;
          p.y += p.vy;
          p.rotationSpeed = p.baseRotationSpeed * 0.18;

        } else if (heart.phase === 'releasing') {
          const t = easeInOutCubic(Math.min(phaseElapsed / heart.releaseDuration, 1));
          const swayX = Math.cos(p.flutterPhase) * p.swayXAmplitude;
          const swayY = Math.sin(p.flutterPhase) * p.swayYAmplitude;
          const targetVx = p.speedX + swayX;
          const targetVy = p.speedY + swayY;
          p.vx += (targetVx - p.vx) * t * 0.09;
          p.vy += (targetVy - p.vy) * t * 0.09;
          p.x += p.vx;
          p.y += p.vy;
          p.rotationSpeed = p.baseRotationSpeed * (0.18 + t * 0.82);
        }

        p.rotation += p.rotationSpeed;
        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.translate(p.x + p.size / 2, p.y + p.size / 2);
        ctx.rotate(p.rotation);
        ctx.drawImage(p.img, -p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();

      } else {
        // ── Normal wind particle ──
        const swayX = Math.cos(p.flutterPhase) * p.swayXAmplitude;
        const swayY = Math.sin(p.flutterPhase) * p.swayYAmplitude;
        const targetDx = p.speedX + swayX;
        const targetDy = p.speedY + swayY;

        // If this particle was just released from the heart, ramp its velocity
        // back to wind speed gradually so it doesn't snap to full speed instantly.
        let dx: number;
        let dy: number;
        if (p.windRampT < 1) {
          p.windRampT = Math.min(1, p.windRampT + 1 / WIND_RAMP_FRAMES);
          const ease = easeInOutCubic(p.windRampT);
          dx = p.vx + (targetDx - p.vx) * ease * 0.08;
          dy = p.vy + (targetDy - p.vy) * ease * 0.08;
        } else {
          dx = targetDx;
          dy = targetDy;
        }

        const pCx = p.x + p.size / 2;
        const pCy = p.y + p.size / 2;
        const distX = pCx - mX;
        const distY = pCy - mY;
        const dist = Math.sqrt(distX * distX + distY * distY);
        if (dist < INTERACTION_RADIUS && dist > 1) {
          const force = (INTERACTION_RADIUS - dist) / INTERACTION_RADIUS;
          const mag = force * REPULSION_FORCE * (p.z + 0.5);
          const normX = distX / dist;
          const normY = distY / dist;
          dx += normX * mag + (-normY) * mag * SWIRL_FORCE * 2.5;
          dy += normY * mag + normX * mag * SWIRL_FORCE * 2.5;
          p.rotationSpeed = p.baseRotationSpeed * 5;
        } else {
          p.rotationSpeed = p.baseRotationSpeed + Math.sin(p.flutterPhase) * 0.01;
        }

        p.x += dx; p.y += dy;
        p.vx = dx; p.vy = dy;
        p.rotation += p.rotationSpeed;

        if (p.y > h + p.size || p.x > w + p.size) {
          if (p.isExtra && !isBursting) p.markedForDeletion = true;
          else respawn(p, dict, w, h);
        }

        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.translate(p.x + p.size / 2, p.y + p.size / 2);
        ctx.rotate(p.rotation);
        ctx.drawImage(p.img, -p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      }
    }

    particlesRef.current = particlesRef.current.filter(p => !p.markedForDeletion);
    checkDpr();
    rafRef.current = requestAnimationFrame(() => animate(dict));
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;
    ctxRef.current = ctx;

    let mounted = true;
    let ro: ResizeObserver | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const handleMouseLeave = () => { mouseRef.current = { x: -9999, y: -9999 }; };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseLeave);

    const handlePlatformConnected = (e: Event) => {
      const { platform } = (e as CustomEvent<{ platform: string }>).detail;
      burstRef.current = { active: true, platform, endTime: Date.now() + HEART_BURST_DURATION, extrasSpawned: 0 };

      const { cssW: w, cssH: h } = sizeRef.current;
      const scale = Math.min(w, h) * HEART_SCALE_FACTOR;
      const { cx, cy } = densityHeartCenter(particlesRef.current, w, h, scale);
      assignHeartSlots(particlesRef.current, cx, cy, scale, HEART_MIN_PARTICLE_COUNT, HEART_PARTICLE_COUNT);

      heartRef.current = {
        phase: 'gathering', startTime: Date.now(), cx, cy,
        gatherDuration: HEART_GATHER_DURATION,
        holdDuration: HEART_HOLD_DURATION,
        releaseDuration: HEART_RELEASE_DURATION,
      };
    };

    window.addEventListener('ezp:platformConnected', handlePlatformConnected);

    loadIcons()
      .then(dict => {
        if (!mounted) return;
        configureCanvas();
        initParticles(dict, sizeRef.current.cssW, sizeRef.current.cssH);
        animate(dict);
        ro = new ResizeObserver(() => configureCanvas());
        ro.observe(canvas);
        if (typeof window.visualViewport !== 'undefined' && window.visualViewport !== null)
          window.visualViewport.addEventListener('resize', configureCanvas);
        window.addEventListener('resize', configureCanvas);
        window.addEventListener('orientationchange', configureCanvas);
      })
      .catch(e => console.error('Failed to load social icons:', e));

    return () => {
      mounted = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (ro) ro.disconnect();
      window.removeEventListener('resize', configureCanvas);
      window.removeEventListener('orientationchange', configureCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseLeave);
      window.removeEventListener('ezp:platformConnected', handlePlatformConnected);
      if (typeof window.visualViewport !== 'undefined' && window.visualViewport !== null)
        window.visualViewport.removeEventListener('resize', configureCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        display: 'block', zIndex: 0, pointerEvents: 'none',
      }}
    />
  );
};

export default React.memo(SocialsBackground);