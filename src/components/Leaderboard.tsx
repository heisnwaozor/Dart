import React from 'react';
import { 
  Trophy, 
  Flame, 
  Crown, 
  ArrowUpRight, 
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
    <section className="py-10 sm:py-14 lg:py-16 border-b dark:border-white/[0.08] border-slate-200">
      <div className="motion-container">
        
        {/* Title Header: Clean and balanced for all viewports */}
        <div className="mb-8 sm:mb-10 text-center max-w-2xl mx-auto space-y-2.5">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 text-xs font-mono font-bold uppercase tracking-wider shadow-sm">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Real-time Standings</span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black dark:text-white text-slate-900 tracking-tight leading-tight">
            Community Choice Leaderboard
          </h2>
          <p className="text-xs sm:text-sm md:text-base dark:text-slate-400 text-slate-600 leading-relaxed max-w-xl mx-auto">
            Rankings update live with every cryptographically signed vote on Stellar. Zero gas fees, instant non-repudiation.
          </p>
        </div>

        {/* User Active Vote Banner in Leaderboard */}
        {userVote && (
          <div className="mb-8 sm:mb-10 p-4 sm:p-5 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto shadow-sm">
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-500 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-5 h-5 text-blue-500" />
              </div>
              <div className="space-y-0.5">
                <p className="text-sm font-bold dark:text-white text-slate-900">
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
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all whitespace-nowrap"
              >
                Check My Vote Receipt
              </button>
            )}
          </div>
        )}

        {/* Podium for Top 3: Fitted gracefully on the card face */}
        {sortedProjects.length >= 3 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-7 items-stretch mb-12 sm:mb-16">
            
            {/* 2nd Place Card */}
            {top2 && (() => {
              const isUserVoteTop2 = userVote?.projectId === top2.id;
              const votePercent = Math.round(((top2.publicVotesCount || 0) / totalVotesAcrossAll) * 100);
              return (
                <div 
                  onMouseMove={handleMouseMove}
                  className={`spotlight-card order-2 lg:order-1 rounded-3xl p-6 sm:p-7 dark:bg-[#0E1527] bg-white border flex flex-col items-center text-center justify-between transition-all shadow-lg hover:shadow-xl ${
                    isUserVoteTop2 ? 'border-blue-500 ring-2 ring-blue-500/30' : 'dark:border-slate-700/60 border-slate-300'
                  }`}
                >
                  {/* Card Header: 2nd Place Tag and 2nd Rank Badge */}
                  <div className="flex items-center justify-between w-full mb-5">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-400/15 border border-slate-400/30 text-slate-700 dark:text-slate-300 font-mono font-bold text-xs uppercase tracking-wider">
                      <Medal className="w-3.5 h-3.5 text-slate-400" />
                      <span>2nd Place</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {isUserVoteTop2 && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-600 text-white font-bold flex items-center gap-1 shadow-sm">
                          <CheckCircle className="w-3 h-3" />
                          YOUR VOTE
                        </span>
                      )}
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-slate-200 via-slate-300 to-white text-slate-900 font-black flex items-center justify-center text-xs shadow-md border border-slate-300">
                        2nd
                      </div>
                    </div>
                  </div>

                  {/* Project Image & Identity */}
                  <div className="flex flex-col items-center w-full mb-4">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden mb-3 ring-2 ring-slate-400/40 shadow-md flex-shrink-0 bg-slate-800">
                      <img
                        src={top2.coverImage}
                        alt={top2.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=600&q=80';
                        }}
                      />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold dark:text-white text-slate-900 mb-0.5 truncate max-w-full">
                      {top2.name}
                    </h3>
                    <p className="text-xs dark:text-slate-400 text-slate-500 font-mono truncate max-w-full">
                      {top2.teamName}
                    </p>
                  </div>
                  
                  {/* Verified Votes Pill */}
                  <div className="w-full py-2.5 px-3.5 rounded-xl dark:bg-white/[0.04] bg-slate-100 text-xs font-mono font-bold dark:text-slate-200 text-slate-700 mb-5">
                    <span className="flex items-center justify-center gap-1.5 text-blue-500">
                      <Flame className="w-3.5 h-3.5 fill-blue-500" />
                      {top2.publicVotesCount} Verified Votes ({votePercent}%)
                    </span>
                  </div>

                  {/* Action Buttons: 2-column grid that never overflows */}
                  <div className="grid grid-cols-2 gap-2.5 w-full mt-auto">
                    <button
                      onClick={() => onSelectProject(top2)}
                      className="w-full py-2.5 px-2 rounded-xl dark:bg-white/[0.08] bg-slate-100 hover:bg-slate-200 dark:hover:bg-white/[0.14] text-xs font-bold dark:text-slate-200 text-slate-700 transition-colors truncate"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => isUserVoteTop2 && onCheckMyVote ? onCheckMyVote() : onInitiateVote(top2)}
                      className={`w-full py-2.5 px-2 rounded-xl text-xs font-bold transition-all shadow-md truncate ${
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

            {/* 1st Place Card (Elevated Leader) */}
            {top1 && (() => {
              const isUserVoteTop1 = userVote?.projectId === top1.id;
              const votePercent = Math.round(((top1.publicVotesCount || 0) / totalVotesAcrossAll) * 100);
              return (
                <div 
                  onMouseMove={handleMouseMove}
                  className={`spotlight-card order-1 lg:order-2 rounded-3xl p-6 sm:p-7 dark:bg-gradient-to-b dark:from-[#131D38] dark:to-[#0E1527] bg-white border-2 shadow-xl flex flex-col items-center text-center justify-between transition-all ${
                    isUserVoteTop1 ? 'border-blue-400 ring-2 ring-blue-500/40' : 'border-blue-500 ring-1 ring-blue-500/30'
                  }`}
                >
                  {/* Card Header: 1st Place Tag and 1st Rank Badge */}
                  <div className="flex items-center justify-between w-full mb-5">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 font-mono font-bold text-xs uppercase tracking-wider">
                      <Crown className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>1st Place • Leader</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {isUserVoteTop1 && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-600 text-white font-bold flex items-center gap-1 shadow-sm">
                          <CheckCircle className="w-3 h-3" />
                          YOUR VOTE
                        </span>
                      )}
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-200 text-slate-950 font-black flex items-center justify-center text-xs shadow-md border border-white">
                        1st
                      </div>
                    </div>
                  </div>

                  {/* Project Image & Identity */}
                  <div className="flex flex-col items-center w-full mb-4">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden mb-3 ring-2 ring-blue-500/60 shadow-lg flex-shrink-0 bg-slate-800">
                      <img
                        src={top1.coverImage}
                        alt={top1.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?auto=format&fit=crop&w=600&q=80';
                        }}
                      />
                    </div>
                    <h3 className="text-lg sm:text-xl font-black dark:text-white text-slate-900 mb-0.5 truncate max-w-full">
                      {top1.name}
                    </h3>
                    <p className="text-xs dark:text-slate-300 text-slate-600 font-mono truncate max-w-full">
                      {top1.teamName}
                    </p>
                  </div>
                  
                  {/* Verified Votes Pill */}
                  <div className="w-full py-2.5 px-3.5 rounded-xl bg-blue-500/15 border border-blue-500/30 text-xs sm:text-sm font-mono font-black text-blue-600 dark:text-blue-400 mb-5 shadow-inner">
                    <span className="flex items-center justify-center gap-1.5">
                      <Flame className="w-4 h-4 fill-current text-blue-500" />
                      {top1.publicVotesCount} Verified Votes ({votePercent}%)
                    </span>
                  </div>

                  {/* Action Buttons: 2-column grid that never overflows */}
                  <div className="grid grid-cols-2 gap-2.5 w-full mt-auto">
                    <button
                      onClick={() => onSelectProject(top1)}
                      className="w-full py-2.5 px-2 rounded-xl dark:bg-white/[0.1] bg-slate-100 hover:bg-slate-200 dark:hover:bg-white/[0.16] text-xs font-bold dark:text-white text-slate-800 transition-colors truncate"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => isUserVoteTop1 && onCheckMyVote ? onCheckMyVote() : onInitiateVote(top1)}
                      className={`w-full py-2.5 px-2 rounded-xl text-xs font-bold transition-all shadow-md truncate ${
                        isUserVoteTop1
                          ? 'bg-blue-500/20 text-blue-500 border border-blue-500/40 hover:bg-blue-500/30'
                          : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30'
                      }`}
                    >
                      {isUserVoteTop1 ? 'Your Pick' : 'Vote for #1'}
                    </button>
                  </div>
                </div>
              );
            })()}

            {/* 3rd Place Card */}
            {top3 && (() => {
              const isUserVoteTop3 = userVote?.projectId === top3.id;
              const votePercent = Math.round(((top3.publicVotesCount || 0) / totalVotesAcrossAll) * 100);
              return (
                <div 
                  onMouseMove={handleMouseMove}
                  className={`spotlight-card order-3 lg:order-3 rounded-3xl p-6 sm:p-7 dark:bg-[#0E1527] bg-white border flex flex-col items-center text-center justify-between transition-all shadow-lg hover:shadow-xl ${
                    isUserVoteTop3 ? 'border-blue-500 ring-2 ring-blue-500/30' : 'dark:border-amber-900/40 border-amber-200'
                  }`}
                >
                  {/* Card Header: 3rd Place Tag and 3rd Rank Badge */}
                  <div className="flex items-center justify-between w-full mb-5">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-700/15 border border-amber-700/30 text-amber-700 dark:text-amber-400 font-mono font-bold text-xs uppercase tracking-wider">
                      <Award className="w-3.5 h-3.5 text-amber-600" />
                      <span>3rd Place</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {isUserVoteTop3 && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-600 text-white font-bold flex items-center gap-1 shadow-sm">
                          <CheckCircle className="w-3 h-3" />
                          YOUR VOTE
                        </span>
                      )}
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-700 via-amber-600 to-amber-500 text-white font-black flex items-center justify-center text-xs shadow-md border border-amber-500">
                        3rd
                      </div>
                    </div>
                  </div>

                  {/* Project Image & Identity */}
                  <div className="flex flex-col items-center w-full mb-4">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden mb-3 ring-2 ring-amber-600/40 shadow-md flex-shrink-0 bg-slate-800">
                      <img
                        src={top3.coverImage}
                        alt={top3.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80';
                        }}
                      />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold dark:text-white text-slate-900 mb-0.5 truncate max-w-full">
                      {top3.name}
                    </h3>
                    <p className="text-xs dark:text-slate-400 text-slate-500 font-mono truncate max-w-full">
                      {top3.teamName}
                    </p>
                  </div>
                  
                  {/* Verified Votes Pill */}
                  <div className="w-full py-2.5 px-3.5 rounded-xl dark:bg-white/[0.04] bg-slate-100 text-xs font-mono font-bold dark:text-slate-200 text-slate-700 mb-5">
                    <span className="flex items-center justify-center gap-1.5 text-amber-500">
                      <Flame className="w-3.5 h-3.5 fill-amber-500" />
                      {top3.publicVotesCount} Verified Votes ({votePercent}%)
                    </span>
                  </div>

                  {/* Action Buttons: 2-column grid that never overflows */}
                  <div className="grid grid-cols-2 gap-2.5 w-full mt-auto">
                    <button
                      onClick={() => onSelectProject(top3)}
                      className="w-full py-2.5 px-2 rounded-xl dark:bg-white/[0.08] bg-slate-100 hover:bg-slate-200 dark:hover:bg-white/[0.14] text-xs font-bold dark:text-slate-200 text-slate-700 transition-colors truncate"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => isUserVoteTop3 && onCheckMyVote ? onCheckMyVote() : onInitiateVote(top3)}
                      className={`w-full py-2.5 px-2 rounded-xl text-xs font-bold transition-all shadow-md truncate ${
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

        {/* Full Leaderboard Table */}
        <div className="rounded-3xl dark:bg-[#0E1527] bg-white border dark:border-white/[0.08] border-slate-200 overflow-hidden shadow-xl">
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
              const isVoted = userVote?.projectId === project.id;

              return (
                <div
                  key={project.id}
                  className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                    isVoted
                      ? 'dark:bg-blue-950/30 bg-blue-50/80 border-l-4 border-l-blue-500'
                      : 'dark:hover:bg-white/[0.02] hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-3.5">
                    {/* Rank Indicator */}
                    <div className="w-10 flex items-center justify-center">
                      {index === 0 ? (
                        <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-lg bg-amber-500/15 text-amber-500 font-mono font-black text-xs">
                          1st
                        </span>
                      ) : index === 1 ? (
                        <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-lg bg-slate-400/15 text-slate-400 font-mono font-black text-xs">
                          2nd
                        </span>
                      ) : index === 2 ? (
                        <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-lg bg-amber-700/15 text-amber-600 font-mono font-black text-xs">
                          3rd
                        </span>
                      ) : (
                        <span className="font-mono font-bold text-xs dark:text-slate-500 text-slate-400">
                          #{index + 1}
                        </span>
                      )}
                    </div>

                    <img
                      src={project.coverImage}
                      alt={project.name}
                      className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl object-cover cursor-pointer hover:scale-105 transition-transform shadow-sm ${
                        isVoted ? 'ring-2 ring-blue-500' : ''
                      }`}
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=600&q=80';
                      }}
                      onClick={() => onSelectProject(project)}
                    />

                    <div>
                      <div className="flex items-center gap-2">
                        <h5 
                          onClick={() => onSelectProject(project)}
                          className="text-sm sm:text-base font-bold dark:text-white text-slate-900 hover:text-blue-500 cursor-pointer flex items-center gap-1.5"
                        >
                          {project.name}
                          <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                        </h5>
                        {isVoted && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-600 text-white font-black flex items-center gap-1 shadow-sm">
                            <CheckCircle className="w-3 h-3" />
                            YOUR VOTE
                          </span>
                        )}
                      </div>
                      <p className="text-xs dark:text-slate-400 text-slate-500 font-mono mt-0.5">
                        {project.teamName} • {project.tags.slice(0, 2).join(', ')}
                      </p>
                    </div>
                  </div>

                  {/* Score / Progress Bar */}
                  <div className="flex items-center space-x-4 sm:w-80">
                    <div className="flex-1">
                      <div className="flex justify-between text-xs font-mono mb-1">
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
                      onClick={() => isVoted && onCheckMyVote ? onCheckMyVote() : onInitiateVote(project)}
                      className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all shadow-md active:scale-95 whitespace-nowrap ${
                        isVoted
                          ? 'bg-blue-500/20 text-blue-500 border border-blue-500/40 hover:bg-blue-500/30'
                          : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20'
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
