import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { X, Image as ImageIcon, Maximize2, Download } from 'lucide-react';

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
  const [isPosterFullScreen, setIsPosterFullScreen] = useState(false);

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

  // Keyboard navigation & escape listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isPosterFullScreen) {
          setIsPosterFullScreen(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPosterFullScreen, onClose]);

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

  return (
    <>
      <div
        style={{
          perspective: isTouchDevice ? 'none' : '1000px',
        }}
        className="relative w-full max-w-md sm:max-w-lg z-10 my-auto pointer-events-auto"
      >
        <motion.div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          style={{
            rotateX: isTouchDevice || prefersReducedMotion ? 0 : rotateX,
            rotateY: isTouchDevice || prefersReducedMotion ? 0 : rotateY,
            transformStyle: isTouchDevice ? 'flat' : 'preserve-3d',
            boxShadow: isHovered
              ? `${shadowOffsetX.get()}px ${shadowOffsetY.get() + 24}px 50px -8px rgba(0, 0, 0, 0.65), 0 0 25px -4px rgba(37, 99, 235, 0.2)`
              : '0 20px 40px -10px rgba(0, 0, 0, 0.5), 0 0 15px -4px rgba(0, 0, 0, 0.3)',
          }}
          className="relative w-full max-h-[88dvh] overflow-y-auto ambient-card rounded-3xl p-4 sm:p-6 border border-slate-200/40 dark:border-white/10 select-none bg-slate-900/95 dark:bg-[#070b14]/95 backdrop-blur-xl transition-shadow duration-300"
        >
          {/* Dynamic Specular Light Reflection Sheen */}
          {!prefersReducedMotion && !isTouchDevice && (
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
              transform: isTouchDevice ? 'none' : 'translateZ(36px)',
              transformStyle: isTouchDevice ? 'flat' : 'preserve-3d',
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

            {/* Close Button X */}
            <button
              onClick={onClose}
              style={{
                transform: isTouchDevice ? 'none' : 'translateZ(46px)',
              }}
              aria-label="Close modal"
              className="w-8 h-8 rounded-full bg-slate-100 dark:bg-obsidian-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-obsidian-700 transition-all duration-200 shrink-0 cursor-pointer shadow-md"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Poster Image Container (Clickable to open Full Screen) */}
          {poster.image ? (
            <div
              onClick={() => setIsPosterFullScreen(true)}
              style={{
                transform: isTouchDevice ? 'none' : 'translateZ(28px)',
                transformStyle: isTouchDevice ? 'flat' : 'preserve-3d',
              }}
              className="relative w-full rounded-2xl overflow-hidden bg-slate-950 mb-3 sm:mb-4 border border-slate-800 shadow-xl flex items-center justify-center p-2 sm:p-3 z-10 cursor-pointer group/poster"
              title="Click to view poster in full screen"
            >
              <img
                src={poster.image}
                alt={poster.title}
                style={{
                  transform: isTouchDevice ? 'none' : 'translateZ(14px)',
                }}
                className="w-auto max-w-full max-h-[36vh] sm:max-h-[40vh] object-contain rounded-xl mx-auto shadow-2xl transition-transform duration-300 group-hover/poster:scale-[1.02]"
              />

              {/* Hover / Tap prompt overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/poster:opacity-100 transition-opacity rounded-2xl flex flex-col items-center justify-center text-white gap-1.5 backdrop-blur-[1px]">
                <Maximize2 className="w-7 h-7 drop-shadow-md text-white" />
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider bg-black/75 px-3 py-1 rounded-full text-white shadow">
                  View Full Screen
                </span>
              </div>

              {/* Mobile explicit badge */}
              <div className="sm:hidden absolute bottom-3 right-3 z-20 pointer-events-none">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/85 backdrop-blur-md border border-white/20 text-white font-mono text-[10px] font-bold shadow-md">
                  <Maximize2 className="w-3 h-3 text-royal-400" />
                  <span>Fullscreen</span>
                </span>
              </div>
            </div>
          ) : (
            <div
              style={{
                transform: isTouchDevice ? 'none' : 'translateZ(24px)',
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

          {/* Event Details Card */}
          <div
            style={{
              transform: isTouchDevice ? 'none' : 'translateZ(38px)',
              transformStyle: isTouchDevice ? 'flat' : 'preserve-3d',
            }}
            className="p-3.5 sm:p-4 bg-slate-900/90 dark:bg-obsidian-900/90 text-white rounded-2xl space-y-2.5 relative overflow-hidden border border-slate-800/80 shadow-lg z-20"
          >
            {poster.subtitle && (
              <p
                style={{
                  transform: isTouchDevice ? 'none' : 'translateZ(16px)',
                }}
                className="text-xs text-slate-300 font-medium leading-relaxed"
              >
                {poster.subtitle}
              </p>
            )}

            <div
              style={{
                transform: isTouchDevice ? 'none' : 'translateZ(24px)',
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

      {/* ── Immersive Full Screen Event Poster Lightbox ── */}
      <AnimatePresence>
        {isPosterFullScreen && poster.image && (
          <div className="fixed inset-0 z-[120] h-[100dvh] max-h-[100dvh] flex flex-col justify-between p-3 sm:p-6 overflow-y-auto pb-[max(1.25rem,env(safe-area-inset-bottom))]">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPosterFullScreen(false)}
              className="fixed inset-0 bg-slate-950/95 dark:bg-black/95 backdrop-blur-xl cursor-zoom-out"
            />

            {/* Top Bar */}
            <div className="relative z-10 w-full max-w-4xl mx-auto flex items-center justify-between shrink-0 mb-2">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-royal-600/20 border border-royal-400/30 flex items-center justify-center text-royal-400 shrink-0">
                  <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-royal-400 block">
                    Event Poster | {groupName}
                  </span>
                  <h3 className="text-white font-black text-xs sm:text-base tracking-tight uppercase line-clamp-1">
                    {poster.title}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsPosterFullScreen(false)}
                className="p-2 sm:p-2.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-white/10 shrink-0 cursor-pointer"
                aria-label="Close full screen"
                title="Close (Esc)"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Central Full-Screen Poster Display */}
            <div
              className="relative z-10 flex-1 min-h-0 flex items-center justify-center py-2 sm:py-4 w-full"
              onClick={() => setIsPosterFullScreen(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: 'spring', damping: 26, stiffness: 320 }}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center justify-center max-w-[94vw] max-h-[68dvh] sm:max-h-[76dvh] shrink"
              >
                <img
                  src={poster.image}
                  alt={poster.title}
                  className="w-auto h-auto max-w-[92vw] sm:max-w-2xl max-h-[64dvh] sm:max-h-[72dvh] object-contain rounded-2xl shadow-2xl border border-white/10 select-none"
                />
              </motion.div>
            </div>

            {/* Bottom Controls Bar (Permanently visible across all mobile viewports) */}
            <div className="relative z-10 w-full max-w-md mx-auto flex items-center justify-center gap-2.5 sm:gap-3 shrink-0 pt-2 pb-1">
              <a
                href={poster.image}
                download={`${poster.title.replace(/\s+/g, '-')}-Poster`}
                className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-royal-600 hover:bg-royal-500 text-white font-mono text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg transition-all"
              >
                <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Download Poster</span>
              </a>
              <button
                type="button"
                onClick={() => setIsPosterFullScreen(false)}
                className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs sm:text-sm font-mono font-bold transition-colors border border-white/10 cursor-pointer"
              >
                Close Full Screen
              </button>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
