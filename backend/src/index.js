const express = require("express");
const cors = require("cors");
require("dotenv").config();

const ipfsRoutes = require("./routes/ipfs.routes");
const aiRoutes = require("./routes/ai.routes");
const departmentRoutes = require("./routes/department.routes");

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    service: "GrievanceChain Backend",
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use("/api/ipfs", ipfsRoutes);
app.use("/", aiRoutes);
app.use("/api/departments", departmentRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, "127.0.0.1", () => {
  console.log(`\n🚀 GrievanceChain Backend running on port ${PORT}`);
  console.log(`   Health: http://127.0.0.1:${PORT}/health`);
  console.log(`   IPFS:   http://127.0.0.1:${PORT}/api/ipfs`);
  console.log(`   AI:     http://127.0.0.1:${PORT}/api/ai`);
  console.log(`   Depts:  http://127.0.0.1:${PORT}/api/departments\n`);
});
