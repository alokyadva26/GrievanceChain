require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

let genAI = null;

function getClient() {
  if (!genAI) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return genAI;
}

/**
 * Generate an RTI (Right To Information) application document.
 * @param {string} complaint - Description of the complaint
 * @returns {Promise<string>} - The generated RTI document text
 */
async function generateRTIDocument(complaint) {
  const client = getClient();
  const model = client.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `Convert the following complaint into a formal RTI (Right to Information) application under the RTI Act of India.\n\nComplaint: ${complaint}`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  return response.text();
}

module.exports = { generateRTIDocument };
