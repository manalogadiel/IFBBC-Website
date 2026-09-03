import React, { useState } from 'react';
import { MapPin, Navigation, Car, Bus, Clock, Mail, ExternalLink, Compass, Check, Copy } from 'lucide-react';
import { TiltCard } from './ui/TiltCard';

export const LocationSection: React.FC = () => {
  const [copied, setCopied] = useState<boolean>(false);
  const addressText = "Purok Munlawin, Barangay Inicbulan, Bauan, Batangas 4201, Philippines";

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(addressText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="location" className="pt-6 pb-12 sm:pt-8 sm:pb-16 md:pt-10 md:pb-20 scroll-mt-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-10 md:mb-16 gap-4 sm:gap-6 md:gap-8 pb-6 sm:pb-8 md:pb-12 border-b border-slate-200/80 dark:border-white/5">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-royal-500 dark:text-cobalt-400 font-bold block mb-2">
              Sanctuary & Campus // 06
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white uppercase text-balance">
              Location & Directions
            </h2>
          </div>
          <p className="font-mono text-xs text-slate-500 dark:text-slate-400 tracking-wider uppercase">
            Coordinates: 13.7932° N, 120.9885° E // Bauan, Batangas
          </p>
        </div>

        {/* Swiss Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Interactive Transit & Campus Cards */}
          <div className="lg:col-span-7 space-y-6">
            <div className="ambient-card rounded-3xl p-8 sm:p-12">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-8 mb-8 border-b border-slate-100 dark:border-white/5">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-royal-500 dark:text-cobalt-400 font-bold block mb-1">
                    IFBBC Main Campus
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
                    Inicbulan Sanctuary
                  </h3>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-2 leading-[1.68]">
                    {addressText}
                  </p>
                </div>

                <button
                  onClick={handleCopyAddress}
                  className="font-mono text-xs font-bold text-royal-500 dark:text-cobalt-400 bg-royal-50 dark:bg-royal-500/10 px-4 py-2 rounded-full hover:bg-royal-100 dark:hover:bg-royal-500/20 transition-colors shrink-0 flex items-center gap-1.5 self-start"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Address'}</span>
                </button>
              </div>

              {/* Transit Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-6 rounded-2xl bg-slate-50/80 dark:bg-obsidian-850 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                    <Car className="w-4 h-4 text-royal-500 dark:text-cobalt-400" />
                    <span>Private Vehicle & Parking</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-[1.68]">
                    Campus parking space available along Purok Munlawin with church greeters on hand to assist visitors.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-slate-50/80 dark:bg-obsidian-850 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                    <Bus className="w-4 h-4 text-royal-500 dark:text-cobalt-400" />
                    <span>Commuter Access</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-[1.68]">
                    From Bauan Poblacion / Public Market, take the Inicbulan / Manghinao jeepney or tricycle directly to Purok Munlawin.
                  </p>
                </div>
              </div>

              {/* Navigation Action Buttons */}
              <div className="pt-8 mt-8 border-t border-slate-100 dark:border-white/5 flex flex-wrap items-center gap-4">
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Inicbulan+Fundamental+Baptist+Bible+Church+Bauan+Batangas"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 bg-royal-500 hover:bg-royal-600 dark:bg-cobalt-500 dark:hover:bg-cobalt-400 text-white rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
                </a>

                <a
                  href="mailto:iffbc2021@gmail.com"
                  className="px-6 py-3.5 bg-slate-100 dark:bg-obsidian-850 hover:bg-slate-200 text-slate-800 dark:text-slate-200 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all"
                >
                  <Mail className="w-4 h-4" />
                  <span>iffbc2021@gmail.com</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Campus Spatial Schema */}
          <div className="lg:col-span-5">
            <TiltCard className="ambient-card bg-slate-950 text-white rounded-3xl p-8 sm:p-10 relative overflow-hidden">
              <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-royal-400" />
                  <span className="font-mono text-xs uppercase tracking-wider text-slate-300 font-bold">
                    Campus Overview
                  </span>
                </div>
                <span className="font-mono text-[10px] text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full font-semibold">
                  Sunday Gate Opens 8:00 AM
                </span>
              </div>

              {/* Minimalist Vector Grid Representation */}
              <div className="my-6 aspect-video bg-slate-900 rounded-2xl p-5 relative flex flex-col justify-between font-mono text-[10px] text-slate-400 overflow-hidden">
                <div className="relative z-10 flex justify-between">
                  <span className="text-slate-300 font-bold">SANCTUARY // WORSHIP HALL</span>
                  <span className="text-emerald-400 font-bold">● ACTIVE</span>
                </div>

                <div className="relative z-10 my-auto text-center space-y-1">
                  <div className="inline-block p-3 rounded-xl bg-royal-500/20 text-white font-bold text-xs">
                    INICBULAN CAMPUS GROUNDS
                  </div>
                  <div className="text-slate-400 text-[9px]">PUROK MUNLAWIN • BAUAN</div>
                </div>

                <div className="relative z-10 flex justify-between">
                  <span>CLASSROOMS // LIFE GROUPS</span>
                  <span>FELLOWSHIP AREA</span>
                </div>
              </div>

              <div className="space-y-3 text-xs text-slate-400 pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <Clock className="w-3.5 h-3.5 text-royal-400" />
                    Sunday Life Group
                  </span>
                  <span className="font-mono font-bold text-white">9:00 AM</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <Clock className="w-3.5 h-3.5 text-royal-400" />
                    Sunday Worship Service
                  </span>
                  <span className="font-mono font-bold text-emerald-400">10:00 AM</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <Compass className="w-3.5 h-3.5 text-royal-400" />
                    Barangay / Municipality
                  </span>
                  <span className="font-mono">Inicbulan, Bauan, Batangas</span>
                </div>
              </div>
            </TiltCard>
          </div>
        </div>
      </div>
    </section>
  );
};
