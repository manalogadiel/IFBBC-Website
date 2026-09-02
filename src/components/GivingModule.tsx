import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Copy, Check, Building2, ShieldCheck, HeartHandshake, X } from 'lucide-react';

interface GivingModuleProps {
  isModal?: boolean;
  onClose?: () => void;
}

export const GivingModule: React.FC<GivingModuleProps> = ({ isModal = false, onClose }) => {
  const [amount, setAmount] = useState<number>(1000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [fund, setFund] = useState<string>('Tithes & General Offering');
  const [copied, setCopied] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const bpiAccount = {
    bank: 'BPI (Bank of the Philippine Islands)',
    names: 'Hinahon B. Pallones / Eloisa Tangguiyac',
    accountNumber: '8959-367214',
  };

  const presetAmounts = [500, 1000, 2500, 5000, 10000];
  const funds = [
    'Tithes & General Offering',
    'Missions & Outreaches (Saturday Missions)',
    'Building & Sanctuary Renewal Fund',
    'Benevolence & Mercy Ministry',
  ];

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(bpiAccount.accountNumber.replace(/-/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSelectPreset = (val: number) => {
    setAmount(val);
    setCustomAmount('');
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomAmount(val);
    if (val && !isNaN(Number(val))) {
      setAmount(Number(val));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
  };

  const content = (
    <div className={`w-full ${isModal ? 'p-6 sm:p-8' : 'ambient-card rounded-3xl p-8 sm:p-12'}`}>
      {/* Header */}
      <div className={`flex items-center justify-between pb-4 mb-6 border-b border-slate-100 dark:border-white/5`}>
        <div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-royal-500 dark:text-cobalt-400 font-bold block mb-1">
            Biblical Stewardship
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
            Online Giving
          </h3>
        </div>
        {isModal && onClose && (
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-obsidian-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Official BPI Bank Transfer Card */}
      <div className="p-4 sm:p-6 bg-slate-900 text-white rounded-2xl mb-6 space-y-3 relative overflow-hidden shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-royal-400" />
            <span className="font-mono text-[11px] font-bold uppercase text-royal-400 tracking-wider">
              Official Bank Account
            </span>
          </div>
          <span className="text-[10px] bg-slate-800 text-emerald-400 px-2 py-0.5 rounded font-mono font-bold">
            Verified BPI Account
          </span>
        </div>

        <div className="space-y-0.5 pt-1">
          <span className="font-mono text-[9px] text-slate-400 uppercase tracking-wider block">
            Bank Name
          </span>
          <h4 className="text-base font-extrabold text-white">
            {bpiAccount.bank}
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 font-mono text-xs">
          <div>
            <span className="text-slate-400 block text-[9px] uppercase tracking-wider">Account Names</span>
            <span className="font-bold text-slate-200 block text-xs">{bpiAccount.names}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[9px] uppercase tracking-wider">Account Number</span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-mono font-black text-base sm:text-lg text-emerald-400 tracking-wider">
                {bpiAccount.accountNumber}
              </span>
              <button
                type="button"
                onClick={handleCopyAccount}
                title="Copy Account Number"
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            {copied && (
              <span className="text-[10px] text-emerald-400 font-sans block mt-0.5">
                ✓ Account number copied to clipboard
              </span>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!success ? (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {/* Fund Designation */}
            <div>
              <label className="block font-mono text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 font-bold">
                Select Giving Designation
              </label>
              <select
                value={fund}
                onChange={(e) => setFund(e.target.value)}
                className="w-full px-3.5 py-2.5 sm:py-3 bg-slate-50 dark:bg-obsidian-850 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-bold focus:outline-none focus:ring-2 focus:ring-royal-500/40"
              >
                {funds.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>

            {/* Amount Presets */}
            <div>
              <label className="block font-mono text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 font-bold">
                Pledge / Donation Amount (PHP)
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-2.5">
                {presetAmounts.map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handleSelectPreset(val)}
                    className={`py-2 sm:py-2.5 rounded-xl font-mono text-xs sm:text-sm font-bold transition-all ${amount === val && !customAmount
                        ? 'bg-royal-500 dark:bg-cobalt-500 text-white shadow-sm scale-105'
                        : 'bg-slate-100/80 dark:bg-obsidian-850 text-slate-800 dark:text-slate-200 hover:bg-slate-200/80'
                      }`}
                  >
                    ₱{val.toLocaleString()}
                  </button>
                ))}
              </div>

              {/* Custom Input */}
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-sm font-bold text-slate-400">
                  ₱
                </span>
                <input
                  type="number"
                  placeholder="Or enter custom amount in PHP..."
                  value={customAmount}
                  onChange={handleCustomChange}
                  className="w-full pl-8 pr-4 py-2.5 sm:py-3 bg-slate-50 dark:bg-obsidian-850 rounded-xl font-mono text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-royal-500/40"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                type="submit"
                className="w-full py-3 sm:py-3.5 bg-royal-500 hover:bg-royal-600 dark:bg-cobalt-500 dark:hover:bg-cobalt-400 text-white font-bold text-xs sm:text-sm rounded-full uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <HeartHandshake className="w-4 h-4" />
                <span>Confirm Pledge & Generate Voucher (₱{amount.toLocaleString()})</span>
              </button>
            </div>

            {/* Security Guarantee Strip */}
            <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-slate-400 dark:text-slate-500 pt-1">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                SEC Registered Non-Profit
              </span>
              <span>100% Directed to Local Ministry</span>
            </div>
          </motion.form>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-6 space-y-4"
          >
            <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-500 mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-bold block">
                Pledge Recorded • Reference #IFBBC-{Date.now().toString().slice(-6)}
              </span>
              <h4 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
                Salamat sa Inyong Tapat na Pagbibigay
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 max-w-md mx-auto leading-[1.68] text-pretty">
                Please transfer <strong className="text-slate-900 dark:text-white">₱{amount.toLocaleString()}</strong> to BPI Account <strong className="text-slate-900 dark:text-white">{bpiAccount.accountNumber}</strong> ({bpiAccount.names}) for <em>"{fund}"</em>.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setSuccess(false)}
                className="px-6 py-2.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-obsidian-950 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm"
              >
                Make Another Pledge
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 dark:bg-black/85 backdrop-blur-md"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 my-auto w-full max-w-lg max-h-[90vh] overflow-y-auto ambient-card rounded-3xl"
        >
          {content}
        </motion.div>
      </div>
    );
  }

  return (
    <section id="give" className="pt-12 pb-16 md:pt-16 md:pb-24 scroll-mt-24 relative overflow-hidden bg-slate-100/40 dark:bg-obsidian-900/30">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="font-mono text-xs uppercase tracking-widest text-royal-500 dark:text-cobalt-400 font-bold block">
              Stewardship & Worship
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight uppercase text-balance">
              Faithful Stewardship for the Lord's Work
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-300 leading-[1.68] text-pretty">
              At IFBBC, giving is an act of joyful obedience and worship. Your tithes and love offerings sustain our weekly services, support mission fields in Batangas, equip youth and children, and care for church families in need.
            </p>

            <div className="space-y-4 pt-4">
              <div className="flex items-start gap-3 text-xs text-slate-600 dark:text-slate-300 font-mono leading-relaxed">
                <span className="text-royal-500 dark:text-cobalt-400 font-bold">•</span>
                <span>Direct bank transfer via BPI (Bank of the Philippine Islands) online or over-the-counter.</span>
              </div>
              <div className="flex items-start gap-3 text-xs text-slate-600 dark:text-slate-300 font-mono leading-relaxed">
                <span className="text-royal-500 dark:text-cobalt-400 font-bold">•</span>
                <span>Financial transparency and accountability overseen by our church pastors and leadership council.</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            {content}
          </div>
        </div>
      </div>
    </section>
  );
};

