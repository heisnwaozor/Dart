import React, { useEffect, useRef, useState } from 'react';

interface TrailParticle {
  x: number;
  y: number;
  size: number;
  alpha: number;
  decay: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
}

export const CursorFollower: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);
  
  const [enabled, setEnabled] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [tooltip, setTooltip] = useState<string | null>(null);

  const targetPos = useRef({ x: -200, y: -200 });
  const currentPos = useRef({ x: -200, y: -200 });
  const particles = useRef<TrailParticle[]>([]);
  const lastEmitTime = useRef(0);
  const isVisible = useRef(false);

  // Palette matching Dart electric blue, cyan and vibrant brand green
  const trailColors = [
    'rgba(59, 130, 246, 0.85)',
    'rgba(14, 165, 233, 0.85)',
    'rgba(96, 165, 250, 0.75)',
    'rgba(5, 201, 47, 0.75)'
  ];

  useEffect(() => {
    // Only activate for fine pointers (desktops with mouse/trackpad), not touchscreens
    const media = window.matchMedia('(pointer: fine)');
    if (!media.matches) return;

    setEnabled(true);

    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      targetPos.current.x = e.clientX;
      targetPos.current.y = e.clientY;
      isVisible.current = true;

      // Spawn diamond trail particles when moving
      const now = performance.now();
      if (now - lastEmitTime.current > 24) {
        lastEmitTime.current = now;
        
        const randomColor = trailColors[Math.floor(Math.random() * trailColors.length)];
        const particle: TrailParticle = {
          x: e.clientX,
          y: e.clientY,
          size: Math.random() * 5 + 4,
          alpha: 0.9,
          decay: Math.random() * 0.025 + 0.02,
          rotation: Math.PI / 4, // 45 deg diamond orientation
          rotationSpeed: (Math.random() - 0.5) * 0.08,
          color: randomColor
        };
        
        particles.current.push(particle);
        if (particles.current.length > 35) {
          particles.current.shift();
        }
      }

      // Check if hovering over clickable or tooltip element
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactiveEl = target.closest('button, a, input, select, [role="button"], .ctrl-card, [data-tooltip]');
        setIsHovering(Boolean(interactiveEl));

        const tooltipEl = target.closest('[data-tooltip]');
        if (tooltipEl) {
          const text = tooltipEl.getAttribute('data-tooltip');
          setTooltip(text || null);
        } else {
          setTooltip(null);
        }
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => {
      isVisible.current = false;
      setTooltip(null);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);

    let animationFrameId: number;

    const render = () => {
      // 1. Smooth Spring Easing for Cursor Ring Follower
      const ease = 0.18;
      currentPos.current.x += (targetPos.current.x - currentPos.current.x) * ease;
      currentPos.current.y += (targetPos.current.y - currentPos.current.y) * ease;

      if (ringRef.current) {
        if (!isVisible.current) {
          ringRef.current.style.opacity = '0';
        } else {
          ringRef.current.style.opacity = '1';
          const scale = isClicking ? 'scale(0.85)' : isHovering ? 'scale(1.4)' : 'scale(1)';
          ringRef.current.style.transform = `translate3d(${currentPos.current.x}px, ${currentPos.current.y}px, 0) translate(-50%, -50%) ${scale}`;
        }
      }

      if (dotRef.current) {
        if (!isVisible.current) {
          dotRef.current.style.opacity = '0';
        } else {
          dotRef.current.style.opacity = '1';
          dotRef.current.style.transform = `translate3d(${targetPos.current.x}px, ${targetPos.current.y}px, 0) translate(-50%, -50%)`;
        }
      }

      // 2. Render Cursor Diamond Particle Trail
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          const activeParticles: TrailParticle[] = [];

          for (let i = 0; i < particles.current.length; i = i + 1) {
            const p = particles.current[i];
            p.alpha = p.alpha - p.decay;
            p.rotation = p.rotation + p.rotationSpeed;
            p.size = p.size * 0.985;

            if (p.alpha > 0.02 && p.size > 0.5) {
              activeParticles.push(p);

              ctx.save();
              ctx.translate(p.x, p.y);
              ctx.rotate(p.rotation);
              ctx.fillStyle = p.color;
              ctx.globalAlpha = p.alpha;

              // Draw Dart signature geometric diamond
              ctx.beginPath();
              ctx.moveTo(0, -p.size);
              ctx.lineTo(p.size, 0);
              ctx.lineTo(0, p.size);
              ctx.lineTo(-p.size, 0);
              ctx.closePath();
              ctx.fill();

              ctx.restore();
            }
          }

          particles.current = activeParticles;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {/* Canvas for 60fps dynamic geometric diamond trail */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 w-full h-full"
      />

      {/* Physics Cursor Outer Ring */}
      <div
        ref={ringRef}
        className={`pointer-events-none absolute top-0 left-0 w-8 h-8 rounded-full border-2 transition-opacity duration-150 ease-physics will-change-transform flex items-center justify-center ${
          isHovering
            ? 'border-[#05c92f] bg-[#05c92f]/10 shadow-[0_0_15px_rgba(5,201,47,0.4)]'
            : 'border-blue-500/70 bg-blue-500/5 shadow-[0_0_12px_rgba(59,130,246,0.3)]'
        }`}
      >
        {/* Dynamic Contextual Tooltip Following the Cursor */}
        {tooltip && (
          <div className="absolute left-9 top-1/2 -translate-y-1/2 px-3 py-1 rounded-full bg-slate-950/95 dark:bg-white text-white dark:text-slate-950 text-[11px] font-mono font-black shadow-2xl border border-white/20 dark:border-slate-800 whitespace-nowrap animate-pop-in flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#05c92f] animate-pulse"></span>
            <span>{tooltip}</span>
          </div>
        )}
      </div>

      {/* Inner Center Dot Directly Locked to Pointer Coordinates */}
      <div
        ref={dotRef}
        className="pointer-events-none absolute top-0 left-0 w-2 h-2 rounded-full bg-blue-600 dark:bg-sky-400 shadow-[0_0_8px_#38bdf8] will-change-transform"
      />
    </div>
  );
};
