export interface Hackathon {
  id: string;
  name: string;
  tagline: string;
  description: string;
  prizePool: string;
  currency: string;
  votingStart: string;
  votingEnd: string;
  judgingStart: string;
  judgingEnd: string;
  status: 'draft' | 'live' | 'judging' | 'closed';
  network: 'Stellar' | 'Solana' | 'Multi-chain';
  sponsorBanner?: string;
}

export interface Project {
  id: string;
  hackathonId: string;
  name: string;
  tagline: string;
  description: string;
  longDescription?: string;
  repoUrl: string;
  demoUrl: string;
  videoUrl?: string;
  teamName: string;
  teamAvatar?: string;
  submittedBy: string; // Pollar wallet address
  coverImage: string;
  tags: string[];
  submittedAt: string;
  publicVotesCount: number;
  averageJudgeScore?: number;
}

export interface Judge {
  id: string;
  hackathonId: string;
  walletAddress: string;
  name: string;
  role: string;
  organization: string;
  avatar: string;
  verified: boolean;
}

export interface JudgeScore {
  id: string;
  projectId: string;
  judgeId: string;
  judgeName: string;
  judgeWallet: string;
  scoreInnovation: number; // 0 - 10
  scoreTechnical: number;  // 0 - 10
  scoreUx: number;         // 0 - 10
  scoreImpact: number;     // 0 - 10
  totalScore: number;      // 0 - 40
  comment: string;
  submittedAt: string;
}

export interface PublicVote {
  id: string;
  projectId: string;
  projectName: string;
  voterWallet: string;
  voterName: string;
  voterProvider: 'google' | 'github' | 'email' | 'wallet';
  voterAvatar?: string;
  score: number; // 1 point per project
  signedMessage: string;
  signature: string;
  scheme: 'sep53' | 'ed25519' | 'solana-sign';
  votedAt: string;
  txHash: string;
}

export interface PollarUser {
  id: string;
  name: string;
  email?: string;
  avatar: string;
  walletAddress: string;
  chain: 'stellar' | 'solana';
  provider: 'google' | 'github' | 'email' | 'wallet';
  role: 'voter' | 'judge' | 'organizer';
  judgeProfile?: Judge;
}

export interface SignatureProof {
  status: 'signed' | 'rejected' | 'error';
  signature: string;
  signerAddress: string;
  signedMessage: string;
  scheme: 'sep53' | 'ed25519';
  timestamp: number;
  txHash: string;
}
