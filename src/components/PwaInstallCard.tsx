import React, { useState, useEffect } from 'react';
import { Download, Monitor, Smartphone, CheckCircle2, Laptop, Loader2 } from 'lucide-react';
import { IosInstallModal } from './IosInstallModal';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const PwaInstallCard: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showIosModal, setShowIosModal] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  // Platform detection
  const isIos = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAndroid = typeof navigator !== 'undefined' && /Android/.test(navigator.userAgent);
  const isDesktop = !isIos && !isAndroid;

  useEffect(() => {
    // Check if running in standalone mode (already installed)
    const checkStandalone = () => {
      const isStandaloneMode =
        window.matchMedia('(display-mode: standalone)').matches ||
        (navigator as any).standalone === true ||
        document.referrer.includes('android-app://');
      setIsStandalone(Boolean(isStandaloneMode));
    };

    checkStandalone();

    // Listen for beforeinstallprompt event (Chrome, Edge, Android)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    // Listen for successful installation
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstalling(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async (platformOverride?: 'pc' | 'ios' | 'android') => {
    const target = platformOverride || (isIos ? 'ios' : isAndroid ? 'android' : 'pc');

    if (target === 'ios') {
      setShowIosModal(true);
      return;
    }

    if (deferredPrompt) {
      try {
        setIsInstalling(true);
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          setIsInstalled(true);
        }
        setIsInstalling(false);
        setDeferredPrompt(null);
      } catch (err) {
        console.warn('[PWA] Prompt error:', err);
        setIsInstalling(false);
      }
    } else {
      // Fallback instructions if prompt event already passed or browser handles via address bar
      if (target === 'pc') {
        alert('To install on PC/Mac: Look for the Install icon (⊕ or computer with arrow) on the right side of your browser address bar (Chrome/Edge), or press Menu (⋮) → "Install IFBBC".');
      } else {
        alert('To install on Android: Tap the three dots (⋮) in the top-right of your browser and select "Add to Home screen" or "Install app".');
      }
    }
  };

  return (
    <div className="lg:col-span-4 space-y-4">
      <div className="flex items-center gap-2">
        <span className="font-mono text-xs uppercase tracking-widest text-royal-600 dark:text-cobalt-400 font-bold block">
          PWA • App Experience
        </span>
        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-royal-500/10 dark:bg-cobalt-500/20 text-royal-600 dark:text-cobalt-400">
          Fast & Offline
        </span>
      </div>

      <p className="text-xs text-slate-600 dark:text-slate-400 leading-[1.68] text-pretty">
        Add IFBBC to your Home Screen or Desktop to view Sunday livestreams, sermons, and prayer requests as a standalone app with no browser address bar.
      </p>

      {/* Main Standalone Status / Install Action Box */}
      {isStandalone || isInstalled ? (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="text-xs">
            <p className="font-bold">App Installed & Active</p>
            <p className="text-[11px] opacity-80">
              Running in standalone app mode without browser bars.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-2.5 pt-1">
          {/* Quick Universal Install Button */}
          <button
            onClick={() => handleInstallClick()}
            className="w-full py-3 px-4 bg-royal-500 hover:bg-royal-600 dark:bg-cobalt-500 dark:hover:bg-cobalt-400 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 group"
          >
            {isInstalling ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isIos ? (
              <Smartphone className="w-4 h-4 transition-transform group-hover:scale-110" />
            ) : isDesktop ? (
              <Laptop className="w-4 h-4 transition-transform group-hover:scale-110" />
            ) : (
              <Download className="w-4 h-4 transition-transform group-hover:scale-110" />
            )}
            <span>
              {isInstalling
                ? 'Installing App...'
                : isIos
                ? 'Add to iPhone / iPad'
                : isDesktop
                ? 'Install on PC / Mac'
                : 'Add to Home Screen'}
            </span>
          </button>

          {/* Quick Platform Switcher / Guide Buttons */}
          <div className="grid grid-cols-3 gap-1.5 pt-1">
            <button
              onClick={() => handleInstallClick('pc')}
              className="py-2 px-2.5 rounded-lg bg-white dark:bg-obsidian-850 hover:bg-slate-50 dark:hover:bg-obsidian-800 text-slate-700 dark:text-slate-300 border border-slate-200/70 dark:border-white/5 transition-all text-center flex flex-col items-center gap-1 active:scale-95"
              title="Install on PC / Mac (Chrome, Edge)"
            >
              <Monitor className="w-3.5 h-3.5 text-royal-500 dark:text-cobalt-400" />
              <span className="font-mono text-[10px] font-bold">PC / Mac</span>
            </button>

            <button
              onClick={() => handleInstallClick('ios')}
              className="py-2 px-2.5 rounded-lg bg-white dark:bg-obsidian-850 hover:bg-slate-50 dark:hover:bg-obsidian-800 text-slate-700 dark:text-slate-300 border border-slate-200/70 dark:border-white/5 transition-all text-center flex flex-col items-center gap-1 active:scale-95"
              title="Add to Home Screen on iOS"
            >
              <Smartphone className="w-3.5 h-3.5 text-royal-500 dark:text-cobalt-400" />
              <span className="font-mono text-[10px] font-bold">iOS / Apple</span>
            </button>

            <button
              onClick={() => handleInstallClick('android')}
              className="py-2 px-2.5 rounded-lg bg-white dark:bg-obsidian-850 hover:bg-slate-50 dark:hover:bg-obsidian-800 text-slate-700 dark:text-slate-300 border border-slate-200/70 dark:border-white/5 transition-all text-center flex flex-col items-center gap-1 active:scale-95"
              title="Add to Home Screen on Android"
            >
              <Download className="w-3.5 h-3.5 text-royal-500 dark:text-cobalt-400" />
              <span className="font-mono text-[10px] font-bold">Android</span>
            </button>
          </div>
        </div>
      )}

      {/* iOS Modal */}
      <IosInstallModal
        isOpen={showIosModal}
        onClose={() => setShowIosModal(false)}
      />
    </div>
  );
};
