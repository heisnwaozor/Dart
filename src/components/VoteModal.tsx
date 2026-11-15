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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl rounded-3xl dark:bg-[#0C1326] bg-white border dark:border-white/[0.12] border-slate-200 shadow-2xl overflow-hidden transition-all"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b dark:border-white/[0.08] border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center">
              <Fingerprint className="w-5 h-5 text-blue-500 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold dark:text-white text-slate-900 flex items-center gap-2">
                <span>Cryptographic Vote Signing</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-400 font-mono font-bold">
                  Stellar SEP-53
                </span>
              </h3>
              <p className="text-xs dark:text-slate-400 text-slate-500">Zero gas fees • Non-repudiation on Stellar</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white dark:hover:bg-white/[0.06] hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          
          {/* Target Project Card */}
          <div className="flex items-center space-x-4 p-4 rounded-2xl dark:bg-white/[0.03] bg-slate-50 border dark:border-white/[0.06] border-slate-200">
            <img
              src={project.coverImage}
              alt={project.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-blue-500/30"
            />
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-mono text-blue-500 uppercase tracking-wider font-bold">
                Voting For Project:
              </span>
              <h4 className="text-base font-bold dark:text-white text-slate-900 truncate">{project.name}</h4>
              <p className="text-xs dark:text-slate-400 text-slate-500 truncate">{project.tagline}</p>
            </div>
          </div>

          {!currentUser ? (
            /* Unauthenticated prompt */
            <div className="text-center py-8 px-4 rounded-3xl dark:bg-white/[0.02] bg-slate-50 border border-dashed dark:border-white/[0.1] border-slate-300 space-y-3">
              <KeyRound className="w-12 h-12 text-blue-500 mx-auto animate-bounce" />
              <h4 className="text-sm font-bold dark:text-white text-slate-900">Connect Your Pollar Identity First</h4>
              <p className="text-xs dark:text-slate-400 text-slate-500 max-w-sm mx-auto">
                Sign in with Google or GitHub. Pollar provisions a gas-sponsored Stellar keypair automatically.
              </p>
              <button
                onClick={onOpenAuth}
                className="mt-2 px-6 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 hover:scale-105 transition-all"
              >
                Connect with Pollar
              </button>
            </div>
          ) : step === 'review' ? (
            /* Review Payload Step */
            <div className="space-y-4">
              
              {/* Vote Selection Status Notice */}
              {currentVote && (
                currentVote.projectId === project.id ? (
                  <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/25 text-xs text-blue-600 dark:text-blue-400 font-medium">
                    <strong>Active Pick:</strong> You have already recorded a vote for this project. Re-signing will update your cryptographic timestamp.
                  </div>
                ) : (
                  <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-600 dark:text-amber-400 font-medium">
                    <strong>Switching Pick:</strong> Your vote will be reassigned from <strong>{currentVote.projectName}</strong> to <strong>{project.name}</strong> upon signature.
                  </div>
                )
              )}

              {/* Voter Identity Callout */}
              <div className="flex items-center justify-between px-4 py-2.5 rounded-2xl dark:bg-white/[0.04] bg-slate-50 border dark:border-white/[0.06] border-slate-200 text-xs">
                <div className="flex items-center space-x-2.5">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-6 h-6 rounded-full object-cover ring-1 ring-blue-500"
                  />
                  <span className="dark:text-slate-200 text-slate-700 font-bold">{currentUser.name}</span>
                </div>
                <span className="font-mono text-blue-500 font-semibold text-[11px]">
                  {currentUser.walletAddress.substring(0, 6)}...{currentUser.walletAddress.slice(-6)}
                </span>
              </div>

              {/* SEP-53 Plaintext Message Payload */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-mono dark:text-slate-400 text-slate-500">Structured SEP-53 Payload:</span>
                  <button
                    onClick={() => copyToClipboard(structuredMessage)}
                    className="text-[11px] font-mono text-blue-500 hover:underline flex items-center gap-1 font-bold"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy Payload'}</span>
                  </button>
                </div>

                <div className="p-4 rounded-2xl dark:bg-black/70 bg-slate-900 border dark:border-white/[0.08] border-slate-700 font-mono text-xs text-blue-300 whitespace-pre leading-relaxed overflow-x-auto shadow-inner">
                  {structuredMessage}
                </div>
              </div>

              {/* Security Callout */}
              <div className="flex items-start space-x-2.5 p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/25 text-xs text-blue-600 dark:text-blue-400 font-medium">
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
            /* Standalone Dart Butterfly Holographic Signing Ceremony */
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-6">
              <div className="relative flex items-center justify-center">
                {/* Center Dart Butterfly Emblem */}
                <div className="w-28 h-28 rounded-3xl dark:bg-[#070A13] bg-blue-50 border-2 border-blue-500 flex items-center justify-center z-10 shadow-2xl shadow-blue-500/40 p-2">
                  <DartLogo size={70} animate />
                </div>
                {/* Concentric Rotating Holographic Rings */}
                <div className="absolute w-40 h-40 rounded-full border border-dashed border-blue-400/60 animate-spin-slow pointer-events-none" />
                <div className="absolute w-48 h-48 rounded-full border border-sky-400/40 spin-counter pointer-events-none" />
                <div className="absolute inset-0 rounded-3xl border-2 border-blue-500/40 animate-radar-sweep pointer-events-none" />
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

        {/* Footer Actions */}
        <div className="p-5 sm:p-6 border-t dark:border-white/[0.08] border-slate-200 dark:bg-black/40 bg-slate-50 flex items-center justify-end space-x-3">
          {step === 'confirmed' ? (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full">
              {onViewReceipt && (
                <button
                  onClick={() => {
                    onClose();
                    onViewReceipt();
                  }}
                  className="w-full sm:flex-1 py-3.5 rounded-2xl bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/30 text-blue-600 dark:text-blue-400 font-extrabold text-xs transition-all shadow-sm"
                >
                  Check My Vote Receipt
                </button>
              )}
              <button
                onClick={() => {
                  onClose();
                  if (onViewLeaderboard) onViewLeaderboard();
                }}
                className="w-full sm:flex-1 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-xl shadow-blue-600/30 hover:scale-[1.02] transition-all"
              >
                Done & View Leaderboard
              </button>
            </div>
          ) : step === 'review' && currentUser ? (
            <>
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl text-xs font-bold dark:text-slate-400 text-slate-600 hover:text-slate-800 dark:hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSign}
                className="shimmer-sweep flex items-center space-x-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm shadow-xl shadow-blue-600/35 hover:scale-105 active:scale-95 transition-all"
              >
                <Fingerprint className="w-4 h-4 fill-white" />
                <span>Sign Vote with Pollar</span>
              </button>
            </>
          ) : null}
        </div>

      </div>
    </div>
  );
};
