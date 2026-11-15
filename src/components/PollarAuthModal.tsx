import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Key, 
  CheckCircle2, 
  ArrowRight,
  User,
  Wallet
} from 'lucide-react';
import { PollarUser } from '../types';
import { PRESET_USERS, PollarClientService } from '../lib/pollar';

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
  const [apiKey, setApiKey] = useState(PollarClientService.getApiKey());
  const [customName, setCustomName] = useState('');
  const [savedKeySuccess, setSavedKeySuccess] = useState(false);

  const handleSocialSelect = (provider: 'google' | 'github' | 'email') => {
    const chars = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let stellarAddr = 'G';
    for (let i = 0; i < 55; i++) {
      stellarAddr += chars[Math.floor(Math.random() * chars.length)];
    }

    const newUser: PollarUser = {
      id: `pollar_usr_${Date.now()}`,
      name: customName || (provider === 'google' ? 'Alex Rivera' : 'Camila Dev'),
      email: `${customName.toLowerCase().replace(/\s+/g, '') || 'voter'}@example.com`,
      avatar: provider === 'google' 
        ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'
        : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
      walletAddress: stellarAddr,
      chain: 'stellar',
      provider: provider,
      role: 'voter'
    };

    PollarClientService.setActiveUser(newUser);
    onLogin(newUser);
    onClose();
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
        className="relative w-full max-w-md rounded-3xl bg-[#0D121F] border border-white/[0.12] shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/[0.08]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-pollar/10 border border-pollar/30 flex items-center justify-center text-pollar">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Sign In with Pollar</h3>
              <p className="text-xs text-gray-400">1-click social login • 1 wallet per voter</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/[0.08]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switchers */}
        <div className="flex p-1.5 bg-black/40 border-b border-white/[0.06] text-xs">
          <button
            onClick={() => setActiveTab('social')}
            className={`flex-1 py-2 rounded-xl font-semibold transition-all ${
              activeTab === 'social' ? 'bg-white/[0.1] text-white shadow-sm' : 'text-gray-400 hover:text-white'
            }`}
          >
            Social Login
          </button>
          <button
            onClick={() => setActiveTab('presets')}
            className={`flex-1 py-2 rounded-xl font-semibold transition-all ${
              activeTab === 'presets' ? 'bg-white/[0.1] text-white shadow-sm' : 'text-gray-400 hover:text-white'
            }`}
          >
            Demo Accounts
          </button>
          <button
            onClick={() => setActiveTab('apikey')}
            className={`flex-1 py-2 rounded-xl font-semibold transition-all ${
              activeTab === 'apikey' ? 'bg-white/[0.1] text-white shadow-sm' : 'text-gray-400 hover:text-white'
            }`}
          >
            Pollar Key
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6">
          {activeTab === 'social' && (
            <div className="space-y-4">
              <p className="text-xs text-gray-300 leading-relaxed text-center">
                Pollar creates a secure, gas-sponsored Stellar wallet linked directly to your social profile.
              </p>

              <div>
                <input
                  type="text"
                  value={customName}
                  onChange={e => setCustomName(e.target.value)}
                  placeholder="Optional: Enter your voter name"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-white placeholder-gray-500 mb-3 focus:outline-none focus:border-stellar/50"
                />
              </div>

              <div className="space-y-2.5">
                <button
                  onClick={() => handleSocialSelect('google')}
                  className="w-full flex items-center justify-center space-x-3 py-3 rounded-2xl bg-white text-black font-bold text-xs hover:bg-gray-100 transition-all shadow-md active:scale-95"
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
                  onClick={() => handleSocialSelect('github')}
                  className="w-full flex items-center justify-center space-x-3 py-3 rounded-2xl bg-[#1E2638] text-white font-bold text-xs hover:bg-[#28334a] border border-white/[0.1] transition-all active:scale-95"
                >
                  <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                  <span>Continue with GitHub</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'presets' && (
            <div className="space-y-2">
              <p className="text-xs text-gray-400 mb-2">
                Click any persona to quickly test voting with different Stellar wallets:
              </p>
              {PRESET_USERS.slice(0, 3).map(user => (
                <button
                  key={user.id}
                  onClick={() => handleSelectPreset(user)}
                  className="w-full flex items-center justify-between p-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] text-left transition-all"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-xl object-cover ring-1 ring-white/10"
                    />
                    <div>
                      <p className="text-xs font-bold text-white">{user.name}</p>
                      <p className="text-[10px] text-pollar font-mono">
                        {user.walletAddress.substring(0, 6)}...{user.walletAddress.slice(-4)}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-500" />
                </button>
              ))}
            </div>
          )}

          {activeTab === 'apikey' && (
            <form onSubmit={handleSaveApiKey} className="space-y-4">
              <p className="text-xs text-gray-400">
                Configure your custom Pollar Client API Key for production deployment:
              </p>

              <div>
                <label className="block text-xs font-mono text-gray-400 mb-1">
                  POLLAR_CLIENT_KEY
                </label>
                <input
                  type="text"
                  value={apiKey}
                  onChange={e => setApiKey(e.target.value)}
                  placeholder="pk_live_..."
                  className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-stellar focus:outline-none focus:border-stellar/50"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-stellar text-black font-bold text-xs shadow-md shadow-stellar/20 transition-all"
              >
                Save Pollar Key
              </button>

              {savedKeySuccess && (
                <p className="text-center text-xs text-pollar font-mono flex items-center justify-center gap-1">
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
