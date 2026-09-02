import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Menu, X, ArrowUpRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { MagneticButton } from './ui/MagneticButton';

interface NavbarProps {
  onOpenVisit: () => void;
  onOpenPrayer: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenVisit, onOpenPrayer }) => {
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Vision & Values', href: '#vision-values' },
    { name: 'Core Groups', href: '#core-groups' },
    { name: 'Weekly Schedule', href: '#schedule' },
    { name: 'Leadership', href: '#leadership' },
    { name: 'Sermons', href: '#sermons' },
    { name: 'Online Giving', href: '#give' },
    { name: 'Location', href: '#location' },
  ];

  const scrollToTarget = (href: string) => {
    if (href === '#' || !href) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const targetElement = document.querySelector(href);
    if (targetElement) {
      const navOffset = 80;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  const handleNavClick = (e: React.MouseEvent<HTMLElement>, href: string) => {
    e.preventDefault();
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
      setTimeout(() => {
        scrollToTarget(href);
      }, 120);
    } else {
      scrollToTarget(href);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-white/90 dark:bg-obsidian-950/90 backdrop-blur-2xl shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] dark:shadow-[0_10px_30px_-5px_rgba(0,0,0,0.6)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-20 sm:h-24 gap-4">
          {/* Architectural Brandmark */}
          <a
            href="#"
            onClick={(e) => handleNavClick(e, '#')}
            className="flex items-center gap-3 group focus:outline-none shrink-0"
          >
            <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-sm ring-1 ring-royal-500/25 dark:ring-cobalt-400/30 flex items-center justify-center transition-all duration-500 group-hover:scale-105 shrink-0 bg-slate-900">
              <img
                src="/logo.jpg"
                alt="IFBBC Logo"
                className="w-full h-full object-cover object-center filter hue-rotate-[38deg] saturate-[1.35] contrast-[1.08] brightness-[1.02] transition-all"
              />
            </div>
            <div className="flex flex-col shrink-0">
              <span className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white leading-none">
                IFBBC
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links (Responsive layout preventing overlap) */}
          <nav className="hidden xl:flex items-center gap-5 2xl:gap-7 shrink-0">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-xs font-semibold uppercase tracking-wider text-slate-600 hover:text-royal-500 dark:text-slate-300 dark:hover:text-cobalt-400 transition-colors duration-200 py-1 whitespace-nowrap"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Action Hub & Theme Toggle */}
          <div className="hidden xl:flex items-center gap-3.5 shrink-0">
            {/* Theme Switcher */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="w-9 h-9 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-royal-500 dark:hover:text-cobalt-400 bg-slate-100/80 dark:bg-obsidian-850 hover:bg-slate-200/80 dark:hover:bg-obsidian-800 transition-all duration-200 shadow-sm shrink-0 cursor-pointer"
            >
              <AnimatePresence mode="wait" initial={false}>
                {theme === 'dark' ? (
                  <motion.div
                    key="sun"
                    initial={{ scale: 0, rotate: 90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: -90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun className="w-4 h-4 text-amber-400" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: -90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon className="w-4 h-4 text-slate-700" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            {/* Prayer Wall Action Button (Replaces repetitive Online Giving) */}
            <button
              type="button"
              onClick={onOpenPrayer}
              className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 hover:text-royal-500 dark:hover:text-cobalt-400 px-3 py-2 flex items-center transition-colors cursor-pointer whitespace-nowrap bg-slate-100/70 hover:bg-slate-200/70 dark:bg-obsidian-850 dark:hover:bg-obsidian-800 rounded-full"
            >
              <span>Prayer Wall</span>
            </button>

            {/* Plan a Visit Magnetic Action */}
            <MagneticButton
              variant="primary"
              size="sm"
              onClick={onOpenVisit}
            >
              <span className="whitespace-nowrap">Plan a Visit</span>
              <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
            </MagneticButton>
          </div>

          {/* Mobile/Tablet Navigation Header Controls */}
          <div className="flex items-center gap-2 xl:hidden shrink-0">
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="w-9 h-9 rounded-full bg-slate-100 dark:bg-obsidian-800 flex items-center justify-center text-slate-700 dark:text-slate-300 cursor-pointer"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-slate-100/80 dark:bg-obsidian-850 text-slate-700 dark:text-slate-200 hover:text-royal-500 focus:outline-none cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="xl:hidden bg-white/98 dark:bg-obsidian-950/98 backdrop-blur-2xl px-6 py-6 shadow-2xl space-y-6 border-b border-slate-200/50 dark:border-white/5"
          >
            <nav className="flex flex-col divide-y divide-slate-100 dark:divide-white/5">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  type="button"
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 hover:text-royal-500 dark:hover:text-cobalt-400 py-3.5 transition-colors flex items-center justify-between text-left w-full cursor-pointer"
                >
                  <span>{link.name}</span>
                  <ArrowUpRight className="w-4 h-4 opacity-40 text-royal-500 dark:text-cobalt-400" />
                </button>
              ))}
            </nav>

            <div className="pt-2 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenPrayer();
                }}
                className="w-full py-3.5 bg-royal-500/10 hover:bg-royal-500/20 dark:bg-cobalt-500/20 text-royal-600 dark:text-cobalt-400 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <span>Open Community Prayer Wall</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenVisit();
                }}
                className="w-full py-4 bg-royal-500 hover:bg-royal-600 dark:bg-cobalt-500 dark:hover:bg-cobalt-400 text-white rounded-2xl text-xs font-bold uppercase tracking-wider shadow-md flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <span>Plan Your Sunday Visit</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

