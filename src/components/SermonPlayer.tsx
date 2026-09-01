import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, RotateCw, Download, Check, Youtube, ExternalLink } from 'lucide-react';
import { SermonItem } from '../types';

const ifbbcSermonArchive: SermonItem[] = [
  {
    id: 'sermon-1',
    title: 'The Sufficiency of the Open Bible: Sola Scriptura in Practice',
    speaker: 'Rev. Hinahon B. Pallones • Senior Pastor',
    date: 'August 30, 2026',
    duration: '44:10',
    scripture: '2 Timothy 3:14–17',
    series: 'The Open Bible Foundation',
    audioUrl: 'https://example.com/audio1.mp3',
    transcript: 'At Inicbulan Fundamental Baptist Bible Church, our foundational conviction is that God has given us His complete, inerrant, and fully sufficient Word. The Bible is not merely a book among books; it is the living voice of our Creator. When Paul charges Timothy to continue in what he has learned, he roots everything in the sacred scriptures...',
    notesSummary: [
      'The plenary verbal inspiration of the 66 canonical books of the Bible.',
      'Scripture is profitable for doctrine, reproof, correction, and instruction in righteousness.',
      'The man of God is made complete, thoroughly equipped for every good work.',
    ],
  },
  {
    id: 'sermon-2',
    title: 'Growing a Healthy Church: The 6 Pillars of Biblical Community',
    speaker: 'Rev. Hinahon B. Pallones • Senior Pastor',
    date: 'August 23, 2026',
    duration: '48:25',
    scripture: 'Acts 2:41–47',
    series: 'Healthy Church DNA',
    audioUrl: 'https://example.com/audio2.mp3',
    transcript: 'What constitutes a truly healthy local church? It is not measured by worldly extravagance, but by spiritual vitality: valuing Worship, growing in Fellowship, engaging in Evangelism, equipping through Discipleship, training Leaders, and developing Ministries...',
    notesSummary: [
      'Devotion to the apostles’ doctrine and fellowship, in breaking of bread and prayers.',
      'Evangelism as a daily rhythm: the Lord adding to the church daily those being saved.',
      'Generosity and unity among church families in Bauan and Batangas.',
    ],
  },
  {
    id: 'sermon-3',
    title: 'Unashamed in Our Generation: Walking Steadfast in Christ',
    speaker: 'Ptr. Edwin Sebastian Lualhati • Youth Pastor',
    date: 'August 16, 2026',
    duration: '39:15',
    scripture: 'Romans 1:16–17 & 1 Timothy 4:12',
    series: 'Adelphoi NextGen Series',
    audioUrl: 'https://example.com/audio3.mp3',
    transcript: 'For I am not ashamed of the gospel of Christ, for it is the power of God unto salvation to everyone who believeth. In our schools, campuses, and workplaces, young people are called to stand as beacons of gospel courage and purity...',
    notesSummary: [
      'The Gospel as the singular divine power for regeneration and life.',
      'Letting no one despise your youth: being an example in word, conduct, love, spirit, faith, and purity.',
      'Practical discipleship through peer accountability in Adelphoi & CAYA life groups.',
    ],
  },
];

export const SermonPlayer: React.FC = () => {
  const [selectedSermon, setSelectedSermon] = useState<SermonItem>(ifbbcSermonArchive[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(142);
  const [duration] = useState<number>(2650);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [activeTab, setActiveTab] = useState<'notes' | 'transcript' | 'scripture'>('notes');
  const [downloaded, setDownloaded] = useState<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => (prev >= duration ? 0 : prev + 1));
      }, 1000 / playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration, playbackSpeed]);

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTime(Number(e.target.value));
  };

  const cycleSpeed = () => {
    const speeds = [1.0, 1.25, 1.5, 2.0];
    const nextIndex = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
    setPlaybackSpeed(speeds[nextIndex]);
  };

  const handleDownload = () => {
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  return (
    <section id="sermons" className="pt-12 pb-16 md:pt-16 md:pb-24 scroll-mt-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-10 md:mb-16 gap-4 sm:gap-6 md:gap-8 pb-6 sm:pb-8 md:pb-12 border-b border-slate-200/80 dark:border-white/5">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-royal-500 dark:text-cobalt-400 font-bold block mb-2">
              Exposition & Pulpit // 07
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white uppercase text-balance">
              Sermons & Expository Media
            </h2>
          </div>
          <a
            href="https://www.youtube.com/@ifbbc"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 self-start md:self-auto"
          >
            <Youtube className="w-4 h-4" />
            <span>YouTube Live Archive</span>
            <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
          </a>
        </div>

        {/* Master Media Player Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Player Unit: Waveform, Scrub Bar, Controls */}
          <div className="lg:col-span-7 ambient-card rounded-3xl p-8 sm:p-10 space-y-8">
            {/* Series Cover / Tag info */}
            <div className="flex items-start justify-between gap-4 pb-8 border-b border-slate-100 dark:border-white/5">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-royal-500 dark:text-cobalt-400 font-bold block mb-1.5">
                  Series: {selectedSermon.series}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
                  {selectedSermon.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 font-semibold">
                  {selectedSermon.speaker} • {selectedSermon.date}
                </p>
              </div>

              <div className="text-right font-mono text-xs text-slate-500 dark:text-slate-400 shrink-0">
                <span className="bg-slate-100 dark:bg-obsidian-800 px-3 py-1.5 rounded-lg text-slate-700 dark:text-slate-300 font-bold">
                  {selectedSermon.scripture}
                </span>
              </div>
            </div>

            {/* Visualizer Waveform Bar Animation */}
            <div className="flex items-center justify-between gap-1 h-12 px-2 bg-slate-50 dark:bg-obsidian-850 rounded-2xl">
              {Array.from({ length: 36 }).map((_, idx) => {
                const heightPercent = isPlaying
                  ? Math.sin(idx * 0.4 + currentTime) * 35 + 50
                  : Math.sin(idx * 0.3) * 20 + 30;
                const isPast = (idx / 36) * duration <= currentTime;

                return (
                  <motion.div
                    key={idx}
                    animate={{ height: `${heightPercent}%` }}
                    transition={{ duration: 0.15 }}
                    className={`w-1 rounded-full transition-colors ${
                      isPast
                        ? 'bg-royal-500 dark:bg-cobalt-400'
                        : 'bg-slate-200 dark:bg-obsidian-750'
                    }`}
                  />
                );
              })}
            </div>

            {/* Scrub Slider */}
            <div className="space-y-2">
              <input
                type="range"
                min={0}
                max={duration}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1.5 bg-slate-200 dark:bg-obsidian-800 rounded-lg appearance-none cursor-pointer accent-royal-500 dark:accent-cobalt-400"
              />
              <div className="flex justify-between font-mono text-[11px] text-slate-400">
                <span>{formatSeconds(currentTime)}</span>
                <span>{selectedSermon.duration}</span>
              </div>
            </div>

            {/* Primary Controls */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setCurrentTime((prev) => Math.max(0, prev - 15))}
                  className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                  title="Rewind 15 seconds"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>

                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-14 h-14 rounded-full bg-royal-500 hover:bg-royal-600 dark:bg-cobalt-500 dark:hover:bg-cobalt-400 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105"
                >
                  {isPlaying ? <Pause className="w-6 h-6 fill-white" /> : <Play className="w-6 h-6 fill-white ml-0.5" />}
                </button>

                <button
                  onClick={() => setCurrentTime((prev) => Math.min(duration, prev + 15))}
                  className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                  title="Forward 15 seconds"
                >
                  <RotateCw className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={cycleSpeed}
                  className="font-mono text-xs font-bold px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-obsidian-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors"
                >
                  {playbackSpeed}x
                </button>

                <button
                  onClick={handleDownload}
                  className="p-2 rounded-lg bg-slate-100 dark:bg-obsidian-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors"
                  title="Download Sermon Study Guide"
                >
                  {downloaded ? <Check className="w-4 h-4 text-emerald-500" /> : <Download className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Notes & Study Drawer */}
          <div className="lg:col-span-5 ambient-card rounded-3xl p-8 sm:p-10 space-y-6">
            {/* Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-white/5 pb-4">
              <button
                onClick={() => setActiveTab('notes')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase font-mono transition-colors ${
                  activeTab === 'notes'
                    ? 'bg-royal-500 dark:bg-cobalt-500 text-white'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Study Notes
              </button>
              <button
                onClick={() => setActiveTab('transcript')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase font-mono transition-colors ${
                  activeTab === 'transcript'
                    ? 'bg-royal-500 dark:bg-cobalt-500 text-white'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Transcript
              </button>
            </div>

            {/* Tab Content */}
            <div className="min-h-[220px]">
              {activeTab === 'notes' ? (
                <div className="space-y-4">
                  <span className="font-mono text-xs font-bold text-royal-500 dark:text-cobalt-400 block">
                    Key Outlines // {selectedSermon.scripture}
                  </span>
                  <ul className="space-y-3">
                    {selectedSermon.notesSummary.map((note, i) => (
                      <li key={i} className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 flex items-start gap-2.5 leading-[1.68]">
                        <span className="w-1.5 h-1.5 rounded-full bg-royal-500 dark:bg-cobalt-400 shrink-0 mt-2" />
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-[1.68] max-h-[260px] overflow-y-auto pr-2">
                  <p>{selectedSermon.transcript}</p>
                </div>
              )}
            </div>

            {/* Archive Selector */}
            <div className="pt-6 border-t border-slate-100 dark:border-white/5 space-y-3">
              <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 block font-bold">
                Select from Expository Series
              </span>
              <div className="space-y-2">
                {ifbbcSermonArchive.map((sermon) => (
                  <button
                    key={sermon.id}
                    onClick={() => {
                      setSelectedSermon(sermon);
                      setCurrentTime(0);
                      setIsPlaying(true);
                    }}
                    className={`w-full p-3 rounded-xl text-left text-xs transition-all flex items-center justify-between ${
                      selectedSermon.id === sermon.id
                        ? 'bg-royal-500/10 dark:bg-cobalt-500/20 text-royal-600 dark:text-cobalt-400 font-bold'
                        : 'hover:bg-slate-50 dark:hover:bg-obsidian-850 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="truncate pr-2">{sermon.title}</span>
                    <span className="font-mono text-[10px] shrink-0 opacity-70">{sermon.duration}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
