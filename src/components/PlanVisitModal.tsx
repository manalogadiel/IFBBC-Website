import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Users, QrCode, Sparkles, ArrowRight } from 'lucide-react';
import { MagneticButton } from './ui/MagneticButton';

interface PlanVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialServiceTime?: string;
}

export const PlanVisitModal: React.FC<PlanVisitModalProps> = ({
  isOpen,
  onClose,
  initialServiceTime = '10:00 AM',
}) => {
  const [step, setStep] = useState<number>(1);
  const [selectedService, setSelectedService] = useState<string>(initialServiceTime);
  const [attendeeCount, setAttendeeCount] = useState<number>(1);
  const [hasKids, setHasKids] = useState<boolean>(false);
  const [kidsAges, setKidsAges] = useState<string>('');
  const [guestName, setGuestName] = useState<string>('');
  const [guestEmail, setGuestEmail] = useState<string>('');
  const [passGenerated, setPassGenerated] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleGeneratePass = (e: React.FormEvent) => {
    e.preventDefault();
    setPassGenerated(true);
    setStep(3);
  };

  const resetAndClose = () => {
    setStep(1);
    setPassGenerated(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={resetAndClose}
        className="fixed inset-0 bg-slate-950/70 dark:bg-black/85 backdrop-blur-md"
      />

      {/* Modal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto ambient-card rounded-3xl p-6 sm:p-10 z-10 my-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-slate-100 dark:border-white/5">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-royal-500 dark:text-cobalt-400 font-bold block">
              Step 0{step} of 03 // Sunday VIP Guest Pass
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1 uppercase">
              Plan Your Sunday Visit
            </h3>
          </div>
          <button
            onClick={resetAndClose}
            className="w-9 h-9 rounded-full bg-slate-100 dark:bg-obsidian-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step 1: Gathering Selection */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div>
              <label className="block font-mono text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 font-bold">
                Select Sunday Gathering
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { time: '9:00 AM', name: 'Life Group', spec: 'Age-graded discipleship & fellowship' },
                  { time: '10:00 AM', name: 'Worship Service', spec: 'Expository preaching & praise' },
                ].map((s) => (
                  <button
                    key={s.time}
                    type="button"
                    onClick={() => setSelectedService(s.time)}
                    className={`p-6 rounded-2xl text-left transition-all duration-300 border ${
                      selectedService === s.time
                        ? 'bg-royal-500/10 dark:bg-cobalt-500/20 border-royal-500 dark:border-cobalt-400 ring-2 ring-royal-500/40 dark:ring-cobalt-400 shadow-sm'
                        : 'bg-slate-50/80 dark:bg-obsidian-850 border-slate-200/80 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-obsidian-800'
                    }`}
                  >
                    <span className="font-mono text-xl font-extrabold text-royal-500 dark:text-cobalt-400 block">
                      {s.time}
                    </span>
                    <span className="font-extrabold text-sm text-slate-900 dark:text-white block mt-1">
                      {s.name}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block mt-1.5 leading-[1.68]">
                      {s.spec}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-mono text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 font-bold">
                Number of Attendees in Your Family / Group
              </label>
              <div className="flex items-center gap-3">
                {[1, 2, 3, 4, 5, '6+'].map((count, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAttendeeCount(typeof count === 'number' ? count : 6)}
                    className={`w-11 h-11 rounded-xl font-mono text-sm font-bold transition-all border ${
                      attendeeCount === (typeof count === 'number' ? count : 6)
                        ? 'bg-royal-500 dark:bg-cobalt-500 border-royal-500 dark:border-cobalt-400 text-white shadow-sm scale-105'
                        : 'bg-slate-50 dark:bg-obsidian-850 border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-obsidian-800'
                    }`}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-white/5 flex justify-end">
              <MagneticButton
                variant="primary"
                onClick={() => setStep(2)}
              >
                <span>Continue to Guest Details</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </MagneticButton>
            </div>
          </motion.div>
        )}

        {/* Step 2: Guest Details & Kids Info */}
        {step === 2 && (
          <motion.form
            onSubmit={handleGeneratePass}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 font-bold">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maria Santos"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-obsidian-850 border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-royal-500/40"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 font-bold">
                  Email or Mobile Number
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 0917-xxx-xxxx or email@example.com"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-obsidian-850 border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-royal-500/40"
                />
              </div>
            </div>

            <div className="p-6 bg-slate-50 dark:bg-obsidian-850 border border-slate-200/80 dark:border-white/10 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-royal-500 dark:text-cobalt-400" />
                  <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                    Are you bringing children (Kiddos Ministry 0–12 yrs)?
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={hasKids}
                  onChange={(e) => setHasKids(e.target.checked)}
                  className="w-5 h-5 text-royal-500 rounded border-slate-300 focus:ring-royal-500 cursor-pointer"
                />
              </div>

              {hasKids && (
                <div className="pt-3 border-t border-slate-200/60 dark:border-white/5">
                  <label className="block text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 font-bold">
                    Children's Ages (For Kiddos Sunday Class Placement)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 4, 7, 10"
                    value={kidsAges}
                    onChange={(e) => setKidsAges(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white dark:bg-obsidian-800 border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-royal-500/40"
                  />
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs font-mono uppercase tracking-wider text-slate-500 hover:text-slate-900 dark:hover:text-white font-bold"
              >
                Back
              </button>

              <MagneticButton
                type="submit"
                variant="primary"
              >
                <span>Generate Sunday Guest Pass</span>
                <Sparkles className="w-4 h-4 ml-1" />
              </MagneticButton>
            </div>
          </motion.form>
        )}

        {/* Step 3: Instant Pass & Barcode Voucher */}
        {step === 3 && passGenerated && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            {/* Architectural Pass Card */}
            <div className="p-8 bg-slate-900 text-white rounded-3xl shadow-xl relative overflow-hidden">
              <div className="flex items-start justify-between pb-6 border-b border-slate-800">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-royal-400 font-bold block">
                    INICBULAN FUNDAMENTAL BAPTIST BIBLE CHURCH • GUEST PASS
                  </span>
                  <h4 className="text-2xl font-extrabold tracking-tight text-white mt-1">
                    {guestName || 'Valued Guest'}
                  </h4>
                </div>
                <div className="text-right">
                  <span className="font-mono text-xs text-emerald-400 font-bold block">
                    CONFIRMED
                  </span>
                  <span className="font-mono text-xs text-slate-400">
                    Sunday {selectedService}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 py-6 text-xs font-mono text-slate-300">
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase tracking-wider mb-0.5">Party Size</span>
                  <span className="font-bold text-sm text-white">{attendeeCount} Guests {hasKids && '(+ Kiddos)'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase tracking-wider mb-0.5">Campus Location</span>
                  <span className="font-bold text-sm text-emerald-400">Purok Munlawin, Inicbulan</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase tracking-wider mb-0.5">Assigned Host Greeter</span>
                  <span className="font-bold text-sm text-white">IFBBC Hospitality Team</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase tracking-wider mb-0.5">Fellowship</span>
                  <span className="font-bold text-sm text-white">Welcome Refreshments</span>
                </div>
              </div>

              {/* Simulated QR Code & Barcode */}
              <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <QrCode className="w-9 h-9 text-royal-400" />
                  <span className="font-mono text-xs text-slate-400 tracking-widest">
                    PASS-IFBBC-2026-BATANGAS
                  </span>
                </div>
                <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1.5 rounded-lg font-mono font-bold">
                  Saved to Device
                </span>
              </div>
            </div>

            <div className="text-center space-y-3 pt-2">
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-[1.68]">
                We look forward to welcoming you at Purok Munlawin, Barangay Inicbulan, Bauan, Batangas!
              </p>
              <button
                onClick={resetAndClose}
                className="w-full py-4 bg-royal-500 hover:bg-royal-600 dark:bg-cobalt-500 dark:hover:bg-cobalt-400 text-white font-bold text-xs rounded-full uppercase tracking-wider transition-all shadow-md mt-2"
              >
                Done • See You This Sunday!
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
