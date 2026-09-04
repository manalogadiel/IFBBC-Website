import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Share, PlusSquare, Smartphone, CheckCircle2, Monitor, Download, Sparkles } from 'lucide-react';
import churchLogo from '../assets/logo-hd.png';

export type PlatformType = 'pc' | 'ios' | 'android';

interface DeviceInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPlatform?: PlatformType;
  hasNativePrompt?: boolean;
  onNativeInstall?: () => void;
}

export const DeviceInstallModal: React.FC<DeviceInstallModalProps> = ({
  isOpen,
  onClose,
  initialPlatform = 'pc',
  hasNativePrompt = false,
  onNativeInstall,
}) => {
  const [platform, setPlatform] = useState<PlatformType>(initialPlatform);

  useEffect(() => {
    if (isOpen) {
      setPlatform(initialPlatform);
    }
  }, [isOpen, initialPlatform]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/75 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-white dark:bg-obsidian-900 border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 overflow-hidden"
          >
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-royal-500/10 dark:bg-cobalt-500/15 rounded-full blur-3xl pointer-events-none -mr-12 -mt-12" />

            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/5">
              <div className="flex items-center gap-3">
                <div className="relative w-11 h-11 rounded-2xl overflow-hidden shadow-sm ring-1 ring-royal-500/25 dark:ring-cobalt-400/30 flex items-center justify-center shrink-0 bg-slate-900">
                  <img
                    src={churchLogo}
                    alt="IFBBC App Logo"
                    className="w-full h-full object-cover"
                  />
                  {/* Shiny Specular Shimmer Ray */}
                  <div className="absolute -inset-full top-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-nav-shine pointer-events-none" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    Install IFBBC App
                  </h4>
                  <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                    Add to your {platform === 'pc' ? 'Computer' : platform === 'ios' ? 'iPhone / iPad' : 'Android Device'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-obsidian-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Platform Selector Tabs */}
            <div className="grid grid-cols-3 gap-1.5 mt-5 p-1 bg-slate-100 dark:bg-obsidian-850 rounded-2xl">
              <button
                onClick={() => setPlatform('pc')}
                className={`py-2 px-2.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${platform === 'pc'
                  ? 'bg-white dark:bg-obsidian-750 text-royal-600 dark:text-cobalt-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                  }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>PC / Mac</span>
              </button>

              <button
                onClick={() => setPlatform('ios')}
                className={`py-2 px-2.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${platform === 'ios'
                  ? 'bg-white dark:bg-obsidian-750 text-royal-600 dark:text-cobalt-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                  }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>iOS (iPhone)</span>
              </button>

              <button
                onClick={() => setPlatform('android')}
                className={`py-2 px-2.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${platform === 'android'
                  ? 'bg-white dark:bg-obsidian-750 text-royal-600 dark:text-cobalt-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                  }`}
              >
                <Download className="w-3.5 h-3.5" />
                <span>Android</span>
              </button>
            </div>

            {/* Platform Content Body */}
            <div className="mt-5 space-y-3.5 text-xs text-slate-600 dark:text-slate-300">
              {/* PC / Mac Instructions */}
              {platform === 'pc' && (
                <>
                  {hasNativePrompt && onNativeInstall && (
                    <button
                      onClick={onNativeInstall}
                      className="w-full py-2.5 px-4 mb-2 bg-royal-500 hover:bg-royal-600 dark:bg-cobalt-500 dark:hover:bg-cobalt-400 text-white rounded-2xl font-bold text-xs transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Trigger 1-Click Install Now</span>
                    </button>
                  )}

                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-obsidian-850/80 border border-slate-100 dark:border-white/5">
                    <div className="w-7 h-7 rounded-xl bg-royal-500 text-white flex items-center justify-center font-mono font-bold text-xs shrink-0">
                      1
                    </div>
                    <div className="space-y-1">
                      <p className="font-semibold text-slate-900 dark:text-white">
                        Check your Browser Address Bar
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        In Chrome, Edge, or Brave, look at the right side of the URL address bar for the <strong>Install App icon (⊕ or computer with arrow)</strong>.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-obsidian-850/80 border border-slate-100 dark:border-white/5">
                    <div className="w-7 h-7 rounded-xl bg-royal-500 text-white flex items-center justify-center font-mono font-bold text-xs shrink-0">
                      2
                    </div>
                    <div className="space-y-1">
                      <p className="font-semibold text-slate-900 dark:text-white">
                        Or use the Browser Menu (⋮)
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        Click the three dots <strong>(⋮ or ⋯)</strong> at the top right of your browser, then click <strong>"Install IFBBC..."</strong> or <strong>"Save and Share" → "Install this site as an app"</strong>.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-obsidian-850/80 border border-slate-100 dark:border-white/5">
                    <div className="w-7 h-7 rounded-xl bg-royal-500 text-white flex items-center justify-center font-mono font-bold text-xs shrink-0">
                      3
                    </div>
                    <div className="space-y-1">
                      <p className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                        Launch from Desktop / Start Menu <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        Click <strong>Install</strong>. IFBBC will open in its own clean window with no URL bar, and create a Desktop & Taskbar shortcut.
                      </p>
                    </div>
                  </div>
                </>
              )}

              {/* iOS (iPhone / iPad) Instructions */}
              {platform === 'ios' && (
                <>
                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-obsidian-850/80 border border-slate-100 dark:border-white/5">
                    <div className="w-7 h-7 rounded-xl bg-royal-500 text-white flex items-center justify-center font-mono font-bold text-xs shrink-0">
                      1
                    </div>
                    <div className="space-y-1">
                      <p className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                        Tap Safari Share <Share className="w-3.5 h-3.5 text-royal-500 dark:text-cobalt-400" />
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        In Safari's bottom toolbar (or top right on iPad), tap the <strong>Share</strong> button.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-obsidian-850/80 border border-slate-100 dark:border-white/5">
                    <div className="w-7 h-7 rounded-xl bg-royal-500 text-white flex items-center justify-center font-mono font-bold text-xs shrink-0">
                      2
                    </div>
                    <div className="space-y-1">
                      <p className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                        Select "Add to Home Screen" <PlusSquare className="w-3.5 h-3.5 text-royal-500 dark:text-cobalt-400" />
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        Scroll down the sharing sheet options and tap <strong>Add to Home Screen</strong>.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-obsidian-850/80 border border-slate-100 dark:border-white/5">
                    <div className="w-7 h-7 rounded-xl bg-royal-500 text-white flex items-center justify-center font-mono font-bold text-xs shrink-0">
                      3
                    </div>
                    <div className="space-y-1">
                      <p className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                        Tap "Add" <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        Tap <strong>Add</strong> at the top right. IFBBC is now installed as a full standalone app!
                      </p>
                    </div>
                  </div>
                </>
              )}

              {/* Android Instructions */}
              {platform === 'android' && (
                <>
                  <button
                    onClick={() => {
                      if (onNativeInstall) {
                        onNativeInstall();
                      } else if ((window as any).__pwaInstallPrompt) {
                        (window as any).__pwaInstallPrompt.prompt();
                      }
                    }}
                    className="w-full py-3 px-4 bg-royal-600 hover:bg-royal-700 dark:bg-cobalt-500 dark:hover:bg-cobalt-400 text-white rounded-2xl font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                  >
                    <span>Install on Android</span>
                  </button>

                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-obsidian-850/80 border border-slate-100 dark:border-white/5">
                    <div className="w-7 h-7 rounded-xl bg-royal-500 text-white flex items-center justify-center font-mono font-bold text-xs shrink-0">
                      1
                    </div>
                    <div className="space-y-1">
                      <p className="font-semibold text-slate-900 dark:text-white">
                        Tap the Three Dots Menu (⋮)
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        In Chrome or Samsung Internet, tap the <strong>three vertical dots (⋮)</strong> at top right.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-obsidian-850/80 border border-slate-100 dark:border-white/5">
                    <div className="w-7 h-7 rounded-xl bg-royal-500 text-white flex items-center justify-center font-mono font-bold text-xs shrink-0">
                      2
                    </div>
                    <div className="space-y-1">
                      <p className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                        Select "Install app" (or "Install IFBBC")
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        Choose <strong>Install app</strong>. <em>(Important: Do not select "Add shortcut" — choose "Install app" so it creates a native standalone app)</em>.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-obsidian-850/80 border border-slate-100 dark:border-white/5">
                    <div className="w-7 h-7 rounded-xl bg-royal-500 text-white flex items-center justify-center font-mono font-bold text-xs shrink-0">
                      3
                    </div>
                    <div className="space-y-1">
                      <p className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                        Confirm Install <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        Tap <strong>Install</strong>. Android will mint the standalone WebAPK app with its own app drawer icon and zero browser header bars.
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Bottom Action / Dismiss */}
            <div className="mt-6">
              <button
                onClick={onClose}
                className="w-full py-3 bg-royal-500 hover:bg-royal-600 dark:bg-cobalt-500 dark:hover:bg-cobalt-400 text-white rounded-2xl font-bold text-xs transition-all shadow-md active:scale-98 cursor-pointer"
              >
                Close Guide
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
