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
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb', // Core Electric Royal Blue
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#0f172a',
        },
        ice: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
        },
        pollar: {
          DEFAULT: '#3B82F6',
          glow: 'rgba(59, 130, 246, 0.4)',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'float': 'float 4s ease-in-out infinite',
        'float-delayed': 'float 5s ease-in-out 2s infinite',
        'pulse-glow': 'pulseGlow 2.5s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
        'spin-slow': 'spin 18s linear infinite',
        'spin-reverse': 'spinReverse 14s linear infinite',
        'gradient-x': 'gradientX 8s ease infinite',
        'scanline': 'scanline 3s linear infinite',
        'radar-sweep': 'radarSweep 2s ease-out infinite',
        'beam': 'beam 4s ease-in-out infinite',
        'fade-up': 'fadeUp 0.65s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-in-left': 'slideInLeft 0.55s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'zoom-in-up': 'zoomInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'flip-up': 'flipUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'unfold': 'unfold 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'mask-reveal': 'maskReveal 0.75s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'spring': 'springIn 0.65s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'pop-in': 'popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'overshoot': 'overshoot 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'elastic': 'elasticBounce 0.8s ease-in-out forwards',
        'bounce-soft': 'bounceSoft 2s infinite ease-in-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { 
            boxShadow: '0 0 15px rgba(37, 99, 235, 0.25), 0 0 30px rgba(59, 130, 246, 0.15)',
            borderColor: 'rgba(59, 130, 246, 0.4)'
          },
          '50%': { 
            boxShadow: '0 0 25px rgba(37, 99, 235, 0.6), 0 0 50px rgba(59, 130, 246, 0.35)',
            borderColor: 'rgba(96, 165, 250, 0.8)'
          },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        spinReverse: {
          '0%': { transform: 'rotate(360deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
        gradientX: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        },
        radarSweep: {
          '0%': { transform: 'scale(0.8)', opacity: '0.9' },
          '50%': { transform: 'scale(1.4)', opacity: '0.4' },
          '100%': { transform: 'scale(2.0)', opacity: '0' },
        },
        beam: {
          '0%, 100%': { opacity: '0.4', transform: 'scaleY(1)' },
          '50%': { opacity: '0.9', transform: 'scaleY(1.3)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translate3d(0, 28px, 0)' },
          '100%': { opacity: '1', transform: 'translate3d(0, 0, 0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translate3d(-36px, 0, 0)' },
          '100%': { opacity: '1', transform: 'translate3d(0, 0, 0)' },
        },
        zoomInUp: {
          '0%': { opacity: '0', transform: 'scale3d(0.92, 0.92, 0.92) translate3d(0, 32px, 0)' },
          '100%': { opacity: '1', transform: 'scale3d(1, 1, 1) translate3d(0, 0, 0)' },
        },
        flipUp: {
          '0%': { opacity: '0', transform: 'perspective(800px) rotateX(24deg) translate3d(0, 24px, 0)' },
          '100%': { opacity: '1', transform: 'perspective(800px) rotateX(0deg) translate3d(0, 0, 0)' },
        },
        unfold: {
          '0%': { opacity: '0', transform: 'scaleY(0.4)', transformOrigin: 'top center' },
          '100%': { opacity: '1', transform: 'scaleY(1)', transformOrigin: 'top center' },
        },
        maskReveal: {
          '0%': { transform: 'translate3d(0, 110%, 0)', opacity: '0' },
          '100%': { transform: 'translate3d(0, 0%, 0)', opacity: '1' },
        },
        springIn: {
          '0%': { opacity: '0', transform: 'scale(0.86) translate3d(0, 18px, 0)' },
          '65%': { opacity: '1', transform: 'scale(1.03) translate3d(0, -3px, 0)' },
          '100%': { opacity: '1', transform: 'scale(1) translate3d(0, 0, 0)' },
        },
        popIn: {
          '0%': { opacity: '0', transform: 'scale(0.72)' },
          '70%': { opacity: '1', transform: 'scale(1.04)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        overshoot: {
          '0%': { opacity: '0', transform: 'translate3d(0, 24px, 0) scale(0.95)' },
          '70%': { opacity: '1', transform: 'translate3d(0, -4px, 0) scale(1.02)' },
          '100%': { opacity: '1', transform: 'translate3d(0, 0, 0) scale(1)' },
        },
        elasticBounce: {
          '0%': { transform: 'scale(0.35)', opacity: '0' },
          '40%': { transform: 'scale(1.08)', opacity: '1' },
          '60%': { transform: 'scale(0.96)' },
          '80%': { transform: 'scale(1.02)' },
          '100%': { transform: 'scale(1)' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
