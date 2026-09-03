/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        chalk: {
          50: '#F0F2F6',
          100: '#E6E9F0',
          200: '#D9DFE8',
          300: '#CCD3E1',
          400: '#BAC4D6',
          500: '#94A3B8',
          900: '#0B0F19',
        },
        obsidian: {
          950: '#07080B',
          900: '#0A0C10',
          850: '#0F1218',
          800: '#141820',
          700: '#1D222E',
          600: '#2A3142',
        },
        royal: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          400: '#3B82F6',
          500: '#0047FF',
          600: '#003BD6',
          700: '#002FA8',
        },
        cobalt: {
          400: '#4D94FF',
          500: '#2979FF',
          600: '#1565C0',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        mono: ['Inter', 'sans-serif'],
      },
      letterSpacing: {
        tighter: '-0.045em',
        tight: '-0.028em',
        snug: '-0.015em',
        normal: '0em',
        wide: '0.04em',
        widest: '0.12em',
      },
      lineHeight: {
        tightest: '0.94',
        compact: '1.08',
      },
      boxShadow: {
        'glass-light': '0 20px 40px -15px rgba(0, 71, 255, 0.05)',
        'glass-dark': '0 25px 50px -15px rgba(0, 0, 0, 0.7)',
        'royal-glow': '0 0 35px -5px rgba(0, 71, 255, 0.28)',
        'cobalt-glow': '0 0 35px -5px rgba(41, 121, 255, 0.35)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
