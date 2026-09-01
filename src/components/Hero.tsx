import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Calendar, Volume2 } from 'lucide-react';
import { MagneticButton } from './ui/MagneticButton';
import { LineMaskReveal } from './ui/LineMaskReveal';

interface HeroProps {
  onOpenVisit: () => void;
  onScrollToSermons: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenVisit, onScrollToSermons }) => {
  // Real-time countdown to next Sunday 09:00 AM
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const nextSunday = new Date();
      const currentDay = now.getDay();
      const daysUntilSunday = currentDay === 0 && now.getHours() < 9 ? 0 : (7 - currentDay) % 7 || 7;

      nextSunday.setDate(now.getDate() + daysUntilSunday);
      nextSunday.setHours(9, 0, 0, 0);

      const difference = nextSunday.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative pt-24 pb-20 md:pt-32 md:pb-28 overflow-hidden ambient-bg-glow">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Top Architectural Metadata Strip */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-6 font-mono text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider"
        >
          <div className="flex items-center gap-3">
            <span className="font-semibold text-slate-900 dark:text-slate-200">
              Sunday Gatherings
            </span>
            <span className="hidden sm:inline text-slate-300 dark:text-slate-700">|</span>
            <span className="hidden sm:inline">9:00 AM Life Group & 10:00 AM Worship</span>
          </div>

          <div className="flex items-center gap-2 text-[11px]">
            <span>Brgy. Inicbulan, Bauan, Batangas</span>
          </div>
        </motion.div>

        {/* Master Typographic Statement */}
        <div className="mb-10 md:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-royal-500/10 dark:bg-cobalt-500/20 text-royal-600 dark:text-cobalt-400 font-mono text-xs font-bold uppercase tracking-widest mb-4">
            <span>HELLO!, WE ARE</span>
          </div>

          <LineMaskReveal
            as="h1"
            lines={[
              "INICBULAN FUNDAMENTAL BAPTIST",
              "BIBLE CHURCH, INCORPORATED.",
            ]}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-black tracking-tighter leading-[0.92] text-slate-900 dark:text-white uppercase text-balance"
            lineClassName="text-slate-900 dark:text-white"
          />

          <p className="mt-4 font-mono text-sm sm:text-base md:text-lg uppercase tracking-widest text-slate-500 dark:text-slate-400 font-bold">
            THE CHURCH WITH AN OPEN BIBLE
          </p>
        </div>

        {/* Grid Split: Philosophy Statement & Dual Action Hub */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          {/* Left Column: Statement & Key Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-8"
          >
            <div className="space-y-3">
              <span className="font-mono text-xs uppercase tracking-widest text-royal-500 dark:text-cobalt-400 font-bold block">
                Our Purpose
              </span>
              <p className="text-lg sm:text-xl font-normal text-slate-600 dark:text-slate-300 leading-[1.68] tracking-tight max-w-2xl text-pretty">
                A church that values <strong className="text-slate-900 dark:text-white font-bold">Worship</strong>, grows in <strong className="text-slate-900 dark:text-white font-bold">Fellowship</strong>, engages in <strong className="text-slate-900 dark:text-white font-bold">Evangelism</strong>, equips through <strong className="text-slate-900 dark:text-white font-bold">Discipleship</strong>, trains <strong className="text-slate-900 dark:text-white font-bold">Leaders</strong>, and develops <strong className="text-slate-900 dark:text-white font-bold">Ministries</strong>.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <MagneticButton
                variant="primary"
                size="lg"
                onClick={onOpenVisit}
              >
                <span>Plan Your Sunday Visit</span>
                <Calendar className="w-4 h-4 ml-1" />
              </MagneticButton>

              <MagneticButton
                variant="outline"
                size="lg"
                onClick={onScrollToSermons}
              >
                <span>Listen to Sermons</span>
                <Volume2 className="w-4 h-4 ml-1" />
              </MagneticButton>
            </div>

            {/* Verbatim Core Pillar Metrics */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="space-y-1">
                <span className="block font-mono text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-bold">
                  Location
                </span>
                <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100 block">
                  Inicbulan, Bauan
                </span>
              </div>
              <div className="space-y-1">
                <span className="block font-mono text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-bold">
                  Foundation
                </span>
                <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100 block">
                  Open Bible Exposition
                </span>
              </div>
              <div className="space-y-1">
                <span className="block font-mono text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-bold">
                  Community
                </span>
                <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100 block">
                  5 Core Groups
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Live Gathering Countdown Card (Ambient Shadow, No Hard Borders) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 ambient-card rounded-3xl p-8 sm:p-10 relative"
          >
            <div className="flex items-center justify-between pb-6 mb-8">
              <div className="flex items-center gap-2.5">
                <motion.div
                  animate={{
                    scale: [1, 1.15, 1],
                    opacity: [0.85, 1, 0.85],
                  }}
                  transition={{
                    duration: 2.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="text-royal-500 dark:text-cobalt-400 flex items-center justify-center"
                >
                  <Users className="w-4 h-4" />
                </motion.div>
                <span className="font-mono text-xs uppercase font-bold text-slate-800 dark:text-slate-200 tracking-wider">
                  Next Gathering In
                </span>
              </div>
              <span className="text-[11px] font-mono font-bold uppercase bg-royal-50 dark:bg-royal-500/10 text-royal-600 dark:text-cobalt-400 px-3 py-1 rounded-full">
                JOIN US!
              </span>
            </div>

            {/* Countdown Grid */}
            <div className="grid grid-cols-4 gap-3 text-center mb-8">
              <div className="bg-slate-50/80 dark:bg-obsidian-850 p-4 rounded-2xl">
                <span className="font-mono text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white block">
                  {String(timeLeft.days).padStart(2, '0')}
                </span>
                <span className="font-mono text-[9px] uppercase tracking-widest text-slate-400 dark:text-slate-500 mt-1 block font-semibold">
                  Days
                </span>
              </div>
              <div className="bg-slate-50/80 dark:bg-obsidian-850 p-4 rounded-2xl">
                <span className="font-mono text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white block">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="font-mono text-[9px] uppercase tracking-widest text-slate-400 dark:text-slate-500 mt-1 block font-semibold">
                  Hours
                </span>
              </div>
              <div className="bg-slate-50/80 dark:bg-obsidian-850 p-4 rounded-2xl">
                <span className="font-mono text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white block">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="font-mono text-[9px] uppercase tracking-widest text-slate-400 dark:text-slate-500 mt-1 block font-semibold">
                  Mins
                </span>
              </div>
              <div className="bg-slate-50/80 dark:bg-obsidian-850 p-4 rounded-2xl">
                <span className="font-mono text-2xl sm:text-3xl font-extrabold text-royal-500 dark:text-cobalt-400 block">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="font-mono text-[9px] uppercase tracking-widest text-slate-400 dark:text-slate-500 mt-1 block font-semibold">
                  Secs
                </span>
              </div>
            </div>

            {/* Sunday Schedule Preview */}
            <div className="bg-slate-50/80 dark:bg-obsidian-850 p-5 rounded-2xl space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-royal-500/10 dark:bg-cobalt-500/20 text-royal-600 dark:text-cobalt-400 font-bold text-xs">
                  9:00 AM - Life Group
                </span>
                <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500">Departamental</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-200/70 dark:bg-obsidian-800 text-slate-600 dark:text-slate-400 font-medium text-xs">
                  10:00 AM - Worship Service
                </span>
                <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500">Worship Hall</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
