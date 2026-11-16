import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  ExternalLink, 
  ShieldCheck, 
  Flame, 
  CheckCircle, 
  Layers,
  ArrowUpRight,
  Sparkles,
  Code2,
  X,
  Zap
} from 'lucide-react';
import { Project, PollarUser, PublicVote } from '../types';

interface ProjectGridProps {
  projects: Project[];
  currentUser: PollarUser | null;
  userVote: PublicVote | undefined;
  onSelectProject: (project: Project) => void;
  onInitiateVote: (project: Project) => void;
  onCheckMyVote?: () => void;
}

export const ProjectGrid: React.FC<ProjectGridProps> = ({
  projects,
  currentUser,
  userVote,
  onSelectProject,
  onInitiateVote,
  onCheckMyVote,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'votes' | 'newest'>('votes');

  // Extract all unique tags, including "My Vote" if user has voted
  const allTags = useMemo(() => {
    const set = new Set<string>();
    projects.forEach(p => p.tags.forEach(t => set.add(t)));
    const tags = ['All', ...Array.from(set)];
    if (userVote) {
      tags.splice(1, 0, 'My Vote');
    }
    return tags;
  }, [projects, userVote]);

  // Filter & Sort
  const filteredProjects = useMemo(() => {
    return projects
      .filter(p => {
        const matchesQuery = 
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.teamName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesTag = 
          selectedTag === 'All' 
            ? true 
            : selectedTag === 'My Vote' 
            ? p.id === userVote?.projectId 
            : p.tags.includes(selectedTag);

        return matchesQuery && matchesTag;
      })
      .sort((a, b) => {
        if (sortBy === 'votes') return b.publicVotesCount - a.publicVotesCount;
        return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
      });
  }, [projects, searchQuery, selectedTag, sortBy, userVote]);

  // MotionSites spotlight mouse tracker
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };

  return (
    <section id="projects-section" className="py-20 sm:py-28 lg:py-36 border-b dark:border-white/[0.08] border-slate-200">
      <div className="motion-container">
        
        {/* Ctrl Section Header */}
        <div className="mb-14 sm:mb-20 text-center max-w-3xl mx-auto space-y-4 sm:space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ecefec] dark:bg-white/[0.08] text-xs sm:text-sm font-semibold dark:text-slate-200 text-slate-700 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#05c92f] animate-pulse"></span>
            <span>Hackathon Showcase & Voting</span>
          </div>

          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black dark:text-white text-slate-950 tracking-[-0.03em] leading-[0.98]">
            Explore <span className="inline-block text-blue-600 dark:text-blue-500 transform hover:rotate-12 transition-transform duration-300">❖</span> Vote.
          </h2>

          <p className="text-sm sm:text-base md:text-lg dark:text-slate-400 text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Decentralized community voting for all Pollar Pitch Projects. Review verified live demos, testnet Soroban smart contracts, and cast your gasless SEP-53 vote on Stellar.
          </p>
        </div>

        {/* Control Panel: Search & Filter Pills */}
        <div className="ctrl-card p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl md:rounded-[36px] mb-8 sm:mb-16 space-y-5 sm:space-y-6 shadow-xl transition-all duration-300">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-5">
            
            {/* Search box with clear button */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 sm:left-5 top-1/2 -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-blue-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search projects by name, tags..."
                className="w-full pl-10 sm:pl-14 pr-10 sm:pr-12 py-3 sm:py-4 rounded-full dark:bg-black/50 bg-[#ecefec]/60 border-2 dark:border-white/[0.1] border-slate-300 text-xs sm:text-base dark:text-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-950 dark:focus:border-blue-400 transition-all font-medium"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort order */}
            <div className="flex items-center justify-between sm:justify-end gap-2.5 sm:gap-3 w-full md:w-auto">
              <span className="text-xs dark:text-slate-400 text-slate-500 font-mono font-semibold">Sort:</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="flex-1 sm:flex-initial dark:bg-[#141C33] bg-[#ecefec] border-2 dark:border-white/[0.12] border-slate-300 rounded-full px-4 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-bold dark:text-white text-slate-800 focus:outline-none focus:border-slate-950 dark:focus:border-blue-400 cursor-pointer shadow-sm"
              >
                <option value="votes">Most Community Votes</option>
                <option value="newest">Recently Submitted</option>
              </select>
            </div>
          </div>

          {/* Filter Pills neatly wrapped inside the frame with full text visibility */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 pt-1">
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`ctrl-roll-button flex-shrink-0 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 ${
                  selectedTag === tag
                    ? 'bg-[#05c92f] text-slate-950 border-2 border-slate-950 shadow-md shadow-emerald-500/25 scale-105 font-black'
                    : 'bg-[#ecefec] dark:bg-white/[0.06] dark:text-slate-200 text-slate-700 hover:text-slate-950 dark:hover:text-white border dark:border-white/[0.08] border-slate-300'
                }`}
              >
                <span className="ctrl-roll-label">{tag}</span>
              </button>
            ))}
          </div>

        </div>

        {/* User voting state notification banner if voted */}
        {userVote && (
          <div className="mb-12 p-6 sm:p-7 rounded-[32px] ctrl-card flex flex-col sm:flex-row items-center justify-between gap-6 text-xs sm:text-sm shadow-md">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-[#05c92f]/20 border-2 border-[#05c92f] text-slate-950 dark:text-white flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-[#05c92f]" />
              </div>
              <div className="space-y-1">
                <p className="text-base font-black dark:text-white text-slate-950">
                  Your cryptographic vote is recorded for <span className="text-blue-600 dark:text-blue-400 underline">{userVote.projectName}</span>.
                </p>
                <p className="text-xs dark:text-slate-400 text-slate-600">
                  Signed via Stellar SEP-53 non-repudiation. Inspect your cryptographic proof or switch your vote at any time.
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

        {/* Bento Grid Projects with Generous Spacing */}
        {filteredProjects.length === 0 ? (
          <div className="py-28 text-center rounded-[36px] ctrl-card space-y-4">
            <Layers className="w-14 h-14 text-slate-400 mx-auto" />
            <h3 className="text-xl font-bold dark:text-slate-200 text-slate-800">No matching projects found</h3>
            <p className="text-sm text-slate-500">Try adjusting your search keywords or switching category filters.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedTag('All');
              }}
              className="ctrl-roll-button px-6 py-3 rounded-full bg-[#05c92f] text-slate-950 text-xs sm:text-sm font-black border-2 border-slate-950 shadow-md hover:bg-[#04b82a] transition-colors"
            >
              <span className="ctrl-roll-label">Clear Filters</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
            {filteredProjects.map((project) => {
              const isUserVotedForThis = userVote?.projectId === project.id;
              const hasUserVotedElsewhere = userVote && userVote.projectId !== project.id;

              return (
                <div
                  key={project.id}
                  onMouseMove={handleMouseMove}
                  className={`ctrl-card group relative overflow-hidden flex flex-col justify-between ${
                    isUserVotedForThis
                      ? '!border-blue-600 ring-2 ring-blue-500/40 shadow-2xl'
                      : ''
                  }`}
                >
                  {/* Image Banner & Live Floating Pills */}
                  <div 
                    onClick={() => onSelectProject(project)}
                    className="relative h-60 sm:h-64 w-full overflow-hidden bg-slate-900 cursor-pointer"
                  >
                    <img
                      src={project.coverImage}
                      alt={project.name}
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1200&q=80';
                      }}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t dark:from-[#0E1527] from-black/80 via-black/20 to-transparent" />

                    {/* Top Badges */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                      <span className="text-xs font-mono px-3.5 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-white font-bold flex items-center gap-1.5 shadow-md">
                        <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                        {project.teamName}
                      </span>

                      {isUserVotedForThis && (
                        <span className="text-xs font-mono px-3.5 py-1.5 rounded-full bg-blue-600 text-white font-black flex items-center gap-1 shadow-lg shadow-blue-600/50 animate-pulse">
                          <CheckCircle className="w-4 h-4" />
                          YOUR VOTE
                        </span>
                      )}
                    </div>

                    {/* Vote Count Live Badge */}
                    <div className="absolute bottom-4 left-4 flex items-center space-x-2 px-4 py-2 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-blue-400 text-xs sm:text-sm font-mono font-bold shadow-xl">
                      <Flame className="w-4 h-4 fill-blue-400" />
                      <span className="text-white font-black">{project.publicVotesCount ?? 0}</span>
                      <span className="text-slate-300 font-normal">votes</span>
                    </div>
                  </div>

                  {/* Content Area with Generous Margins */}
                  <div className="p-7 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                    <div>
                      <h3 
                        onClick={() => onSelectProject(project)}
                        className="text-xl sm:text-2xl font-black dark:text-white text-slate-950 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors cursor-pointer flex items-center justify-between"
                      >
                        <span>{project.name}</span>
                        <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </h3>

                      <p className="text-xs sm:text-sm dark:text-slate-400 text-slate-600 line-clamp-2 mt-3 leading-relaxed">
                        {project.tagline}
                      </p>

                      {/* Tag list */}
                      <div className="flex flex-wrap gap-2 mt-4">
                        {project.tags.map(tag => (
                          <span
                            key={tag}
                            className="text-[11px] px-3 py-1.5 rounded-full bg-[#ecefec] dark:bg-white/[0.06] border dark:border-white/[0.08] border-slate-300 dark:text-slate-300 text-slate-700 font-mono font-semibold"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Actions Bar */}
                    <div className="pt-6 border-t dark:border-white/[0.08] border-slate-200 flex items-center justify-between gap-3">
                      <button
                        onClick={() => onSelectProject(project)}
                        className="ctrl-roll-button text-xs sm:text-sm font-bold dark:text-slate-300 text-slate-700 hover:text-slate-950 dark:hover:text-white transition-colors px-3 py-2"
                      >
                        <span className="ctrl-roll-label">Pitch & Demo</span>
                      </button>

                      <div className="flex items-center space-x-2.5">
                        {isUserVotedForThis && onCheckMyVote && (
                          <button
                            onClick={onCheckMyVote}
                            className="ctrl-roll-button px-3.5 py-2 rounded-full bg-[#ecefec] dark:bg-white/[0.08] hover:bg-slate-200 dark:hover:bg-white/[0.14] text-slate-950 dark:text-white border dark:border-white/10 border-slate-300 text-xs font-bold transition-all shadow-sm"
                            title="Check Cryptographic Proof"
                          >
                            <span className="ctrl-roll-label">Receipt</span>
                          </button>
                        )}

                        <button
                          onClick={() => onInitiateVote(project)}
                          className={`ctrl-roll-button flex items-center space-x-2 px-5 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-extrabold transition-all duration-200 ${
                            isUserVotedForThis
                              ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-2 border-blue-500 hover:bg-blue-500/25'
                              : hasUserVotedElsewhere
                              ? 'bg-[#ecefec] dark:bg-white/[0.1] hover:bg-slate-200 dark:hover:bg-white/[0.16] text-slate-950 dark:text-white border-2 border-slate-950 dark:border-white/20'
                              : 'bg-[#05c92f] hover:bg-[#04b82a] text-slate-950 font-black border-2 border-slate-950 shadow-md shadow-emerald-500/25 hover:scale-105 active:scale-95'
                          }`}
                        >
                          {!isUserVotedForThis && !hasUserVotedElsewhere && (
                            <div className="flex items-center -space-x-1 mr-0.5 flex-shrink-0">
                              <span className="w-2.5 h-2.5 rounded-full bg-[#fbe74e] ring-1 ring-slate-950"></span>
                              <span className="w-2.5 h-2.5 rounded-full bg-[#ffcadc] ring-1 ring-slate-950"></span>
                              <span className="w-2.5 h-2.5 rounded-full bg-[#9dc4f5] ring-1 ring-slate-950"></span>
                            </div>
                          )}
                          <span className="ctrl-roll-label">
                            {isUserVotedForThis 
                              ? 'Change' 
                              : hasUserVotedElsewhere 
                              ? 'Switch Vote' 
                              : 'Vote Free'}
                          </span>
                        </button>
                      </div>
                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};
