import React from 'react';
import { 
  X, 
  ExternalLink, 
  ShieldCheck, 
  Flame, 
  Code2,
  CheckCircle2,
  CheckCircle
} from 'lucide-react';
import { Project, PollarUser, PublicVote } from '../types';

interface ProjectDetailModalProps {
  project: Project | null;
  currentUser: PollarUser | null;
  userVote: PublicVote | undefined;
  onClose: () => void;
  onInitiateVote: (project: Project) => void;
  onCheckMyVote?: () => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  currentUser,
  userVote,
  onClose,
  onInitiateVote,
  onCheckMyVote,
}) => {
  if (!project) return null;

  const isUserVotedForThis = userVote?.projectId === project.id;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl rounded-3xl dark:bg-[#0C1326] bg-white border dark:border-white/[0.12] border-slate-200 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Cover Header */}
        <div className="relative h-60 sm:h-72 w-full overflow-hidden flex-shrink-0 bg-slate-900">
          <img
            src={project.coverImage}
            alt={project.name}
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1200&q=80';
            }}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t dark:from-[#0C1326] from-black/80 via-transparent to-black/30" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Floating Badges */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white font-bold">
              Team: {project.teamName}
            </span>
          </div>

          {/* Bottom title info */}
          <div className="absolute bottom-4 left-6 right-6">
            <div className="flex flex-wrap gap-1.5 mb-2">
              {project.tags.map(tag => (
                <span
                  key={tag}
                  className="text-[10px] font-mono px-2.5 py-0.5 rounded-md bg-white/20 backdrop-blur-md border border-white/20 text-white font-bold"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">{project.name}</h2>
            <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-2xl">{project.tagline}</p>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1">
          
          {/* User Active Vote Spotlight if voted for this project */}
          {isUserVotedForThis && userVote && (
            <div className="p-4 sm:p-5 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-500 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm font-bold dark:text-white text-slate-900">
                    You Voted For This Project!
                  </p>
                  <p className="text-xs font-mono dark:text-slate-400 text-slate-500 mt-0.5">
                    Stellar SEP-53 Verified • Recorded at {new Date(userVote.votedAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
              {onCheckMyVote && (
                <button
                  onClick={() => {
                    onClose();
                    onCheckMyVote();
                  }}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all whitespace-nowrap"
                >
                  View Full Receipt
                </button>
              )}
            </div>
          )}

          {/* Quick Stats & Action Ribbon */}
          <div className="p-4 rounded-2xl dark:bg-white/[0.03] bg-slate-50 border dark:border-white/[0.06] border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-2 text-xs font-mono">
              <Flame className="w-4 h-4 text-blue-500" />
              <span className="dark:text-white text-slate-900 font-bold">{project.publicVotesCount}</span>
              <span className="dark:text-slate-400 text-slate-500">Verified SEP-53 Votes</span>
            </div>

            <div className="flex items-center space-x-3">
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl dark:bg-white/[0.06] bg-slate-100 hover:bg-slate-200 dark:hover:bg-white/[0.1] dark:text-white text-slate-800 border dark:border-white/[0.1] border-slate-200 text-xs font-bold transition-colors"
              >
                <span>Live Demo</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href={project.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl dark:bg-white/[0.06] bg-slate-100 hover:bg-slate-200 dark:hover:bg-white/[0.1] dark:text-white text-slate-800 border dark:border-white/[0.1] border-slate-200 text-xs font-bold transition-colors"
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>GitHub</span>
              </a>

              {isUserVotedForThis && onCheckMyVote ? (
                <button
                  onClick={() => {
                    onClose();
                    onCheckMyVote();
                  }}
                  className="flex items-center space-x-2 px-5 py-2.5 rounded-2xl text-xs font-extrabold bg-blue-500/20 text-blue-500 border border-blue-500/40 hover:bg-blue-500/30 transition-all"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Check Receipt</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    onClose();
                    onInitiateVote(project);
                  }}
                  className="shimmer-sweep flex items-center space-x-2 px-5 py-2.5 rounded-2xl text-xs font-extrabold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 hover:scale-105 transition-all"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Cast Vote (SEP-53)</span>
                </button>
              )}
            </div>
          </div>

          {/* Project Details / Pitch */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono uppercase dark:text-slate-400 text-slate-500 tracking-wider font-bold">
              Project Description & Architecture
            </h3>
            <p className="text-sm dark:text-slate-300 text-slate-600 leading-relaxed">
              {project.description}
            </p>

            {project.longDescription && (
              <div className="p-5 rounded-2xl dark:bg-black/50 bg-slate-50 border dark:border-white/[0.06] border-slate-200 text-xs dark:text-slate-300 text-slate-600 whitespace-pre-line leading-relaxed font-sans">
                {project.longDescription}
              </div>
            )}
          </div>

          {/* Technical Metadata */}
          <div className="pt-4 border-t dark:border-white/[0.06] border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono dark:text-slate-400 text-slate-500">
            <div>
              <span className="text-[10px] uppercase block font-bold text-slate-400">Submitted By Wallet:</span>
              <span className="text-blue-500 break-all text-[11px] font-bold">{project.submittedBy}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase block font-bold text-slate-400">Submission Date:</span>
              <span className="dark:text-slate-200 text-slate-700 text-[11px] font-bold">{new Date(project.submittedAt).toLocaleDateString()}</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
