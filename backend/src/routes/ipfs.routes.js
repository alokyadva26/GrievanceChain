const express = require("express");
const multer = require("multer");
const { uploadToPinata, uploadJsonToPinata } = require("../services/pinata.service");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB

/**
 * POST /api/ipfs/upload
 * Upload a file to IPFS via Pinata.
 * Body: multipart/form-data with "file" field.
 */
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file provided" });
    }

    const result = await uploadToPinata(req.file.buffer, req.file.originalname);

    res.json({
      success: true,
      ipfsHash: result.ipfsHash,
      pinataUrl: result.pinataUrl,
      fileName: req.file.originalname,
      fileSize: req.file.size,
    });
  } catch (error) {
    console.error("IPFS upload error:", error.message);
    res.status(500).json({
      error: "Failed to upload to IPFS",
      details: error.message,
    });
  }
});

/**
 * POST /api/ipfs/upload-json
 * Upload JSON metadata to IPFS via Pinata.
 * Body: { data: {...}, name: "string" }
 */
router.post("/upload-json", async (req, res) => {
  try {
    const { data, name } = req.body;
    if (!data) {
      return res.status(400).json({ error: "No data provided" });
    }

    const result = await uploadJsonToPinata(data, name || "grievance-metadata");

    res.json({
      success: true,
      ipfsHash: result.ipfsHash,
      pinataUrl: result.pinataUrl,
    });
  } catch (error) {
    console.error("IPFS JSON upload error:", error.message);
    res.status(500).json({
      error: "Failed to upload JSON to IPFS",
      details: error.message,
    });
  }
});

module.exports = router;
