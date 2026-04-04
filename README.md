<<<<<<< HEAD
# GrievanceChain 🛡️⛓️

A tamper-proof public grievance redressal platform where citizens file complaints against government departments. Complaints are permanently stored on the blockchain — officials cannot delete, modify, or falsely close them.

## Features

- ⛓️ **Immutable Complaints** — Filed on Base Sepolia blockchain
- ⏱️ **SLA Timer** — 7-day auto-escalation if ignored
- ✅ **Citizen Approval** — Only the citizen can resolve their complaint
- 📊 **Corruption Score Index** — Public transparency dashboard
- 📎 **IPFS Evidence** — Documents stored on decentralized storage
- 🤖 **AI RTI Generation** — Gemini-powered Right to Information drafts
- 🥷 **Anonymous Mode** — File complaints without revealing identity

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Blockchain | Base Sepolia Testnet (Chain 84532) |
| Smart Contracts | Solidity 0.8.24 + Hardhat |
| Frontend | React + Vite |
| Blockchain Library | ethers.js v6 |
| Wallet | MetaMask |
| Storage | IPFS via Pinata |
| Backend | Node.js + Express |
| AI | Google Gemini API |

## Quick Start

### 1. Clone & Install

```bash
# Smart Contracts
cd blockchain
npm install

# Backend
cd ../backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure Environment

```bash
# Copy env templates
cp .env.example .env          # root
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Edit `.env` files with your:
- `PRIVATE_KEY` — Deployer wallet private key
- `PINATA_API_KEY` / `PINATA_SECRET_KEY` — From [pinata.cloud](https://pinata.cloud)
- `GEMINI_API_KEY` — From [Google AI Studio](https://aistudio.google.com)

### 3. Deploy Smart Contracts

```bash
cd blockchain
npx hardhat compile
npx hardhat run scripts/deploy.js --network baseSepolia
```

The deploy script auto-exports the contract address and ABI to `frontend/src/constants/`.

### 4. Run Application

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000

### 5. Connect MetaMask

1. Open MetaMask
2. Add Base Sepolia network (Chain ID: 84532)
3. Get test ETH from [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-goerli-faucet)
4. Connect wallet on the app

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| POST | `/api/ipfs/upload` | Upload file to IPFS |
| POST | `/api/ipfs/upload-json` | Upload JSON to IPFS |
| POST | `/api/ai/generate-rti` | Generate RTI document |
| GET | `/api/departments` | List departments |

## Smart Contract Functions

| Function | Access | Description |
|----------|--------|-------------|
| `createComplaint()` | Citizen | File a new grievance |
| `respondToComplaint()` | Official | Submit department response |
| `approveResolution()` | Citizen | Accept the resolution |
| `rejectResolution()` | Citizen | Reject the resolution |
| `escalateComplaint()` | Anyone | Auto-escalate expired SLA |
| `getDepartmentScore()` | Public | View corruption score |

## License

MIT
=======
# GrievanceChain
GrievanceChain is a smart web app that uses blockchain and AI to improve complaint systems. It ensures complaints are secure, transparent, and cannot be changed. AI helps sort and prioritize issues, while users can track progress in real time, making the system efficient, trustworthy, and user-friendly.
>>>>>>> e8d55e9148752957174b3d93bd40c3afc28cc5f2
