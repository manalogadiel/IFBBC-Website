import React, { useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';

interface GlassLogoBadgeProps {
  logoSrc: string;
  altText?: string;
  groupName: string;
  accentColor?: string;
  className?: string;
  imgClassName?: string;
}

export const GlassLogoBadge: React.FC<GlassLogoBadgeProps> = ({
  logoSrc,
  altText = 'Ministry Emblem',
  groupName,
  accentColor = '#00a2ea',
  className = '',
  imgClassName = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);

  // Raw cursor position (-0.5 to 0.5)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // High-precision spring damping for fluid 3D movement
  const springConfig = { stiffness: 280, damping: 22, mass: 0.8 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // 3D rotation transforms
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [20, -20]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-20, 20]);

  // Specular Glare translation (light shifts across curved glass lens)
  const glareX = useTransform(smoothX, [-0.5, 0.5], [-35, 35]);
  const glareY = useTransform(smoothY, [-0.5, 0.5], [-35, 35]);
  const glareOpacity = useTransform(smoothX, [-0.5, 0.5], [0.4, 0.85]);

  // Parallax translation for inner logo
  const logoTranslateX = useTransform(smoothX, [-0.5, 0.5], [-8, 8]);
  const logoTranslateY = useTransform(smoothY, [-0.5, 0.5], [-8, 8]);

  // Handle cursor move within container
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || isSpinning) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  }, [isSpinning, mouseX, mouseY]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  // Dynamic click interaction: Press in -> 360 spin with spring release -> return to float
  const handleClick = useCallback(() => {
    if (isSpinning) return;
    setIsSpinning(true);

    // After spin sequence finishes, restore state
    setTimeout(() => {
      setIsSpinning(false);
    }, 1100);
  }, [isSpinning]);

  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      {/* 3D Perspective Viewport */}
      <div
        ref={containerRef}
        role="button"
        tabIndex={0}
        aria-label={`${groupName} 3D Glass Emblem`}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        }}
        style={{ perspective: 1200 }}
        className="relative w-40 h-40 sm:w-44 sm:h-44 md:w-48 md:h-48 cursor-pointer flex items-center justify-center group touch-none focus:outline-none"
      >
        {/* Ambient Radial Color Underglow */}
        <div
          className="absolute -inset-2 rounded-full opacity-60 dark:opacity-75 blur-2xl transition-all duration-700 pointer-events-none group-hover:scale-110 group-hover:opacity-90"
          style={{
            background: `radial-gradient(circle, ${accentColor}55 0%, ${accentColor}15 60%, transparent 80%)`,
          }}
        />

        {/* Outer Circular Aura Pulse on Click */}
        <AnimatePresence>
          {isSpinning && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0.9 }}
              animate={{ scale: 1.45, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 rounded-full border-2 border-white/60 pointer-events-none"
              style={{
                boxShadow: `0 0 25px 4px ${accentColor}`,
              }}
            />
          )}
        </AnimatePresence>

        {/* ── 3D Interactive Floating Badge Container ── */}
        <motion.div
          animate={
            isSpinning
              ? {
                  rotateZ: [0, 360],
                  scale: [0.93, 1.12, 1.0],
                  rotateX: [0, -12, 0],
                  rotateY: [0, 24, 0],
                  transition: {
                    duration: 1.05,
                    ease: [0.34, 1.56, 0.64, 1], // dynamic spring release
                  },
                }
              : isHovered
              ? {
                  y: -4,
                  scale: 1.04,
                  transition: { duration: 0.3, ease: 'easeOut' },
                }
              : {
                  // Subtle ambient idle float & micro-tilt
                  y: [0, -7, 0],
                  rotateX: [0, 2.5, -2, 0],
                  rotateY: [0, -3, 3, 0],
                  transition: {
                    repeat: Infinity,
                    duration: 5.2,
                    ease: 'easeInOut',
                  },
                }
          }
          whileTap={{ scale: 0.93 }}
          style={{
            rotateX: isSpinning ? undefined : rotateX,
            rotateY: isSpinning ? undefined : rotateY,
            transformStyle: 'preserve-3d',
          }}
          className="relative w-full h-full rounded-full flex items-center justify-center"
        >
          {/* ── Base Glass Cavity Plate (Luminous Pure White Porcelain Base for 100% Contrast) ── */}
          <div
            className="absolute inset-1 rounded-full bg-white shadow-[0_16px_40px_rgba(0,0,0,0.4),inset_0_2px_6px_rgba(255,255,255,1),inset_0_-3px_8px_rgba(0,0,0,0.08)] border border-slate-200/90 dark:border-white/80 overflow-hidden"
          />

          {/* ── Middle Layer: Perfectly Constrained Circular Masked Logo Graphic (Tack Sharp & High Resolution) ── */}
          <motion.div
            style={{
              x: isSpinning ? 0 : logoTranslateX,
              y: isSpinning ? 0 : logoTranslateY,
              transform: 'translateZ(18px)',
              transformStyle: 'preserve-3d',
            }}
            className="relative z-10 w-[92%] h-[92%] rounded-full overflow-hidden flex items-center justify-center pointer-events-none"
          >
            <img
              src={logoSrc}
              alt={altText}
              className={`w-full h-full object-contain filter contrast-[1.08] brightness-[1.01] transition-transform duration-300 ${imgClassName}`}
              style={{ imageRendering: 'auto' }}
            />
          </motion.div>

          {/* ── Top Layer: Optically Clear Glass Dome Lens (Zero Blur, High-Specular Crystal Reflection) ── */}
          <motion.div
            style={{
              transform: 'translateZ(36px)',
              transformStyle: 'preserve-3d',
            }}
            className="absolute inset-0 rounded-full pointer-events-none overflow-hidden border border-white/60 dark:border-white/50 shadow-[inset_0_2px_4px_rgba(255,255,255,0.9),inset_0_-2px_6px_rgba(0,0,0,0.12)]"
          >
            {/* Subtle Prismatic Reflection Rim (Dispersed light only on outer perimeter) */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none opacity-20"
              style={{
                background:
                  'radial-gradient(circle at center, transparent 65%, rgba(56,189,248,0.3) 80%, rgba(244,114,182,0.2) 92%, transparent 100%)',
              }}
            />

            {/* Soft, Uniform Diffused Surface Gloss Highlight */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none opacity-30"
              style={{
                background:
                  'radial-gradient(circle at 44% 24%, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.1) 40%, transparent 68%)',
              }}
            />

            {/* Top Specular Curved Crescent Glare (Convex crystal dome gloss reflection) */}
            <div className="absolute top-1 left-5 right-5 h-[38%] rounded-t-full bg-gradient-to-b from-white/70 via-white/15 to-transparent pointer-events-none opacity-85" />

            {/* Dynamic Cursor-Tracked Specular Reflection Light Ray */}
            <motion.div
              style={{
                x: glareX,
                y: glareY,
                opacity: glareOpacity,
              }}
              className="absolute top-2 left-5 w-12 h-7 rounded-full bg-white/40 blur-[2px] pointer-events-none"
            />

            {/* Bottom Inner Rim Specular Reflection */}
            <div className="absolute bottom-2 left-10 right-10 h-3 rounded-full bg-white/25 blur-[1px] pointer-events-none" />
          </motion.div>

          {/* ── Outer Specular Chrome Bezel Ring ── */}
          <div className="absolute inset-0 rounded-full ring-1 ring-white/60 dark:ring-white/40 shadow-[0_0_20px_rgba(255,255,255,0.25)] pointer-events-none" />
        </motion.div>
      </div>
    </div>
  );
};
