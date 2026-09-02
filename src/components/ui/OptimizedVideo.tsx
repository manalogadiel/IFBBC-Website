import React, { useState, useEffect, useRef } from 'react';

export interface OptimizedVideoProps {
  mp4Src: string;
  webmSrc?: string;
  posterSrc?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  preload?: 'none' | 'metadata' | 'auto';
  className?: string;
  aspectRatio?: string;
  onLoadedData?: () => void;
}

/**
 * High-performance video player with:
 * 1. IntersectionObserver lazy-loading (avoids wasted bandwidth off-screen)
 * 2. Instant poster image rendering with smooth decode crossfade
 * 3. Modern format fallbacks (WebM VP9/AV1 with MP4 H.264 fallback)
 * 4. Automatic pause when scrolled out of view to preserve mobile battery & memory
 */
export const OptimizedVideo: React.FC<OptimizedVideoProps> = ({
  mp4Src,
  webmSrc,
  posterSrc,
  autoPlay = false,
  muted = true,
  loop = false,
  controls = false,
  preload = 'metadata',
  className = '',
  aspectRatio = '16/9',
  onLoadedData,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isInViewport, setIsInViewport] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Trigger loading 150px before entering screen for seamless playback
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInViewport(true);
            if (autoPlay && videoRef.current) {
              videoRef.current.play().catch(() => {
                // Autoplay may be deferred by browser policy until interaction
              });
            }
          } else {
            // Pause background playback when scrolled away
            if (videoRef.current && !videoRef.current.paused) {
              videoRef.current.pause();
            }
          }
        });
      },
      {
        rootMargin: '150px 0px',
        threshold: 0.1,
      }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [autoPlay]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden bg-slate-900/10 dark:bg-obsidian-950/40 ${className}`}
      style={{ aspectRatio }}
    >
      {/* 1. Instant Poster Fallback (0ms paint, prevents CLS layout shift) */}
      {posterSrc && (
        <img
          src={posterSrc}
          alt="Video thumbnail preview"
          loading="lazy"
          decoding="async"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-out z-0 ${
            isVideoReady ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        />
      )}

      {/* 2. Lazy Video Stream */}
      <video
        ref={videoRef}
        poster={posterSrc}
        preload={preload}
        playsInline
        muted={muted}
        loop={loop}
        controls={controls}
        onLoadedData={() => {
          setIsVideoReady(true);
          onLoadedData?.();
        }}
        className={`relative w-full h-full object-cover z-10 transition-opacity duration-500 ${
          isVideoReady || !posterSrc ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {isInViewport && (
          <>
            {webmSrc && <source src={webmSrc} type="video/webm" />}
            <source src={mp4Src} type="video/mp4" />
            Your browser does not support HTML5 video.
          </>
        )}
      </video>
    </div>
  );
};
