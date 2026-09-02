import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Check, X } from 'lucide-react';

interface Leader {
  name: string;
  role: string;
  title: string;
  demographic: string;
  bio: string;
  focus: string[];
  quote: string;
  email: string;
}

export const LeadershipSection: React.FC = () => {
  const [counselingModalOpen, setCounselingModalOpen] = useState(false);
  const [selectedPastor, setSelectedPastor] = useState<string>('Rev. Hinahon B. Pallones');
  const [appointmentSent, setAppointmentSent] = useState(false);

  const leaders: Leader[] = [
    {
      name: 'Rev. Hinahon B. Pallones',
      role: 'Senior Pastor',
      title: 'Under-Shepherd & Expository Preacher',
      demographic: 'General Congregation, Elder Council & Pulpit Ministry',
      bio: 'Serving with steadfast dedication to the exposition of the Scriptures, Rev. Hinahon B. Pallones shepherds IFBBC with a passion for biblical doctrine, prayer, family discipleship, and city-wide outreach in Bauan and Batangas.',
      focus: ['Expository Preaching', 'Pastoral Counseling', 'Church Vision & Doctrine', 'Missions & Church Planting'],
      quote: '“Standing steadfast on the authority of God\u2019s Word, discipling the flock in truth, and laboring together in the Great Commission.” — 2 Timothy 4:2',
      email: 'iffbc2021@gmail.com',
    },
    {
      name: 'Ptr. Edwin Sebastian Lualhati',
      role: 'Youth Pastor',
      title: 'NextGen & Discipleship Shepherd',
      demographic: 'Adelphoi Youth, Campus Outreach & Young Adults',
      bio: 'Ptr. Edwin Sebastian Lualhati leads the NextGen ministries of IFBBC, passionate about raising a generation of young people who are unashamed of the Gospel, biblically grounded, and active in ministry leadership.',
      focus: ['Adelphoi Youth Fellowship', 'Collegiate & High School Discipleship', 'Youth Music & Worship', 'Evangelistic Camps'],
      quote: '“Discipling youth and young people to be unashamed of the Gospel, rooted in the Scriptures, and shining as lights in their generation.” — Romans 1:16',
      email: 'iffbc2021@gmail.com',
    },
  ];

  const handleSubmitCounseling = (e: React.FormEvent) => {
    e.preventDefault();
    setAppointmentSent(true);
    setTimeout(() => {
      setAppointmentSent(false);
      setCounselingModalOpen(false);
    }, 2500);
  };

  return (
    <section id="leadership" className="pt-12 pb-16 md:pt-16 md:pb-24 scroll-mt-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-10 md:mb-16 gap-4 sm:gap-6 md:gap-8 pb-6 sm:pb-8 md:pb-12 border-b border-slate-200/80 dark:border-white/5">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-royal-500 dark:text-cobalt-400 font-bold block mb-2">
              Our Pastors
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white uppercase text-balance">
              Pastoral Leadership
            </h2>
          </div>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-md leading-[1.68] text-pretty">
            We value our Pastors and church leaders (Core Value #10), honoring those God has called to minister the Word and shepherd the flock with biblical fidelity.
          </p>
        </div>

        {/* 2 Pastoral Feature Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {leaders.map((leader) => (
            <div
              key={leader.name}
              className="ambient-card rounded-3xl p-8 sm:p-12 space-y-6 relative flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3.5 py-1 rounded-full bg-royal-500/10 dark:bg-cobalt-500/20 text-royal-600 dark:text-cobalt-400 font-mono text-xs font-bold uppercase tracking-wider">
                    {leader.role}
                  </span>
                  <span className="font-mono text-[10px] uppercase text-slate-400 dark:text-slate-500">
                    Ordained Ministry
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
                    {leader.name}
                  </h3>
                  <span className="text-xs font-mono text-royal-500 dark:text-cobalt-400 block mt-1 font-bold">
                    {leader.title}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-[1.68] text-pretty">
                  {leader.bio}
                </p>

                {/* Focus Areas */}
                <div className="space-y-2 pt-2">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold block">
                    Ministry Focus & Portfolio
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {leader.focus.map((f) => (
                      <span
                        key={f}
                        className="px-3 py-1 bg-slate-50 dark:bg-obsidian-850 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Quote Box */}
                <div className="p-5 bg-slate-50/80 dark:bg-obsidian-850 rounded-2xl border-l-2 border-royal-500 dark:border-cobalt-400">
                  <p className="text-xs italic text-slate-700 dark:text-slate-300 leading-[1.68]">
                    {leader.quote}
                  </p>
                </div>
              </div>

              {/* Action */}
              <div className="pt-6 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                  {leader.email}
                </span>
                <button
                  onClick={() => {
                    setSelectedPastor(leader.name);
                    setCounselingModalOpen(true);
                  }}
                  className="px-4 py-2 bg-royal-500 hover:bg-royal-600 dark:bg-cobalt-500 dark:hover:bg-cobalt-400 text-white rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Request Meeting</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pastoral Counseling / Meeting Modal */}
      <AnimatePresence>
        {counselingModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCounselingModalOpen(false)}
              className="fixed inset-0 bg-slate-950/70 dark:bg-black/85 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl ambient-card rounded-3xl p-8 sm:p-12 z-10 my-8 overflow-hidden"
            >
              <div className="flex items-center justify-between pb-6 mb-8 border-b border-slate-100 dark:border-white/5">
                <div>
                  <span className="font-mono text-xs uppercase tracking-widest text-royal-500 dark:text-cobalt-400 font-bold block">
                    Pastoral Care & Guidance
                  </span>
                  <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
                    Request Pastoral Meeting
                  </h3>
                </div>
                <button
                  onClick={() => setCounselingModalOpen(false)}
                  className="w-9 h-9 rounded-full bg-slate-100 dark:bg-obsidian-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {appointmentSent ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                    Meeting Request Sent
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-[1.68]">
                    Our pastoral office will reach out to you via email or phone to confirm the schedule.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitCounseling} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 font-bold">
                        Pastoral Shepherd
                      </label>
                      <select
                        value={selectedPastor}
                        onChange={(e) => setSelectedPastor(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-obsidian-850 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-royal-500/40"
                      >
                        <option value="Rev. Hinahon B. Pallones">Rev. Hinahon B. Pallones (Senior Pastor)</option>
                        <option value="Ptr. Edwin Sebastian Lualhati">Ptr. Edwin Sebastian Lualhati (Youth Pastor)</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 font-bold">
                          Your Name
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Maria Santos"
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-obsidian-850 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-royal-500/40"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 font-bold">
                          Phone / Email
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 0917-xxx-xxxx or email@example.com"
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-obsidian-850 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-royal-500/40"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 font-bold">
                        Purpose of Meeting
                      </label>
                      <textarea
                        rows={3}
                        required
                        placeholder="Pastoral counseling, baptism inquiry, prayer request, or spiritual guidance..."
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-obsidian-850 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-royal-500/40 resize-none"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-3 bg-royal-500 hover:bg-royal-600 dark:bg-cobalt-500 dark:hover:bg-cobalt-400 text-white font-bold text-xs rounded-full uppercase tracking-wider transition-all"
                    >
                      Submit Appointment Request
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
