import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ChevronDown, Calendar, CheckCircle2 } from 'lucide-react';
import { MagneticButton } from './ui/MagneticButton';

interface ServiceScheduleProps {
  onOpenVisit: (serviceTime?: string) => void;
}

interface WeeklyServiceItem {
  id: string;
  day: string;
  time: string;
  service: string;
  category: string;
  description: string;
  location: string;
  frequency: string;
  features: string[];
}

const weeklyServices: WeeklyServiceItem[] = [
  {
    id: 'sun-lifegroup',
    day: 'Sunday',
    time: '9:00 AM',
    service: 'Life Group',
    category: 'Sunday Morning Discipleship',
    description: 'Small group biblical discussion, age-graded Sunday school classes (Kiddos, Adelphoi, CAYA, A-Men, Womisso), scripture study, and personal fellowship before the main worship gathering.',
    location: 'IFBBC Classrooms & Fellowship Hall',
    frequency: 'Weekly',
    features: ['Age-Graded Life Groups', 'Interactive Bible Study', 'Prayer Support', 'Spiritual Pathway'],
  },
  {
    id: 'sun-worship',
    day: 'Sunday',
    time: '10:00 AM',
    service: 'Worship Service',
    category: 'Corporate Lord\'s Day Gathering',
    description: 'Our primary congregational gathering featuring reverent praise, corporate prayer, congregational singing, and solid verse-by-verse expository preaching from the King James / Open Bible.',
    location: 'IFBBC Main Sanctuary',
    frequency: 'Weekly',
    features: ['Expository Preaching', 'Corporate Hymns & Praise', 'Communion & Tithes', 'Nursery Care'],
  },
  {
    id: 'sun-prayer-fasting',
    day: 'Sunday',
    time: '11:30 AM',
    service: 'Prayer & Fasting Service (quarterly)',
    category: 'Quarterly Consecration',
    description: 'A dedicated quarterly season of church-wide prayer, fasting, personal confession, spiritual renewal, and seeking God’s guidance for our mission fields and outreaches.',
    location: 'IFBBC Main Sanctuary',
    frequency: 'Quarterly',
    features: ['Corporate Intercession', 'Mission Field Focus', 'Spiritual Consecration', 'Pastoral Blessing'],
  },
  {
    id: 'wed-prayer',
    day: 'Wednesday',
    time: '6:00 PM',
    service: 'Prayer Meeting',
    category: 'Midweek Spiritual Anchor',
    description: 'Midweek gathering for biblical exhortation and intensive prayer for sick members, church families, pastoral guidance, local government, and worldwide missions.',
    location: 'IFBBC Prayer Sanctuary',
    frequency: 'Weekly',
    features: ['Pastoral Exhortation', 'Corporate Prayer Requests', 'Testimony Sharing', 'Family Intercession'],
  },
  {
    id: 'fri-cottage',
    day: 'Friday',
    time: '6:00 PM',
    service: 'Cottage Service',
    category: 'Home & Community Fellowship',
    description: 'Intimate neighborhood home gatherings hosted across various puroks and barangays in Bauan for evangelism, warm fellowship, and grassroots discipleship.',
    location: 'Designated Member Homes in Bauan',
    frequency: 'Weekly',
    features: ['Home Fellowship', 'Neighborhood Evangelism', 'Shared Food & Koinonia', 'Personal Testimony'],
  },
  {
    id: 'sat-missions',
    day: 'Saturday',
    time: '2:00 PM',
    service: 'Missions',
    category: 'Evangelistic Outreach & Planting',
    description: 'Practical Gospel mobilization, street preaching, Bible distribution, medical/mercy outreaches, and supporting satellite mission points and church plants in Batangas province.',
    location: 'Mission Outreaches & Community Centers',
    frequency: 'Weekly',
    features: ['Gospel Outreach', 'Tract Distribution', 'Community Mercy', 'Youth Mobilization'],
  },
];

export const ServiceSchedule: React.FC<ServiceScheduleProps> = ({ onOpenVisit }) => {
  const [activeId, setActiveId] = useState<string>('sun-worship');
  const [calendarSaved, setCalendarSaved] = useState<string | null>(null);

  const handleDownloadCalendar = (item: WeeklyServiceItem, e: React.MouseEvent) => {
    e.stopPropagation();
    // Simulate .ics generation
    setCalendarSaved(item.id);
    setTimeout(() => setCalendarSaved(null), 2500);
  };

  return (
    <section id="schedule" className="pt-12 pb-16 md:pt-16 md:pb-24 scroll-mt-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8 pb-12 border-b border-slate-200/80 dark:border-white/5">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-royal-500 dark:text-cobalt-400 font-bold block mb-2">
              Liturgical Order // 03
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white uppercase text-balance">
              Weekly Service Schedule
            </h2>
          </div>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-md leading-[1.68] text-pretty">
            Join us throughout the week for worship, discipleship, fervent prayer, cottage fellowship, and active missions in Bauan and Batangas.
          </p>
        </div>

        {/* Swiss Clean Schedule Summary Table */}
        <div className="ambient-card rounded-3xl p-8 sm:p-10 mb-12 overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-white/10 font-mono text-[10px] sm:text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500">
                <th className="pb-4 font-bold">Day</th>
                <th className="pb-4 font-bold">Time</th>
                <th className="pb-4 font-bold">Service / Gathering</th>
                <th className="pb-4 font-bold hidden sm:table-cell">Frequency</th>
                <th className="pb-4 font-bold text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {weeklyServices.map((s) => (
                <tr
                  key={s.id}
                  onClick={() => setActiveId(s.id)}
                  className={`cursor-pointer transition-colors duration-200 ${
                    activeId === s.id
                      ? 'bg-royal-50/50 dark:bg-royal-500/10'
                      : 'hover:bg-slate-50 dark:hover:bg-obsidian-850'
                  }`}
                >
                  <td className="py-4 font-bold text-slate-900 dark:text-white font-mono">
                    {s.day}
                  </td>
                  <td className="py-4 font-bold text-royal-500 dark:text-cobalt-400 font-mono">
                    {s.time}
                  </td>
                  <td className="py-4 font-extrabold text-slate-900 dark:text-slate-100">
                    {s.service}
                  </td>
                  <td className="py-4 text-slate-500 dark:text-slate-400 hidden sm:table-cell text-xs font-mono">
                    {s.frequency}
                  </td>
                  <td className="py-4 text-right">
                    <span className="text-xs font-bold text-royal-500 dark:text-cobalt-400">
                      {activeId === s.id ? 'Expanded' : 'View'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Detailed Accordion Cards */}
        <div className="space-y-6">
          {weeklyServices.map((service) => {
            const isOpen = activeId === service.id;

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`ambient-card rounded-3xl transition-all duration-300 overflow-hidden ${
                  isOpen ? 'ring-2 ring-royal-500/20 dark:ring-cobalt-400/20' : ''
                }`}
              >
                {/* Trigger Header */}
                <button
                  onClick={() => setActiveId(isOpen ? '' : service.id)}
                  className="w-full p-8 sm:p-10 flex flex-col sm:flex-row sm:items-center justify-between text-left gap-6 focus:outline-none"
                >
                  <div className="flex items-start sm:items-center gap-6">
                    <div className="flex flex-col">
                      <span className="font-mono text-xs uppercase font-bold text-slate-400 dark:text-slate-500">
                        {service.day}
                      </span>
                      <span className="font-mono text-xl sm:text-2xl font-black text-royal-500 dark:text-cobalt-400">
                        {service.time}
                      </span>
                    </div>

                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 block">
                        {service.category}
                      </span>
                      <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5 uppercase">
                        {service.service}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-royal-500 dark:text-cobalt-400" />
                      {service.location}
                    </span>

                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="w-9 h-9 rounded-full bg-slate-100 dark:bg-obsidian-800 flex items-center justify-center text-slate-600 dark:text-slate-300 shrink-0"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </motion.div>
                  </div>
                </button>

                {/* Content Drawer */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-8 sm:px-10 pb-10 space-y-8">
                        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-[1.68] max-w-3xl text-pretty">
                          {service.description}
                        </p>

                        {/* Features Tags & Venue Spec */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/80 dark:bg-obsidian-850 p-6 rounded-2xl">
                          <div>
                            <span className="font-mono text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold block mb-3">
                              Key Highlights
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {service.features.map((feat) => (
                                <span
                                  key={feat}
                                  className="px-3 py-1 bg-white dark:bg-obsidian-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold shadow-sm"
                                >
                                  {feat}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div>
                            <span className="font-mono text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold block mb-3">
                              Location Spec
                            </span>
                            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                              {service.location} • Purok Munlawin, Brgy. Inicbulan, Bauan, Batangas 4201
                            </p>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap items-center gap-4 pt-2">
                          <MagneticButton
                            variant="primary"
                            size="sm"
                            onClick={() => onOpenVisit(service.time)}
                          >
                            <span>Plan to Attend</span>
                            <MapPin className="w-3.5 h-3.5 ml-1" />
                          </MagneticButton>

                          <button
                            onClick={(e) => handleDownloadCalendar(service, e)}
                            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-obsidian-800 dark:hover:bg-obsidian-750 text-slate-800 dark:text-slate-200 rounded-full text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2"
                          >
                            {calendarSaved === service.id ? (
                              <>
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                <span>Added to Calendar</span>
                              </>
                            ) : (
                              <>
                                <Calendar className="w-4 h-4 text-royal-500 dark:text-cobalt-400" />
                                <span>Add to Calendar (.ics)</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
