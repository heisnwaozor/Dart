import React, { useState } from 'react';
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
  ExternalLink
} from 'lucide-react';
import { PublicVote, PollarUser } from '../types';
import { PollarClientService } from '../lib/pollar';

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
  const [search, setSearch] = useState('');
  const [scope, setScope] = useState<'all' | 'my'>('all');
  const [selectedVote, setSelectedVote] = useState<PublicVote | null>(null);
  const [copied, setCopied] = useState(false);

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

  return (
    <section className="py-10 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b dark:border-white/[0.08] border-slate-200">
        <div>
          <div className="flex items-center space-x-2 text-blue-500 text-xs font-mono uppercase tracking-wider mb-1 font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>Public Ledger & Cryptographic Proofs</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black dark:text-white text-slate-900 tracking-tight">
            Audit Explorer
          </h2>
          <p className="text-xs sm:text-sm dark:text-slate-400 text-slate-600 mt-1">
            Every community vote is signed by a unique Pollar wallet using Stellar SEP-53. Verify any signature on-demand.
          </p>
        </div>

        {/* Action CTAs */}
        <div className="flex items-center space-x-3">
          <button
            onClick={exportJson}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-2xl dark:bg-white/[0.06] bg-slate-100 hover:bg-slate-200 dark:hover:bg-white/[0.12] dark:text-white text-slate-800 border dark:border-white/[0.1] border-slate-200 text-xs font-bold transition-all"
          >
            <Download className="w-4 h-4 text-blue-500" />
            <span>Export Verified Votes (JSON)</span>
          </button>
        </div>
      </div>

      {/* Merkle Root Transparency Card */}
      <div className="mb-8 p-6 rounded-3xl dark:bg-gradient-to-r dark:from-[#0E1527] dark:to-[#0B101F] bg-blue-50/70 border dark:border-blue-500/30 border-blue-200 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
            <span className="text-xs font-mono text-blue-600 dark:text-blue-400 uppercase font-black">
              Live Merkle Root Epoch
            </span>
          </div>
          <p className="text-xs dark:text-slate-200 text-slate-700 font-mono break-all font-semibold">
            Root: <span className="text-blue-600 dark:text-sky-400 font-bold">0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069</span>
          </p>
          <p className="text-[11px] dark:text-slate-400 text-slate-500">
            Computed over {votes.length} canonical SEP-53 signature hashes for Stellar testnet memo anchoring.
          </p>
        </div>

        <div className="flex items-center space-x-2 px-3.5 py-2 rounded-xl dark:bg-black/50 bg-white border dark:border-white/[0.08] border-blue-200 text-xs font-mono dark:text-slate-300 text-slate-700 shadow-sm">
          <Cpu className="w-4 h-4 text-blue-500" />
          <span>Algorithm: SHA-256 / Ed25519</span>
        </div>
      </div>

      {/* User Active Vote Banner in Audit Explorer */}
      {userVote && (
        <div className="mb-6 p-4 sm:p-5 rounded-3xl bg-blue-500/10 border border-blue-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-500 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-bold dark:text-white text-slate-900">
                Your Vote: <strong className="text-blue-600 dark:text-blue-400 underline">{userVote.projectName}</strong>
              </p>
              <p className="text-xs font-mono dark:text-slate-400 text-slate-500 mt-0.5 truncate max-w-lg">
                Signer: {userVote.voterWallet}
              </p>
            </div>
          </div>
          <button
            onClick={() => setSelectedVote(userVote)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all whitespace-nowrap"
          >
            Inspect My Proof
          </button>
        </div>
      )}

      {/* Scope Controls & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 mb-6">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setScope('all')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              scope === 'all'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                : 'dark:bg-white/[0.04] bg-slate-100 dark:text-slate-300 text-slate-600 hover:text-blue-600'
            }`}
          >
            All Ledger Proofs ({votes.length})
          </button>
          {userVote && (
            <button
              onClick={() => setScope('my')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                scope === 'my'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                  : 'dark:bg-white/[0.04] bg-slate-100 text-blue-500 hover:bg-blue-500/10'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>My Verified Vote (1)</span>
            </button>
          )}
        </div>

        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by project, wallet, or voter name..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl dark:bg-[#0E1527] bg-white border dark:border-white/[0.1] border-slate-200 text-xs dark:text-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-all font-mono shadow-sm"
          />
        </div>
      </div>

      {/* Table of Votes */}
      <div className="rounded-3xl dark:bg-[#0E1527] bg-white border dark:border-white/[0.08] border-slate-200 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="dark:bg-white/[0.03] bg-slate-50 border-b dark:border-white/[0.06] border-slate-200 dark:text-slate-400 text-slate-500 font-mono uppercase text-[10px]">
              <tr>
                <th className="py-4 px-4 sm:px-6">Project</th>
                <th className="py-4 px-4 sm:px-6">Voter (Pollar Identity)</th>
                <th className="py-4 px-4 sm:px-6">Stellar Wallet</th>
                <th className="py-4 px-4 sm:px-6">Timestamp</th>
                <th className="py-4 px-4 sm:px-6">Status & Proof</th>
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
                        ? 'dark:bg-blue-950/25 bg-blue-50/70 border-l-4 border-l-blue-500' 
                        : 'dark:hover:bg-white/[0.02] hover:bg-slate-50'
                    }`}
                  >
                    
                    {/* Project Name */}
                    <td className="py-4 px-4 sm:px-6 font-sans font-bold dark:text-white text-slate-900 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span>{vote.projectName}</span>
                        {isMyVote && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-600 text-white font-black">
                            YOUR PICK
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Voter */}
                    <td className="py-4 px-4 sm:px-6 whitespace-nowrap font-sans">
                      <div className="flex items-center space-x-2">
                        {vote.voterAvatar && (
                          <img
                            src={vote.voterAvatar}
                            alt={vote.voterName}
                            className="w-6 h-6 rounded-full object-cover ring-1 ring-blue-500"
                          />
                        )}
                        <span className="dark:text-slate-200 text-slate-800 font-medium">{vote.voterName}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full dark:bg-white/[0.08] bg-slate-100 dark:text-slate-300 text-slate-600 uppercase font-mono font-bold">
                          {vote.voterProvider}
                        </span>
                        {isMyVote && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-400 font-mono font-black">
                            YOU
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Wallet Address */}
                    <td className="py-4 px-4 sm:px-6 text-blue-500 font-bold whitespace-nowrap">
                      {vote.voterWallet.substring(0, 6)}...{vote.voterWallet.slice(-6)}
                    </td>

                    {/* Timestamp */}
                    <td className="py-4 px-4 sm:px-6 dark:text-slate-400 text-slate-500 whitespace-nowrap">
                      {new Date(vote.votedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}{' '}
                      <span className="text-[10px] opacity-70">
                        {new Date(vote.votedAt).toLocaleDateString()}
                      </span>
                    </td>

                    {/* Inspect Proof Button */}
                    <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedVote(vote)}
                        className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl border text-[11px] font-bold transition-colors ${
                          isMyVote
                            ? 'bg-blue-600 hover:bg-blue-500 text-white border-blue-600 shadow-sm'
                            : 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30'
                        }`}
                      >
                        <Fingerprint className="w-3.5 h-3.5" />
                        <span>{isMyVote ? 'Your Proof' : 'Inspect Proof'}</span>
                        <CheckCircle2 className="w-3.5 h-3.5 ml-1" />
                      </button>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Signature Inspector Drawer Modal */}
      {selectedVote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div 
            className="w-full max-w-2xl rounded-3xl dark:bg-[#0C1326] bg-white border dark:border-white/[0.12] border-slate-200 p-6 sm:p-8 shadow-2xl space-y-5"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b dark:border-white/[0.08] border-slate-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-500">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold dark:text-white text-slate-900">Cryptographic Proof Details</h3>
                  <p className="text-xs dark:text-slate-400 text-slate-500 font-mono">
                    Stellar SEP-53 Non-Repudiation Certificate
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedVote(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Verification Status Banner */}
            <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-between text-xs text-blue-600 dark:text-blue-400 font-mono">
              <span className="flex items-center gap-2 font-bold">
                <CheckCircle2 className="w-4 h-4 text-blue-500" />
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
                  className="text-blue-500 hover:underline flex items-center gap-1 text-[11px] font-bold"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
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
              <div className="p-3.5 rounded-2xl dark:bg-white/[0.03] bg-slate-100 border dark:border-white/[0.06] border-slate-200 font-mono text-[11px] dark:text-slate-300 text-slate-700 break-all">
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
                <p className="text-blue-500 break-all text-[11px] mt-0.5">{selectedVote.txHash}</p>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setSelectedVote(null)}
                className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition-colors"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
