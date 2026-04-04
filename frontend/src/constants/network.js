// Network configuration for Base Sepolia
export const NETWORK_CONFIG = {
  chainId: "0x14A34", // 84532 in hex
  chainIdDecimal: 84532,
  chainName: "Base Sepolia Testnet",
  rpcUrls: ["https://sepolia.base.org"],
  nativeCurrency: {
    name: "Ethereum",
    symbol: "ETH",
    decimals: 18,
  },
  blockExplorerUrls: ["https://sepolia.basescan.org"],
};

export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:5001";

export const IPFS_GATEWAY = "https://gateway.pinata.cloud/ipfs/";

export const COMPLAINT_STATUS = [
  "Filed",
  "Under Review",
  "Responded",
  "Escalated",
  "Resolved",
  "Citizen Rejected",
];

export const COMPLAINT_STATUS_COLORS = {
  0: "badge-filed",
  1: "badge-filed",
  2: "badge-responded",
  3: "badge-escalated",
  4: "badge-resolved",
  5: "badge-rejected",
};

export const SCORE_LEVELS = [
  { min: 0, max: 20, label: "Excellent", color: "#00C853" },
  { min: 21, max: 40, label: "Good", color: "#448AFF" },
  { min: 41, max: 60, label: "Fair", color: "#FFD600" },
  { min: 61, max: 80, label: "Poor", color: "#FF6B35" },
  { min: 81, max: 100, label: "Critical", color: "#FF1744" },
];

export function getScoreLevel(score) {
  return SCORE_LEVELS.find((l) => score >= l.min && score <= l.max) || SCORE_LEVELS[0];
}
