import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ComplaintCard from "../components/ComplaintCard";

export default function MyComplaints({ contractHook, account }) {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!contractHook.contract || !account) {
        setLoading(false);
        return;
      }
      try {
        const data = await contractHook.getComplaintsByCitizen(account);
        setComplaints([...data].reverse());
      } catch (err) {
        console.error("Error loading complaints:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [contractHook.contract, account]);

  return (
    <div className="page">
      <div className="container">
        <div className="page-header animate-in">
          <h1 className="page-title">My Complaints</h1>
          <p className="page-subtitle">Track all grievances filed from your connected wallet.</p>
        </div>

        {!account ? (
          <div className="glass-card" style={{ padding: "40px", textAlign: "center" }}>
            <p style={{ color: "var(--text-secondary)" }}>
              🔗 Connect your wallet to view your complaints.
            </p>
          </div>
        ) : loading ? (
          <div className="spinner" />
        ) : complaints.length === 0 ? (
          <div className="empty-state">
            <p>No complaints filed yet.</p>
            <Link to="/file" className="btn btn-primary" style={{ marginTop: "16px" }}>
              File Your First Complaint
            </Link>
          </div>
        ) : (
          <div className="grid grid-3">
            {complaints.map((c) => (
              <ComplaintCard key={Number(c.id)} complaint={c} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
