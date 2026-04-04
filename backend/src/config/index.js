require("dotenv").config();

module.exports = {
  port: process.env.PORT || 5001,
  pinataApiKey: process.env.PINATA_API_KEY || "",
  pinataSecretKey: process.env.PINATA_SECRET_KEY || "",
  geminiApiKey: process.env.GEMINI_API_KEY || "",
};
