import React, { useState } from 'react';
import { 
  Flame, 
  Trophy, 
  SearchCode, 
  Plus, 
  ChevronDown, 
  LogOut, 
  Copy,
  Check,
  Wallet,
  Sun,
  Moon,
  User,
  Zap,
  CheckCircle,
  ShieldCheck
} from 'lucide-react';
import { PollarUser, PublicVote } from '../types';
import { PollarClientService } from '../lib/pollar';
import { useTheme } from '../context/ThemeContext';
import { DartLogo } from './DartLogo';
import { usePollar } from '@pollar/react';

interface NavbarProps {
  activeTab: 'projects' | 'leaderboard' | 'audit';
  setActiveTab: (tab: 'projects' | 'leaderboard' | 'audit') => void;
  currentUser: PollarUser | null;
  userVote?: PublicVote;
  projectsCount: number;
  onOpenSubmit: () => void;
  onOpenAuth: () => void;
  onCheckMyVote?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
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
    <header className="sticky top-0 z-50 w-full border-b dark:border-white/[0.08] border-slate-200/80 dark:bg-[#070A13]/90 bg-white/90 backdrop-blur-2xl transition-colors duration-300">
      
      {/* Top blue animated gradient beam */}
      <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-sky-400 to-white animate-gradient-x" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20">
          
          {/* Brand Identity - Dart with Butterfly Holding a Dart Logo */}
          <div 
            onClick={() => setActiveTab('projects')}
            className="flex items-center space-x-3 cursor-pointer select-none group"
          >
            <div className="relative">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-sky-400 to-white p-[1.5px] shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/50 group-hover:scale-105 transition-all duration-300">
                <div className="w-full h-full dark:bg-[#0B101E] bg-white rounded-[14px] flex items-center justify-center p-1">
                  <DartLogo size={36} animate />
                </div>
              </div>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-80"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-600"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="font-black text-xl sm:text-2xl dark:text-white text-slate-900 tracking-tight">
                  Dart
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full dark:bg-blue-500/15 bg-blue-50 text-blue-600 dark:text-blue-400 font-mono font-bold border dark:border-blue-500/30 border-blue-200">
                  <Zap className="w-3 h-3 fill-current" />
                  Pollar SDK
                </span>
              </div>
              <p className="text-[11px] sm:text-xs dark:text-slate-400 text-slate-500 font-medium">
                Cryptographic Stellar Voting
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1.5 p-1.5 dark:bg-white/[0.04] bg-slate-100/80 border dark:border-white/[0.08] border-slate-200 rounded-2xl shadow-inner">
            <button
              onClick={() => setActiveTab('projects')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                activeTab === 'projects'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 scale-[1.02]'
                  : 'dark:text-slate-300 text-slate-600 hover:text-blue-600 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/[0.05]'
              }`}
            >
              <Flame className={`w-4 h-4 ${activeTab === 'projects' ? 'animate-bounce text-white' : ''}`} />
              <span>Projects</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${
                activeTab === 'projects' ? 'bg-white/20 text-white' : 'dark:bg-white/[0.08] bg-slate-200 text-slate-700 dark:text-slate-300'
              }`}>
                {projectsCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                activeTab === 'leaderboard'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 scale-[1.02]'
                  : 'dark:text-slate-300 text-slate-600 hover:text-blue-600 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/[0.05]'
              }`}
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Leaderboard</span>
            </button>

            <button
              onClick={() => setActiveTab('audit')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                activeTab === 'audit'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 scale-[1.02]'
                  : 'dark:text-slate-300 text-slate-600 hover:text-blue-600 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/[0.05]'
              }`}
            >
              <SearchCode className="w-4 h-4 text-sky-400" />
              <span>Audit Ledger</span>
            </button>
          </nav>

          {/* Action CTAs, Dark/Light Toggle & User Login */}
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            
            {/* Check My Vote Quick Pill */}
            {userVote && onCheckMyVote && (
              <button
                onClick={onCheckMyVote}
                className="hidden sm:flex items-center space-x-1.5 px-3 py-2 rounded-2xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-600 dark:text-blue-400 text-xs font-bold transition-all shadow-sm group hover:scale-[1.02]"
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
              className="relative p-2.5 rounded-2xl dark:bg-white/[0.06] bg-slate-100 hover:bg-slate-200 dark:hover:bg-white/[0.12] border dark:border-white/[0.1] border-slate-200 text-slate-700 dark:text-slate-200 transition-all duration-300 hover:rotate-45"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-300" />
              ) : (
                <Moon className="w-4 h-4 text-blue-600" />
              )}
            </button>

            {/* Submit Project CTA */}
            <button
              onClick={onOpenSubmit}
              className="hidden lg:flex items-center space-x-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold dark:bg-white/[0.06] bg-slate-100 hover:bg-slate-200 dark:hover:bg-white/[0.1] dark:text-white text-slate-800 border dark:border-white/[0.1] border-slate-200 transition-all hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4 text-blue-500" />
              <span>Submit Project</span>
            </button>

            {/* User Profile or Connect Button */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="flex items-center space-x-2.5 p-1.5 pl-3 pr-2.5 rounded-2xl dark:bg-white/[0.06] bg-slate-100 hover:bg-slate-200 dark:hover:bg-white/[0.1] border dark:border-white/[0.12] border-slate-200 transition-all shadow-sm"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl object-cover ring-2 ring-blue-500/50"
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
                            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Active Vote Banner in Profile */}
                      {userVote ? (
                        <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/25 mb-3">
                          <div className="flex items-center justify-between text-xs text-blue-600 dark:text-blue-400 font-bold mb-1">
                            <span className="flex items-center gap-1.5">
                              <CheckCircle className="w-3.5 h-3.5" />
                              Your Active Vote
                            </span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/20">SEP-53</span>
                          </div>
                          <p className="font-extrabold text-xs dark:text-white text-slate-900 truncate">{userVote.projectName}</p>
                          {onCheckMyVote && (
                            <button
                              type="button"
                              onClick={() => {
                                setShowMenu(false);
                                onCheckMyVote();
                              }}
                              className="mt-2 w-full py-1.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] shadow-sm transition-all"
                            >
                              Check Vote Proof & Receipt
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="p-3 rounded-2xl dark:bg-white/[0.04] bg-slate-50 border dark:border-white/[0.06] border-slate-200 mb-3 text-center">
                          <p className="text-[11px] dark:text-slate-400 text-slate-500">No active vote cast yet</p>
                          <button
                            type="button"
                            onClick={() => {
                              setShowMenu(false);
                              setActiveTab('projects');
                            }}
                            className="mt-1 text-xs text-blue-500 hover:underline font-bold"
                          >
                            Browse Projects to Vote
                          </button>
                        </div>
                      )}

                      <div className="space-y-1">
                        <button
                          type="button"
                          onClick={() => {
                            setShowMenu(false);
                            onOpenAuth();
                          }}
                          className="w-full flex items-center space-x-2.5 px-3 py-2.5 text-xs font-semibold dark:text-slate-300 text-slate-700 hover:bg-blue-500/10 dark:hover:bg-white/[0.05] rounded-xl transition-colors cursor-pointer"
                        >
                          <User className="w-4 h-4 text-blue-500" />
                          <span>Switch Persona</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-2.5 px-3 py-2.5 text-xs font-semibold text-red-500 hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Disconnect</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="shimmer-sweep flex items-center space-x-2 px-4 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 transition-all hover:scale-105 active:scale-95"
              >
                <Wallet className="w-4 h-4 fill-white" />
                <span>Connect Pollar</span>
              </button>
            )}

          </div>

        </div>

        {/* Mobile Submenu Navigation */}
        <div className="flex md:hidden items-center justify-around py-3 border-t dark:border-white/[0.08] border-slate-200 text-xs font-bold">
          <button
            onClick={() => setActiveTab('projects')}
            className={`flex items-center space-x-1.5 py-1.5 px-3.5 rounded-xl transition-all ${
              activeTab === 'projects' 
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25' 
                : 'dark:text-slate-400 text-slate-600'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Projects ({projectsCount})</span>
          </button>
          
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`flex items-center space-x-1.5 py-1.5 px-3.5 rounded-xl transition-all ${
              activeTab === 'leaderboard' 
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25' 
                : 'dark:text-slate-400 text-slate-600'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Leaderboard</span>
          </button>
          
          <button
            onClick={() => setActiveTab('audit')}
            className={`flex items-center space-x-1.5 py-1.5 px-3.5 rounded-xl transition-all ${
              activeTab === 'audit' 
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25' 
                : 'dark:text-slate-400 text-slate-600'
            }`}
          >
            <SearchCode className="w-3.5 h-3.5 text-sky-400" />
            <span>Audit</span>
          </button>

          {userVote && onCheckMyVote && (
            <button
              onClick={onCheckMyVote}
              className="flex items-center space-x-1 py-1.5 px-2.5 rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30 font-bold"
            >
              <CheckCircle className="w-3.5 h-3.5 text-blue-500" />
              <span>My Vote</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
