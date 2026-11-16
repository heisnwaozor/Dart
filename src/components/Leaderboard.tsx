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
        
        {/* Title Header: Clean and balanced Ctrl aesthetic */}
        <div className="mb-12 sm:mb-16 text-center max-w-3xl mx-auto space-y-4 sm:space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ecefec] dark:bg-white/[0.08] text-xs sm:text-sm font-semibold dark:text-slate-200 text-slate-700 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#05c92f] animate-pulse"></span>
            <span>Real-time Standings</span>
          </div>

          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black dark:text-white text-slate-950 tracking-[-0.03em] leading-[0.98]">
            Rankings <span className="inline-block text-blue-600 dark:text-blue-500 transform hover:rotate-12 transition-transform duration-300">❖</span> Standings.
          </h2>

          <p className="text-sm sm:text-base md:text-lg dark:text-slate-400 text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Decentralized community voting for all Pollar Pitch Projects. Rankings update live with every cryptographically signed vote on Stellar. Zero gas fees, instant non-repudiation.
          </p>
        </div>

        {/* User Active Vote Banner in Leaderboard */}
        {userVote && (
          <div className="mb-10 sm:mb-12 p-4 sm:p-7 rounded-2xl sm:rounded-[32px] ctrl-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 max-w-4xl mx-auto shadow-md">
            <div className="flex items-center space-x-3.5 sm:space-x-4">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#05c92f]/20 border-2 border-[#05c92f] text-slate-950 dark:text-white flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-[#05c92f]" />
              </div>
              <div className="space-y-1">
                <p className="text-sm sm:text-base font-black dark:text-white text-slate-950">
                  Your Vote is Live: Supporting <span className="text-blue-600 dark:text-blue-400 underline">{userVote.projectName}</span>
                </p>
                <p className="text-xs dark:text-slate-400 text-slate-600">
                  Current Rank: #{sortedProjects.findIndex(p => p.id === userVote.projectId) + 1} with {sortedProjects.find(p => p.id === userVote.projectId)?.publicVotesCount ?? 0} verified votes.
                </p>
              </div>
            </div>
            {onCheckMyVote && (
              <button
                onClick={onCheckMyVote}
                className="ctrl-roll-button w-full sm:w-auto px-6 py-3 rounded-full bg-[#ecefec] dark:bg-white/[0.08] hover:bg-slate-200 dark:hover:bg-white/[0.14] text-slate-950 dark:text-white font-bold text-xs sm:text-sm border-2 border-slate-950 dark:border-white/20 shadow-md transition-all whitespace-nowrap"
              >
                <span className="ctrl-roll-label">Check My Vote Receipt</span>
              </button>
            )}
          </div>
        )}

        {/* Podium for Top 3: Fitted gracefully on the card face with Ctrl.xyz aesthetic */}
        {sortedProjects.length >= 3 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-7 items-stretch mb-12 sm:mb-16">
            
            {/* 2nd Place Card */}
            {top2 && (() => {
              const isUserVoteTop2 = userVote?.projectId === top2.id;
              const votePercent = Math.round(((top2.publicVotesCount || 0) / totalVotesAcrossAll) * 100);
              return (
                <div 
                  onMouseMove={handleMouseMove}
                  className={`ctrl-card order-2 lg:order-1 p-6 sm:p-7 flex flex-col items-center text-center justify-between ${
                    isUserVoteTop2 ? '!border-blue-500 ring-2 ring-blue-500/30' : ''
                  }`}
                >
                  {/* Card Header: 2nd Place Tag and 2nd Rank Badge */}
                  <div className="flex items-center justify-between w-full mb-5">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ecefec] dark:bg-white/[0.08] border border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-300 font-mono font-bold text-xs uppercase tracking-wider">
                      <Medal className="w-3.5 h-3.5 text-slate-400" />
                      <span>2nd Place</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {isUserVoteTop2 && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-600 text-white font-bold flex items-center gap-1 shadow-sm whitespace-nowrap flex-shrink-0">
                          <CheckCircle className="w-3 h-3" />
                          YOUR VOTE
                        </span>
                      )}
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-slate-200 via-slate-300 to-white text-slate-900 font-black flex items-center justify-center text-xs shadow-md border-2 border-slate-950 flex-shrink-0">
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
                    <h3 className="text-base sm:text-lg font-black dark:text-white text-slate-950 mb-0.5 truncate max-w-full">
                      {top2.name}
                    </h3>
                    <p className="text-xs dark:text-slate-400 text-slate-600 font-mono truncate max-w-full">
                      {top2.teamName}
                    </p>
                  </div>
                  
                  {/* Verified Votes Pill */}
                  <div className="w-full py-2.5 px-3.5 rounded-full bg-[#ecefec] dark:bg-white/[0.04] text-xs font-mono font-bold dark:text-slate-200 text-slate-700 mb-5 border border-slate-300 dark:border-white/10">
                    <span className="flex items-center justify-center gap-1.5 text-blue-600 dark:text-blue-400">
                      <Flame className="w-3.5 h-3.5 fill-blue-500 text-blue-500" />
                      {top2.publicVotesCount} Verified Votes ({votePercent}%)
                    </span>
                  </div>

                  {/* Action Buttons: 2-column grid that never overflows */}
                  <div className="grid grid-cols-2 gap-2.5 w-full mt-auto">
                    <button
                      onClick={() => onSelectProject(top2)}
                      className="ctrl-roll-button w-full py-2.5 px-2 rounded-full bg-[#ecefec] dark:bg-white/[0.08] hover:bg-slate-200 dark:hover:bg-white/[0.14] text-xs font-bold dark:text-slate-200 text-slate-700 border border-slate-300 dark:border-white/10 transition-colors truncate"
                    >
                      <span className="ctrl-roll-label">Details</span>
                    </button>
                    <button
                      onClick={() => isUserVoteTop2 && onCheckMyVote ? onCheckMyVote() : onInitiateVote(top2)}
                      className={`ctrl-roll-button w-full py-2.5 px-2 rounded-full text-xs font-bold transition-all shadow-md truncate ${
                        isUserVoteTop2
                          ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border-2 border-blue-500 hover:bg-blue-500/30'
                          : 'bg-[#ecefec] dark:bg-white/[0.1] text-slate-950 dark:text-white border-2 border-slate-950 dark:border-white/20'
                      }`}
                    >
                      <span className="ctrl-roll-label">{isUserVoteTop2 ? 'Your Pick' : 'Vote'}</span>
                    </button>
                  </div>
                </div>
              );
            })()}

            {/* 1st Place Card (Elevated Leader with Ctrl Lemon/Gold Accent) */}
            {top1 && (() => {
              const isUserVoteTop1 = userVote?.projectId === top1.id;
              const votePercent = Math.round(((top1.publicVotesCount || 0) / totalVotesAcrossAll) * 100);
              return (
                <div 
                  onMouseMove={handleMouseMove}
                  className={`ctrl-card order-1 lg:order-2 p-6 sm:p-7 flex flex-col items-center text-center justify-between !border-blue-500 ring-2 ring-blue-500/40 shadow-2xl ${
                    isUserVoteTop1 ? 'ring-4 ring-blue-500/50' : ''
                  }`}
                >
                  {/* Card Header: 1st Place Tag and 1st Rank Badge */}
                  <div className="flex items-center justify-between w-full mb-5">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fbe74e]/40 border border-amber-400 text-amber-700 dark:text-yellow-300 font-mono font-bold text-xs uppercase tracking-wider">
                      <Crown className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>1st Place • Leader</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {isUserVoteTop1 && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-600 text-white font-bold flex items-center gap-1 shadow-sm whitespace-nowrap flex-shrink-0">
                          <CheckCircle className="w-3 h-3" />
                          YOUR VOTE
                        </span>
                      )}
                      <div className="w-9 h-9 rounded-full bg-[#fbe74e] text-slate-950 font-black flex items-center justify-center text-xs shadow-md border-2 border-slate-950 flex-shrink-0">
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
                    <h3 className="text-lg sm:text-xl font-black dark:text-white text-slate-950 mb-0.5 truncate max-w-full">
                      {top1.name}
                    </h3>
                    <p className="text-xs dark:text-slate-300 text-slate-600 font-mono truncate max-w-full">
                      {top1.teamName}
                    </p>
                  </div>
                  
                  {/* Verified Votes Pill */}
                  <div className="w-full py-2.5 px-3.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-xs sm:text-sm font-mono font-black text-blue-600 dark:text-blue-400 mb-5 shadow-inner">
                    <span className="flex items-center justify-center gap-1.5">
                      <Flame className="w-4 h-4 fill-current text-blue-500" />
                      {top1.publicVotesCount} Verified Votes ({votePercent}%)
                    </span>
                  </div>

                  {/* Action Buttons: 2-column grid that never overflows */}
                  <div className="grid grid-cols-2 gap-2.5 w-full mt-auto">
                    <button
                      onClick={() => onSelectProject(top1)}
                      className="ctrl-roll-button w-full py-2.5 px-2 rounded-full bg-[#ecefec] dark:bg-white/[0.08] hover:bg-slate-200 dark:hover:bg-white/[0.14] text-xs font-bold dark:text-white text-slate-800 border border-slate-300 dark:border-white/10 transition-colors truncate"
                    >
                      <span className="ctrl-roll-label">Details</span>
                    </button>
                    <button
                      onClick={() => isUserVoteTop1 && onCheckMyVote ? onCheckMyVote() : onInitiateVote(top1)}
                      className={`ctrl-roll-button w-full py-2.5 px-2 rounded-full text-xs font-black transition-all shadow-md truncate border-2 border-slate-950 ${
                        isUserVoteTop1
                          ? 'bg-blue-500/20 text-blue-600 border-blue-500 hover:bg-blue-500/30'
                          : 'bg-[#05c92f] hover:bg-[#04b82a] text-slate-950 shadow-emerald-500/20'
                      }`}
                    >
                      <span className="ctrl-roll-label">{isUserVoteTop1 ? 'Your Pick' : 'Vote for #1'}</span>
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
                  className={`ctrl-card order-3 lg:order-3 p-6 sm:p-7 flex flex-col items-center text-center justify-between ${
                    isUserVoteTop3 ? '!border-blue-500 ring-2 ring-blue-500/30' : ''
                  }`}
                >
                  {/* Card Header: 3rd Place Tag and 3rd Rank Badge */}
                  <div className="flex items-center justify-between w-full mb-5">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffcadc]/40 border border-pink-300 text-pink-700 dark:text-pink-300 font-mono font-bold text-xs uppercase tracking-wider">
                      <Award className="w-3.5 h-3.5 text-pink-500" />
                      <span>3rd Place</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {isUserVoteTop3 && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-600 text-white font-bold flex items-center gap-1 shadow-sm whitespace-nowrap flex-shrink-0">
                          <CheckCircle className="w-3 h-3" />
                          YOUR VOTE
                        </span>
                      )}
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-700 via-amber-600 to-amber-500 text-white font-black flex items-center justify-center text-xs shadow-md border-2 border-slate-950 flex-shrink-0">
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
                    <h3 className="text-base sm:text-lg font-black dark:text-white text-slate-950 mb-0.5 truncate max-w-full">
                      {top3.name}
                    </h3>
                    <p className="text-xs dark:text-slate-400 text-slate-600 font-mono truncate max-w-full">
                      {top3.teamName}
                    </p>
                  </div>
                  
                  {/* Verified Votes Pill */}
                  <div className="w-full py-2.5 px-3.5 rounded-full bg-[#ecefec] dark:bg-white/[0.04] text-xs font-mono font-bold dark:text-slate-200 text-slate-700 mb-5 border border-slate-300 dark:border-white/10">
                    <span className="flex items-center justify-center gap-1.5 text-amber-600 dark:text-amber-400">
                      <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      {top3.publicVotesCount} Verified Votes ({votePercent}%)
                    </span>
                  </div>

                  {/* Action Buttons: 2-column grid that never overflows */}
                  <div className="grid grid-cols-2 gap-2.5 w-full mt-auto">
                    <button
                      onClick={() => onSelectProject(top3)}
                      className="ctrl-roll-button w-full py-2.5 px-2 rounded-full bg-[#ecefec] dark:bg-white/[0.08] hover:bg-slate-200 dark:hover:bg-white/[0.14] text-xs font-bold dark:text-slate-200 text-slate-700 border border-slate-300 dark:border-white/10 transition-colors truncate"
                    >
                      <span className="ctrl-roll-label">Details</span>
                    </button>
                    <button
                      onClick={() => isUserVoteTop3 && onCheckMyVote ? onCheckMyVote() : onInitiateVote(top3)}
                      className={`ctrl-roll-button w-full py-2.5 px-2 rounded-full text-xs font-bold transition-all shadow-md truncate ${
                        isUserVoteTop3
                          ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border-2 border-blue-500 hover:bg-blue-500/30'
                          : 'bg-[#ecefec] dark:bg-white/[0.1] text-slate-950 dark:text-white border-2 border-slate-950 dark:border-white/20'
                      }`}
                    >
                      <span className="ctrl-roll-label">{isUserVoteTop3 ? 'Your Pick' : 'Vote'}</span>
                    </button>
                  </div>
                </div>
              );
            })()}

          </div>
        )}

        {/* Full Leaderboard Table Wrapped in Ctrl Card */}
        <div className="ctrl-card overflow-hidden shadow-xl">
          <div className="p-4 sm:p-6 border-b dark:border-white/[0.08] border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4 bg-[#ecefec]/40 dark:bg-white/[0.02]">
            <h4 className="text-xs sm:text-sm font-black dark:text-white text-slate-950 uppercase tracking-wider font-mono">
              All Projects & Vote Distribution
            </h4>
            <span className="self-start sm:self-auto text-[11px] sm:text-xs px-3 py-1 rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-400 font-mono font-bold whitespace-nowrap flex-shrink-0">
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
                        <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-[#fbe74e] text-slate-950 border border-slate-950 font-mono font-black text-xs">
                          1st
                        </span>
                      ) : index === 1 ? (
                        <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-slate-300 text-slate-900 border border-slate-950 font-mono font-black text-xs">
                          2nd
                        </span>
                      ) : index === 2 ? (
                        <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-amber-600 text-white border border-slate-950 font-mono font-black text-xs">
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
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <h5 
                          onClick={() => onSelectProject(project)}
                          className="text-sm sm:text-base font-black dark:text-white text-slate-950 hover:text-blue-600 cursor-pointer flex items-center gap-1.5"
                        >
                          {project.name}
                          <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                        </h5>
                        {isVoted && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-600 text-white font-black flex items-center gap-1 shadow-sm whitespace-nowrap flex-shrink-0">
                            <CheckCircle className="w-3 h-3" />
                            YOUR VOTE
                          </span>
                        )}
                      </div>
                      <p className="text-xs dark:text-slate-400 text-slate-600 font-mono mt-0.5">
                        {project.teamName} • {project.tags.slice(0, 2).join(', ')}
                      </p>
                    </div>
                  </div>

                  {/* Score / Progress Bar */}
                  <div className="flex items-center space-x-4 sm:w-80">
                    <div className="flex-1">
                      <div className="flex justify-between text-xs font-mono mb-1">
                        <span className="dark:text-slate-400 text-slate-600">{project.publicVotesCount} votes</span>
                        <span className="text-blue-600 dark:text-blue-400 font-black">{votePercent}%</span>
                      </div>

                      <div className="w-full h-2.5 rounded-full dark:bg-white/[0.06] bg-slate-200 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-blue-600 via-sky-400 to-emerald-400"
                          style={{ width: `${Math.max(votePercent, 5)}%` }}
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => isVoted && onCheckMyVote ? onCheckMyVote() : onInitiateVote(project)}
                      className={`ctrl-roll-button px-5 py-2 rounded-full text-xs font-mono font-bold transition-all shadow-md active:scale-95 whitespace-nowrap ${
                        isVoted
                          ? 'bg-blue-500/20 text-blue-600 border border-blue-500/40 hover:bg-blue-500/30'
                          : 'bg-[#05c92f] hover:bg-[#04b82a] text-slate-950 font-black border-2 border-slate-950'
                      }`}
                    >
                      <span className="ctrl-roll-label">{isVoted ? 'Your Pick' : 'Vote'}</span>
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
