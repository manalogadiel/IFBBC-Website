import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassLogoBadge } from './ui/GlassLogoBadge';
import { AnnouncementModal3D } from './ui/AnnouncementModal3D';
import churchLogo from '../assets/logo-hd.png';
import knowTheGospelPoster from '../assets/adelphoi-know-the-gospel.png';

interface EventPoster {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  time: string;
  venue: string;
  scripture: string;
  themeColor: string;
  tag?: string;
  image?: string;
}

interface CoreGroup {
  id: string;
  name: string;
  shortLabel: string;
  demographic: string;
  tagline: string;
  description: string;
  schedule: string | string[];
  targetAges: string;
  coordinator: string;
  logo?: string;
  accentHex?: string;
  posters: EventPoster[];
}

export const CoreGroupsSection: React.FC = () => {
  const [activeGroupId, setActiveGroupId] = useState<string>('adelphoi');
  const [selectedPoster, setSelectedPoster] = useState<EventPoster | null>(null);

  const coreGroups: CoreGroup[] = [
    {
      id: 'kiddos',
      name: 'Kiddos',
      shortLabel: 'Kids',
      demographic: 'Kids',
      tagline: 'Laying the Bible Foundation in Young Hearts',
      description: 'We disciple children through engaging Bible lessons, Games, Scripture memorization, worship songs.',
      schedule: 'Every Sunday - 9:00 AM',
      targetAges: 'Toddlers to Grade 6',
      coordinator: 'Tr. Ericah S. Lualhati',
      logo: '/logo-kiddos.png',
      accentHex: '#0284c7',
      posters: [
        {
          id: 'music-beyond',
          title: 'Music & Beyond',
          subtitle: 'Worship Ministry Seminar',
          date: 'September 13, 2026',
          time: '2:00 PM',
          venue: 'IFBBC',
          scripture: '',
          themeColor: 'from-royal-500/20 to-blue-600/10 text-royal-500',
          tag: 'Seminar',
          image: '/music-beyond.jpg',
        }
      ],
    },
    {
      id: 'adelphoi',
      name: 'Adelphoi',
      shortLabel: 'Youth',
      demographic: 'Young People',
      tagline: 'Brothers & Sisters Walking Steadfast in Christ',
      description: 'We are a group of high school and collegiate youth rooted in biblical worldview, peer accountability, gospel boldness, and servant leadership.',
      schedule: ['Every Saturday - 3:00 PM', 'Sunday - 9:00 AM'],
      targetAges: 'Ages 13–21 (Junior High, Senior High, College)',
      coordinator: 'Ptr. Edwin Sebastian Lualhati',
      logo: '/adelphoi-logo.jpg',
      accentHex: '#00a2ea',
      posters: [
        {
          id: 'sectoral',
          title: 'BACC Sector 2 Fellowship',
          subtitle: 'Know the Gospel',
          date: 'September 20, 2026',
          time: '2:00 PM',
          venue: 'IFBBC',
          scripture: '1 Cor 15:1-4',
          themeColor: 'from-royal-500/20 to-blue-600/10 text-royal-500',
          tag: 'Monthly Fellowship',
          image: knowTheGospelPoster,
        },
        {
          id: 'campus',
          title: 'Campus Plus',
          subtitle: 'Students of Batangas Fellowship',
          date: 'Every Friday',
          time: '5:00 PM',
          venue: 'Community Park, Kumintang, Batangas',
          scripture: 'As per Devotion Leader',
          themeColor: 'from-royal-500/20 to-blue-600/10 text-royal-500',
          tag: 'Weekly Fellowship',
          image: '/campus-plus.png',
        },
        {
          id: 'music-beyond',
          title: 'Music & Beyond',
          subtitle: 'Worship Ministry Seminar',
          date: 'September 13, 2026',
          time: '2:00 PM',
          venue: 'IFBBC',
          scripture: '',
          themeColor: 'from-royal-500/20 to-blue-600/10 text-royal-500',
          tag: 'Seminar',
          image: '/music-beyond.jpg',
        }
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
      coordinator: 'Engr. Atreo Xyrus I. Gamilla',
      logo: '/logo-caya.png',
      accentHex: '#2563eb',
      posters: [
        {
          id: 'music-beyond',
          title: 'Music & Beyond',
          subtitle: 'Worship Ministry Seminar',
          date: 'September 13, 2026',
          time: '2:00 PM',
          venue: 'IFBBC',
          scripture: '',
          themeColor: 'from-royal-500/20 to-blue-600/10 text-royal-500',
          tag: 'Seminar',
          image: '/music-beyond.jpg',
        }
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
      targetAges: 'Men (30+, Married & Family Heads)',
      coordinator: 'Bro. Ivan Lendl I. Gamilla',
      logo: '/logo-amen.png',
      accentHex: '#ea580c',
      posters: [
        {
          id: 'music-beyond',
          title: 'Music & Beyond',
          subtitle: 'Worship Ministry Seminar',
          date: 'September 13, 2026',
          time: '2:00 PM',
          venue: 'IFBBC',
          scripture: '',
          themeColor: 'from-royal-500/20 to-blue-600/10 text-royal-500',
          tag: 'Seminar',
          image: '/music-beyond.jpg',
        }
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
      targetAges: 'Women (30+, Married, Mothers & Seniors)',
      coordinator: 'Sis. Raquel Ilagan',
      logo: '/logo-womisso.png',
      accentHex: '#a855f7',
      posters: [
        {
          id: 'music-beyond',
          title: 'Music & Beyond',
          subtitle: 'Worship Ministry Seminar',
          date: 'September 13, 2026',
          time: '2:00 PM',
          venue: 'IFBBC',
          scripture: '',
          themeColor: 'from-royal-500/20 to-blue-600/10 text-royal-500',
          tag: 'Seminar',
          image: '/music-beyond.jpg',
        }
      ],
    },
  ];

  const activeGroup = coreGroups.find((g) => g.id === activeGroupId) || coreGroups[0];

  return (
    <section id="core-groups" className="pt-6 pb-12 sm:pt-8 sm:pb-16 md:pt-10 md:pb-20 scroll-mt-20 relative overflow-hidden bg-slate-100/50 dark:bg-obsidian-900/40">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-8 md:mb-10 gap-4 sm:gap-6 pb-4 sm:pb-6 border-b border-slate-200/80 dark:border-white/5">
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
        <div className="flex flex-wrap items-center gap-3 mb-8">
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
            <div className="ambient-card rounded-3xl p-6 sm:p-8 lg:p-12 relative overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Column: Group Demographics & Mission Statement */}
                <div className="lg:col-span-5 space-y-3 pt-1">
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
                <div className="lg:col-span-4 space-y-4 text-xs pt-6 lg:pt-6 border-t border-slate-200/80 dark:border-white/10 lg:border-t-0 lg:bg-slate-50/80 lg:dark:bg-white/[0.03] lg:border lg:border-slate-200/80 lg:dark:border-white/10 lg:p-6 lg:rounded-2xl">
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1">
                      Regular Gathering
                    </span>
                    {Array.isArray(activeGroup.schedule) ? (
                      <div className="space-y-1">
                        {activeGroup.schedule.map((item, idx) => (
                          <span key={idx} className="font-bold text-slate-800 dark:text-slate-200 block">
                            {item}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="font-bold text-slate-800 dark:text-slate-200 block">
                        {activeGroup.schedule}
                      </span>
                    )}
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
                      Spiritual Leader
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
              <div className="mb-8">
                <h4 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {activeGroup.name} Event Poster Announcements
                </h4>
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
                    {/* Poster Thumbnail (shown when image is provided) with Date & Time overlay */}
                    {poster.image ? (
                      <div className="relative w-full aspect-[4/5] sm:aspect-[3/4] max-h-72 rounded-2xl overflow-hidden bg-slate-950 border border-slate-200/50 dark:border-white/10 shadow-md">
                        <img
                          src={poster.image}
                          alt={poster.title}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        {/* Gradient overlay for readability */}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/30 pointer-events-none" />

                        {/* Date & Time Text Over the Image */}
                        <div className="absolute top-3.5 left-3.5 sm:top-4 sm:left-4 z-10 space-y-0.5">
                          <span className="font-mono text-xs block font-bold text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]">
                            {poster.date}
                          </span>
                          <span className="font-mono text-[11px] block font-medium text-slate-200 drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
                            {poster.time}
                          </span>
                        </div>
                      </div>
                    ) : (
                      /* Decorative Top Accent for posters without image */
                      <div className={`p-4 rounded-2xl bg-gradient-to-br ${poster.themeColor} space-y-1`}>
                        <span className="font-mono text-xs block font-bold text-slate-900 dark:text-white">
                          {poster.date}
                        </span>
                        <span className="font-mono text-[11px] block font-medium text-slate-600 dark:text-slate-300">
                          {poster.time}
                        </span>
                      </div>
                    )}

                    <div>
                      <h5 className="text-lg font-black text-slate-900 dark:text-white tracking-tight uppercase group-hover:text-royal-500 dark:group-hover:text-cobalt-400 transition-colors">
                        {poster.title}
                      </h5>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-[1.68] text-pretty">
                        {poster.subtitle}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Poster Lightbox Modal with 3D Interactive Tilt */}
      <AnimatePresence>
        {selectedPoster && (
          <div className="fixed inset-0 z-50 flex min-h-full items-center justify-center p-3 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPoster(null)}
              className="fixed inset-0 bg-slate-950/75 dark:bg-black/85 backdrop-blur-md"
            />
            <AnnouncementModal3D
              poster={selectedPoster}
              groupName={activeGroup.name}
              onClose={() => setSelectedPoster(null)}
            />
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
