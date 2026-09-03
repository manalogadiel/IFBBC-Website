import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { X, Image as ImageIcon } from 'lucide-react';

export interface EventPoster {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  time: string;
  venue: string;
  scripture: string;
  themeColor: string;
  tag?: string;
  image?: string;
}

interface AnnouncementModal3DProps {
  poster: EventPoster;
  groupName: string;
  onClose: () => void;
}

export const AnnouncementModal3D: React.FC<AnnouncementModal3DProps> = ({
  poster,
  groupName,
  onClose,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [lightPos, setLightPos] = useState({ x: 50, y: 50 });
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check device and motion preferences
  useEffect(() => {
    const touchQuery = window.matchMedia('(pointer: coarse)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    setIsTouchDevice(touchQuery.matches);
    setPrefersReducedMotion(motionQuery.matches);

    const handleTouchChange = (e: MediaQueryListEvent) => setIsTouchDevice(e.matches);
    const handleMotionChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);

    touchQuery.addEventListener('change', handleTouchChange);
    motionQuery.addEventListener('change', handleMotionChange);

    return () => {
      touchQuery.removeEventListener('change', handleTouchChange);
      motionQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  // Motion values for smooth cursor tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring physics for natural inertia & smooth return to flat
  const springConfig = { stiffness: 220, damping: 22, mass: 0.65 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // Calibrated 8–10° maximum 3D rotation
  const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], [8.5, -8.5]);
  const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-8.5, 8.5]);

  // Opposing dynamic shadow that shifts based on tilt direction
  const shadowOffsetX = useTransform(smoothMouseX, [-0.5, 0.5], [26, -26]);
  const shadowOffsetY = useTransform(smoothMouseY, [-0.5, 0.5], [26, -26]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouchDevice || prefersReducedMotion || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Normalised relative position from -0.5 to 0.5
    const normalizedX = (e.clientX - rect.left) / width - 0.5;
    const normalizedY = (e.clientY - rect.top) / height - 0.5;

    mouseX.set(normalizedX);
    mouseY.set(normalizedY);

    // Dynamic light specular reflection coordinates in percent
    setLightPos({
      x: ((e.clientX - rect.left) / width) * 100,
      y: ((e.clientY - rect.top) / height) * 100,
    });
  };

  const handleMouseEnter = () => {
    if (isTouchDevice || prefersReducedMotion) return;
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (isTouchDevice || prefersReducedMotion) return;
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
    setLightPos({ x: 50, y: 50 });
  };

  // Mobile subtle static floating animation (when reduced-motion is not active)
  const mobileFloatingAnimation =
    isTouchDevice && !prefersReducedMotion
      ? {
          y: [0, -7, 0],
          transition: {
            duration: 4.5,
            repeat: Infinity,
            ease: 'easeInOut' as const,
          },
        }
      : undefined;

  return (
    <div
      style={{
        perspective: '1000px',
      }}
      className="relative w-full max-w-md sm:max-w-lg z-10 my-auto pointer-events-auto"
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={
          mobileFloatingAnimation || {
            opacity: 1,
            scale: 1,
            y: 0,
          }
        }
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        style={{
          rotateX: prefersReducedMotion ? 0 : rotateX,
          rotateY: prefersReducedMotion ? 0 : rotateY,
          transformStyle: 'preserve-3d',
          boxShadow: isHovered
            ? `${shadowOffsetX.get()}px ${shadowOffsetY.get() + 24}px 50px -8px rgba(0, 0, 0, 0.65), 0 0 25px -4px rgba(37, 99, 235, 0.2)`
            : '0 20px 40px -10px rgba(0, 0, 0, 0.5), 0 0 15px -4px rgba(0, 0, 0, 0.3)',
        }}
        className="relative w-full ambient-card rounded-3xl p-4 sm:p-6 border border-slate-200/40 dark:border-white/10 select-none bg-slate-900/95 dark:bg-[#070b14]/95 backdrop-blur-xl transition-shadow duration-300"
      >
        {/* Dynamic Specular Light Reflection Sheen */}
        {!prefersReducedMotion && (
          <div
            className="pointer-events-none absolute inset-0 rounded-3xl transition-opacity duration-300 z-30 overflow-hidden"
            style={{
              opacity: isHovered ? 1 : 0,
              background: `radial-gradient(circle 420px at ${lightPos.x}% ${lightPos.y}%, rgba(255, 255, 255, 0.14) 0%, rgba(255, 255, 255, 0.03) 42%, transparent 75%)`,
            }}
          />
        )}

        {/* Ambient Glass Perimeter Sheen */}
        {!prefersReducedMotion && (
          <div
            className="pointer-events-none absolute inset-0 rounded-3xl transition-opacity duration-300 z-30 border border-white/20 dark:border-white/15"
            style={{
              opacity: isHovered ? 1 : 0,
            }}
          />
        )}

        {/* Header Area — Elevated at translateZ(36px) */}
        <div
          style={{
            transform: 'translateZ(36px)',
            transformStyle: 'preserve-3d',
          }}
          className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100/10 dark:border-white/5 relative z-20"
        >
          <div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-royal-500 dark:text-cobalt-400 font-bold block">
              Event Poster | {groupName}
            </span>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-0.5 uppercase">
              {poster.title}
            </h3>
          </div>

          {/* Close Button X — Elevated at translateZ(46px) */}
          <button
            onClick={onClose}
            style={{
              transform: 'translateZ(46px)',
            }}
            aria-label="Close modal"
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-obsidian-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-obsidian-700 transition-all duration-200 shrink-0 cursor-pointer shadow-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Poster Image Container — Elevated at translateZ(28px) */}
        {poster.image ? (
          <div
            style={{
              transform: 'translateZ(28px)',
              transformStyle: 'preserve-3d',
            }}
            className="relative w-full rounded-2xl overflow-hidden bg-slate-950 mb-3 sm:mb-4 border border-slate-800 shadow-xl flex items-center justify-center p-2 sm:p-3 z-10"
          >
            <img
              src={poster.image}
              alt={poster.title}
              style={{
                transform: 'translateZ(14px)',
              }}
              className="w-auto max-w-full max-h-[36vh] sm:max-h-[40vh] object-contain rounded-xl mx-auto shadow-2xl transition-transform duration-300"
            />
          </div>
        ) : (
          <div
            style={{
              transform: 'translateZ(24px)',
            }}
            className="w-full rounded-2xl border border-dashed border-slate-300 dark:border-white/10 bg-slate-50/70 dark:bg-white/[0.02] p-8 flex flex-col items-center justify-center text-center mb-3 sm:mb-4 z-10"
          >
            <div className="w-12 h-12 rounded-2xl bg-royal-500/10 dark:bg-cobalt-400/10 text-royal-500 dark:text-cobalt-400 flex items-center justify-center mb-2">
              <ImageIcon className="w-6 h-6" />
            </div>
            <h5 className="text-sm font-bold text-slate-900 dark:text-white">
              Official Event Poster
            </h5>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 max-w-xs font-mono">
              Official event poster graphic will be published here soon
            </p>
          </div>
        )}

        {/* Event Details Card — Layered at translateZ(38px) */}
        <div
          style={{
            transform: 'translateZ(38px)',
            transformStyle: 'preserve-3d',
          }}
          className="p-3.5 sm:p-4 bg-slate-900/90 dark:bg-obsidian-900/90 text-white rounded-2xl space-y-2.5 relative overflow-hidden border border-slate-800/80 shadow-lg z-20"
        >
          {poster.subtitle && (
            <p
              style={{
                transform: 'translateZ(16px)',
              }}
              className="text-xs text-slate-300 font-medium leading-relaxed"
            >
              {poster.subtitle}
            </p>
          )}

          <div
            style={{
              transform: 'translateZ(24px)',
            }}
            className="grid grid-cols-3 gap-2 sm:gap-3 pt-2.5 border-t border-slate-800/80 font-mono text-xs"
          >
            <div>
              <span className="text-slate-400 block text-[9px] uppercase tracking-wider">Date & Time</span>
              <span className="font-bold text-white text-[11px] block truncate">{poster.date}</span>
              <span className="text-slate-400 text-[10px] block truncate">{poster.time}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[9px] uppercase tracking-wider">Venue</span>
              <span className="font-bold text-white text-[11px] block truncate">{poster.venue}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[9px] uppercase tracking-wider">Scripture</span>
              <span className="font-bold text-royal-400 dark:text-cobalt-400 text-[11px] block truncate">{poster.scripture}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
