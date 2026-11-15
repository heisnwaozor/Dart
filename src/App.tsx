import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { PortalLanding } from './components/PortalLanding';
import { BuilderPortal } from './components/BuilderPortal';
import { Hero } from './components/Hero';
import { ProjectGrid } from './components/ProjectGrid';
import { Leaderboard } from './components/Leaderboard';
import { AuditExplorer } from './components/AuditExplorer';
import { VoteModal } from './components/VoteModal';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { SubmitProjectModal } from './components/SubmitProjectModal';
import { PollarAuthModal } from './components/PollarAuthModal';
import { VoteReceiptModal } from './components/VoteReceiptModal';
import { Project, PublicVote, PollarUser } from './types';
import { PollarClientService } from './lib/pollar';
import { INITIAL_HACKATHON } from './data/mockData';
import { ThemeProvider } from './context/ThemeContext';
import { PollarProvider } from '@pollar/react';
import { DartLogo } from './components/DartLogo';
import { ShieldCheck, RotateCcw, ExternalLink } from 'lucide-react';

const MainApp: React.FC = () => {
  const [currentView, setCurrentView] = useState<'portal' | 'voting' | 'builder'>('portal');
  const [activeTab, setActiveTab] = useState<'projects' | 'leaderboard' | 'audit'>('projects');
  const [currentUser, setCurrentUser] = useState<PollarUser | null>(PollarClientService.getActiveUser());
  const [projects, setProjects] = useState<Project[]>(PollarClientService.getProjects());
  const [publicVotes, setPublicVotes] = useState<PublicVote[]>(PollarClientService.getPublicVotes());

  // Modals state
  const [votingProject, setVotingProject] = useState<Project | null>(null);
  const [inspectingProject, setInspectingProject] = useState<Project | null>(null);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  // Sync state on events
  useEffect(() => {
    const handleDataChange = () => {
      setProjects(PollarClientService.getProjects());
      setPublicVotes(PollarClientService.getPublicVotes());
    };

    const handleAuthChange = () => {
      setCurrentUser(PollarClientService.getActiveUser());
      setPublicVotes(PollarClientService.getPublicVotes());
    };

    window.addEventListener('pollar_data_changed', handleDataChange);
    window.addEventListener('pollar_auth_changed', handleAuthChange);

    return () => {
      window.removeEventListener('pollar_data_changed', handleDataChange);
      window.removeEventListener('pollar_auth_changed', handleAuthChange);
    };
  }, []);

  const activeUserVote = currentUser 
    ? publicVotes.find(v => (v.voterWallet || '').trim().toLowerCase() === (currentUser.walletAddress || '').trim().toLowerCase())
    : undefined;

  const activeVotedProject = activeUserVote
    ? projects.find(p => p.id === activeUserVote.projectId)
    : undefined;

  const totalVotesCount = projects.reduce((sum, p) => sum + (p.publicVotesCount || 0), 0);

  const liveInspectingProject = inspectingProject
    ? projects.find(p => p.id === inspectingProject.id) || inspectingProject
    : null;

  const handleResetData = () => {
    if (confirm('Reset hackathon votes and projects back to initial demo seeds?')) {
      PollarClientService.resetToDefaults();
    }
  };

  return (
    <div className="min-h-screen dark:bg-[#070A13] bg-[#F8FAFC] dark:text-[#F3F4F6] text-slate-900 flex flex-col selection:bg-blue-600 selection:text-white transition-colors duration-300">
      
      {/* Top Title Bar / Floating Pill Navbar inspired by Ctrl.xyz */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        userVote={activeUserVote}
        projectsCount={projects.length}
        onOpenSubmit={() => setCurrentView('builder')}
        onOpenAuth={() => setIsAuthOpen(true)}
        onCheckMyVote={() => setIsReceiptOpen(true)}
      />

      {/* Main Content View */}
      <main className="flex-1">
        
        {/* 1. Grand Landing Page Portal (Ctrl.xyz Minimalist Gateway) */}
        {currentView === 'portal' && (
          <PortalLanding
            hackathon={INITIAL_HACKATHON}
            projects={projects}
            totalVotes={totalVotesCount}
            onEnterVoting={() => setCurrentView('voting')}
            onEnterBuilder={() => setCurrentView('builder')}
            onOpenAuth={() => setIsAuthOpen(true)}
          />
        )}

        {/* 2. Builder Submission Portal */}
        {currentView === 'builder' && (
          <BuilderPortal
            currentUser={currentUser}
            onBackToPortal={() => setCurrentView('portal')}
            onViewInVotingArena={() => {
              setCurrentView('voting');
              setActiveTab('leaderboard');
            }}
            onOpenAuth={() => setIsAuthOpen(true)}
          />
        )}

        {/* 3. Community Voting Arena */}
        {currentView === 'voting' && (
          <>
            {activeTab === 'projects' && (
              <>
                <Hero
                  hackathon={INITIAL_HACKATHON}
                  totalVotes={totalVotesCount}
                  totalProjects={projects.length}
                  onExplore={() => {
                    const el = document.getElementById('projects-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  onViewLeaderboard={() => setActiveTab('leaderboard')}
                />

                <ProjectGrid
                  projects={projects}
                  currentUser={currentUser}
                  userVote={activeUserVote}
                  onSelectProject={project => setInspectingProject(project)}
                  onInitiateVote={project => setVotingProject(project)}
                  onCheckMyVote={() => setIsReceiptOpen(true)}
                />
              </>
            )}

            {activeTab === 'leaderboard' && (
              <Leaderboard
                projects={projects}
                publicVotes={publicVotes}
                currentUser={currentUser}
                userVote={activeUserVote}
                onSelectProject={project => setInspectingProject(project)}
                onInitiateVote={project => setVotingProject(project)}
                onCheckMyVote={() => setIsReceiptOpen(true)}
              />
            )}

            {activeTab === 'audit' && (
              <AuditExplorer 
                votes={publicVotes}
                currentUser={currentUser}
                userVote={activeUserVote}
              />
            )}
          </>
        )}

      </main>

      {/* Ctrl Footer */}
      <footer className="border-t dark:border-white/[0.08] border-slate-200/80 dark:bg-[#070A13] bg-[#F9FAF9] py-14 sm:py-16 mt-24 text-xs sm:text-sm dark:text-slate-400 text-slate-500 transition-colors">
        <div className="motion-container flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center space-x-3.5">
            <div className="flex items-center justify-center">
              <DartLogo size={36} />
            </div>
            <div>
              <p className="font-black dark:text-white text-slate-950 text-sm">
                Dart: Stellar Voting
              </p>
              <p className="text-[11px] dark:text-slate-400 text-slate-500">
                Decentralized community voting for all Pollar Pitch Projects • Stellar SEP-53 signed votes
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 font-semibold px-4 py-2 rounded-full ctrl-pill-nav text-xs">
            <button
              onClick={() => setCurrentView('portal')}
              className="ctrl-roll-button hover:text-blue-600 dark:hover:text-white transition-colors px-2 py-1"
            >
              <span className="ctrl-roll-label">Portal Hub</span>
            </button>
            <span className="text-slate-300 dark:text-white/20 select-none">|</span>
            <button
              onClick={() => {
                setCurrentView('voting');
                setActiveTab('projects');
              }}
              className="ctrl-roll-button hover:text-blue-600 dark:hover:text-white transition-colors px-2 py-1"
            >
              <span className="ctrl-roll-label">Voting Arena</span>
            </button>
            <span className="text-slate-300 dark:text-white/20 select-none">|</span>
            <button
              onClick={() => setCurrentView('builder')}
              className="ctrl-roll-button hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors px-2 py-1"
            >
              <span className="ctrl-roll-label">Submit Project</span>
            </button>
            <span className="text-slate-300 dark:text-white/20 select-none">|</span>
            <a
              href="https://pollar.xyz"
              target="_blank"
              rel="noreferrer"
              className="ctrl-roll-button hover:text-blue-600 dark:hover:text-white transition-colors flex items-center gap-1 font-mono px-2 py-1"
            >
              <span className="ctrl-roll-label">pollar.xyz</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-slate-300 dark:text-white/20 select-none">|</span>
            <button
              onClick={handleResetData}
              className="ctrl-roll-button flex items-center space-x-1.5 dark:text-slate-400 text-slate-500 hover:text-amber-500 transition-colors px-2 py-1"
              title="Reset Hackathon Demo Data"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="ctrl-roll-label">Reset Demo</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Global Modals */}
      {votingProject && (
        <VoteModal
          project={votingProject}
          currentUser={currentUser}
          currentVote={activeUserVote}
          onClose={() => setVotingProject(null)}
          onOpenAuth={() => {
            setVotingProject(null);
            setIsAuthOpen(true);
          }}
          onSuccess={() => {
            setVotingProject(null);
            setProjects(PollarClientService.getProjects());
            setPublicVotes(PollarClientService.getPublicVotes());
            setIsReceiptOpen(true);
          }}
          onViewReceipt={() => {
            setVotingProject(null);
            setIsReceiptOpen(true);
          }}
          onViewLeaderboard={() => {
            setVotingProject(null);
            setCurrentView('voting');
            setActiveTab('leaderboard');
          }}
        />
      )}

      {liveInspectingProject && (
        <ProjectDetailModal
          project={liveInspectingProject}
          currentUser={currentUser}
          userVote={activeUserVote}
          onClose={() => setInspectingProject(null)}
          onInitiateVote={() => {
            setVotingProject(liveInspectingProject);
            setInspectingProject(null);
          }}
          onCheckMyVote={() => {
            setInspectingProject(null);
            setIsReceiptOpen(true);
          }}
        />
      )}

      {isSubmitOpen && (
        <SubmitProjectModal
          currentUser={currentUser}
          onClose={() => setIsSubmitOpen(false)}
          onSuccess={() => {
            setIsSubmitOpen(false);
            setProjects(PollarClientService.getProjects());
            setCurrentView('voting');
            setActiveTab('projects');
          }}
          onOpenAuth={() => setIsAuthOpen(true)}
        />
      )}

      {isAuthOpen && (
        <PollarAuthModal
          currentUser={currentUser}
          onClose={() => setIsAuthOpen(false)}
          onLogin={user => {
            setCurrentUser(user);
            setIsAuthOpen(false);
          }}
        />
      )}

      {isReceiptOpen && activeUserVote && (
        <VoteReceiptModal
          vote={activeUserVote}
          project={activeVotedProject}
          currentUser={currentUser}
          onClose={() => setIsReceiptOpen(false)}
          onChangeVote={() => {
            setIsReceiptOpen(false);
            setCurrentView('voting');
            setActiveTab('projects');
            const el = document.getElementById('projects-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onViewAuditLedger={() => {
            setIsReceiptOpen(false);
            setCurrentView('voting');
            setActiveTab('audit');
          }}
        />
      )}

    </div>
  );
};

export const App: React.FC = () => {
  const apiKey = PollarClientService.getApiKey();

  return (
    <PollarProvider client={{ apiKey }}>
      <ThemeProvider>
        <MainApp />
      </ThemeProvider>
    </PollarProvider>
  );
};

export default App;
