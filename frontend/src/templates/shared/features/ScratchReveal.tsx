'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

interface ScratchRevealProps {
  children: ReactNode;   // what's underneath the scratch layer
  gradientFrom?: string;
  gradientTo?: string;
  label?: string;
}

function CelebrationEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let animationFrameId: number;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#FFC0CB', '#FF69B4', '#FFF0F5', '#FFD700', '#B8935A', '#E7C68B', '#FF4500', '#FF8C00'];
    const particles = Array.from({ length: 140 }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      r: Math.random() * 6 + 4,
      d: Math.random() * canvas.height,
      color: colors[Math.floor(Math.random() * colors.length)],
      tilt: Math.random() * 10 - 5,
      tiltAngleIncremental: Math.random() * 0.07 + 0.03,
      tiltAngle: 0,
      speedY: Math.random() * 3 + 2,
    }));

    function draw() {
      ctx.clearRect(0, 0, canvas!.width, canvas!.height);
      let remaining = false;
      particles.forEach((p) => {
        p.tiltAngle += p.tiltAngleIncremental;
        p.y += p.speedY;
        p.x += Math.sin(p.tiltAngle);
        p.tilt = Math.sin(p.tiltAngle - p.r / 2) * 15;

        if (p.y < canvas!.height) {
          remaining = true;
        }

        ctx.beginPath();
        ctx.lineWidth = p.r;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
        ctx.stroke();
      });

      if (remaining) {
        animationFrameId = requestAnimationFrame(draw);
      }
    }

    draw();

    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 99999,
      }}
    />
  );
}

export function ScratchReveal({
  children,
  gradientFrom = '#E7C68B',
  gradientTo = '#B8935A',
  label = 'SCRATCH HERE',
}: ScratchRevealProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const scratchingRef = useRef(false);
  const [revealed, setRevealed] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    if (revealed) {
      setShowCelebration(true);
      const timer = setTimeout(() => {
        setShowCelebration(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [revealed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext('2d')!;

    function draw() {
      const rect = wrap!.getBoundingClientRect();
      canvas!.width = rect.width;
      canvas!.height = rect.height;
      const grad = ctx.createLinearGradient(0, 0, rect.width, rect.height);
      grad.addColorStop(0, gradientFrom);
      grad.addColorStop(1, gradientTo);
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, rect.width, rect.height);
      
      // Draw subtle stipple/noise dots texture
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      for (let i = 0; i < rect.width * rect.height * 0.08; i++) {
        const px = Math.random() * rect.width;
        const py = Math.random() * rect.height;
        ctx.fillRect(px, py, 1.2, 1.2);
      }
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      for (let i = 0; i < rect.width * rect.height * 0.08; i++) {
        const px = Math.random() * rect.width;
        const py = Math.random() * rect.height;
        ctx.fillRect(px, py, 1.0, 1.0);
      }
      
      // Draw subtext to guide scratcher
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.font = "600 13px 'Jost', sans-serif";
      ctx.textAlign = 'center';
      ctx.fillText(label, rect.width / 2, rect.height / 2);
    }

    function getPos(e: MouseEvent | TouchEvent) {
      const rect = canvas!.getBoundingClientRect();
      const point = 'touches' in e ? e.touches[0] : e;
      return { x: point.clientX - rect.left, y: point.clientY - rect.top };
    }

    function scratchAt(x: number, y: number) {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 26, 0, Math.PI * 2);
      ctx.fill();
    }

    function checkProgress() {
      const data = ctx.getImageData(0, 0, canvas!.width, canvas!.height).data;
      let cleared = 0;
      let total = 0;
      for (let i = 3; i < data.length; i += 4 * 20) {
        total++;
        if (data[i] === 0) cleared++;
      }
      if (cleared / total > 0.4) {
        setRevealed(true);
      }
    }

    function start(e: MouseEvent | TouchEvent) {
      scratchingRef.current = true;
      const p = getPos(e);
      scratchAt(p.x, p.y);
    }
    
    function move(e: MouseEvent | TouchEvent) {
      if (!scratchingRef.current) return;
      e.preventDefault();
      const p = getPos(e);
      scratchAt(p.x, p.y);
      checkProgress();
    }
    
    function end() {
      scratchingRef.current = false;
    }

    draw();
    canvas.addEventListener('mousedown', start);
    canvas.addEventListener('mousemove', move);
    window.addEventListener('mouseup', end);
    canvas.addEventListener('touchstart', start, { passive: true });
    canvas.addEventListener('touchmove', move, { passive: false });
    canvas.addEventListener('touchend', end);
    window.addEventListener('resize', draw);

    return () => {
      canvas.removeEventListener('mousedown', start);
      canvas.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', end);
      canvas.removeEventListener('touchstart', start);
      canvas.removeEventListener('touchmove', move);
      canvas.removeEventListener('touchend', end);
      window.removeEventListener('resize', draw);
    };
  }, [gradientFrom, gradientTo, label]);

  return (
    <div
      style={{
        position: 'relative',
        width: 'min(320px, 80vw)',
        margin: '0 auto',
        filter: 'drop-shadow(0 15px 30px rgba(0,0,0,0.3))',
      }}
    >
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <clipPath id="heart-clip" clipPathUnits="objectBoundingBox">
            <path d="M 0.5 0.24 C 0.5 0.24, 0.7 0.0, 0.9 0.18 C 1.05 0.38, 0.85 0.7, 0.5 0.96 C 0.15 0.7, -0.05 0.38, 0.1 0.18 C 0.3 0.0, 0.5 0.24, 0.5 0.24 Z" />
          </clipPath>
        </defs>
      </svg>

      {showCelebration && <CelebrationEffect />}

      <div
        ref={wrapRef}
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '1 / 1',
          clipPath: 'url(#heart-clip)',
          WebkitClipPath: 'url(#heart-clip)',
          background: 'var(--surface)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'var(--surface)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '2.5rem 2rem',
          }}
        >
          {children}
        </div>
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            inset: 0,
            cursor: 'grab',
            touchAction: 'none',
            opacity: revealed ? 0 : 1,
            display: revealed ? 'none' : 'block',
            transition: 'opacity 0.6s ease',
          }}
        />
      </div>

      {/* Heart Outline Overlay */}
      <svg
        viewBox="0 0 100 100"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 10,
          width: '100%',
          height: '100%',
        }}
      >
        <path
          d="M 50 24 C 50 24, 70 0, 90 18 C 105 38, 85 70, 50 96 C 15 70, -5 38, 10 18 C 30 0, 50 24, 50 24 Z"
          stroke="var(--section-accent, var(--accent))"
          strokeWidth="1.5"
          fill="none"
          strokeOpacity="0.75"
        />
      </svg>
    </div>
  );
}
