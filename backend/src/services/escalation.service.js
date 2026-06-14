const cron = require("node-cron");
const { ethers } = require("ethers");

const ABI = [
  "function getAllComplaints() external view returns (tuple(uint256 id, address citizen, string department, string title, string description, string ipfsHash, uint8 status, uint256 createdAt, uint256 responseDeadline, bool escalated, bool citizenApproved, string responseText, uint256 respondedAt, uint8 escalationLevel, bool isAnonymous)[])",
  "function escalateComplaint(uint256 _complaintId) external"
];

class EscalationService {
  constructor() {
    this.rpcUrl = process.env.RPC_URL || "https://sepolia.base.org";
    this.privateKey = process.env.PRIVATE_KEY;
    this.contractAddress = process.env.CONTRACT_ADDRESS || "0x0409Dc247747FdBB1419d3Efdd406BBf84635F36";
    this.isRunning = false;
  }

  start() {
    if (!this.privateKey) {
      console.warn("⚠️ Escalation Service: PRIVATE_KEY not found in .env. Auto-escalation disabled.");
      return;
    }

    console.log("🕒 Starting Auto-Escalation Cron Job (runs every minute)");
    // Run every minute
    cron.schedule("* * * * *", () => {
      this.checkAndEscalate();
    });
  }

  async checkAndEscalate() {
    if (this.isRunning) return; // Prevent concurrent runs
    this.isRunning = true;

    try {
      const provider = new ethers.JsonRpcProvider(this.rpcUrl);
      const wallet = new ethers.Wallet(this.privateKey, provider);
      const contract = new ethers.Contract(this.contractAddress, ABI, wallet);

      const complaints = await contract.getAllComplaints();
      const currentTimestamp = Math.floor(Date.now() / 1000);

      const overdueComplaints = [];

      for (let i = 0; i < complaints.length; i++) {
        const c = complaints[i];
        const status = Number(c.status); // enum ComplaintStatus
        const responseDeadline = Number(c.responseDeadline);
        const escalationLevel = Number(c.escalationLevel);

        // status == 0 (Filed) or status == 5 (CitizenRejected)
        // Note: from your frontend, 5 is CitizenRejected (based on enum in contract)
        if ((status === 0 || status === 5) && currentTimestamp > responseDeadline && escalationLevel < 3) {
           overdueComplaints.push(Number(c.id));
        }
      }

      if (overdueComplaints.length > 0) {
        console.log(`🚨 Found ${overdueComplaints.length} overdue complaints requiring escalation:`, overdueComplaints);
        
        for (const id of overdueComplaints) {
          try {
            console.log(`⏳ Escalating complaint #${id}...`);
            const tx = await contract.escalateComplaint(id);
            await tx.wait();
            console.log(`✅ Complaint #${id} successfully escalated! Tx: ${tx.hash}`);
          } catch (err) {
            console.error(`❌ Failed to escalate complaint #${id}:`, err.message);
          }
        }
      } else {
        // console.log("✅ No complaints require escalation at this time."); // Optional: uncomment for verbose logging
      }

    } catch (error) {
      console.error("❌ Escalation Service Error:", error.message);
    } finally {
      this.isRunning = false;
    }
  }
}

module.exports = new EscalationService();
