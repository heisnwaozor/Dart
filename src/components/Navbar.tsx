import React, { useState } from 'react';
import { 
  Flame, 
  Trophy, 
  SearchCode, 
  ChevronDown, 
  LogOut, 
  Copy,
  Check,
  Sun,
  Moon,
  CheckCircle,
  ArrowLeft,
  Code2,
  Users
} from 'lucide-react';
import { PollarUser, PublicVote } from '../types';
import { PollarClientService } from '../lib/pollar';
import { useTheme } from '../context/ThemeContext';
import { DartLogo } from './DartLogo';
import { usePollar } from '@pollar/react';

interface NavbarProps {
  currentView: 'portal' | 'voting' | 'builder';
  setCurrentView: (view: 'portal' | 'voting' | 'builder') => void;
  activeTab: 'projects' | 'leaderboard' | 'audit';
  setActiveTab: (tab: 'projects' | 'leaderboard' | 'audit') => void;
  currentUser: PollarUser | null;
  userVote?: PublicVote;
  projectsCount: number;
  onOpenSubmit: () => void;
  onOpenAuth: (initialTab?: 'signup' | 'signin', defaultRole?: 'voter' | 'builder') => void;
  onCheckMyVote?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  activeTab,
  setActiveTab,
  currentUser,
  userVote,
  projectsCount,
  onOpenSubmit,
  onOpenAuth,
  onCheckMyVote,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const { theme, toggleTheme } = useTheme();

  let pollarLogout: (() => void) | undefined;
  try {
    const pollar = usePollar();
    pollarLogout = pollar?.logout;
  } catch (err) {
    // optional fallback if outside provider
  }

  const handleCopyWallet = () => {
    if (currentUser?.walletAddress) {
      navigator.clipboard.writeText(currentUser.walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLogout = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    try {
      if (typeof pollarLogout === 'function') {
        pollarLogout();
      }
    } catch (err) {
      // ignore
    }
    PollarClientService.setActiveUser(null);
    setShowMenu(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b dark:border-white/[0.08] border-slate-200/80 dark:bg-[#070A13]/90 bg-[#F9FAF9]/90 backdrop-blur-2xl transition-colors duration-300">
      
      <div className="motion-container">
        <div className="flex items-center justify-between h-20 sm:h-22">
          
          {/* Brand Identity: Fine-tuned clean logo without SDK badge (Ctrl.xyz style) */}
          <div 
            onClick={() => setCurrentView('portal')}
            className="flex items-center space-x-3.5 cursor-pointer select-none group"
          >
            <div className="relative flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <DartLogo size={42} animate />
            </div>

            <div className="flex flex-col">
              <span className="font-black text-2xl sm:text-3xl dark:text-white text-slate-950 tracking-tight leading-none group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                Dart
              </span>
              <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold mt-1">
                Stellar Voting
              </span>
            </div>
          </div>

          {/* Center Floating Pill Bar with thin dividers (Ctrl.xyz exact style) */}
          <nav className="hidden md:flex items-center px-5 py-2.5 rounded-full ctrl-pill-nav text-xs font-semibold">
            
            {currentView === 'portal' ? (
              <div className="flex items-center space-x-3 text-slate-700 dark:text-slate-200">
                <button
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="ctrl-roll-button hover:text-blue-600 dark:hover:text-white transition-colors"
                >
                  <span className="ctrl-roll-label">Overview</span>
                </button>
                <span className="text-slate-300 dark:text-white/20 select-none">|</span>
                <button
                  onClick={() => setCurrentView('voting')}
                  className="ctrl-roll-button hover:text-blue-600 dark:hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <Users className="w-3.5 h-3.5 text-blue-500" />
                  <span className="ctrl-roll-label">Voting Arena</span>
                </button>
                <span className="text-slate-300 dark:text-white/20 select-none">|</span>
                <button
                  onClick={() => setCurrentView('builder')}
                  className="ctrl-roll-button hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <Code2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="ctrl-roll-label">Submit Project</span>
                </button>
                <span className="text-slate-300 dark:text-white/20 select-none">|</span>
                <button
                  onClick={() => {
                    setCurrentView('voting');
                    setActiveTab('audit');
                  }}
                  className="ctrl-roll-button hover:text-blue-600 dark:hover:text-white transition-colors"
                >
                  <span className="ctrl-roll-label">Audit Trail</span>
                </button>
              </div>
            ) : currentView === 'voting' ? (
              <div className="flex items-center space-x-2.5">
                <button
                  onClick={() => setCurrentView('portal')}
                  className="ctrl-roll-button inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-white/[0.1] text-slate-700 dark:text-slate-200 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span className="ctrl-roll-label">Hub</span>
                </button>
                <span className="text-slate-300 dark:text-white/20 select-none">|</span>
                <button
                  onClick={() => setActiveTab('projects')}
                  className={`ctrl-roll-button px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                    activeTab === 'projects'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-700 dark:text-slate-200 hover:text-blue-500'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span className="ctrl-roll-label">Projects ({projectsCount})</span>
                </button>
                <span className="text-slate-300 dark:text-white/20 select-none">|</span>
                <button
                  onClick={() => setActiveTab('leaderboard')}
                  className={`ctrl-roll-button px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                    activeTab === 'leaderboard'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-700 dark:text-slate-200 hover:text-blue-500'
                  }`}
                >
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  <span className="ctrl-roll-label">Leaderboard</span>
                </button>
                <span className="text-slate-300 dark:text-white/20 select-none">|</span>
                <button
                  onClick={() => setActiveTab('audit')}
                  className={`ctrl-roll-button px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                    activeTab === 'audit'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-700 dark:text-slate-200 hover:text-blue-500'
                  }`}
                >
                  <SearchCode className="w-3.5 h-3.5 text-sky-400" />
                  <span className="ctrl-roll-label">Audit</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3 text-slate-700 dark:text-slate-200">
                <button
                  onClick={() => setCurrentView('portal')}
                  className="ctrl-roll-button inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-white/[0.1] text-slate-700 dark:text-slate-200 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span className="ctrl-roll-label">Back to Hub</span>
                </button>
                <span className="text-slate-300 dark:text-white/20 select-none">|</span>
                <span className="font-bold text-emerald-500 flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5" />
                  Builder Portal
                </span>
                <span className="text-slate-300 dark:text-white/20 select-none">|</span>
                <button
                  onClick={() => setCurrentView('voting')}
                  className="ctrl-roll-button hover:text-blue-600 dark:hover:text-white transition-colors"
                >
                  <span className="ctrl-roll-label">Switch to Voting</span>
                </button>
              </div>
            )}

          </nav>

          {/* Right Action CTAs & User Controls */}
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            
            {/* Check My Vote Quick Pill */}
            {userVote && onCheckMyVote && (
              <button
                onClick={onCheckMyVote}
                className="hidden sm:flex items-center space-x-1.5 px-3.5 py-2 rounded-full bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-600 dark:text-blue-400 text-xs font-bold transition-all shadow-sm group hover:scale-105"
                title="Check Your Verified SEP-53 Vote Receipt"
              >
                <CheckCircle className="w-3.5 h-3.5 text-blue-500 group-hover:scale-110 transition-transform" />
                <span className="max-w-[120px] md:max-w-[160px] truncate">My Vote: {userVote.projectName}</span>
              </button>
            )}

            {/* Dark / Light Mode Switcher */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="p-2.5 rounded-full dark:bg-white/[0.06] bg-slate-100 hover:bg-slate-200 dark:hover:bg-white/[0.12] border dark:border-white/[0.1] border-slate-200 text-slate-700 dark:text-slate-200 transition-all duration-300 hover:rotate-45"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-300" />
              ) : (
                <Moon className="w-4 h-4 text-blue-600" />
              )}
            </button>

            {/* User Profile or Connect Button (Ctrl.xyz pill button) */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="flex items-center space-x-2.5 p-1.5 pl-3 pr-2.5 rounded-full dark:bg-white/[0.06] bg-slate-100 hover:bg-slate-200 dark:hover:bg-white/[0.1] border dark:border-white/[0.12] border-slate-200 transition-all shadow-sm"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover ring-2 ring-blue-500/50"
                  />
                  <div className="text-left hidden sm:block">
                    <p className="text-xs font-bold dark:text-white text-slate-900 leading-tight">
                      {currentUser.name}
                    </p>
                    <p className="text-[10px] text-blue-500 font-mono font-semibold">
                      {currentUser.walletAddress.substring(0, 4)}...{currentUser.walletAddress.slice(-4)}
                    </p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {showMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[1px]" 
                      onClick={() => setShowMenu(false)} 
                    />
                    <div className="absolute right-0 mt-2 w-72 rounded-3xl dark:bg-[#0E1527] bg-white border dark:border-white/[0.12] border-slate-200 shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-1 py-2 border-b dark:border-white/[0.08] border-slate-100 mb-3">
                        <p className="text-sm font-bold dark:text-white text-slate-900">{currentUser.name}</p>
                        <p className="text-xs text-blue-500 font-medium">{currentUser.email || 'Pollar Connected'}</p>
                        
                        <div className="mt-2.5 p-2.5 rounded-2xl dark:bg-black/50 bg-slate-50 border dark:border-white/[0.06] border-slate-200 flex items-center justify-between">
                          <span className="font-mono text-xs dark:text-slate-300 text-slate-600 truncate max-w-[170px]">
                            {currentUser.walletAddress}
                          </span>
                          <button
                            type="button"
                            onClick={handleCopyWallet}
                            className="text-blue-500 hover:text-blue-600 p-1 rounded"
                            title="Copy Wallet Address"
                          >
                            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {userVote && onCheckMyVote && (
                        <button
                          type="button"
                          onClick={() => {
                            setShowMenu(false);
                            onCheckMyVote();
                          }}
                          className="w-full text-left px-3 py-2.5 rounded-2xl text-xs font-bold text-blue-500 dark:hover:bg-blue-950/40 hover:bg-blue-50 flex items-center justify-between mb-1"
                        >
                          <span className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            View Signed Receipt
                          </span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2.5 rounded-2xl text-xs font-bold text-rose-500 dark:hover:bg-rose-950/30 hover:bg-rose-50 flex items-center space-x-2 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2 sm:space-x-2.5">
                <button
                  type="button"
                  onClick={() => onOpenAuth('signin')}
                  className="px-3.5 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-bold dark:text-slate-300 text-slate-700 hover:text-slate-950 dark:hover:text-white transition-colors"
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => onOpenAuth('signup')}
                  className="ctrl-roll-button px-5 sm:px-6 py-2.5 rounded-full bg-[#05c92f] hover:bg-[#04b82a] text-slate-950 font-black text-xs sm:text-sm border-2 border-slate-950 shadow-md hover:scale-105 active:scale-95 transition-all duration-200"
                >
                  <span className="ctrl-roll-label">Create Account</span>
                </button>
              </div>
            )}

          </div>

        </div>

        {/* Mobile Navigation Bar */}
        <div className="md:hidden flex items-center justify-around py-2.5 border-t dark:border-white/[0.08] border-slate-200/80 text-xs font-bold">
          <button
            onClick={() => setCurrentView('portal')}
            className={`py-1.5 px-3 rounded-full transition-all ${
              currentView === 'portal' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Portal
          </button>
          <button
            onClick={() => {
              setCurrentView('voting');
              setActiveTab('projects');
            }}
            className={`py-1.5 px-3 rounded-full transition-all ${
              currentView === 'voting' && activeTab === 'projects' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Vote
          </button>
          <button
            onClick={() => {
              setCurrentView('voting');
              setActiveTab('leaderboard');
            }}
            className={`py-1.5 px-3 rounded-full transition-all ${
              currentView === 'voting' && activeTab === 'leaderboard' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Ranks
          </button>
          <button
            onClick={() => setCurrentView('builder')}
            className={`py-1.5 px-3 rounded-full transition-all ${
              currentView === 'builder' ? 'bg-emerald-600 text-white' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Submit
          </button>
        </div>

      </div>
    </header>
  );
};
