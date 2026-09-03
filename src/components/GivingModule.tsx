import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, Building2, Maximize2, Download, X, QrCode } from 'lucide-react';

interface GivingModuleProps {
  isModal?: boolean;
  onClose?: () => void;
}

export const GivingModule: React.FC<GivingModuleProps> = ({ isModal = false, onClose }) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [isQRExpanded, setIsQRExpanded] = useState<boolean>(false);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsFullScreen(false);
        setIsQRExpanded(false);
      }
    };
    if (isFullScreen || isQRExpanded) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullScreen, isQRExpanded]);

  const bpiAccount = {
    bank: 'BPI (Bank of the Philippine Islands)',
    names: 'Hinahon B. Pallones / Eloisa Tangguiyac',
    accountNumber: '8959-367214',
  };

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(bpiAccount.accountNumber.replace(/-/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const content = (
    <div className={`w-full ${isModal ? 'p-6 sm:p-8' : 'ambient-card rounded-3xl p-6 sm:p-8 md:p-10'}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100 dark:border-white/5">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-royal-500 dark:text-cobalt-400 font-bold block mb-1">
            Biblical Stewardship
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
            Online Giving
          </h3>
        </div>
        {isModal && onClose && (
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-obsidian-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="space-y-5">
        {/* Official BPI Bank Transfer Card */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white rounded-2xl space-y-3 relative overflow-hidden shadow-lg border border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-royal-400" />
              <span className="font-mono text-[11px] font-bold uppercase text-royal-400 tracking-wider">
                Official Bank Account
              </span>
            </div>
          </div>

          <div className="space-y-0.5">
            <span className="font-mono text-[9px] text-slate-400 uppercase tracking-wider block">
              Bank Name
            </span>
            <h4 className="text-sm sm:text-base font-extrabold text-white">
              {bpiAccount.bank}
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 font-mono text-xs">
            <div>
              <span className="text-slate-400 block text-[9px] uppercase tracking-wider">Account Names</span>
              <span className="font-bold text-slate-200 block text-xs">{bpiAccount.names}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[9px] uppercase tracking-wider">Account Number</span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-mono font-black text-base sm:text-lg text-emerald-400 tracking-wider">
                  {bpiAccount.accountNumber}
                </span>
                <button
                  type="button"
                  onClick={handleCopyAccount}
                  title="Copy Account Number"
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              {copied && (
                <span className="text-[10px] text-emerald-400 font-sans block mt-0.5">
                  ✓ Account number copied to clipboard
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── PAYMENT QR CODE TILE with subtle breathing blue glow ── */}
        <motion.div
          animate={{
            boxShadow: [
              '0 0 16px 0px rgba(37,99,235,0.18)',
              '0 0 28px 4px rgba(37,99,235,0.36)',
              '0 0 16px 0px rgba(37,99,235,0.18)',
            ],
          }}
          transition={{
            duration: 3.6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          whileHover={{
            scale: 1.01,
            boxShadow: '0 0 36px 6px rgba(37,99,235,0.55)',
          }}
          className="relative group rounded-2xl p-5 sm:p-6 bg-slate-900 border border-slate-700/60 dark:border-white/10 transition-all duration-300 overflow-hidden"
        >
          <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-6">
            {/* White rounded quiet-zone tile containing the clean QR code */}
            <div
              onClick={() => setIsFullScreen(true)}
              className="relative shrink-0 cursor-pointer group/qr p-2 bg-white rounded-xl shadow-md transition-transform duration-300 group-hover/qr:scale-105"
              title="Click to view full screen"
            >
              <img
                src="/ifbbc-bpi-qr.png"
                alt="IFBBC BPI InstaPay QR Code"
                className="w-36 h-36 sm:w-40 sm:h-40 object-contain rounded-lg"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/qr:opacity-100 transition-opacity rounded-xl flex items-center justify-center text-white">
                <Maximize2 className="w-6 h-6 drop-shadow-md" />
              </div>
            </div>

            {/* Information & Eyebrow Label */}
            <div className="flex-1 text-center sm:text-left space-y-2">
              <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-widest text-royal-400 dark:text-cobalt-400 font-bold block">
                SCAN TO GIVE & SUPPORT THE MINISTRY
              </span>
              <h4 className="text-base sm:text-lg font-extrabold text-white tracking-tight">
                InstaPay & BPI QR Transfer
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Scan directly using BPI, GCash, Maya, Maribank or any InstaPay-compliant banking app for instant, fee-free tithes and love offerings.
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <button
                  type="button"
                  onClick={() => setIsFullScreen(true)}
                  className="px-3.5 py-1.5 rounded-full bg-royal-600/30 hover:bg-royal-600 border border-royal-400/40 text-royal-200 hover:text-white text-xs font-mono font-semibold flex items-center gap-1.5 transition-all"
                >
                  <Maximize2 className="w-3 h-3" />
                  <span>Enlarge QR</span>
                </button>
                <a
                  href="/ifbbc-bpi-qr.png"
                  download="IFBBC-BPI-InstaPay-QR.png"
                  className="px-3.5 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 border border-white/10 text-slate-300 hover:text-white text-xs font-mono font-semibold flex items-center gap-1.5 transition-all"
                >
                  <Download className="w-3 h-3" />
                  <span>Save QR</span>
                </a>
              </div>
            </div>
          </div>
        </motion.div>


      </div>
    </div>
  );

  return (
    <>
      {isModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/70 dark:bg-black/85 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 my-auto w-full max-w-xl max-h-[90vh] overflow-y-auto ambient-card rounded-3xl"
          >
            {content}
          </motion.div>
        </div>
      ) : (
        <section id="give" className="pt-2 pb-12 sm:pt-4 sm:pb-16 md:pt-6 md:pb-20 scroll-mt-20 relative overflow-hidden bg-slate-100/40 dark:bg-obsidian-900/30">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16 items-center">
              <div className="lg:col-span-6 space-y-6">
                <span className="font-mono text-xs uppercase tracking-widest text-royal-500 dark:text-cobalt-400 font-bold block">
                  Stewardship & Worship
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight uppercase text-balance">
                  Faithful Stewardship for the Lord's Work
                </h2>
                <p className="text-base text-slate-600 dark:text-slate-300 leading-[1.68] text-pretty">
                  At IFBBC, giving is an act of joyful obedience and worship. Your tithes and love offerings sustain our weekly services, support mission fields in Batangas, equip youth and children, and care for church families in need.
                </p>
              </div>

              <div className="lg:col-span-6">
                {content}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── High-Resolution QR Lightbox Modal ── */}
      <AnimatePresence>
        {isQRExpanded && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsQRExpanded(false)}
              className="fixed inset-0 bg-slate-950/80 dark:bg-black/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 12 }}
              className="relative z-10 w-full max-w-sm bg-slate-900 border border-white/15 rounded-3xl p-6 sm:p-8 text-center shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2 text-royal-400 font-mono text-xs font-bold uppercase">
                  <QrCode className="w-4 h-4" />
                  <span>BPI InstaPay QR</span>
                </div>
                <button
                  onClick={() => setIsQRExpanded(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-white bg-slate-800 transition-colors"
                  aria-label="Close QR Modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* QR Image Container */}
              <div
                onClick={() => setIsFullScreen(true)}
                className="p-4 bg-white rounded-2xl inline-block shadow-lg mx-auto cursor-pointer relative group/modalqr transition-transform duration-200 hover:scale-[1.02]"
                title="Click to view full screen"
              >
                <img
                  src="/ifbbc-bpi-qr.png"
                  alt="IFBBC BPI InstaPay QR Code"
                  className="w-56 h-56 sm:w-64 sm:h-64 object-contain rounded-lg"
                />
                <div className="absolute inset-0 bg-black/35 opacity-0 group-hover/modalqr:opacity-100 transition-opacity rounded-2xl flex flex-col items-center justify-center text-white gap-1.5 backdrop-blur-[1px]">
                  <Maximize2 className="w-8 h-8 drop-shadow-md text-white" />
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider bg-black/70 px-3 py-1 rounded-full text-white shadow">
                    View Full Screen
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="font-mono text-xs text-slate-300 block font-semibold">
                  IFBBC Bank Account ending in 214
                </span>
                <span className="text-[11px] font-mono text-slate-400 block">
                  Scan via BPI, GCash, Maya, Maribank or any InstaPay app
                </span>
              </div>

              <div className="pt-2 flex items-center justify-center gap-3">
                <a
                  href="/ifbbc-bpi-qr.png"
                  download="IFBBC-BPI-InstaPay-QR.png"
                  className="px-4 py-2 rounded-full bg-royal-600 hover:bg-royal-500 text-white font-mono text-xs font-bold flex items-center gap-2 shadow-lg transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download QR</span>
                </a>
                <button
                  type="button"
                  onClick={() => setIsQRExpanded(false)}
                  className="px-4 py-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono font-bold transition-colors"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Immersive Full Screen QR Viewer ── */}
      <AnimatePresence>
        {isFullScreen && (
          <div className="fixed inset-0 z-[100] flex flex-col items-center justify-between p-4 sm:p-6 md:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFullScreen(false)}
              className="fixed inset-0 bg-slate-950/95 dark:bg-black/95 backdrop-blur-xl cursor-zoom-out"
            />

            {/* Top Bar */}
            <div className="relative z-10 w-full max-w-4xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-royal-600/20 border border-royal-400/30 flex items-center justify-center text-royal-400">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-white font-black text-sm sm:text-base tracking-tight uppercase">
                    IFBBC Bank Account ending in 214
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Scan via BPI, GCash, Maya, Maribank or any InstaPay app
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsFullScreen(false)}
                className="p-2.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-white/10"
                aria-label="Close full screen"
                title="Close (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Central Full-Screen QR Display */}
            <div
              className="relative z-10 flex-1 flex items-center justify-center py-4 sm:py-6 w-full"
              onClick={() => setIsFullScreen(false)}
            >
              <motion.div
                initial={{ scale: 0.88, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.88, opacity: 0 }}
                transition={{ type: 'spring', damping: 26, stiffness: 320 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white p-5 sm:p-7 md:p-9 rounded-3xl shadow-2xl flex items-center justify-center max-w-[92vw] max-h-[72vh]"
              >
                <img
                  src="/ifbbc-bpi-qr.png"
                  alt="IFBBC BPI InstaPay QR Code"
                  className="w-auto h-auto max-w-[80vw] max-h-[62vh] object-contain rounded-xl select-none"
                />
              </motion.div>
            </div>

            {/* Bottom Controls Bar */}
            <div className="relative z-10 w-full max-w-md flex items-center justify-center gap-3">
              <a
                href="/ifbbc-bpi-qr.png"
                download="IFBBC-BPI-InstaPay-QR.png"
                className="px-5 py-2.5 rounded-full bg-royal-600 hover:bg-royal-500 text-white font-mono text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download QR</span>
              </a>
              <button
                type="button"
                onClick={() => setIsFullScreen(false)}
                className="px-5 py-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs sm:text-sm font-mono font-bold transition-colors border border-white/10"
              >
                Close Full Screen
              </button>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
