import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Mail, Facebook, ArrowRight, User, Calendar } from 'lucide-react';

interface Leader {
  name: string;
  role: string;
  title: string;
  demographic: string;
  bio: string;
  focus: string[];
  quote: string;
  email: string;
  facebookName: string;
  facebookUrl: string;
  portrait?: string;
}

interface LeaderCardProps {
  leader: Leader;
  onContact: (name: string) => void;
}

const LeaderProfileCard: React.FC<LeaderCardProps> = ({ leader, onContact }) => {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isSettling, setIsSettling] = useState(false);
  const [isCoarsePointer, setIsCoarsePointer] = useState(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsCoarsePointer(window.matchMedia('(pointer: coarse)').matches);
    }
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isCoarsePointer || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    // Normalize coordinates to [-1, 1] relative to center
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMousePos({ x, y });
  };

  const handleMouseEnter = () => {
    if (!isCoarsePointer) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePos({ x: 0, y: 0 });
  };

  const handlePortraitClick = () => {
    setIsSettling(true);
    setTimeout(() => setIsSettling(false), 450);
  };

  // Parallax offsets (small, smooth shifts, not dramatic tilts)
  const bgOffsetX = isHovered ? mousePos.x * 2 : 0;
  const bgOffsetY = isHovered ? mousePos.y * 2 : 0;

  const glowOffsetX = isHovered ? mousePos.x * 8 : 0;
  const glowOffsetY = isHovered ? mousePos.y * 8 : 0;

  const portraitOffsetX = isHovered ? mousePos.x * 16 : 0;
  const portraitOffsetY = isHovered ? mousePos.y * 14 : 0;

  // Mask image for waist-level crop dissolving into background glow:
  // Visible from stomach up, natural waistline softly feathering down
  const waistMaskStyle: React.CSSProperties = {
    WebkitMaskImage:
      'linear-gradient(to bottom, black 0%, black 55%, rgba(0,0,0,0.85) 68%, rgba(0,0,0,0.3) 84%, transparent 100%)',
    maskImage:
      'linear-gradient(to bottom, black 0%, black 55%, rgba(0,0,0,0.85) 68%, rgba(0,0,0,0.3) 84%, transparent 100%)',
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative rounded-3xl bg-[#060913] border border-white/10 p-6 sm:p-8 md:p-10 lg:p-12 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] transition-all duration-500 overflow-hidden lg:overflow-visible"
      style={{
        transform: `perspective(1000px) rotateX(${isHovered ? -mousePos.y * 1.5 : 0}deg) rotateY(${isHovered ? mousePos.x * 1.5 : 0
          }deg)`,
        transition: isHovered
          ? 'transform 0.15s ease-out'
          : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* ── Desktop Ambient Glow (Layer 1: Deep Back) ── */}
      <div
        className="hidden lg:block absolute -top-24 -right-24 w-96 h-96 rounded-full bg-royal-600/20 blur-[100px] pointer-events-none transition-transform duration-700 ease-out"
        style={{
          transform: `translate3d(${glowOffsetX}px, ${glowOffsetY}px, 0)`,
        }}
      />
      <div
        className="hidden lg:block absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-cobalt-600/15 blur-[100px] pointer-events-none transition-transform duration-700 ease-out"
        style={{
          transform: `translate3d(${-glowOffsetX}px, ${-glowOffsetY}px, 0)`,
        }}
      />

      {/* ── Desktop Subtle Animated Gradient Mesh on Card Body ── */}
      <div
        className="hidden lg:block absolute inset-0 bg-gradient-to-br from-white/[0.03] via-transparent to-royal-500/[0.02] pointer-events-none rounded-3xl transition-transform duration-500"
        style={{
          transform: `translate3d(${bgOffsetX}px, ${bgOffsetY}px, 0)`,
        }}
      />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-center">
        {/* ── Mobile Layout (Contained full-width portrait above text block) ── */}
        <div className="order-1 lg:hidden w-full">
          {leader.portrait ? (
            <div
              onClick={handlePortraitClick}
              className={`relative w-full aspect-[4/5] sm:aspect-[3/4] max-w-sm mx-auto flex items-end justify-center rounded-2xl overflow-hidden bg-gradient-to-b from-[#080d1e] to-[#060913] border border-white/5 cursor-pointer select-none transition-transform duration-500 ${isSettling ? 'scale-[0.985]' : 'scale-100'
                }`}
            >
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(circle at 50% 45%, rgba(37,99,235,0.35) 0%, rgba(30,58,138,0.12) 50%, transparent 75%)',
                }}
              />
              <div className="relative z-10 w-full h-full flex items-end justify-center" style={waistMaskStyle}>
                <img
                  src={leader.portrait}
                  alt={leader.name}
                  className="w-auto h-[95%] max-h-[380px] object-contain object-bottom pointer-events-none select-none"
                  style={{
                    filter:
                      'drop-shadow(0 0 1px rgba(255,255,255,0.22)) drop-shadow(-3px -3px 14px rgba(37,99,235,0.35)) drop-shadow(2px 18px 24px rgba(0,0,0,0.9))',
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="w-full aspect-[4/5] max-w-sm mx-auto rounded-2xl bg-[#0a0f20] border border-white/5 flex flex-col items-center justify-center p-8 text-center text-slate-500">
              <div className="w-16 h-16 rounded-full bg-slate-800/80 flex items-center justify-center mb-3">
                <User className="w-8 h-8 text-slate-500" />
              </div>
              <span className="font-mono text-xs uppercase tracking-wider text-slate-500 font-bold">
                Leadership Profile
              </span>
            </div>
          )}
        </div>

        {/* ── Left Editorial Text Block ── */}
        <div className="order-2 lg:order-1 lg:col-span-7 flex flex-col justify-between space-y-6 relative z-20">
          <div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
              <span className="font-mono text-xs uppercase tracking-widest text-royal-400 font-bold">
                {leader.title}
              </span>
              <span className="text-slate-600 dark:text-slate-500">•</span>
              <span className="text-xs text-slate-400 font-mono tracking-wide">
                {leader.demographic}
              </span>
            </div>
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight uppercase leading-[1.08]">
              {leader.name}
            </h3>
            <p className="text-sm sm:text-base text-slate-300 font-normal leading-[1.75] text-pretty mt-4 sm:mt-5">
              {leader.bio}
            </p>
            <div className="p-4 sm:p-5 rounded-r-2xl bg-white/[0.03] backdrop-blur-md border-l-2 border-[#2563eb] border-y border-r border-white/5 my-6">
              <p className="text-xs sm:text-sm italic text-slate-300 leading-relaxed font-normal">
                {leader.quote}
              </p>
            </div>
          </div>
          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2.5">
              {/* Email Channel */}
              <a
                href={`mailto:${leader.email}`}
                className="group/mail inline-flex items-center gap-2.5 text-xs font-mono text-slate-300 hover:text-royal-400 transition-colors"
                title={`Send email to ${leader.name}`}
              >
                <span className="w-7 h-7 rounded-full bg-white/5 border border-white/15 flex items-center justify-center shrink-0 group-hover/mail:border-royal-400 group-hover/mail:text-royal-400 transition-colors">
                  <Mail className="w-3.5 h-3.5" />
                </span>
                <span className="truncate">{leader.email}</span>
              </a>

              {/* Facebook Channel */}
              {leader.facebookUrl && (
                <a
                  href={leader.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/fb inline-flex items-center gap-2.5 text-xs font-mono text-slate-300 hover:text-royal-400 transition-colors"
                  title={`Open Facebook profile for ${leader.facebookName}`}
                >
                  <span className="w-7 h-7 rounded-full bg-white/5 border border-white/15 flex items-center justify-center shrink-0 group-hover/fb:border-royal-400 group-hover/fb:text-royal-400 transition-colors">
                    <Facebook className="w-3.5 h-3.5" />
                  </span>
                  <span className="truncate font-semibold">{leader.facebookName}</span>
                </a>
              )}
            </div>

            <button
              onClick={() => onContact(leader.name)}
              className="px-5 py-2.5 bg-royal-500 hover:bg-royal-600 active:scale-95 text-white rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg shadow-royal-500/20 cursor-pointer self-start sm:self-center shrink-0"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Contact Pastor</span>
            </button>
          </div>
        </div>

        {/* ── Desktop Portrait (Positioned Right, Depth Extension, 3D Parallax Layers) ── */}
        <div className="hidden lg:flex lg:col-span-5 relative overflow-visible lg:-mr-8 xl:-mr-12 lg:-my-8 xl:-my-12 items-end justify-center z-10 min-h-[440px] xl:min-h-[500px]">
          {leader.portrait ? (
            <div
              onClick={handlePortraitClick}
              className={`relative w-full h-[460px] xl:h-[520px] flex items-end justify-center cursor-pointer select-none transition-transform duration-500 ${isSettling ? 'scale-[0.985]' : 'scale-100'
                }`}
            >
              <div
                className="absolute inset-0 -z-10 pointer-events-none rounded-full blur-3xl transition-all duration-500 ease-out"
                style={{
                  transform: `translate3d(${glowOffsetX}px, ${glowOffsetY}px, 0) scale(${isHovered ? 1.18 : 1})`,
                  opacity: isHovered ? 0.42 : 0.28,
                  background:
                    'radial-gradient(circle at 50% 50%, rgba(37,99,235,0.8) 0%, rgba(30,58,138,0.35) 45%, transparent 72%)',
                }}
              />
              <div
                className="relative z-10 w-full h-full flex items-end justify-center transition-transform duration-300 ease-out"
                style={{
                  transform: `translate3d(${portraitOffsetX}px, ${portraitOffsetY}px, 0)`,
                  ...waistMaskStyle,
                }}
              >
                <img
                  src={leader.portrait}
                  alt={leader.name}
                  className="w-auto h-full max-h-[480px] xl:max-h-[540px] object-contain object-bottom pointer-events-none select-none"
                  style={{
                    filter:
                      'drop-shadow(0 0 1px rgba(255,255,255,0.22)) drop-shadow(-3px -3px 16px rgba(37,99,235,0.38)) drop-shadow(2px 20px 28px rgba(0,0,0,0.85)) drop-shadow(4px 38px 52px rgba(0,0,0,0.65))',
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="w-full aspect-[3/4] max-w-sm mx-auto rounded-2xl bg-[#0a0f20] border border-white/5 flex flex-col items-center justify-center p-8 text-center text-slate-500">
              <div className="w-20 h-20 rounded-full bg-slate-800/80 flex items-center justify-center mb-3">
                <User className="w-10 h-10 text-slate-500" />
              </div>
              <span className="font-mono text-xs uppercase tracking-wider text-slate-500 font-bold">
                Leadership Profile
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface PastorsOfficeHoursProps {
  onSchedule: () => void;
}

const PastorsOfficeHoursCard: React.FC<PastorsOfficeHoursProps> = ({ onSchedule }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isCoarsePointer, setIsCoarsePointer] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsCoarsePointer(window.matchMedia('(pointer: coarse)').matches);
    }
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isCoarsePointer || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMousePos({ x, y });
  };

  const handleMouseEnter = () => {
    if (!isCoarsePointer) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePos({ x: 0, y: 0 });
  };

  // Subtle 3D Parallax Offsets
  const cardRotateX = isHovered ? -mousePos.y * 1.8 : 0;
  const cardRotateY = isHovered ? mousePos.x * 1.8 : 0;

  return (
    <div className="relative mt-16 sm:mt-24 lg:mt-28">
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1200px) rotateX(${cardRotateX}deg) rotateY(${cardRotateY}deg)`,
          transition: isHovered
            ? 'transform 0.15s ease-out'
            : 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className="group relative rounded-3xl bg-[#060913] border border-slate-200/80 dark:border-white/10 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.85)] p-6 sm:p-10 lg:p-14 overflow-hidden transition-shadow duration-500 hover:shadow-[0_30px_90px_-15px_rgba(26,79,214,0.25)]"
      >
        <div className="absolute right-8 bottom-6 opacity-[0.035] dark:opacity-[0.05] pointer-events-none select-none">
          <svg className="w-72 h-72 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 2h4v7h7v4h-7v9h-4v-9H3V9h7V2z" />
          </svg>
        </div>

        {/* ── Content Container ── */}
        <div className="relative z-10 space-y-8 max-w-4xl">
          <div>
            <h3 className="text-2xl sm:text-4xl xl:text-5xl font-black tracking-tight text-white uppercase leading-tight">
              PASTORS’ OFFICE HOURS
            </h3>
            <p className="mt-2 text-base sm:text-xl text-slate-300 italic font-serif leading-relaxed">
              A time to connect, talk, pray, and support one another.
            </p>
            <p className="mt-3 text-xs sm:text-sm text-slate-400 leading-relaxed text-pretty max-w-2xl">
              <span className="text-white font-medium">“You are welcome to come, talk, pray, and be supported.”</span>{' '}
              Whether you are navigating spiritual questions, seeking prayer for family and career, or simply looking to fellowship in Christ, our pastors are here for you.
            </p>
          </div>

          {/* Structured Details: WHEN, WHERE, BY APPOINTMENT */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
            <div className="relative p-5 sm:p-6 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-royal-400/35 backdrop-blur-md transition-all duration-300 shadow-sm flex flex-col justify-center group/item">
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-royal-400 dark:text-cobalt-400 mb-2 block">
                WHEN
              </span>
              <div className="text-sm sm:text-base font-black text-white tracking-tight leading-snug">
                Tuesdays & Thursdays
              </div>
              <div className="text-xs sm:text-sm font-semibold text-royal-300 dark:text-cobalt-300 mt-1">
                09:00 AM – Onwards
              </div>
            </div>

            <div className="relative p-5 sm:p-6 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-royal-400/35 backdrop-blur-md transition-all duration-300 shadow-sm flex flex-col justify-center group/item">
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-royal-400 dark:text-cobalt-400 mb-2 block">
                WHERE
              </span>
              <div className="text-sm sm:text-base font-black text-white tracking-tight leading-snug">
                Pastor’s Office
              </div>
              <div className="text-xs sm:text-sm font-medium text-slate-300 mt-1">
                IFBCC
              </div>
            </div>

            <div className="relative p-5 sm:p-6 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-royal-400/35 backdrop-blur-md transition-all duration-300 shadow-sm flex flex-col justify-center group/item">
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-royal-400 dark:text-cobalt-400 mb-2 block">
                BY APPOINTMENT
              </span>
              <div className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed">
                Walk-ins are welcome, or schedule ahead.
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="pt-4 border-t border-white/10 flex items-center">
            <button
              type="button"
              onClick={onSchedule}
              className="px-6 sm:px-8 py-3 sm:py-3.5 rounded-full bg-gradient-to-r from-royal-600 via-royal-500 to-blue-600 hover:from-royal-500 hover:to-blue-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2.5 shadow-xl shadow-royal-600/30 hover:shadow-royal-500/50 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer border border-white/20"
            >
              <Calendar className="w-4 h-4 stroke-[2.5]" />
              <span>Schedule a Time</span>
              <ArrowRight className="w-4 h-4 ml-0.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const LeadershipSection: React.FC = () => {
  const [counselingModalOpen, setCounselingModalOpen] = useState(false);
  const [selectedPastor, setSelectedPastor] = useState<string>('Rev. Hinahon B. Pallones');
  const [appointmentSent, setAppointmentSent] = useState(false);

  const leaders: Leader[] = [
    {
      name: 'Rev. Hinahon B. Pallones',
      role: 'Senior Pastor',
      title: 'Senior Pastor',
      demographic: 'General Congregation, Elder Council & Pulpit Ministry',
      bio: 'Serving with steadfast dedication to the exposition of the Scriptures, Rev. Hinahon B. Pallones shepherds IFBBC with a passion for biblical doctrine, prayer, family discipleship, and city-wide outreach in Bauan and Batangas.',
      focus: ['Expository Preaching', 'Pastoral Counseling', 'Church Vision & Doctrine', 'Missions & Church Planting'],
      quote: '“Standing steadfast on the authority of God\u2019s Word, discipling the flock in truth, and laboring together in the Great Commission.” — 2 Timothy 4:2',
      email: 'ifbbc2021@gmail.com',
      facebookName: 'Jiffy Pallones',
      facebookUrl: 'https://www.facebook.com/jiffy.pallones',
      portrait: '/pastor-hinahon-cutout.png',
    },
    {
      name: 'Ptr. Edwin Sebastian Lualhati',
      role: 'Youth Pastor',
      title: 'Youth Pastor',
      demographic: 'Adelphoi Adviser, Campus, & Outreach Ministry',
      bio: 'Ptr. Edwin Sebastian Lualhati leads the NextGen ministries of IFBBC, passionate about raising a generation of young people who are unashamed of the Gospel, biblically grounded, and active in ministry leadership.',
      focus: ['Adelphoi Youth Fellowship', 'Collegiate & High School Discipleship', 'Youth Music & Worship', 'Evangelistic Camps'],
      quote: '“Discipling youth and young people to be unashamed of the Gospel, rooted in the Scriptures, and shining as lights in their generation.” — Romans 1:16',
      email: 'ifbbc2021@gmail.com',
      facebookName: 'Edwin Luahati',
      facebookUrl: 'https://www.facebook.com/elualhati1',
      portrait: '/pastor-edwin-cutout.png',
    },
  ];

  const handleSubmitCounseling = (e: React.FormEvent) => {
    e.preventDefault();
    setAppointmentSent(true);
    setTimeout(() => {
      setAppointmentSent(false);
      setCounselingModalOpen(false);
    }, 2500);
  };

  return (
    <section id="leadership" className="pt-6 pb-12 sm:pt-8 sm:pb-16 md:pt-10 md:pb-20 scroll-mt-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 md:mb-14 gap-4 sm:gap-6 pb-4 sm:pb-6 border-b border-slate-200/80 dark:border-white/5">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-blue-500 font-bold block mb-2">
              Our Pastors
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white uppercase text-balance">
              Pastoral Leadership
            </h2>
          </div>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-md leading-[1.68] text-pretty">
            We value our Pastors and church leaders (Core Value #10), honoring those God has called to minister the Word and shepherd the flock with biblical fidelity.
          </p>
        </div>

        {/* Pastoral Profile Cards */}
        <div className="space-y-12 sm:space-y-16 lg:space-y-20 mb-12">
          {leaders.map((leader) => (
            <LeaderProfileCard
              key={leader.name}
              leader={leader}
              onContact={(name) => {
                setSelectedPastor(name);
                setCounselingModalOpen(true);
              }}
            />
          ))}
        </div>

        {/* ── Pastors' Office Hours Elevated Section ── */}
        <PastorsOfficeHoursCard
          onSchedule={() => {
            setSelectedPastor('Rev. Hinahon B. Pallones');
            setCounselingModalOpen(true);
          }}
        />
      </div>

      {/* Pastoral Counseling / Meeting Modal */}
      <AnimatePresence>
        {counselingModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCounselingModalOpen(false)}
              className="fixed inset-0 bg-slate-950/70 dark:bg-black/85 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl ambient-card rounded-3xl p-8 sm:p-12 z-10 my-8 overflow-hidden"
            >
              <div className="flex items-center justify-between pb-6 mb-8 border-b border-slate-100 dark:border-white/5">
                <div>
                  <span className="font-mono text-xs uppercase tracking-widest text-royal-500 dark:text-cobalt-400 font-bold block">
                    Pastoral Care & Guidance
                  </span>
                  <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
                    Request Pastoral Meeting
                  </h3>
                </div>
                <button
                  onClick={() => setCounselingModalOpen(false)}
                  className="w-9 h-9 rounded-full bg-slate-100 dark:bg-obsidian-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {appointmentSent ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                    Meeting Request Sent
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-[1.68]">
                    Our pastoral office will reach out to you via email or phone to confirm the schedule.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitCounseling} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 font-bold">
                        Pastoral Shepherd
                      </label>
                      <select
                        value={selectedPastor}
                        onChange={(e) => setSelectedPastor(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-obsidian-850 border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-royal-500/40"
                      >
                        <option value="Rev. Hinahon B. Pallones">Rev. Hinahon B. Pallones (Senior Pastor)</option>
                        <option value="Ptr. Edwin Sebastian Lualhati">Ptr. Edwin Sebastian Lualhati (Youth Pastor)</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2 font-bold">
                          Your Name
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Simon Peter"
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-obsidian-850 border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-royal-500/40"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2 font-bold">
                          Phone / Email
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 0917-xxx-xxxx or email@example.com"
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-obsidian-850 border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-royal-500/40"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2 font-bold">
                        Purpose of Meeting
                      </label>
                      <textarea
                        rows={3}
                        required
                        placeholder="Pastoral counseling, baptism inquiry, prayer request, or spiritual guidance..."
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-obsidian-850 border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-royal-500/40 resize-none"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-3 bg-royal-500 hover:bg-royal-600 dark:bg-cobalt-500 dark:hover:bg-cobalt-400 text-white font-bold text-xs rounded-full uppercase tracking-wider transition-all"
                    >
                      Submit Appointment Request
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
};
