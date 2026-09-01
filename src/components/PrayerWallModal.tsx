import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Heart,
  Shield,
  Clock,
  Sparkles,
  Send,
  Eye,
  EyeOff,
  Plus,
  Filter,
  CheckCircle2,
  Users,
  Search,
  MessageCircle
} from 'lucide-react';
import { MagneticButton } from './ui/MagneticButton';

export interface PrayerItem {
  id: string;
  category: 'spiritual' | 'healing' | 'family' | 'missions' | 'thanksgiving' | 'general';
  categoryLabel: string;
  request: string;
  author: string;
  isAnonymous: boolean;
  duration: '7d' | '30d' | '365d';
  durationLabel: string;
  createdAt: number;
  expiresAt: number;
  prayedCount: number;
  hasUserPrayed?: boolean;
}

const DEFAULT_PRAYERS: PrayerItem[] = [
  {
    id: 'p-1',
    category: 'missions',
    categoryLabel: 'Missions & Outreach',
    request: 'Pray for our Saturday 2:00 PM mission field Bible study in Sitio Libis and the outreach teams sharing the Gospel across Batangas.',
    author: 'Pastor Hinahon Pallones',
    isAnonymous: false,
    duration: '365d',
    durationLabel: '1 Year',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
    expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 362,
    prayedCount: 38,
  },
  {
    id: 'p-2',
    category: 'healing',
    categoryLabel: 'Healing & Health',
    request: 'Pray for complete healing and physical strength for Deacon Santos recovering from medical treatment this week. Pray for peace for his family.',
    author: 'Sister Elena M.',
    isAnonymous: false,
    duration: '7d',
    durationLabel: '1 Week',
    createdAt: Date.now() - 1000 * 60 * 60 * 12,
    expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 6.5,
    prayedCount: 24,
  },
  {
    id: 'p-3',
    category: 'spiritual',
    categoryLabel: 'Spiritual Growth',
    request: 'Seeking earnest prayer for wisdom, spiritual discenment, and boldness in sharing Christ with coworkers at work in Bauan.',
    author: 'Anonymous Believer',
    isAnonymous: true,
    duration: '30d',
    durationLabel: '1 Month',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
    expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 28,
    prayedCount: 19,
  },
  {
    id: 'p-4',
    category: 'family',
    categoryLabel: 'Family & NextGen',
    request: 'Please uphold our Adelphoi youth ministry and students facing upcoming university entrance exams. May their hearts remain steadfast in the Word.',
    author: 'Ptr. Edwin Lualhati',
    isAnonymous: false,
    duration: '30d',
    durationLabel: '1 Month',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5,
    expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 25,
    prayedCount: 42,
  },
  {
    id: 'p-5',
    category: 'thanksgiving',
    categoryLabel: 'Thanksgiving',
    request: 'Praising the Lord for answered prayers in our home, financial provision, and the salvation of our brother this past Sunday service!',
    author: 'Anonymous Believer',
    isAnonymous: true,
    duration: '7d',
    durationLabel: '1 Week',
    createdAt: Date.now() - 1000 * 60 * 60 * 8,
    expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 6.7,
    prayedCount: 31,
  },
];

interface PrayerWallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrayerWallModal: React.FC<PrayerWallModalProps> = ({ isOpen, onClose }) => {
  const [prayers, setPrayers] = useState<PrayerItem[]>(() => {
    const saved = localStorage.getItem('ifbbc-prayer-wall-v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_PRAYERS;
      }
    }
    return DEFAULT_PRAYERS;
  });

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAddForm, setShowAddForm] = useState<boolean>(false);

  // Form State
  const [formCategory, setFormCategory] = useState<'spiritual' | 'healing' | 'family' | 'missions' | 'thanksgiving' | 'general'>('spiritual');
  const [formRequest, setFormRequest] = useState<string>('');
  const [formName, setFormName] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [formDuration, setFormDuration] = useState<'7d' | '30d' | '365d'>('30d');
  const [submittedToast, setSubmittedToast] = useState<boolean>(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('ifbbc-prayer-wall-v1', JSON.stringify(prayers));
  }, [prayers]);

  if (!isOpen) return null;

  const handlePrayClick = (id: string) => {
    setPrayers((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const alreadyPrayed = item.hasUserPrayed;
          return {
            ...item,
            prayedCount: alreadyPrayed ? item.prayedCount - 1 : item.prayedCount + 1,
            hasUserPrayed: !alreadyPrayed,
          };
        }
        return item;
      })
    );
  };

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRequest.trim()) return;

    const now = Date.now();
    const durationDays = formDuration === '7d' ? 7 : formDuration === '30d' ? 30 : 365;
    const durationLabel = formDuration === '7d' ? '1 Week' : formDuration === '30d' ? '1 Month' : '1 Year';

    const categoryLabels: Record<string, string> = {
      spiritual: 'Spiritual Growth',
      healing: 'Healing & Health',
      family: 'Family & NextGen',
      missions: 'Missions & Outreach',
      thanksgiving: 'Thanksgiving',
      general: 'General Petition',
    };

    const newPrayer: PrayerItem = {
      id: `p-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      category: formCategory,
      categoryLabel: categoryLabels[formCategory],
      request: formRequest.trim(),
      author: isAnonymous ? 'Anonymous Believer' : formName.trim() || 'Church Member',
      isAnonymous,
      duration: formDuration,
      durationLabel,
      createdAt: now,
      expiresAt: now + 1000 * 60 * 60 * 24 * durationDays,
      prayedCount: 1,
      hasUserPrayed: true,
    };

    setPrayers([newPrayer, ...prayers]);
    setFormRequest('');
    setFormName('');
    setIsAnonymous(false);
    setShowAddForm(false);
    setSubmittedToast(true);
    setTimeout(() => setSubmittedToast(false), 4000);
  };

  const getRemainingTimeText = (expiresAt: number) => {
    const diff = expiresAt - Date.now();
    if (diff <= 0) return 'Expired';
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days === 1) return '1 day left';
    if (days < 30) return `${days} days left`;
    const months = Math.floor(days / 30);
    if (months === 1) return '1 month left';
    if (months < 12) return `${months} months left`;
    return '1 year left';
  };

  const filteredPrayers = prayers.filter((p) => {
    const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
    const matchesSearch =
      p.request.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalPrayedCount = prayers.reduce((acc, curr) => acc + curr.prayedCount, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/75 dark:bg-black/90 backdrop-blur-md"
      />

      {/* Main Modal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-white dark:bg-obsidian-900 rounded-3xl shadow-2xl z-10 my-auto border border-slate-200/80 dark:border-white/10 overflow-hidden"
      >
        {/* Header Section */}
        <div className="p-6 sm:p-8 border-b border-slate-100 dark:border-white/5 shrink-0 bg-slate-50/50 dark:bg-obsidian-950/50">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-royal-500/10 dark:bg-cobalt-500/20 text-royal-600 dark:text-cobalt-400 font-mono text-[11px] font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  Community Intercession
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 font-mono text-[11px] text-slate-400 dark:text-slate-500">
                  <Users className="w-3.5 h-3.5" />
                  {totalPrayedCount} Intercessions Prayed
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
                IFBBC Prayer Wall
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl text-pretty">
                "Bear ye one another's burdens, and so fulfil the law of Christ." — <span className="font-serif italic">Galatians 6:2</span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowAddForm(!showAddForm)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  showAddForm
                    ? 'bg-slate-200 dark:bg-obsidian-800 text-slate-800 dark:text-slate-200'
                    : 'bg-royal-500 hover:bg-royal-600 dark:bg-cobalt-500 dark:hover:bg-cobalt-400 text-white shadow-sm'
                }`}
              >
                {showAddForm ? (
                  <>
                    <Filter className="w-3.5 h-3.5" />
                    <span>View Wall</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    <span>Post Prayer</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                className="w-9 h-9 rounded-full bg-slate-100 dark:bg-obsidian-800 hover:bg-slate-200 dark:hover:bg-obsidian-750 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Submission Success Banner */}
          <AnimatePresence>
            {submittedToast && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 rounded-2xl text-xs flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Your prayer request has been posted to the wall. Our church family will intercede with you.</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Modal Body Scroll Area */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          {/* Add Prayer Form Mode */}
          <AnimatePresence mode="wait">
            {showAddForm ? (
              <motion.form
                key="form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleSubmitRequest}
                className="space-y-6 max-w-2xl mx-auto"
              >
                <div className="border-b border-slate-100 dark:border-white/5 pb-4">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Submit a Prayer Request
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Share your petition or thanksgiving with the IFBBC congregation.
                  </p>
                </div>

                {/* Category Selection */}
                <div className="space-y-2">
                  <label className="block font-mono text-xs uppercase tracking-wider font-bold text-slate-700 dark:text-slate-300">
                    Prayer Focus Category
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {[
                      { id: 'spiritual', label: 'Spiritual Growth' },
                      { id: 'healing', label: 'Healing & Health' },
                      { id: 'family', label: 'Family & NextGen' },
                      { id: 'missions', label: 'Missions & Outreach' },
                      { id: 'thanksgiving', label: 'Thanksgiving' },
                      { id: 'general', label: 'General Petition' },
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setFormCategory(cat.id as any)}
                        className={`p-3 rounded-2xl text-xs font-bold transition-all text-left flex items-center justify-between cursor-pointer ${
                          formCategory === cat.id
                            ? 'bg-royal-500/10 dark:bg-cobalt-500/20 text-royal-600 dark:text-cobalt-400 ring-2 ring-royal-500 dark:ring-cobalt-400'
                            : 'bg-slate-50 dark:bg-obsidian-850 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-obsidian-800'
                        }`}
                      >
                        <span>{cat.label}</span>
                        {formCategory === cat.id && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Prayer Request Textarea */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-mono text-xs uppercase tracking-wider font-bold text-slate-700 dark:text-slate-300">
                      Prayer Request / Praise Item *
                    </label>
                    <span className="font-mono text-[10px] text-slate-400">
                      {formRequest.length}/500
                    </span>
                  </div>
                  <textarea
                    required
                    maxLength={500}
                    rows={4}
                    value={formRequest}
                    onChange={(e) => setFormRequest(e.target.value)}
                    placeholder="Describe what you would like the church family to lift up in prayer..."
                    className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-obsidian-850 border border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-royal-500 dark:focus:ring-cobalt-400 resize-none transition-all"
                  />
                </div>

                {/* Visibility & Name Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {/* Anonymous Switcher */}
                  <div className="space-y-2">
                    <label className="font-mono text-xs uppercase tracking-wider font-bold text-slate-700 dark:text-slate-300 block">
                      Identity Visibility
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setIsAnonymous(false)}
                        className={`p-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                          !isAnonymous
                            ? 'bg-royal-500/10 dark:bg-cobalt-500/20 text-royal-600 dark:text-cobalt-400 ring-2 ring-royal-500'
                            : 'bg-slate-50 dark:bg-obsidian-850 text-slate-500'
                        }`}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>With Name</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsAnonymous(true)}
                        className={`p-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                          isAnonymous
                            ? 'bg-royal-500/10 dark:bg-cobalt-500/20 text-royal-600 dark:text-cobalt-400 ring-2 ring-royal-500'
                            : 'bg-slate-50 dark:bg-obsidian-850 text-slate-500'
                        }`}
                      >
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Anonymous</span>
                      </button>
                    </div>
                  </div>

                  {/* Name Input (if not anonymous) */}
                  <div className="space-y-2">
                    <label className="font-mono text-xs uppercase tracking-wider font-bold text-slate-700 dark:text-slate-300 block">
                      {isAnonymous ? 'Display Mode' : 'Your Name / Family'}
                    </label>
                    {isAnonymous ? (
                      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-obsidian-850 border border-dashed border-slate-200 dark:border-white/10 text-xs text-slate-500 flex items-center gap-2">
                        <Shield className="w-4 h-4 text-royal-500 dark:text-cobalt-400" />
                        <span>Displaying as "Anonymous Believer"</span>
                      </div>
                    ) : (
                      <input
                        type="text"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="e.g., Sister Maria / Dela Cruz Family"
                        className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-obsidian-850 border border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-royal-500 transition-all"
                      />
                    )}
                  </div>
                </div>

                {/* Duration on Wall Selection */}
                <div className="space-y-2 pt-2">
                  <label className="font-mono text-xs uppercase tracking-wider font-bold text-slate-700 dark:text-slate-300 block">
                    Duration to Stay on Prayer Wall
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: '7d', label: '1 Week', desc: 'Urgent / Short-term' },
                      { id: '30d', label: '1 Month', desc: 'Monthly Petitions' },
                      { id: '365d', label: '1 Year', desc: 'Ongoing / Missions' },
                    ].map((dur) => (
                      <button
                        key={dur.id}
                        type="button"
                        onClick={() => setFormDuration(dur.id as any)}
                        className={`p-3.5 rounded-2xl text-left transition-all cursor-pointer ${
                          formDuration === dur.id
                            ? 'bg-royal-500/10 dark:bg-cobalt-500/20 ring-2 ring-royal-500 dark:ring-cobalt-400 text-royal-600 dark:text-cobalt-400'
                            : 'bg-slate-50 dark:bg-obsidian-850 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-obsidian-800'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono font-bold text-xs sm:text-sm">{dur.label}</span>
                          <Clock className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-[10px] text-slate-400 block font-normal">{dur.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-white/5">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-5 py-3 rounded-2xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-obsidian-800 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <MagneticButton
                    variant="primary"
                    size="md"
                    type="submit"
                  >
                    <span>Post Prayer Request</span>
                    <Send className="w-3.5 h-3.5 ml-1" />
                  </MagneticButton>
                </div>
              </motion.form>
            ) : (
              /* Prayer Items List Mode */
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Search & Filter Bar */}
                <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                  {/* Search Input */}
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search petitions, praises, or names..."
                      className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-obsidian-850 border border-slate-200/80 dark:border-white/5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-royal-500 transition-all"
                    />
                  </div>

                  {/* Add Prayer Button Shortcut */}
                  <button
                    type="button"
                    onClick={() => setShowAddForm(true)}
                    className="px-4 py-2.5 rounded-2xl bg-royal-500 hover:bg-royal-600 dark:bg-cobalt-500 dark:hover:bg-cobalt-400 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer whitespace-nowrap"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Prayer Request</span>
                  </button>
                </div>

                {/* Category Filter Pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
                  {[
                    { id: 'all', label: 'All Prayers' },
                    { id: 'spiritual', label: 'Spiritual Growth' },
                    { id: 'healing', label: 'Healing & Health' },
                    { id: 'family', label: 'Family & NextGen' },
                    { id: 'missions', label: 'Missions' },
                    { id: 'thanksgiving', label: 'Thanksgiving' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-full font-mono text-[11px] font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                        activeCategory === cat.id
                          ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                          : 'bg-slate-100 dark:bg-obsidian-850 text-slate-600 dark:text-slate-400 hover:bg-slate-200/70 dark:hover:bg-obsidian-800'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Prayer Cards Grid */}
                {filteredPrayers.length === 0 ? (
                  <div className="py-12 text-center space-y-3 bg-slate-50/50 dark:bg-obsidian-850/50 rounded-3xl border border-dashed border-slate-200 dark:border-white/5">
                    <MessageCircle className="w-8 h-8 text-slate-400 mx-auto opacity-60" />
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                      No prayer requests found in this category.
                    </p>
                    <button
                      onClick={() => setShowAddForm(true)}
                      className="text-xs text-royal-500 dark:text-cobalt-400 font-bold hover:underline"
                    >
                      Be the first to post a prayer petition →
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredPrayers.map((prayer) => {
                      const remainingTime = getRemainingTimeText(prayer.expiresAt);
                      const isUserPrayed = prayer.hasUserPrayed;

                      return (
                        <motion.div
                          key={prayer.id}
                          layout
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.2 }}
                          className="ambient-card rounded-3xl p-5 sm:p-6 flex flex-col justify-between space-y-4 border border-slate-100 dark:border-white/5 hover:border-royal-500/20 transition-all group"
                        >
                          {/* Card Header: Category + Expiry */}
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-mono text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full bg-royal-500/10 dark:bg-cobalt-500/20 text-royal-600 dark:text-cobalt-400">
                              {prayer.categoryLabel}
                            </span>

                            <div className="flex items-center gap-1 font-mono text-[10px] text-slate-400 dark:text-slate-500" title={`Duration: ${prayer.durationLabel}`}>
                              <Clock className="w-3 h-3" />
                              <span>{remainingTime}</span>
                            </div>
                          </div>

                          {/* Request Text */}
                          <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium leading-relaxed text-pretty">
                            "{prayer.request}"
                          </p>

                          {/* Card Footer: Author & Pray Action */}
                          <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-obsidian-800 flex items-center justify-center text-slate-600 dark:text-slate-400">
                                {prayer.isAnonymous ? (
                                  <Shield className="w-3.5 h-3.5 text-slate-400" />
                                ) : (
                                  <span className="font-mono text-[10px] font-bold">
                                    {prayer.author.charAt(0)}
                                  </span>
                                )}
                              </div>
                              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate max-w-[130px] sm:max-w-[160px]">
                                {prayer.author}
                              </span>
                            </div>

                            {/* "I Prayed" Interactive Intercession Button */}
                            <button
                              type="button"
                              onClick={() => handlePrayClick(prayer.id)}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                                isUserPrayed
                                  ? 'bg-rose-500 text-white shadow-sm scale-105'
                                  : 'bg-slate-100 dark:bg-obsidian-850 text-slate-600 dark:text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/20 dark:hover:text-rose-400'
                              }`}
                              title={isUserPrayed ? 'You prayed for this' : 'Click to pray with this request'}
                            >
                              <Heart
                                className={`w-3.5 h-3.5 transition-transform ${
                                  isUserPrayed ? 'fill-current scale-110' : ''
                                }`}
                              />
                              <span className="font-mono">{prayer.prayedCount}</span>
                              <span className="hidden sm:inline text-[10px] uppercase font-mono">
                                {isUserPrayed ? 'Prayed' : 'Pray'}
                              </span>
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}

                {/* Bottom Quick Post Banner */}
                <div className="p-4 sm:p-5 rounded-3xl bg-slate-50/80 dark:bg-obsidian-850/80 border border-slate-100 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1 text-center sm:text-left">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-royal-500 dark:text-cobalt-400 font-bold block">
                      Need prayer this week?
                    </span>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Submit your petition anonymously or with your name. Choose 1 week, 1 month, or 1 year.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="px-4 py-2.5 rounded-2xl bg-royal-500 hover:bg-royal-600 dark:bg-cobalt-500 text-white text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap shadow-sm cursor-pointer"
                  >
                    Submit Request
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
