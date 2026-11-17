import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  Fingerprint, 
  CheckCircle2, 
  Copy, 
  Check, 
  Sparkles,
  KeyRound,
  AlertCircle,
  Zap,
  Lock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Project, PollarUser, SignatureProof, PublicVote } from '../types';
import { PollarClientService } from '../lib/pollar';
import { DartLogo } from './DartLogo';

interface VoteModalProps {
  project: Project | null;
  currentUser: PollarUser | null;
  currentVote: PublicVote | undefined;
  onClose: () => void;
  onOpenAuth: () => void;
  onSuccess: () => void;
  onViewLeaderboard?: () => void;
  onViewReceipt?: () => void;
}

export const VoteModal: React.FC<VoteModalProps> = ({
  project,
  currentUser,
  currentVote,
  onClose,
  onOpenAuth,
  onSuccess,
  onViewLeaderboard,
  onViewReceipt,
}) => {
  const [step, setStep] = useState<'review' | 'signing' | 'confirmed'>('review');
  const [structuredMessage, setStructuredMessage] = useState('');
  const [proof, setProof] = useState<SignatureProof | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (project && currentUser) {
      const built = PollarClientService.buildSep53Message({
        hackathonName: 'LATAM Builders Summit 2026',
        projectId: project.id,
        projectName: project.name,
        voterWallet: currentUser.walletAddress
      });
      setStructuredMessage(built.message);
    }
  }, [project, currentUser]);

  if (!project) return null;

  const handleSign = async () => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }

    try {
      setStep('signing');
      setErrorMsg(null);

      // Perform cryptographic SEP-53 signing via Pollar client service
      const signatureProof = await PollarClientService.signMessageWithPollar(
        structuredMessage,
        currentUser.walletAddress
      );

      setProof(signatureProof);

      // Submit to backend/local store
      PollarClientService.submitSignedVote(project, currentUser, signatureProof);

      setStep('confirmed');

      // Trigger celebratory blue, gold & white confetti
      confetti({
        particleCount: 140,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#2563EB', '#38BDF8', '#FFFFFF', '#F59E0B']
      });

      onSuccess();
    } catch (err: any) {
      setStep('review');
      setErrorMsg(err?.message || 'Signing failed. Please try again.');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-up duration-200">
      <div 
        className="ctrl-card relative w-full max-w-xl rounded-[32px] sm:rounded-[36px] shadow-2xl overflow-hidden max-h-[88vh] flex flex-col transition-all animate-overshoot"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-start sm:items-center justify-between p-4 sm:p-5 border-b dark:border-white/[0.08] border-slate-200 flex-shrink-0 gap-3">
          <div className="flex items-start sm:items-center space-x-3 min-w-0 flex-1">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#05c92f]/20 border-2 border-[#05c92f] flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-0">
              <Fingerprint className="w-5 h-5 text-[#05c92f] animate-pulse" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <h3 className="text-sm sm:text-base font-black dark:text-white text-slate-950 leading-tight">
                  Cryptographic Vote Signing
                </h3>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#ecefec] dark:bg-white/[0.08] text-slate-700 dark:text-slate-300 font-mono font-bold whitespace-nowrap flex-shrink-0">
                  Stellar SEP-53
                </span>
              </div>
              <p className="text-[11px] sm:text-xs dark:text-slate-400 text-slate-500 mt-0.5 leading-normal">
                Zero gas fees • Non-repudiation on Stellar
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white dark:hover:bg-white/[0.06] hover:bg-slate-100 transition-colors flex-shrink-0 -mr-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-5 space-y-3.5 overflow-y-auto flex-1">
          
          {/* Target Project Card */}
          <div className="flex items-center space-x-3.5 p-3 rounded-2xl dark:bg-white/[0.03] bg-slate-50 border dark:border-white/[0.06] border-slate-200">
            <img
              src={project.coverImage}
              alt={project.name}
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=600&q=80';
              }}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover ring-2 ring-blue-500/30 flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-mono text-blue-500 uppercase tracking-wider font-bold block">
                Voting For Project:
              </span>
              <h4 className="text-sm sm:text-base font-bold dark:text-white text-slate-900 truncate">{project.name}</h4>
              <p className="text-[11px] sm:text-xs dark:text-slate-400 text-slate-500 truncate">{project.tagline}</p>
            </div>
          </div>

          {!currentUser ? (
            /* Unauthenticated prompt */
            <div className="text-center py-6 px-4 rounded-3xl dark:bg-white/[0.02] bg-slate-50 border border-dashed dark:border-white/[0.1] border-slate-300 space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#05c92f]/20 border-2 border-[#05c92f] flex items-center justify-center mx-auto">
                <KeyRound className="w-6 h-6 text-[#05c92f] animate-pulse" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm sm:text-base font-black dark:text-white text-slate-900">
                  Account Required to Vote
                </h4>
                <p className="text-xs dark:text-slate-400 text-slate-600 max-w-sm mx-auto leading-relaxed">
                  Voters must register an account to be recorded in our database. You will automatically receive a dedicated Stellar keypair for gasless SEP-53 cryptographic ballot signing.
                </p>
              </div>
              <button
                type="button"
                onClick={onOpenAuth}
                className="ctrl-roll-button inline-flex items-center space-x-2.5 px-6 py-3 rounded-full bg-[#05c92f] hover:bg-[#04b82a] text-slate-950 font-black text-xs sm:text-sm border-2 border-slate-950 shadow-md shadow-emerald-500/25 transition-all"
              >
                <div className="flex items-center -space-x-1 mr-1 flex-shrink-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#fbe74e] ring-1 ring-slate-950"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ffcadc] ring-1 ring-slate-950"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#9dc4f5] ring-1 ring-slate-950"></span>
                </div>
                <span className="ctrl-roll-label">Create Voter Account / Sign In</span>
              </button>
            </div>
          ) : step === 'review' ? (
            /* Review Payload Step */
            <div className="space-y-3">
              
              {/* Vote Selection Status Notice */}
              {currentVote && (
                currentVote.projectId === project.id ? (
                  <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/25 text-xs text-blue-600 dark:text-blue-400 font-medium">
                    <strong>Active Pick:</strong> You have already recorded a vote for this project. Re-signing will update your cryptographic timestamp.
                  </div>
                ) : (
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-600 dark:text-amber-400 font-medium">
                    <strong>Switching Pick:</strong> Your vote will be reassigned from <strong>{currentVote.projectName}</strong> to <strong>{project.name}</strong> upon signature.
                  </div>
                )
              )}

              {/* Voter Identity Callout */}
              <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl dark:bg-white/[0.04] bg-slate-50 border dark:border-white/[0.06] border-slate-200 text-xs">
                <div className="flex items-center space-x-2.5">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-6 h-6 rounded-full object-cover ring-1 ring-[#05c92f]"
                  />
                  <div>
                    <span className="dark:text-slate-200 text-slate-800 font-bold block leading-tight">{currentUser.name}</span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">Recorded in Database</span>
                  </div>
                </div>
                <span className="font-mono text-blue-500 font-semibold text-[11px]">
                  {currentUser.walletAddress.substring(0, 6)}...{currentUser.walletAddress.slice(-6)}
                </span>
              </div>

              {/* SEP-53 Plaintext Message Payload */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-mono dark:text-slate-400 text-slate-500 font-bold">Structured SEP-53 Payload:</span>
                  <button
                    onClick={() => copyToClipboard(structuredMessage)}
                    className="text-[11px] font-mono text-blue-500 hover:underline flex items-center gap-1 font-bold"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy Payload'}</span>
                  </button>
                </div>

                <div className="p-3 rounded-xl dark:bg-black/70 bg-slate-900 border dark:border-white/[0.08] border-slate-700 font-mono text-[11px] text-blue-300 whitespace-pre leading-relaxed overflow-x-auto max-h-24 sm:max-h-28 overflow-y-auto shadow-inner">
                  {structuredMessage}
                </div>
              </div>

              {/* Security Callout */}
              <div className="flex items-start space-x-2.5 p-3 rounded-xl bg-blue-500/10 border border-blue-500/25 text-xs text-blue-600 dark:text-blue-400 font-medium">
                <ShieldCheck className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div className="text-[11px] leading-relaxed">
                  <strong>Cryptographic Integrity:</strong> Your vote is signed with an Ed25519 keypair. Network fees are fully sponsored by the hackathon fund.
                </div>
              </div>

              {errorMsg && (
                <div className="flex items-center space-x-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-500">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}
            </div>
          ) : step === 'signing' ? (
            /* Standalone Dart Holographic Signing Ceremony */
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-6">
              <div className="relative flex items-center justify-center py-4">
                {/* Standalone Bold Blue Hand Holding Dart Emblem */}
                <div className="flex items-center justify-center z-10">
                  <DartLogo size={96} animate />
                </div>
              </div>

              <div className="space-y-1">
                <h4 className="text-lg font-black dark:text-white text-slate-900">
                  Dart SEP-53 Signature Ceremony...
                </h4>
                <p className="text-xs dark:text-slate-400 text-slate-500 font-mono">
                  Signing with Pollar Ed25519 keypair on Stellar Soroban
                </p>
              </div>

              <div className="w-56 h-2 rounded-full dark:bg-white/[0.08] bg-slate-200 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-r from-blue-600 via-sky-400 to-indigo-600 animate-gradient-x" />
              </div>
            </div>
          ) : (
            /* Confirmed Proof Step */
            <div className="space-y-4 py-2">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 rounded-3xl bg-blue-500/20 border-2 border-blue-500 flex items-center justify-center mx-auto text-blue-500 shadow-xl shadow-blue-500/30 animate-bounce">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h4 className="text-xl font-black dark:text-white text-slate-900">Signature Successfully Verified!</h4>
                <p className="text-xs dark:text-slate-400 text-slate-500">
                  Your vote for <span className="font-bold dark:text-white text-slate-900">{project.name}</span> has been permanently registered.
                </p>
              </div>

              {proof && (
                <div className="p-4 rounded-2xl dark:bg-black/50 bg-slate-50 border dark:border-white/[0.08] border-slate-200 space-y-2.5 font-mono text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase">Signer Stellar Address:</span>
                    <p className="dark:text-slate-200 text-slate-800 break-all text-[11px] font-bold">{proof.signerAddress}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase">Ed25519 Signature:</span>
                    <p className="text-blue-500 break-all text-[11px]">{proof.signature.substring(0, 48)}...</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase">Transaction Hash:</span>
                    <p className="text-sky-500 break-all text-[11px]">{proof.txHash}</p>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer Actions: Always anchored at bottom and clearly visible */}
        <div className="p-3.5 sm:p-5 border-t dark:border-white/[0.08] border-slate-200 dark:bg-black/60 bg-slate-50 flex items-center justify-end gap-2.5 sm:gap-3 flex-shrink-0 sticky bottom-0 z-10">
          {step === 'confirmed' ? (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full">
              {onViewReceipt && (
                <button
                  onClick={() => {
                    onClose();
                    onViewReceipt();
                  }}
                  className="ctrl-roll-button w-full sm:flex-1 py-3 rounded-full bg-[#ecefec] dark:bg-white/[0.08] hover:bg-slate-200 border-2 border-slate-950 dark:border-white/20 text-slate-950 dark:text-white font-bold text-xs transition-all shadow-sm"
                >
                  <span className="ctrl-roll-label">Check My Vote Receipt</span>
                </button>
              )}
              <button
                onClick={() => {
                  onClose();
                  if (onViewLeaderboard) onViewLeaderboard();
                }}
                className="ctrl-roll-button w-full sm:flex-1 py-3 rounded-full bg-[#05c92f] hover:bg-[#04b82a] text-slate-950 font-black text-xs border-2 border-slate-950 shadow-md transition-all"
              >
                <span className="ctrl-roll-label">Done & View Leaderboard</span>
              </button>
            </div>
          ) : step === 'review' && currentUser ? (
            <>
              <button
                onClick={onClose}
                className="ctrl-roll-button px-4 sm:px-5 py-2.5 rounded-full text-xs font-bold dark:text-slate-400 text-slate-600 hover:text-slate-800 dark:hover:text-white transition-colors"
              >
                <span className="ctrl-roll-label">Cancel</span>
              </button>
              <button
                onClick={handleSign}
                className="ctrl-roll-button flex items-center space-x-2 px-5 sm:px-7 py-2.5 sm:py-3 rounded-full bg-[#05c92f] hover:bg-[#04b82a] text-slate-950 font-black text-xs sm:text-sm border-2 border-slate-950 shadow-xl shadow-emerald-500/25 hover:scale-105 active:scale-95 transition-all"
              >
                <div className="flex items-center -space-x-1 mr-0.5 flex-shrink-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#fbe74e] ring-1 ring-slate-950"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ffcadc] ring-1 ring-slate-950"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#9dc4f5] ring-1 ring-slate-950"></span>
                </div>
                <span className="ctrl-roll-label">Sign Vote with Pollar</span>
              </button>
            </>
          ) : null}
        </div>

      </div>
    </div>
  );
};
