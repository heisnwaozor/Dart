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

  return (
    <section className="relative overflow-hidden pt-8 sm:pt-14 pb-12 sm:pb-18 border-b dark:border-white/[0.08] border-slate-200">
      
      {/* Background Aurora Waves & Dynamic Mesh */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[700px] sm:w-[1000px] h-[350px] sm:h-[500px] bg-gradient-to-tr from-blue-600/30 via-sky-400/20 to-indigo-600/30 rounded-full blur-[140px] pointer-events-none -z-10 animate-pulse-glow" />
      <div className="absolute top-20 right-[-10%] w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] bg-sky-500/15 rounded-full blur-[160px] pointer-events-none -z-10 animate-float-delayed" />
      <div className="absolute inset-0 mesh-grid [mask-image:radial-gradient(ellipse_60%_50%_at_50%_20%,#000_70%,transparent_100%)] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Butterfly & Dart Branding Badge */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="inline-flex items-center space-x-3 px-4 py-1.5 rounded-full dark:bg-white/[0.05] bg-blue-50 border dark:border-white/[0.12] border-blue-200 text-xs font-mono dark:text-blue-300 text-blue-700 shadow-sm backdrop-blur-md hover:scale-105 transition-transform duration-300">
            <DartLogo size={22} />
            <span className="font-extrabold uppercase tracking-wide">Dart on Pollar</span>
            <span className="text-slate-400">•</span>
            <span className="font-semibold hidden sm:inline">Stellar SEP-53 Non-Repudiation</span>
          </div>
        </div>

        {/* Hero Title & Value Proposition */}
        <div className="text-center max-w-4xl mx-auto space-y-4 sm:space-y-6">
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] dark:text-white text-slate-900">
            Aim Higher with{' '}
            <span className="bg-gradient-to-r from-blue-600 via-sky-400 to-blue-400 bg-clip-text text-transparent">
              Dart Voting
            </span>
          </h1>

          <p className="text-sm sm:text-lg md:text-xl dark:text-slate-300 text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            Decentralized community governance for the <strong className="dark:text-white text-slate-900 font-bold">LATAM Builders Summit 2026</strong>. Built with the official <a href="https://docs.pollar.xyz" target="_blank" rel="noreferrer" className="text-blue-500 font-bold hover:underline">@pollar/react</a> & <a href="https://www.npmjs.com/package/@pollar/core" target="_blank" rel="noreferrer" className="text-blue-500 font-bold hover:underline">@pollar/core</a> SDKs.
          </p>
        </div>

        {/* Primary Interactive CTAs */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 max-w-lg mx-auto">
          <button
            onClick={onExplore}
            className="w-full sm:w-auto shimmer-sweep flex items-center justify-center space-x-2.5 px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-blue-600/35 transition-all duration-300 hover:scale-105 active:scale-95 group"
          >
            <Flame className="w-5 h-5 fill-white group-hover:animate-bounce" />
            <span>Browse Projects & Vote</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onViewLeaderboard}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-7 py-4 rounded-2xl dark:bg-white/[0.06] bg-white hover:bg-slate-50 dark:hover:bg-white/[0.12] dark:text-white text-slate-800 border dark:border-white/[0.12] border-slate-200 text-sm sm:text-base font-bold shadow-md transition-all duration-300 hover:scale-[1.02]"
          >
            <Trophy className="w-5 h-5 text-amber-400" />
            <span>Live Standings</span>
          </button>
        </div>

        {/* Countdown Floating Pill */}
        <div className="mt-6 flex justify-center">
          <div className="inline-flex items-center space-x-2.5 px-4 py-2 rounded-2xl dark:bg-black/40 bg-white/80 border dark:border-white/[0.1] border-slate-200 text-xs sm:text-sm font-mono shadow-sm backdrop-blur-md">
            <Timer className="w-4 h-4 text-blue-500 animate-spin-slow" />
            <span className="dark:text-slate-400 text-slate-500 uppercase text-xs">Voting Window Closes:</span>
            <span className="dark:text-white text-slate-900 font-black">
              {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
            </span>
          </div>
        </div>

        {/* Interactive 3-Step Navigation Cards with Hover Animation */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          
          <div className="group relative p-6 rounded-3xl dark:bg-[#0E1527]/80 bg-white border dark:border-white/[0.08] border-slate-200/80 shadow-lg hover:shadow-2xl hover:shadow-blue-500/15 hover:border-blue-500/40 transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-500 flex items-center justify-center font-black text-lg mb-4 border border-blue-500/30 group-hover:scale-110 transition-transform">
              1
            </div>
            <h3 className="text-base font-bold dark:text-white text-slate-900 mb-1 flex items-center justify-between">
              <span>Connect Pollar</span>
              <Globe2 className="w-4 h-4 text-blue-500 opacity-60 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p className="text-xs sm:text-sm dark:text-slate-400 text-slate-500 leading-relaxed">
              Sign in with Google or GitHub via Pollar. A secure, gas-sponsored Stellar wallet is provisioned automatically with no seed phrase required.
            </p>
          </div>

          <div className="group relative p-6 rounded-3xl dark:bg-[#0E1527]/80 bg-white border dark:border-white/[0.08] border-slate-200/80 shadow-lg hover:shadow-2xl hover:shadow-blue-500/15 hover:border-blue-500/40 transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 dark:bg-sky-500/20 text-sky-500 flex items-center justify-center font-black text-lg mb-4 border border-sky-500/30 group-hover:scale-110 transition-transform">
              2
            </div>
            <h3 className="text-base font-bold dark:text-white text-slate-900 mb-1 flex items-center justify-between">
              <span>Inspect Demos</span>
              <Sparkles className="w-4 h-4 text-sky-500 opacity-60 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p className="text-xs sm:text-sm dark:text-slate-400 text-slate-500 leading-relaxed">
              Review testnet smart contracts, video pitches, and open-source GitHub code repositories with instant 1-click links.
            </p>
          </div>

          <div className="group relative p-6 rounded-3xl dark:bg-[#0E1527]/80 bg-white border dark:border-white/[0.08] border-slate-200/80 shadow-lg hover:shadow-2xl hover:shadow-blue-500/15 hover:border-blue-500/40 transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-500 flex items-center justify-center font-black text-lg mb-4 border border-indigo-500/30 group-hover:scale-110 transition-transform">
              3
            </div>
            <h3 className="text-base font-bold dark:text-white text-slate-900 mb-1 flex items-center justify-between">
              <span>Sign with SEP-53</span>
              <Lock className="w-4 h-4 text-indigo-500 opacity-60 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p className="text-xs sm:text-sm dark:text-slate-400 text-slate-500 leading-relaxed">
              Cast your vote. Your wallet signs a canonical SEP-53 message payload recorded on Stellar with full public verification and zero gas fees.
            </p>
          </div>

        </div>

        {/* Live Metrics Ribbon */}
        <div className="mt-8 sm:mt-12 p-4 rounded-2xl dark:bg-white/[0.03] bg-slate-100/80 border dark:border-white/[0.06] border-slate-200 flex flex-wrap items-center justify-around gap-4 text-xs font-mono">
          <div className="flex items-center space-x-2">
            <Coins className="w-4 h-4 text-amber-500" />
            <span className="dark:text-slate-400 text-slate-500">Prize Pool:</span>
            <span className="dark:text-white text-slate-900 font-bold">{hackathon.prizePool}</span>
          </div>

          <div className="flex items-center space-x-2">
            <Flame className="w-4 h-4 text-blue-500" />
            <span className="dark:text-slate-400 text-slate-500">Active Submissions:</span>
            <span className="dark:text-white text-slate-900 font-bold">{totalProjects} Projects</span>
          </div>

          <div className="flex items-center space-x-2">
            <Fingerprint className="w-4 h-4 text-sky-400" />
            <span className="dark:text-slate-400 text-slate-500">Verified SEP-53 Votes:</span>
            <span className="text-blue-500 font-bold">{totalVotes}</span>
          </div>

          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span className="dark:text-slate-400 text-slate-500">Sybil Defense:</span>
            <span className="dark:text-white text-slate-900 font-bold">1 Vote / Wallet</span>
          </div>
        </div>

      </div>
    </section>
  );
};
