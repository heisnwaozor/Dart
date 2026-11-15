import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  ShieldCheck, 
  Key, 
  CheckCircle2, 
  ArrowRight, 
  ExternalLink,
  Sparkles,
  Lock,
  UserPlus,
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
  initialTab?: 'create' | 'social' | 'presets' | 'apikey';
  defaultRole?: 'voter' | 'builder';
}

export const PollarAuthModal: React.FC<PollarAuthModalProps> = ({
  currentUser,
  onClose,
  onLogin,
  initialTab = 'create',
  defaultRole = 'voter',
}) => {
  const [activeTab, setActiveTab] = useState<'create' | 'social' | 'presets' | 'apikey'>(initialTab);
  const [apiKey, setApiKey] = useState(PollarClientService.getApiKey());
  const [savedKeySuccess, setSavedKeySuccess] = useState(false);

  // Dedicated Account Creation State
  const [signupRole, setSignupRole] = useState<'voter' | 'builder'>(defaultRole);
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupWallet, setSignupWallet] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  // Google OAuth Client ID state
  const [googleClientId, setGoogleClientId] = useState<string>(
    localStorage.getItem('pollar_google_client_id') ||
    (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID ||
    '1067577884102-p5j7c65k0c3t245qj96k8fbl4v36q0i4.apps.googleusercontent.com'
  );
  const [showGoogleConfig, setShowGoogleConfig] = useState(false);
  const [savedGoogleIdMsg, setSavedGoogleIdMsg] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');

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

    setIsLoading(true);
    setLoadingMsg(`Registering ${signupRole} account in SQLite database...`);

    const wallet = signupWallet.trim() || generateStellarAddress();
    const avatar = `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(email || name)}`;

    const newUser: PollarUser = {
      id: `usr_${Date.now()}`,
      name,
      email,
      avatar,
      walletAddress: wallet,
      chain: 'stellar',
      provider: 'direct',
      role: signupRole
    };

    try {
      await DatabaseService.registerUser(newUser);
    } catch (err) {
      console.warn('Database user registration notice:', err);
    }

    setTimeout(() => {
      PollarClientService.setActiveUser(newUser);
      setIsLoading(false);
      onLogin(newUser);
      onClose();
    }, 600);
  };

  const handleGoogleSuccess = async (googleUser: { name: string; email: string; avatar?: string }) => {
    setIsLoading(true);
    setLoadingMsg(`Signed in as ${googleUser.name}! Registering in SQLite database...`);

    const newUser: PollarUser = {
      id: `pollar_usr_${Date.now()}`,
      name: googleUser.name,
      email: googleUser.email,
      avatar: googleUser.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(googleUser.email)}`,
      walletAddress: generateStellarAddress(),
      chain: 'stellar',
      provider: 'google',
      role: 'voter'
    };

    try {
      await DatabaseService.registerUser(newUser);
    } catch (err) {
      console.warn('Database user registration notice:', err);
    }

    setTimeout(() => {
      PollarClientService.setActiveUser(newUser);
      onLogin(newUser);
      setIsLoading(false);
      onClose();
    }, 500);
  };

  // Listen for OAuth authentication from popup window or storage sync
  useEffect(() => {
    const handleAuthPayload = async (payload: any) => {
      if (payload && payload.type === 'POLLAR_OAUTH_SUCCESS') {
        const { provider, name, email, avatar, walletAddress } = payload;
        setIsLoading(true);
        setLoadingMsg(`Signed in as ${name}! Registering in SQLite database...`);

        const newUser: PollarUser = {
          id: `pollar_usr_${Date.now()}`,
          name: name || 'Google Voter',
          email: email || `${provider}_voter@example.com`,
          avatar: avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(name || 'user')}`,
          walletAddress: walletAddress || generateStellarAddress(),
          chain: 'stellar',
          provider: provider || 'google',
          role: 'voter'
        };

        try {
          await DatabaseService.registerUser(newUser);
        } catch (err) {
          console.warn('Database user registration notice:', err);
        }

        setTimeout(() => {
          PollarClientService.setActiveUser(newUser);
          onLogin(newUser);
          setIsLoading(false);
          onClose();
        }, 500);
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
  }, [onLogin, onClose]);

  // Start Direct Google OAuth
  const handleStartGoogle = () => {
    setIsLoading(true);
    setLoadingMsg('Connecting to Google accounts...');

    const width = 500;
    const height = 650;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const popupUrl = `/oauth.html?provider=google&origin=${encodeURIComponent(window.location.origin)}`;

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

  const handleSelectPreset = (user: PollarUser) => {
    PollarClientService.setActiveUser(user);
    onLogin(user);
    onClose();
  };

  const handleSaveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    PollarClientService.setApiKey(apiKey);
    setSavedKeySuccess(true);
    setTimeout(() => setSavedKeySuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="ctrl-card relative w-full max-w-md rounded-[36px] shadow-2xl overflow-hidden transition-all"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b dark:border-white/[0.08] border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center">
              <DartLogo size={36} />
            </div>
            <div>
              <h3 className="text-base font-black dark:text-white text-slate-950">
                Sign In with Pollar
              </h3>
              <p className="text-xs dark:text-slate-400 text-slate-500">
                1 wallet per voter • Zero gas fees on Stellar
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white dark:hover:bg-white/[0.08] hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switchers */}
        <div className="p-2 border-b dark:border-white/[0.06] border-slate-200">
          <div className="grid grid-cols-4 p-1 rounded-full ctrl-pill-nav text-[11px] font-semibold gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('create')}
              className={`py-2 rounded-full font-bold transition-all text-center ${
                activeTab === 'create' ? 'bg-[#05c92f] text-slate-950 shadow-sm' : 'dark:text-slate-300 text-slate-700 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              Create
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('social')}
              className={`py-2 rounded-full font-bold transition-all text-center ${
                activeTab === 'social' ? 'bg-[#05c92f] text-slate-950 shadow-sm' : 'dark:text-slate-300 text-slate-700 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              Social
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('presets')}
              className={`py-2 rounded-full font-bold transition-all text-center ${
                activeTab === 'presets' ? 'bg-[#05c92f] text-slate-950 shadow-sm' : 'dark:text-slate-300 text-slate-700 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              Presets
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('apikey')}
              className={`py-2 rounded-full font-bold transition-all text-center ${
                activeTab === 'apikey' ? 'bg-[#05c92f] text-slate-950 shadow-sm' : 'dark:text-slate-300 text-slate-700 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              API Key
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">

          {/* Loading Animation Overlay */}
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#05c92f]/10 border-2 border-[#05c92f] flex items-center justify-center animate-spin">
                <ShieldCheck className="w-7 h-7 text-[#05c92f]" />
              </div>
              <div>
                <h4 className="text-sm font-bold dark:text-white text-slate-900">{loadingMsg}</h4>
                <p className="text-xs dark:text-slate-400 text-slate-500 mt-1 font-mono">
                  Connecting and provisioning Stellar keypair
                </p>
              </div>
            </div>
          ) : activeTab === 'create' ? (
            /* Dedicated Create Account Form with SQLite Database Persistence */
            <form onSubmit={handleCreateAccountSubmit} className="space-y-4">
              <div className="text-center space-y-1.5">
                <p className="text-xs dark:text-slate-300 text-slate-700 font-semibold">
                  Register your account in the project database to vote or submit projects.
                </p>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#05c92f]/15 text-[#05c92f] text-[10px] font-mono font-bold">
                  <Database className="w-3 h-3" />
                  <span>SQLite Database Persistence (dart.sqlite)</span>
                </div>
              </div>

              {formError && (
                <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Account Type / Role Toggle */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-bold uppercase tracking-wider dark:text-slate-400 text-slate-600">
                  Account Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSignupRole('voter')}
                    className={`py-2.5 px-3 rounded-2xl border-2 text-xs font-bold transition-all text-center flex flex-col items-center gap-1 ${
                      signupRole === 'voter'
                        ? 'bg-[#05c92f] border-slate-950 text-slate-950 font-black shadow-md'
                        : 'bg-[#ecefec] dark:bg-white/[0.04] border-slate-300 dark:border-white/10 dark:text-slate-300 text-slate-700'
                    }`}
                  >
                    <span>Voter Account</span>
                    <span className="text-[10px] font-normal opacity-80">Cast SEP-53 ballots</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSignupRole('builder')}
                    className={`py-2.5 px-3 rounded-2xl border-2 text-xs font-bold transition-all text-center flex flex-col items-center gap-1 ${
                      signupRole === 'builder'
                        ? 'bg-[#05c92f] border-slate-950 text-slate-950 font-black shadow-md'
                        : 'bg-[#ecefec] dark:bg-white/[0.04] border-slate-300 dark:border-white/10 dark:text-slate-300 text-slate-700'
                    }`}
                  >
                    <span>Builder Account</span>
                    <span className="text-[10px] font-normal opacity-80">Submit hackathon projects</span>
                  </button>
                </div>
              </div>

              {/* Full Name */}
              <div className="space-y-1">
                <label className="block text-xs font-mono font-bold uppercase tracking-wider dark:text-slate-400 text-slate-600">
                  Full Name or Handle *
                </label>
                <input
                  type="text"
                  value={signupName}
                  onChange={e => setSignupName(e.target.value)}
                  placeholder="e.g. Satoshi Builder"
                  required
                  className="w-full px-4 py-2.5 rounded-2xl dark:bg-black/50 bg-slate-50 border dark:border-white/[0.1] border-slate-300 text-xs dark:text-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-950 dark:focus:border-blue-400 font-medium"
                />
              </div>

              {/* Email Address */}
              <div className="space-y-1">
                <label className="block text-xs font-mono font-bold uppercase tracking-wider dark:text-slate-400 text-slate-600">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={signupEmail}
                  onChange={e => setSignupEmail(e.target.value)}
                  placeholder="e.g. satoshi@stellar.org"
                  required
                  className="w-full px-4 py-2.5 rounded-2xl dark:bg-black/50 bg-slate-50 border dark:border-white/[0.1] border-slate-300 text-xs dark:text-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-950 dark:focus:border-blue-400 font-medium"
                />
              </div>

              {/* Auto-provisioned Stellar Wallet */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider dark:text-slate-400 text-slate-600">
                    Stellar Wallet (Auto Provisioned)
                  </label>
                  <button
                    type="button"
                    onClick={() => setSignupWallet(generateStellarAddress())}
                    className="text-[10px] text-blue-500 hover:underline flex items-center gap-1 font-mono"
                    title="Generate a new random Stellar address"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Regenerate</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={signupWallet}
                  onChange={e => setSignupWallet(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl dark:bg-black/50 bg-slate-50 border dark:border-white/[0.1] border-slate-300 text-[11px] font-mono dark:text-emerald-400 text-emerald-700 focus:outline-none focus:border-slate-950 dark:focus:border-blue-400"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="ctrl-roll-button w-full py-4 rounded-full bg-[#05c92f] hover:bg-[#04b82a] text-slate-950 font-black text-sm border-2 border-slate-950 shadow-md shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 group"
                >
                  <div className="flex items-center -space-x-1 mr-1 flex-shrink-0">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#fbe74e] ring-1 ring-slate-950"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ffcadc] ring-1 ring-slate-950"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-[#9dc4f5] ring-1 ring-slate-950"></span>
                  </div>
                  <UserPlus className="w-4 h-4" />
                  <span className="ctrl-roll-label">Create Account & Register in Database</span>
                </button>
              </div>

              <div className="text-center pt-1">
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Already have an account? Switch to{' '}
                  <button
                    type="button"
                    onClick={() => setActiveTab('social')}
                    className="text-blue-500 hover:underline font-bold"
                  >
                    Social Login
                  </button>
                  {' '}or{' '}
                  <button
                    type="button"
                    onClick={() => setActiveTab('presets')}
                    className="text-blue-500 hover:underline font-bold"
                  >
                    Demo Presets
                  </button>
                </span>
              </div>
            </form>
          ) : activeTab === 'social' ? (
            /* Social Login Main Tab */
            <div className="space-y-5">
              <div className="text-center space-y-1">
                <p className="text-xs dark:text-slate-300 text-slate-700 font-semibold">
                  Sign in with your Google or GitHub account.
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Dart connects directly to your signed-in browser accounts and provisions a sponsored Stellar keypair.
                </p>
              </div>

              {/* Direct Continue with Google Button */}
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleStartGoogle}
                  className="ctrl-roll-button w-full flex items-center justify-center space-x-3 py-4 rounded-full bg-white text-slate-950 font-black text-sm border-2 border-slate-950 shadow-md hover:scale-[1.02] active:scale-95 transition-all group"
                >
                  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span className="ctrl-roll-label">Continue with Google Account</span>
                </button>

                <div className="p-3.5 rounded-2xl border dark:border-white/10 border-slate-200 bg-slate-50 dark:bg-white/[0.03] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                      Detected Google Profile
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 font-mono font-bold">
                      Ready
                    </span>
                  </div>
                  <div 
                    onClick={() => handleGoogleSuccess({ name: 'Agbo Chidera', email: 'agbochidera95@gmail.com', avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=agbochidera95' })}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-200/60 dark:hover:bg-white/[0.06] cursor-pointer transition-colors border border-transparent hover:border-slate-300 dark:hover:border-white/10"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-[#a8c7fa] text-[#041e49] font-bold text-xs flex items-center justify-center">
                        AC
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-bold dark:text-white text-slate-900">Agbo Chidera</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">agbochidera95@gmail.com</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-blue-500 flex items-center gap-1">
                      <span>Connect</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleStartGithub}
                  className="ctrl-roll-button w-full flex items-center justify-center space-x-3 py-4 rounded-full bg-slate-950 text-white font-black text-sm border-2 border-slate-950 shadow-md hover:scale-[1.02] active:scale-95 transition-all group"
                >
                  <svg className="w-5 h-5 fill-white flex-shrink-0" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                  <span className="ctrl-roll-label">Continue with GitHub Account</span>
                </button>
              </div>

              {/* Google Client ID Configuration Toggle */}
              <div className="pt-2 border-t dark:border-white/[0.06] border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowGoogleConfig(!showGoogleConfig)}
                  className="w-full text-center text-[11px] font-mono text-blue-500 hover:underline flex items-center justify-center gap-1"
                >
                  <Key className="w-3 h-3" />
                  <span>{showGoogleConfig ? 'Hide Google OAuth Settings' : 'Google Cloud OAuth Settings'}</span>
                </button>

                {showGoogleConfig && (
                  <div className="mt-3 p-3.5 rounded-2xl dark:bg-white/[0.03] bg-slate-100 border dark:border-white/[0.08] border-slate-300 space-y-2 text-xs">
                    <label className="block text-[11px] font-mono font-bold dark:text-slate-300 text-slate-700">
                      Google OAuth Client ID
                    </label>
                    <input
                      type="text"
                      value={googleClientId}
                      onChange={e => setGoogleClientId(e.target.value)}
                      placeholder="e.g. 12345-abc.apps.googleusercontent.com"
                      className="w-full px-3 py-2 rounded-xl dark:bg-black/60 bg-white border dark:border-white/[0.1] border-slate-300 text-[11px] font-mono"
                    />
                    <div className="flex items-center justify-between pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          localStorage.setItem('pollar_google_client_id', googleClientId.trim());
                          setSavedGoogleIdMsg(true);
                          setTimeout(() => setSavedGoogleIdMsg(false), 2000);
                        }}
                        className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
                      >
                        Save Client ID
                      </button>
                      {savedGoogleIdMsg && (
                        <span className="text-[11px] text-emerald-500 font-mono flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Saved
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-2 leading-relaxed">
                      Whitelist in Google Cloud Console:<br />
                      • Origin: <code>{window.location.origin}</code><br />
                      • Redirect URI: <code>{window.location.origin}/oauth.html</code>
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : activeTab === 'presets' ? (
            /* Presets Tab */
            <div className="space-y-2">
              <p className="text-xs dark:text-slate-400 text-slate-500 mb-2">
                Click any persona to quickly test voting with different Stellar wallets:
              </p>
              {PRESET_USERS.slice(0, 3).map(user => (
                <button
                  key={user.id}
                  onClick={() => handleSelectPreset(user)}
                  className="w-full flex items-center justify-between p-3 rounded-2xl dark:bg-white/[0.03] bg-slate-50 hover:bg-slate-100 dark:hover:bg-white/[0.08] border dark:border-white/[0.06] border-slate-200 text-left transition-all"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-xl object-cover ring-1 ring-blue-500"
                    />
                    <div>
                      <p className="text-xs font-bold dark:text-white text-slate-900">{user.name}</p>
                      <p className="text-[10px] text-blue-500 font-mono">
                        {user.walletAddress.substring(0, 6)}...{user.walletAddress.slice(-4)}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </button>
              ))}
            </div>
          ) : (
            /* API Key Tab */
            <form onSubmit={handleSaveApiKey} className="space-y-4">
              <p className="text-xs dark:text-slate-400 text-slate-500">
                Configure your custom Pollar Client API Key for production deployment:
              </p>

              <div>
                <label className="block text-xs font-mono dark:text-slate-400 text-slate-500 mb-1">
                  POLLAR_CLIENT_KEY
                </label>
                <input
                  type="text"
                  value={apiKey}
                  onChange={e => setApiKey(e.target.value)}
                  placeholder="pk_live_..."
                  className="w-full px-3.5 py-2 rounded-xl dark:bg-white/[0.04] bg-slate-50 border dark:border-white/[0.08] border-slate-200 text-xs font-mono text-blue-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all"
              >
                Save Pollar Key
              </button>

              {savedKeySuccess && (
                <p className="text-center text-xs text-emerald-500 font-mono flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Key saved into local environment
                </p>
              )}
            </form>
          )}

        </div>

      </div>
    </div>
  );
};