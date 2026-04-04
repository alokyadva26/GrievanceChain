const express = require("express");

const router = express.Router();

// Hardcoded department metadata (mirrors on-chain departments)
const DEPARTMENTS = [
  { id: 1, name: "Public Works", description: "Roads, bridges, and public infrastructure" },
  { id: 2, name: "Health", description: "Hospitals, clinics, and public health services" },
  { id: 3, name: "Education", description: "Schools, universities, and educational programs" },
  { id: 4, name: "Police", description: "Law enforcement and public safety" },
  { id: 5, name: "Revenue", description: "Tax collection and revenue management" },
  { id: 6, name: "Transport", description: "Public transportation and traffic management" },
  { id: 7, name: "Water Supply", description: "Water distribution and sanitation" },
  { id: 8, name: "Electricity", description: "Power supply and electrical infrastructure" },
];

/**
 * GET /api/departments
 * Returns the list of available government departments.
 */
router.get("/", (req, res) => {
  res.json({ success: true, departments: DEPARTMENTS });
});

/**
 * GET /api/departments/:name
 * Returns details for a single department.
 */
router.get("/:name", (req, res) => {
  const dept = DEPARTMENTS.find(
    (d) => d.name.toLowerCase() === req.params.name.toLowerCase()
  );
  if (!dept) {
    return res.status(404).json({ error: "Department not found" });
  }
  res.json({ success: true, department: dept });
});

module.exports = router;
