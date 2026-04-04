import { COMPLAINT_STATUS } from "../constants/network";

/**
 * Format a blockchain timestamp to locale string.
 */
export function formatTimestamp(ts) {
  if (!ts) return "N/A";
  const num = typeof ts === "bigint" ? Number(ts) : Number(ts);
  if (num === 0) return "N/A";
  return new Date(num * 1000).toLocaleString();
}

/**
 * Format an address: 0x1234...abcd
 */
export function shortenAddress(addr) {
  if (!addr) return "";
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

/**
 * Get the human-readable status label.
 */
export function getStatusLabel(statusIndex) {
  const idx = typeof statusIndex === "bigint" ? Number(statusIndex) : Number(statusIndex);
  return COMPLAINT_STATUS[idx] || "Unknown";
}

/**
 * Calculate remaining SLA time from a deadline timestamp.
 * Returns { text, isOverdue }
 */
export function getSLARemaining(deadline) {
  const dl = typeof deadline === "bigint" ? Number(deadline) : Number(deadline);
  if (dl === 0) return { text: "N/A", isOverdue: false };

  const now = Math.floor(Date.now() / 1000);
  const diff = dl - now;

  if (diff <= 0) {
    return { text: "OVERDUE", isOverdue: true };
  }

  const days = Math.floor(diff / 86400);
  const hours = Math.floor((diff % 86400) / 3600);

  return { text: `${days}d ${hours}h remaining`, isOverdue: false };
}
