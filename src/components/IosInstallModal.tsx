import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Share, PlusSquare, Smartphone, CheckCircle2 } from 'lucide-react';

interface IosInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IosInstallModal: React.FC<IosInstallModalProps> = ({ isOpen, onClose }) => {
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
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-white dark:bg-obsidian-900 border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 overflow-hidden"
          >
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-royal-500/10 dark:bg-cobalt-500/15 rounded-full blur-3xl pointer-events-none -mr-12 -mt-12" />

            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-royal-500/10 dark:bg-cobalt-500/20 text-royal-600 dark:text-cobalt-400 flex items-center justify-center">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    Add to iPhone / iPad
                  </h4>
                  <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                    Standalone App Experience
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-obsidian-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Step-by-Step Guide */}
            <div className="mt-5 space-y-4 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-obsidian-850/80 border border-slate-100 dark:border-white/5">
                <div className="w-7 h-7 rounded-xl bg-royal-500 text-white flex items-center justify-center font-mono font-bold text-xs shrink-0">
                  1
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                    Tap the Share icon <Share className="w-3.5 h-3.5 text-royal-500 dark:text-cobalt-400" />
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    In Safari's bottom toolbar (or top right on iPad), tap the Share button.
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
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
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
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Tap <strong>Add</strong> at the top right. IFBBC will appear on your Home Screen as an app without browser navigation bars.
                  </p>
                </div>
              </div>
            </div>

            {/* Dismiss Button */}
            <div className="mt-6">
              <button
                onClick={onClose}
                className="w-full py-3 bg-royal-500 hover:bg-royal-600 dark:bg-cobalt-500 dark:hover:bg-cobalt-400 text-white rounded-2xl font-bold text-xs transition-all shadow-md active:scale-98"
              >
                Got It, Thanks!
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
