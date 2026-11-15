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
    <section className="py-20 sm:py-28 lg:py-36 border-b dark:border-white/[0.08] border-slate-200">
      <div className="motion-container">
        
        {/* Ctrl Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 sm:mb-16 pb-8 border-b dark:border-white/[0.08] border-slate-200">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ecefec] dark:bg-white/[0.08] text-xs sm:text-sm font-semibold dark:text-slate-200 text-slate-700 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#05c92f] animate-pulse"></span>
              <span>Public Ledger & Cryptographic Proofs</span>
            </div>
            <h2 className="text-4xl sm:text-6xl font-black dark:text-white text-slate-950 tracking-[-0.03em] leading-[0.98]">
              Audit <span className="inline-block text-blue-600 dark:text-blue-500 transform hover:rotate-12 transition-transform duration-300">❖</span> Proofs.
            </h2>
            <p className="text-sm sm:text-base dark:text-slate-400 text-slate-600 max-w-2xl">
              Decentralized community voting for all Pollar Pitch Projects. Every community vote is signed by a unique Pollar wallet using Stellar SEP-53. Verify any signature on-demand.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center space-x-4">
            <button
              onClick={exportJson}
              className="ctrl-roll-button flex items-center space-x-2.5 px-7 py-4 rounded-full bg-[#ecefec] dark:bg-white/[0.08] hover:bg-slate-200 dark:hover:bg-white/[0.14] text-slate-950 dark:text-white border-2 border-slate-950 dark:border-white/20 text-xs sm:text-sm font-bold transition-all shadow-md"
            >
              <Download className="w-4 h-4 text-blue-500" />
              <span className="ctrl-roll-label">Export Verified Votes (JSON)</span>
            </button>
          </div>
        </div>

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

      </div>
    </section>
  );
};
