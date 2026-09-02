import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Church,
  Maximize2,
  X,
  Volume2,
  VolumeX,
  MapPin,
  Clock,
  Sparkles,
  Calendar,
} from 'lucide-react';

interface ChurchShowcaseProps {
  className?: string;
}

export const ChurchShowcase: React.FC<ChurchShowcaseProps> = ({ className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isModalVideoLoaded, setIsModalVideoLoaded] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const modalVideoRef = useRef<HTMLVideoElement>(null);

  // Toggle audio inside expanded modal
  const handleToggleAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!modalVideoRef.current) return;
    const nextMuted = !isMuted;
    modalVideoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  return (
    <div className={`w-full ${className}`}>
      {/* ── 1. Collapsed "Our Church" Banner Card ── */}
      <motion.div
        whileHover={{ y: -2 }}
        onClick={() => setIsExpanded(true)}
        className="church-video-container group relative w-full h-48 sm:h-56 md:h-64 cursor-pointer border border-slate-200/80 dark:border-white/10 transition-all duration-300 shadow-md hover:shadow-2xl select-none"
      >
        {/* Seamless Base Poster Layer (Prevents any black flash on initial load or loop) */}
        <img
          src="/hero-poster.webp"
          alt="Inicbulan Fundamental Baptist Bible Church"
          className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Seamless Looping Church Video fitted via object-fit: cover */}
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="/hero-poster.webp"
          onLoadedData={() => setIsVideoLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover object-center church-video-animated pointer-events-none transition-opacity duration-700 ease-in-out ${
            isVideoLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <source src="/Background Church.webm" type="video/webm" />
          <source src="/Background Church.mp4" type="video/mp4" />
        </video>

        {/* Transparent Seamless Gradient Overlays for High-Contrast Typography */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/55 to-slate-950/20 z-[1] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent z-[1] pointer-events-none" />

        {/* Subtle Ambient Brand Glow Accent */}
        <div className="absolute -bottom-6 left-1/4 w-96 h-16 bg-royal-500/25 dark:bg-cobalt-400/35 rounded-full blur-3xl pointer-events-none group-hover:opacity-100 opacity-60 transition-opacity" />

        {/* Banner Content Layout */}
        <div className="absolute inset-0 z-[2] p-5 sm:p-7 md:p-8 flex flex-col justify-between pointer-events-none">
          {/* Top Bar Badges */}
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white font-mono text-[11px] font-bold uppercase tracking-wider shadow-lg">
              <Church className="w-3.5 h-3.5 text-cobalt-400" />
              <span>Inicbulan FBBC • Sanctuary & Fellowship</span>
            </div>

            {/* Expand Action Button */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-royal-500 hover:bg-royal-600 text-white font-mono text-xs font-bold uppercase tracking-wider shadow-lg group-hover:scale-105 transition-transform pointer-events-auto">
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Explore Church</span>
            </div>
          </div>

          {/* Bottom Church Statement */}
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 mb-1.5 text-cobalt-400 font-mono text-xs font-semibold tracking-wider uppercase drop-shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Our Home of Worship</span>
            </div>
            <h4 className="text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-tight leading-tight drop-shadow-md">
              Our Church
            </h4>
            <p className="text-xs sm:text-sm text-slate-200 font-light mt-1 text-pretty leading-relaxed drop-shadow-sm max-w-lg">
              Inicbulan Fundamental Baptist Bible Church — a Christ-centered sanctuary dedicated to biblical doctrine, heartfelt worship, and vibrant community in Bauan, Batangas.
            </p>

            {/* Quick Metadata Badges */}
            <div className="flex flex-wrap items-center gap-3 mt-3">
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-300 bg-white/10 backdrop-blur-sm px-2.5 py-0.5 rounded-full border border-white/10">
                <MapPin className="w-3 h-3 text-cobalt-400" />
                <span>Inicbulan, Bauan, Batangas</span>
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-300 bg-white/10 backdrop-blur-sm px-2.5 py-0.5 rounded-full border border-white/10">
                <Calendar className="w-3 h-3 text-cobalt-400" />
                <span>Sun 9:00 AM & 10:00 AM</span>
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── 2. Interactive Expanded Cinematic Viewport Modal ── */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(16px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => setIsExpanded(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 overflow-hidden"
          >
            {/* Modal Container: Seamless rounded borders with no black edge bleeding */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              onClick={(e) => e.stopPropagation()}
              className="church-video-container relative w-full max-w-5xl h-[60vh] max-h-[540px] min-h-[320px] bg-slate-950 border border-white/20 shadow-[0_30px_90px_rgba(0,0,0,0.95),0_0_80px_rgba(41,121,255,0.25)] flex flex-col select-none"
            >
              {/* Circular X Button on Right Top */}
              <button
                onClick={() => setIsExpanded(false)}
                className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 z-50 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/65 hover:bg-rose-600 text-white flex items-center justify-center backdrop-blur-md border border-white/25 shadow-2xl transition-all active:scale-90 cursor-pointer"
                aria-label="Close church video viewport"
                title="Close (Esc)"
              >
                <X className="w-5 h-5 text-white" />
              </button>

              {/* Seamless Base Poster Layer for Modal */}
              <img
                src="/hero-poster.webp"
                alt="Our Church Sanctuary"
                className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
              />

              {/* Full-Fidelity Looping Church Video fitted via object-fit: cover */}
              <video
                ref={modalVideoRef}
                autoPlay
                loop
                muted={isMuted}
                playsInline
                preload="auto"
                poster="/hero-poster.webp"
                onLoadedData={() => setIsModalVideoLoaded(true)}
                className={`absolute inset-0 w-full h-full object-cover object-center church-video-animated pointer-events-none transition-opacity duration-700 ease-in-out ${
                  isModalVideoLoaded ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <source src="/Background Church.webm" type="video/webm" />
                <source src="/Background Church.mp4" type="video/mp4" />
              </video>

              {/* Seamless Vignette & Dark Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/35 to-slate-950/20 z-[1] pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-slate-950/40 z-[1] pointer-events-none" />

              {/* Top Controls Overlay */}
              <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/65 backdrop-blur-md border border-white/20 text-white font-mono text-xs font-bold uppercase tracking-wider">
                  <Church className="w-4 h-4 text-cobalt-400" />
                  <span>Our Church • Sanctuary Experience</span>
                </div>

                {/* Audio Toggle Button */}
                <button
                  onClick={handleToggleAudio}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/65 hover:bg-black/85 text-white font-mono text-xs font-bold backdrop-blur-md border border-white/20 transition-colors shadow-lg cursor-pointer"
                  title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
                >
                  {isMuted ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                      <span className="hidden sm:inline">Muted</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-cobalt-400 animate-pulse" />
                      <span className="hidden sm:inline">Sound On</span>
                    </>
                  )}
                </button>
              </div>

              {/* Bottom Cinematic Info Card */}
              <div className="absolute bottom-4 inset-x-4 sm:bottom-6 sm:inset-x-6 z-20 flex flex-col sm:flex-row sm:items-end justify-between gap-4 pointer-events-none">
                <div className="max-w-xl">
                  <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight drop-shadow-md">
                    Inicbulan Fundamental Baptist Bible Church
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-200 font-light mt-1 text-pretty leading-relaxed drop-shadow-sm">
                    Reaching our community with the grace of the Gospel, holding uncompromised Baptist heritage, and gathering weekly in spirit and truth.
                  </p>

                  <div className="flex flex-wrap items-center gap-3 mt-3">
                    <span className="inline-flex items-center gap-1.5 text-xs font-mono text-white/90 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full border border-white/15">
                      <MapPin className="w-3.5 h-3.5 text-cobalt-400" />
                      <span>Inicbulan, Bauan, Batangas</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-mono text-white/90 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full border border-white/15">
                      <Clock className="w-3.5 h-3.5 text-cobalt-400" />
                      <span>Sun: 9:00 AM Life Group • 10:00 AM Worship</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pointer-events-auto self-end sm:self-auto">
                  <button
                    onClick={() => setIsExpanded(false)}
                    className="px-4 py-2 rounded-full bg-white/15 hover:bg-white/25 text-white font-mono text-xs font-bold uppercase tracking-wider backdrop-blur-md border border-white/20 transition-all shadow-lg cursor-pointer"
                  >
                    Close View
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
