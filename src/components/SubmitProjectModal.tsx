import React, { useState } from 'react';
import { 
  X, 
  PlusCircle, 
  Sparkles, 
  Layers, 
  ExternalLink, 
  Image as ImageIcon,
  CheckCircle2,
  Code2
} from 'lucide-react';
import { PollarUser, Project } from '../types';
import { PollarClientService } from '../lib/pollar';

interface SubmitProjectModalProps {
  currentUser: PollarUser | null;
  onClose: () => void;
  onOpenAuth: () => void;
  onSuccess: (project: Project) => void;
}

export const SubmitProjectModal: React.FC<SubmitProjectModalProps> = ({
  currentUser,
  onClose,
  onOpenAuth,
  onSuccess,
}) => {
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [teamName, setTeamName] = useState('');
  const [tagsInput, setTagsInput] = useState('Stellar, Soroban, DeFi');
  const [coverImage, setCoverImage] = useState(
    'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1200&q=80'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onOpenAuth();
      return;
    }

    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const created = PollarClientService.addProject({
      hackathonId: 'hack_latam_2026',
      name: name || 'Untitled Project',
      tagline: tagline || 'Building the future of finance on Stellar',
      description: description || 'Decentralized hackathon submission.',
      repoUrl: repoUrl || 'https://github.com/stellar-builders',
      demoUrl: demoUrl || 'https://demo.pollar.run',
      teamName: teamName || currentUser.name,
      submittedBy: currentUser.walletAddress,
      coverImage: coverImage,
      tags: tags.length > 0 ? tags : ['Stellar', 'Hackathon']
    });

    onSuccess(created);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="ctrl-card relative w-full max-w-xl rounded-[36px] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b dark:border-white/[0.08] border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-[#05c92f]/20 border-2 border-[#05c92f] flex items-center justify-center text-slate-950 dark:text-white">
              <PlusCircle className="w-5 h-5 text-[#05c92f]" />
            </div>
            <div>
              <h3 className="text-base font-black dark:text-white text-slate-950">Submit Hackathon Project</h3>
              <p className="text-xs dark:text-slate-400 text-slate-500 font-medium">Pollar Pitch Projects</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          <div>
            <label className="block text-xs font-bold dark:text-slate-300 text-slate-700 uppercase tracking-wider mb-1.5">
              Project Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g., SorobanPay Micro"
              className="w-full px-4 py-2.5 rounded-2xl dark:bg-black/40 bg-slate-50 border dark:border-white/[0.08] border-slate-200 text-sm dark:text-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold dark:text-slate-300 text-slate-700 uppercase tracking-wider mb-1.5">
              Tagline (One-line pitch) *
            </label>
            <input
              type="text"
              required
              value={tagline}
              onChange={e => setTagline(e.target.value)}
              placeholder="e.g., Sub-second gasless payment streaming on Stellar"
              className="w-full px-4 py-2.5 rounded-2xl dark:bg-black/40 bg-slate-50 border dark:border-white/[0.08] border-slate-200 text-sm dark:text-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold dark:text-slate-300 text-slate-700 uppercase tracking-wider mb-1.5">
                Team Name *
              </label>
              <input
                type="text"
                required
                value={teamName}
                onChange={e => setTeamName(e.target.value)}
                placeholder="e.g., Andes Protocol"
                className="w-full px-4 py-2.5 rounded-2xl dark:bg-black/40 bg-slate-50 border dark:border-white/[0.08] border-slate-200 text-sm dark:text-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold dark:text-slate-300 text-slate-700 uppercase tracking-wider mb-1.5">
                Tags (Comma separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={e => setTagsInput(e.target.value)}
                placeholder="DeFi, Soroban, AI"
                className="w-full px-4 py-2.5 rounded-2xl dark:bg-black/40 bg-slate-50 border dark:border-white/[0.08] border-slate-200 text-sm dark:text-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-mono text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold dark:text-slate-300 text-slate-700 uppercase tracking-wider mb-1.5">
              Full Description & Architecture
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Explain how your solution uses Soroban smart contracts and Pollar identity..."
              className="w-full px-4 py-2.5 rounded-2xl dark:bg-black/40 bg-slate-50 border dark:border-white/[0.08] border-slate-200 text-xs dark:text-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 leading-relaxed font-sans"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold dark:text-slate-300 text-slate-700 uppercase tracking-wider mb-1.5">
                GitHub Repo URL
              </label>
              <input
                type="url"
                value={repoUrl}
                onChange={e => setRepoUrl(e.target.value)}
                placeholder="https://github.com/..."
                className="w-full px-4 py-2.5 rounded-2xl dark:bg-black/40 bg-slate-50 border dark:border-white/[0.08] border-slate-200 text-xs dark:text-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold dark:text-slate-300 text-slate-700 uppercase tracking-wider mb-1.5">
                Live Demo / Pitch URL
              </label>
              <input
                type="url"
                value={demoUrl}
                onChange={e => setDemoUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-4 py-2.5 rounded-2xl dark:bg-black/40 bg-slate-50 border dark:border-white/[0.08] border-slate-200 text-xs dark:text-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold dark:text-slate-300 text-slate-700 uppercase tracking-wider mb-1.5">
              Cover Image URL
            </label>
            <input
              type="url"
              value={coverImage}
              onChange={e => setCoverImage(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-4 py-2.5 rounded-2xl dark:bg-black/40 bg-slate-50 border dark:border-white/[0.08] border-slate-200 text-xs dark:text-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          <div className="pt-4 border-t dark:border-white/[0.08] border-slate-200 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="ctrl-roll-button px-5 py-2.5 rounded-full text-xs font-bold dark:text-slate-400 text-slate-600 hover:text-slate-950 dark:hover:text-white transition-colors"
            >
              <span className="ctrl-roll-label">Cancel</span>
            </button>
            <button
              type="submit"
              className="ctrl-roll-button px-7 py-3 rounded-full bg-[#05c92f] hover:bg-[#04b82a] text-slate-950 font-black text-xs border-2 border-slate-950 shadow-md transition-all"
            >
              <span className="ctrl-roll-label">Publish Submission</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
