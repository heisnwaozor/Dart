import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  Copy, 
  Check, 
  ExternalLink, 
  RefreshCw, 
  SearchCode,
  Flame,
  Fingerprint,
  Calendar,
  Lock,
  ArrowRight
} from 'lucide-react';
import { PublicVote, Project, PollarUser } from '../types';
import { DartLogo } from './DartLogo';

interface VoteReceiptModalProps {
  vote: PublicVote | undefined;
  project: Project | undefined;
  currentUser: PollarUser | null;
  onClose: () => void;
  onChangeVote: () => void;
  onViewAuditLedger: () => void;
}

export const VoteReceiptModal: React.FC<VoteReceiptModalProps> = ({
  vote,
  project,
  currentUser,
  onClose,
  onChangeVote,
  onViewAuditLedger,
}) => {
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedSig, setCopiedSig] = useState(false);
  const [copiedMsg, setCopiedMsg] = useState(false);

  if (!vote) return null;

  const copyToClipboard = (text: string, type: 'key' | 'sig' | 'msg') => {
    navigator.clipboard.writeText(text);
    if (type === 'key') {
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    } else if (type === 'sig') {
      setCopiedSig(true);
      setTimeout(() => setCopiedSig(false), 2000);
    } else {
      setCopiedMsg(true);
      setTimeout(() => setCopiedMsg(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl rounded-3xl dark:bg-[#0C1326] bg-white border dark:border-white/[0.12] border-slate-200 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b dark:border-white/[0.08] border-slate-200 bg-gradient-to-r dark:from-blue-950/40 dark:to-transparent from-blue-50/70 to-transparent">
          <div className="flex items-center space-x-3.5">
            <div className="flex items-center justify-center">
              <DartLogo size={38} animate />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base sm:text-lg font-black dark:text-white text-slate-900 tracking-tight">
                  Your Verified Vote Receipt
                </h3>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-400 font-mono font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-blue-500" />
                  CONFIRMED
                </span>
              </div>
              <p className="text-xs dark:text-slate-400 text-slate-500 font-medium">
                Stellar SEP-53 Cryptographic Proof on Pollar
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white dark:hover:bg-white/[0.06] hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-7 space-y-6 overflow-y-auto flex-1 text-xs">
          
          {/* Project Chosen Banner */}
          <div className="p-4 sm:p-5 rounded-2xl dark:bg-white/[0.03] bg-slate-50 border dark:border-blue-500/30 border-blue-200 relative overflow-hidden shadow-md">
            <div className="flex items-center space-x-4">
              {project?.coverImage && (
                <img
                  src={project.coverImage}
                  alt={vote.projectName}
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=600&q=80';
                  }}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-blue-500/40 shadow-md flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400 font-black uppercase tracking-wider">
                    Your Active Vote Pick:
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                    +1 Vote Counted
                  </span>
                </div>
                <h4 className="text-lg sm:text-xl font-black dark:text-white text-slate-900 truncate">
                  {vote.projectName}
                </h4>
                {project && (
                  <p className="text-xs dark:text-slate-400 text-slate-500 font-mono truncate mt-0.5">
                    Team: {project.teamName} • Total Votes: {project.publicVotesCount}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Verification Status Card */}
          <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/25 space-y-2 text-blue-700 dark:text-blue-300">
            <div className="flex items-center space-x-2 font-bold text-xs">
              <ShieldCheck className="w-4 h-4 text-blue-500 flex-shrink-0" />
              <span>Non-Repudiation Verified on Stellar Soroban</span>
            </div>
            <p className="text-[11px] leading-relaxed dark:text-slate-300 text-slate-600">
              This vote is uniquely bound to your Pollar wallet and signed with an Ed25519 keypair. Your vote cannot be forged, duplicated, or altered.
            </p>
          </div>

          {/* Voter Info & Public Key */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl dark:bg-black/40 bg-slate-50 border dark:border-white/[0.06] border-slate-200">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-1">
                Voter Identity:
              </span>
              <div className="flex items-center space-x-2 mt-1">
                {vote.voterAvatar && (
                  <img
                    src={vote.voterAvatar}
                    alt={vote.voterName}
                    className="w-6 h-6 rounded-full object-cover ring-1 ring-blue-500"
                  />
                )}
                <span className="font-bold dark:text-white text-slate-900">{vote.voterName}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full dark:bg-white/[0.08] bg-slate-200 font-mono font-bold uppercase">
                  {vote.voterProvider}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl dark:bg-black/40 bg-slate-50 border dark:border-white/[0.06] border-slate-200">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-1">
                Vote Timestamp:
              </span>
              <div className="flex items-center space-x-2 mt-1 font-mono text-slate-700 dark:text-slate-200 font-semibold">
                <Calendar className="w-4 h-4 text-blue-500" />
                <span>{new Date(vote.votedAt).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Voter Public Key */}
          <div>
            <div className="flex items-center justify-between mb-1 text-[11px] font-mono text-slate-400">
              <span>Signer Stellar Wallet (Public Key):</span>
              <button
                onClick={() => copyToClipboard(vote.voterWallet, 'key')}
                className="text-blue-500 hover:underline flex items-center gap-1 font-bold"
              >
                {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey ? 'Copied' : 'Copy Key'}</span>
              </button>
            </div>
            <div className="p-3 rounded-xl dark:bg-black/60 bg-slate-100 border dark:border-white/[0.08] border-slate-200 font-mono text-xs dark:text-slate-300 text-slate-800 break-all select-all">
              {vote.voterWallet}
            </div>
          </div>

          {/* Raw Ed25519 Signature */}
          <div>
            <div className="flex items-center justify-between mb-1 text-[11px] font-mono text-slate-400">
              <span>Ed25519 Signature Hash (Hex):</span>
              <button
                onClick={() => copyToClipboard(vote.signature, 'sig')}
                className="text-blue-500 hover:underline flex items-center gap-1 font-bold"
              >
                {copiedSig ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSig ? 'Copied' : 'Copy Signature'}</span>
              </button>
            </div>
            <div className="p-3 rounded-xl dark:bg-black/60 bg-slate-100 border dark:border-white/[0.08] border-slate-200 font-mono text-[11px] text-blue-500 dark:text-blue-400 break-all select-all">
              {vote.signature}
            </div>
          </div>

          {/* Canonical Signed Payload */}
          <div>
            <div className="flex items-center justify-between mb-1 text-[11px] font-mono text-slate-400">
              <span>Canonical SEP-53 Plaintext Message:</span>
              <button
                onClick={() => copyToClipboard(vote.signedMessage, 'msg')}
                className="text-blue-500 hover:underline flex items-center gap-1 font-bold"
              >
                {copiedMsg ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedMsg ? 'Copied' : 'Copy Message'}</span>
              </button>
            </div>
            <pre className="p-4 rounded-2xl dark:bg-black/80 bg-slate-900 border dark:border-white/[0.08] border-slate-700 font-mono text-xs text-blue-300 whitespace-pre leading-relaxed overflow-x-auto shadow-inner">
              {vote.signedMessage}
            </pre>
          </div>

          {/* Transaction Hash */}
          <div className="p-3.5 rounded-2xl dark:bg-white/[0.02] bg-slate-50 border dark:border-white/[0.06] border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono text-xs">
            <span className="text-slate-400 text-[11px]">Transaction Memo:</span>
            <span className="text-sky-500 font-bold break-all">{vote.txHash}</span>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-5 sm:p-6 border-t dark:border-white/[0.08] border-slate-200 dark:bg-black/40 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              onClick={() => {
                onClose();
                onViewAuditLedger();
              }}
              className="flex-1 sm:flex-initial flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl dark:bg-white/[0.06] bg-slate-200 dark:text-slate-200 text-slate-700 hover:bg-slate-300 dark:hover:bg-white/[0.12] text-xs font-bold transition-colors"
            >
              <SearchCode className="w-4 h-4 text-sky-400" />
              <span>View in Audit Ledger</span>
            </button>
            <button
              onClick={() => {
                onClose();
                onChangeVote();
              }}
              className="flex-1 sm:flex-initial flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30 hover:bg-blue-500/25 text-xs font-bold transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Switch Vote</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-md transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
