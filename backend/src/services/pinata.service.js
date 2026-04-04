const axios = require("axios");
const FormData = require("form-data");
const config = require("../config");

const PINATA_BASE_URL = "https://api.pinata.cloud";

/**
 * Upload a file buffer to Pinata IPFS.
 * @param {Buffer} fileBuffer
 * @param {string} fileName
 * @returns {{ ipfsHash: string, pinataUrl: string }}
 */
async function uploadToPinata(fileBuffer, fileName) {
  const formData = new FormData();
  formData.append("file", fileBuffer, { filename: fileName });

  const metadata = JSON.stringify({
    name: fileName,
    keyvalues: { app: "GrievanceChain" },
  });
  formData.append("pinataMetadata", metadata);

  const options = JSON.stringify({ cidVersion: 1 });
  formData.append("pinataOptions", options);

  const response = await axios.post(
    `${PINATA_BASE_URL}/pinning/pinFileToIPFS`,
    formData,
    {
      maxBodyLength: Infinity,
      headers: {
        ...formData.getHeaders(),
        pinata_api_key: config.pinataApiKey,
        pinata_secret_api_key: config.pinataSecretKey,
      },
    }
  );

  const hash = response.data.IpfsHash;
  return {
    ipfsHash: hash,
    pinataUrl: `https://gateway.pinata.cloud/ipfs/${hash}`,
  };
}

/**
 * Upload JSON data to Pinata IPFS.
 * @param {object} jsonData
 * @param {string} name
 * @returns {{ ipfsHash: string, pinataUrl: string }}
 */
async function uploadJsonToPinata(jsonData, name) {
  const response = await axios.post(
    `${PINATA_BASE_URL}/pinning/pinJSONToIPFS`,
    {
      pinataContent: jsonData,
      pinataMetadata: { name, keyvalues: { app: "GrievanceChain" } },
      pinataOptions: { cidVersion: 1 },
    },
    {
      headers: {
        "Content-Type": "application/json",
        pinata_api_key: config.pinataApiKey,
        pinata_secret_api_key: config.pinataSecretKey,
      },
    }
  );

  const hash = response.data.IpfsHash;
  return {
    ipfsHash: hash,
    pinataUrl: `https://gateway.pinata.cloud/ipfs/${hash}`,
  };
}

module.exports = { uploadToPinata, uploadJsonToPinata };
