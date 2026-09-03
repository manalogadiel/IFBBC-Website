import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Radio, Play, ExternalLink } from 'lucide-react';
import type { LivestreamsData, StreamInfo } from '../server/livestreamService';

// Default static data in case of immediate render before API resolves
const initialData: LivestreamsData = {
  youtube: {
    platform: 'youtube',
    status: 'completed',
    title: 'PRAYER MEETING & MIDWEEK EXPOSITORY PREACHING',
    subtitle: 'Latest livestreamed worship and fellowship service',
    thumbnailUrl: 'https://images.unsplash.com/photo-1519791883288-dc8bd696e667?q=80&w=1200&auto=format&fit=crop',
    videoUrl: 'https://www.youtube.com/@ifbbc/streams',
    channelName: 'IFBBC Official',
    channelUrl: 'https://www.youtube.com/@ifbbc',
  },
  facebook: {
    platform: 'facebook',
    status: 'completed',
    title: 'SUNDAY DIVINE WORSHIP CELEBRATION',
    subtitle: 'Sunday morning divine message & congregational praise',
    thumbnailUrl: 'https://images.unsplash.com/photo-1510590337019-5ef8d3d32116?q=80&w=1200&auto=format&fit=crop',
    videoUrl: 'https://www.facebook.com/inicbulanfundamental.baptistbiblechurch',
    channelName: 'Inicbulan Fundamental Baptist Bible Church',
    channelUrl: 'https://www.facebook.com/inicbulanfundamental.baptistbiblechurch',
  },
  activeStream: null,
  lastUpdated: Date.now(),
};

export const SermonPlayer: React.FC = () => {
  const [streamData, setStreamData] = useState<LivestreamsData>(initialData);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchStreams = async () => {
    try {
      const response = await fetch('/api/livestreams');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: LivestreamsData = await response.json();
      setStreamData(data);
    } catch (err) {
      console.warn('Unable to load live stream feed, using resilient fallback:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStreams();

    // Auto-poll status every 60 seconds to detect when service starts or concludes
    const interval = setInterval(() => {
      fetchStreams();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Platform sorting: Place active livestream first if either is live
  const cards: StreamInfo[] = React.useMemo(() => {
    const list = [streamData.youtube, streamData.facebook];
    if (streamData.activeStream === 'facebook') {
      return [streamData.facebook, streamData.youtube];
    }
    return list; // YouTube first by default or when YouTube is live
  }, [streamData]);

  return (
    <section id="sermons" className="pt-6 pb-6 sm:pt-8 sm:pb-8 md:pt-10 md:pb-10 scroll-mt-20 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-royal-500/10 dark:bg-cobalt-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-8 md:mb-10 gap-4 sm:gap-6 pb-4 sm:pb-6 border-b border-slate-200/80 dark:border-white/5">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-royal-500 dark:text-cobalt-400 font-bold block mb-2">
              WATCH & JOIN US
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white uppercase text-balance">
              Sermons & Livestream
            </h2>
          </div>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-md leading-[1.68] text-pretty">
            Experience our latest worship services and expository messages wherever you are, broadcast live from the IFBBC pulpit.
          </p>
        </div>

        {/* Livestream Grid: Side-by-Side on Desktop, Stacked on Mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {loading ? (
            // Skeleton Loading State
            <>
              <SkeletonCard platform="YouTube" />
              <SkeletonCard platform="Facebook" />
            </>
          ) : (
            cards.map((stream) => (
              <StreamCard key={stream.platform} stream={stream} />
            ))
          )}
        </div>
      </div>
    </section>
  );
};

// Polished Stream Card
interface StreamCardProps {
  stream: StreamInfo;
}

const StreamCard: React.FC<StreamCardProps> = ({ stream }) => {
  const isLive = stream.status === 'live';
  const isScheduled = stream.status === 'scheduled';
  const isYouTube = stream.platform === 'youtube';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 overflow-hidden ${isLive
        ? 'bg-slate-900/90 dark:bg-[#0b1329]/95 border-2 border-royal-500/80 shadow-[0_0_45px_rgba(37,99,235,0.3)] ring-1 ring-royal-400/50'
        : 'ambient-card border border-slate-200/50 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
        }`}
    >
      {/* Live Subtle Radiant Backdrop Glow */}
      {isLive && (
        <div className="absolute top-0 right-0 w-80 h-80 bg-royal-500/15 dark:bg-cobalt-500/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      )}

      <div>
        {/* Top Meta Bar */}
        <div className="flex items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            {isYouTube ? (
              <div className="w-9 h-9 rounded-xl bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-500 shrink-0">
                <YouTubeIcon className="w-5 h-5 fill-current" />
              </div>
            ) : (
              <div className="w-9 h-9 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-500 shrink-0">
                <FacebookIcon className="w-5 h-5 fill-current" />
              </div>
            )}

            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                {isYouTube ? 'YouTube Live' : 'Facebook Live'}
              </span>
              <span className="text-sm font-semibold text-slate-900 dark:text-white block">
                {stream.channelName}
              </span>
            </div>
          </div>

          {/* Status Badge — only shown when broadcasting or scheduled */}
          {isLive ? (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-600 text-white font-mono text-[11px] font-extrabold uppercase tracking-wider shadow-lg shadow-red-600/30 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              <span>WE'RE LIVE NOW</span>
            </div>
          ) : isScheduled ? (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 font-mono text-[11px] font-bold uppercase tracking-wider">
              <Radio className="w-3 h-3" />
              <span>SCHEDULED</span>
            </div>
          ) : null}
        </div>

        {/* Video Preview Frame */}
        <a
          href={stream.videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group block relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-200/40 dark:border-white/10 shadow-lg mb-6 cursor-pointer"
        >
          <img
            src={stream.thumbnailUrl}
            alt={stream.title}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />

          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-white shadow-2xl backdrop-blur-md transition-all duration-300 group-hover:scale-110 ${isLive
                ? 'bg-red-600/90 group-hover:bg-red-600 shadow-red-600/40'
                : 'bg-royal-600/80 group-hover:bg-royal-600 shadow-royal-600/30'
                }`}
            >
              <Play className="w-6 h-6 fill-current ml-1" />
            </div>
          </div>

          {/* Bottom Banner Over Preview */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-mono text-white/90">
            <span className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-medium truncate max-w-[70%]">
              {isYouTube ? '@ifbbc • Official Stream' : 'IFBBC Facebook Page'}
            </span>
            <span className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md text-[11px]">
              <ExternalLink className="w-3 h-3" />
              <span>Open</span>
            </span>
          </div>
        </a>

        {/* Video Title & Subtitle */}
        <div className="space-y-2 mb-6">
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase line-clamp-2 leading-tight">
            {stream.title}
          </h3>
          {stream.subtitle && (
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium line-clamp-2">
              {stream.subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Action Button */}
      <div>
        <a
          href={stream.videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-md ${isLive
            ? 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-red-600/30 animate-pulse'
            : isYouTube
              ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/20'
              : 'bg-royal-600 hover:bg-royal-700 text-white shadow-royal-600/20'
            }`}
        >
          {isLive ? (
            <>
              <Radio className="w-4 h-4 animate-spin" />
              <span>WATCH LIVE</span>
            </>
          ) : isYouTube ? (
            <>
              <YouTubeIcon className="w-4 h-4 fill-current" />
              <span>WATCH ON YOUTUBE</span>
            </>
          ) : (
            <>
              <FacebookIcon className="w-4 h-4 fill-current" />
              <span>WATCH ON FACEBOOK</span>
            </>
          )}
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </motion.div>
  );
};

// Skeleton Placeholder during data fetch
const SkeletonCard: React.FC<{ platform: string }> = ({ platform }) => (
  <div
    aria-label={`Loading ${platform} livestream`}
    className="ambient-card rounded-3xl p-6 sm:p-8 space-y-5 animate-pulse border border-slate-200/50 dark:border-white/10"
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-slate-300 dark:bg-white/10" />
        <div className="space-y-1.5">
          <div className="w-24 h-3 rounded bg-slate-300 dark:bg-white/10" />
          <div className="w-36 h-4 rounded bg-slate-300 dark:bg-white/10" />
        </div>
      </div>
    </div>

    <div className="w-full aspect-video rounded-2xl bg-slate-300 dark:bg-white/10" />

    <div className="space-y-2">
      <div className="w-3/4 h-6 rounded bg-slate-300 dark:bg-white/10" />
      <div className="w-1/2 h-4 rounded bg-slate-300 dark:bg-white/10" />
    </div>

    <div className="w-full h-12 rounded-xl bg-slate-300 dark:bg-white/10" />
  </div>
);

// Clean SVG Icons
const YouTubeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const FacebookIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);
