import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

export interface AnnouncementPoster {
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

interface AnnouncementCard3DProps {
  poster: AnnouncementPoster;
  onClick: () => void;
  className?: string;
}

export const AnnouncementCard3D: React.FC<AnnouncementCard3DProps> = ({
  poster,
  onClick,
  className = '',
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Dynamic light reflection coordinates (percentage 0-100)
  const [lightPos, setLightPos] = useState({ x: 50, y: 50 });

  // Mouse normalized coordinates [-0.5, 0.5]
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Premium spring physics: silky responsiveness with smooth inertia/delay
  const springConfig = { stiffness: 240, damping: 22, mass: 0.65 };

  // Max rotation of 8–10 degrees (calibrated at 9 degrees for noticeable, elegant 3D tilt)
  const rawRotateX = useTransform(mouseY, [-0.5, 0.5], [9, -9]);
  const rawRotateY = useTransform(mouseX, [-0.5, 0.5], [-9, 9]);

  const rotateX = useSpring(rawRotateX, springConfig);
  const rotateY = useSpring(rawRotateY, springConfig);
  const scale = useSpring(1, springConfig);

  // Dynamic soft shadow that shifts in opposition to the tilt direction
  const shadowOffsetX = useSpring(useTransform(mouseX, [-0.5, 0.5], [16, -16]), springConfig);
  const shadowOffsetY = useSpring(useTransform(mouseY, [-0.5, 0.5], [16, -16]), springConfig);

  useEffect(() => {
    if (typeof window !== 'undefined') {
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
    }
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouchDevice || prefersReducedMotion || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width;
    const relY = (e.clientY - rect.top) / rect.height;

    // Center-offset [-0.5, 0.5]
    mouseX.set(relX - 0.5);
    mouseY.set(relY - 0.5);

    setLightPos({
      x: Math.round(relX * 100),
      y: Math.round(relY * 100),
    });
  };

  const handleMouseEnter = () => {
    if (isTouchDevice || prefersReducedMotion) return;
    setIsHovered(true);
    scale.set(1.025);
  };

  const handleMouseLeave = () => {
    if (isTouchDevice || prefersReducedMotion) return;
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
    scale.set(1);
    setLightPos({ x: 50, y: 50 });
  };

  // Mobile subtle static floating animation (when not on reduced-motion)
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
      className="w-full h-full select-none"
    >
      <motion.div
        ref={cardRef}
        role="button"
        tabIndex={0}
        aria-label={`Announcement: ${poster.title}`}
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick();
          }
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        animate={mobileFloatingAnimation}
        style={{
          transformStyle: 'preserve-3d',
          rotateX: prefersReducedMotion ? 0 : rotateX,
          rotateY: prefersReducedMotion ? 0 : rotateY,
          scale: prefersReducedMotion ? 1 : scale,
        }}
        className={`ambient-card rounded-3xl p-7 sm:p-8 space-y-5 cursor-pointer group relative overflow-visible border border-slate-200/80 dark:border-white/10 transition-colors duration-300 ${className}`}
      >
        {/* ── Dynamic Floating Shadow Underneath ── */}
        <motion.div
          aria-hidden
          className="absolute inset-0 rounded-3xl pointer-events-none -z-10 transition-opacity duration-500"
          style={{
            transform: 'translateZ(-20px)',
            opacity: isHovered ? 1 : 0.6,
            boxShadow: isHovered
              ? `${shadowOffsetX.get()}px ${shadowOffsetY.get() + 26}px 45px -8px rgba(0,0,0,0.42), 0 0 25px -4px rgba(37,99,235,0.18)`
              : '0 15px 30px -10px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.02)',
          }}
        />

        {/* ── Dynamic Specular Light Reflection (Follows Cursor) ── */}
        {!prefersReducedMotion && (
          <div
            aria-hidden
            className={`absolute inset-0 rounded-3xl pointer-events-none overflow-hidden transition-opacity duration-500 z-30 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Soft specular highlight */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(circle 340px at ${lightPos.x}% ${lightPos.y}%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.06) 40%, transparent 75%)`,
              }}
            />
            {/* Edge reflection sheen */}
            <div
              className="absolute inset-0 pointer-events-none rounded-3xl"
              style={{
                background: `radial-gradient(280px circle at ${lightPos.x}% ${lightPos.y}%, rgba(255,255,255,0.35) 0%, transparent 70%)`,
                WebkitMaskImage: 'radial-gradient(280px circle at 50% 50%, black 90%, transparent 100%)',
                maskImage: 'radial-gradient(280px circle at 50% 50%, black 90%, transparent 100%)',
              }}
            />
          </div>
        )}

        {/* ── Layer 1: Poster Image Layer (translateZ: 30px) ── */}
        <div
          style={{
            transform: prefersReducedMotion ? 'none' : 'translateZ(30px)',
            transformStyle: 'preserve-3d',
          }}
          className="transition-transform duration-300 ease-out"
        >
          {poster.image ? (
            <div className="relative w-full aspect-[4/5] sm:aspect-[3/4] max-h-72 rounded-2xl overflow-hidden bg-slate-950 border border-slate-200/50 dark:border-white/10 shadow-lg">
              <img
                src={poster.image}
                alt={poster.title}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />
              {/* Cinematic Vignette */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/35 pointer-events-none" />

              {/* ── Layer 1b: Date & Time Floating Badge (translateZ: 42px) ── */}
              <div
                style={{
                  transform: prefersReducedMotion ? 'none' : 'translateZ(42px)',
                }}
                className="absolute top-3.5 left-3.5 sm:top-4 sm:left-4 z-20 space-y-0.5"
              >
                <span className="font-mono text-xs block font-bold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                  {poster.date}
                </span>
                <span className="font-mono text-[11px] block font-medium text-slate-200 drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]">
                  {poster.time}
                </span>
              </div>
            </div>
          ) : (
            /* Decorative Top Accent for posters without image */
            <div
              className={`p-4 rounded-2xl bg-gradient-to-br ${poster.themeColor} space-y-1 shadow-sm`}
            >
              <span className="font-mono text-xs block font-bold text-slate-900 dark:text-white">
                {poster.date}
              </span>
              <span className="font-mono text-[11px] block font-medium text-slate-600 dark:text-slate-300">
                {poster.time}
              </span>
            </div>
          )}
        </div>

        {/* ── Layer 2: Text Content & Title (translateZ: 38px / 24px) ── */}
        <div className="space-y-3">
          {/* Title sits closest to viewer */}
          <h5
            style={{
              transform: prefersReducedMotion ? 'none' : 'translateZ(38px)',
            }}
            className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase group-hover:text-royal-500 dark:group-hover:text-cobalt-400 transition-colors duration-300 ease-out"
          >
            {poster.title}
          </h5>

          {/* Announcement Subtitle sits at mid depth */}
          <p
            style={{
              transform: prefersReducedMotion ? 'none' : 'translateZ(24px)',
            }}
            className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-normal leading-[1.68] text-pretty"
          >
            {poster.subtitle}
          </p>
        </div>

        {/* ── Layer 3: Interactive Button / CTA (translateZ: 46px) ── */}
        <div
          style={{
            transform: prefersReducedMotion ? 'none' : 'translateZ(46px)',
          }}
          className="pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between"
        >
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 group-hover:text-royal-500 dark:group-hover:text-cobalt-400 transition-colors">
            Official Announcement
          </span>

          <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-royal-600 dark:text-cobalt-400 group-hover:underline">
            <span>View Details</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </motion.div>
    </div>
  );
};
