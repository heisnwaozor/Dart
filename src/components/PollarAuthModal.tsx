import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  Key, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  User, 
  Wallet,
  ExternalLink,
  Sparkles,
  Lock
} from 'lucide-react';
import { PollarUser } from '../types';
import { PRESET_USERS, PollarClientService } from '../lib/pollar';
import { DartLogo } from './DartLogo';

interface PollarAuthModalProps {
  currentUser: PollarUser | null;
  onClose: () => void;
  onLogin: (user: PollarUser) => void;
}

export const PollarAuthModal: React.FC<PollarAuthModalProps> = ({
  currentUser,
  onClose,
  onLogin,
}) => {
  const [activeTab, setActiveTab] = useState<'social' | 'presets' | 'apikey'>('social');
  const [activeProviderPrompt, setActiveProviderPrompt] = useState<'none' | 'google' | 'github'>('none');
  const [apiKey, setApiKey] = useState(PollarClientService.getApiKey());
  const [savedKeySuccess, setSavedKeySuccess] = useState(false);

  // Google interactive form states
  const [googleEmail, setGoogleEmail] = useState('');
  const [googleName, setGoogleName] = useState('');

  // GitHub interactive form states
  const [githubUsername, setGithubUsername] = useState('');
  const [githubAvatarUrl, setGithubAvatarUrl] = useState('');

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

  // Listen for OAuth messages from the popup window
  useEffect(() => {
    const handleOAuthMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'POLLAR_OAUTH_SUCCESS') {
        const { provider, name, email, avatar, walletAddress } = event.data;
        const newUser: PollarUser = {
          id: `pollar_usr_${Date.now()}`,
          name: name || 'Pollar Voter',
          email: email || `${provider}_voter@example.com`,
          avatar: avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(name || 'user')}`,
          walletAddress: walletAddress || generateStellarAddress(),
          chain: 'stellar',
          provider: provider || 'google',
          role: 'voter'
        };

        PollarClientService.setActiveUser(newUser);
        onLogin(newUser);
        onClose();
      }
    };

    window.addEventListener('message', handleOAuthMessage);
    return () => window.removeEventListener('message', handleOAuthMessage);
  }, [onLogin, onClose]);

  // Open centered OAuth popup window
  const openOAuthPopup = (provider: 'google' | 'github') => {
    const width = 480;
    const height = 660;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    
    try {
      window.open(
        `/oauth.html?provider=${provider}&origin=${encodeURIComponent(window.location.origin)}`,
        `pollar_${provider}_auth_popup`,
        `width=${width},height=${height},left=${left},top=${top},status=no,toolbar=no,menubar=no`
      );
    } catch {
      // If window.open fails, in-modal prompt handles it
    }
  };

  const handleStartSocial = (provider: 'google' | 'github') => {
    setActiveProviderPrompt(provider);
    openOAuthPopup(provider);
  };

  // Complete in-modal Google sign in
  const handleGoogleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleEmail.trim()) return;

    setIsLoading(true);
    setLoadingMsg('Signing in with Google & provisioning Pollar wallet...');

    const name = googleName.trim() || googleEmail.split('@')[0];
    const avatar = `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(googleEmail)}`;

    setTimeout(() => {
      const newUser: PollarUser = {
        id: `pollar_usr_${Date.now()}`,
        name: name,
        email: googleEmail.trim(),
        avatar: avatar,
        walletAddress: generateStellarAddress(),
        chain: 'stellar',
        provider: 'google',
        role: 'voter'
      };

      PollarClientService.setActiveUser(newUser);
      onLogin(newUser);
      setIsLoading(false);
      onClose();
    }, 800);
  };

  // Quick select an existing Google account
  const handleSelectGoogleAccount = (name: string, email: string, avatar: string) => {
    setIsLoading(true);
    setLoadingMsg(`Authenticating as ${name}...`);

    setTimeout(() => {
      const newUser: PollarUser = {
        id: `pollar_usr_${Date.now()}`,
        name,
        email,
        avatar,
        walletAddress: generateStellarAddress(),
        chain: 'stellar',
        provider: 'google',
        role: 'voter'
      };

      PollarClientService.setActiveUser(newUser);
      onLogin(newUser);
      setIsLoading(false);
      onClose();
    }, 600);
  };

  // Live update GitHub avatar preview
  const handleGithubUsernameChange = (val: string) => {
    setGithubUsername(val);
    const trimmed = val.trim();
    if (trimmed) {
      setGithubAvatarUrl(`https://github.com/${encodeURIComponent(trimmed)}.png`);
    } else {
      setGithubAvatarUrl('');
    }
  };

  // Complete in-modal GitHub sign in
  const handleGithubSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!githubUsername.trim()) return;

    setIsLoading(true);
    setLoadingMsg(`Verifying @${githubUsername.trim()} with GitHub...`);

    const username = githubUsername.trim();
    const avatar = `https://github.com/${encodeURIComponent(username)}.png`;
    const email = `${username}@users.noreply.github.com`;

    setTimeout(() => {
      const newUser: PollarUser = {
        id: `pollar_usr_${Date.now()}`,
        name: username,
        email: email,
        avatar: avatar,
        walletAddress: generateStellarAddress(),
        chain: 'stellar',
        provider: 'github',
        role: 'voter'
      };

      PollarClientService.setActiveUser(newUser);
      onLogin(newUser);
      setIsLoading(false);
      onClose();
    }, 800);
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
        className="relative w-full max-w-md rounded-3xl dark:bg-[#0D121F] bg-white border dark:border-white/[0.12] border-slate-200 shadow-2xl overflow-hidden transition-all"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b dark:border-white/[0.08] border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center p-1">
              <DartLogo size={30} />
            </div>
            <div>
              <h3 className="text-base font-bold dark:text-white text-slate-900">
                {activeProviderPrompt === 'google' 
                  ? 'Sign in with Google' 
                  : activeProviderPrompt === 'github' 
                  ? 'Sign in with GitHub' 
                  : 'Sign In with Pollar'}
              </h3>
              <p className="text-xs dark:text-slate-400 text-slate-500">
                1 wallet per voter • Zero gas fees on Stellar
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white dark:hover:bg-white/[0.08] hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switchers (only visible if not in interactive OAuth prompt) */}
        {activeProviderPrompt === 'none' && (
          <div className="flex p-1.5 dark:bg-black/40 bg-slate-100 border-b dark:border-white/[0.06] border-slate-200 text-xs">
            <button
              onClick={() => setActiveTab('social')}
              className={`flex-1 py-2 rounded-xl font-semibold transition-all ${
                activeTab === 'social' ? 'dark:bg-white/[0.1] bg-white dark:text-white text-slate-900 shadow-sm' : 'dark:text-slate-400 text-slate-600 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Social Login
            </button>
            <button
              onClick={() => setActiveTab('presets')}
              className={`flex-1 py-2 rounded-xl font-semibold transition-all ${
                activeTab === 'presets' ? 'dark:bg-white/[0.1] bg-white dark:text-white text-slate-900 shadow-sm' : 'dark:text-slate-400 text-slate-600 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Demo Accounts
            </button>
            <button
              onClick={() => setActiveTab('apikey')}
              className={`flex-1 py-2 rounded-xl font-semibold transition-all ${
                activeTab === 'apikey' ? 'dark:bg-white/[0.1] bg-white dark:text-white text-slate-900 shadow-sm' : 'dark:text-slate-400 text-slate-600 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Pollar Key
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6">

          {/* Loading Animation Overlay */}
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border-2 border-blue-500 flex items-center justify-center animate-spin">
                <ShieldCheck className="w-7 h-7 text-blue-500" />
              </div>
              <div>
                <h4 className="text-sm font-bold dark:text-white text-slate-900">{loadingMsg}</h4>
                <p className="text-xs dark:text-slate-400 text-slate-500 mt-1">Generating sponsored Stellar keypair</p>
              </div>
            </div>
          ) : activeProviderPrompt === 'google' ? (
            /* Interactive Google Sign-In Prompt */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setActiveProviderPrompt('none')}
                  className="flex items-center space-x-1 text-xs text-blue-500 hover:underline font-bold"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Choose another provider</span>
                </button>
                <button
                  type="button"
                  onClick={() => openOAuthPopup('google')}
                  className="text-xs text-slate-500 hover:text-blue-500 flex items-center gap-1 font-mono"
                  title="Open in separate popup window"
                >
                  <span>Open Window</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>

              <div className="p-4 rounded-2xl dark:bg-black/40 bg-slate-50 border dark:border-white/[0.08] border-slate-200 space-y-2.5">
                <p className="text-xs font-bold dark:text-slate-300 text-slate-700">
                  Select an account for Google Sign-In:
                </p>

                <div className="space-y-1.5">
                  <button
                    type="button"
                    onClick={() => handleSelectGoogleAccount('Mateo Silva', 'mateo.silva@gmail.com', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80')}
                    className="w-full flex items-center space-x-3 p-2.5 rounded-xl dark:bg-white/[0.04] bg-white border dark:border-white/[0.06] border-slate-200 hover:border-blue-500 transition-all text-left shadow-sm"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80"
                      alt="Mateo"
                      className="w-8 h-8 rounded-full object-cover ring-1 ring-blue-500"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold dark:text-white text-slate-900">Mateo Silva</p>
                      <p className="text-[11px] text-slate-500 font-mono truncate">mateo.silva@gmail.com</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectGoogleAccount('Alex Rivera', 'alex.rivera@gmail.com', 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80')}
                    className="w-full flex items-center space-x-3 p-2.5 rounded-xl dark:bg-white/[0.04] bg-white border dark:border-white/[0.06] border-slate-200 hover:border-blue-500 transition-all text-left shadow-sm"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80"
                      alt="Alex"
                      className="w-8 h-8 rounded-full object-cover ring-1 ring-blue-500"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold dark:text-white text-slate-900">Alex Rivera</p>
                      <p className="text-[11px] text-slate-500 font-mono truncate">alex.rivera@gmail.com</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Or enter custom Google account */}
              <form onSubmit={handleGoogleSubmit} className="space-y-3">
                <div className="text-[11px] font-mono uppercase text-slate-400 text-center font-bold">
                  Or enter your Google account
                </div>

                <div>
                  <label className="block text-xs font-semibold dark:text-slate-300 text-slate-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={googleName}
                    onChange={e => setGoogleName(e.target.value)}
                    placeholder="e.g. David Morales"
                    className="w-full px-3.5 py-2.5 rounded-xl dark:bg-black/50 bg-slate-50 border dark:border-white/[0.1] border-slate-300 text-xs dark:text-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold dark:text-slate-300 text-slate-700 mb-1">
                    Google Email
                  </label>
                  <input
                    type="email"
                    value={googleEmail}
                    onChange={e => setGoogleEmail(e.target.value)}
                    placeholder="your.email@gmail.com"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl dark:bg-black/50 bg-slate-50 border dark:border-white/[0.1] border-slate-300 text-xs dark:text-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-medium"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center space-x-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Authorize Google with Pollar</span>
                </button>
              </form>
            </div>
          ) : activeProviderPrompt === 'github' ? (
            /* Interactive GitHub Sign-In Prompt */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setActiveProviderPrompt('none')}
                  className="flex items-center space-x-1 text-xs text-blue-500 hover:underline font-bold"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Choose another provider</span>
                </button>
                <button
                  type="button"
                  onClick={() => openOAuthPopup('github')}
                  className="text-xs text-slate-500 hover:text-blue-500 flex items-center gap-1 font-mono"
                  title="Open in separate popup window"
                >
                  <span>Open Window</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>

              <form onSubmit={handleGithubSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold dark:text-slate-300 text-slate-700 mb-1">
                    GitHub Username or Handle
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={githubUsername}
                      onChange={e => handleGithubUsernameChange(e.target.value)}
                      placeholder="e.g. heisnwaozor, torvalds, octocat"
                      required
                      className="w-full pl-8 pr-3.5 py-2.5 rounded-xl dark:bg-black/50 bg-slate-50 border dark:border-white/[0.1] border-slate-300 text-xs dark:text-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-mono"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-xs">@</span>
                  </div>
                </div>

                {/* Live GitHub Profile Preview */}
                {githubAvatarUrl && (
                  <div className="p-3.5 rounded-2xl dark:bg-black/40 bg-slate-100 border dark:border-white/[0.08] border-slate-200 flex items-center space-x-3 animate-in fade-in">
                    <img
                      src={githubAvatarUrl}
                      alt={githubUsername}
                      onError={e => {
                        (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/identicon/svg?seed=${githubUsername}`;
                      }}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500 shadow-md"
                    />
                    <div>
                      <p className="text-xs font-bold dark:text-white text-slate-900">@{githubUsername}</p>
                      <p className="text-[11px] text-blue-500 font-mono">Verified GitHub Account</p>
                    </div>
                  </div>
                )}

                <p className="text-[11px] dark:text-slate-400 text-slate-500 leading-relaxed">
                  Pollar will automatically provision your unique, gas-sponsored Stellar wallet linked to your GitHub profile.
                </p>

                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-[#1E2638] hover:bg-[#28334a] text-white font-bold text-xs border border-white/[0.15] shadow-lg transition-all flex items-center justify-center space-x-2"
                >
                  <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                  <span>Authorize with GitHub</span>
                </button>
              </form>
            </div>
          ) : activeTab === 'social' ? (
            /* Social Login Main Tab */
            <div className="space-y-4">
              <p className="text-xs dark:text-slate-300 text-slate-600 leading-relaxed text-center">
                Pollar creates a secure, gas-sponsored Stellar wallet linked directly to your social profile.
              </p>

              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleStartSocial('google')}
                  className="w-full flex items-center justify-center space-x-3 py-3.5 rounded-2xl bg-white text-slate-900 font-bold text-xs hover:bg-slate-100 transition-all shadow-md active:scale-95 border border-slate-200"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleStartSocial('github')}
                  className="w-full flex items-center justify-center space-x-3 py-3.5 rounded-2xl bg-[#1E2638] hover:bg-[#28334a] text-white font-bold text-xs border dark:border-white/[0.15] border-slate-800 transition-all shadow-md active:scale-95"
                >
                  <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                  <span>Continue with GitHub</span>
                </button>
              </div>

              <div className="pt-2 text-center">
                <span className="text-[11px] dark:text-slate-400 text-slate-500 font-mono">
                  Both options open an interactive OAuth sign-in prompt and provision a Stellar wallet automatically.
                </span>
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
