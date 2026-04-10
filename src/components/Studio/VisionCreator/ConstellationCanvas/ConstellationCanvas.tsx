import React, { useRef, useEffect } from 'react';
import { ConstellationWrap } from './styles';

// Each "beam" fired from center has these phases:
//   1. DRAWING  — line grows from center to target point on ring (fast, ~220ms)
//   2. ORBITING — dot appears at target and orbits that ring; line fades; dot lives for `life` ms
//   3. FADING   — dot fades out over last 18% of its life
interface Beam {
  angle:      number;  // angle on the ring where this beam points
  ringR:      number;  // radius of the ring this dot will orbit (60–105)
  targetX:    number;  // landing x on ring
  targetY:    number;  // landing y on ring
  born:       number;
  drawDur:    number;  // ms to draw the line (150–280)
  life:       number;  // total ms the dot lives after line finishes
  dotSize:    number;  // 1.4 – 3.0
  orbitSpeed: number;  // ms per full orbit around the ring dot sits on
}

const ConstellationCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const beamsRef  = useRef<Beam[]>([]);
  const rafRef    = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const DPR = window.devicePixelRatio || 1;
    const W = 300, H = 300;
    const CX = W / 2, CY = H / 2;

    canvas.width  = W * DPR;
    canvas.height = H * DPR;
    canvas.style.width  = `${W}px`;
    canvas.style.height = `${H}px`;
    ctx.scale(DPR, DPR);

    const fire = () => {
      const angle   = Math.random() * Math.PI * 2;
      const ringR   = 62 + Math.random() * 44;
      const targetX = CX + Math.cos(angle) * ringR;
      const targetY = CY + Math.sin(angle) * ringR;
      beamsRef.current.push({
        angle, ringR, targetX, targetY,
        born:       performance.now(),
        drawDur:    150 + Math.random() * 130,
        life:       3800 + Math.random() * 5500,
        dotSize:    1.4  + Math.random() * 1.6,
        orbitSpeed: 2200 + Math.random() * 3800,
      });
    };

    for (let i = 0; i < 5; i++) setTimeout(fire, i * 420 + Math.random() * 200);
    const interval = setInterval(() => {
      fire();
      if (Math.random() < 0.35) setTimeout(fire, 120 + Math.random() * 180);
    }, 1600 + Math.random() * 400);

    const draw = (now: number) => {
      ctx.clearRect(0, 0, W, H);

      // center node
      ctx.beginPath();
      ctx.arc(CX, CY, 4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(139,92,246,0.7)';
      ctx.fill();
      // soft halo
      ctx.beginPath();
      ctx.arc(CX, CY, 8, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(139,92,246,0.10)';
      ctx.fill();

      beamsRef.current = beamsRef.current.filter(b => {
        const elapsed    = now - b.born;
        const drawFrac   = Math.min(1, elapsed / b.drawDur);
        const dotElapsed = elapsed - b.drawDur;
        const dotFrac    = dotElapsed / b.life;

        if (dotElapsed > b.life) return false;

        // beam line (fades out as dot appears)
        if (drawFrac < 1 || dotElapsed < 400) {
          const lineAlpha = drawFrac < 1
            ? drawFrac * 0.55
            : 0.55 * (1 - dotElapsed / 400);

          if (lineAlpha > 0.01) {
            const tipX = CX + (b.targetX - CX) * drawFrac;
            const tipY = CY + (b.targetY - CY) * drawFrac;
            ctx.beginPath();
            ctx.moveTo(CX, CY);
            ctx.lineTo(tipX, tipY);
            ctx.strokeStyle = `rgba(167,139,250,${lineAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();

            if (drawFrac < 1) {
              ctx.beginPath();
              ctx.arc(tipX, tipY, 1.5, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(196,167,255,${drawFrac * 0.9})`;
              ctx.fill();
            }
          }
        }

        // orbiting dot (appears once line finishes)
        if (dotElapsed > 0) {
          let dotAlpha: number;
          if (dotFrac < 0.08)       dotAlpha = dotFrac / 0.08;
          else if (dotFrac < 0.82)  dotAlpha = 1;
          else                      dotAlpha = 1 - (dotFrac - 0.82) / 0.18;
          dotAlpha = Math.max(0, Math.min(1, dotAlpha));

          const orbitR = b.dotSize * 2.8 + 3;
          const orbitA = (dotElapsed / b.orbitSpeed) * Math.PI * 2;
          const dx = b.targetX + Math.cos(orbitA) * orbitR;
          const dy = b.targetY + Math.sin(orbitA) * orbitR;

          ctx.beginPath();
          ctx.arc(b.targetX, b.targetY, b.dotSize * 0.7, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(139,92,246,${dotAlpha * 0.55})`;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(dx, dy, b.dotSize, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(167,139,250,${dotAlpha * 0.92})`;
          ctx.fill();
        }

        return true;
      });

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(rafRef.current); clearInterval(interval); };
  }, []);

  return <ConstellationWrap><canvas ref={canvasRef} /></ConstellationWrap>;
};

export default ConstellationCanvas;
