'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

interface ScratchRevealProps {
  children: ReactNode;   // what's underneath the scratch layer
  gradientFrom?: string;
  gradientTo?: string;
  label?: string;
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
      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      ctx.font = "600 14px 'Jost', sans-serif";
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
      if (cleared / total > 0.45) {
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
      ref={wrapRef}
      style={{
        position: 'relative',
        width: 'min(340px, 86vw)',
        aspectRatio: '1 / 1',
        margin: '0 auto',
        borderRadius: 6,
        boxShadow: '0 18px 40px -18px rgba(0,0,0,0.4)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'var(--surface)',
          border: '1px solid var(--accent-soft)',
          borderRadius: 6,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '1rem',
        }}
      >
        {children}
      </div>
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 6,
          cursor: 'grab',
          touchAction: 'none',
          opacity: revealed ? 0 : 1,
          display: revealed ? 'none' : 'block',
          transition: 'opacity 0.6s ease',
        }}
      />
    </div>
  );
}
