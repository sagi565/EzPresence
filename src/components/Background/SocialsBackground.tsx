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

  inHeart: boolean;
  heartOffsetX: number;
  heartOffsetY: number;
  heartArrivalDelay: number;
  windStartOffsetX: number;
  windStartOffsetY: number;
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

const COUNT = 15;
const CONNECTING_EXTRA = 60;
const CONNECTING_SPAWN_RATE = 0.45;

const WIND         = 1.5;
const GRAVITY_MIN  = 1;
const BASE_SIZE_MIN = 13;
const BASE_SIZE_MAX = 30;
const OPACITY_MIN  = 0.10;
const OPACITY_MAX  = 0.30;

// ─────────────────────────────────────────────
//  MOUSE INTERACTION
// ─────────────────────────────────────────────

const INTERACTION_RADIUS = 70;
const REPULSION_FORCE    = 1;
const SWIRL_FORCE        = 0.2;

// ─────────────────────────────────────────────
//  SHAPE FORMATION
// ─────────────────────────────────────────────

const SHAPE_PARTICLE_COUNT     = 90; // Increased slightly for better definition
const SHAPE_SCALE_FACTOR       = 0.013;
const SHAPE_MAX_JOIN_DISTANCE  = 800;
const SHAPE_WIND_OFFSET_MIN    = 15;
const SHAPE_WIND_OFFSET_MAX    = 80;

const SHAPE_GATHER_DURATION  = 6500; // Decreased from 7000 for a much quicker formation
const SHAPE_HOLD_DURATION    = 0;
const SHAPE_RELEASE_DURATION = 1000;
const BURST_DURATION         = 2000;
const WIND_RAMP_FRAMES       = 40;

const SPRING_K_START    = 0.002;
const SPRING_K_END      = 0.0017;
const SPRING_DAMP_START = 0.92;
const SPRING_DAMP_END   = 0.86;
const OFFSET_DECAY_EXP  = 2.6;

const DRIFT_AMP_X  = 4;
const DRIFT_AMP_Y  = 3;
const DRIFT_FREQ_X = 0.0008;
const DRIFT_FREQ_Y = 0.0012;

type ShapePhase = 'idle' | 'gathering' | 'holding' | 'releasing';

interface ShapeState {
  phase: ShapePhase;
  startTime: number;
  cx: number;
  cy: number;
  gatherDuration: number;
  holdDuration: number;
  releaseDuration: number;
  platform: string;
}

// ─────────────────────────────────────────────
//  SVG PATHS FOR PERFECT SHAPES
// ─────────────────────────────────────────────

type Vec2 = { x: number; y: number };

const PATHS: Record<string, string> = {
  facebook: "M65,10 h15 v20 h-15 c-5.5,0 -10,4.5 -10,10 v10 h25 l-5,20 h-20 v40 h-25 v-40 h-15 v-20 h15 v-10 c0,-16.5 13.5,-30 30,-30 z",
  instagram: "M30,10 h40 c11,0 20,9 20,20 v40 c0,11 -9,20 -20,20 h-40 c-11,0 -20,-9 -20,-20 v-40 c0,-11 9,-20 20,-20 z M50,30 a20,20 0 1,1 0,40 a20,20 0 1,1 0,-40 z M75,20 a4,4 0 1,1 0,8 a4,4 0 1,1 0,-8 z",
  tiktok: "M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z",
  youtube: "M20,20 h60 c11,0 20,9 20,20 v20 c0,11 -9,20 -20,20 h-60 c-11,0 -20,-9 -20,-20 v-20 c0,-11 9,-20 20,-20 z M40,35 l25,15 l-25,15 z",
};

function heartOutline(count: number, scale: number): Vec2[] {
  return Array.from({ length: count }, (_, i) => {
    const t = (i / count) * Math.PI * 2;
    return {
      x:  16 * Math.pow(Math.sin(t), 3) * scale,
      y: -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * scale,
    };
  });
}

function generateShapeOffsets(platform: string, count: number, scale: number): Vec2[] {
  const px = scale * 16;
  
  if (!PATHS[platform]) return heartOutline(count, scale);

  const svgNS = "http://www.w3.org/2000/svg";
  const pathElem = document.createElementNS(svgNS, "path");
  pathElem.setAttribute("d", PATHS[platform]);
  
  const len = pathElem.getTotalLength();
  const rawPts: Vec2[] = [];
  
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;

  // Sample points exactly along the vector path
  for (let i = 0; i < count; i++) {
    const p = pathElem.getPointAtLength((i / count) * len);
    rawPts.push({ x: p.x, y: p.y });
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  }

  // Normalize points relative to center, then scale to canvas pixels
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  const maxDim = Math.max(maxX - minX, maxY - minY) / 2;

  return rawPts.map(p => ({
    x: ((p.x - cx) / maxDim) * px,
    y: ((p.y - cy) / maxDim) * px,
  }));
}

// ─────────────────────────────────────────────
//  SLOT ASSIGNMENT WITH GUARANTEED FILL
// ─────────────────────────────────────────────

const WIND_GATE_X_STRICT   =   0;
const WIND_GATE_Y_STRICT   =  40;
const WIND_GATE_X_FALLBACK =  60;
const WIND_GATE_Y_FALLBACK = 140;

const assignShapeSlots = (
  particles: Particle[],
  cx: number, cy: number, scale: number, targetCount: number, platform: string,
  dict: Record<string, HTMLImageElement>, w: number, h: number,
  makeParticle: (img: HTMLImageElement, w: number, h: number, isExtra?: boolean) => Particle
) => {
  for (const p of particles) p.inHeart = false;

  const offsets = generateShapeOffsets(platform, targetCount, scale);
  const slotWorld = offsets.map(o => ({ x: cx + o.x, y: cy + o.y }));

  const usedParticle = new Set<Particle>();
  const usedSlot     = new Set<number>();
  const assignments: Array<{ p: Particle; slotIdx: number }> = [];

  // Pass Helper
  const runPass = (gateX: number, gateY: number) => {
    for (let j = 0; j < slotWorld.length; j++) {
      if (usedSlot.has(j)) continue;
      const sx = slotWorld[j].x, sy = slotWorld[j].y;
      let bestDist = Infinity, bestP: Particle | null = null;
      for (const p of particles) {
        if (usedParticle.has(p)) continue;
        const dx = sx - p.x;
        const dy = sy - p.y;
        if (dx < -gateX || dy < -gateY) continue; 
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < SHAPE_MAX_JOIN_DISTANCE && dist < bestDist) { bestDist = dist; bestP = p; }
      }
      if (bestP) {
        usedSlot.add(j);
        usedParticle.add(bestP);
        assignments.push({ p: bestP, slotIdx: j });
      }
    }
  };

  // 1. Strict wind-friendly pass
  runPass(WIND_GATE_X_STRICT, WIND_GATE_Y_STRICT);
  // 2. Fallback looser wind pass
  runPass(WIND_GATE_X_FALLBACK, WIND_GATE_Y_FALLBACK);

  // 3. Force-fill pass: Take ANY available particle for remaining slots
  for (let j = 0; j < slotWorld.length; j++) {
    if (usedSlot.has(j)) continue;
    let fallbackP = particles.find(p => !usedParticle.has(p));
    
    // 4. Guarantee fill: If completely out of particles, spawn a new one upstream!
    if (!fallbackP) {
      const imgValues = Object.values(dict);
      const randomImg = imgValues[Math.floor(Math.random() * imgValues.length)];
      fallbackP = makeParticle(randomImg, w, h, true);
      // Spawn slightly upstream so it drifts in naturally
      fallbackP.x = cx - 300 - Math.random() * 200;
      fallbackP.y = cy - 200 - Math.random() * 200;
      particles.push(fallbackP);
    }

    usedSlot.add(j);
    usedParticle.add(fallbackP);
    assignments.push({ p: fallbackP, slotIdx: j });
  }

  // Apply properties to assigned particles
  for (const { p, slotIdx } of assignments) {
    p.inHeart           = true;
    p.heartOffsetX      = offsets[slotIdx].x;
    p.heartOffsetY      = offsets[slotIdx].y;
    // Stagger their arrival delays heavily for an organic feel
    p.heartArrivalDelay = Math.random() * 1500; 
    p.vx                = p.speedX;
    p.vy                = p.speedY;
    
    const mag   = SHAPE_WIND_OFFSET_MIN + Math.random() * (SHAPE_WIND_OFFSET_MAX - SHAPE_WIND_OFFSET_MIN);
    const angle = (Math.random() - 0.5) * Math.PI * 0.5;
    p.windStartOffsetX  = -Math.abs(Math.cos(angle)) * mag;
    p.windStartOffsetY  = -Math.abs(Math.sin(angle)) * mag * 0.4;
  }
};

const randomShapeCenter = (w: number, h: number, scale: number) => {
  // Increased padding so the shape doesn't clip off the edges of the screen
  const padX = scale * 16 + 80; 
  const padY = scale * 16 + 80;

  // 50% chance to pick the left side, 50% chance for the right side
  const isLeft = Math.random() < 0.5;
  
  // Defines the tighter boundaries (Left: 0% to 20% of width, Right: 80% to 100% of width)
  const minX = isLeft ? padX : w * 0.80;
  const maxX = isLeft ? w * 0.20 : w - padX;

  // Fallback for smaller screens to prevent negative/flipped math
  const safeMinX = Math.min(minX, maxX);
  const safeMaxX = Math.max(minX, maxX);

  // Pick random coordinates within the new, tighter vertical columns
  const cx = safeMinX + Math.random() * (safeMaxX - safeMinX);
  const cy = padY + Math.random() * (h - padY * 2);

  return { cx, cy };
};
const easeInOutCubic = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

const releaseToWind = (particles: Particle[], shape: ShapeState) => {
  shape.phase = 'idle';
  for (const p of particles) { p.inHeart = false; p.windRampT = 0; }
};

const SocialsBackground: React.FC = () => {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const ctxRef       = useRef<CanvasRenderingContext2D | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef       = useRef<number>();
  const sizeRef      = useRef<{ cssW: number; cssH: number; dpr: number }>({ cssW: 0, cssH: 0, dpr: 1 });
  const mouseRef     = useRef<{ x: number; y: number }>({ x: -9999, y: -9999 });

  const burstRef = useRef<{ active: boolean; platform: string | null; endTime: number; extrasSpawned: number }>({
    active: false, platform: null, endTime: 0, extrasSpawned: 0,
  });
  const connectingPlatformsRef = useRef<Set<string>>(new Set());

  const shapeRef = useRef<ShapeState>({
    phase: 'idle', startTime: 0, cx: 0, cy: 0,
    gatherDuration: SHAPE_GATHER_DURATION, holdDuration: SHAPE_HOLD_DURATION, releaseDuration: SHAPE_RELEASE_DURATION, platform: 'heart',
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
    ).then(results => results.reduce((acc, r) => ({ ...acc, [r.name]: r.img }), {}));

  const makeParticle = (img: HTMLImageElement, w: number, h: number, isExtra = false): Particle => {
    const z = 0.2 + Math.random() * 0.6;
    const sf = Math.max(0.6, Math.min(1.2, Math.min(w, h) / 1000));
    const size = (BASE_SIZE_MIN + z * (BASE_SIZE_MAX - BASE_SIZE_MIN)) * sf;
    
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
    const baseRot = (Math.random() - 0.5) * 0.02;

    return {
      x, y, vx: speedX, vy: speedY, z, size, speedX, speedY,
      rotation: Math.random() * Math.PI * 2, rotationSpeed: baseRot, baseRotationSpeed: baseRot,
      opacity: OPACITY_MIN + z * (OPACITY_MAX - OPACITY_MIN), img,
      flutterPhase: Math.random() * Math.PI * 2, flutterSpeed: Math.random() * 0.02 + 0.01,
      swayXAmplitude: Math.random() * 1.5 + 0.5, swayYAmplitude: Math.random() * 0.5 + 0.2,
      isExtra, markedForDeletion: false,
      inHeart: false, heartOffsetX: 0, heartOffsetY: 0, heartArrivalDelay: 0, windStartOffsetX: 0, windStartOffsetY: 0, windRampT: 1,
    };
  };

  const initParticles = (dict: Record<string, HTMLImageElement>, w: number, h: number) => {
    const imgs = Object.values(dict);
    particlesRef.current = Array.from({ length: COUNT }, () => makeParticle(imgs[Math.floor(Math.random() * imgs.length)], w, h));
  };

  const respawn = (p: Particle, dict: Record<string, HTMLImageElement>, w: number, h: number) => {
    const bc = burstRef.current;
    const imgs = bc.active && bc.platform && dict[bc.platform] ? [dict[bc.platform]] : Object.values(dict);
    Object.assign(p, makeParticle(imgs[Math.floor(Math.random() * imgs.length)], w, h));
  };

  const configureCanvas = () => {
    const canvas = canvasRef.current!;
    const ctx = ctxRef.current!;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const newW = Math.max(1, Math.round(rect.width * dpr)), newH = Math.max(1, Math.round(rect.height * dpr));
    
    if (canvas.width !== newW || canvas.height !== newH) { canvas.width = newW; canvas.height = newH; }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    
    const rx = rect.width / (sizeRef.current.cssW || rect.width), ry = rect.height / (sizeRef.current.cssH || rect.height);
    sizeRef.current = { cssW: rect.width, cssH: rect.height, dpr };
    
    if (isFinite(rx) && rx > 0) {
      const sf = Math.max(0.6, Math.min(1.2, Math.min(rect.width, rect.height) / 1000));
      for (const p of particlesRef.current) {
        p.x *= rx; p.y *= ry;
        p.size = (BASE_SIZE_MIN + p.z * (BASE_SIZE_MAX - BASE_SIZE_MIN)) * sf;
      }
    }
  };

  const animate = (dict: Record<string, HTMLImageElement>) => {
    const ctx = ctxRef.current!;
    const { cssW: w, cssH: h } = sizeRef.current;
    const { x: mX, y: mY } = mouseRef.current;
    const now = Date.now();

    if (burstRef.current.active && now > burstRef.current.endTime) burstRef.current = { active: false, platform: null, endTime: 0, extrasSpawned: 0 };
    const isBursting = burstRef.current.active, isConnecting = connectingPlatformsRef.current.size > 0;

    if (isConnecting && w >= 768) {
      const list = Array.from(connectingPlatformsRef.current);
      if (particlesRef.current.length < COUNT + CONNECTING_EXTRA * list.length && Math.random() < CONNECTING_SPAWN_RATE) {
        const platform = list[Math.floor(Math.random() * list.length)];
        particlesRef.current.push(makeParticle(dict[platform] ?? Object.values(dict)[0], w, h, true));
      }
    }

    if (isBursting && burstRef.current.extrasSpawned < 40 && burstRef.current.platform && dict[burstRef.current.platform]) {
      if (Math.random() < 0.2) {
        burstRef.current.extrasSpawned++;
        particlesRef.current.push(makeParticle(dict[burstRef.current.platform!], w, h, true));
      }
    }

    const shape = shapeRef.current;
    const phaseElapsed = now - shape.startTime;
    
    if (shape.phase === 'gathering' && phaseElapsed >= shape.gatherDuration) {
      shape.holdDuration <= 0 ? (shape.releaseDuration <= 0 ? releaseToWind(particlesRef.current, shape) : (shape.phase = 'releasing', shape.startTime = now)) : (shape.phase = 'holding', shape.startTime = now);
    } else if (shape.phase === 'holding' && phaseElapsed >= shape.holdDuration) {
      shape.releaseDuration <= 0 ? releaseToWind(particlesRef.current, shape) : (shape.phase = 'releasing', shape.startTime = now);
    } else if (shape.phase === 'releasing' && phaseElapsed >= shape.releaseDuration) {
      releaseToWind(particlesRef.current, shape);
    }

    const isForming = shape.phase !== 'idle';
    const shapeCX = shape.cx + (isForming ? Math.sin(now * DRIFT_FREQ_X) * DRIFT_AMP_X : 0);
    const shapeCY = shape.cy + (isForming ? Math.cos(now * DRIFT_FREQ_Y) * DRIFT_AMP_Y : 0);

    ctx.clearRect(0, 0, w, h);
    particlesRef.current.sort((a, b) => a.z - b.z);

    for (const p of particlesRef.current) {
      p.flutterPhase += isBursting ? p.flutterSpeed * 1.5 : p.flutterSpeed;

      if (isForming && p.inHeart) {
        const elapsed = now - shape.startTime;

        if (shape.phase === 'gathering') {
          const afterDelay = elapsed - p.heartArrivalDelay;
          
          if (afterDelay <= 0) {
            // Wait for delay to pass
            p.x += p.speedX + Math.cos(p.flutterPhase) * p.swayXAmplitude;
            p.y += p.speedY + Math.sin(p.flutterPhase) * p.swayYAmplitude;
          } else {
            const trueX = shapeCX + p.heartOffsetX;
            const trueY = shapeCY + p.heartOffsetY;
            const gatherT = Math.min(afterDelay / shape.gatherDuration, 1);
            const decay = Math.pow(1 - gatherT, OFFSET_DECAY_EXP);
            
            const toX = (trueX + p.windStartOffsetX * decay) - p.x;
            const toY = (trueY + p.windStartOffsetY * decay) - p.y;
            
            // Slightly softer spring for a more relaxed pull
            const K = (SPRING_K_START * 0.8) + gatherT * gatherT * (SPRING_K_END - SPRING_K_START);
            const damp = SPRING_DAMP_START - gatherT * (SPRING_DAMP_START - SPRING_DAMP_END);
            
            const distToTrue = Math.sqrt(toX * toX + toY * toY);
            
            // 1 & 2: WEAKER, ASYMMETRIC SWIRL
            // Use the particle's inherent rotation to randomly flip the swirl direction (left vs right curl)
            const swirlDir = p.baseRotationSpeed > 0 ? 1 : -1;
            // Greatly reduced the strength and made it scale based on the particle's depth (p.z)
            const swirlStr = Math.max(0, distToTrue / 250); 
            const swirlIntensity = 0.035 * (p.z + 0.5); 
            
            const swirlX = -toY * swirlStr * swirlIntensity * swirlDir;
            const swirlY = toX * swirlStr * swirlIntensity * swirlDir;

            p.vx = (p.vx + (toX + swirlX) * K) * damp;
            p.vy = (p.vy + (toY + swirlY) * K) * damp;
            
            // 3: TURBULENT NOISE
            const farness = Math.min(1, distToTrue / 60);
            // Injecting Date.now() (the 'now' variable) creates a continuous wobbly wind effect
            const noiseX = Math.cos(p.flutterPhase + now * 0.002) * p.swayXAmplitude * 0.12 * farness;
            const noiseY = Math.sin(p.flutterPhase + now * 0.003) * p.swayYAmplitude * 0.12 * farness;
            
            p.vx += noiseX;
            p.vy += noiseY;
            
            p.x += p.vx;
            p.y += p.vy;
            p.rotationSpeed = p.baseRotationSpeed * (1 - Math.max(0, 1 - distToTrue / 80) * 0.88);
          }
        } else if (shape.phase === 'holding') {
          const swayX = Math.cos(p.flutterPhase * 0.6 + p.heartOffsetX * 0.1) * p.swayXAmplitude * 0.45;
          const swayY = Math.sin(p.flutterPhase * 0.5 + p.heartOffsetY * 0.1) * p.swayYAmplitude * 0.45;
          p.vx = (p.vx + (shapeCX + p.heartOffsetX + swayX - p.x) * 0.07) * 0.72;
          p.vy = (p.vy + (shapeCY + p.heartOffsetY + swayY - p.y) * 0.07) * 0.72;
          p.x += p.vx; p.y += p.vy;
          p.rotationSpeed = p.baseRotationSpeed * 0.18;

        } else if (shape.phase === 'releasing') {
          const t = easeInOutCubic(Math.min(phaseElapsed / shape.releaseDuration, 1));
          p.vx += (p.speedX + Math.cos(p.flutterPhase) * p.swayXAmplitude - p.vx) * t * 0.09;
          p.vy += (p.speedY + Math.sin(p.flutterPhase) * p.swayYAmplitude - p.vy) * t * 0.09;
          p.x += p.vx; p.y += p.vy;
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
        const targetDx = p.speedX + Math.cos(p.flutterPhase) * p.swayXAmplitude;
        const targetDy = p.speedY + Math.sin(p.flutterPhase) * p.swayYAmplitude;

        let dx, dy;
        if (p.windRampT < 1) {
          p.windRampT = Math.min(1, p.windRampT + 1 / WIND_RAMP_FRAMES);
          const ease = easeInOutCubic(p.windRampT);
          dx = p.vx + (targetDx - p.vx) * ease * 0.08;
          dy = p.vy + (targetDy - p.vy) * ease * 0.08;
        } else {
          dx = targetDx; dy = targetDy;
        }

        const dX = p.x + p.size / 2 - mX, dY = p.y + p.size / 2 - mY;
        const dist = Math.sqrt(dX * dX + dY * dY);
        if (dist < INTERACTION_RADIUS && dist > 1) {
          const mag = ((INTERACTION_RADIUS - dist) / INTERACTION_RADIUS) * REPULSION_FORCE * (p.z + 0.5);
          dx += (dX / dist) * mag + (-dY / dist) * mag * SWIRL_FORCE * 2.5;
          dy += (dY / dist) * mag + (dX / dist) * mag * SWIRL_FORCE * 2.5;
          p.rotationSpeed = p.baseRotationSpeed * 5;
        } else {
          p.rotationSpeed = p.baseRotationSpeed + Math.sin(p.flutterPhase) * 0.01;
        }

        p.x += dx; p.y += dy;
        p.vx = dx; p.vy = dy;
        p.rotation += p.rotationSpeed;

        if (p.y > h + p.size || p.x > w + p.size) {
          if (p.isExtra && !isBursting && !isConnecting) p.markedForDeletion = true;
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
    if (Math.abs(sizeRef.current.dpr - (window.devicePixelRatio || 1)) > 0.001) configureCanvas();
    rafRef.current = requestAnimationFrame(() => animate(dict));
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;
    ctxRef.current = ctx;

    let mounted = true, ro: ResizeObserver | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const handleMouseLeave = () => { mouseRef.current = { x: -9999, y: -9999 }; };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout',  handleMouseLeave);

    const handlePlatformConnecting = (e: Event) => connectingPlatformsRef.current.add((e as CustomEvent).detail.platform);
    const handlePlatformConnectionFinished = (e: Event) => connectingPlatformsRef.current.delete((e as CustomEvent).detail.platform);
    
    const handlePlatformConnected = (e: Event) => {
      const { platform } = (e as CustomEvent<{ platform: string }>).detail;
      connectingPlatformsRef.current.delete(platform);
      burstRef.current = { active: true, platform, endTime: Date.now() + BURST_DURATION, extrasSpawned: 0 };

      const { cssW: w, cssH: h } = sizeRef.current;
      if (w < 768) return;

      const scale = Math.min(w, h) * SHAPE_SCALE_FACTOR;
      const { cx, cy } = randomShapeCenter(w, h, scale);          
      // Pass dict and makeParticle downward so missing particles can be spawned if needed
      loadIcons().then(dict => {
        assignShapeSlots(particlesRef.current, cx, cy, scale, SHAPE_PARTICLE_COUNT, platform, dict, w, h, makeParticle);
        shapeRef.current = { phase: 'gathering', startTime: Date.now(), cx, cy, gatherDuration: SHAPE_GATHER_DURATION, holdDuration: SHAPE_HOLD_DURATION, releaseDuration: SHAPE_RELEASE_DURATION, platform };
      });
    };

    window.addEventListener('ezp:platformConnecting', handlePlatformConnecting);
    window.addEventListener('ezp:platformConnectionFinished', handlePlatformConnectionFinished);
    window.addEventListener('ezp:platformConnected', handlePlatformConnected);

    loadIcons().then(dict => {
      if (!mounted) return;
      configureCanvas();
      initParticles(dict, sizeRef.current.cssW, sizeRef.current.cssH);
      animate(dict);
      ro = new ResizeObserver(() => configureCanvas());
      ro.observe(canvas);
      window.addEventListener('resize', configureCanvas);
    });

    return () => {
      mounted = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (ro) ro.disconnect();
      window.removeEventListener('resize', configureCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseLeave);
      window.removeEventListener('ezp:platformConnecting', handlePlatformConnecting);
      window.removeEventListener('ezp:platformConnectionFinished', handlePlatformConnectionFinished);
      window.removeEventListener('ezp:platformConnected', handlePlatformConnected);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block', zIndex: 0, pointerEvents: 'none' }} />;
};

export default React.memo(SocialsBackground);