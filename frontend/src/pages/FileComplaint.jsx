import React, { useState } from "react";
import toast from "react-hot-toast";
import ComplaintForm from "../components/ComplaintForm";
import TransactionReceipt from "../components/TransactionReceipt";

export default function FileComplaint({ contractHook, account, isCorrectNetwork }) {
  const [receipt, setReceipt] = useState(null);

  const handleSubmit = async (formData) => {
    if (!account) {
      toast.error("Please connect your wallet first");
      return;
    }
    if (!isCorrectNetwork) {
      toast.error("Please switch to Base Sepolia network");
      return;
    }

    try {
      const txReceipt = await contractHook.createComplaint(
        formData.department,
        formData.title,
        formData.description,
        formData.ipfsHash || "",
        formData.isAnonymous
      );
      setReceipt(txReceipt);
      toast.success("Complaint filed on blockchain!");
    } catch (err) {
      console.error("Error filing complaint:", err);
      const msg = err?.reason || err?.message || "Transaction failed";
      toast.error(msg);
    }
  };

  return (
    <div className="page">
      <div className="container">
        <div className="page-header animate-in">
          <h1 className="page-title">File a Complaint</h1>
          <p className="page-subtitle">
            Your complaint will be permanently stored on the blockchain. Officials cannot delete it.
          </p>
        </div>

        {!account ? (
          <div className="glass-card" style={{ padding: "40px", textAlign: "center" }}>
            <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem" }}>
              🔗 Please connect your MetaMask wallet to file a complaint.
            </p>
          </div>
        ) : !isCorrectNetwork ? (
          <div className="glass-card" style={{ padding: "40px", textAlign: "center" }}>
            <p style={{ color: "var(--accent-red)", fontSize: "1.1rem" }}>
              ⚠️ Please switch to the Base Sepolia network to continue.
            </p>
          </div>
        ) : (
          <ComplaintForm onSubmit={handleSubmit} loading={contractHook.loading} />
        )}
      </div>

      {receipt && (
        <TransactionReceipt receipt={receipt} onClose={() => setReceipt(null)} />
      )}
    </div>
  );
}
