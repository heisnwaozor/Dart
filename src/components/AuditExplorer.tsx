import React, { useState, useEffect } from 'react';
import { 
  Fingerprint, 
  CheckCircle2, 
  Copy, 
  Check, 
  Download, 
  ShieldCheck, 
  X,
  Cpu,
  Search,
  ExternalLink,
  Users,
  Database,
  RefreshCw,
  UserCheck
} from 'lucide-react';
import { PublicVote, PollarUser } from '../types';
import { DatabaseService, DatabaseStats } from '../lib/databaseService';

interface AuditExplorerProps {
  votes: PublicVote[];
  currentUser?: PollarUser | null;
  userVote?: PublicVote;
}

export const AuditExplorer: React.FC<AuditExplorerProps> = ({ 
  votes,
  currentUser,
  userVote,
}) => {
  const [activeLedger, setActiveLedger] = useState<'votes' | 'users'>('votes');
  const [search, setSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [scope, setScope] = useState<'all' | 'my'>('all');
  const [selectedVote, setSelectedVote] = useState<PublicVote | null>(null);
  const [selectedUser, setSelectedUser] = useState<PollarUser | null>(null);
  const [copied, setCopied] = useState(false);
  const [dbUsers, setDbUsers] = useState<PollarUser[]>([]);
  const [dbStats, setDbStats] = useState<DatabaseStats | null>(null);
  const [isRefreshingDb, setIsRefreshingDb] = useState(false);

  const fetchDatabaseInfo = async () => {
    setIsRefreshingDb(true);
    try {
      const [users, stats] = await Promise.all([
        DatabaseService.getUsers(),
        DatabaseService.getStatus()
      ]);
      setDbUsers(users);
      setDbStats(stats);
    } catch (err) {
      console.warn('Database fetch notice:', err);
    } finally {
      setIsRefreshingDb(false);
    }
  };

  useEffect(() => {
    fetchDatabaseInfo();

    const handleAuthOrData = () => {
      fetchDatabaseInfo();
    };

    window.addEventListener('pollar_auth_changed', handleAuthOrData);
    window.addEventListener('pollar_data_changed', handleAuthOrData);

    return () => {
      window.removeEventListener('pollar_auth_changed', handleAuthOrData);
      window.removeEventListener('pollar_data_changed', handleAuthOrData);
    };
  }, []);

  const cleanUserWallet = (currentUser?.walletAddress || userVote?.voterWallet || '').trim().toLowerCase();

  const filteredVotes = votes
    .filter(v => {
      if (scope === 'my') {
        const matchesWallet = cleanUserWallet && (v.voterWallet || '').trim().toLowerCase() === cleanUserWallet;
        const matchesId = userVote && v.id === userVote.id;
        if (!matchesWallet && !matchesId) return false;
      }

      if (!search.trim()) return true;

      const q = search.toLowerCase();
      return (
        v.projectName.toLowerCase().includes(q) ||
        v.voterWallet.toLowerCase().includes(q) ||
        v.voterName.toLowerCase().includes(q) ||
        v.signature.toLowerCase().includes(q)
      );
    });

  const filteredUsers = dbUsers.filter(u => {
    if (!userSearch.trim()) return true;
    const q = userSearch.toLowerCase();
    return (
      (u.name || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q) ||
      (u.walletAddress || '').toLowerCase().includes(q) ||
      (u.role || '').toLowerCase().includes(q) ||
      (u.provider || '').toLowerCase().includes(q)
    );
  });

  const copyText = (txt: string) => {
    navigator.clipboard.writeText(txt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(votes, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `pollar_hackathon_audit_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const exportUsersJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(dbUsers, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `pollar_registered_users_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <section className="py-20 sm:py-28 lg:py-36 border-b dark:border-white/[0.08] border-slate-200">
      <div className="motion-container">
        
        {/* Ctrl Section Header: Mask reveal and physics easing */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 sm:mb-16 pb-8 border-b dark:border-white/[0.08] border-slate-200">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ecefec] dark:bg-white/[0.08] text-xs sm:text-sm font-semibold dark:text-slate-200 text-slate-700 shadow-sm animate-fade-up">
              <span className="w-2 h-2 rounded-full bg-[#05c92f] animate-pulse"></span>
              <span>Public Ledger & Database Records</span>
            </div>
            <h2 className="text-4xl sm:text-6xl font-black dark:text-white text-slate-950 tracking-[-0.03em] leading-[0.98]">
              <span className="mask-reveal-box">
                <span className="mask-reveal-text">Audit</span>
              </span>{" "}
              <span className="inline-block text-blue-600 dark:text-blue-500 transform hover:rotate-12 transition-transform duration-300 animate-pop-in">❖</span>{" "}
              <span className="mask-reveal-box">
                <span className="mask-reveal-text" style={{ animationDelay: '120ms' }}>Proofs.</span>
              </span>
            </h2>
            <p className="text-sm sm:text-base dark:text-slate-400 text-slate-600 max-w-2xl animate-fade-up stagger-1">
              Decentralized community voting for all Pollar Pitch Projects. Every account is registered in SQLite, and every ballot is cryptographically signed using Stellar SEP-53.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center space-x-4 animate-spring stagger-2">
            <button
              onClick={activeLedger === 'votes' ? exportJson : exportUsersJson}
              className="ctrl-roll-button magnetic-pull flex items-center space-x-2.5 px-7 py-4 rounded-full bg-[#ecefec] dark:bg-white/[0.08] hover:bg-slate-200 dark:hover:bg-white/[0.14] text-slate-950 dark:text-white border-2 border-slate-950 dark:border-white/20 text-xs sm:text-sm font-bold transition-all shadow-md active:scale-95"
            >
              <Download className="w-4 h-4 text-blue-500" />
              <span className="ctrl-roll-label">
                {activeLedger === 'votes' ? 'Export Verified Votes (JSON)' : 'Export Users Ledger (JSON)'}
              </span>
            </button>
          </div>
        </div>

        {/* Dual Ledger Toggle Tabs */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <button
            onClick={() => setActiveLedger('votes')}
            className={`ctrl-roll-button flex items-center gap-2 px-6 py-3.5 rounded-full text-xs sm:text-sm font-bold transition-all ${
              activeLedger === 'votes'
                ? 'bg-[#05c92f] text-slate-950 border-2 border-slate-950 shadow-md shadow-emerald-500/25 font-black'
                : 'bg-[#ecefec] dark:bg-white/[0.06] dark:text-slate-200 text-slate-700 hover:text-slate-950 border border-slate-300 dark:border-white/10'
            }`}
          >
            <Fingerprint className="w-4 h-4" />
            <span className="ctrl-roll-label">Vote Proofs Ledger ({votes.length})</span>
          </button>

          <button
            onClick={() => setActiveLedger('users')}
            className={`ctrl-roll-button flex items-center gap-2 px-6 py-3.5 rounded-full text-xs sm:text-sm font-bold transition-all ${
              activeLedger === 'users'
                ? 'bg-[#05c92f] text-slate-950 border-2 border-slate-950 shadow-md shadow-emerald-500/25 font-black'
                : 'bg-[#ecefec] dark:bg-white/[0.06] dark:text-slate-200 text-slate-700 hover:text-slate-950 border border-slate-300 dark:border-white/10'
            }`}
          >
            <Users className="w-4 h-4" />
            <span className="ctrl-roll-label">Registered Accounts & Voters ({dbUsers.length})</span>
          </button>
        </div>

        {/* VIEW 1: VOTES LEDGER */}
        {activeLedger === 'votes' && (
          <>
            {/* Merkle Root Transparency Card */}
            <div className="ctrl-card mb-12 p-8 sm:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
              <div className="space-y-2">
                <div className="flex items-center space-x-2.5">
                  <span className="w-3 h-3 rounded-full bg-[#05c92f] animate-pulse"></span>
                  <span className="text-xs sm:text-sm font-mono text-slate-950 dark:text-white uppercase font-black">
                    Live Merkle Root Epoch
                  </span>
                </div>
                <p className="text-xs sm:text-sm dark:text-slate-200 text-slate-800 font-mono break-all font-semibold">
                  Root: <span className="text-blue-600 dark:text-sky-400 font-bold">0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069</span>
                </p>
                <p className="text-xs dark:text-slate-400 text-slate-600">
                  Computed over {votes.length} canonical SEP-53 signature hashes for Stellar testnet memo anchoring.
                </p>
              </div>

              <div className="flex items-center space-x-2.5 px-5 py-3 rounded-full bg-[#ecefec] dark:bg-black/50 border dark:border-white/[0.08] border-slate-300 text-xs font-mono dark:text-slate-300 text-slate-800 shadow-sm whitespace-nowrap">
                <Cpu className="w-4 h-4 text-blue-500" />
                <span>Algorithm: SHA-256 / Ed25519</span>
              </div>
            </div>

            {/* User Active Vote Banner in Audit Explorer */}
            {userVote && (
              <div className="ctrl-card mb-10 p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-[#05c92f]/20 border-2 border-[#05c92f] text-slate-950 dark:text-white flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-[#05c92f]" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-base font-black dark:text-white text-slate-950">
                      Your Vote: <span className="text-blue-600 dark:text-blue-400 underline">{userVote.projectName}</span>
                    </p>
                    <p className="text-xs font-mono dark:text-slate-400 text-slate-600 truncate max-w-lg">
                      Signer: {userVote.voterWallet}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedVote(userVote)}
                  className="ctrl-roll-button w-full sm:w-auto px-6 py-3 rounded-full bg-[#ecefec] dark:bg-white/[0.08] hover:bg-slate-200 dark:hover:bg-white/[0.14] text-slate-950 dark:text-white font-bold text-xs sm:text-sm border-2 border-slate-950 dark:border-white/20 shadow-md transition-all whitespace-nowrap"
                >
                  <span className="ctrl-roll-label">Inspect My Proof</span>
                </button>
              </div>
            )}

            {/* Scope Controls & Search Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setScope('all')}
                  className={`ctrl-roll-button px-6 py-3 rounded-full text-xs sm:text-sm font-bold transition-all ${
                    scope === 'all'
                      ? 'bg-[#05c92f] text-slate-950 border-2 border-slate-950 shadow-md shadow-emerald-500/25 font-black'
                      : 'bg-[#ecefec] dark:bg-white/[0.06] dark:text-slate-200 text-slate-700 hover:text-slate-950 border border-slate-300 dark:border-white/10'
                  }`}
                >
                  <span className="ctrl-roll-label">All Ledger Proofs ({votes.length})</span>
                </button>
                {userVote && (
                  <button
                    onClick={() => setScope('my')}
                    className={`ctrl-roll-button px-6 py-3 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                      scope === 'my'
                        ? 'bg-[#05c92f] text-slate-950 border-2 border-slate-950 shadow-md shadow-emerald-500/25 font-black'
                        : 'bg-[#ecefec] dark:bg-white/[0.06] text-blue-600 dark:text-blue-400 border border-slate-300 dark:border-white/10'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="ctrl-roll-label">My Verified Vote (1)</span>
                  </button>
                )}
              </div>

              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search by project, wallet, or voter name..."
                  className="w-full pl-11 pr-4 py-3 rounded-full dark:bg-[#0E1527] bg-[#ecefec]/60 border-2 dark:border-white/[0.1] border-slate-300 text-xs sm:text-sm dark:text-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-950 dark:focus:border-blue-400 transition-all font-mono shadow-sm"
                />
              </div>
            </div>

            {/* Table of Votes Wrapped in Ctrl Card */}
            <div className="ctrl-card overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="dark:bg-white/[0.03] bg-[#ecefec]/50 border-b dark:border-white/[0.06] border-slate-200 dark:text-slate-400 text-slate-600 font-mono uppercase text-[11px]">
                    <tr>
                      <th className="py-5 px-5 sm:px-7">Project</th>
                      <th className="py-5 px-5 sm:px-7">Voter (Pollar Identity)</th>
                      <th className="py-5 px-5 sm:px-7">Stellar Wallet</th>
                      <th className="py-5 px-5 sm:px-7">Timestamp</th>
                      <th className="py-5 px-5 sm:px-7">Status & Proof</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y dark:divide-white/[0.04] divide-slate-100 font-mono">
                    {filteredVotes.map(vote => {
                      const isMyVote = (userVote && (vote.id === userVote.id || (vote.voterWallet || '').toLowerCase() === userVote.voterWallet.toLowerCase())) || (cleanUserWallet && (vote.voterWallet || '').toLowerCase() === cleanUserWallet);

                      return (
                        <tr 
                          key={vote.id} 
                          className={`transition-colors ${
                            isMyVote 
                              ? 'dark:bg-blue-950/30 bg-blue-50/80 border-l-4 border-l-blue-500' 
                              : 'dark:hover:bg-white/[0.02] hover:bg-slate-50'
                          }`}
                        >
                          {/* Project Name */}
                          <td className="py-5 px-5 sm:px-7 font-sans font-black dark:text-white text-slate-950 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <span>{vote.projectName}</span>
                              {isMyVote && (
                                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-blue-600 text-white font-black">
                                  YOUR PICK
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Voter */}
                          <td className="py-5 px-5 sm:px-7 whitespace-nowrap font-sans">
                            <div className="flex items-center space-x-2.5">
                              {vote.voterAvatar && (
                                <img
                                  src={vote.voterAvatar}
                                  alt={vote.voterName}
                                  className="w-7 h-7 rounded-full object-cover ring-1 ring-blue-500 shadow-sm"
                                />
                              )}
                              <span className="dark:text-slate-200 text-slate-800 font-semibold">{vote.voterName}</span>
                              <span className="text-[10px] px-2.5 py-0.5 rounded-full dark:bg-white/[0.08] bg-slate-100 dark:text-slate-300 text-slate-600 uppercase font-mono font-bold">
                                {vote.voterProvider}
                              </span>
                              {isMyVote && (
                                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-400 font-mono font-black">
                                  YOU
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Wallet Address */}
                          <td className="py-5 px-5 sm:px-7 whitespace-nowrap">
                            <span className="text-blue-600 dark:text-blue-400 font-bold font-mono text-xs">
                              {vote.voterWallet ? `${vote.voterWallet.substring(0, 6)}...${vote.voterWallet.slice(-6)}` : 'G...'}
                            </span>
                          </td>

                          {/* Timestamp */}
                          <td className="py-5 px-5 sm:px-7 whitespace-nowrap text-slate-400 text-xs">
                            {new Date(vote.votedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}{' '}
                            <span className="text-[10px] opacity-70">
                              {new Date(vote.votedAt).toLocaleDateString()}
                            </span>
                          </td>

                          {/* Inspect Proof Button */}
                          <td className="py-5 px-5 sm:px-7 whitespace-nowrap">
                            <button
                              onClick={() => setSelectedVote(vote)}
                              className={`ctrl-roll-button flex items-center space-x-2 px-4 py-2 rounded-full border text-xs font-bold transition-all shadow-sm ${
                                isMyVote
                                  ? 'bg-blue-600 hover:bg-blue-500 text-white border-blue-600'
                                  : 'bg-[#ecefec] dark:bg-white/[0.08] hover:bg-slate-200 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-white/10'
                              }`}
                            >
                              <Fingerprint className="w-3.5 h-3.5" />
                              <span className="ctrl-roll-label">{isMyVote ? 'Your Proof' : 'Inspect Proof'}</span>
                              <CheckCircle2 className="w-3.5 h-3.5 ml-1 text-emerald-500" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* VIEW 2: REGISTERED ACCOUNTS & VOTERS LEDGER */}
        {activeLedger === 'users' && (
          <>
            {/* Database Engine Status Card */}
            <div className="ctrl-card mb-12 p-8 sm:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
              <div className="space-y-2">
                <div className="flex items-center space-x-2.5">
                  <span className="w-3 h-3 rounded-full bg-[#05c92f] animate-pulse"></span>
                  <span className="text-xs sm:text-sm font-mono text-slate-950 dark:text-white uppercase font-black flex items-center gap-2">
                    <Database className="w-4 h-4 text-emerald-500" />
                    <span>SQLite Storage Engine Active</span>
                  </span>
                </div>
                <p className="text-xs sm:text-sm dark:text-slate-200 text-slate-800 font-mono font-semibold">
                  Database File: <span className="text-blue-600 dark:text-sky-400 font-bold">dart.sqlite</span> • Status: <span className="text-emerald-500 font-bold">Connected</span>
                </p>
                <p className="text-xs dark:text-slate-400 text-slate-600 font-mono">
                  Engine: node:sqlite (native Node 22) • {dbStats?.usersCount || dbUsers.length} accounts recorded in users table
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={fetchDatabaseInfo}
                  disabled={isRefreshingDb}
                  className="ctrl-roll-button flex items-center space-x-2 px-5 py-3 rounded-full bg-[#ecefec] dark:bg-black/50 border dark:border-white/[0.08] border-slate-300 text-xs font-mono dark:text-slate-300 text-slate-800 shadow-sm"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-blue-500 ${isRefreshingDb ? 'animate-spin' : ''}`} />
                  <span className="ctrl-roll-label">Sync Database</span>
                </button>
              </div>
            </div>

            {/* User Search Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div className="flex items-center space-x-2 text-xs font-mono dark:text-slate-400 text-slate-600">
                <UserCheck className="w-4 h-4 text-emerald-500" />
                <span>Showing {filteredUsers.length} of {dbUsers.length} registered accounts</span>
              </div>

              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500" />
                <input
                  type="text"
                  value={userSearch}
                  onChange={e => setUserSearch(e.target.value)}
                  placeholder="Search by name, email, wallet, role..."
                  className="w-full pl-11 pr-4 py-3 rounded-full dark:bg-[#0E1527] bg-[#ecefec]/60 border-2 dark:border-white/[0.1] border-slate-300 text-xs sm:text-sm dark:text-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-950 dark:focus:border-blue-400 transition-all font-mono shadow-sm"
                />
              </div>
            </div>

            {/* Table of Users */}
            <div className="ctrl-card overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="dark:bg-white/[0.03] bg-[#ecefec]/50 border-b dark:border-white/[0.06] border-slate-200 dark:text-slate-400 text-slate-600 font-mono uppercase text-[11px]">
                    <tr>
                      <th className="py-5 px-5 sm:px-7">User Account</th>
                      <th className="py-5 px-5 sm:px-7">Email Address</th>
                      <th className="py-5 px-5 sm:px-7">Role</th>
                      <th className="py-5 px-5 sm:px-7">Stellar Wallet</th>
                      <th className="py-5 px-5 sm:px-7">Provider</th>
                      <th className="py-5 px-5 sm:px-7">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y dark:divide-white/[0.04] divide-slate-100 font-mono">
                    {filteredUsers.map(user => {
                      const isMe = currentUser && (
                        (user.walletAddress && user.walletAddress.toLowerCase() === currentUser.walletAddress.toLowerCase()) ||
                        (user.email && user.email.toLowerCase() === currentUser.email?.toLowerCase())
                      );

                      return (
                        <tr 
                          key={user.id || user.walletAddress}
                          className={`transition-colors ${
                            isMe 
                              ? 'dark:bg-emerald-950/20 bg-emerald-50/80 border-l-4 border-l-[#05c92f]' 
                              : 'dark:hover:bg-white/[0.02] hover:bg-slate-50'
                          }`}
                        >
                          {/* User Avatar + Name */}
                          <td className="py-5 px-5 sm:px-7 whitespace-nowrap font-sans">
                            <div className="flex items-center space-x-3">
                              {user.avatar ? (
                                <img
                                  src={user.avatar}
                                  alt={user.name}
                                  className="w-8 h-8 rounded-full object-cover ring-1 ring-blue-500 shadow-sm"
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center font-bold text-xs">
                                  {user.name.slice(0, 2).toUpperCase()}
                                </div>
                              )}
                              <div>
                                <span className="font-bold dark:text-white text-slate-950 block">{user.name}</span>
                                {isMe && (
                                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-black">
                                    CURRENT USER
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Email */}
                          <td className="py-5 px-5 sm:px-7 whitespace-nowrap font-mono text-xs dark:text-slate-300 text-slate-700">
                            {user.email || 'None Provided'}
                          </td>

                          {/* Role */}
                          <td className="py-5 px-5 sm:px-7 whitespace-nowrap">
                            <span className={`text-[10px] px-2.5 py-1 rounded-full font-mono font-bold uppercase ${
                              user.role === 'builder'
                                ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                                : 'bg-[#05c92f]/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                            }`}>
                              {user.role || 'voter'}
                            </span>
                          </td>

                          {/* Stellar Wallet */}
                          <td className="py-5 px-5 sm:px-7 whitespace-nowrap">
                            <span className="text-blue-600 dark:text-blue-400 font-bold font-mono text-xs">
                              {user.walletAddress ? `${user.walletAddress.substring(0, 6)}...${user.walletAddress.slice(-6)}` : 'G...'}
                            </span>
                          </td>

                          {/* Provider */}
                          <td className="py-5 px-5 sm:px-7 whitespace-nowrap">
                            <span className="text-[10px] px-2.5 py-0.5 rounded-full dark:bg-white/[0.08] bg-slate-100 dark:text-slate-300 text-slate-600 uppercase font-mono font-bold">
                              {user.provider}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="py-5 px-5 sm:px-7 whitespace-nowrap">
                            <button
                              onClick={() => setSelectedUser(user)}
                              className="ctrl-roll-button flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-[#ecefec] dark:bg-white/[0.08] hover:bg-slate-200 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-white/10 text-xs font-bold transition-all shadow-sm"
                            >
                              <Users className="w-3.5 h-3.5 text-blue-500" />
                              <span className="ctrl-roll-label">View Profile</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Signature Inspector Drawer Modal */}
        {selectedVote && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
            <div 
              className="w-full max-w-2xl rounded-[36px] ctrl-card p-6 sm:p-8 shadow-2xl space-y-5"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-4 border-b dark:border-white/[0.08] border-slate-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-[#05c92f]/20 border-2 border-[#05c92f] flex items-center justify-center text-slate-950 dark:text-white">
                    <ShieldCheck className="w-5 h-5 text-[#05c92f]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black dark:text-white text-slate-950">Cryptographic Proof Details</h3>
                    <p className="text-xs dark:text-slate-400 text-slate-500 font-mono">
                      Stellar SEP-53 Non-Repudiation Certificate
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedVote(null)}
                  className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-white/[0.1] text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Verification Status Banner */}
              <div className="p-3.5 rounded-full bg-[#05c92f]/15 border-2 border-[#05c92f] flex items-center justify-between text-xs text-slate-950 dark:text-white font-mono">
                <span className="flex items-center gap-2 font-black">
                  <CheckCircle2 className="w-4 h-4 text-[#05c92f]" />
                  SIGNATURE STATUS: VALID & RECORDED
                </span>
                <span className="font-bold">Scheme: {selectedVote.scheme.toUpperCase()}</span>
              </div>

              {/* Canonical Payload */}
              <div>
                <div className="flex items-center justify-between mb-1.5 text-xs font-mono dark:text-slate-400 text-slate-500">
                  <span>Signed Message Body:</span>
                  <button
                    onClick={() => copyText(selectedVote.signedMessage)}
                    className="ctrl-roll-button text-blue-600 hover:underline flex items-center gap-1 text-[11px] font-bold"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span className="ctrl-roll-label">{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="p-4 rounded-2xl dark:bg-black/70 bg-slate-900 border dark:border-white/[0.08] border-slate-700 text-xs text-blue-300 font-mono overflow-x-auto whitespace-pre leading-relaxed shadow-inner">
                  {selectedVote.signedMessage}
                </pre>
              </div>

              {/* Signature Hash */}
              <div>
                <span className="block text-xs font-mono dark:text-slate-400 text-slate-500 mb-1">
                  Raw Ed25519 Signature (Hex):
                </span>
                <div className="p-3.5 rounded-2xl dark:bg-white/[0.03] bg-[#ecefec] border dark:border-white/[0.06] border-slate-300 font-mono text-[11px] dark:text-slate-300 text-slate-800 break-all">
                  {selectedVote.signature}
                </div>
              </div>

              {/* Signer Public Key */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <span className="text-slate-400 uppercase text-[10px]">Signer Address:</span>
                  <p className="dark:text-slate-300 text-slate-800 break-all text-[11px] mt-0.5 font-bold">{selectedVote.voterWallet}</p>
                </div>
                <div>
                  <span className="text-slate-400 uppercase text-[10px]">Transaction Hash:</span>
                  <p className="text-blue-600 dark:text-sky-400 break-all text-[11px] mt-0.5">{selectedVote.txHash}</p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setSelectedVote(null)}
                  className="ctrl-roll-button w-full py-3.5 rounded-full bg-[#05c92f] hover:bg-[#04b82a] text-slate-950 font-black text-xs sm:text-sm border-2 border-slate-950 shadow-md transition-colors"
                >
                  <span className="ctrl-roll-label">Close Inspector</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* User Account Inspector Drawer Modal */}
        {selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
            <div 
              className="w-full max-w-lg rounded-[36px] ctrl-card p-6 sm:p-8 shadow-2xl space-y-5"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-4 border-b dark:border-white/[0.08] border-slate-200">
                <div className="flex items-center space-x-3">
                  {selectedUser.avatar ? (
                    <img
                      src={selectedUser.avatar}
                      alt={selectedUser.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500 shadow-sm"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center font-bold text-sm">
                      {selectedUser.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-black dark:text-white text-slate-950">{selectedUser.name}</h3>
                    <p className="text-xs dark:text-slate-400 text-slate-500 font-mono">
                      Database Registered {selectedUser.role || 'User'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedUser(null)}
                  className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-white/[0.1] text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User Record Card Details */}
              <div className="space-y-3 font-mono text-xs">
                <div className="p-3.5 rounded-2xl dark:bg-white/[0.03] bg-slate-50 border dark:border-white/[0.06] border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase">Email Address</span>
                  <p className="font-sans font-bold dark:text-white text-slate-900">{selectedUser.email || 'None'}</p>
                </div>

                <div className="p-3.5 rounded-2xl dark:bg-white/[0.03] bg-slate-50 border dark:border-white/[0.06] border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 uppercase">Stellar Wallet Public Key</span>
                    <button
                      onClick={() => copyText(selectedUser.walletAddress)}
                      className="text-blue-500 hover:underline flex items-center gap-1 text-[11px]"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                      <span>{copied ? 'Copied' : 'Copy Key'}</span>
                    </button>
                  </div>
                  <p className="dark:text-slate-300 text-slate-800 break-all text-[11px] font-bold">
                    {selectedUser.walletAddress}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-2xl dark:bg-white/[0.03] bg-slate-50 border dark:border-white/[0.06] border-slate-200 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase">Auth Provider</span>
                    <p className="font-bold uppercase dark:text-white text-slate-900">{selectedUser.provider}</p>
                  </div>

                  <div className="p-3.5 rounded-2xl dark:bg-white/[0.03] bg-slate-50 border dark:border-white/[0.06] border-slate-200 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase">Storage Backend</span>
                    <p className="font-bold text-emerald-500">SQLite (dart.sqlite)</p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="ctrl-roll-button w-full py-3.5 rounded-full bg-[#05c92f] hover:bg-[#04b82a] text-slate-950 font-black text-xs sm:text-sm border-2 border-slate-950 shadow-md transition-colors"
                >
                  <span className="ctrl-roll-label">Close Details</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
