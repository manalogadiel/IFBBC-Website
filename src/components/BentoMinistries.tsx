import React from 'react';
import { BookMarked, Users, Sparkles, HeartHandshake, Compass, Globe2, ArrowUpRight } from 'lucide-react';
import { TiltCard } from './ui/TiltCard';

export const BentoMinistries: React.FC = () => {
  return (
    <section id="ministries" className="py-28 md:py-36 relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-8">
          <div>
            <span className="font-mono text-xs text-royal-500 dark:text-cobalt-400 uppercase tracking-widest block mb-2 font-semibold">
              [ 03 // MINISTRIES & PILLARS ]
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white text-balance">
              Pillars of Community Life
            </h2>
          </div>
          <p className="font-mono text-xs text-slate-500 dark:text-slate-400 mt-4 md:mt-0 tracking-wider uppercase">
            Orthodoxy in Doctrine • Orthopraxy in Action
          </p>
        </div>

        {/* Asymmetric Swiss Bento Grid (Anti-Box Ambient Shadow System) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Card 1: Theology & Academy Lab (Span 7) */}
          <div className="md:col-span-7">
            <TiltCard className="h-full ambient-card rounded-3xl p-8 sm:p-10 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-100 dark:border-white/5">
                  <div className="w-12 h-12 rounded-2xl bg-royal-50 dark:bg-royal-500/10 flex items-center justify-center text-royal-500 dark:text-cobalt-400">
                    <BookMarked className="w-6 h-6" />
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-obsidian-850 px-3 py-1.5 rounded-full font-semibold">
                    Academic Discipleship
                  </span>
                </div>

                <div className="space-y-4">
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Theology & Catechesis Lab
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-[1.68] max-w-xl text-pretty">
                    Structured 12-week modular courses in Systematic Theology, Biblical Hermeneutics, Church History, and Christian Ethics taught by resident pastoral scholars.
                  </p>
                </div>
              </div>

              <div className="pt-8 mt-8 border-t border-slate-100 dark:border-white/5 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
                  <span>Term IV Cohort</span>
                  <span>•</span>
                  <span>Fall Syllabus Ready</span>
                </div>
                <span className="text-xs font-bold text-royal-500 dark:text-cobalt-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  View Syllabus & Enroll <ArrowUpRight className="w-4 h-4" />
                </span>
              </div>
            </TiltCard>
          </div>

          {/* Card 2: City Mercy & Compassion (Span 5) */}
          <div className="md:col-span-5">
            <TiltCard className="h-full ambient-card rounded-3xl p-8 sm:p-10 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-100 dark:border-white/5">
                  <div className="w-12 h-12 rounded-2xl bg-royal-50 dark:bg-royal-500/10 flex items-center justify-center text-royal-500 dark:text-cobalt-400">
                    <HeartHandshake className="w-6 h-6" />
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-obsidian-850 px-3 py-1.5 rounded-full font-semibold">
                    City Renewal
                  </span>
                </div>

                <div className="space-y-4">
                  <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    City Compassion Network
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-[1.68] text-pretty">
                    Mobilizing direct aid, food distribution, medical clinics, and vocational training across urban partner communities.
                  </p>
                </div>
              </div>

              <div className="pt-8 mt-8 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                <span className="text-xs font-mono text-slate-500">Weekly Outreaches</span>
                <span className="text-xs font-bold text-royal-500 dark:text-cobalt-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Partner with Us <ArrowUpRight className="w-4 h-4" />
                </span>
              </div>
            </TiltCard>
          </div>

          {/* Card 3: Small Group Parish Circles (Span 4) */}
          <div className="md:col-span-4">
            <TiltCard className="h-full ambient-card rounded-3xl p-8 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-white/5">
                  <div className="w-10 h-10 rounded-xl bg-royal-50 dark:bg-royal-500/10 flex items-center justify-center text-royal-500 dark:text-cobalt-400">
                    <Users className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500">
                    Midweek Hubs
                  </span>
                </div>

                <div className="space-y-2.5">
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Parish Home Hubs
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-[1.68] text-pretty">
                    Intimate gatherings sharing meals, prayer, scripture meditation, and pastoral care across 14 neighborhood districts.
                  </p>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                <span className="text-xs font-mono text-slate-500">14 Local Circles</span>
                <span className="text-xs font-bold text-royal-500 dark:text-cobalt-400 flex items-center gap-1">
                  Find Nearest <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </TiltCard>
          </div>

          {/* Card 4: NextGen & Youth Covenant Guild (Span 4) */}
          <div className="md:col-span-4">
            <TiltCard className="h-full ambient-card rounded-3xl p-8 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-white/5">
                  <div className="w-10 h-10 rounded-xl bg-royal-50 dark:bg-royal-500/10 flex items-center justify-center text-royal-500 dark:text-cobalt-400">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500">
                    Ages 0–18
                  </span>
                </div>

                <div className="space-y-2.5">
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Covenant Kids & Youth
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-[1.68] text-pretty">
                    Age-appropriate theological instruction, scripture memory, safe background-checked childcare, and youth mentorship.
                  </p>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                <span className="text-xs font-mono text-slate-500">Sunday Check-in</span>
                <span className="text-xs font-bold text-royal-500 dark:text-cobalt-400 flex items-center gap-1">
                  Parent Guide <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </TiltCard>
          </div>

          {/* Card 5: Creative Guild & Architectural Music (Span 4) */}
          <div className="md:col-span-4">
            <TiltCard className="h-full ambient-card rounded-3xl p-8 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-white/5">
                  <div className="w-10 h-10 rounded-xl bg-royal-50 dark:bg-royal-500/10 flex items-center justify-center text-royal-500 dark:text-cobalt-400">
                    <Compass className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500">
                    Worship & Arts
                  </span>
                </div>

                <div className="space-y-2.5">
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Creative & Liturgical Guild
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-[1.68] text-pretty">
                    Musicians, audio engineers, broadcast technicians, and designers crafting beautiful, Christ-centered worship spaces.
                  </p>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                <span className="text-xs font-mono text-slate-500">Auditions & Crew</span>
                <span className="text-xs font-bold text-royal-500 dark:text-cobalt-400 flex items-center gap-1">
                  Join Guild <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </TiltCard>
          </div>

          {/* Card 6: Global Church Planting Initiatives (Span 12) */}
          <div className="md:col-span-12">
            <TiltCard className="ambient-card rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
              <div className="flex items-start gap-6">
                <div className="w-14 h-14 rounded-2xl bg-royal-50 dark:bg-royal-500/10 flex items-center justify-center text-royal-500 dark:text-cobalt-400 shrink-0 mt-1">
                  <Globe2 className="w-7 h-7" />
                </div>
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-royal-500 dark:text-cobalt-400 font-bold block mb-1">
                    Global Gospel Reach
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Global Church Planting & Literature Translation
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-[1.68] mt-2 max-w-2xl text-pretty">
                    Supporting indigenous pastoral leadership and funding theological literature translation across 6 sister churches throughout Southeast Asia.
                  </p>
                </div>
              </div>

              <button className="px-7 py-4 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-obsidian-950 font-semibold text-xs rounded-full uppercase tracking-wider transition-all shadow-sm shrink-0">
                Explore Global Projects
              </button>
            </TiltCard>
          </div>
        </div>
      </div>
    </section>
  );
};
