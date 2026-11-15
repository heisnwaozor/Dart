import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';

const DB_FILE = path.join(process.cwd(), 'dart.sqlite');

let dbInstance = null;

export function getDatabase() {
  if (!dbInstance) {
    dbInstance = new DatabaseSync(DB_FILE);
    initSchema(dbInstance);
  }
  return dbInstance;
}

function initSchema(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT,
      avatar TEXT,
      wallet_address TEXT UNIQUE NOT NULL,
      chain TEXT DEFAULT 'stellar',
      provider TEXT NOT NULL,
      role TEXT DEFAULT 'voter',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      hackathon_id TEXT NOT NULL,
      name TEXT NOT NULL,
      tagline TEXT NOT NULL,
      description TEXT NOT NULL,
      long_description TEXT,
      repo_url TEXT NOT NULL,
      demo_url TEXT NOT NULL,
      video_url TEXT,
      contract_address TEXT,
      team_name TEXT NOT NULL,
      team_avatar TEXT,
      submitted_by TEXT NOT NULL,
      cover_image TEXT NOT NULL,
      tags TEXT NOT NULL,
      submitted_at TEXT NOT NULL,
      public_votes_count INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS votes (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL,
      project_name TEXT NOT NULL,
      voter_wallet TEXT UNIQUE NOT NULL,
      voter_name TEXT NOT NULL,
      voter_avatar TEXT,
      voter_provider TEXT NOT NULL,
      score INTEGER DEFAULT 1,
      signed_message TEXT NOT NULL,
      signature TEXT NOT NULL,
      scheme TEXT NOT NULL,
      tx_hash TEXT NOT NULL,
      voted_at TEXT NOT NULL
    );
  `);

  seedIfEmpty(db);
}

function seedIfEmpty(db) {
  const usersCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  if (usersCount === 0) {
    const insertUser = db.prepare(`
      INSERT OR REPLACE INTO users (id, name, email, avatar, wallet_address, chain, provider, role, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const seedUsers = [
      {
        id: 'user_voter_1',
        name: 'Mateo Silva',
        email: 'mateo.silva@gmail.com',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
        walletAddress: 'GDQ3Z7X2B5V9K8M1N0P4Q3R2S1T0U9V8W7X6Y5Z4A3B2C1D0E9F8A7B6',
        chain: 'stellar',
        provider: 'google',
        role: 'voter',
        createdAt: '2026-11-10T10:00:00Z'
      },
      {
        id: 'user_voter_2',
        name: 'Camila Torres',
        email: 'camila.code@github.com',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
        walletAddress: 'GBV7K91M0N4P8Q3R2S1T0U9V8W7X6Y5Z4A3B2C1D0E9F8A7B6C5D4E3',
        chain: 'stellar',
        provider: 'github',
        role: 'voter',
        createdAt: '2026-11-11T12:00:00Z'
      },
      {
        id: 'user_voter_3',
        name: 'Lucas Fernandez',
        email: 'lucas.fernandez@stellar.org',
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80',
        walletAddress: 'GA12XY99B5V9K8M1N0P4Q3R2S1T0U9V8W7X6Y5Z4A3B2C1D0E9F8A7B6',
        chain: 'stellar',
        provider: 'email',
        role: 'voter',
        createdAt: '2026-11-12T08:30:00Z'
      }
    ];

    for (const u of seedUsers) {
      insertUser.run(u.id, u.name, u.email, u.avatar, u.walletAddress, u.chain, u.provider, u.role, u.createdAt);
    }
  }

  const projectsCount = db.prepare('SELECT COUNT(*) as count FROM projects').get().count;
  if (projectsCount === 0) {
    const insertProj = db.prepare(`
      INSERT OR REPLACE INTO projects (
        id, hackathon_id, name, tagline, description, long_description,
        repo_url, demo_url, video_url, contract_address, team_name,
        team_avatar, submitted_by, cover_image, tags, submitted_at, public_votes_count
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const initialProjects = [
      {
        id: 'proj_superswap',
        hackathonId: 'hack_latam_2026',
        name: 'SuperSwap Soroban',
        tagline: 'Sub-second zero-slippage automated market maker built natively on Stellar Soroban with MEV shield.',
        description: 'SuperSwap provides an ultra-capital-efficient decentralized exchange tailored for Latin American currencies. Implements instant arbitrage balancing, gas-optimized liquidity pools, and one-click fiat on-ramps.',
        longDescription: 'SuperSwap Soroban brings institutional-grade execution to retail Web3 in Latin America.',
        repoUrl: 'https://github.com/stellar-builders/superswap-soroban',
        demoUrl: 'https://superswap-preview.pollar.run',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        contractAddress: 'CCJX...SSWP',
        teamName: 'Pampa Protocols',
        teamAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80',
        submittedBy: 'GCK4LPO7V9K8M1N0P4Q3R2S1T0U9V8W7X6Y5Z4A3B2C1D0E9F8A7B6',
        coverImage: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1200&q=80',
        tags: JSON.stringify(['DeFi', 'Soroban', 'AMM', 'Stellar']),
        submittedAt: '2026-11-11T14:30:00Z',
        publicVotesCount: 42
      },
      {
        id: 'proj_agenticvault',
        hackathonId: 'hack_latam_2026',
        name: 'AgenticVault AI',
        tagline: 'Autonomous AI treasury guards with multi-agent consensus and cryptographic multi-sig execution.',
        description: 'AgenticVault empowers DAOs and startups to assign automated financial tasks to specialized AI agents. Every agent proposal must obtain cryptographic threshold signatures before funds move.',
        longDescription: 'AgenticVault solves the risk of autonomous AI agents interacting with crypto treasuries.',
        repoUrl: 'https://github.com/agentic-treasury/agenticvault-core',
        demoUrl: 'https://agenticvault.ai.preview',
        videoUrl: null,
        contractAddress: 'CAVX...AI99',
        teamName: 'Neural Ledger Lab',
        teamAvatar: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=150&q=80',
        submittedBy: 'GAXZ76TQV9K8M1N0P4Q3R2S1T0U9V8W7X6Y5Z4A3B2C1D0E9F8A7B6',
        coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
        tags: JSON.stringify(['AI Agents', 'Treasury', 'Security', 'Soroban']),
        submittedAt: '2026-11-12T09:15:00Z',
        publicVotesCount: 57
      },
      {
        id: 'proj_polkapay',
        hackathonId: 'hack_latam_2026',
        name: 'PollarCheckout SDK',
        tagline: '1-Line JavaScript payment widget for Shopify and WooCommerce with instant USDC settlement on Stellar.',
        description: 'Replaces credit card processing fees with 0.1% Stellar settlement. Customers sign with Google or Apple FaceID via Pollar with zero crypto knowledge required.',
        longDescription: 'PollarCheckout is built to make crypto invisible to merchants and consumers.',
        repoUrl: 'https://github.com/pollar-ecosystem/pollar-checkout-sdk',
        demoUrl: 'https://checkout.pollar-demo.xyz',
        videoUrl: null,
        contractAddress: 'CPAY...SDK1',
        teamName: 'Río Payments',
        teamAvatar: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=150&q=80',
        submittedBy: 'GDW6K91MV9K8M1N0P4Q3R2S1T0U9V8W7X6Y5Z4A3B2C1D0E9F8A7B6',
        coverImage: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80',
        tags: JSON.stringify(['Payments', 'SDK', 'E-commerce', 'Pollar']),
        submittedAt: '2026-11-12T16:45:00Z',
        publicVotesCount: 39
      },
      {
        id: 'proj_veribadge',
        hackathonId: 'hack_latam_2026',
        name: 'VeriBadge ZK',
        tagline: 'Decentralized hackathon and university credential verification using zero-knowledge identity proofs.',
        description: 'VeriBadge turns hackathon achievements, certifications, and jury scores into tamper-proof on-chain badges that prove your skills without revealing your private personal information.',
        longDescription: 'VeriBadge eliminates credential fraud in developer recruitment.',
        repoUrl: 'https://github.com/veribadge/veribadge-soroban',
        demoUrl: 'https://veribadge-app.dev',
        videoUrl: null,
        contractAddress: 'CZK7...BDGE',
        teamName: 'Zero Trust Guild',
        teamAvatar: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=150&q=80',
        submittedBy: 'GAT102BCV9K8M1N0P4Q3R2S1T0U9V8W7X6Y5Z4A3B2C1D0E9F8A7B6',
        coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
        tags: JSON.stringify(['Identity', 'ZK Proofs', 'Credentials', 'Public Goods']),
        submittedAt: '2026-11-13T11:20:00Z',
        publicVotesCount: 28
      },
      {
        id: 'proj_solaris',
        hackathonId: 'hack_latam_2026',
        name: 'Solaris MicroGrid',
        tagline: 'Pay-as-you-go solar energy IoT hardware with automated Stellar micro-payments for off-grid communities.',
        description: 'Solaris connects solar battery controllers to low-bandwidth satellite IoT networks. Rural households pay for kilowatt hours in local fiat or USDC via Pollar SMS/WhatsApp bots.',
        longDescription: 'Solaris MicroGrid tackles energy poverty in northern Colombia and rural Brazil.',
        repoUrl: 'https://github.com/solaris-iot/microgrid-stellar',
        demoUrl: 'https://solaris-preview.iot.run',
        videoUrl: null,
        contractAddress: 'CSOL...IOT2',
        teamName: 'Sol Tech Colombia',
        teamAvatar: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=150&q=80',
        submittedBy: 'GC8891PXV9K8M1N0P4Q3R2S1T0U9V8W7X6Y5Z4A3B2C1D0E9F8A7B6',
        coverImage: 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?auto=format&fit=crop&w=1200&q=80',
        tags: JSON.stringify(['IoT', 'DePIN', 'Renewable Energy', 'Hardware']),
        submittedAt: '2026-11-13T19:00:00Z',
        publicVotesCount: 64
      },
      {
        id: 'proj_climacredit',
        hackathonId: 'hack_latam_2026',
        name: 'ClimaCredit Amazonia',
        tagline: 'Satellite-verified forest preservation carbon credits tokenized on Stellar with real-time MRV.',
        description: 'Empowers indigenous communities in the Amazon basin to tokenize verified hectares of preserved rainforest. Corporate buyers retire credits on-chain with immutable proof.',
        longDescription: 'ClimaCredit connects European and US ESG buyers directly to Amazon guardians.',
        repoUrl: 'https://github.com/climacredit/satellite-mrv-contracts',
        demoUrl: 'https://climacredit.earth',
        videoUrl: null,
        contractAddress: 'CCLM...MRV1',
        teamName: 'Amazonia Verde Labs',
        teamAvatar: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=150&q=80',
        submittedBy: 'GBJ91024V9K8M1N0P4Q3R2S1T0U9V8W7X6Y5Z4A3B2C1D0E9F8A7B6',
        coverImage: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80',
        tags: JSON.stringify(['RWA', 'Climate', 'Oracles', 'Public Goods']),
        submittedAt: '2026-11-14T08:00:00Z',
        publicVotesCount: 51
      }
    ];

    for (const p of initialProjects) {
      insertProj.run(
        p.id, p.hackathonId, p.name, p.tagline, p.description, p.longDescription,
        p.repoUrl, p.demoUrl, p.videoUrl, p.contractAddress, p.teamName,
        p.teamAvatar, p.submittedBy, p.coverImage, p.tags, p.submittedAt, p.publicVotesCount
      );
    }
  }

  const votesCount = db.prepare('SELECT COUNT(*) as count FROM votes').get().count;
  if (votesCount === 0) {
    const insertVote = db.prepare(`
      INSERT OR REPLACE INTO votes (
        id, project_id, project_name, voter_wallet, voter_name,
        voter_avatar, voter_provider, score, signed_message, signature,
        scheme, tx_hash, voted_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const initialVotes = [
      {
        id: 'vote_1',
        projectId: 'proj_solaris',
        projectName: 'Solaris MicroGrid',
        voterWallet: 'GDQ3Z7X2B5V9K8M1N0P4Q3R2S1T0U9V8W7X6Y5Z4A3B2C1D0E9F8A7B6',
        voterName: 'Mateo Silva',
        voterAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
        voterProvider: 'google',
        score: 1,
        signedMessage: 'Stellar Signed Message: HackathonVote\napplication: "Dart Voting"\nprojectId: "proj_solaris"',
        signature: '7e8f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f',
        scheme: 'sep53',
        txHash: 'stellar:tx:c1a2e3f4b5d6...7890',
        votedAt: '2026-11-14T16:20:00Z'
      },
      {
        id: 'vote_2',
        projectId: 'proj_agenticvault',
        projectName: 'AgenticVault AI',
        voterWallet: 'GBV7K91M0N4P8Q3R2S1T0U9V8W7X6Y5Z4A3B2C1D0E9F8A7B6C5D4E3',
        voterName: 'Camila Torres',
        voterAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
        voterProvider: 'github',
        score: 1,
        signedMessage: 'Stellar Signed Message: HackathonVote\napplication: "Dart Voting"\nprojectId: "proj_agenticvault"',
        signature: 'a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8',
        scheme: 'sep53',
        txHash: 'stellar:tx:89ab7cd6e5...1234',
        votedAt: '2026-11-14T17:05:00Z'
      },
      {
        id: 'vote_3',
        projectId: 'proj_superswap',
        projectName: 'SuperSwap Soroban',
        voterWallet: 'GA12XY99B5V9K8M1N0P4Q3R2S1T0U9V8W7X6Y5Z4A3B2C1D0E9F8A7B6',
        voterName: 'Lucas Fernandez',
        voterAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=100&q=80',
        voterProvider: 'email',
        score: 1,
        signedMessage: 'Stellar Signed Message: HackathonVote\napplication: "Dart Voting"\nprojectId: "proj_superswap"',
        signature: '4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c',
        scheme: 'sep53',
        txHash: 'stellar:tx:4567ef89ab...5678',
        votedAt: '2026-11-14T18:40:00Z'
      }
    ];

    for (const v of initialVotes) {
      insertVote.run(
        v.id, v.projectId, v.projectName, v.voterWallet, v.voterName,
        v.voterAvatar, v.voterProvider, v.score, v.signedMessage, v.signature,
        v.scheme, v.txHash, v.votedAt
      );
    }
  }
}

// User CRUD operations
export function getAllUsers() {
  const db = getDatabase();
  const rows = db.prepare('SELECT * FROM users ORDER BY created_at DESC').all();
  return rows.map(r => ({
    id: r.id,
    name: r.name,
    email: r.email,
    avatar: r.avatar,
    walletAddress: r.wallet_address,
    chain: r.chain,
    provider: r.provider,
    role: r.role,
    createdAt: r.created_at
  }));
}

export function getUserByWallet(wallet) {
  const db = getDatabase();
  const r = db.prepare('SELECT * FROM users WHERE LOWER(wallet_address) = LOWER(?)').get(wallet);
  if (!r) return null;
  return {
    id: r.id,
    name: r.name,
    email: r.email,
    avatar: r.avatar,
    walletAddress: r.wallet_address,
    chain: r.chain,
    provider: r.provider,
    role: r.role,
    createdAt: r.created_at
  };
}

export function getUserByEmail(email) {
  const db = getDatabase();
  const r = db.prepare('SELECT * FROM users WHERE LOWER(email) = LOWER(?)').get(email);
  if (!r) return null;
  return {
    id: r.id,
    name: r.name,
    email: r.email,
    avatar: r.avatar,
    walletAddress: r.wallet_address,
    chain: r.chain,
    provider: r.provider,
    role: r.role,
    createdAt: r.created_at
  };
}

export function saveUser(user) {
  const db = getDatabase();
  const existing = getUserByWallet(user.walletAddress) || (user.email ? getUserByEmail(user.email) : null);
  const id = existing?.id || user.id || `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const createdAt = existing?.createdAt || user.createdAt || new Date().toISOString();

  const stmt = db.prepare(`
    INSERT INTO users (id, name, email, avatar, wallet_address, chain, provider, role, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(wallet_address) DO UPDATE SET
      name = excluded.name,
      email = coalesce(excluded.email, users.email),
      avatar = excluded.avatar,
      provider = excluded.provider,
      role = excluded.role
  `);

  stmt.run(
    id,
    user.name,
    user.email || null,
    user.avatar || null,
    user.walletAddress,
    user.chain || 'stellar',
    user.provider || 'google',
    user.role || 'voter',
    createdAt
  );

  return getUserByWallet(user.walletAddress);
}

// Project CRUD operations
export function getAllProjects() {
  const db = getDatabase();
  const rows = db.prepare('SELECT * FROM projects ORDER BY public_votes_count DESC').all();
  return rows.map(r => ({
    id: r.id,
    hackathonId: r.hackathon_id,
    name: r.name,
    tagline: r.tagline,
    description: r.description,
    longDescription: r.long_description,
    repoUrl: r.repo_url,
    demoUrl: r.demo_url,
    videoUrl: r.video_url,
    contractAddress: r.contract_address,
    teamName: r.team_name,
    teamAvatar: r.team_avatar,
    submittedBy: r.submitted_by,
    coverImage: r.cover_image,
    tags: JSON.parse(r.tags || '[]'),
    submittedAt: r.submitted_at,
    publicVotesCount: Number(r.public_votes_count || 0)
  }));
}

export function getProjectById(id) {
  const db = getDatabase();
  const r = db.prepare('SELECT * FROM projects WHERE id = ?').get(id);
  if (!r) return null;
  return {
    id: r.id,
    hackathonId: r.hackathon_id,
    name: r.name,
    tagline: r.tagline,
    description: r.description,
    longDescription: r.long_description,
    repoUrl: r.repo_url,
    demoUrl: r.demo_url,
    videoUrl: r.video_url,
    contractAddress: r.contract_address,
    teamName: r.team_name,
    teamAvatar: r.team_avatar,
    submittedBy: r.submitted_by,
    coverImage: r.cover_image,
    tags: JSON.parse(r.tags || '[]'),
    submittedAt: r.submitted_at,
    publicVotesCount: Number(r.public_votes_count || 0)
  };
}

export function saveProject(proj) {
  const db = getDatabase();
  const id = proj.id || `proj_${Date.now()}`;
  const submittedAt = proj.submittedAt || new Date().toISOString();
  const tagsJson = JSON.stringify(proj.tags || ['Stellar', 'Hackathon']);

  const stmt = db.prepare(`
    INSERT INTO projects (
      id, hackathon_id, name, tagline, description, long_description,
      repo_url, demo_url, video_url, contract_address, team_name,
      team_avatar, submitted_by, cover_image, tags, submitted_at, public_votes_count
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      name = excluded.name,
      tagline = excluded.tagline,
      description = excluded.description,
      long_description = excluded.long_description,
      repo_url = excluded.repo_url,
      demo_url = excluded.demo_url,
      video_url = excluded.video_url,
      contract_address = excluded.contract_address,
      team_name = excluded.team_name,
      team_avatar = excluded.team_avatar,
      cover_image = excluded.cover_image,
      tags = excluded.tags
  `);

  stmt.run(
    id,
    proj.hackathonId || 'hack_latam_2026',
    proj.name,
    proj.tagline,
    proj.description,
    proj.longDescription || null,
    proj.repoUrl,
    proj.demoUrl,
    proj.videoUrl || null,
    proj.contractAddress || null,
    proj.teamName,
    proj.teamAvatar || null,
    proj.submittedBy,
    proj.coverImage,
    tagsJson,
    submittedAt,
    proj.publicVotesCount || 0
  );

  return getProjectById(id);
}

// Votes CRUD operations with atomic balance updates
export function getAllVotes() {
  const db = getDatabase();
  const rows = db.prepare('SELECT * FROM votes ORDER BY voted_at DESC').all();
  return rows.map(r => ({
    id: r.id,
    projectId: r.project_id,
    projectName: r.project_name,
    voterWallet: r.voter_wallet,
    voterName: r.voter_name,
    voterAvatar: r.voter_avatar,
    voterProvider: r.voter_provider,
    score: Number(r.score || 1),
    signedMessage: r.signed_message,
    signature: r.signature,
    scheme: r.scheme,
    txHash: r.tx_hash,
    votedAt: r.voted_at
  }));
}

export function getVoteByVoter(voterWallet) {
  const db = getDatabase();
  const r = db.prepare('SELECT * FROM votes WHERE LOWER(voter_wallet) = LOWER(?)').get(voterWallet);
  if (!r) return null;
  return {
    id: r.id,
    projectId: r.project_id,
    projectName: r.project_name,
    voterWallet: r.voter_wallet,
    voterName: r.voter_name,
    voterAvatar: r.voter_avatar,
    voterProvider: r.voter_provider,
    score: Number(r.score || 1),
    signedMessage: r.signed_message,
    signature: r.signature,
    scheme: r.scheme,
    txHash: r.tx_hash,
    votedAt: r.voted_at
  };
}

export function castVote(voteData) {
  const db = getDatabase();
  const voterWallet = voteData.voterWallet;
  const newProjectId = voteData.projectId;
  const existingVote = getVoteByVoter(voterWallet);

  if (existingVote && existingVote.projectId !== newProjectId) {
    // Voter switched pick: decrement previous project
    db.prepare('UPDATE projects SET public_votes_count = MAX(0, public_votes_count - 1) WHERE id = ?').run(existingVote.projectId);
  }

  if (!existingVote || existingVote.projectId !== newProjectId) {
    // Increment new project
    db.prepare('UPDATE projects SET public_votes_count = public_votes_count + 1 WHERE id = ?').run(newProjectId);
  }

  const id = existingVote?.id || voteData.id || `vote_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const votedAt = new Date().toISOString();

  const stmt = db.prepare(`
    INSERT INTO votes (
      id, project_id, project_name, voter_wallet, voter_name,
      voter_avatar, voter_provider, score, signed_message, signature,
      scheme, tx_hash, voted_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(voter_wallet) DO UPDATE SET
      project_id = excluded.project_id,
      project_name = excluded.project_name,
      voter_name = excluded.voter_name,
      voter_avatar = excluded.voter_avatar,
      voter_provider = excluded.voter_provider,
      signed_message = excluded.signed_message,
      signature = excluded.signature,
      tx_hash = excluded.tx_hash,
      voted_at = excluded.voted_at
  `);

  stmt.run(
    id,
    newProjectId,
    voteData.projectName,
    voterWallet,
    voteData.voterName,
    voteData.voterAvatar || null,
    voteData.voterProvider || 'google',
    voteData.score || 1,
    voteData.signedMessage,
    voteData.signature,
    voteData.scheme || 'sep53',
    voteData.txHash || `stellar:tx:${Date.now()}`,
    votedAt
  );

  return getVoteByVoter(voterWallet);
}

export function getDatabaseStats() {
  const db = getDatabase();
  const usersCount = db.prepare('SELECT COUNT(*) as c FROM users').get().c;
  const projectsCount = db.prepare('SELECT COUNT(*) as c FROM projects').get().c;
  const votesCount = db.prepare('SELECT COUNT(*) as c FROM votes').get().c;

  return {
    engine: 'SQLite (node:sqlite)',
    status: 'connected',
    file: DB_FILE,
    usersCount: Number(usersCount),
    projectsCount: Number(projectsCount),
    votesCount: Number(votesCount),
    timestamp: new Date().toISOString()
  };
}

export function resetDatabase() {
  const db = getDatabase();
  db.exec(`
    DROP TABLE IF EXISTS votes;
    DROP TABLE IF EXISTS projects;
    DROP TABLE IF EXISTS users;
  `);
  initSchema(db);
  return getDatabaseStats();
}
