import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ArrowRight, Check, Facebook, Youtube, Mail, MapPin } from 'lucide-react';
import churchLogo from '../assets/logo-hd.png';

export const Footer: React.FC = () => {
  const [creedOpen, setCreedOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail('');
      }, 3000);
    }
  };

  return (
    <footer className="bg-slate-100/60 dark:bg-obsidian-950 pt-28 pb-16 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-slate-200/80 dark:border-white/5">
          {/* Brand & Mission Statement (Span 4) */}
          <div className="lg:col-span-4 space-y-5">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-2xl p-[2px] backdrop-blur-xl bg-gradient-to-br from-white/30 via-white/10 to-transparent dark:from-white/15 dark:via-white/5 dark:to-transparent border border-white/40 dark:border-white/20 shadow-[0_6px_16px_-4px_rgba(24,94,224,0.3),inset_0_1.5px_2px_rgba(255,255,255,0.8)] dark:shadow-[0_6px_20px_-4px_rgba(59,130,246,0.35),inset_0_1.5px_2px_rgba(255,255,255,0.4)] flex items-center justify-center shrink-0 overflow-hidden">
                <img
                  src={churchLogo}
                  alt="IFBBC Logo"
                  className="w-full h-full object-contain p-0.5"
                />
                <div className="absolute inset-x-1 top-0.5 h-[42%] rounded-t-[14px] bg-gradient-to-b from-white/70 via-white/15 to-transparent pointer-events-none opacity-85" />
                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/50 dark:ring-white/30 pointer-events-none" />
              </div>
              <span className="text-base font-black tracking-tight text-slate-900 dark:text-white uppercase">
                IFBBC
              </span>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                INICBULAN FUNDAMENTAL BAPTIST BIBLE CHURCH, INCORPORATED
              </p>
              <p className="font-mono text-xs text-royal-500 dark:text-cobalt-400 font-semibold">
                "The Church with an open Bible"
              </p>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-[1.68] max-w-sm text-pretty">
              A local church in Bauan, Batangas committed to biblical exposition, vibrant fellowship, evangelism, discipleship, and Christ-centered worship.
            </p>

            <div className="pt-2 flex items-center gap-4">
              <a
                href="https://www.facebook.com/inicbulanfundamental.baptistbiblechurch"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook Page"
                className="w-9 h-9 rounded-full bg-white dark:bg-obsidian-850 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:text-royal-500 dark:hover:text-cobalt-400 shadow-sm transition-transform hover:scale-105"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://www.youtube.com/@ifbbc"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube Channel"
                className="w-9 h-9 rounded-full bg-white dark:bg-obsidian-850 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:text-red-500 shadow-sm transition-transform hover:scale-105"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="mailto:iffbc2021@gmail.com"
                aria-label="Email"
                className="w-9 h-9 rounded-full bg-white dark:bg-obsidian-850 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:text-royal-500 dark:hover:text-cobalt-400 shadow-sm transition-transform hover:scale-105"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setCreedOpen(true)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-royal-500 dark:text-cobalt-400 hover:underline"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Read Confession of Faith & Doctrines</span>
              </button>
            </div>
          </div>

          {/* Quick Navigation (Span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <span className="font-mono text-xs uppercase tracking-widest text-slate-400 dark:text-slate-500 font-bold block">
              Navigation
            </span>
            <ul className="space-y-3 text-xs font-semibold text-slate-600 dark:text-slate-400">
              <li>
                <a href="#vision-values" className="hover:text-royal-500 dark:hover:text-cobalt-400 transition-colors">
                  Vision & 10 Core Values
                </a>
              </li>
              <li>
                <a href="#core-groups" className="hover:text-royal-500 dark:hover:text-cobalt-400 transition-colors">
                  Core Groups & Gallery
                </a>
              </li>
              <li>
                <a href="#schedule" className="hover:text-royal-500 dark:hover:text-cobalt-400 transition-colors">
                  Weekly Schedule
                </a>
              </li>
              <li>
                <a href="#leadership" className="hover:text-royal-500 dark:hover:text-cobalt-400 transition-colors">
                  Pastoral Leadership
                </a>
              </li>
              <li>
                <a href="#sermons" className="hover:text-royal-500 dark:hover:text-cobalt-400 transition-colors">
                  Sermon Library
                </a>
              </li>
              <li>
                <a href="#give" className="hover:text-royal-500 dark:hover:text-cobalt-400 transition-colors">
                  Online Giving (BPI)
                </a>
              </li>
              <li>
                <a href="#location" className="hover:text-royal-500 dark:hover:text-cobalt-400 transition-colors">
                  Location & Transit
                </a>
              </li>
            </ul>
          </div>

          {/* Core Generations (Span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <span className="font-mono text-xs uppercase tracking-widest text-slate-400 dark:text-slate-500 font-bold block">
              Core Groups
            </span>
            <ul className="space-y-3 text-xs font-semibold text-slate-600 dark:text-slate-400">
              <li>
                <a href="#core-groups" className="hover:text-royal-500 dark:hover:text-cobalt-400">
                  Kiddos (Kids 0–12)
                </a>
              </li>
              <li>
                <a href="#core-groups" className="hover:text-royal-500 dark:hover:text-cobalt-400">
                  Adelphoi (Youth)
                </a>
              </li>
              <li>
                <a href="#core-groups" className="hover:text-royal-500 dark:hover:text-cobalt-400">
                  CAYA (Young Pros)
                </a>
              </li>
              <li>
                <a href="#core-groups" className="hover:text-royal-500 dark:hover:text-cobalt-400">
                  A-Men (Adult Men)
                </a>
              </li>
              <li>
                <a href="#core-groups" className="hover:text-royal-500 dark:hover:text-cobalt-400">
                  Womisso (Women)
                </a>
              </li>
            </ul>
          </div>

          {/* Weekly Gazette Newsletter (Span 4) */}
          <div className="lg:col-span-4 space-y-4">
            <span className="font-mono text-xs uppercase tracking-widest text-slate-400 dark:text-slate-500 font-bold block">
              Weekly Liturgical Gazette
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-[1.68] text-pretty">
              Receive Sunday liturgical scripture readings, sermon outlines, and community announcements every Friday morning.
            </p>

            <form onSubmit={handleSubscribe} className="pt-2">
              <div className="flex gap-2">
                <input
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-obsidian-850 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-royal-500/40"
                />
                <button
                  type="submit"
                  className="px-5 py-3 bg-royal-500 hover:bg-royal-600 dark:bg-cobalt-500 dark:hover:bg-cobalt-400 text-white rounded-xl text-xs font-bold shrink-0 transition-all shadow-sm flex items-center gap-1"
                >
                  {subscribed ? <Check className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
              {subscribed && (
                <span className="font-mono text-[11px] text-emerald-500 mt-2 block font-semibold">
                  ✓ Subscribed to Weekly Liturgical Gazette
                </span>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-royal-500 dark:text-cobalt-400" />
            <span>Purok Munlawin, Brgy. Inicbulan, Bauan, Batangas 4201, Philippines</span>
          </div>

          <div>
            <span>© {new Date().getFullYear()} INICBULAN FUNDAMENTAL BAPTIST BIBLE CHURCH, INC.</span>
          </div>
        </div>
      </div>

      {/* Confession of Faith Modal Drawer */}
      <AnimatePresence>
        {creedOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCreedOpen(false)}
              className="fixed inset-0 bg-slate-950/70 dark:bg-black/85 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl ambient-card rounded-3xl p-8 sm:p-12 z-10 my-8 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-white/5 mb-8">
                <div>
                  <span className="font-mono text-xs uppercase tracking-widest text-royal-500 dark:text-cobalt-400 font-bold block">
                    Biblical Doctrines & Faith Statement
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
                    What We Believe
                  </h3>
                </div>
                <button
                  onClick={() => setCreedOpen(false)}
                  className="w-9 h-9 rounded-full bg-slate-100 dark:bg-obsidian-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-8 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-[1.68]">
                <div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-base mb-2">
                    1. The Open Bible & Verbal Plenary Inspiration
                  </h4>
                  <p>
                    We believe the Holy Bible (Old and New Testaments) is the verbally inspired Word of God, fully inerrant in its original manuscripts, and the supreme, final authority for faith and practice.
                  </p>
                </div>

                <div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-base mb-2">
                    2. The Triune God
                  </h4>
                  <p>
                    We believe in one God, eternally existing in three co-equal persons: Father, Son, and Holy Spirit, each executing distinct but harmonious offices in the great work of redemption.
                  </p>
                </div>

                <div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-base mb-2">
                    3. Salvation by Grace Through Faith
                  </h4>
                  <p>
                    We believe salvation is entirely by grace through faith in the shed blood, death, and bodily resurrection of our Lord Jesus Christ, completely apart from human works, rituals, or sacramental merit.
                  </p>
                </div>

                <div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-base mb-2">
                    4. The Local Church & The Great Commission
                  </h4>
                  <p>
                    We believe the local church is an autonomous congregation of baptized believers associated by covenant in the faith and fellowship of the Gospel, observing the ordinances and actively engaged in worldwide missions.
                  </p>
                </div>
              </div>

              <div className="pt-8 mt-8 border-t border-slate-100 dark:border-white/5 text-right">
                <button
                  onClick={() => setCreedOpen(false)}
                  className="px-6 py-3 bg-slate-900 dark:bg-slate-100 text-white dark:text-obsidian-950 font-bold text-xs rounded-full uppercase tracking-wider"
                >
                  Close Statement
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </footer>
  );
};
