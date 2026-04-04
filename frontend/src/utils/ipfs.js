import { IPFS_GATEWAY, BACKEND_URL } from "../constants/network";

/**
 * Upload a file to IPFS via the backend.
 * @param {File} file
 * @returns {Promise<{ipfsHash: string, pinataUrl: string}>}
 */
export async function uploadToIPFS(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${BACKEND_URL}/api/ipfs/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("IPFS upload failed");
  }

  return await response.json();
}

/**
 * Upload JSON metadata to IPFS via the backend.
 */
export async function uploadJsonToIPFS(data, name) {
  const response = await fetch(`${BACKEND_URL}/api/ipfs/upload-json`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data, name }),
  });

  if (!response.ok) {
    throw new Error("IPFS JSON upload failed");
  }

  return await response.json();
}

/**
 * Get IPFS gateway URL from a hash.
 */
export function getIPFSUrl(hash) {
  if (!hash) return "";
  if (hash.startsWith("http")) return hash;
  return `${IPFS_GATEWAY}${hash}`;
}
