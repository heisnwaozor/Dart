import React from 'react';
import { 
  Trophy, 
  Flame, 
  Crown, 
  ArrowUpRight, 
  ShieldCheck, 
  Sparkles,
  Medal,
  Award,
  CheckCircle2,
  CheckCircle
} from 'lucide-react';
import { Project, PublicVote, PollarUser } from '../types';

interface LeaderboardProps {
  projects: Project[];
  publicVotes: PublicVote[];
  currentUser?: PollarUser | null;
  userVote?: PublicVote;
  onSelectProject: (project: Project) => void;
  onInitiateVote: (project: Project) => void;
  onCheckMyVote?: () => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
  projects,
  publicVotes,
  currentUser,
  userVote,
  onSelectProject,
  onInitiateVote,
  onCheckMyVote,
}) => {
  const sortedProjects = [...projects].sort((a, b) => (b.publicVotesCount || 0) - (a.publicVotesCount || 0));

  const totalVotesAcrossAll = projects.reduce((acc, p) => acc + (p.publicVotesCount || 0), 0) || 1;
  const top1 = sortedProjects[0];
  const top2 = sortedProjects[1];
  const top3 = sortedProjects[2];

  // MotionSites spotlight mouse tracker
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };

  return (
    <section className="py-20 sm:py-28 lg:py-36 border-b dark:border-white/[0.08] border-slate-200">
      <div className="motion-container">
        
        {/* Title */}
        <div className="mb-16 sm:mb-20 text-center max-w-3xl mx-auto space-y-4 sm:space-y-6">
          <div className="inline-flex items-center space-x-2.5 px-5 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 text-xs font-mono font-bold uppercase tracking-wider shadow-sm">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Real-time Standings</span>
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black dark:text-white text-slate-900 tracking-tight leading-[1.1]">
            Community Choice Leaderboard
          </h2>
          <p className="text-sm sm:text-base md:text-lg dark:text-slate-400 text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Rankings are updated live with every cryptographically signed vote on the Stellar network. Zero gas fees, instant non-repudiation.
          </p>
        </div>

        {/* User Active Vote Banner in Leaderboard */}
        {userVote && (
          <div className="mb-14 p-6 sm:p-8 rounded-[32px] bg-blue-500/10 border border-blue-500/30 flex flex-col sm:flex-row items-center justify-between gap-6 max-w-5xl mx-auto shadow-md">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-500 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-6 h-6 text-blue-500" />
              </div>
              <div className="space-y-1">
                <p className="text-base font-bold dark:text-white text-slate-900">
                  Your Vote is Live: Supporting <span className="text-blue-600 dark:text-blue-400 underline">{userVote.projectName}</span>
                </p>
                <p className="text-xs dark:text-slate-400 text-slate-500">
                  Current Rank: #{sortedProjects.findIndex(p => p.id === userVote.projectId) + 1} with {sortedProjects.find(p => p.id === userVote.projectId)?.publicVotesCount ?? 0} verified votes.
                </p>
              </div>
            </div>
            {onCheckMyVote && (
              <button
                onClick={onCheckMyVote}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all whitespace-nowrap"
              >
                Check My Vote Receipt
              </button>
            )}
          </div>
        )}

      {/* Podium for Top 3 with Generous Margins & MotionSites Spotlight */}
      {sortedProjects.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 items-end mb-20 sm:mb-28 pt-8">
          
          {/* 2nd Place */}
          {top2 && (() => {
            const isUserVoteTop2 = userVote?.projectId === top2.id;
            return (
              <div 
                onMouseMove={handleMouseMove}
                className={`spotlight-card order-2 md:order-1 rounded-[36px] p-8 sm:p-10 dark:bg-[#0E1527] bg-white border flex flex-col items-center text-center relative transition-all shadow-xl hover:shadow-2xl ${
                  isUserVoteTop2 ? 'border-blue-500 ring-2 ring-blue-500/30' : 'dark:border-slate-700/60 border-slate-300'
                }`}
              >
                <div className="absolute -top-6 w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-300 to-white text-slate-900 font-black flex items-center justify-center shadow-lg text-base border-2 border-slate-400">
                  2
                </div>

                {isUserVoteTop2 && (
                  <span className="absolute top-4 right-4 text-xs font-mono px-3 py-1 rounded-full bg-blue-600 text-white font-black flex items-center gap-1 shadow-md animate-pulse">
                    <CheckCircle className="w-3.5 h-3.5" />
                    YOUR VOTE
                  </span>
                )}

                <img
                  src={top2.coverImage}
                  alt={top2.name}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover mb-5 ring-2 ring-slate-400/50 shadow-lg"
                />
                <h3 className="text-lg sm:text-xl font-bold dark:text-white text-slate-900 mb-1">{top2.name}</h3>
                <p className="text-xs dark:text-slate-400 text-slate-500 font-mono mb-5">{top2.teamName}</p>
                
                <div className="w-full py-3 px-4 rounded-2xl dark:bg-white/[0.04] bg-slate-100 text-xs sm:text-sm font-mono font-bold dark:text-slate-200 text-slate-700 mb-6">
                  <span className="flex items-center justify-center gap-2 text-blue-500">
                    <Flame className="w-4 h-4 fill-blue-500" />
                    {top2.publicVotesCount} Verified Votes
                  </span>
                </div>

                <div className="flex items-center space-x-3 w-full">
                  <button
                    onClick={() => onSelectProject(top2)}
                    className="flex-1 py-3 rounded-2xl dark:bg-white/[0.08] bg-slate-100 hover:bg-slate-200 dark:hover:bg-white/[0.14] text-xs font-bold dark:text-slate-200 text-slate-700 transition-colors"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => isUserVoteTop2 && onCheckMyVote ? onCheckMyVote() : onInitiateVote(top2)}
                    className={`flex-1 py-3 rounded-2xl text-xs font-bold transition-colors shadow-md ${
                      isUserVoteTop2
                        ? 'bg-blue-500/20 text-blue-500 border border-blue-500/40 hover:bg-blue-500/30'
                        : 'bg-blue-600 text-white hover:bg-blue-500 shadow-blue-600/20'
                    }`}
                  >
                    {isUserVoteTop2 ? 'Your Pick' : 'Vote'}
                  </button>
                </div>
              </div>
            );
          })()}

          {/* 1st Place (Center, Elevated) */}
          {top1 && (() => {
            const isUserVoteTop1 = userVote?.projectId === top1.id;
            return (
              <div 
                onMouseMove={handleMouseMove}
                className={`spotlight-card order-1 md:order-2 rounded-[36px] p-8 sm:p-11 dark:bg-gradient-to-b dark:from-[#131D38] dark:to-[#0E1527] bg-white border-2 shadow-2xl flex flex-col items-center text-center relative -translate-y-6 transition-all duration-300 ${
                  isUserVoteTop1 ? 'border-blue-400 ring-4 ring-blue-500/30 shadow-blue-500/35' : 'border-blue-500 shadow-blue-500/25'
                }`}
              >
                <div className="absolute -top-8 w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-400 via-yellow-300 to-white text-slate-900 font-black flex items-center justify-center shadow-xl text-xl border-2 border-white animate-float">
                  <Crown className="w-8 h-8 fill-slate-900 text-slate-900" />
                </div>

                <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-500 text-xs font-mono font-bold mb-5 mt-2">
                  <Sparkles className="w-4 h-4" />
                  <span>FIRST PLACE • LEADER</span>
                </div>

                {isUserVoteTop1 && (
                  <span className="absolute top-4 right-4 text-xs font-mono px-3.5 py-1 rounded-full bg-blue-600 text-white font-black flex items-center gap-1 shadow-lg animate-pulse">
                    <CheckCircle className="w-3.5 h-3.5" />
                    YOUR VOTE
                  </span>
                )}

                <img
                  src={top1.coverImage}
                  alt={top1.name}
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover mb-5 ring-4 ring-blue-500/50 shadow-2xl"
                />
                <h3 className="text-2xl sm:text-3xl font-black dark:text-white text-slate-900 mb-1">{top1.name}</h3>
                <p className="text-xs sm:text-sm dark:text-slate-300 text-slate-600 font-mono mb-6">{top1.teamName}</p>
                
                <div className="w-full py-3.5 px-5 rounded-2xl bg-blue-500/15 border border-blue-500/30 text-sm sm:text-base font-mono font-black text-blue-600 dark:text-blue-400 mb-7 shadow-inner">
                  <span className="flex items-center justify-center gap-2">
                    <Flame className="w-5 h-5 fill-current animate-bounce" />
                    {top1.publicVotesCount} Verified Votes ({Math.round((top1.publicVotesCount / totalVotesAcrossAll) * 100)}%)
                  </span>
                </div>

                <div className="flex items-center space-x-3.5 w-full">
                  <button
                    onClick={() => onSelectProject(top1)}
                    className="flex-1 py-3.5 rounded-2xl dark:bg-white/[0.1] bg-slate-100 dark:text-white text-slate-800 hover:bg-slate-200 dark:hover:bg-white/[0.16] text-xs sm:text-sm font-bold transition-colors"
                  >
                    View Pitch
                  </button>
                  <button
                    onClick={() => isUserVoteTop1 && onCheckMyVote ? onCheckMyVote() : onInitiateVote(top1)}
                    className={`shimmer-sweep flex-1 py-3.5 rounded-2xl text-xs sm:text-sm font-extrabold shadow-xl transition-all ${
                      isUserVoteTop1
                        ? 'bg-blue-500/20 text-blue-500 border border-blue-500/40 hover:bg-blue-500/30'
                        : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/35'
                    }`}
                  >
                    {isUserVoteTop1 ? 'Your Pick (#1)' : 'Vote for #1'}
                  </button>
                </div>
              </div>
            );
          })()}

          {/* 3rd Place */}
          {top3 && (() => {
            const isUserVoteTop3 = userVote?.projectId === top3.id;
            return (
              <div 
                onMouseMove={handleMouseMove}
                className={`spotlight-card order-3 md:order-3 rounded-[36px] p-8 sm:p-10 dark:bg-[#0E1527] bg-white border flex flex-col items-center text-center relative transition-all shadow-xl hover:shadow-2xl ${
                  isUserVoteTop3 ? 'border-blue-500 ring-2 ring-blue-500/30' : 'dark:border-amber-900/40 border-amber-200'
                }`}
              >
                <div className="absolute -top-6 w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 text-white font-black flex items-center justify-center shadow-lg text-base border-2 border-white">
                  3
                </div>

                {isUserVoteTop3 && (
                  <span className="absolute top-4 right-4 text-xs font-mono px-3 py-1 rounded-full bg-blue-600 text-white font-black flex items-center gap-1 shadow-md animate-pulse">
                    <CheckCircle className="w-3.5 h-3.5" />
                    YOUR VOTE
                  </span>
                )}

                <img
                  src={top3.coverImage}
                  alt={top3.name}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover mb-5 ring-2 ring-amber-600/50 shadow-lg"
                />
                <h3 className="text-lg sm:text-xl font-bold dark:text-white text-slate-900 mb-1">{top3.name}</h3>
                <p className="text-xs dark:text-slate-400 text-slate-500 font-mono mb-5">{top3.teamName}</p>
                
                <div className="w-full py-3 px-4 rounded-2xl dark:bg-white/[0.04] bg-slate-100 text-xs sm:text-sm font-mono font-bold dark:text-slate-200 text-slate-700 mb-6">
                  <span className="flex items-center justify-center gap-2 text-amber-500">
                    <Flame className="w-4 h-4 fill-amber-500" />
                    {top3.publicVotesCount} Verified Votes
                  </span>
                </div>

                <div className="flex items-center space-x-3 w-full">
                  <button
                    onClick={() => onSelectProject(top3)}
                    className="flex-1 py-3 rounded-2xl dark:bg-white/[0.08] bg-slate-100 hover:bg-slate-200 dark:hover:bg-white/[0.14] text-xs font-bold dark:text-slate-200 text-slate-700 transition-colors"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => isUserVoteTop3 && onCheckMyVote ? onCheckMyVote() : onInitiateVote(top3)}
                    className={`flex-1 py-3 rounded-2xl text-xs font-bold transition-colors shadow-md ${
                      isUserVoteTop3
                        ? 'bg-blue-500/20 text-blue-500 border border-blue-500/40 hover:bg-blue-500/30'
                        : 'bg-amber-600 text-white hover:bg-amber-500 shadow-amber-600/20'
                    }`}
                  >
                    {isUserVoteTop3 ? 'Your Pick' : 'Vote'}
                  </button>
                </div>
              </div>
            );
          })()}

        </div>
      )}

      {/* Full Leaderboard Table with Generous Padding */}
      <div className="rounded-[36px] dark:bg-[#0E1527] bg-white border dark:border-white/[0.08] border-slate-200 overflow-hidden shadow-2xl">
        <div className="p-6 sm:p-8 border-b dark:border-white/[0.08] border-slate-200 flex items-center justify-between">
          <h4 className="text-sm sm:text-base font-bold dark:text-white text-slate-900 uppercase tracking-wider font-mono">
            All Projects & Vote Distribution
          </h4>
          <span className="text-xs sm:text-sm text-blue-500 font-mono font-bold">
            {sortedProjects.length} Projects Total
          </span>
        </div>

        <div className="divide-y dark:divide-white/[0.06] divide-slate-100">
          {sortedProjects.map((project, index) => {
            const votePercent = Math.min(100, Math.round(((project.publicVotesCount || 0) / totalVotesAcrossAll) * 100));
            const isVoted = userVote?.projectId === project.id;

            return (
              <div
                key={project.id}
                className={`p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-colors ${
                  isVoted
                    ? 'dark:bg-blue-950/30 bg-blue-50/80 border-l-4 border-l-blue-500'
                    : 'dark:hover:bg-white/[0.02] hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center space-x-5">
                  <span className={`w-10 font-mono text-center font-extrabold text-base ${
                    index === 0 ? 'text-blue-500' : index === 1 ? 'text-slate-400' : index === 2 ? 'text-amber-500' : 'dark:text-slate-500 text-slate-400'
                  }`}>
                    #{index + 1}
                  </span>

                  <img
                    src={project.coverImage}
                    alt={project.name}
                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover cursor-pointer hover:scale-105 transition-transform shadow-md ${
                      isVoted ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => onSelectProject(project)}
                  />

                  <div>
                    <div className="flex items-center gap-2.5">
                      <h5 
                        onClick={() => onSelectProject(project)}
                        className="text-base sm:text-lg font-bold dark:text-white text-slate-900 hover:text-blue-500 cursor-pointer flex items-center gap-2"
                      >
                        {project.name}
                        <ArrowUpRight className="w-4 h-4 text-slate-400" />
                      </h5>
                      {isVoted && (
                        <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-blue-600 text-white font-black flex items-center gap-1 shadow-sm">
                          <CheckCircle className="w-3.5 h-3.5" />
                          YOUR VOTE
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm dark:text-slate-400 text-slate-500 font-mono mt-1">
                      {project.teamName} • {project.tags.slice(0, 2).join(', ')}
                    </p>
                  </div>
                </div>

                {/* Score / Progress Bar */}
                <div className="flex items-center space-x-6 sm:w-96">
                  <div className="flex-1">
                    <div className="flex justify-between text-xs sm:text-sm font-mono mb-2">
                      <span className="dark:text-slate-400 text-slate-500">{project.publicVotesCount} votes</span>
                      <span className="text-blue-500 font-bold">{votePercent}%</span>
                    </div>

                    <div className="w-full h-3 rounded-full dark:bg-white/[0.06] bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-blue-600 via-sky-400 to-indigo-500"
                        style={{ width: `${Math.max(votePercent, 5)}%` }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => isVoted && onCheckMyVote ? onCheckMyVote() : onInitiateVote(project)}
                    className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-mono font-bold transition-all shadow-md active:scale-95 whitespace-nowrap ${
                      isVoted
                        ? 'bg-blue-500/20 text-blue-500 border border-blue-500/40 hover:bg-blue-500/30'
                        : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/25'
                    }`}
                  >
                    {isVoted ? 'Your Pick' : 'Vote'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      </div>
    </section>
  );
};
