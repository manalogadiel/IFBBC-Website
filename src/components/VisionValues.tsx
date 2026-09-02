import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  BookOpen,
  Heart,
  Shield,
  Compass,
  CheckCircle2,
  Users,
  Layers,
  Grid,
  Play,
  Pause,
  ArrowRight,
  Quote
} from 'lucide-react';
import { ActivePillarModal } from './ui/ActivePillarModal';

const PURPOSE_PILLARS = [
  {
    title: 'Worship',
    image: '/Purpose - Worship.jpg',
    description: 'Exalting God through reverent, Spirit-led corporate worship \u2014 praising Him in spirit and truth every Lord\u0027s Day.',
  },
  {
    title: 'Fellowship',
    image: '/Purpose - Fellowship.jpg',
    description: 'Building authentic covenant community through genuine koinonia, mutual encouragement, and bearing one another\u0027s burdens.',
  },
  {
    title: 'Evangelism',
    image: '/Purpose - Evangelism.jpg',
    description: 'Proclaiming the Gospel of Jesus Christ locally in Bauan and supporting global church planting and mission outreach.',
  },
  {
    title: 'Discipleship',
    image: '/Purpose - Discipleship.jpg',
    description: 'Equipping believers through Life Groups, mentorship pathways, and systematic verse-by-verse Bible study.',
  },
  {
    title: 'Leadership',
    image: '/Purpose - Leadership.jpg',
    description: 'Training faithful servant-leaders who shepherd with integrity, accountability, and a passion for God\u0027s flock.',
  },
  {
    title: 'Ministries',
    image: '/Purpose - Ministries.jpg',
    description: 'Deploying spiritual gifts through intentional ministry teams \u2014 from music to ushering to audiovisual service.',
  },
];

interface CoreValue {
  number: string;
  title: string;
  category: 'word' | 'community' | 'leadership';
  categoryLabel: string;
  description: string;
  scripture: string;
  application: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
}

export const VisionValues: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [viewMode, setViewMode] = useState<'swipe' | 'grid'>('swipe');
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedPillar, setSelectedPillar] = useState<(typeof PURPOSE_PILLARS)[0] | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Keyboard navigation for expanded purpose pillar view
  useEffect(() => {
    if (!selectedPillar) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedPillar(null);
      } else if (e.key === 'ArrowRight') {
        const currIdx = PURPOSE_PILLARS.findIndex((p) => p.title === selectedPillar.title);
        setSelectedPillar(PURPOSE_PILLARS[(currIdx + 1) % PURPOSE_PILLARS.length]);
      } else if (e.key === 'ArrowLeft') {
        const currIdx = PURPOSE_PILLARS.findIndex((p) => p.title === selectedPillar.title);
        setSelectedPillar(PURPOSE_PILLARS[(currIdx - 1 + PURPOSE_PILLARS.length) % PURPOSE_PILLARS.length]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPillar]);

  const coreValues: CoreValue[] = [
    {
      number: '01',
      title: 'We value the Word of God and its doctrines',
      category: 'word',
      categoryLabel: 'Word & Doctrine',
      description: 'The inerrant Scriptures serve as our supreme standard for all faith, doctrine, teaching, and congregational practice.',
      scripture: '2 Timothy 3:16-17 • "All scripture is given by inspiration of God, and is profitable for doctrine..."',
      application: 'Uncompromising expository pulpit preaching, systematic verse-by-verse doctrine, and personal Bible intake.',
      icon: BookOpen,
      accentColor: 'from-blue-600/20 to-indigo-600/20',
    },
    {
      number: '02',
      title: 'We value corporate worship and fellowship',
      category: 'community',
      categoryLabel: 'Corporate Life',
      description: 'Gathering regularly in unified worship, praising our God in spirit and truth while strengthening our bond in Christ.',
      scripture: 'Hebrews 10:24-25 • "Not forsaking the assembling of ourselves together, as the manner of some is..."',
      application: 'Reverent liturgical Sunday worship, united prayer meetings, and sincere Christian koinonia.',
      icon: Heart,
      accentColor: 'from-rose-600/20 to-red-600/20',
    },
    {
      number: '03',
      title: "We value every church's family",
      category: 'community',
      categoryLabel: 'Family Discipleship',
      description: 'Nurturing covenant homes, supporting parents, children, and intergenerational faithfulness within the body of Christ.',
      scripture: 'Joshua 24:15 • "As for me and my house, we will serve the Lord."',
      application: 'Family-centered ministries, marital equipping, and raising a godly generation from Kiddos to Adelphoi.',
      icon: Shield,
      accentColor: 'from-emerald-600/20 to-teal-600/20',
    },
    {
      number: '04',
      title: "We value individual's spiritual growth",
      category: 'word',
      categoryLabel: 'Personal Sanctification',
      description: 'Cultivating personal sanctification, deeper prayer lives, and mature Christlikeness in every believer.',
      scripture: '2 Peter 3:18 • "Grow in grace, and in the knowledge of our Lord and Saviour Jesus Christ."',
      application: 'Daily devotional rhythms, personal accountability, and continuous transformation into the likeness of Christ.',
      icon: Sparkles,
      accentColor: 'from-amber-600/20 to-orange-600/20',
    },
    {
      number: '05',
      title: 'We value godly testimony to our community',
      category: 'community',
      categoryLabel: 'Civic Witness',
      description: 'Reflecting the character of Jesus Christ through practical compassion, integrity, and love across Bauan and beyond.',
      scripture: 'Matthew 5:16 • "Let your light so shine before men, that they may see your good works..."',
      application: 'Community outreach, benevolent aid, spotless workplace ethics, and radiant public Christian testimony.',
      icon: Compass,
      accentColor: 'from-cyan-600/20 to-sky-600/20',
    },
    {
      number: '06',
      title: "We value church's by laws and constitution",
      category: 'leadership',
      categoryLabel: 'Biblical Governance',
      description: 'Upholding orderly biblical governance, transparency, accountability, and wise stewardship of God’s house.',
      scripture: '1 Corinthians 14:40 • "Let all things be done decently and in order."',
      application: 'Transparent financial stewardship, orderly congregational order, and structural biblical integrity.',
      icon: Shield,
      accentColor: 'from-purple-600/20 to-violet-600/20',
    },
    {
      number: '07',
      title: 'We value church activities and ministries',
      category: 'community',
      categoryLabel: 'Ministry Deployment',
      description: 'Providing intentional environments for spiritual service, connection, mutual encouragement, and spiritual gifts.',
      scripture: '1 Peter 4:10 • "As every man hath received the gift, even so minister the same one to another..."',
      application: 'Active volunteerism, music ministry, ushering, audiovisual service, and ministry development cohorts.',
      icon: Sparkles,
      accentColor: 'from-fuchsia-600/20 to-pink-600/20',
    },
    {
      number: '08',
      title: 'We value discipleship through life group and spiritual pathway',
      category: 'word',
      categoryLabel: 'Life Groups',
      description: 'Equipping believers through intentional small group community, mentorship, and clear stages of biblical growth.',
      scripture: '2 Timothy 2:2 • "And the things that thou hast heard of me... the same commit thou to faithful men..."',
      application: 'Sunday 9:00 AM Life Groups, one-on-one discipling pathways, and leader-in-training tracks.',
      icon: Users,
      accentColor: 'from-blue-600/20 to-teal-600/20',
    },
    {
      number: '09',
      title: 'We value our mission fields and outreaches',
      category: 'leadership',
      categoryLabel: 'Great Commission',
      description: 'Faithfully propagating the Gospel of Jesus Christ locally in Batangas and supporting global church planting.',
      scripture: 'Mark 16:15 • "Go ye into all the world, and preach the gospel to every creature."',
      application: 'Saturday 2:00 PM Missions, mission field support, community Bible studies, and church multiplication.',
      icon: Compass,
      accentColor: 'from-amber-600/20 to-red-600/20',
    },
    {
      number: '10',
      title: 'We value our Pastors and church leaders',
      category: 'leadership',
      categoryLabel: 'Pastoral Care',
      description: 'Honoring, praying for, and supporting the under-shepherds God has called to feed and lead the flock.',
      scripture: '1 Thessalonians 5:12-13 • "And we beseech you, brethren, to know them which labour among you..."',
      application: 'Sustained intercession for Senior Pastor Rev. Pallones and Youth Pastor Lualhati, pastoral care, and co-laboring.',
      icon: CheckCircle2,
      accentColor: 'from-royal-600/20 to-cobalt-600/20',
    },
  ];

  // Autoplay loop when active (pauses on hover or active dragging)
  useEffect(() => {
    if (!isAutoplay || viewMode !== 'swipe' || isHovered || dragActive) return;
    const interval = setInterval(() => {
      paginate(1);
    }, 4500);
    return () => clearInterval(interval);
  }, [isAutoplay, currentIndex, viewMode, isHovered, dragActive]);

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prev) => {
      let next = prev + newDirection;
      if (next < 0) next = coreValues.length - 1;
      if (next >= coreValues.length) next = 0;
      return next;
    });
  };

  const jumpTo = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (viewMode !== 'swipe') return;
    if (e.key === 'ArrowLeft') {
      paginate(-1);
    } else if (e.key === 'ArrowRight') {
      paginate(1);
    }
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.94,
      filter: 'blur(4px)',
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        x: { type: 'spring' as const, stiffness: 350, damping: 32 },
        opacity: { duration: 0.3 },
        scale: { duration: 0.3 },
        filter: { duration: 0.2 },
      },
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.94,
      filter: 'blur(4px)',
      transition: {
        x: { type: 'spring' as const, stiffness: 350, damping: 32 },
        opacity: { duration: 0.25 },
        scale: { duration: 0.25 },
      },
    }),
  };

  const currentVal = coreValues[currentIndex];
  const CurrentIcon = currentVal.icon;

  return (
    <section id="vision-values" className="pt-16 pb-20 md:pt-24 md:pb-32 scroll-mt-24 relative overflow-hidden select-none bg-chalk-50 dark:bg-obsidian-950 border-t border-slate-200/60 dark:border-white/5">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-10 md:mb-16 gap-4 sm:gap-6 md:gap-8 pb-6 sm:pb-8 md:pb-12 border-b border-slate-200/80 dark:border-white/5">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-royal-500 dark:text-cobalt-400 font-bold block mb-2">
              Foundation
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white uppercase text-balance">
              Vision & Core Values
            </h2>
          </div>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-md leading-[1.68] text-pretty">
            Our vision is simple and profound: <strong className="text-slate-900 dark:text-white font-bold">GROWING A HEALTHY CHURCH</strong> through biblically anchored doctrine, covenant fellowship, and sacrificial leadership.
          </p>
        </div>

        {/* Vision & Purpose Dual Architectural Banners + Full-Width Visual Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 mb-8 sm:mb-12 md:mb-16">
          {/* Vision Banner — 6 Columns */}
          <div className="lg:col-span-6 ambient-card rounded-3xl p-8 sm:p-10 space-y-5 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="font-mono text-xs uppercase tracking-widest text-royal-500 dark:text-cobalt-400 font-bold block">
                Our Vision
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                GROWING A HEALTHY CHURCH
              </h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-[1.68] text-pretty">
                A vibrant body of believers rooted in the authority of God's Word, multiplying disciples and glorifying God through spiritual vitality and kingdom faithfulness.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-200/60 dark:border-white/5 flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Biblical Mandate</span>
              <span className="text-royal-500 dark:text-cobalt-400 font-bold">Ephesians 4:15-16</span>
            </div>
          </div>

          {/* Purpose Banner — 6 Columns */}
          <div className="lg:col-span-6 ambient-card rounded-3xl p-8 sm:p-10 space-y-5 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="font-mono text-xs uppercase tracking-widest text-royal-500 dark:text-cobalt-400 font-bold block">
                Our Purpose
              </span>
              <p className="text-sm sm:text-base text-slate-800 dark:text-slate-200 font-medium leading-[1.68] text-pretty">
                A church that values <span className="font-bold text-royal-500 dark:text-cobalt-400">Worship</span>, grows in <span className="font-bold text-royal-500 dark:text-cobalt-400">Fellowship</span>, engages in <span className="font-bold text-royal-500 dark:text-cobalt-400">Evangelism</span>, equips through <span className="font-bold text-royal-500 dark:text-cobalt-400">Discipleship</span>, trains <span className="font-bold text-royal-500 dark:text-cobalt-400">Leaders</span>, and develops <span className="font-bold text-royal-500 dark:text-cobalt-400">Ministries</span>.
              </p>
            </div>

            {/* 6 Purpose Pillars */}
            <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-[11px]">
              {PURPOSE_PILLARS.map((pillar) => (
                <button
                  key={pillar.title}
                  onClick={() => setSelectedPillar(pillar)}
                  className="relative group overflow-hidden py-2.5 px-2 rounded-full flex items-center justify-center text-center font-bold text-white transition-all border border-white/20 dark:border-white/15 hover:border-royal-400/90 dark:hover:border-cobalt-400/90 active:scale-95 shadow-sm hover:shadow-md cursor-pointer select-none"
                >
                  {/* Individual Background Image */}
                  <img
                    src={pillar.image}
                    alt={pillar.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-115 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />
                  {/* Dark Semi-Transparent Overlay (rgba(0,0,0,0.65)) */}
                  <div
                    className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-75"
                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.65)' }}
                  />
                  {/* White Typography - Sharp & Legible */}
                  <span className="relative z-10 font-mono text-[11px] font-bold text-white tracking-wider drop-shadow-[0_1px_2px_rgba(0,0,0,0.95)] truncate px-1">
                    {pillar.title}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Core Values Section Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Our 10 Core Values
              </h3>
              <span className="font-mono text-xs px-2.5 py-1 rounded-full bg-royal-500/10 dark:bg-cobalt-500/20 text-royal-600 dark:text-cobalt-400 font-bold">
                {String(currentIndex + 1).padStart(2, '0')} / 10
              </span>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 block mt-1">
              Swipe or drag cards horizontally to explore each foundational biblical conviction
            </span>
          </div>

          {/* View Mode & Autoplay Controls */}
          <div className="flex items-center gap-3">
            {viewMode === 'swipe' && (
              <button
                onClick={() => setIsAutoplay(!isAutoplay)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono transition-all ${isAutoplay
                  ? 'bg-royal-500 dark:bg-cobalt-500 text-white'
                  : 'bg-slate-100 dark:bg-obsidian-850 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                title={isAutoplay ? 'Pause auto-swipe' : 'Start auto-swipe (5s)'}
              >
                {isAutoplay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{isAutoplay ? 'Auto' : 'Play'}</span>
              </button>
            )}

            {/* View Toggle */}
            <div className="flex items-center p-1 rounded-full bg-slate-100 dark:bg-obsidian-850">
              <button
                onClick={() => setViewMode('swipe')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${viewMode === 'swipe'
                  ? 'bg-white dark:bg-obsidian-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Swipe Deck</span>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${viewMode === 'grid'
                  ? 'bg-white dark:bg-obsidian-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>Grid View</span>
              </button>
            </div>
          </div>
        </div>

        {/* Interactive Swipe UI */}
        {viewMode === 'swipe' ? (
          <div
            ref={containerRef}
            tabIndex={0}
            onKeyDown={handleKeyDown}
            className="outline-none focus:ring-1 focus:ring-royal-500/20 rounded-3xl"
          >
            {/* Main Swipeable Stage */}
            <div
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="relative min-h-[460px] sm:min-h-[420px] flex items-center justify-center overflow-hidden py-4"
            >
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.4}
                  onDragStart={() => setDragActive(true)}
                  onDragEnd={(_e, { offset, velocity }) => {
                    setDragActive(false);
                    const swipe = swipePower(offset.x, velocity.x);
                    if (swipe < -swipeConfidenceThreshold || offset.x < -80) {
                      paginate(1);
                    } else if (swipe > swipeConfidenceThreshold || offset.x > 80) {
                      paginate(-1);
                    }
                  }}
                  className="w-full max-w-3xl ambient-card rounded-3xl p-8 sm:p-12 cursor-grab active:cursor-grabbing relative overflow-hidden"
                >
                  {/* Subtle ambient gradient accent */}
                  <div className="absolute top-0 right-0 w-80 h-80 bg-royal-500/5 dark:bg-cobalt-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

                  {/* Header Row: Number + Tag + Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-3xl sm:text-5xl font-black text-royal-500 dark:text-cobalt-400">
                        {currentVal.number}
                      </span>
                      <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-100 dark:bg-obsidian-850 text-slate-700 dark:text-slate-300">
                        {currentVal.categoryLabel}
                      </span>
                    </div>

                    <div className="w-12 h-12 rounded-2xl bg-royal-500/10 dark:bg-cobalt-500/20 flex items-center justify-center text-royal-500 dark:text-cobalt-400">
                      <CurrentIcon className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Title (Verbatim Core Value) */}
                  <h4 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug mb-4">
                    {currentVal.title}
                  </h4>

                  {/* Description */}
                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-[1.68] text-pretty mb-6">
                    {currentVal.description}
                  </p>

                  {/* Scripture Anchor Quote Box */}
                  <div className="bg-slate-50/80 dark:bg-obsidian-850/80 p-5 rounded-2xl mb-5 space-y-2">
                    <div className="flex items-center gap-2 text-royal-600 dark:text-cobalt-400">
                      <Quote className="w-4 h-4" />
                      <span className="font-mono text-xs font-bold uppercase tracking-wider">
                        Scriptural Foundation
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm font-serif italic text-slate-700 dark:text-slate-300 leading-relaxed">
                      {currentVal.scripture}
                    </p>
                  </div>

                  {/* Practical Ministry Application */}
                  <div className="pt-2 flex items-start gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    <ArrowRight className="w-4 h-4 text-royal-500 dark:text-cobalt-400 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-slate-800 dark:text-slate-200">Church Expression:</strong> {currentVal.application}
                    </span>
                  </div>

                  {/* Drag / Swipe Hint indicator */}
                  <div className="mt-8 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-400 dark:text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-royal-500 dark:bg-cobalt-400 animate-pulse" />
                      {dragActive ? 'Release to flip' : 'Swipe left / right or use buttons'}
                    </span>
                    <span>IFBBC Constitution & Bylaws Art. III</span>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Side Floating Navigation Buttons */}
              <button
                onClick={() => paginate(-1)}
                className="absolute left-2 sm:left-4 z-10 w-11 h-11 sm:w-12 sm:h-12 rounded-full ambient-card flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-royal-500 hover:text-white dark:hover:bg-cobalt-500 transition-all active:scale-95 shadow-md"
                aria-label="Previous Value"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={() => paginate(1)}
                className="absolute right-2 sm:right-4 z-10 w-11 h-11 sm:w-12 sm:h-12 rounded-full ambient-card flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-royal-500 hover:text-white dark:hover:bg-cobalt-500 transition-all active:scale-95 shadow-md"
                aria-label="Next Value"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Quick-Jump Pill Number Selector & Progress Bar */}
            <div className="mt-8 space-y-4">
              {/* Progress Scrubber Bar */}
              <div className="w-full bg-slate-100 dark:bg-obsidian-850 h-1.5 rounded-full overflow-hidden">
                <motion.div
                  className="bg-royal-500 dark:bg-cobalt-500 h-full rounded-full"
                  initial={{ width: `${((currentIndex + 1) / 10) * 100}%` }}
                  animate={{ width: `${((currentIndex + 1) / 10) * 100}%` }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                />
              </div>

              {/* Interactive Number Jump Buttons */}
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                {coreValues.map((val, idx) => {
                  const isActive = idx === currentIndex;
                  return (
                    <button
                      key={val.number}
                      onClick={() => jumpTo(idx)}
                      className={`p-2.5 rounded-2xl flex flex-col items-center justify-center transition-all ${isActive
                        ? 'bg-royal-500 dark:bg-cobalt-500 text-white shadow-md scale-105'
                        : 'bg-slate-100 dark:bg-obsidian-850 text-slate-500 dark:text-slate-400 hover:bg-slate-200/80 dark:hover:bg-obsidian-800'
                        }`}
                    >
                      <span className="font-mono text-xs font-black">{val.number}</span>
                      <span className="text-[9px] font-mono truncate max-w-full hidden sm:block opacity-80">
                        {val.categoryLabel.split(' ')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* Grid View for full overview */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {coreValues.map((val, idx) => {
              const Icon = val.icon;
              return (
                <motion.div
                  key={val.number}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04, duration: 0.3 }}
                  onClick={() => {
                    jumpTo(idx);
                    setViewMode('swipe');
                  }}
                  className="ambient-card rounded-3xl p-8 sm:p-10 space-y-4 relative group cursor-pointer hover:shadow-lg transition-all"
                >
                  <div className="flex items-start justify-between">
                    <span className="font-mono text-2xl sm:text-3xl font-black text-royal-500 dark:text-cobalt-400">
                      {val.number}
                    </span>
                    <div className="w-10 h-10 rounded-2xl bg-royal-500/10 dark:bg-cobalt-500/20 flex items-center justify-center text-royal-500 dark:text-cobalt-400 group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <div>
                    <h4 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
                      {val.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 leading-[1.68] text-pretty">
                      {val.description}
                    </p>
                  </div>

                  <div className="pt-2 text-[11px] font-mono text-royal-500 dark:text-cobalt-400 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Click to open in Swipe Deck</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* High-Impact Expanded Card Modal with Floating Ken-Burns Motion & Elevated Shadow */}
      <AnimatePresence>
        {selectedPillar && (
          <ActivePillarModal
            pillar={selectedPillar}
            allPillars={PURPOSE_PILLARS}
            onClose={() => setSelectedPillar(null)}
            onSelect={(pillar) => setSelectedPillar(pillar)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

