import React, { useState, useEffect } from 'react';
import { 
  Timer, 
  Coins, 
  Flame, 
  Fingerprint, 
  ShieldCheck, 
  Trophy, 
  ArrowRight, 
  Sparkles, 
  Zap, 
  Globe2, 
  Lock
} from 'lucide-react';
import { Hackathon } from '../types';
import { DartLogo } from './DartLogo';

interface HeroProps {
  hackathon: Hackathon;
  totalVotes: number;
  totalProjects: number;
  onExplore: () => void;
  onViewLeaderboard: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  hackathon,
  totalVotes,
  totalProjects,
  onExplore,
  onViewLeaderboard,
}) => {
  const [timeLeft, setTimeLeft] = useState({ days: 5, hours: 14, minutes: 38, seconds: 42 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Interactive spotlight handler for MotionSites cards
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };

  return (
    <section className="relative overflow-hidden pt-16 sm:pt-28 lg:pt-36 pb-24 sm:pb-36 lg:pb-44 border-b dark:border-white/[0.08] border-slate-200">
      
      {/* Background Aurora Waves and Dynamic Mesh */}
      <div className="absolute top-[-15%] left-1/2 -translate-x-1/2 w-[800px] sm:w-[1200px] h-[450px] sm:h-[650px] bg-gradient-to-tr from-blue-600/25 via-sky-400/20 to-indigo-600/25 rounded-full blur-[160px] pointer-events-none -z-10 animate-pulse-glow" />
      <div className="absolute top-28 right-[-12%] w-[400px] sm:w-[700px] h-[400px] sm:h-[700px] bg-sky-500/15 rounded-full blur-[180px] pointer-events-none -z-10 animate-float-delayed" />
      <div className="absolute inset-0 mesh-grid [mask-image:radial-gradient(ellipse_70%_60%_at_50%_25%,#000_70%,transparent_100%)] pointer-events-none -z-10" />

      <div className="motion-container">
        
        {/* Top Ctrl Pill Badge */}
        <div className="flex justify-center mb-6 sm:mb-8 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl sm:rounded-full bg-[#ecefec] dark:bg-white/[0.08] text-xs sm:text-sm font-semibold dark:text-slate-200 text-slate-700 shadow-sm text-center">
            <span className="w-2 h-2 rounded-full bg-[#05c92f] animate-pulse flex-shrink-0"></span>
            <span>Decentralized community voting for all Pollar Pitch Projects</span>
          </div>
        </div>

        {/* Hero Title & Value Proposition: Mask reveal and spring easing */}
        <div className="text-center max-w-5xl mx-auto space-y-6 sm:space-y-8">
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-[-0.04em] leading-[0.95] dark:text-white text-slate-950">
            <span className="mask-reveal-box">
              <span className="mask-reveal-text">Aim</span>
            </span>{" "}
            <span className="inline-block text-blue-600 dark:text-blue-500 transform hover:rotate-12 transition-transform duration-300 animate-pop-in">❖</span>{" "}
            <span className="mask-reveal-box">
              <span className="mask-reveal-text" style={{ animationDelay: '120ms' }}>Vote.</span>
            </span>
          </h1>

          <p className="text-base sm:text-xl md:text-2xl dark:text-slate-300 text-slate-600 max-w-3xl mx-auto leading-relaxed font-normal animate-fade-up stagger-1">
            Discover standout projects, test live demos, and cast your gasless cryptographic vote on Stellar SEP-53.
          </p>
        </div>

        {/* Primary Interactive CTAs (Ctrl.xyz Button Style with Spring Physics) */}
        <div className="mt-10 sm:mt-14 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 max-w-xl mx-auto animate-spring stagger-2">
          <button
            onClick={onExplore}
            className="ctrl-roll-button magnetic-pull w-full sm:w-auto inline-flex items-center justify-center gap-3.5 px-8 sm:px-10 py-4 sm:py-5 rounded-full bg-[#05c92f] hover:bg-[#04b82a] text-slate-950 font-black text-base sm:text-lg shadow-xl shadow-emerald-500/25 active:scale-95 transition-all duration-300 border-2 border-slate-950 group"
          >
            <div className="flex items-center -space-x-1.5 flex-shrink-0 animate-bounce-soft">
              <span className="w-3.5 h-3.5 rounded-full bg-[#fbe74e] ring-2 ring-slate-950"></span>
              <span className="w-3.5 h-3.5 rounded-full bg-[#ffcadc] ring-2 ring-slate-950"></span>
              <span className="w-3.5 h-3.5 rounded-full bg-[#9dc4f5] ring-2 ring-slate-950"></span>
            </div>
            <span className="ctrl-roll-label">Browse Projects & Vote</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onViewLeaderboard}
            className="ctrl-roll-button magnetic-pull w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 sm:px-9 py-4 sm:py-5 rounded-full bg-white dark:bg-white/[0.08] hover:bg-slate-50 dark:hover:bg-white/[0.14] text-slate-950 dark:text-white font-bold text-base sm:text-lg border-2 border-slate-950 dark:border-white/20 shadow-md active:scale-95 transition-all duration-300"
          >
            <Trophy className="w-5 h-5 text-amber-500" />
            <span className="ctrl-roll-label">Live Standings</span>
          </button>
        </div>

        {/* Countdown Floating Pill */}
        <div className="mt-10 sm:mt-12 flex justify-center">
          <div className="inline-flex items-center space-x-3 px-6 py-3 rounded-full dark:bg-black/45 bg-white/90 border dark:border-white/[0.12] border-slate-200 text-xs sm:text-sm font-mono shadow-md backdrop-blur-xl">
            <Timer className="w-4 h-4 text-blue-500 animate-spin-slow" />
            <span className="dark:text-slate-400 text-slate-500 uppercase text-xs font-semibold">Voting Window Closes:</span>
            <span className="dark:text-white text-slate-900 font-black">
              {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
            </span>
          </div>
        </div>

        {/* Interactive 3-Step Navigation Cards with Ctrl.xyz chunky styling */}
        <div className="mt-20 sm:mt-28 grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
          
          <div 
            onMouseMove={handleMouseMove}
            className="ctrl-card scale-on-scroll animate-zoom-in-up stagger-1 group p-8 sm:p-10 flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-[#9dc4f5]/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black text-xl mb-6 border-2 border-slate-950 dark:border-white/20 group-hover:scale-110 transition-transform">
                1
              </div>
              <h3 className="text-xl sm:text-2xl font-black dark:text-white text-slate-950 mb-3 flex items-center justify-between">
                <span>Connect Pollar</span>
                <Globe2 className="w-5 h-5 text-blue-500 opacity-60 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-sm dark:text-slate-400 text-slate-600 leading-relaxed">
                Sign in directly with your Google or GitHub account via Pollar. A secure, gas-sponsored Stellar wallet is provisioned automatically with no seed phrase required.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t dark:border-white/[0.08] border-slate-200/80 text-xs font-mono text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1.5">
              <span>Instant Social Auth</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          <div 
            onMouseMove={handleMouseMove}
            className="ctrl-card scale-on-scroll animate-zoom-in-up stagger-2 group p-8 sm:p-10 flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-[#fbe74e]/40 text-amber-600 dark:text-yellow-400 flex items-center justify-center font-black text-xl mb-6 border-2 border-slate-950 dark:border-white/20 group-hover:scale-110 transition-transform">
                2
              </div>
              <h3 className="text-xl sm:text-2xl font-black dark:text-white text-slate-950 mb-3 flex items-center justify-between">
                <span>Inspect Demos</span>
                <Sparkles className="w-5 h-5 text-amber-500 opacity-60 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-sm dark:text-slate-400 text-slate-600 leading-relaxed">
                Review verified testnet smart contracts, live video demos, and open-source GitHub code repositories with instant 1-click links.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t dark:border-white/[0.08] border-slate-200/80 text-xs font-mono text-amber-600 dark:text-yellow-400 font-bold flex items-center gap-1.5">
              <span>Transparent Pitch & Code</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          <div 
            onMouseMove={handleMouseMove}
            className="ctrl-card scale-on-scroll animate-zoom-in-up stagger-3 group p-8 sm:p-10 flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-[#ffcadc]/40 text-pink-600 dark:text-pink-400 flex items-center justify-center font-black text-xl mb-6 border-2 border-slate-950 dark:border-white/20 group-hover:scale-110 transition-transform">
                3
              </div>
              <h3 className="text-xl sm:text-2xl font-black dark:text-white text-slate-950 mb-3 flex items-center justify-between">
                <span>Sign with SEP-53</span>
                <Lock className="w-5 h-5 text-pink-500 opacity-60 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-sm dark:text-slate-400 text-slate-600 leading-relaxed">
                Cast your vote. Your wallet signs a canonical SEP-53 message payload recorded on Stellar with full public verification and zero gas fees.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t dark:border-white/[0.08] border-slate-200/80 text-xs font-mono text-pink-600 dark:text-pink-400 font-bold flex items-center gap-1.5">
              <span>Cryptographic Proof</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

        </div>

        {/* Live Metrics Card: Clean modern card on mobile/tablet, sleek ribbon on desktop */}
        <div className="mt-12 sm:mt-20 p-5 sm:p-6 lg:p-7 rounded-2xl sm:rounded-3xl lg:rounded-full border dark:border-white/10 border-slate-200/80 ctrl-pill-nav shadow-md animate-pop-in stagger-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-row lg:items-center lg:justify-around gap-4 sm:gap-6 lg:gap-8 text-xs sm:text-sm font-mono">
            <div className="flex items-center space-x-2.5">
              <Coins className="w-5 h-5 text-amber-500 flex-shrink-0" />
              <span className="dark:text-slate-400 text-slate-500 font-medium">Prize Pool:</span>
              <span className="dark:text-white text-slate-950 font-black">{hackathon.prizePool}</span>
            </div>

            <span className="hidden lg:inline text-slate-300 dark:text-white/20 select-none">|</span>

            <div className="flex items-center space-x-2.5">
              <Flame className="w-5 h-5 text-blue-500 flex-shrink-0" />
              <span className="dark:text-slate-400 text-slate-500 font-medium">Submissions:</span>
              <span className="dark:text-white text-slate-950 font-black">{totalProjects} Projects</span>
            </div>

            <span className="hidden lg:inline text-slate-300 dark:text-white/20 select-none">|</span>

            <div className="flex items-center space-x-2.5">
              <Fingerprint className="w-5 h-5 text-sky-500 flex-shrink-0" />
              <span className="dark:text-slate-400 text-slate-500 font-medium">SEP-53 Votes:</span>
              <span className="text-blue-600 dark:text-sky-400 font-black">{totalVotes}</span>
            </div>

            <span className="hidden lg:inline text-slate-300 dark:text-white/20 select-none">|</span>

            <div className="flex items-center space-x-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              <span className="dark:text-slate-400 text-slate-500 font-medium">Sybil Defense:</span>
              <span className="dark:text-white text-slate-950 font-black">1 Vote / Wallet</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
