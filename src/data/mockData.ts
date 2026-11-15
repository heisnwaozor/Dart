import { Hackathon, Project, PublicVote } from '../types';

export const INITIAL_HACKATHON: Hackathon = {
  id: 'hack_latam_2026',
  name: 'Dart Hackathon: LATAM Builders 2026',
  tagline: 'Decentralized Finance, AI Agents and Real-World Assets on Stellar and Soroban',
  description: 'The premier Web3 hackathon uniting 450+ builders across Latin America. Powered by Dart and Pollar for gasless identity and SEP-53 cryptographic community voting.',
  prizePool: '$75,000 USD',
  currency: 'USDC',
  votingStart: '2026-11-10T00:00:00Z',
  votingEnd: '2026-11-20T23:59:59Z',
  judgingStart: '2026-11-12T00:00:00Z',
  judgingEnd: '2026-11-21T18:00:00Z',
  status: 'live',
  network: 'Stellar',
  sponsorBanner: 'Powered by Dart, Pollar, Stellar Development Foundation & Circle'
};

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj_superswap',
    hackathonId: 'hack_latam_2026',
    name: 'SuperSwap Soroban',
    tagline: 'Sub-second zero-slippage automated market maker built natively on Stellar Soroban with MEV shield.',
    description: 'SuperSwap provides an ultra-capital-efficient decentralized exchange tailored for Latin American currencies. Implements instant arbitrage balancing, gas-optimized liquidity pools, and one-click fiat on-ramps.',
    longDescription: `SuperSwap Soroban brings institutional-grade execution to retail Web3 in Latin America. 

Key Highlights:
- Sub-second transaction finality on Soroban contracts.
- Integrated Pollar Social Wallet for gasless swaps.
- Automated stablecoin routing (USDC, ARS-token, BRL-token) with minimum slippage.
- Audited timelock contracts with SEP-53 signed emergency admin triggers.`,
    repoUrl: 'https://github.com/stellar-builders/superswap-soroban',
    demoUrl: 'https://superswap-preview.pollar.run',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    teamName: 'Pampa Protocols',
    teamAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80',
    submittedBy: 'GCK4LPO7...98HJ',
    coverImage: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1200&q=80',
    tags: ['DeFi', 'Soroban', 'AMM', 'Stellar'],
    submittedAt: '2026-11-11T14:30:00Z',
    publicVotesCount: 42
  },
  {
    id: 'proj_agenticvault',
    hackathonId: 'hack_latam_2026',
    name: 'AgenticVault AI',
    tagline: 'Autonomous AI treasury guards with multi-agent consensus and cryptographic multi-sig execution.',
    description: 'AgenticVault empowers DAOs and startups to assign automated financial tasks to specialized AI agents. Every agent proposal must obtain cryptographic threshold signatures before funds move.',
    longDescription: `AgenticVault solves the risk of autonomous AI agents interacting with crypto treasuries.

Features:
- Three LLM reviewers inspect contract calls independently for safety.
- Pollar SEP-53 key delegation ensures private keys never touch raw model prompts.
- Real-time fraud anomaly detection and emergency pause hooks.
- Cross-chain liquidity rebalancing between Stellar and Solana.`,
    repoUrl: 'https://github.com/agentic-treasury/agenticvault-core',
    demoUrl: 'https://agenticvault.ai.preview',
    teamName: 'Neural Ledger Lab',
    teamAvatar: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=150&q=80',
    submittedBy: 'GAXZ76TQ...31MN',
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    tags: ['AI Agents', 'Treasury', 'Security', 'Soroban'],
    submittedAt: '2026-11-12T09:15:00Z',
    publicVotesCount: 57
  },
  {
    id: 'proj_polkapay',
    hackathonId: 'hack_latam_2026',
    name: 'PollarCheckout SDK',
    tagline: '1-Line JavaScript payment widget for Shopify and WooCommerce with instant USDC settlement on Stellar.',
    description: 'Replaces credit card processing fees (3.9% + $0.30) with 0.1% Stellar settlement. Customers sign with Google or Apple FaceID via Pollar with zero crypto knowledge required.',
    longDescription: `PollarCheckout is built to make crypto invisible to merchants and consumers.

Highlights:
- Merchants receive settled USDC into their Pollar merchant wallet in 2.8 seconds.
- Buyers tap "Pay with Pollar" and confirm with Passkey / FaceID.
- Automated QR code fallback for POS terminals in retail stores.
- Integrated tax invoicing and automated conversion to local currency.`,
    repoUrl: 'https://github.com/pollar-ecosystem/pollar-checkout-sdk',
    demoUrl: 'https://checkout.pollar-demo.xyz',
    teamName: 'Río Payments',
    teamAvatar: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=150&q=80',
    submittedBy: 'GDW6K91M...22KL',
    coverImage: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80',
    tags: ['Payments', 'SDK', 'E-commerce', 'Pollar'],
    submittedAt: '2026-11-12T16:45:00Z',
    publicVotesCount: 39
  },
  {
    id: 'proj_veribadge',
    hackathonId: 'hack_latam_2026',
    name: 'VeriBadge ZK',
    tagline: 'Decentralized hackathon and university credential verification using zero-knowledge identity proofs.',
    description: 'VeriBadge turns hackathon achievements, certifications, and jury scores into tamper-proof on-chain badges that prove your skills without revealing your private personal information.',
    longDescription: `VeriBadge eliminates credential fraud in developer recruitment.

Key Features:
- Hackathon organizers issue cryptographic proofs to winners via Pollar.
- ZK-SNARK proofs let devs verify "I won Top 3 at LATAM Builders 2026" on resumes without leaking their wallet balance.
- Built-in GitHub and LinkedIn verifiable claim embeds.`,
    repoUrl: 'https://github.com/veribadge/veribadge-soroban',
    demoUrl: 'https://veribadge-app.dev',
    teamName: 'Zero Trust Guild',
    teamAvatar: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=150&q=80',
    submittedBy: 'GAT102BC...88PR',
    coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    tags: ['Identity', 'ZK Proofs', 'Credentials', 'Public Goods'],
    submittedAt: '2026-11-13T11:20:00Z',
    publicVotesCount: 28
  },
  {
    id: 'proj_solaris',
    hackathonId: 'hack_latam_2026',
    name: 'Solaris MicroGrid',
    tagline: 'Pay-as-you-go solar energy IoT hardware with automated Stellar micro-payments for off-grid communities.',
    description: 'Solaris connects solar battery controllers to low-bandwidth satellite IoT networks. Rural households pay for kilowatt hours in local fiat or USDC via Pollar SMS/WhatsApp bots.',
    longDescription: `Solaris MicroGrid tackles energy poverty in northern Colombia and rural Brazil.

Architecture:
- ESP32 hardware telemetry connects to Stellar testnet / mainnet.
- Streaming micro-payments: 0.001 USDC per minute of electricity.
- Hardware locks power relay if balance depletes, unlocks within 3 seconds of Pollar payment.
- Community investment pool yields 8% APY to solar panel sponsors.`,
    repoUrl: 'https://github.com/solaris-iot/microgrid-stellar',
    demoUrl: 'https://solaris-preview.iot.run',
    teamName: 'Sol Tech Colombia',
    teamAvatar: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=150&q=80',
    submittedBy: 'GC8891PX...55ZA',
    coverImage: 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?auto=format&fit=crop&w=1200&q=80',
    tags: ['IoT', 'DePIN', 'Renewable Energy', 'Hardware'],
    submittedAt: '2026-11-13T19:00:00Z',
    publicVotesCount: 64
  },
  {
    id: 'proj_climacredit',
    hackathonId: 'hack_latam_2026',
    name: 'ClimaCredit Amazonia',
    tagline: 'Satellite-verified forest preservation carbon credits tokenized on Stellar with real-time MRV.',
    description: 'Empowers indigenous communities in the Amazon basin to tokenize verified hectares of preserved rainforest. Corporate buyers retire credits on-chain with immutable proof.',
    longDescription: `ClimaCredit connects European and US ESG buyers directly to Amazon guardians.

Core Advantages:
- Sentinel-2 satellite imagery feeds real-time deforestation analysis directly to smart contracts.
- Smart contract escrow pays monthly staking dividends directly to indigenous community Pollar wallets.
- Zero intermediary broker fees (saving 40% compared to traditional carbon registries).`,
    repoUrl: 'https://github.com/climacredit/satellite-mrv-contracts',
    demoUrl: 'https://climacredit.earth',
    teamName: 'Amazonia Verde Labs',
    teamAvatar: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=150&q=80',
    submittedBy: 'GBJ91024...43QW',
    coverImage: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80',
    tags: ['RWA', 'Climate', 'Oracles', 'Public Goods'],
    submittedAt: '2026-11-14T08:00:00Z',
    publicVotesCount: 51
  }
];

export const INITIAL_PUBLIC_VOTES: PublicVote[] = [
  {
    id: 'vote_1',
    projectId: 'proj_solaris',
    projectName: 'Solaris MicroGrid',
    voterWallet: 'GDQ3Z7X2B5V9K8M1N0P4Q3R2S1T0U9V8W7X6Y5Z4A3B2C1D0E9F8A7B6',
    voterName: 'Mateo Silva',
    voterProvider: 'google',
    voterAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
    score: 1,
    signedMessage: `Stellar Signed Message: HackathonVote\napplication: "Dart Voting"\nhackathon: "Dart Hackathon: LATAM Builders 2026"\nprojectId: "proj_solaris"\nprojectName: "Solaris MicroGrid"\nvote: 1\nvoter: "GDQ3Z7X2B5V9K8M1N0P4Q3R2S1T0U9V8W7X6Y5Z4A3B2C1D0E9F8A7B6"\ntimestamp: 1763190100000\nnonce: "e8b1e4f2-9c1a-4d7a-8b9a-1c2d3e4f5a6b"`,
    signature: '7e8f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
    scheme: 'sep53',
    votedAt: '2026-11-14T16:20:00Z',
    txHash: 'stellar:tx:c1a2e3f4b5d6...7890'
  },
  {
    id: 'vote_2',
    projectId: 'proj_agenticvault',
    projectName: 'AgenticVault AI',
    voterWallet: 'GBV7K91M0N4P8Q3R2S1T0U9V8W7X6Y5Z4A3B2C1D0E9F8A7B6C5D4E3',
    voterName: 'Camila Torres',
    voterProvider: 'github',
    voterAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
    score: 1,
    signedMessage: `Stellar Signed Message: HackathonVote\napplication: "Dart Voting"\nhackathon: "Dart Hackathon: LATAM Builders 2026"\nprojectId: "proj_agenticvault"\nprojectName: "AgenticVault AI"\nvote: 1\nvoter: "GBV7K91M0N4P8Q3R2S1T0U9V8W7X6Y5Z4A3B2C1D0E9F8A7B6C5D4E3"\ntimestamp: 1763191200000\nnonce: "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d"`,
    signature: 'a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8',
    scheme: 'sep53',
    votedAt: '2026-11-14T17:05:00Z',
    txHash: 'stellar:tx:89ab7cd6e5...1234'
  },
  {
    id: 'vote_3',
    projectId: 'proj_superswap',
    projectName: 'SuperSwap Soroban',
    voterWallet: 'GA12XY99B5V9K8M1N0P4Q3R2S1T0U9V8W7X6Y5Z4A3B2C1D0E9F8A7B6',
    voterName: 'Lucas Fernandez',
    voterProvider: 'email',
    voterAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=100&q=80',
    score: 1,
    signedMessage: `Stellar Signed Message: HackathonVote\napplication: "Dart Voting"\nhackathon: "Dart Hackathon: LATAM Builders 2026"\nprojectId: "proj_superswap"\nprojectName: "SuperSwap Soroban"\nvote: 1\nvoter: "GA12XY99B5V9K8M1N0P4Q3R2S1T0U9V8W7X6Y5Z4A3B2C1D0E9F8A7B6"\ntimestamp: 1763193400000\nnonce: "3f4a5b6c-7d8e-9f0a-1b2c-3d4e5f6a7b8c"`,
    signature: '4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c',
    scheme: 'sep53',
    votedAt: '2026-11-14T18:40:00Z',
    txHash: 'stellar:tx:4567ef89ab...5678'
  }
];
