import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import {
  MapPin,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Pause,
  Play,
} from 'lucide-react';

interface ServiceScheduleProps {
  onOpenVisit: (serviceTime?: string) => void;
}

interface WeeklyServiceItem {
  id: string;
  day: string;
  time: string;
  service: string;
  category: string;
  description: string;
  location: string;
  frequency: string;
  features: string[];
  image: string;
}

const weeklyServices: WeeklyServiceItem[] = [
  {
    id: 'sun-lifegroup',
    day: 'Sunday',
    time: '9:00 AM',
    service: 'Life Group',
    category: 'Sunday Morning Discipleship',
    description: 'Small group biblical discussion, age-graded Sunday school classes (Kiddos, Adelphoi, CAYA, A-Men, Womisso), scripture study, and personal fellowship before the main worship gathering.',
    location: 'IFBBC Classrooms & Fellowship Hall',
    frequency: 'Weekly',
    features: ['Age-Graded Life Groups', 'Interactive Bible Study', 'Prayer Support', 'Spiritual Pathway'],
    image: '/Schedule%20-%20Life%20Group.jpg',
  },
  {
    id: 'sun-worship',
    day: 'Sunday',
    time: '10:00 AM',
    service: 'Worship Service',
    category: 'Corporate Lord\'s Day Gathering',
    description: 'Our primary congregational gathering featuring reverent praise, corporate prayer, congregational singing, and solid verse-by-verse expository preaching from the King James / Open Bible.',
    location: 'Worship Hall',
    frequency: 'Weekly',
    features: ['Expository Preaching', 'Corporate Hymns & Praise', 'Communion & Tithes', 'Nursery Care'],
    image: '/Schedule%20-%20Worship%20Service.jpg',
  },
  {
    id: 'sun-prayer-fasting',
    day: 'Sunday',
    time: '10:00 AM',
    service: 'Prayer & Fasting Service (Quarterly)',
    category: 'Quarterly Consecration',
    description: 'A dedicated quarterly season of church-wide prayer, fasting, personal confession, spiritual renewal, and seeking God’s guidance for our mission fields and outreaches.',
    location: 'Worship Hall',
    frequency: 'Quarterly',
    features: ['Corporate Intercession', 'Mission Field Focus', 'Spiritual Consecration', 'Pastoral Blessing'],
    image: '/Schedule%20-%20Prayer%20and%20Fasting.jpg',
  },
  {
    id: 'wed-prayer',
    day: 'Wednesday',
    time: '6:00 PM',
    service: 'Prayer Meeting',
    category: 'Midweek Spiritual Anchor',
    description: 'Midweek gathering for biblical exhortation and intensive prayer for sick members, church families, pastoral guidance, local government, and worldwide missions.',
    location: 'Worship Hall',
    frequency: 'Weekly',
    features: ['Pastoral Exhortation', 'Corporate Prayer Requests', 'Testimony Sharing', 'Family Intercession'],
    image: '/Schedule%20-%20Prayer%20Meeting.jpg',
  },
  {
    id: 'fri-cottage',
    day: 'Friday',
    time: '6:00 PM',
    service: 'Cottage Service',
    category: 'Home & Community Fellowship',
    description: 'Intimate neighborhood home gatherings hosted across various puroks and barangays in Bauan for evangelism, warm fellowship, and grassroots discipleship.',
    location: 'Designated Member Homes',
    frequency: 'Weekly',
    features: ['Home Fellowship', 'Neighborhood Evangelism', 'Shared Food & Koinonia', 'Personal Testimony'],
    image: '/Schedule%20-%20Cottage%20Service.jpg',
  },
  {
    id: 'sat-missions',
    day: 'Saturday',
    time: '2:00 PM',
    service: 'Missions',
    category: 'Evangelistic Outreach & Planting',
    description: 'Practical Gospel mobilization, street preaching, Bible distribution, medical/mercy outreaches, and supporting satellite mission points and church plants in Batangas province.',
    location: 'Batangas Outreaches (Cupang, Calumpang, & Paraiso)',
    frequency: 'Weekly',
    features: ['Gospel Outreach', 'Tract Distribution', 'Community Mercy', 'Youth Mobilization'],
    image: '/Schedule%20-%20Missions.jpg',
  },
];

// ── 3D Interactive Rectangular Carousel Card Component ──
interface ScheduleCard3DProps {
  service: WeeklyServiceItem;
  isToday: boolean;
  onExpand: (service: WeeklyServiceItem) => void;
  onHoverChange: (hovered: boolean) => void;
}

const ScheduleCard3D: React.FC<ScheduleCard3DProps> = ({
  service,
  isToday,
  onExpand,
  onHoverChange,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse coords (-0.5 to 0.5)
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Responsive, noticeable 3D tilt angles for the carousel card
  const springConfig = { stiffness: 220, damping: 20, mass: 0.6 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [14, -14]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-16, 16]), springConfig);

  // Dynamic cursor spotlight position for unclicked card
  const [cursorPos, setCursorPos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width;
    const relY = (e.clientY - rect.top) / rect.height;
    x.set(relX - 0.5);
    y.set(relY - 0.5);
    setCursorPos({ x: Math.round(relX * 100), y: Math.round(relY * 100) });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    onHoverChange(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    onHoverChange(false);
    x.set(0);
    y.set(0);
    setCursorPos({ x: 50, y: 50 });
  };

  return (
    <div style={{ perspective: 1200 }} className="h-full w-full select-none">
      <motion.div
        ref={cardRef}
        role="button"
        tabIndex={0}
        aria-label={`${service.service} - ${service.day} ${service.time}`}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => onExpand(service)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onExpand(service);
          }
        }}
        animate={{
          y: isHovered ? -12 : 0,
          scale: isHovered ? 1.03 : 1,
        }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className={`group relative w-full aspect-[16/10] rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer border transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-royal-500/50 ${isToday
          ? 'border-royal-500/70 dark:border-cobalt-400/80 shadow-[0_15px_35px_-5px_rgba(59,130,246,0.4)]'
          : 'border-slate-200/80 dark:border-white/10 hover:border-royal-500/60 dark:hover:border-cobalt-400/60 hover:shadow-[0_20px_45px_rgba(0,0,0,0.35)]'
          }`}
      >
        {/* Full Landscape Event Poster */}
        <img
          src={service.image}
          alt={service.service}
          className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-105"
        />

        {/* Multi-Stage Cinematic Vignette Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/45 to-slate-950/20 z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/50 via-transparent to-slate-950/30 z-[1]" />

        {/* Dynamic Cursor-Tracked Specular Spotlight Glare */}
        <div
          className={`absolute inset-0 pointer-events-none transition-opacity duration-500 z-[2] ${isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          style={{
            background: `radial-gradient(circle 280px at ${cursorPos.x}% ${cursorPos.y}%, rgba(255,255,255,0.3) 0%, rgba(56,189,248,0.15) 35%, transparent 70%)`,
          }}
        />

        {/* Glowing Animated Diagonal Light Sweep (Smooth Holographic / Metallic Shine) */}
        <div
          className={`absolute -inset-[150%] z-[3] pointer-events-none transition-opacity duration-700 ${isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          style={{
            background:
              'linear-gradient(115deg, transparent 38%, rgba(255,255,255,0.05) 42%, rgba(56,189,248,0.4) 47%, rgba(255,255,255,0.85) 50%, rgba(244,114,182,0.4) 53%, rgba(255,255,255,0.05) 58%, transparent 62%)',
            transform: isHovered
              ? 'translate3d(45%, 45%, 0) rotate(-25deg)'
              : 'translate3d(-55%, -55%, 0) rotate(-25deg)',
            transition: 'transform 1.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease',
          }}
        />

        {/* Floating 3D Content Layers */}
        <div
          style={{ transform: 'translateZ(26px)' }}
          className="relative z-[2] p-4 sm:p-5 md:p-6 h-full flex flex-col justify-between"
        >
          {/* Top Row: Today Badge if active (time on top and weekly removed) */}
          <div className="flex items-center justify-end min-h-[26px]">
            {isToday && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-royal-500 text-white font-mono text-[10px] font-black uppercase tracking-widest shadow-lg animate-pulse">
                Today
              </span>
            )}
          </div>

          {/* Bottom Content: Name & Time */}
          <div className="space-y-1">
            <h3 className="text-lg sm:text-xl font-black text-white tracking-tight uppercase line-clamp-1 group-hover:text-sky-300 transition-colors duration-300 drop-shadow-md">
              {service.service}
            </h3>

            <div className="flex items-center justify-between text-xs pt-0.5">
              <span className="font-mono text-[11px] sm:text-xs text-slate-200 drop-shadow-sm flex items-center gap-1.5">
                <span className="text-royal-400 dark:text-cobalt-400 font-bold uppercase">{service.day}</span>
                <span className="font-medium text-slate-100">{service.time}</span>
              </span>

              <span className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center text-white shadow-sm opacity-0 group-hover:opacity-100 hover:scale-110 transition-all duration-300 shrink-0">
                <Maximize2 className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// ── Interactive Poster Component inside the Opened/Expanded Card ──
interface ExpandedPosterInteractiveProps {
  image: string;
  title: string;
  isToday: boolean;
}

const ExpandedPosterInteractive: React.FC<ExpandedPosterInteractiveProps> = ({
  image,
  title,
  isToday,
}) => {
  const posterRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse coords (-0.5 to 0.5)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring physics for the opened card's poster
  const springConfig = { stiffness: 160, damping: 24, mass: 1 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), springConfig);

  // Dynamic specular spotlight coordinates
  const [spotlightPos, setSpotlightPos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!posterRef.current) return;
    const rect = posterRef.current.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width;
    const relY = (e.clientY - rect.top) / rect.height;
    mouseX.set(relX - 0.5);
    mouseY.set(relY - 0.5);
    setSpotlightPos({ x: Math.round(relX * 100), y: Math.round(relY * 100) });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
    setSpotlightPos({ x: 50, y: 50 });
  };

  return (
    <div style={{ perspective: 1200 }} className="relative w-full mb-6 select-none">
      <motion.div
        ref={posterRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className={`group relative w-full aspect-[16/9] rounded-2xl overflow-hidden border transition-all duration-700 cursor-crosshair ${isHovered
          ? 'shadow-[0_25px_60px_rgba(0,0,0,0.5),0_0_40px_rgba(56,189,248,0.3)] border-sky-400/40'
          : isToday
            ? 'shadow-[0_15px_35px_rgba(0,0,0,0.3),0_0_30px_rgba(59,130,246,0.3)] border-royal-500/50'
            : 'shadow-xl border-slate-200/80 dark:border-white/10'
          }`}
      >
        {/* High-Resolution Landscape Poster Image with Slow Cinematic Scale */}
        <motion.img
          src={image}
          alt={title}
          animate={{ scale: isHovered ? 1.04 : 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="w-full h-full object-cover object-center"
        />

        {/* Dynamic Cursor-Tracked Specular Spotlight Glare */}
        <div
          className={`absolute inset-0 pointer-events-none transition-opacity duration-600 z-[3] ${isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          style={{
            background: `radial-gradient(circle 320px at ${spotlightPos.x}% ${spotlightPos.y}%, rgba(255,255,255,0.35) 0%, rgba(56,189,248,0.18) 35%, transparent 70%)`,
          }}
        />

        {/* Holographic Prismatic Diagonal Sweep on Hover */}
        <div
          className={`absolute -inset-[150%] z-[3] pointer-events-none transition-opacity duration-700 ${isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          style={{
            background:
              'linear-gradient(115deg, transparent 38%, rgba(255,255,255,0.08) 43%, rgba(56,189,248,0.35) 47%, rgba(255,255,255,0.85) 50%, rgba(244,114,182,0.35) 53%, transparent 60%)',
            transform: isHovered
              ? 'translate3d(45%, 45%, 0) rotate(-25deg)'
              : 'translate3d(-55%, -55%, 0) rotate(-25deg)',
            transition: 'transform 1.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease',
          }}
        />

        {/* Multi-Stage Cinematic Vignette Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent z-[2]" />

        {/* Title Floating In 3D Space */}
        <div
          style={{ transform: 'translateZ(28px)' }}
          className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 right-4 sm:right-6 text-white z-[4]"
        >
          <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight drop-shadow-md">
            {title}
          </h3>
        </div>
      </motion.div>
    </div>
  );
};

export const ServiceSchedule: React.FC<ServiceScheduleProps> = ({ onOpenVisit: _onOpenVisit }) => {
  // Determine today's day of week
  const todayDayName = useMemo(() => {
    return new Date().toLocaleDateString('en-US', { weekday: 'long' });
  }, []);

  // Check if today has any scheduled service
  const todayServices = useMemo(() => {
    return weeklyServices.filter(
      (s) => s.day.toLowerCase() === todayDayName.toLowerCase()
    );
  }, [todayDayName]);

  const hasEventToday = todayServices.length > 0;

  // Selected event for the click-to-expand modal
  const [expandedService, setExpandedService] = useState<WeeklyServiceItem | null>(null);

  // Active highlighted row for summary table
  const [activeTableId, setActiveTableId] = useState<string | null>(
    hasEventToday ? todayServices[0].id : null
  );

  // Carousel State: 3 cards visible at a time
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isHoveringCard, setIsHoveringCard] = useState(false);

  // 3D Tilt for the Clicked/Expanded Modal Card itself
  const modalCardRef = useRef<HTMLDivElement>(null);
  const modalMouseX = useMotionValue(0);
  const modalMouseY = useMotionValue(0);
  const modalSpringConfig = { stiffness: 180, damping: 22, mass: 0.8 };
  const modalRotateX = useSpring(useTransform(modalMouseY, [-0.5, 0.5], [6, -6]), modalSpringConfig);
  const modalRotateY = useSpring(useTransform(modalMouseX, [-0.5, 0.5], [-7, 7]), modalSpringConfig);

  const handleModalMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!modalCardRef.current) return;
    const rect = modalCardRef.current.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width;
    const relY = (e.clientY - rect.top) / rect.height;
    modalMouseX.set(relX - 0.5);
    modalMouseY.set(relY - 0.5);
  };

  const handleModalMouseLeave = () => {
    modalMouseX.set(0);
    modalMouseY.set(0);
  };

  // Maximum index so exactly 3 cards remain in view at end of line (6 items - 3 visible = maxIndex 3)
  const maxIndex = Math.max(0, weeklyServices.length - 3);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  // Relaxed auto-traversing timer (6.5s) that pauses on card hover, modal open, or manual pause
  useEffect(() => {
    if (isPaused || isHoveringCard || expandedService !== null) return;

    const interval = setInterval(() => {
      handleNext();
    }, 6500);

    return () => clearInterval(interval);
  }, [isPaused, isHoveringCard, expandedService, handleNext]);

  // Keyboard navigation for modal & carousel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setExpandedService(null);
      } else if (expandedService === null) {
        if (e.key === 'ArrowLeft') handlePrev();
        if (e.key === 'ArrowRight') handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [expandedService, handleNext, handlePrev]);

  return (
    <section id="schedule" className="pt-6 pb-12 sm:pt-8 sm:pb-16 md:pt-10 md:pb-20 scroll-mt-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-8 md:mb-10 gap-4 sm:gap-6 pb-4 sm:pb-6 border-b border-slate-200/80 dark:border-white/5">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-royal-500 dark:text-cobalt-400 font-bold block mb-2">
              Schedules
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white uppercase text-balance">
              Weekly Service Schedule
            </h2>
          </div>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-md leading-[1.68] text-pretty">
            Join us throughout the week as we gather for biblical preaching, departmental life groups, corporate prayer, and youth fellowship.
          </p>
        </div>

        {/* Compact & Flush Schedule Summary Table */}
        <div className="ambient-card rounded-2xl sm:rounded-3xl p-3 sm:p-5 mb-12 max-w-2xl mx-auto overflow-hidden shadow-lg border border-slate-200/80 dark:border-white/10">
          <table className="w-full text-xs sm:text-sm border-separate border-spacing-y-1">
            <thead>
              <tr className="font-mono text-[10px] sm:text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500">
                <th className="pb-2 px-3 sm:px-4 font-bold text-left">Day</th>
                <th className="pb-2 px-3 sm:px-4 font-bold text-center">Time</th>
                <th className="pb-2 px-3 sm:px-4 font-bold text-right">Service / Gathering</th>
              </tr>
            </thead>
            <tbody>
              {weeklyServices.map((s) => {
                const isTodayEvent = hasEventToday && s.day.toLowerCase() === todayDayName.toLowerCase();
                const isSelected = activeTableId === s.id;

                return (
                  <tr
                    key={s.id}
                    onClick={() => {
                      setActiveTableId(isSelected ? null : s.id);
                      setExpandedService(s);
                    }}
                    className={`group cursor-pointer transition-all duration-300 ${isTodayEvent
                      ? 'bg-royal-500/15 dark:bg-cobalt-500/20 shadow-[0_0_20px_-3px_rgba(59,130,246,0.35)] ring-1 ring-royal-500/40 dark:ring-cobalt-400/50 rounded-xl'
                      : isSelected
                        ? 'bg-slate-100/80 dark:bg-obsidian-800/80 rounded-xl'
                        : 'hover:bg-slate-100/60 dark:hover:bg-obsidian-800/60 hover:-translate-y-0.5'
                      }`}
                  >
                    <td className="py-3 px-3 sm:px-4 font-bold font-mono text-left whitespace-nowrap first:rounded-l-xl">
                      <div className="flex items-center gap-2">
                        <span className={isTodayEvent ? 'text-royal-600 dark:text-cobalt-400 font-black' : 'text-slate-900 dark:text-white'}>
                          {s.day}
                        </span>
                        {isTodayEvent && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-royal-500 text-white uppercase tracking-wider shadow-sm">
                            Today
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3 sm:px-4 font-bold text-royal-500 dark:text-cobalt-400 font-mono text-center whitespace-nowrap">
                      {s.time}
                    </td>
                    <td className="py-3 px-3 sm:px-4 font-extrabold text-slate-900 dark:text-slate-100 text-right whitespace-nowrap last:rounded-r-xl">
                      {s.service}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ── Interactive Horizontal Carousel (3 Rectangular Cards Visible at a Time) ── */}
        <div className="relative">
          {/* Carousel Control Bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-wider font-bold text-slate-900 dark:text-white">
                Schedule Gallery
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Autoplay / Pause Toggle */}
              <button
                onClick={() => setIsPaused((prev) => !prev)}
                className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-obsidian-800 dark:hover:bg-obsidian-750 text-slate-600 dark:text-slate-300 transition-colors duration-300 cursor-pointer"
                title={isPaused ? 'Resume auto-scroll' : 'Pause auto-scroll'}
                aria-label={isPaused ? 'Resume auto-scroll' : 'Pause auto-scroll'}
              >
                {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              </button>

              {/* Prev Navigation Button */}
              <button
                onClick={handlePrev}
                className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-obsidian-800 dark:hover:bg-obsidian-750 text-slate-800 dark:text-white transition-colors duration-300 cursor-pointer"
                aria-label="Previous service cards"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Next Navigation Button */}
              <button
                onClick={handleNext}
                className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-obsidian-800 dark:hover:bg-obsidian-750 text-slate-800 dark:text-white transition-colors duration-300 cursor-pointer"
                aria-label="Next service cards"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Carousel Viewport (Strictly 3 cards visible) */}
          <div className="overflow-hidden rounded-3xl py-4 -mx-2 px-2">
            <motion.div
              animate={{
                x: `-${currentIndex * (100 / 3)}%`,
              }}
              transition={{
                duration: 1.05,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="flex"
              style={{
                width: '100%',
              }}
            >
              {weeklyServices.map((service) => {
                const isTodayEvent =
                  hasEventToday && service.day.toLowerCase() === todayDayName.toLowerCase();

                return (
                  <div
                    key={service.id}
                    className="shrink-0 w-full sm:w-1/2 lg:w-1/3 px-2 sm:px-3"
                  >
                    <ScheduleCard3D
                      service={service}
                      isToday={isTodayEvent}
                      onExpand={(svc) => setExpandedService(svc)}
                      onHoverChange={(hovered) => setIsHoveringCard(hovered)}
                    />
                  </div>
                );
              })}
            </motion.div>
          </div>

          {/* Carousel Pagination Dots */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all duration-500 cursor-pointer ${currentIndex === idx
                  ? 'w-8 bg-royal-500 dark:bg-cobalt-400 shadow-sm'
                  : 'w-2 bg-slate-300 dark:bg-obsidian-700 hover:bg-slate-400'
                  }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* ── Click-to-Expand Full Event Poster & Detailed Modal ── */}
        <AnimatePresence>
          {expandedService && (
            <div
              style={{ perspective: 1400 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10"
            >
              {/* Backdrop with Smooth Blur */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                onClick={() => {
                  setExpandedService(null);
                  handleModalMouseLeave();
                }}
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-md cursor-pointer"
              />

              {/* Expanded Card Modal itself with 3D Perspective Tilt & Ambient Depth */}
              <motion.div
                ref={modalCardRef}
                onMouseMove={handleModalMouseMove}
                onMouseLeave={handleModalMouseLeave}
                initial={{ opacity: 0, scale: 0.92, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: 16 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  rotateX: modalRotateX,
                  rotateY: modalRotateY,
                  transformStyle: 'preserve-3d',
                }}
                className="relative z-10 w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white/95 dark:bg-obsidian-900/95 backdrop-blur-xl border border-slate-200 dark:border-white/10 shadow-[0_25px_70px_rgba(0,0,0,0.5),0_0_60px_rgba(59,130,246,0.18)] p-5 sm:p-6"
              >
                {/* Close Button */}
                <button
                  onClick={() => {
                    setExpandedService(null);
                    handleModalMouseLeave();
                  }}
                  className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-obsidian-800 dark:hover:bg-obsidian-750 text-slate-600 dark:text-slate-300 transition-all duration-300 hover:scale-110 cursor-pointer shadow-md"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Interactive 3D Landscape Poster with Mouse Tracking & Spotlight Glare */}
                <ExpandedPosterInteractive
                  image={expandedService.image}
                  title={expandedService.service}
                  isToday={hasEventToday && expandedService.day.toLowerCase() === todayDayName.toLowerCase()}
                />

                {/* Details Body */}
                <div className="space-y-4 sm:space-y-5">
                  {/* Schedule Meta Badges */}
                  <div className="flex flex-wrap items-center gap-2.5">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-royal-500/10 dark:bg-cobalt-500/20 text-royal-600 dark:text-cobalt-400 font-mono text-xs font-bold uppercase tracking-wider border border-royal-500/20">
                      <span>
                        {expandedService.day} {expandedService.time}
                      </span>
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-obsidian-800 text-slate-600 dark:text-slate-300 font-mono text-xs font-semibold border border-slate-200/60 dark:border-white/5">
                      <MapPin className="w-3.5 h-3.5 text-royal-500 dark:text-cobalt-400" />
                      <span>{expandedService.location}</span>
                    </div>

                    {hasEventToday &&
                      expandedService.day.toLowerCase() === todayDayName.toLowerCase() && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-royal-500 text-white font-mono text-xs font-black uppercase tracking-wider shadow-md animate-pulse">
                          Today's Service
                        </span>
                      )}
                  </div>

                  {/* Full Description */}
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed text-pretty">
                    {expandedService.description}
                  </p>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
