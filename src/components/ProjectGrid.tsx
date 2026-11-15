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
}

export const ProjectGrid: React.FC<ProjectGridProps> = ({
  projects,
  currentUser,
  userVote,
  onSelectProject,
  onInitiateVote,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'votes' | 'newest'>('votes');

  // Extract all unique tags
  const allTags = useMemo(() => {
    const set = new Set<string>();
    projects.forEach(p => p.tags.forEach(t => set.add(t)));
    return ['All', ...Array.from(set)];
  }, [projects]);

  // Filter & Sort
  const filteredProjects = useMemo(() => {
    return projects
      .filter(p => {
        const matchesQuery = 
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.teamName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesTag = selectedTag === 'All' || p.tags.includes(selectedTag);

        return matchesQuery && matchesTag;
      })
      .sort((a, b) => {
        if (sortBy === 'votes') return b.publicVotesCount - a.publicVotesCount;
        return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
      });
  }, [projects, searchQuery, selectedTag, sortBy]);

  return (
    <section id="projects-section" className="py-10 sm:py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Control Panel: Search & Filter Pills */}
      <div className="dark:bg-[#0D1324] bg-white border dark:border-white/[0.08] border-slate-200/80 p-4 sm:p-6 rounded-3xl mb-8 space-y-4 shadow-xl dark:shadow-2xl transition-all duration-300">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3.5">
          
          {/* Search box with clear button */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search projects by name, Soroban smart contracts, AI agents..."
              className="w-full pl-11 pr-10 py-3 rounded-2xl dark:bg-black/40 bg-slate-50 border dark:border-white/[0.1] border-slate-200 text-sm dark:text-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort order */}
          <div className="flex items-center space-x-2 self-end md:self-auto">
            <span className="text-xs dark:text-slate-400 text-slate-500 font-mono">Sort by:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="dark:bg-[#141C33] bg-slate-100 border dark:border-white/[0.1] border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold dark:text-white text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer shadow-sm"
            >
              <option value="votes">Most Community Votes</option>
              <option value="newest">Recently Submitted</option>
            </select>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                selectedTag === tag
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 scale-[1.03]'
                  : 'dark:bg-white/[0.04] bg-slate-100 dark:text-slate-300 text-slate-600 hover:text-blue-600 dark:hover:text-white hover:bg-slate-200/80 dark:hover:bg-white/[0.08] border dark:border-white/[0.06] border-slate-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

      </div>

      {/* User voting state notification banner if voted */}
      {userVote && (
        <div className="mb-8 p-4 rounded-3xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-between text-xs sm:text-sm text-blue-600 dark:text-blue-400 font-semibold shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p>
                You have recorded your SEP-53 verified vote for <strong className="dark:text-white text-slate-900 underline">{userVote.projectName}</strong>.
              </p>
              <p className="text-[11px] dark:text-slate-400 text-slate-500 mt-0.5">
                Feel free to switch your vote anytime before the hackathon voting window concludes.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Bento Grid Projects */}
      {filteredProjects.length === 0 ? (
        <div className="py-24 text-center rounded-3xl dark:bg-white/[0.02] bg-slate-50 border dark:border-white/[0.06] border-slate-200 space-y-3">
          <Layers className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold dark:text-slate-200 text-slate-800">No matching projects found</h3>
          <p className="text-xs text-slate-500">Try adjusting your search keywords or switching category filters.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedTag('All');
            }}
            className="px-5 py-2.5 rounded-2xl bg-blue-600 text-white text-xs font-bold shadow-md hover:bg-blue-500 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProjects.map((project) => {
            const isUserVotedForThis = userVote?.projectId === project.id;
            const hasUserVotedElsewhere = userVote && userVote.projectId !== project.id;

            return (
              <div
                key={project.id}
                className={`group relative rounded-3xl overflow-hidden dark:bg-[#0E1527] bg-white border transition-all duration-300 flex flex-col justify-between hover:-translate-y-1.5 ${
                  isUserVotedForThis
                    ? 'border-blue-500 shadow-2xl shadow-blue-500/25 ring-2 ring-blue-500/40'
                    : 'dark:border-white/[0.08] border-slate-200 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10'
                }`}
              >
                {/* Image Banner & Live Floating Pills */}
                <div 
                  onClick={() => onSelectProject(project)}
                  className="relative h-52 sm:h-56 w-full overflow-hidden bg-slate-900 cursor-pointer"
                >
                  <img
                    src={project.coverImage}
                    alt={project.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t dark:from-[#0E1527] from-black/80 via-transparent to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
                    <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white font-bold flex items-center gap-1.5 shadow-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                      {project.teamName}
                    </span>

                    {isUserVotedForThis && (
                      <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-blue-600 text-white font-black flex items-center gap-1 shadow-lg shadow-blue-600/40 animate-pulse">
                        <CheckCircle className="w-3.5 h-3.5" />
                        YOUR VOTE
                      </span>
                    )}
                  </div>

                  {/* Vote Count Live Badge */}
                  <div className="absolute bottom-3.5 left-3.5 flex items-center space-x-1.5 px-3.5 py-1.5 rounded-2xl bg-black/75 backdrop-blur-md border border-white/15 text-blue-400 text-xs font-mono font-bold shadow-lg">
                    <Flame className="w-4 h-4 fill-blue-400" />
                    <span className="text-white font-extrabold">{project.publicVotesCount ?? 0}</span>
                    <span className="text-slate-300 font-normal">votes</span>
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 
                      onClick={() => onSelectProject(project)}
                      className="text-lg sm:text-xl font-bold dark:text-white text-slate-900 group-hover:text-blue-500 transition-colors cursor-pointer flex items-center justify-between"
                    >
                      <span>{project.name}</span>
                      <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </h3>

                    <p className="text-xs sm:text-sm dark:text-slate-400 text-slate-600 line-clamp-2 mt-2 leading-relaxed">
                      {project.tagline}
                    </p>

                    {/* Tag list */}
                    <div className="flex flex-wrap gap-1.5 mt-3.5">
                      {project.tags.map(tag => (
                        <span
                          key={tag}
                          className="text-[10px] px-2.5 py-1 rounded-lg dark:bg-white/[0.05] bg-slate-100 dark:border-white/[0.08] border-slate-200 dark:text-blue-300 text-blue-700 font-mono font-semibold"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-4 border-t dark:border-white/[0.06] border-slate-200 flex items-center justify-between gap-3">
                    <button
                      onClick={() => onSelectProject(project)}
                      className="text-xs font-bold dark:text-slate-300 text-slate-600 hover:text-blue-600 dark:hover:text-white transition-colors px-2 py-1.5"
                    >
                      Pitch & Demo
                    </button>

                    <button
                      onClick={() => onInitiateVote(project)}
                      className={`shimmer-sweep flex items-center space-x-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all duration-200 ${
                        isUserVotedForThis
                          ? 'bg-blue-500/20 text-blue-500 border border-blue-500/40 hover:bg-blue-500/30'
                          : hasUserVotedElsewhere
                          ? 'dark:bg-white/[0.08] bg-slate-100 hover:bg-slate-200 dark:hover:bg-white/[0.14] dark:text-white text-slate-800 border dark:border-white/[0.1] border-slate-300'
                          : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 hover:scale-105 active:scale-95'
                      }`}
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>
                        {isUserVotedForThis 
                          ? 'Voted (Change)' 
                          : hasUserVotedElsewhere 
                          ? 'Switch Vote' 
                          : 'Vote Free'}
                      </span>
                    </button>
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

    </section>
  );
};
