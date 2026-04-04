const express = require("express");
const { generateRTIDocument } = require("../services/gemini.service");

const router = express.Router();

/**
 * POST /api/ai/generate-rti
 * Generate an RTI document from a complaint using Gemini AI.
 * Body: { complaintText, departmentName, citizenName? }
 */
router.post("/generate-rti", async (req, res) => {
  try {
    const { complaint } = req.body;

    if (!complaint) {
      return res.status(400).json({
        error: "complaint is required",
      });
    }

    const rtiDocument = await generateRTIDocument(complaint);

    res.json({
      rti_text: rtiDocument,
    });
  } catch (error) {
    console.error("RTI generation error:", error.message);
    res.status(500).json({
      error: "RTI generation failed",
    });
  }
});

module.exports = router;
