import React from 'react';
import { motion } from 'framer-motion';
import { Youtube, ExternalLink, BookOpen, Headphones } from 'lucide-react';

export const SermonPlayer: React.FC = () => {
  return (
    <section id="sermons" className="pt-12 pb-16 md:pt-16 md:pb-24 scroll-mt-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-10 md:mb-16 gap-4 sm:gap-6 md:gap-8 pb-6 sm:pb-8 md:pb-12 border-b border-slate-200/80 dark:border-white/5">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-royal-500 dark:text-cobalt-400 font-bold block mb-2">
              Exposition & Pulpit // 05
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

        {/* Coming Soon — Sermon Archive Placeholder */}
        <div className="ambient-card rounded-3xl p-10 sm:p-16 text-center space-y-8">
          {/* Animated Icon */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center"
          >
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-royal-500/15 to-cobalt-500/10 dark:from-cobalt-500/20 dark:to-royal-500/10 flex items-center justify-center">
              <Headphones className="w-9 h-9 text-royal-500 dark:text-cobalt-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-3"
          >
            <span className="font-mono text-xs uppercase tracking-widest text-royal-500 dark:text-cobalt-400 font-bold block">
              Coming Soon
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
              Sermon Archive
            </h3>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-lg mx-auto leading-[1.68] text-pretty">
              Our expository sermon library is being prepared. In the meantime, watch our worship services and preaching live on YouTube.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <a
              href="https://www.youtube.com/@ifbbc"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-red-500 hover:bg-red-600 text-white rounded-full font-bold text-sm uppercase tracking-wider transition-all shadow-lg hover:shadow-xl hover:scale-[1.02]"
            >
              <Youtube className="w-5 h-5" />
              <span>Watch on YouTube</span>
            </a>

            <a
              href="https://www.facebook.com/inicbulanfundamental.baptistbiblechurch"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-obsidian-950 rounded-full font-bold text-sm uppercase tracking-wider transition-all hover:scale-[1.02]"
            >
              <BookOpen className="w-4.5 h-4.5" />
              <span>Follow on Facebook</span>
            </a>
          </motion.div>

          {/* Service Times Reminder */}
          <div className="pt-6 border-t border-slate-100 dark:border-white/5 max-w-md mx-auto">
            <p className="font-mono text-[11px] text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Join us live every Sunday at 10:00 AM for expository preaching from the Open Bible
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
