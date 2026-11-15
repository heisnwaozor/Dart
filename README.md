# Dart — Cryptographic Hackathon Voting on Pollar & Stellar

Dart is a decentralized, gasless community voting platform built for Web3 and AI hackathons (such as the LATAM Builders Summit). It integrates with the **Pollar network** (`@pollar/react` and `@pollar/core`) to provide frictionless social login, instant non-custodial Stellar wallet provisioning, and cryptographic non-repudiation using **Stellar SEP-53 message signing**.

![Dart Logo](https://raw.githubusercontent.com/heisnwaozor/Dart/main/public/dart-butterfly-logo.png)

---

## 🌟 Key Features

* **Cybernetic Butterfly & Dart Aesthetic**: Electric Royal Blue and Pure White high-tech UI with custom geometric SVG branding.
* **Frictionless Social Onboarding**: One-click Google, GitHub, or Email login via Pollar with automatic gas-sponsored Stellar wallet keypair derivation.
* **Stellar SEP-53 Cryptographic Non-Repudiation**: Every vote is signed with an Ed25519 keypair and canonical SEP-53 payload (`Stellar Signed Message: HackathonVote`), ensuring auditable, tamper-proof voting records.
* **Anti-Sybil Defense**: Strict 1-vote-per-wallet rule with the flexibility to switch or update votes before the deadline.
* **Real-time Standings & Leaderboard**: Animated podium (#1, #2, #3) with live vote counts and dynamic progress shares.
* **Audit Explorer**: Public verification ledger inspecting raw message payloads, Ed25519 signature hexes, voter addresses, and Merkle root epochs.
* **Full Dark & Light Mode**: Persistent theme toggle powered by Tailwind CSS.
* **100% Responsive Design**: Tested across mobile, tablet, laptop, and ultra-wide displays.

---

## 🛠️ Tech Stack

* **Framework**: React 19 + TypeScript + Vite
* **Styling**: Tailwind CSS + Custom Mindblowing Keyframe Animations
* **Identity & Signing**: `@pollar/react` + `@pollar/core` (Stellar SEP-53)
* **Icons & Feedback**: Lucide Icons + Canvas-Confetti

---

## 🚀 Getting Started

### Prerequisites

* Node.js v18+ (tested on v22)
* npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/heisnwaozor/Dart.git
cd Dart

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be accessible at `http://localhost:5173/`.

### Production Build

```bash
npm run build
npm run preview
```

---

## 📜 License

MIT License.
