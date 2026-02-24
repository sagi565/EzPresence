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
}

const ICON_PATHS = [
  '/icons/social/youtube.png',
  '/icons/social/facebook.png',
  '/icons/social/tiktok.png',
  '/icons/social/instagram.png',
];

// Tuned (your last requested settings)
const COUNT = 50;
const WIND = 1.2; // stronger wind
const GRAVITY_MIN = 0.6;
const GRAVITY_MAX = 1.6;
const SIZE_MIN = 14;
const SIZE_MAX = 32;
const OPACITY_MIN = 0.10; // more transparent
const OPACITY_MAX = 0.35;

// Interaction settings
const INTERACTION_RADIUS = 150;
const REPULSION_FORCE = 2;
const SWIRL_FORCE = 0.5;

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


  const loadIcons = (): Promise<HTMLImageElement[]> =>
    Promise.all(
      ICON_PATHS.map(
        (path) =>
          new Promise<HTMLImageElement>((resolve, reject) => {
            const img = new Image();
            img.src = path;
            img.onload = () => resolve(img);
            img.onerror = reject;
          })
      )
    );

  const makeParticle = (img: HTMLImageElement, w: number, h: number): Particle => {
    const z = 0.2 + Math.random() * 0.6;
    const size = SIZE_MIN + z * (SIZE_MAX - SIZE_MIN);

    const fromLeft = Math.random() < 0.5;
    const x = fromLeft ? -Math.random() * w * 0.3 : Math.random() * w;
    const y = fromLeft ? Math.random() * h : -Math.random() * h * 0.3;

    const speedY = GRAVITY_MIN + z * (GRAVITY_MAX - GRAVITY_MIN);
    const speedX = WIND * (0.6 + Math.random());
    const rotation = Math.random() * Math.PI * 2;
    const rotationSpeed = (Math.random() - 0.5) * 0.02;
    const opacity = OPACITY_MIN + z * (OPACITY_MAX - OPACITY_MIN);

    const flutterPhase = Math.random() * Math.PI * 2;
    const flutterSpeed = Math.random() * 0.08 + 0.02;
    const flutterAmplitude = Math.random() < 0.3 ? Math.random() * 2 + 1 : 0;

    return {
      x, y, z, size,
      speedY, speedX, rotation, rotationSpeed, opacity,
      img, flutterPhase, flutterSpeed, flutterAmplitude
    };
  };

  const initParticles = (imgs: HTMLImageElement[], w: number, h: number) => {
    const arr: Particle[] = [];
    for (let i = 0; i < COUNT; i++) {
      const img = imgs[Math.floor(Math.random() * imgs.length)];
      arr.push(makeParticle(img, w, h));
    }
    particlesRef.current = arr;
  };

  const respawn = (p: Particle, imgs: HTMLImageElement[], w: number, h: number) => {
    const img = imgs[Math.floor(Math.random() * imgs.length)];
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

  const animate = (imgs: HTMLImageElement[]) => {
    const ctx = ctxRef.current!;
    const { cssW: w, cssH: h } = sizeRef.current;
    const { x: mX, y: mY } = mouseRef.current;

    // Clear in CSS pixel space (because setTransform maps 1:1 CSS:px)
    ctx.clearRect(0, 0, w, h);

    const particles = particlesRef.current;
    particles.sort((a, b) => a.z - b.z);

    for (const p of particles) {
      p.flutterPhase += p.flutterSpeed;
      const flutterOffset = Math.sin(p.flutterPhase) * p.flutterAmplitude;

      // Basic movement
      let dx = p.speedX + flutterOffset * 0.2;
      let dy = p.speedY;

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
      }

      p.x += dx;
      p.y += dy;
      p.rotation += p.rotationSpeed;

      if (p.y > h + p.size || p.x > w + p.size) {
        respawn(p, imgs, w, h);
      }

      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.translate(p.x + p.size / 2, p.y + p.size / 2);
      ctx.rotate(p.rotation);
      ctx.drawImage(p.img, -p.size / 2, -p.size / 2, p.size, p.size);
      ctx.restore();
    }

    // If user zoomed mid-frame, reconfigure on the next frame
    checkDprAndResizeIfNeeded();

    rafRef.current = requestAnimationFrame(() => animate(imgs));
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

    loadIcons()
      .then((imgs) => {
        if (!mounted) return;

        // Initial sizing (handles current DPR & element size)
        configureCanvas();

        // Init particles using CSS pixel space
        initParticles(imgs, sizeRef.current.cssW, sizeRef.current.cssH);

        // Start animation loop
        animate(imgs);

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
