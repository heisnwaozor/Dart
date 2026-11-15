import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  Key, 
  CheckCircle2, 
  ArrowRight, 
  ExternalLink,
  Lock,
  UserPlus,
  LogIn,
  Database,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { PollarUser } from '../types';
import { PRESET_USERS, PollarClientService } from '../lib/pollar';
import { DatabaseService } from '../lib/databaseService';
import { DartLogo } from './DartLogo';

interface PollarAuthModalProps {
  currentUser: PollarUser | null;
  onClose: () => void;
  onLogin: (user: PollarUser) => void;
  initialTab?: 'signup' | 'signin' | 'presets' | 'create' | 'social';
  defaultRole?: 'voter' | 'builder';
}

export const PollarAuthModal: React.FC<PollarAuthModalProps> = ({
  currentUser,
  onClose,
  onLogin,
  initialTab = 'signup',
  defaultRole = 'voter',
}) => {
  const normalizedInitialTab = initialTab === 'create' ? 'signup' : (initialTab === 'social' ? 'signin' : initialTab);
  const [activeTab, setActiveTab] = useState<'signup' | 'signin' | 'presets'>(normalizedInitialTab as 'signup' | 'signin' | 'presets');

  // Sign Up Form States
  const [signupRole, setSignupRole] = useState<'voter' | 'builder'>(defaultRole);
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupWallet, setSignupWallet] = useState('');

  // Sign In Form States
  const [signinIdentifier, setSigninIdentifier] = useState('');

  // Messages and UI states
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');
  const [showPresetsDrawer, setShowPresetsDrawer] = useState(false);

  // Google OAuth Client ID
  const googleClientId = '892650901835-atcmdam7hmktaps9d52kfreij87ghu0p.apps.googleusercontent.com';

  // Generate random 56-char base32 Stellar address
  const generateStellarAddress = () => {
    const chars = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let stellarAddr = 'G';
    for (let i = 0; i < 55; i++) {
      stellarAddr += chars[Math.floor(Math.random() * chars.length)];
    }
    return stellarAddr;
  };

  // Initialize signup wallet on mount
  useEffect(() => {
    if (!signupWallet) {
      setSignupWallet(generateStellarAddress());
    }
  }, []);

  // Process and authenticate a user through SQLite database
  const completeUserAuthentication = async (userData: {
    name: string;
    email: string;
    avatar?: string;
    provider: 'google' | 'github' | 'direct';
    preferredRole?: 'voter' | 'builder';
  }) => {
    setIsLoading(true);
    setLoadingMsg(`Checking account for ${userData.email} in database...`);

    try {
      // 1. Look up user by email in SQLite database
      const existingUser = await DatabaseService.getUserByEmail(userData.email);

      if (existingUser) {
        setLoadingMsg(`Welcome back, ${existingUser.name}! Restoring session...`);
        setTimeout(() => {
          PollarClientService.setActiveUser(existingUser);
          onLogin(existingUser);
          setIsLoading(false);
          onClose();
        }, 500);
        return;
      }

      // 2. If new user, create new account and persist into SQLite database
      setLoadingMsg(`Creating new ${userData.preferredRole || 'voter'} account in database...`);
      const newWallet = generateStellarAddress();
      const newUser: PollarUser = {
        id: `usr_${Date.now()}`,
        name: userData.name || userData.email.split('@')[0],
        email: userData.email,
        avatar: userData.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(userData.email)}`,
        walletAddress: newWallet,
        chain: 'stellar',
        provider: userData.provider,
        role: userData.preferredRole || 'voter'
      };

      await DatabaseService.registerUser(newUser);

      setTimeout(() => {
        PollarClientService.setActiveUser(newUser);
        onLogin(newUser);
        setIsLoading(false);
        onClose();
      }, 600);
    } catch (err: any) {
      console.warn('Database user sync notice:', err);
      // Fallback local provision
      const fallbackUser: PollarUser = {
        id: `usr_${Date.now()}`,
        name: userData.name || userData.email.split('@')[0],
        email: userData.email,
        avatar: userData.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(userData.email)}`,
        walletAddress: generateStellarAddress(),
        chain: 'stellar',
        provider: userData.provider,
        role: userData.preferredRole || 'voter'
      };
      PollarClientService.setActiveUser(fallbackUser);
      onLogin(fallbackUser);
      setIsLoading(false);
      onClose();
    }
  };

  // Listen for OAuth messages from popup or storage events
  useEffect(() => {
    const handleAuthPayload = (payload: any) => {
      if (payload && payload.type === 'POLLAR_OAUTH_SUCCESS') {
        completeUserAuthentication({
          name: payload.name,
          email: payload.email,
          avatar: payload.avatar,
          provider: payload.provider || 'google',
          preferredRole: signupRole
        });
      }
    };

    const handleOAuthMessage = (event: MessageEvent) => {
      handleAuthPayload(event.data);
    };

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'pollar_oauth_success' && event.newValue) {
        try {
          const parsed = JSON.parse(event.newValue);
          localStorage.removeItem('pollar_oauth_success');
          handleAuthPayload(parsed);
        } catch (e) {}
      }
    };

    window.addEventListener('message', handleOAuthMessage);
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('message', handleOAuthMessage);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [signupRole, onLogin, onClose]);

  // Start Official Google OAuth
  const handleStartGoogle = () => {
    setIsLoading(true);
    setLoadingMsg('Connecting to Google accounts...');

    const width = 500;
    const height = 650;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const popupUrl = `/oauth.html?provider=google&client_id=${encodeURIComponent(googleClientId)}&origin=${encodeURIComponent(window.location.origin)}`;

    try {
      window.open(
        popupUrl,
        'pollar_google_auth_popup',
        `width=${width},height=${height},left=${left},top=${top},status=no,toolbar=no,menubar=no`
      );
    } catch (e) {
      console.warn('Window open notice:', e);
    }

    setTimeout(() => {
      setIsLoading(false);
    }, 1200);
  };

  // Start GitHub OAuth
  const handleStartGithub = () => {
    const width = 480;
    const height = 620;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    try {
      window.open(
        `/oauth.html?provider=github&origin=${encodeURIComponent(window.location.origin)}`,
        'pollar_github_auth_popup',
        `width=${width},height=${height},left=${left},top=${top},status=no,toolbar=no,menubar=no`
      );
    } catch (e) {
      console.warn('Window open notice:', e);
    }
  };

  // Manual Sign Up Form Submission
  const handleCreateAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const name = signupName.trim();
    const email = signupEmail.trim();

    if (!name) {
      setFormError('Please enter your full name or nickname.');
      return;
    }
    if (!email) {
      setFormError('Please enter your email address.');
      return;
    }

    completeUserAuthentication({
      name,
      email,
      provider: 'direct',
      preferredRole: signupRole
    });
  };

  // Manual Sign In Form Submission
  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const identifier = signinIdentifier.trim();
    if (!identifier) {
      setFormError('Please enter your registered email address or Stellar wallet.');
      return;
    }

    setIsLoading(true);
    setLoadingMsg(`Looking up account for ${identifier}...`);

    try {
      const user = await DatabaseService.getUserByEmail(identifier) || await DatabaseService.getUserByWallet(identifier);

      if (user) {
        setLoadingMsg(`Welcome back, ${user.name}!`);
        setTimeout(() => {
          PollarClientService.setActiveUser(user);
          onLogin(user);
          setIsLoading(false);
          onClose();
        }, 500);
      } else {
        setIsLoading(false);
        setFormError('No account found for this email in our database. Please switch to Create Account to register.');
      }
    } catch (err: any) {
      setIsLoading(false);
      setFormError('Error connecting to database. Please check your connection.');
    }
  };

  const handleSelectPreset = (user: PollarUser) => {
    PollarClientService.setActiveUser(user);
    onLogin(user);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="ctrl-card relative w-full max-w-md rounded-[32px] sm:rounded-[36px] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col transition-all"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 pb-3 sm:pb-4 border-b dark:border-white/[0.08] border-slate-200 flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                <DartLogo size={24} />
              </div>
              <div>
                <h3 className="text-base font-extrabold dark:text-white text-slate-900 leading-tight">
                  {activeTab === 'signup' ? 'Create an Account' : 'Sign In to Dart'}
                </h3>
                <p className="text-xs dark:text-slate-400 text-slate-500 font-medium">
                  {activeTab === 'signup' 
                    ? '1 wallet per voter • Zero gas fees on Stellar' 
                    : 'Access your voting ballots and submitted projects'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full dark:hover:bg-white/[0.08] hover:bg-slate-100 dark:text-slate-400 text-slate-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Traditional Auth Tabs: Create Account vs Sign In */}
          <div className="grid grid-cols-2 p-1 bg-[#ecefec] dark:bg-white/[0.06] rounded-full text-xs font-mono">
            <button
              type="button"
              onClick={() => {
                setActiveTab('signup');
                setFormError(null);
              }}
              className={`py-2 rounded-full font-bold transition-all text-center flex items-center justify-center gap-1.5 ${
                activeTab === 'signup' 
                  ? 'bg-[#05c92f] text-slate-950 font-black shadow-sm' 
                  : 'dark:text-slate-300 text-slate-700 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Create Account</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('signin');
                setFormError(null);
              }}
              className={`py-2 rounded-full font-bold transition-all text-center flex items-center justify-center gap-1.5 ${
                activeTab === 'signin' 
                  ? 'bg-[#05c92f] text-slate-950 font-black shadow-sm' 
                  : 'dark:text-slate-300 text-slate-700 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 pb-7 sm:pb-8 overflow-y-auto flex-1">

          {/* Loading Animation Overlay */}
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#05c92f]/10 border-2 border-[#05c92f] flex items-center justify-center animate-spin">
                <ShieldCheck className="w-7 h-7 text-[#05c92f]" />
              </div>
              <div>
                <h4 className="text-sm font-bold dark:text-white text-slate-900">{loadingMsg}</h4>
                <p className="text-xs dark:text-slate-400 text-slate-500 mt-1 font-mono">
                  Syncing with SQLite database (dart.sqlite)
                </p>
              </div>
            </div>
          ) : activeTab === 'signup' ? (
            /* CREATE ACCOUNT VIEW */
            <div className="space-y-3.5">
              
              {/* Primary OAuth Action: Continue with Google */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleStartGoogle}
                  className="ctrl-roll-button w-full flex items-center justify-center space-x-3 py-3 rounded-full bg-white text-slate-950 font-black text-xs sm:text-sm border-2 border-slate-950 shadow-md hover:scale-[1.01] active:scale-95 transition-all group"
                >
                  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span className="ctrl-roll-label">Sign Up with Google</span>
                </button>

                <button
                  type="button"
                  onClick={handleStartGithub}
                  className="ctrl-roll-button w-full flex items-center justify-center space-x-3 py-2.5 rounded-full bg-slate-950 text-white font-bold text-xs border-2 border-slate-950 shadow-sm hover:scale-[1.01] active:scale-95 transition-all group"
                >
                  <svg className="w-4 h-4 fill-white flex-shrink-0" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                  <span className="ctrl-roll-label">Sign Up with GitHub</span>
                </button>
              </div>

              {/* Clean Horizontal Divider */}
              <div className="flex items-center my-2">
                <div className="flex-1 border-t dark:border-white/10 border-slate-200"></div>
                <span className="px-3 text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-slate-400 flex-shrink-0">
                  or
                </span>
                <div className="flex-1 border-t dark:border-white/10 border-slate-200"></div>
              </div>

              {formError && (
                <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Direct Registration Form */}
              <form onSubmit={handleCreateAccountSubmit} className="space-y-3">
                
                {/* Role Switch */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSignupRole('voter')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all text-center flex flex-col items-center ${
                      signupRole === 'voter'
                        ? 'bg-[#05c92f] border-slate-950 text-slate-950 font-black shadow-sm'
                        : 'bg-[#ecefec] dark:bg-white/[0.04] border-slate-300 dark:border-white/10 dark:text-slate-300 text-slate-700'
                    }`}
                  >
                    <span>Voter Account</span>
                    <span className="text-[10px] opacity-75 font-normal">Cast SEP-53 ballots</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSignupRole('builder')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all text-center flex flex-col items-center ${
                      signupRole === 'builder'
                        ? 'bg-[#05c92f] border-slate-950 text-slate-950 font-black shadow-sm'
                        : 'bg-[#ecefec] dark:bg-white/[0.04] border-slate-300 dark:border-white/10 dark:text-slate-300 text-slate-700'
                    }`}
                  >
                    <span>Builder Account</span>
                    <span className="text-[10px] opacity-75 font-normal">Submit projects</span>
                  </button>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider dark:text-slate-400 text-slate-600 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={signupName}
                    onChange={e => setSignupName(e.target.value)}
                    placeholder="e.g. Satoshi Builder"
                    required
                    className="w-full px-3.5 py-2 rounded-xl dark:bg-black/50 bg-slate-50 border dark:border-white/[0.1] border-slate-300 text-xs dark:text-white text-slate-900"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider dark:text-slate-400 text-slate-600 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={signupEmail}
                    onChange={e => setSignupEmail(e.target.value)}
                    placeholder="your.email@gmail.com"
                    required
                    className="w-full px-3.5 py-2 rounded-xl dark:bg-black/50 bg-slate-50 border dark:border-white/[0.1] border-slate-300 text-xs dark:text-white text-slate-900"
                  />
                </div>

                {/* Submit button */}
                <div className="pt-1">
                  <button
                    type="submit"
                    className="ctrl-roll-button w-full py-3 rounded-full bg-[#05c92f] hover:bg-[#04b82a] text-slate-950 font-black text-xs sm:text-sm border-2 border-slate-950 shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 group"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span className="ctrl-roll-label">Create Account</span>
                  </button>
                </div>
              </form>

              <div className="text-center pt-1">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('signin');
                      setFormError(null);
                    }}
                    className="text-blue-500 hover:underline font-bold"
                  >
                    Sign In here
                  </button>
                </span>
              </div>
            </div>
          ) : (
            /* SIGN IN VIEW */
            <div className="space-y-3.5">
              
              {/* Primary OAuth Action: Sign In with Google */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleStartGoogle}
                  className="ctrl-roll-button w-full flex items-center justify-center space-x-3 py-3 rounded-full bg-white text-slate-950 font-black text-xs sm:text-sm border-2 border-slate-950 shadow-md hover:scale-[1.01] active:scale-95 transition-all group"
                >
                  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span className="ctrl-roll-label">Sign In with Google</span>
                </button>

                <button
                  type="button"
                  onClick={handleStartGithub}
                  className="ctrl-roll-button w-full flex items-center justify-center space-x-3 py-2.5 rounded-full bg-slate-950 text-white font-bold text-xs border-2 border-slate-950 shadow-sm hover:scale-[1.01] active:scale-95 transition-all group"
                >
                  <svg className="w-4 h-4 fill-white flex-shrink-0" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                  <span className="ctrl-roll-label">Sign In with GitHub</span>
                </button>
              </div>

              {/* Clean Horizontal Divider */}
              <div className="flex items-center my-2">
                <div className="flex-1 border-t dark:border-white/10 border-slate-200"></div>
                <span className="px-3 text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-slate-400 flex-shrink-0">
                  or
                </span>
                <div className="flex-1 border-t dark:border-white/10 border-slate-200"></div>
              </div>

              {formError && (
                <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Email Sign In Form */}
              <form onSubmit={handleSignInSubmit} className="space-y-3">
                <div>
                  <label className="block text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider dark:text-slate-400 text-slate-600 mb-1">
                    Your Registered Email or Wallet *
                  </label>
                  <input
                    type="text"
                    value={signinIdentifier}
                    onChange={e => setSigninIdentifier(e.target.value)}
                    placeholder="e.g. agbochidera95@gmail.com"
                    required
                    className="w-full px-3.5 py-2 rounded-xl dark:bg-black/50 bg-slate-50 border dark:border-white/[0.1] border-slate-300 text-xs dark:text-white text-slate-900"
                  />
                </div>

                <div className="pt-1">
                  <button
                    type="submit"
                    className="ctrl-roll-button w-full py-3 rounded-full bg-[#05c92f] hover:bg-[#04b82a] text-slate-950 font-black text-xs sm:text-sm border-2 border-slate-950 shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 group"
                  >
                    <LogIn className="w-4 h-4" />
                    <span className="ctrl-roll-label">Sign In</span>
                  </button>
                </div>
              </form>

              <div className="text-center pt-1">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  New to Dart?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('signup');
                      setFormError(null);
                    }}
                    className="text-blue-500 hover:underline font-bold"
                  >
                    Create an account
                  </button>
                </span>
              </div>
            </div>
          )}

          {/* Database Info Banner */}
          <div className="mt-5 pt-3 border-t dark:border-white/[0.06] border-slate-200 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-500">
              <Database className="w-3 h-3" />
              <span>SQLite Database: dart.sqlite</span>
            </span>

            <button
              type="button"
              onClick={() => setShowPresetsDrawer(!showPresetsDrawer)}
              className="text-slate-500 hover:text-slate-300 transition-colors"
            >
              {showPresetsDrawer ? 'Hide Demo Personas' : 'Demo Personas'}
            </button>
          </div>

          {/* Hidden/Collapsible Testing Presets */}
          {showPresetsDrawer && (
            <div className="mt-3 p-3 rounded-2xl bg-black/40 border border-white/10 space-y-2 animate-in fade-in duration-150">
              <p className="text-[10px] text-slate-400 font-mono">Instant test personas:</p>
              {PRESET_USERS.map(user => (
                <button
                  key={user.id}
                  onClick={() => handleSelectPreset(user)}
                  className="w-full flex items-center justify-between p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-left transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full object-cover" />
                    <span className="text-xs font-bold text-white">{user.name}</span>
                  </div>
                  <span className="text-[10px] text-blue-400 font-mono">Use Persona</span>
                </button>
              ))}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
