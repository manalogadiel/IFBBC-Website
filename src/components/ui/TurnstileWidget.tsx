import React, { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement | string,
        params: {
          sitekey: string;
          callback?: (token: string) => void;
          'error-callback'?: (error: any) => void;
          'expired-callback'?: () => void;
          theme?: 'auto' | 'light' | 'dark';
          size?: 'normal' | 'compact' | 'flexible';
        }
      ) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
    onloadTurnstileCallback?: () => void;
  }
}

// Cloudflare official always-passing dummy site key for testing
const CLOUDFLARE_TEST_SITE_KEY = '1x00000000000000000000AA';

interface TurnstileWidgetProps {
  onVerify: (token: string) => void;
  onExpire?: () => void;
  onError?: (err?: any) => void;
  className?: string;
  theme?: 'auto' | 'light' | 'dark';
}

export const TurnstileWidget: React.FC<TurnstileWidgetProps> = ({
  onVerify,
  onExpire,
  onError,
  className = '',
  theme = 'auto',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const siteKey =
    (import.meta.env.VITE_CLOUDFLARE_TURNSTILE_SITE_KEY || '').trim() ||
    CLOUDFLARE_TEST_SITE_KEY;

  useEffect(() => {
    let isMounted = true;

    // Load the Turnstile script dynamically if not already on the page
    const scriptId = 'cloudflare-turnstile-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;

    const renderWidget = () => {
      if (!isMounted || !containerRef.current || !window.turnstile) return;

      // Clean up existing widget if re-rendering
      if (widgetIdRef.current) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          // ignore cleanup errors
        }
        widgetIdRef.current = null;
      }

      try {
        const id = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          theme,
          callback: (token: string) => {
            if (isMounted) onVerify(token);
          },
          'expired-callback': () => {
            if (isMounted && onExpire) onExpire();
          },
          'error-callback': (err: any) => {
            if (isMounted && onError) onError(err);
          },
        });
        widgetIdRef.current = id;
        setIsLoaded(true);
      } catch (e) {
        console.warn('Turnstile render warning:', e);
      }
    };

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        renderWidget();
      };
      document.head.appendChild(script);
    } else if (window.turnstile) {
      renderWidget();
    } else {
      script.addEventListener('load', renderWidget);
    }

    return () => {
      isMounted = false;
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          // ignore cleanup errors
        }
        widgetIdRef.current = null;
      }
    };
  }, [siteKey, theme]);

  return (
    <div className={`turnstile-container flex justify-center my-2 ${className}`}>
      <div ref={containerRef} className="min-h-[65px] flex items-center justify-center" />
      {!isLoaded && (
        <div className="text-[11px] text-slate-400 dark:text-slate-500 animate-pulse font-mono py-2">
          Initializing security verification...
        </div>
      )}
    </div>
  );
};
