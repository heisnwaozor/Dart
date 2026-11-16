import React from 'react';
import { 
  Trophy, 
  Flame, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle, 
  Code2,
  Users,
  Zap,
  Lock,
  Compass
} from 'lucide-react';
import { Hackathon, Project } from '../types';

interface PortalLandingProps {
  hackathon: Hackathon;
  projects: Project[];
  totalVotes: number;
  onEnterVoting: () => void;
  onEnterBuilder: () => void;
  onOpenAuth: () => void;
}

export const PortalLanding: React.FC<PortalLandingProps> = ({
  hackathon,
  projects,
  totalVotes,
  onEnterVoting,
  onEnterBuilder,
  onOpenAuth,
}) => {
  return (
    <div className="flex flex-col min-h-screen">
      
      {/* 1. Hero Section inspired by Ctrl.xyz */}
      <section className="relative pt-20 sm:pt-28 lg:pt-36 pb-20 sm:pb-28 text-center overflow-hidden">
        
        {/* Subtle radial ambient glow */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[600px] sm:w-[900px] h-[350px] sm:h-[450px] bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-[140px] pointer-events-none -z-10" />

        <div className="motion-container relative z-10 max-w-5xl mx-auto flex flex-col items-center">
          
          {/* Subtitle above title: requested text */}
          <div className="mb-6 sm:mb-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ecefec] dark:bg-white/[0.08] text-xs sm:text-sm font-semibold dark:text-slate-200 text-slate-700 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#05c92f] animate-pulse"></span>
            <span>Decentralized community voting for all Pollar Pitch Projects</span>
          </div>

          {/* Monumental Headline (Ctrl.xyz giant typographic treatment) */}
          <h1 className="text-6xl sm:text-8xl md:text-9xl font-black tracking-[-0.04em] leading-[0.92] dark:text-white text-slate-950 mb-8 sm:mb-10 select-none">
            Take <span className="inline-block text-blue-600 dark:text-blue-500 transform hover:rotate-12 transition-transform duration-300">❖</span> Dart.
          </h1>

          {/* Clean summary line */}
          <p className="text-lg sm:text-2xl md:text-3xl dark:text-slate-300 text-slate-700 font-normal max-w-2xl mx-auto mb-10 sm:mb-12 leading-relaxed">
            One wallet. One vote. 100% cryptographic proof on Stellar.
          </p>

          {/* Dual Action Center CTA Pills (Ctrl.xyz exact button style with rolling text) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 w-full max-w-md sm:max-w-none">
            
            {/* Primary Action: Signature Green Pill Button with 3-dot Badge */}
            <button
              onClick={onEnterVoting}
              className="ctrl-roll-button w-full sm:w-auto inline-flex items-center justify-center gap-3.5 px-8 sm:px-10 py-4 sm:py-5 rounded-full bg-[#05c92f] hover:bg-[#04b82a] text-slate-950 font-black text-base sm:text-lg shadow-xl shadow-emerald-500/25 hover:scale-105 active:scale-95 transition-all duration-300 border-2 border-slate-950 group"
            >
              {/* Overlapping Multi-Color Status Circles (from Ctrl.xyz) */}
              <div className="flex items-center -space-x-1.5 flex-shrink-0">
                <span className="w-3.5 h-3.5 rounded-full bg-[#fbe74e] ring-2 ring-slate-950"></span>
                <span className="w-3.5 h-3.5 rounded-full bg-[#ffcadc] ring-2 ring-slate-950"></span>
                <span className="w-3.5 h-3.5 rounded-full bg-[#9dc4f5] ring-2 ring-slate-950"></span>
              </div>
              <span className="ctrl-roll-label">Enter Voting Arena</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Secondary Action: Sleek Dark / White Pill Button for Builders */}
            <button
              onClick={onEnterBuilder}
              className="ctrl-roll-button w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 sm:px-9 py-4 sm:py-5 rounded-full bg-white dark:bg-white/[0.08] hover:bg-slate-50 dark:hover:bg-white/[0.14] text-slate-950 dark:text-white font-bold text-base sm:text-lg border-2 border-slate-950 dark:border-white/20 shadow-md hover:scale-105 active:scale-95 transition-all duration-300"
            >
              <Code2 className="w-5 h-5 text-blue-500" />
              <span className="ctrl-roll-label">Submit a Project</span>
            </button>

          </div>

          {/* Micro stats banner below CTAs */}
          <div className="mt-12 sm:mt-16 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm font-mono dark:text-slate-400 text-slate-500">
            <span className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              {hackathon.prizePool} Prize Pool
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-blue-500" />
              {totalVotes} Verified Votes Cast
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Stellar SEP-53 Signed
            </span>
          </div>

        </div>

      </section>


      {/* 2. The Two Master Pathways (Two Doors: Voters vs Builders) */}
      <section className="py-16 sm:py-24 border-t dark:border-white/[0.08] border-slate-200">
        <div className="motion-container">
          
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3">
            <h2 className="text-3xl sm:text-5xl font-black dark:text-white text-slate-950 tracking-tight">
              Choose Your Pathway
            </h2>
            <p className="text-sm sm:text-base dark:text-slate-400 text-slate-600">
              Community voters evaluate pitches and decide the prize winners; hackathon builders submit smart contracts and demos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 max-w-5xl mx-auto">
            
            {/* Doorway 1: Community Voters */}
            <div 
              onClick={onEnterVoting}
              className="ctrl-card p-5 sm:p-8 md:p-12 rounded-2xl sm:rounded-3xl md:rounded-[36px] cursor-pointer flex flex-col justify-between group shadow-xl"
            >
              <div className="space-y-5 sm:space-y-6">
                
                {/* Header Tag */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4">
                  <span className="self-start px-3.5 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-600 dark:text-blue-400 font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap flex-shrink-0">
                    <Users className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>For Voters & Community</span>
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-400 whitespace-nowrap">
                    {projects.length} Active Projects
                  </span>
                </div>

                <div className="space-y-3">
                  <h3 className="text-2xl sm:text-4xl font-black dark:text-white text-slate-950 tracking-tight group-hover:text-blue-500 transition-colors">
                    The Voting Arena
                  </h3>
                  <p className="text-sm sm:text-base dark:text-slate-400 text-slate-600 leading-relaxed">
                    Explore curated project pitches, inspect live demos, and cast your gasless cryptographic vote on Stellar. Watch real-time standings update on the live leaderboard.
                  </p>
                </div>

                {/* Key Voter Highlights */}
                <ul className="space-y-2.5 pt-2 text-xs sm:text-sm dark:text-slate-300 text-slate-700 font-medium">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    <span>Google & GitHub 1-click social sign-in</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    <span>Stellar Ed25519 digital signature per vote</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    <span>Verified vote receipt with cryptographic proof</span>
                  </li>
                </ul>

              </div>

              {/* Action Button at bottom with rolling text */}
              <div className="pt-8">
                <div className="ctrl-roll-button w-full py-4 px-6 rounded-2xl bg-slate-950 hover:bg-slate-900 text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-950 font-bold text-sm sm:text-base flex items-center justify-between shadow-lg group-hover:scale-[1.02] transition-all">
                  <span className="ctrl-roll-label">Enter Voting Arena</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

            </div>

            {/* Doorway 2: Hackathon Builders */}
            <div 
              onClick={onEnterBuilder}
              className="ctrl-card p-5 sm:p-8 md:p-12 rounded-2xl sm:rounded-3xl md:rounded-[36px] cursor-pointer flex flex-col justify-between group shadow-xl"
            >
              <div className="space-y-5 sm:space-y-6">
                
                {/* Header Tag */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4">
                  <span className="self-start px-3.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap flex-shrink-0">
                    <Code2 className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>For Hackathon Builders</span>
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-500 whitespace-nowrap">
                    $75k Prize Pool
                  </span>
                </div>

                <div className="space-y-3">
                  <h3 className="text-2xl sm:text-4xl font-black dark:text-white text-slate-950 tracking-tight group-hover:text-emerald-500 transition-colors">
                    Builder Portal
                  </h3>
                  <p className="text-sm sm:text-base dark:text-slate-400 text-slate-600 leading-relaxed">
                    Submit your hackathon project, register your Soroban smart contract, upload demo videos, and verify your repository before the deadline.
                  </p>
                </div>

                {/* Key Builder Highlights */}
                <ul className="space-y-2.5 pt-2 text-xs sm:text-sm dark:text-slate-300 text-slate-700 font-medium">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>4 tracks: DeFi, AI Consensus, RWAs, and DePIN</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>Live preview of how your card looks to voters</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>Instant registration on Stellar Soroban ledger</span>
                  </li>
                </ul>

              </div>

              {/* Action Button at bottom with rolling text */}
              <div className="pt-8">
                <div className="ctrl-roll-button w-full py-4 px-6 rounded-2xl bg-[#05c92f] hover:bg-[#04b82a] text-slate-950 font-bold text-sm sm:text-base flex items-center justify-between border-2 border-slate-950 shadow-lg group-hover:scale-[1.02] transition-all">
                  <span className="ctrl-roll-label">Submit Hackathon Project</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>


      {/* 3. Three Pillars of Trust (Ctrl.xyz minimal Bento Cards) */}
      <section className="py-16 sm:py-24 border-t dark:border-white/[0.08] border-slate-200">
        <div className="motion-container max-w-5xl mx-auto">
          
          <div className="text-center max-w-xl mx-auto mb-14 space-y-2">
            <h3 className="text-2xl sm:text-4xl font-black dark:text-white text-slate-950">
              Built for Absolute Integrity
            </h3>
            <p className="text-xs sm:text-sm dark:text-slate-400 text-slate-600">
              Powered by Pollar SDK and the Stellar Soroban network.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            
            <div className="ctrl-card p-7 space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-blue-500/15 text-blue-500 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold dark:text-white text-slate-950">
                1 Wallet, 1 Vote
              </h4>
              <p className="text-xs sm:text-sm dark:text-slate-400 text-slate-600 leading-relaxed">
                Sybil protection enforced on-chain. Each authenticated Pollar user receives exactly one ballot allocation.
              </p>
            </div>

            <div className="ctrl-card p-7 space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-sky-500/15 text-sky-500 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold dark:text-white text-slate-950">
                Zero Gas Fees
              </h4>
              <p className="text-xs sm:text-sm dark:text-slate-400 text-slate-600 leading-relaxed">
                Fee-bumped Stellar transactions sponsored by the hackathon foundation. Anyone with a web account can vote.
              </p>
            </div>

            <div className="ctrl-card p-7 space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold dark:text-white text-slate-950">
                Merkle Proof Audit
              </h4>
              <p className="text-xs sm:text-sm dark:text-slate-400 text-slate-600 leading-relaxed">
                Every vote carries a signed SEP-53 cryptographic envelope. Anyone can verify the Merkle root on Stellar.
              </p>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
};
