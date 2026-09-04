import React, { useState, useEffect } from 'react';
import { Download, Monitor, Smartphone, CheckCircle2 } from 'lucide-react';
import { DeviceInstallModal, PlatformType } from './DeviceInstallModal';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const PwaInstallCard: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformType>('pc');

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
      setDeferredPrompt(null);
      setModalOpen(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const triggerNativePrompt = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          setIsInstalled(true);
          setModalOpen(false);
        }
        setDeferredPrompt(null);
      } catch (err) {
        console.warn('[PWA] Prompt error:', err);
      }
    }
  };

  const handleInstallClick = async (target: PlatformType) => {
    setSelectedPlatform(target);

    if (target === 'ios') {
      setModalOpen(true);
      return;
    }

    if (deferredPrompt) {
      await triggerNativePrompt();
    } else {
      // If browser doesn't offer prompt or it was already dismissed, show step-by-step UI guide
      setModalOpen(true);
    }
  };

  return (
    <div className="lg:col-span-4 space-y-4">
      <div className="flex items-center gap-2">
        <span className="font-mono text-xs uppercase tracking-widest text-royal-600 dark:text-cobalt-400 font-bold block">
          Add us on your device!
        </span>
      </div>

      <p className="text-xs text-slate-600 dark:text-slate-400 leading-[1.68] text-pretty">
        Add IFBBC to your Home Screen or Desktop to view Sunday livestreams, sermons, and prayer requests directly on your device.
      </p>

      {/* Main Standalone Status / Quick Platform Buttons */}
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
        <div className="pt-1">
          {/* Quick Platform Install / Guide Buttons */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleInstallClick('pc')}
              className="py-3 px-2 rounded-xl bg-white dark:bg-obsidian-850 hover:bg-royal-500 hover:text-white dark:hover:bg-cobalt-500 text-slate-700 dark:text-slate-200 border border-slate-200/70 dark:border-white/5 transition-all text-center flex flex-col items-center gap-1.5 active:scale-95 shadow-sm group cursor-pointer"
              title="Install on PC / Mac (Chrome, Edge)"
            >
              <Monitor className="w-4 h-4 text-royal-500 dark:text-cobalt-400 group-hover:text-white transition-colors" />
              <span className="font-mono text-xs font-bold">PC / Mac</span>
            </button>

            <button
              onClick={() => handleInstallClick('ios')}
              className="py-3 px-2 rounded-xl bg-white dark:bg-obsidian-850 hover:bg-royal-500 hover:text-white dark:hover:bg-cobalt-500 text-slate-700 dark:text-slate-200 border border-slate-200/70 dark:border-white/5 transition-all text-center flex flex-col items-center gap-1.5 active:scale-95 shadow-sm group cursor-pointer"
              title="Add to Home Screen on iOS"
            >
              <Smartphone className="w-4 h-4 text-royal-500 dark:text-cobalt-400 group-hover:text-white transition-colors" />
              <span className="font-mono text-xs font-bold">iOS / Apple</span>
            </button>

            <button
              onClick={() => handleInstallClick('android')}
              className="py-3 px-2 rounded-xl bg-white dark:bg-obsidian-850 hover:bg-royal-500 hover:text-white dark:hover:bg-cobalt-500 text-slate-700 dark:text-slate-200 border border-slate-200/70 dark:border-white/5 transition-all text-center flex flex-col items-center gap-1.5 active:scale-95 shadow-sm group cursor-pointer"
              title="Add to Home Screen on Android"
            >
              <Download className="w-4 h-4 text-royal-500 dark:text-cobalt-400 group-hover:text-white transition-colors" />
              <span className="font-mono text-xs font-bold">Android</span>
            </button>
          </div>
        </div>
      )}

      {/* Comprehensive Multi-Device Guide Modal */}
      <DeviceInstallModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialPlatform={selectedPlatform}
        hasNativePrompt={Boolean(deferredPrompt)}
        onNativeInstall={triggerNativePrompt}
      />
    </div>
  );
};
