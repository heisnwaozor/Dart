import React from 'react';
import { 
  Trophy, 
  Flame, 
  Crown, 
  ArrowUpRight, 
  ShieldCheck, 
  Sparkles,
  Medal,
  Award
} from 'lucide-react';
import { Project, PublicVote } from '../types';

interface LeaderboardProps {
  projects: Project[];
  publicVotes: PublicVote[];
  onSelectProject: (project: Project) => void;
  onInitiateVote: (project: Project) => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
  projects,
  publicVotes,
  onSelectProject,
  onInitiateVote,
}) => {
  const sortedProjects = [...projects].sort((a, b) => (b.publicVotesCount || 0) - (a.publicVotesCount || 0));

  const totalVotesAcrossAll = projects.reduce((acc, p) => acc + (p.publicVotesCount || 0), 0) || 1;
  const top1 = sortedProjects[0];
  const top2 = sortedProjects[1];
  const top3 = sortedProjects[2];

  return (
    <section className="py-10 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Title */}
      <div className="mb-12 text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 text-xs font-mono font-bold uppercase tracking-wider">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>Real-time Standings</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black dark:text-white text-slate-900 tracking-tight">
          Community Choice Leaderboard
        </h2>
        <p className="text-xs sm:text-sm dark:text-slate-400 text-slate-600">
          Rankings are updated live with every cryptographically signed vote on the Stellar network.
        </p>
      </div>

      {/* Podium for Top 3 */}
      {sortedProjects.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-end mb-16 pt-8">
          
          {/* 2nd Place */}
          {top2 && (
            <div className="order-2 md:order-1 rounded-3xl p-6 sm:p-7 dark:bg-[#0E1527] bg-white border dark:border-slate-700/60 border-slate-300 flex flex-col items-center text-center relative hover:scale-[1.02] transition-all shadow-xl hover:shadow-2xl">
              <div className="absolute -top-5 w-11 h-11 rounded-2xl bg-gradient-to-tr from-slate-300 to-white text-slate-900 font-black flex items-center justify-center shadow-lg text-sm border-2 border-slate-400">
                2
              </div>
              <img
                src={top2.coverImage}
                alt={top2.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover mb-4 ring-2 ring-slate-400/50 shadow-md"
              />
              <h3 className="text-base sm:text-lg font-bold dark:text-white text-slate-900">{top2.name}</h3>
              <p className="text-xs dark:text-slate-400 text-slate-500 font-mono mb-4">{top2.teamName}</p>
              
              <div className="w-full py-2.5 px-3 rounded-2xl dark:bg-white/[0.04] bg-slate-100 text-xs font-mono font-bold dark:text-slate-200 text-slate-700 mb-5">
                <span className="flex items-center justify-center gap-1.5 text-blue-500">
                  <Flame className="w-4 h-4 fill-blue-500" />
                  {top2.publicVotesCount} Verified Votes
                </span>
              </div>

              <div className="flex items-center space-x-2.5 w-full">
                <button
                  onClick={() => onSelectProject(top2)}
                  className="flex-1 py-2.5 rounded-xl dark:bg-white/[0.08] bg-slate-100 hover:bg-slate-200 dark:hover:bg-white/[0.14] text-xs font-bold dark:text-slate-200 text-slate-700 transition-colors"
                >
                  View Details
                </button>
                <button
                  onClick={() => onInitiateVote(top2)}
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 transition-colors shadow-md shadow-blue-600/20"
                >
                  Vote
                </button>
              </div>
            </div>
          )}

          {/* 1st Place (Center, Elevated) */}
          {top1 && (
            <div className="order-1 md:order-2 rounded-3xl p-7 sm:p-9 dark:bg-gradient-to-b dark:from-[#131D38] dark:to-[#0E1527] bg-white border-2 border-blue-500 shadow-2xl shadow-blue-500/20 flex flex-col items-center text-center relative -translate-y-4 hover:scale-[1.02] transition-all duration-300">
              <div className="absolute -top-7 w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 via-yellow-300 to-white text-slate-900 font-black flex items-center justify-center shadow-xl text-lg border-2 border-white animate-float">
                <Crown className="w-7 h-7 fill-slate-900 text-slate-900" />
              </div>

              <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-500 text-[11px] font-mono font-bold mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                <span>FIRST PLACE • LEADER</span>
              </div>

              <img
                src={top1.coverImage}
                alt={top1.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover mb-4 ring-4 ring-blue-500/50 shadow-2xl"
              />
              <h3 className="text-xl sm:text-2xl font-black dark:text-white text-slate-900 mb-1">{top1.name}</h3>
              <p className="text-xs dark:text-slate-300 text-slate-600 font-mono mb-5">{top1.teamName}</p>
              
              <div className="w-full py-3 px-4 rounded-2xl bg-blue-500/15 border border-blue-500/30 text-sm font-mono font-black text-blue-600 dark:text-blue-400 mb-6 shadow-inner">
                <span className="flex items-center justify-center gap-2">
                  <Flame className="w-5 h-5 fill-current animate-bounce" />
                  {top1.publicVotesCount} Verified Votes ({Math.round((top1.publicVotesCount / totalVotesAcrossAll) * 100)}%)
                </span>
              </div>

              <div className="flex items-center space-x-3 w-full">
                <button
                  onClick={() => onSelectProject(top1)}
                  className="flex-1 py-3 rounded-2xl dark:bg-white/[0.1] bg-slate-100 dark:text-white text-slate-800 hover:bg-slate-200 dark:hover:bg-white/[0.16] text-xs sm:text-sm font-bold transition-colors"
                >
                  View Pitch
                </button>
                <button
                  onClick={() => onInitiateVote(top1)}
                  className="shimmer-sweep flex-1 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-extrabold shadow-lg shadow-blue-600/35 transition-all"
                >
                  Vote for #1
                </button>
              </div>
            </div>
          )}

          {/* 3rd Place */}
          {top3 && (
            <div className="order-3 md:order-3 rounded-3xl p-6 sm:p-7 dark:bg-[#0E1527] bg-white border dark:border-amber-900/40 border-amber-200 flex flex-col items-center text-center relative hover:scale-[1.02] transition-all shadow-xl hover:shadow-2xl">
              <div className="absolute -top-5 w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 text-white font-black flex items-center justify-center shadow-lg text-sm border-2 border-white">
                3
              </div>
              <img
                src={top3.coverImage}
                alt={top3.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover mb-4 ring-2 ring-amber-600/50 shadow-md"
              />
              <h3 className="text-base sm:text-lg font-bold dark:text-white text-slate-900">{top3.name}</h3>
              <p className="text-xs dark:text-slate-400 text-slate-500 font-mono mb-4">{top3.teamName}</p>
              
              <div className="w-full py-2.5 px-3 rounded-2xl dark:bg-white/[0.04] bg-slate-100 text-xs font-mono font-bold dark:text-slate-200 text-slate-700 mb-5">
                <span className="flex items-center justify-center gap-1.5 text-amber-500">
                  <Flame className="w-4 h-4 fill-amber-500" />
                  {top3.publicVotesCount} Verified Votes
                </span>
              </div>

              <div className="flex items-center space-x-2.5 w-full">
                <button
                  onClick={() => onSelectProject(top3)}
                  className="flex-1 py-2.5 rounded-xl dark:bg-white/[0.08] bg-slate-100 hover:bg-slate-200 dark:hover:bg-white/[0.14] text-xs font-bold dark:text-slate-200 text-slate-700 transition-colors"
                >
                  View Details
                </button>
                <button
                  onClick={() => onInitiateVote(top3)}
                  className="flex-1 py-2.5 rounded-xl bg-amber-600 text-white text-xs font-bold hover:bg-amber-500 transition-colors shadow-md shadow-amber-600/20"
                >
                  Vote
                </button>
              </div>
            </div>
          )}

        </div>
      )}

      {/* Full Leaderboard Table */}
      <div className="rounded-3xl dark:bg-[#0E1527] bg-white border dark:border-white/[0.08] border-slate-200 overflow-hidden shadow-2xl">
        <div className="p-5 sm:p-6 border-b dark:border-white/[0.08] border-slate-200 flex items-center justify-between">
          <h4 className="text-xs sm:text-sm font-bold dark:text-white text-slate-900 uppercase tracking-wider font-mono">
            All Projects & Vote Distribution
          </h4>
          <span className="text-xs text-blue-500 font-mono font-bold">
            {sortedProjects.length} Projects Total
          </span>
        </div>

        <div className="divide-y dark:divide-white/[0.06] divide-slate-100">
          {sortedProjects.map((project, index) => {
            const votePercent = Math.min(100, Math.round(((project.publicVotesCount || 0) / totalVotesAcrossAll) * 100));

            return (
              <div
                key={project.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 dark:hover:bg-white/[0.02] hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <span className={`w-8 font-mono text-center font-extrabold text-sm ${
                    index === 0 ? 'text-blue-500' : index === 1 ? 'text-slate-400' : index === 2 ? 'text-amber-500' : 'dark:text-slate-500 text-slate-400'
                  }`}>
                    #{index + 1}
                  </span>

                  <img
                    src={project.coverImage}
                    alt={project.name}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl object-cover cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => onSelectProject(project)}
                  />

                  <div>
                    <h5 
                      onClick={() => onSelectProject(project)}
                      className="text-sm sm:text-base font-bold dark:text-white text-slate-900 hover:text-blue-500 cursor-pointer flex items-center gap-1.5"
                    >
                      {project.name}
                      <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                    </h5>
                    <p className="text-xs dark:text-slate-400 text-slate-500 font-mono">
                      {project.teamName} • {project.tags.slice(0, 2).join(', ')}
                    </p>
                  </div>
                </div>

                {/* Score / Progress Bar */}
                <div className="flex items-center space-x-6 sm:w-80">
                  <div className="flex-1">
                    <div className="flex justify-between text-xs font-mono mb-1.5">
                      <span className="dark:text-slate-400 text-slate-500">{project.publicVotesCount} votes</span>
                      <span className="text-blue-500 font-bold">{votePercent}%</span>
                    </div>

                    <div className="w-full h-2.5 rounded-full dark:bg-white/[0.06] bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-blue-600 via-sky-400 to-indigo-500"
                        style={{ width: `${Math.max(votePercent, 5)}%` }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => onInitiateVote(project)}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-bold transition-all shadow-md shadow-blue-600/20 active:scale-95"
                  >
                    Vote
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
};
