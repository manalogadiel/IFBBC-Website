import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  Car,
  Bus,
  Clock,
  Mail,
  ExternalLink,
  Compass,
  Check,
  Copy,
  Layers,
  Camera,
  Crosshair,
} from 'lucide-react';
import { TiltCard } from './ui/TiltCard';

export const LocationSection: React.FC = () => {
  const [copied, setCopied] = useState<boolean>(false);
  const [copiedCoords, setCopiedCoords] = useState<boolean>(false);
  const [mapMode, setMapMode] = useState<'map' | 'satellite' | 'streetview'>('map');

  const addressText = 'Purok Munlawin, Barangay Inicbulan, Bauan, Batangas 4201, Philippines';
  const coordinatesText = '13.8243399, 120.9822023';
  const googleMapsUrl =
    'https://www.google.com/maps/place/Inicbulan+Fundamental+Baptist+Bible+Church/@13.8243873,120.9823607,3a,75y,260.09h,95.24t/data=!3m7!1e1!3m5!1syvkdFoQBZ8s5aB6Otj4CFQ!2e0!6shttps:%2F%2Fstreetviewpixels-pa.googleapis.com%2Fv1%2Fthumbnail%3Fcb_client%3Dmaps_sv.tactile%26w%3D900%26h%3D600%26pitch%3D-5.235749804505716%26panoid%3DyvkdFoQBZ8s5aB6Otj4CFQ%26yaw%3D260.0885814542994!7i16384!8i8192!4m7!3m6!1s0x33bd090055f9111b:0x4f3952052bec149b!8m2!3d13.8243399!4d120.9822023!10e5!16s%2Fg%2F11vwr9m6td?entry=ttu&g_ep=EgoyMDI2MDgzMS4wIKXMDSoASAFQAw%3D%3D';
  const wazeUrl = 'https://waze.com/ul?ll=13.8243399,120.9822023&navigate=yes';

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(addressText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyCoords = () => {
    navigator.clipboard.writeText(coordinatesText);
    setCopiedCoords(true);
    setTimeout(() => setCopiedCoords(false), 2000);
  };

  return (
    <section id="location" className="pt-6 pb-12 sm:pt-8 sm:pb-16 md:pt-10 md:pb-20 scroll-mt-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-10 md:mb-16 gap-4 sm:gap-6 md:gap-8 pb-6 sm:pb-8 md:pb-12 border-b border-slate-200/80 dark:border-white/5">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-royal-500 dark:text-cobalt-400 font-bold block mb-2">
              OUR CHURCH
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white uppercase text-balance">
              Location & Directions
            </h2>
          </div>
        </div>

        {/* Swiss Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Interactive Transit & Campus Cards */}
          <div className="lg:col-span-7 space-y-6">
            <div className="ambient-card rounded-3xl p-8 sm:p-12">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-8 mb-8 border-b border-slate-100 dark:border-white/5">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-royal-500 dark:text-cobalt-400 font-bold block mb-1">
                    Inicbulan Fundamental Baptist Bible Church
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
                    IFBBC ADDRESS
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

              {/* Contact Action */}
              <div className="pt-8 mt-8 border-t border-slate-100 dark:border-white/5 flex flex-wrap items-center gap-4">
                <a
                  href="mailto:ifbbc2021@gmail.com"
                  className="px-6 py-3.5 bg-slate-100 dark:bg-obsidian-850 hover:bg-royal-50 dark:hover:bg-royal-950/40 border border-slate-200/80 dark:border-white/10 hover:border-royal-400/40 text-slate-800 dark:text-slate-200 hover:text-royal-600 dark:hover:text-cobalt-400 rounded-full text-xs font-bold flex items-center gap-2.5 shadow-sm transition-all cursor-pointer group"
                >
                  <Mail className="w-4 h-4 text-royal-500 dark:text-cobalt-400 group-hover:scale-110 transition-transform" />
                  <span className="lowercase font-mono text-xs font-semibold tracking-normal">ifbbc2021@gmail.com</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Modern Interactive Map Card */}
          <div className="lg:col-span-5">
            <TiltCard className="ambient-card rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl border border-slate-200/90 dark:border-white/10">
              {/* Header with Title & Active Status */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200/80 dark:border-slate-800/80 gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-royal-500/15 dark:bg-royal-500/20 border border-royal-400/30 text-royal-600 dark:text-royal-400 flex items-center justify-center shrink-0 shadow-inner">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-base sm:text-lg font-bold uppercase tracking-tight text-slate-900 dark:text-white block truncate">
                      IFBBC MAP
                    </span>
                    <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium block">
                      Inicbulan, Bauan
                    </span>
                  </div>
                </div>
              </div>

              {/* Modern View Mode Selector Pills */}
              <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-900/90 border border-slate-200/80 dark:border-white/10 mb-3.5 font-mono text-[11px]">
                <button
                  type="button"
                  onClick={() => setMapMode('map')}
                  className={`py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all font-semibold cursor-pointer ${mapMode === 'map'
                    ? 'bg-royal-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-white/5'
                    }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Map</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMapMode('satellite')}
                  className={`py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all font-semibold cursor-pointer ${mapMode === 'satellite'
                    ? 'bg-royal-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-white/5'
                    }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Satellite</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMapMode('streetview')}
                  className={`py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all font-semibold cursor-pointer ${mapMode === 'streetview'
                    ? 'bg-royal-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-white/5'
                    }`}
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Street View</span>
                </button>
              </div>

              {/* Map Viewport Display */}
              <div className="relative aspect-[4/3] sm:aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 border border-white/10 shadow-inner group">
                {mapMode === 'map' && (
                  <iframe
                    title="Inicbulan Fundamental Baptist Bible Church Map"
                    src="https://maps.google.com/maps?q=13.8243399,120.9822023+(Inicbulan+Fundamental+Baptist+Bible+Church)&t=m&z=17&ie=UTF8&iwloc=&output=embed"
                    className="w-full h-full border-0 select-none filter contrast-[1.05] brightness-[0.96] dark:invert-[0.92] dark:hue-rotate-[180deg] dark:contrast-[1.12] dark:brightness-[0.9]"
                    loading="lazy"
                  />
                )}

                {mapMode === 'satellite' && (
                  <iframe
                    title="Inicbulan Fundamental Baptist Bible Church Satellite Map"
                    src="https://maps.google.com/maps?q=13.8243399,120.9822023+(Inicbulan+Fundamental+Baptist+Bible+Church)&t=k&z=18&ie=UTF8&iwloc=&output=embed"
                    className="w-full h-full border-0 select-none filter contrast-[1.08] brightness-[1.0]"
                    loading="lazy"
                  />
                )}

                {mapMode === 'streetview' && (
                  <div className="relative w-full h-full overflow-hidden bg-slate-950 flex items-center justify-center">
                    <img
                      src="/ifbbc-streetview.jpg"
                      alt="Street View Entrance Purok Munlawin Inicbulan Church"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/40 pointer-events-none" />

                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-900/85 backdrop-blur-md border border-white/20 text-[10px] font-mono font-bold text-white flex items-center gap-1.5 shadow-lg">
                      <Camera className="w-3 h-3 text-royal-400" />
                      <span>Google Street View (Purok Munlawin)</span>
                    </div>

                    <a
                      href={googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute bottom-3 right-3 px-3.5 py-1.5 rounded-full bg-royal-600 hover:bg-royal-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-xl transition-all active:scale-95 cursor-pointer"
                    >
                      <span>Explore 360° Panorama</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}

                {/* Floating GPS HUD Chip (on Map/Satellite) */}
                {mapMode !== 'streetview' && (
                  <div className="absolute bottom-3 left-3 z-10 px-3 py-1.5 rounded-xl bg-slate-900/90 dark:bg-black/90 backdrop-blur-md border border-white/20 shadow-xl flex items-center gap-2 pointer-events-none">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-royal-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-royal-500" />
                    </span>
                    <div className="leading-tight">
                      <span className="block text-[11px] font-bold text-white tracking-tight">
                        IFBBC
                      </span>
                      <span className="block font-mono text-[9px] text-slate-400">
                        13.8243° N, 120.9822° E
                      </span>
                    </div>
                  </div>
                )}

                {/* Floating External Link Button */}
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Open in Google Maps"
                  className="absolute top-3 right-3 z-10 p-2 rounded-xl bg-slate-900/85 hover:bg-royal-600 backdrop-blur-md border border-white/20 text-white transition-all shadow-xl active:scale-90 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Campus Schedule & Coordinates Breakdown */}
              <div className="space-y-3 text-xs pt-4 mt-4 border-t border-slate-200/80 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
                    <Clock className="w-3.5 h-3.5 text-royal-500 dark:text-royal-400" />
                    Sunday Life Group
                  </span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">9:00 AM</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
                    <Clock className="w-3.5 h-3.5 text-royal-500 dark:text-royal-400" />
                    Sunday Worship Service
                  </span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">10:00 AM</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
                    <Compass className="w-3.5 h-3.5 text-royal-500 dark:text-royal-400" />
                    Barangay / Municipality
                  </span>
                  <span className="font-mono text-slate-600 dark:text-slate-300">Inicbulan, Bauan, Batangas</span>
                </div>
              </div>

              {/* Navigation App Shortcuts Dock */}
              <div className="grid grid-cols-3 gap-2 pt-4 mt-4 border-t border-slate-200/80 dark:border-slate-800">
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-slate-100/90 hover:bg-royal-50 dark:bg-white/[0.05] dark:hover:bg-royal-600/30 border border-slate-200/90 hover:border-royal-400/40 dark:border-white/10 text-slate-800 hover:text-royal-600 dark:text-white font-mono text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all text-center"
                >
                  <Navigation className="w-3.5 h-3.5 text-royal-500 dark:text-royal-400" />
                  <span>Google Maps</span>
                </a>
                <a
                  href={wazeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-slate-100/90 hover:bg-royal-50 dark:bg-white/[0.05] dark:hover:bg-royal-600/30 border border-slate-200/90 hover:border-royal-400/40 dark:border-white/10 text-slate-800 hover:text-royal-600 dark:text-white font-mono text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all text-center"
                >
                  <Car className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400" />
                  <span>Waze App</span>
                </a>
                <button
                  type="button"
                  onClick={handleCopyCoords}
                  className="p-2.5 rounded-xl bg-slate-100/90 hover:bg-royal-50 dark:bg-white/[0.05] dark:hover:bg-royal-600/30 border border-slate-200/90 hover:border-royal-400/40 dark:border-white/10 text-slate-800 hover:text-royal-600 dark:text-white font-mono text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  {copiedCoords ? <Check className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" /> : <Crosshair className="w-3.5 h-3.5 text-royal-500 dark:text-royal-400" />}
                  <span>{copiedCoords ? 'Copied!' : 'Copy GPS'}</span>
                </button>
              </div>
            </TiltCard>
          </div>
        </div>
      </div>
    </section>
  );
};
