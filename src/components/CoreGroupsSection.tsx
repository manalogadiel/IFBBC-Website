import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Sparkles, Image as ImageIcon, X, ArrowRight, Check } from 'lucide-react';
import { GlassLogoBadge } from './ui/GlassLogoBadge';

interface EventPoster {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  time: string;
  venue: string;
  scripture: string;
  themeColor: string;
  tag: string;
}

interface CoreGroup {
  id: string;
  name: string;
  shortLabel: string;
  demographic: string;
  tagline: string;
  description: string;
  schedule: string;
  targetAges: string;
  coordinator: string;
  logo?: string;
  accentHex?: string;
  posters: EventPoster[];
}

export const CoreGroupsSection: React.FC = () => {
  const [activeGroupId, setActiveGroupId] = useState<string>('adelphoi');
  const [selectedPoster, setSelectedPoster] = useState<EventPoster | null>(null);
  const [registeredPosterId, setRegisteredPosterId] = useState<string | null>(null);

  const coreGroups: CoreGroup[] = [
    {
      id: 'kiddos',
      name: 'Kiddos',
      shortLabel: 'Kids',
      demographic: 'Kids',
      tagline: 'Laying the Bible Foundation in Young Hearts',
      description: 'A vibrant, Christ-centered ministry designed to disciple children through engaging Bible lessons, Scripture memorization, worship songs, and structured life groups.',
      schedule: 'Every Sunday @ 9:00 AM (Life Group) & 10:00 AM (Kids Church)',
      targetAges: 'Toddlers to Grade 6',
      coordinator: 'Kiddos Ministry Team',
      logo: '/logo.jpg',
      accentHex: '#10b981',
      posters: [
        {
          id: 'vbs-2026',
          title: 'VACATION BIBLE SCHOOL',
          subtitle: 'The Champions of Faith: Running the Race with Jesus',
          date: 'Date To Be Announced',
          time: 'Morning Session',
          venue: 'IFBBC Campus',
          scripture: 'Hebrews 12:1-2',
          themeColor: 'from-amber-500/20 to-orange-500/10 text-amber-500',
          tag: 'Annual Major Event',
        },
        {
          id: 'kiddos-praise',
          title: 'KIDDOS WORSHIP & SCRIPTURE BEE',
          subtitle: 'Hiding God’s Word in our Hearts — Psalm 119 Challenge',
          date: 'Last Sunday of the Month',
          time: '9:00 AM – 10:30 AM',
          venue: 'IFBBC Campus',
          scripture: 'Psalm 119:11',
          themeColor: 'from-blue-500/20 to-cyan-500/10 text-blue-500',
          tag: 'Monthly Milestone',
        },
        {
          id: 'kiddos-camp',
          title: 'JUNIOR DISCIPLESHIP DAY CAMP',
          subtitle: 'Young Soldiers of the Cross: Interactive Bible Adventure',
          date: 'Date To Be Announced',
          time: 'Full Day',
          venue: 'Venue To Be Announced',
          scripture: '2 Timothy 3:15',
          themeColor: 'from-emerald-500/20 to-teal-500/10 text-emerald-500',
          tag: 'Day Retreat',
        },
      ],
    },
    {
      id: 'adelphoi',
      name: 'Adelphoi',
      shortLabel: 'Youth',
      demographic: 'Young People',
      tagline: 'Brothers & Sisters Walking Steadfast in Christ',
      description: 'A dynamic fellowship of high school and collegiate youth rooted in biblical worldview, peer accountability, gospel boldness, and servant leadership.',
      schedule: 'Every Saturday @ 4:00 PM & Sunday Life Groups @ 9:00 AM',
      targetAges: 'Ages 13–21 (Junior High, Senior High, College)',
      coordinator: 'Ptr. Edwin Sebastian Lualhati (Youth Pastor)',
      logo: '/adelphoi-logo.jpg',
      accentHex: '#00a2ea',
      posters: [
        {
          id: 'adelphoi-camp',
          title: 'ADELPHOI YOUTH CONGRESS',
          subtitle: 'UNASHAMED: Standing Unwavering in an Age of Compromise',
          date: 'Date To Be Announced',
          time: '3 Days & 2 Nights',
          venue: 'Venue To Be Announced',
          scripture: 'Romans 1:16',
          themeColor: 'from-royal-500/20 to-blue-600/10 text-royal-500',
          tag: 'Annual Youth Camp',
        },
        {
          id: 'adelphoi-nights',
          title: 'ACOUSTIC LITURGY & TESTIMONY NIGHT',
          subtitle: 'Open Mic, Scriptural Reflections & Fellowship',
          date: 'Every 2nd Friday of the Month',
          time: '6:30 PM – 8:30 PM',
          venue: 'IFBBC Campus',
          scripture: '1 Timothy 4:12',
          themeColor: 'from-purple-500/20 to-indigo-500/10 text-purple-400',
          tag: 'Monthly Fellowship',
        },
        {
          id: 'adelphoi-missions',
          title: 'YOUTH CAMPUS OUTREACH',
          subtitle: 'Serving local schools and communities in Bauan',
          date: 'Date To Be Announced',
          time: 'Morning to Afternoon',
          venue: 'Venue To Be Announced',
          scripture: 'Matthew 28:19-20',
          themeColor: 'from-rose-500/20 to-red-500/10 text-rose-500',
          tag: 'Community Mission',
        },
      ],
    },
    {
      id: 'caya',
      name: 'CAYA',
      shortLabel: 'Young Adults',
      demographic: 'Young Professionals',
      tagline: 'Christian Adults in Youthful Action',
      description: 'Equipping marketplace ambassadors, corporate leaders, and young entrepreneurs to live out biblical integrity, financial stewardship, and gospel intentionality in the workplace.',
      schedule: 'Bi-Weekly Friday Dinners @ 7:00 PM & Sunday 9:00 AM Life Group',
      targetAges: 'Ages 22–35 (Single Professionals & Career Starters)',
      coordinator: 'CAYA Ministry Team',
      logo: '/logo.jpg',
      accentHex: '#3b82f6',
      posters: [
        {
          id: 'caya-summit',
          title: 'CAYA WORKPLACE & FAITH SUMMIT',
          subtitle: 'Vocation as Calling: Excellence, Ethics & the Kingdom',
          date: 'Date To Be Announced',
          time: 'Full Day',
          venue: 'IFBBC Campus',
          scripture: 'Colossians 3:23-24',
          themeColor: 'from-cyan-500/20 to-blue-500/10 text-cyan-500',
          tag: 'Annual Conference',
        },
        {
          id: 'caya-table',
          title: 'THE FRIDAY ROUNDTABLE: ETHICS & APOLOGETICS',
          subtitle: 'Navigating Culture, Career Ambition & Christian Dating',
          date: 'First & Third Fridays',
          time: '7:00 PM – 9:00 PM',
          venue: 'IFBBC Fellowship Hall',
          scripture: '1 Peter 3:15',
          themeColor: 'from-emerald-500/20 to-teal-500/10 text-emerald-400',
          tag: 'Bi-Weekly Forum',
        },
        {
          id: 'caya-retreat',
          title: 'CAYA LEADERSHIP WEEKEND RETREAT',
          subtitle: 'Rest, Spiritual Renewal & Long-term Vision Alignment',
          date: 'Date To Be Announced',
          time: 'Weekend Getaway',
          venue: 'Venue To Be Announced',
          scripture: 'Proverbs 3:5-6',
          themeColor: 'from-amber-500/20 to-yellow-500/10 text-amber-400',
          tag: 'Rest & Retreat',
        },
      ],
    },
    {
      id: 'amen',
      name: 'A-Men',
      shortLabel: 'Men',
      demographic: 'Men',
      tagline: 'Able Men: Spiritual Heads of Homes & Community',
      description: 'Strengthening adult men through mutual accountability, biblical manhood, leadership development, marriage encouragement, and active church service.',
      schedule: 'Monthly Saturday Breakfast @ 7:00 AM & Weekly Band of Brothers',
      targetAges: 'Men (30+ / Married & Family Heads)',
      coordinator: 'A-Men Ministry Leaders',
      logo: '/logo.jpg',
      accentHex: '#64748b',
      posters: [
        {
          id: 'amen-breakfast',
          title: 'A-MEN ANNUAL MEN’S CONVOCATION',
          subtitle: 'Courageous Faith: Protecting, Providing & Pastoring the Home',
          date: 'Date To Be Announced',
          time: 'Morning to Afternoon',
          venue: 'IFBBC Worship Hall',
          scripture: '1 Corinthians 16:13',
          themeColor: 'from-slate-700/30 to-slate-800/20 text-slate-300',
          tag: 'Annual Convocation',
        },
        {
          id: 'amen-prayer',
          title: 'BAND OF BROTHERS: DAWN PRAYER & EXPOSITION',
          subtitle: 'Fervent Intercession for Families, Church & Missions',
          date: 'Every 1st Saturday of the Month',
          time: '6:30 AM – 8:00 AM',
          venue: 'IFBBC Campus',
          scripture: '1 Timothy 2:8',
          themeColor: 'from-blue-600/20 to-slate-700/10 text-royal-400',
          tag: 'Monthly Prayer',
        },
        {
          id: 'amen-service',
          title: 'COMMUNITY HOME REPAIR & MERCY MISSION',
          subtitle: 'Practical service projects for the community',
          date: 'Quarterly Saturday Project',
          time: '7:00 AM – 1:00 PM',
          venue: 'Bauan Community Area',
          scripture: 'Galatians 6:10',
          themeColor: 'from-amber-600/20 to-orange-600/10 text-amber-500',
          tag: 'Mercy Action',
        },
      ],
    },
    {
      id: 'womisso',
      name: 'Womisso',
      shortLabel: 'Women',
      demographic: 'Women',
      tagline: 'Women in Mission & Service for our Sovereign God',
      description: 'Nurturing godly womanhood, Titus 2 mentoring, fervent prayer, hospitality, and compassionate outreach across all families of the church.',
      schedule: 'Every 2nd Saturday Fellowship @ 2:00 PM & Weekly Prayer Circle',
      targetAges: 'Women (30+ / Married, Mothers & Senior Saints)',
      coordinator: 'Womisso Ministry Leaders',
      logo: '/logo.jpg',
      accentHex: '#ec4899',
      posters: [
        {
          id: 'womisso-conference',
          title: 'WOMISSO ANNUAL WOMEN’S CONFERENCE',
          subtitle: 'Clothed with Strength & Dignity: Joy in Holy Living',
          date: 'Date To Be Announced',
          time: 'Full Day',
          venue: 'IFBBC Campus',
          scripture: 'Proverbs 31:25-30',
          themeColor: 'from-rose-500/20 to-pink-500/10 text-rose-400',
          tag: 'Annual Conference',
        },
        {
          id: 'womisso-titus2',
          title: 'TITUS 2 MENTORSHIP & COTTAGE TEA',
          subtitle: 'Older Women Teaching the Younger in Grace and Wisdom',
          date: 'Every 3rd Saturday',
          time: '2:30 PM – 4:30 PM',
          venue: 'IFBBC Campus',
          scripture: 'Titus 2:3-5',
          themeColor: 'from-purple-500/20 to-pink-500/10 text-purple-400',
          tag: 'Mentorship Tea',
        },
        {
          id: 'womisso-care',
          title: 'MOTHER’S BASKET OF MERCY PROJECT',
          subtitle: 'Assembling food and care packages for mothers in need',
          date: 'Monthly Community Initiative',
          time: '1:00 PM – 4:00 PM',
          venue: 'IFBBC Campus',
          scripture: 'Acts 9:36',
          themeColor: 'from-emerald-500/20 to-teal-500/10 text-emerald-400',
          tag: 'Mercy Ministry',
        },
      ],
    },
  ];

  const activeGroup = coreGroups.find((g) => g.id === activeGroupId) || coreGroups[0];

  return (
    <section id="core-groups" className="pt-12 pb-16 md:pt-16 md:pb-24 scroll-mt-24 relative overflow-hidden bg-slate-100/50 dark:bg-obsidian-900/40">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-10 md:mb-16 gap-4 sm:gap-6 md:gap-8 pb-6 sm:pb-8 md:pb-12 border-b border-slate-200/80 dark:border-white/5">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-royal-500 dark:text-cobalt-400 font-bold block mb-2">
              GET INVOLVED
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white uppercase text-balance">
              Core Groups & Poster Gallery
            </h2>
          </div>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-md leading-[1.68] text-pretty">
            At IFBBC, every stage of life is intentionally pastored through five targeted core groups, fostering deep community, biblical maturity, and active gospel service.
          </p>
        </div>

        {/* 5 Core Group Selector Tabs */}
        <div className="flex flex-wrap items-center gap-3 mb-12">
          {coreGroups.map((group) => {
            const isActive = group.id === activeGroupId;
            return (
              <button
                key={group.id}
                onClick={() => setActiveGroupId(group.id)}
                className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-extrabold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 ${isActive
                  ? 'bg-royal-500 dark:bg-cobalt-500 text-white shadow-md scale-105'
                  : 'bg-white dark:bg-obsidian-850 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-obsidian-800'
                  }`}
              >
                <span>{group.name}</span>
                <span className={`text-[10px] font-mono font-normal opacity-80 ${isActive ? 'text-white' : 'text-slate-400'}`}>
                  | {group.shortLabel}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Group Showcase Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeGroup.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-12"
          >
            {/* Primary Overview Container with Interactive 3D Glass Logo Badge */}
            <div className="ambient-card rounded-3xl p-8 sm:p-12 relative overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Left Column: Group Demographics & Mission Statement */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-royal-500/10 dark:bg-cobalt-500/20 text-royal-600 dark:text-cobalt-400 font-mono text-xs font-bold uppercase tracking-wider">
                    <Users className="w-3.5 h-3.5" />
                    <span>{activeGroup.demographic}</span>
                  </div>

                  <h3 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
                    {activeGroup.name}
                  </h3>

                  <p className="text-base sm:text-lg font-bold text-royal-500 dark:text-cobalt-400">
                    "{activeGroup.tagline}"
                  </p>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-[1.68] max-w-xl text-pretty">
                    {activeGroup.description}
                  </p>
                </div>

                {/* Center Column: Gathering Details & Pastoral Oversight Box */}
                <div className="lg:col-span-4 bg-slate-50 dark:bg-obsidian-850 p-6 rounded-2xl space-y-4 text-xs">
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1">
                      Regular Gathering
                    </span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">
                      {activeGroup.schedule}
                    </span>
                  </div>

                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1">
                      Eligibility & Ages
                    </span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">
                      {activeGroup.targetAges}
                    </span>
                  </div>

                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1">
                      Pastoral Oversight
                    </span>
                    <span className="font-bold text-royal-500 dark:text-cobalt-400 block">
                      {activeGroup.coordinator}
                    </span>
                  </div>
                </div>

                {/* Right Column: Interactive 3D Glass Logo Badge */}
                <div className="lg:col-span-3 flex flex-col items-center justify-center pt-4 lg:pt-0">
                  <GlassLogoBadge
                    logoSrc={activeGroup.logo || '/adelphoi-logo-transparent.png'}
                    altText={`${activeGroup.name} Emblem`}
                    groupName={activeGroup.name}
                    accentColor={activeGroup.accentHex || '#00a2ea'}
                  />
                </div>
              </div>
            </div>

            {/* Event Poster Gallery */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h4 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {activeGroup.name} Event Poster Gallery
                  </h4>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Upcoming official campaigns, conferences, and fellowship events for this group
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs font-mono text-slate-400">
                  <ImageIcon className="w-3.5 h-3.5 text-royal-500 dark:text-cobalt-400" />
                  <span>Click poster to inspect details</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {activeGroup.posters.map((poster) => (
                  <motion.div
                    key={poster.id}
                    whileHover={{ y: -6 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => setSelectedPoster(poster)}
                    className="ambient-card rounded-3xl p-8 space-y-5 cursor-pointer group relative overflow-hidden"
                  >
                    {/* Decorative Top Accent */}
                    <div className={`p-4 rounded-2xl bg-gradient-to-br ${poster.themeColor} space-y-2`}>
                      <span className="text-[10px] font-mono uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-white/40 dark:bg-black/40">
                        {poster.tag}
                      </span>
                      <span className="font-mono text-xs block font-bold text-slate-900 dark:text-white">
                        {poster.date}
                      </span>
                    </div>

                    <div>
                      <h5 className="text-lg font-black text-slate-900 dark:text-white tracking-tight uppercase group-hover:text-royal-500 dark:group-hover:text-cobalt-400 transition-colors">
                        {poster.title}
                      </h5>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-[1.68] text-pretty">
                        {poster.subtitle}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400">
                      <span>{poster.scripture}</span>
                      <span className="text-royal-500 dark:text-cobalt-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        View Poster <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Poster Lightbox Modal */}
      <AnimatePresence>
        {selectedPoster && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPoster(null)}
              className="fixed inset-0 bg-slate-950/70 dark:bg-black/85 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl ambient-card rounded-3xl p-8 sm:p-12 z-10 my-8 overflow-hidden"
            >
              <div className="flex items-center justify-between pb-6 mb-8 border-b border-slate-100 dark:border-white/5">
                <div>
                  <span className="font-mono text-xs uppercase tracking-widest text-royal-500 dark:text-cobalt-400 font-bold block">
                    Official Event Poster // {activeGroup.name}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1 uppercase">
                    {selectedPoster.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedPoster(null)}
                  className="w-9 h-9 rounded-full bg-slate-100 dark:bg-obsidian-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Poster Visual Representation */}
              <div className="p-8 bg-slate-900 text-white rounded-2xl mb-8 space-y-6 relative overflow-hidden">
                <div className="flex items-center justify-between font-mono text-xs text-royal-400">
                  <span>INICBULAN FUNDAMENTAL BAPTIST BIBLE CHURCH</span>
                  <span>{selectedPoster.tag}</span>
                </div>

                <div className="space-y-2 py-4">
                  <h4 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase">
                    {selectedPoster.title}
                  </h4>
                  <p className="text-sm text-slate-300 font-medium">
                    {selectedPoster.subtitle}
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800 font-mono text-xs">
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase tracking-wider">Date & Time</span>
                    <span className="font-bold text-white">{selectedPoster.date}</span>
                    <span className="block text-slate-400 text-[10px]">{selectedPoster.time}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase tracking-wider">Venue</span>
                    <span className="font-bold text-white">{selectedPoster.venue}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase tracking-wider">Theme Scripture</span>
                    <span className="font-bold text-royal-400">{selectedPoster.scripture}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  Hosted by IFBBC {activeGroup.name} Ministry
                </span>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => setRegisteredPosterId(selectedPoster.id)}
                    className="flex-1 sm:flex-none px-6 py-3 bg-royal-500 hover:bg-royal-600 dark:bg-cobalt-500 dark:hover:bg-cobalt-400 text-white text-xs font-bold rounded-full uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                  >
                    {registeredPosterId === selectedPoster.id ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Registered Successfully</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>RSVP / Register Attendance</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
