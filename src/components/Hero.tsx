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
        
        {/* Top Sketchy Hand & Dart Branding Badge */}
        <div className="flex justify-center mb-8 sm:mb-12">
          <div className="inline-flex items-center space-x-3.5 px-5 py-2.5 rounded-full dark:bg-white/[0.06] bg-blue-50/90 border dark:border-white/[0.12] border-blue-200/80 text-xs font-mono dark:text-blue-300 text-blue-700 shadow-md backdrop-blur-xl hover:scale-105 transition-all duration-300">
            <DartLogo size={24} />
            <span className="font-extrabold uppercase tracking-wider">Dart on Pollar</span>
            <span className="text-slate-400">•</span>
            <span className="font-semibold hidden sm:inline">Stellar SEP-53 Non-Repudiation</span>
          </div>
        </div>

        {/* Hero Title & Value Proposition */}
        <div className="text-center max-w-5xl mx-auto space-y-6 sm:space-y-8">
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-[-0.03em] leading-[1.08] dark:text-white text-slate-900">
            Aim Higher with{' '}
            <span className="bg-gradient-to-r from-blue-600 via-sky-400 to-blue-400 bg-clip-text text-transparent">
              Dart Voting
            </span>
          </h1>

          <p className="text-base sm:text-xl md:text-2xl dark:text-slate-300 text-slate-600 max-w-3xl mx-auto leading-relaxed font-normal">
            Decentralized community governance for the <strong className="dark:text-white text-slate-900 font-bold">LATAM Builders Summit 2026</strong>. Built with the official <a href="https://docs.pollar.xyz" target="_blank" rel="noreferrer" className="text-blue-500 font-bold hover:underline">@pollar/react</a> and <a href="https://www.npmjs.com/package/@pollar/core" target="_blank" rel="noreferrer" className="text-blue-500 font-bold hover:underline">@pollar/core</a> SDKs.
          </p>
        </div>

        {/* Primary Interactive CTAs */}
        <div className="mt-12 sm:mt-16 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 max-w-xl mx-auto">
          <button
            onClick={onExplore}
            className="w-full sm:w-auto shimmer-sweep flex items-center justify-center space-x-3 px-9 py-5 rounded-2xl sm:rounded-3xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-base shadow-2xl shadow-blue-600/40 transition-all duration-300 hover:scale-105 active:scale-95 group"
          >
            <Flame className="w-5 h-5 fill-white group-hover:animate-bounce" />
            <span>Browse Projects & Vote</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
          </button>

          <button
            onClick={onViewLeaderboard}
            className="w-full sm:w-auto flex items-center justify-center space-x-2.5 px-8 py-5 rounded-2xl sm:rounded-3xl dark:bg-white/[0.06] bg-white hover:bg-slate-50 dark:hover:bg-white/[0.12] dark:text-white text-slate-800 border dark:border-white/[0.12] border-slate-200 text-base font-bold shadow-lg transition-all duration-300 hover:scale-[1.02]"
          >
            <Trophy className="w-5 h-5 text-amber-400" />
            <span>Live Standings</span>
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

        {/* Interactive 3-Step Navigation Cards with MotionSites Spotlight & Generous Margins */}
        <div className="mt-20 sm:mt-28 grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
          
          <div 
            onMouseMove={handleMouseMove}
            className="spotlight-card group p-8 sm:p-10 rounded-[36px] dark:bg-[#0D1424]/90 bg-white border dark:border-white/[0.08] border-slate-200/90 shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-500 flex items-center justify-center font-black text-xl mb-6 border border-blue-500/30 group-hover:scale-110 transition-transform">
                1
              </div>
              <h3 className="text-xl font-bold dark:text-white text-slate-900 mb-2 flex items-center justify-between">
                <span>Connect Pollar</span>
                <Globe2 className="w-5 h-5 text-blue-500 opacity-60 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-sm dark:text-slate-400 text-slate-600 leading-relaxed">
                Sign in directly with your Google or GitHub account via Pollar. A secure, gas-sponsored Stellar wallet is provisioned automatically with no seed phrase required.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t dark:border-white/[0.06] border-slate-100 text-xs font-mono text-blue-500 font-bold flex items-center gap-1.5">
              <span>Instant Social Auth</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          <div 
            onMouseMove={handleMouseMove}
            className="spotlight-card group p-8 sm:p-10 rounded-[36px] dark:bg-[#0D1424]/90 bg-white border dark:border-white/[0.08] border-slate-200/90 shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-sky-500/10 dark:bg-sky-500/20 text-sky-500 flex items-center justify-center font-black text-xl mb-6 border border-sky-500/30 group-hover:scale-110 transition-transform">
                2
              </div>
              <h3 className="text-xl font-bold dark:text-white text-slate-900 mb-2 flex items-center justify-between">
                <span>Inspect Demos</span>
                <Sparkles className="w-5 h-5 text-sky-500 opacity-60 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-sm dark:text-slate-400 text-slate-600 leading-relaxed">
                Review verified testnet smart contracts, live video demos, and open-source GitHub code repositories with instant 1-click links.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t dark:border-white/[0.06] border-slate-100 text-xs font-mono text-sky-500 font-bold flex items-center gap-1.5">
              <span>Transparent Pitch & Code</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          <div 
            onMouseMove={handleMouseMove}
            className="spotlight-card group p-8 sm:p-10 rounded-[36px] dark:bg-[#0D1424]/90 bg-white border dark:border-white/[0.08] border-slate-200/90 shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-500 flex items-center justify-center font-black text-xl mb-6 border border-indigo-500/30 group-hover:scale-110 transition-transform">
                3
              </div>
              <h3 className="text-xl font-bold dark:text-white text-slate-900 mb-2 flex items-center justify-between">
                <span>Sign with SEP-53</span>
                <Lock className="w-5 h-5 text-indigo-500 opacity-60 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-sm dark:text-slate-400 text-slate-600 leading-relaxed">
                Cast your vote. Your wallet signs a canonical SEP-53 message payload recorded on Stellar with full public verification and zero gas fees.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t dark:border-white/[0.06] border-slate-100 text-xs font-mono text-indigo-500 font-bold flex items-center gap-1.5">
              <span>Cryptographic Proof</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

        </div>

        {/* Live Metrics Ribbon with Roomy Padding */}
        <div className="mt-16 sm:mt-24 p-6 sm:p-8 rounded-[32px] dark:bg-white/[0.03] bg-slate-100/80 border dark:border-white/[0.08] border-slate-200/80 flex flex-wrap items-center justify-around gap-6 sm:gap-8 text-xs sm:text-sm font-mono shadow-sm">
          <div className="flex items-center space-x-2.5">
            <Coins className="w-5 h-5 text-amber-500" />
            <span className="dark:text-slate-400 text-slate-500">Prize Pool:</span>
            <span className="dark:text-white text-slate-900 font-black">{hackathon.prizePool}</span>
          </div>

          <div className="flex items-center space-x-2.5">
            <Flame className="w-5 h-5 text-blue-500" />
            <span className="dark:text-slate-400 text-slate-500">Active Submissions:</span>
            <span className="dark:text-white text-slate-900 font-black">{totalProjects} Projects</span>
          </div>

          <div className="flex items-center space-x-2.5">
            <Fingerprint className="w-5 h-5 text-sky-400" />
            <span className="dark:text-slate-400 text-slate-500">Verified SEP-53 Votes:</span>
            <span className="text-blue-500 font-black">{totalVotes}</span>
          </div>

          <div className="flex items-center space-x-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <span className="dark:text-slate-400 text-slate-500">Sybil Defense:</span>
            <span className="dark:text-white text-slate-900 font-black">1 Vote / Wallet</span>
          </div>
        </div>

      </div>
    </section>
  );
};
