import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Code2, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Trophy,
  Layers,
  Terminal,
  Cpu,
  Coins
} from 'lucide-react';
import { PollarUser, Project } from '../types';
import { PollarClientService } from '../lib/pollar';

interface BuilderPortalProps {
  currentUser: PollarUser | null;
  onBackToPortal: () => void;
  onViewInVotingArena: () => void;
  onOpenAuth: () => void;
}

export const BuilderPortal: React.FC<BuilderPortalProps> = ({
  currentUser,
  onBackToPortal,
  onViewInVotingArena,
  onOpenAuth,
}) => {
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [longDescription, setLongDescription] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [contractAddress, setContractAddress] = useState('');
  const [teamName, setTeamName] = useState('');
  const [selectedTrack, setSelectedTrack] = useState('DeFi & Soroban');
  const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1200&q=80');

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [newProjectId, setNewProjectId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const TRACKS = [
    { name: 'DeFi & Soroban', prize: '$25,000 USD', icon: Coins },
    { name: 'AI Agents & Oracles', prize: '$20,000 USD', icon: Cpu },
    { name: 'Real-World Assets', prize: '$15,000 USD', icon: Layers },
    { name: 'DePIN & Hardware', prize: '$15,000 USD', icon: Terminal },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim() || !tagline.trim() || !description.trim() || !repoUrl.trim() || !teamName.trim()) {
      setErrorMsg('Please complete all required fields (Name, Tagline, Description, Repo, and Team).');
      return;
    }

    if (!currentUser) {
      onOpenAuth();
      return;
    }

    const newProject: Project = {
      id: `proj_${Date.now()}`,
      hackathonId: 'hack_latam_2026',
      name: name.trim(),
      tagline: tagline.trim(),
      description: description.trim(),
      longDescription: longDescription.trim() || description.trim(),
      repoUrl: repoUrl.trim(),
      demoUrl: demoUrl.trim() || repoUrl.trim(),
      videoUrl: videoUrl.trim() || undefined,
      teamName: teamName.trim(),
      teamAvatar: currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      submittedBy: currentUser.walletAddress,
      coverImage: coverImage.trim() || 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1200&q=80',
      tags: [selectedTrack.split(' ')[0], 'Stellar', 'Soroban', 'Hackathon'],
      submittedAt: new Date().toISOString(),
      publicVotesCount: 0
    };

    PollarClientService.addProject(newProject);
    setNewProjectId(newProject.id);
    setIsSubmitted(true);
  };

  return (
    <div className="py-10 sm:py-16">
      <div className="motion-container max-w-6xl mx-auto">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={onBackToPortal}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/[0.06] hover:bg-slate-200 dark:hover:bg-white/[0.12] text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Portal Hub</span>
          </button>

          <button
            onClick={onViewInVotingArena}
            className="text-xs sm:text-sm font-mono font-bold text-blue-500 hover:underline flex items-center gap-1.5"
          >
            <span>View Current Voting Standings</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Portal Header */}
        <div className="mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-mono font-bold text-xs uppercase tracking-wider">
            <Code2 className="w-4 h-4" />
            <span>Builder Submission Gateway</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black dark:text-white text-slate-950 tracking-tight">
            Submit Your Soroban Project
          </h1>
          <p className="text-sm sm:text-base dark:text-slate-400 text-slate-600 max-w-2xl">
            Register your decentralized application for the LATAM Builders Summit 2026. Submissions will be opened immediately to community voting and expert review.
          </p>
        </div>

        {/* Submission Success State */}
        {isSubmitted ? (
          <div className="rounded-[36px] p-8 sm:p-14 dark:bg-[#0E1527] bg-white border-2 border-emerald-500/40 shadow-2xl text-center max-w-2xl mx-auto space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black dark:text-white text-slate-950">
                Project Submitted Successfully!
              </h2>
              <p className="text-sm dark:text-slate-400 text-slate-600">
                Your project <strong className="text-emerald-500 font-bold">{name}</strong> has been registered on the Stellar hackathon ledger with ID: <span className="font-mono text-xs">{newProjectId}</span>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-white/[0.04] text-xs font-mono dark:text-slate-300 text-slate-700 flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Ready for gasless community voting on Pollar</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <button
                onClick={onViewInVotingArena}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all"
              >
                Go to Voting Arena
              </button>
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setName('');
                  setTagline('');
                  setDescription('');
                }}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl dark:bg-white/[0.06] bg-slate-100 dark:text-white text-slate-800 text-sm font-bold hover:bg-slate-200 dark:hover:bg-white/[0.12] transition-colors"
              >
                Submit Another Project
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Left 4 Cols: Tracks & Guidelines */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Prize Tracks Card */}
              <div className="rounded-3xl p-6 sm:p-7 dark:bg-[#0E1527] bg-white border dark:border-white/[0.08] border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-500 uppercase tracking-wider">
                  <Trophy className="w-4 h-4" />
                  <span>$75,000 USD Prize Tracks</span>
                </div>
                
                <div className="space-y-3">
                  {TRACKS.map(t => {
                    const Icon = t.icon;
                    const isSelected = selectedTrack === t.name;
                    return (
                      <div
                        key={t.name}
                        onClick={() => setSelectedTrack(t.name)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-blue-500/15 border-blue-500 dark:text-white text-slate-900 font-bold'
                            : 'dark:bg-white/[0.02] bg-slate-50 dark:border-white/[0.06] border-slate-200 dark:text-slate-300 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`w-4 h-4 ${isSelected ? 'text-blue-500' : 'text-slate-400'}`} />
                          <span className="text-xs sm:text-sm">{t.name}</span>
                        </div>
                        <span className="text-xs font-mono font-bold text-amber-500">{t.prize}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Submission Checklist */}
              <div className="rounded-3xl p-6 sm:p-7 dark:bg-[#0E1527] bg-white border dark:border-white/[0.08] border-slate-200 shadow-sm space-y-4">
                <h4 className="text-sm font-bold dark:text-white text-slate-900 uppercase tracking-wider font-mono">
                  Builder Checklist
                </h4>
                <ul className="space-y-3 text-xs dark:text-slate-400 text-slate-600">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>Public GitHub repository with README instructions.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>Deployed Soroban Testnet or Mainnet smart contract.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>Interactive demo URL or working frontend preview.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>Optional 2-3 minute YouTube or Loom pitch walkthrough.</span>
                  </li>
                </ul>
              </div>

            </div>

            {/* Right 8 Cols: The Submission Form */}
            <div className="lg:col-span-8">
              <form onSubmit={handleSubmit} className="rounded-3xl p-7 sm:p-10 dark:bg-[#0E1527] bg-white border dark:border-white/[0.08] border-slate-200 shadow-xl space-y-6">
                
                {errorMsg && (
                  <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs sm:text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Project Name */}
                <div className="space-y-2">
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider dark:text-slate-300 text-slate-700">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. SuperSwap Soroban"
                    className="w-full px-4 py-3 rounded-2xl dark:bg-white/[0.05] bg-slate-50 border dark:border-white/[0.1] border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Tagline */}
                <div className="space-y-2">
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider dark:text-slate-300 text-slate-700">
                    Short Tagline (1 sentence) *
                  </label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={e => setTagline(e.target.value)}
                    placeholder="Sub-second zero-slippage automated market maker on Stellar."
                    className="w-full px-4 py-3 rounded-2xl dark:bg-white/[0.05] bg-slate-50 border dark:border-white/[0.1] border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Team Name */}
                <div className="space-y-2">
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider dark:text-slate-300 text-slate-700">
                    Team or Studio Name *
                  </label>
                  <input
                    type="text"
                    value={teamName}
                    onChange={e => setTeamName(e.target.value)}
                    placeholder="e.g. Pampa Protocols"
                    className="w-full px-4 py-3 rounded-2xl dark:bg-white/[0.05] bg-slate-50 border dark:border-white/[0.1] border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider dark:text-slate-300 text-slate-700">
                    Detailed Architecture & Pitch *
                  </label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Explain the problem you solved, your Soroban smart contract logic, and your target Latin American Web3 users..."
                    className="w-full px-4 py-3 rounded-2xl dark:bg-white/[0.05] bg-slate-50 border dark:border-white/[0.1] border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed resize-none"
                    required
                  />
                </div>

                {/* URLs: Repo, Demo, Video */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider dark:text-slate-300 text-slate-700">
                      GitHub Repository *
                    </label>
                    <input
                      type="url"
                      value={repoUrl}
                      onChange={e => setRepoUrl(e.target.value)}
                      placeholder="https://github.com/..."
                      className="w-full px-4 py-3 rounded-2xl dark:bg-white/[0.05] bg-slate-50 border dark:border-white/[0.1] border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider dark:text-slate-300 text-slate-700">
                      Live Demo URL
                    </label>
                    <input
                      type="url"
                      value={demoUrl}
                      onChange={e => setDemoUrl(e.target.value)}
                      placeholder="https://demo.pollar.run"
                      className="w-full px-4 py-3 rounded-2xl dark:bg-white/[0.05] bg-slate-50 border dark:border-white/[0.1] border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Video & Soroban Contract Address */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider dark:text-slate-300 text-slate-700">
                      Pitch Video (YouTube/Loom)
                    </label>
                    <input
                      type="url"
                      value={videoUrl}
                      onChange={e => setVideoUrl(e.target.value)}
                      placeholder="https://youtube.com/watch?v=..."
                      className="w-full px-4 py-3 rounded-2xl dark:bg-white/[0.05] bg-slate-50 border dark:border-white/[0.1] border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider dark:text-slate-300 text-slate-700">
                      Soroban Contract Address (Optional)
                    </label>
                    <input
                      type="text"
                      value={contractAddress}
                      onChange={e => setContractAddress(e.target.value)}
                      placeholder="CA7XYZ...98PQR"
                      className="w-full px-4 py-3 rounded-2xl dark:bg-white/[0.05] bg-slate-50 border dark:border-white/[0.1] border-slate-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Cover Image URL with Live Preview */}
                <div className="space-y-2">
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider dark:text-slate-300 text-slate-700">
                    Cover Banner Image URL
                  </label>
                  <input
                    type="url"
                    value={coverImage}
                    onChange={e => setCoverImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-4 py-3 rounded-2xl dark:bg-white/[0.05] bg-slate-50 border dark:border-white/[0.1] border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {coverImage && (
                    <div className="h-28 w-full rounded-2xl overflow-hidden mt-2 border dark:border-white/10 border-slate-200">
                      <img
                        src={coverImage}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1200&q=80';
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Submit CTA */}
                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm sm:text-base shadow-xl shadow-emerald-600/25 transition-all flex items-center justify-center gap-2"
                  >
                    <Upload className="w-5 h-5" />
                    <span>Submit Project to Hackathon</span>
                  </button>
                  <p className="text-[11px] text-center dark:text-slate-400 text-slate-500 mt-2 font-mono">
                    Project will be cryptographically registered and immediately eligible for public community votes.
                  </p>
                </div>

              </form>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
