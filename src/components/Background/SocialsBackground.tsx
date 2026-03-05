import React, { useRef, useEffect } from 'react';

interface Particle {
  x: number;
  y: number;
  z: number;
  size: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  img: HTMLImageElement;
  flutterPhase: number;
  flutterSpeed: number;
  flutterAmplitude: number;
  swayXAmplitude: number;
  swayYAmplitude: number;
  isExtra?: boolean;
  markedForDeletion?: boolean;
  baseRotationSpeed: number;
}

const ICON_PATHS = [
  '/icons/social/youtube.png',
  '/icons/social/facebook.png',
  '/icons/social/tiktok.png',
  '/icons/social/instagram.png',
];

// Tuned parameter (slightly faster wind for realism)
const COUNT = 30;
const WIND = 1.5  ; // Faster wind to cross screen sooner
const GRAVITY_MIN = 1; // Stronger drift down
const SIZE_MIN = 14;
const SIZE_MAX = 32;
const OPACITY_MIN = 0.10; // slightly more visible
const OPACITY_MAX = 0.30;

// Interaction settings
const INTERACTION_RADIUS = 70;
const REPULSION_FORCE = 1;
const SWIRL_FORCE = 0.2;

const SocialsBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>();
  const sizeRef = useRef<{ cssW: number; cssH: number; dpr: number }>({
    cssW: 0,
    cssH: 0,
    dpr: 1,
  });

  // Track mouse position
  const mouseRef = useRef<{ x: number; y: number }>({ x: -9999, y: -9999 });

  // Burst configuration
  const BURST_DURATION = 8000;
  const burstRef = useRef<{ active: boolean; platform: string | null; endTime: number; extrasSpawned: boolean }>({
    active: false,
    platform: null,
    endTime: 0,
    extrasSpawned: false,
  });

  const loadIcons = (): Promise<Record<string, HTMLImageElement>> =>
    Promise.all(
      ICON_PATHS.map(
        (path) =>
          new Promise<{ name: string; img: HTMLImageElement }>((resolve, reject) => {
            const img = new Image();
            img.src = path;
            img.onload = () => {
              const name = path.split('/').pop()?.replace('.png', '') || '';
              resolve({ name, img });
            };
            img.onerror = reject;
          })
      )
    ).then((results) => {
      const dict: Record<string, HTMLImageElement> = {};
      results.forEach((r) => { dict[r.name] = r.img; });
      return dict;
    });

  const makeParticle = (img: HTMLImageElement, w: number, h: number, isExtra = false): Particle => {
    const z = 0.2 + Math.random() * 0.6;
    const size = SIZE_MIN + z * (SIZE_MAX - SIZE_MIN);

    // Spawn from top or left to move bottom-right
    let x, y;
    if (isExtra) {
      // Spawn OFF-SCREEN so they drift into view
      const fromTop = Math.random() < 0.5;
      x = fromTop ? Math.random() * w : -size * 2;
      y = fromTop ? -size * 2 : Math.random() * h;
    } else {
      const fromTop = Math.random() < 0.5;
      x = fromTop ? Math.random() * w : -Math.random() * w * 0.2;
      y = fromTop ? -Math.random() * h * 0.2 : Math.random() * h * 0.6;
    }

    // Consistent wind speeds (+- 10-20%)
    const speedY = GRAVITY_MIN * (0.9 + Math.random() * 0.3) + z * 0.2;
    const speedX = WIND * (0.9 + Math.random() * 0.3) + z * 0.2;

    const rotation = Math.random() * Math.PI * 2;
    const baseRotationSpeed = (Math.random() - 0.5) * 0.04; // slightly faster base spin
    const rotationSpeed = baseRotationSpeed;
    const opacity = OPACITY_MIN + z * (OPACITY_MAX - OPACITY_MIN);

    const flutterPhase = Math.random() * Math.PI * 2;
    const flutterSpeed = Math.random() * 0.04 + 0.02; // Uneven flutter speed
    const flutterAmplitude = 0;

    // Much smaller ellipses, consistent across all particles
    const swayXAmplitude = Math.random() * 3 + 1; // 1 to 4 px
    const swayYAmplitude = Math.random() * 1.5 + 0.5; // 0.5 to 2 px

    return {
      x, y, z, size,
      speedY, speedX, rotation, rotationSpeed, opacity,
      img, flutterPhase, flutterSpeed, flutterAmplitude,
      swayXAmplitude, swayYAmplitude,
      isExtra, markedForDeletion: false,
      baseRotationSpeed
    };
  };

  const initParticles = (dict: Record<string, HTMLImageElement>, w: number, h: number) => {
    const arr: Particle[] = [];
    const imgs = Object.values(dict);
    for (let i = 0; i < COUNT; i++) {
      const img = imgs[Math.floor(Math.random() * imgs.length)];
      arr.push(makeParticle(img, w, h));
    }
    particlesRef.current = arr;
  };

  const respawn = (p: Particle, dict: Record<string, HTMLImageElement>, w: number, h: number) => {
    const burstContext = burstRef.current;
    let img: HTMLImageElement;
    if (burstContext.active && burstContext.platform && dict[burstContext.platform]) {
      img = dict[burstContext.platform];
    } else {
      const imgs = Object.values(dict);
      img = imgs[Math.floor(Math.random() * imgs.length)];
    }
    const np = makeParticle(img, w, h);
    // mutate in place to avoid churn
    Object.assign(p, np);
  };

  // --- 📌 CRITICAL: pixel-perfect canvas sizing without distortion ---
  const configureCanvas = () => {
    const canvas = canvasRef.current!;
    const ctx = ctxRef.current!;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    const oldW = sizeRef.current.cssW || rect.width;
    const oldH = sizeRef.current.cssH || rect.height;

    // Set internal resolution to physical pixels
    const newWidth = Math.max(1, Math.round(rect.width * dpr));
    const newHeight = Math.max(1, Math.round(rect.height * dpr));
    if (canvas.width !== newWidth || canvas.height !== newHeight) {
      canvas.width = newWidth;
      canvas.height = newHeight;
    }

    // Map 1 CSS pixel to `dpr` device pixels (no cumulative scaling)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Update ref sizes in CSS pixels
    sizeRef.current = { cssW: rect.width, cssH: rect.height, dpr };

    // Reflow particles proportionally so new regions aren’t empty/distorted
    const ratioX = rect.width / oldW;
    const ratioY = rect.height / oldH;
    if (isFinite(ratioX) && isFinite(ratioY) && ratioX > 0 && ratioY > 0) {
      for (const p of particlesRef.current) {
        p.x *= ratioX;
        p.y *= ratioY;
      }
    }
  };

  // We also guard against DPR changes during animation (zoom)
  const checkDprAndResizeIfNeeded = () => {
    const current = sizeRef.current.dpr;
    const actual = window.devicePixelRatio || 1;
    // Tiny epsilon to avoid oscillation on fractional DPRs
    if (Math.abs(current - actual) > 0.001) {
      configureCanvas();
    }
  };

  const animate = (dict: Record<string, HTMLImageElement>) => {
    const ctx = ctxRef.current!;
    const { cssW: w, cssH: h } = sizeRef.current;
    const { x: mX, y: mY } = mouseRef.current;

    const now = Date.now();
    if (burstRef.current.active && now > burstRef.current.endTime) {
      burstRef.current.active = false;
      burstRef.current.platform = null;
      burstRef.current.extrasSpawned = false;
    }
    const isBursting = burstRef.current.active;
    const burstPlatform = burstRef.current.platform;

    // Spawn 40 extra particles of the connected platform
    if (isBursting && !burstRef.current.extrasSpawned && burstPlatform && dict[burstPlatform]) {
      burstRef.current.extrasSpawned = true;
      for (let i = 0; i < 40; i++) {
        // We set `isExtra` to true so it can be discarded after burst ends
        particlesRef.current.push(makeParticle(dict[burstPlatform], w, h, true));
      }
    }

    // Clear in CSS pixel space (because setTransform maps 1:1 CSS:px)
    ctx.clearRect(0, 0, w, h);

    const particles = particlesRef.current;
    particles.sort((a, b) => a.z - b.z);

    for (const p of particles) {
      // Flutter speed increases slightly during burst
      p.flutterPhase += isBursting ? p.flutterSpeed * 1.5 : p.flutterSpeed;

      // Realistic "leaves in the fall": Use particle-specific amplitudes
      const swayX = Math.cos(p.flutterPhase * 0.8) * p.swayXAmplitude;
      const swayY = Math.sin(p.flutterPhase * 0.8) * p.swayYAmplitude;

      let dx = p.speedX + swayX;
      let dy = p.speedY + swayY;

      // --- Interaction: Repulsion / Attraction ---
      // We calculate distance from particle center to mouse
      const pCx = p.x + p.size / 2;
      const pCy = p.y + p.size / 2;
      const distX = pCx - mX;
      const distY = pCy - mY;
      const dist = Math.sqrt(distX * distX + distY * distY);

      if (dist < INTERACTION_RADIUS && dist > 1) { // avoid divide by zero
        // Normalize direction
        const force = (INTERACTION_RADIUS - dist) / INTERACTION_RADIUS;
        const mag = force * REPULSION_FORCE * (p.z + 0.5); // affects closer items more

        const normX = distX / dist;
        const normY = distY / dist;

        // Tangential vector (perpendicular) for swirl
        // Rotation (x,y) -> (-y, x) gives 90 deg rotation
        const tanX = -normY;
        const tanY = normX;

        // REPULSION / HURRICANE MODE
        // Push away
        dx += normX * mag;
        dy += normY * mag;

        // Forceful Swirl (Hurricane)
        dx += tanX * mag * SWIRL_FORCE * 2.5;
        dy += tanY * mag * SWIRL_FORCE * 2.5;

        // Cause chaotic spinning when disrupted
        p.rotationSpeed = p.baseRotationSpeed * 5;
      } else {
        // Return to natural uneven spin
        // Spin faster when moving faster horizontally to simulate drag
        p.rotationSpeed = p.baseRotationSpeed + (Math.sin(p.flutterPhase) * 0.01);
      }

      p.x += dx;
      p.y += dy;
      p.rotation += p.rotationSpeed;

      if (p.y > h + p.size || p.x > w + p.size) {
        if (p.isExtra && !isBursting) {
          // Retire this extra particle gracefully
          p.markedForDeletion = true;
        } else {
          respawn(p, dict, w, h);
        }
      }

      ctx.save();
      ctx.globalAlpha = p.opacity;

      // Translate to center point for transforms
      ctx.translate(p.x + p.size / 2, p.y + p.size / 2);
      ctx.rotate(p.rotation);

      // Never override existing icons to burst icons.
      ctx.drawImage(p.img, -p.size / 2, -p.size / 2, p.size, p.size);

      ctx.restore();
    }

    // Clean up extra particles that have moved off screen, retaining density limits
    particlesRef.current = particlesRef.current.filter((p) => !p.markedForDeletion);

    // If user zoomed mid-frame, reconfigure on the next frame
    checkDprAndResizeIfNeeded();

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

    // Mouse listener
    const handleMouseMove = (e: MouseEvent) => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      // Mouse relative to the canvas
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseLeave); // Optional: reset when out of window

    const handlePlatformConnected = (e: Event) => {
      const customEvent = e as CustomEvent<{ platform: string }>;
      burstRef.current = {
        active: true,
        platform: customEvent.detail.platform,
        endTime: Date.now() + BURST_DURATION,
        extrasSpawned: false,
      };
    };
    window.addEventListener('ezp:platformConnected', handlePlatformConnected);

    loadIcons()
      .then((dict) => {
        if (!mounted) return;

        // Initial sizing (handles current DPR & element size)
        configureCanvas();

        // Init particles using CSS pixel space
        initParticles(dict, sizeRef.current.cssW, sizeRef.current.cssH);

        // Start animation loop
        animate(dict);

        // React to element size changes precisely
        ro = new ResizeObserver(() => {
          configureCanvas();
        });
        ro.observe(canvas);

        // Handle viewport zoom changes on mobile (visualViewport)
        if (typeof window.visualViewport !== 'undefined' && window.visualViewport !== null) {
          window.visualViewport.addEventListener('resize', configureCanvas);
        }

        // Traditional window resize fallback
        window.addEventListener('resize', configureCanvas);
        window.addEventListener('orientationchange', configureCanvas);
      })
      .catch((e) => {
        console.error('Failed to load social icons:', e);
      });

    return () => {
      mounted = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (ro) ro.disconnect();
      window.removeEventListener('resize', configureCanvas);
      window.removeEventListener('orientationchange', configureCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseLeave);
      window.removeEventListener('ezp:platformConnected', handlePlatformConnected);

      if (typeof window.visualViewport !== 'undefined' && window.visualViewport !== null) {
        window.visualViewport.removeEventListener('resize', configureCanvas);
      }
    };
  }, []);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
        }}
      />
    </div>
  );
};

export default SocialsBackground;
