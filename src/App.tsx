import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
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
      
      {/* Top Title Bar / Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        userVote={activeUserVote}
        projectsCount={projects.length}
        onOpenSubmit={() => setIsSubmitOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onCheckMyVote={() => setIsReceiptOpen(true)}
      />

      {/* Main Content View */}
      <main className="flex-1">
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
      </main>

      {/* Footer */}
      <footer className="border-t dark:border-white/[0.08] border-slate-200 dark:bg-[#0A0E1A] bg-white py-16 sm:py-20 mt-28 text-xs sm:text-sm dark:text-slate-400 text-slate-500 transition-colors">
        <div className="motion-container flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center p-1 shadow-sm">
              <DartLogo size={32} />
            </div>
            <div>
              <p className="font-extrabold dark:text-white text-slate-900 text-sm">
                Dart: Hackathon Community Voting
              </p>
              <p className="text-[11px] dark:text-slate-400 text-slate-500">
                Built with @pollar/react & @pollar/core • Stellar SEP-53 signed votes • 1 wallet per voter
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 font-medium">
            <a
              href="https://pollar.xyz"
              target="_blank"
              rel="noreferrer"
              className="hover:text-blue-500 transition-colors flex items-center gap-1 font-mono"
            >
              pollar.xyz <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://docs.pollar.xyz"
              target="_blank"
              rel="noreferrer"
              className="hover:text-blue-500 transition-colors flex items-center gap-1 font-mono"
            >
              docs.pollar.xyz <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://www.npmjs.com/package/@pollar/react"
              target="_blank"
              rel="noreferrer"
              className="hover:text-blue-500 transition-colors flex items-center gap-1 font-mono"
            >
              @pollar/react <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={handleResetData}
              className="flex items-center space-x-1.5 dark:text-slate-400 text-slate-500 hover:text-amber-500 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset State</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
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
          setProjects(PollarClientService.getProjects());
          setPublicVotes(PollarClientService.getPublicVotes());
        }}
        onViewLeaderboard={() => setActiveTab('leaderboard')}
        onViewReceipt={() => setIsReceiptOpen(true)}
      />

      <ProjectDetailModal
        project={liveInspectingProject}
        currentUser={currentUser}
        userVote={activeUserVote}
        onClose={() => setInspectingProject(null)}
        onInitiateVote={project => setVotingProject(project)}
        onCheckMyVote={() => setIsReceiptOpen(true)}
      />

      {isReceiptOpen && activeUserVote && (
        <VoteReceiptModal
          vote={activeUserVote}
          project={activeVotedProject}
          currentUser={currentUser}
          onClose={() => setIsReceiptOpen(false)}
          onChangeVote={() => {
            setIsReceiptOpen(false);
            setActiveTab('projects');
            const el = document.getElementById('projects-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onViewAuditLedger={() => {
            setIsReceiptOpen(false);
            setActiveTab('audit');
          }}
        />
      )}

      {isSubmitOpen && (
        <SubmitProjectModal
          currentUser={currentUser}
          onClose={() => setIsSubmitOpen(false)}
          onOpenAuth={() => {
            setIsSubmitOpen(false);
            setIsAuthOpen(true);
          }}
          onSuccess={() => {
            setProjects(PollarClientService.getProjects());
          }}
        />
      )}

      {isAuthOpen && (
        <PollarAuthModal
          currentUser={currentUser}
          onClose={() => setIsAuthOpen(false)}
          onLogin={user => {
            setCurrentUser(user);
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
