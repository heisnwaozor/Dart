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
  
  const [isClicking, setIsClicking] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [tooltip, setTooltip] = useState<string | null>(null);
  const [isTouchActive, setIsTouchActive] = useState(false);

  const targetPos = useRef({ x: -200, y: -200 });
  const currentPos = useRef({ x: -200, y: -200 });
  const particles = useRef<TrailParticle[]>([]);
  const lastEmitTime = useRef(0);
  const isVisible = useRef(false);
  const touchFadeTimer = useRef<number | null>(null);

  // Palette matching Dart electric blue, cyan and vibrant brand green
  const trailColors = [
    'rgba(59, 130, 246, 0.9)',
    'rgba(14, 165, 233, 0.9)',
    'rgba(96, 165, 250, 0.8)',
    'rgba(5, 201, 47, 0.8)'
  ];

  // Helper to spawn geometric diamond trail particles
  const spawnTrailParticles = (x: number, y: number, quantity = 1) => {
    const now = performance.now();
    if (now - lastEmitTime.current < 16) return;
    lastEmitTime.current = now;

    for (let c = 0; c < quantity; c = c + 1) {
      const randomColor = trailColors[Math.floor(Math.random() * trailColors.length)];
      const particle: TrailParticle = {
        x: x + (Math.random() - 0.5) * 6,
        y: y + (Math.random() - 0.5) * 6,
        size: Math.random() * 5 + 4,
        alpha: 0.95,
        decay: Math.random() * 0.022 + 0.018,
        rotation: Math.PI / 4, // 45 deg signature diamond orientation
        rotationSpeed: (Math.random() - 0.5) * 0.08,
        color: randomColor
      };
      particles.current.push(particle);
    }

    if (particles.current.length > 50) {
      particles.current.shift();
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Desktop Mouse Tracking
    const handleMouseMove = (e: MouseEvent) => {
      targetPos.current.x = e.clientX;
      targetPos.current.y = e.clientY;
      isVisible.current = true;
      setIsTouchActive(false);

      spawnTrailParticles(e.clientX, e.clientY, 1);

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

    // Mobile & Tablet Touch Tracking
    const handleTouchStart = (e: TouchEvent) => {
      if (touchFadeTimer.current) {
        window.clearTimeout(touchFadeTimer.current);
      }
      setIsTouchActive(true);
      const touch = e.touches[0];
      if (!touch) return;

      targetPos.current.x = touch.clientX;
      targetPos.current.y = touch.clientY;
      currentPos.current.x = touch.clientX;
      currentPos.current.y = touch.clientY;
      isVisible.current = true;
      setIsClicking(true);

      spawnTrailParticles(touch.clientX, touch.clientY, 2);

      const element = document.elementFromPoint(touch.clientX, touch.clientY);
      if (element) {
        const interactiveEl = element.closest('button, a, input, select, [role="button"], .ctrl-card, [data-tooltip]');
        setIsHovering(Boolean(interactiveEl));

        const tooltipEl = element.closest('[data-tooltip]');
        if (tooltipEl) {
          const text = tooltipEl.getAttribute('data-tooltip');
          setTooltip(text || null);
        } else {
          setTooltip(null);
        }
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;

      targetPos.current.x = touch.clientX;
      targetPos.current.y = touch.clientY;
      isVisible.current = true;

      spawnTrailParticles(touch.clientX, touch.clientY, 1);
    };

    const handleTouchEnd = () => {
      setIsClicking(false);
      touchFadeTimer.current = window.setTimeout(() => {
        isVisible.current = false;
        setTooltip(null);
        setIsTouchActive(false);
      }, 550);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Active touch listeners for mobile & tablet screens
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    let animationFrameId: number;

    const render = () => {
      // 1. Smooth Spring Easing for Follower Ring
      const ease = isTouchActive ? 0.35 : 0.18;
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

      // 2. Render Diamond Particle Trail (60fps on mobile, tablet & desktop)
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
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isTouchActive]);

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {/* Canvas for 60fps dynamic geometric diamond trail on all viewports */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 w-full h-full"
      />

      {/* Physics Follower Outer Ring (Adapts dynamically to cursor and touch points) */}
      <div
        ref={ringRef}
        className={`pointer-events-none absolute top-0 left-0 w-8 h-8 rounded-full border-2 transition-opacity duration-150 ease-physics will-change-transform flex items-center justify-center ${
          isHovering
            ? 'border-[#05c92f] bg-[#05c92f]/15 shadow-[0_0_15px_rgba(5,201,47,0.4)]'
            : 'border-blue-500/70 bg-blue-500/5 shadow-[0_0_12px_rgba(59,130,246,0.3)]'
        }`}
      >
        {/* Dynamic Contextual Tooltip: Above finger on mobile, beside cursor on desktop */}
        {tooltip && (
          <div className="absolute -top-11 left-1/2 -translate-x-1/2 sm:left-9 sm:top-1/2 sm:-translate-y-1/2 sm:translate-x-0 px-3 py-1 rounded-full bg-slate-950/95 dark:bg-white text-white dark:text-slate-950 text-[11px] font-mono font-black shadow-2xl border border-white/20 dark:border-slate-800 whitespace-nowrap animate-pop-in flex items-center gap-1.5 pointer-events-none">
            <span className="w-1.5 h-1.5 rounded-full bg-[#05c92f] animate-pulse"></span>
            <span>{tooltip}</span>
          </div>
        )}
      </div>

      {/* Inner Center Dot Directly on Cursor / Touch Coordinates */}
      <div
        ref={dotRef}
        className="pointer-events-none absolute top-0 left-0 w-2 h-2 rounded-full bg-blue-600 dark:bg-sky-400 shadow-[0_0_8px_#38bdf8] will-change-transform"
      />
    </div>
  );
};
