import React, { useState, useEffect } from 'react';
import { Download, Monitor, Smartphone, CheckCircle2 } from 'lucide-react';
import { DeviceInstallModal, PlatformType } from './DeviceInstallModal';
import churchLogo from '../assets/logo-hd.png';

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

    // Check if prompt was already captured globally in index.html
    if ((window as any).__pwaInstallPrompt) {
      setDeferredPrompt((window as any).__pwaInstallPrompt);
    }

    const handlePromptReady = (e: any) => {
      const p = e.detail || (window as any).__pwaInstallPrompt;
      if (p) setDeferredPrompt(p);
    };

    // Listen for beforeinstallprompt event (Chrome, Edge, Android)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      (window as any).__pwaInstallPrompt = e;
    };

    // Listen for successful installation
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      (window as any).__pwaInstallPrompt = null;
      setModalOpen(false);
    };

    window.addEventListener('pwa-prompt-ready', handlePromptReady);
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('pwa-prompt-ready', handlePromptReady);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const triggerNativePrompt = async (): Promise<boolean> => {
    const promptEvent = deferredPrompt || (window as any).__pwaInstallPrompt;
    if (promptEvent) {
      try {
        await promptEvent.prompt();
        const choice = await promptEvent.userChoice;
        if (choice.outcome === 'accepted') {
          setIsInstalled(true);
          setModalOpen(false);
        }
        setDeferredPrompt(null);
        (window as any).__pwaInstallPrompt = null;
        return true;
      } catch (err) {
        console.warn('[PWA] Prompt error:', err);
      }
    }
    return false;
  };

  const handleInstallClick = async (target: PlatformType) => {
    setSelectedPlatform(target);

    if (target === 'ios') {
      setModalOpen(true);
      return;
    }

    // Attempt direct native 1-tap installation immediately!
    const promptEvent = deferredPrompt || (window as any).__pwaInstallPrompt;
    if (promptEvent) {
      const success = await triggerNativePrompt();
      if (success) return;
    }

    // If browser doesn't offer prompt (e.g. Safari, or HTTP local test), show step-by-step guide
    setModalOpen(true);
  };

  return (
    <div className="lg:col-span-4 space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative w-11 h-11 rounded-2xl overflow-hidden shadow-sm ring-1 ring-royal-500/25 dark:ring-cobalt-400/30 flex items-center justify-center shrink-0 bg-slate-900">
          <img
            src={churchLogo}
            alt="IFBBC App Logo"
            className="w-full h-full object-contain p-1"
          />
          {/* Shiny Specular Shimmer Ray */}
          <div className="absolute -inset-full top-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-nav-shine pointer-events-none" />
        </div>
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-royal-600 dark:text-cobalt-400 font-bold block">
            Add us on your device!
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">
            IFBBC Web Application
          </span>
        </div>
      </div>

      <p className="text-xs text-slate-600 dark:text-slate-400 leading-[1.68] text-pretty">
        Add IFBBC to your Home Screen or Desktop to view Sunday livestreams, sermons, and prayer requests directly on your device.
      </p>

      {/* Main Standalone Status / Quick Platform Buttons */}
      {isStandalone || isInstalled ? (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <p className="font-bold text-xs">App Installed & Active</p>
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
