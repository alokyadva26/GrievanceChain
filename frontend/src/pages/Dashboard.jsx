import React, { useEffect, useState } from "react";
import ComplaintCard from "../components/ComplaintCard";
import toast from "react-hot-toast";

export default function Dashboard({ contractHook, account }) {
  const [complaints, setComplaints] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!contractHook.contract) { setLoading(false); return; }
      try {
        const all = await contractHook.getAllComplaints();
        setComplaints([...all].reverse());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [contractHook.contract]);

  const simulateDelete = async (id) => {
    try {
      // Attempt to call a non-existent function on the contract
      // The payload "0xdeadbeef" doesn't match any function signature, so the contract will revert.
      const tx = await contractHook.contract.runner.sendTransaction({
        to: contractHook.contract.target,
        data: "0xdeadbeef", 
      });
      await tx.wait();
    } catch (error) {
      toast.error("CRITICAL: Blockchain record is immutable. Deletion rejected by Smart Contract.", {
        style: { background: "#d32f2f", color: "#fff", fontWeight: "bold" },
        duration: 5000
      });
    }
  };

  const filtered = filter === "all"
    ? complaints
    : complaints.filter((c) => Number(c.status) === Number(filter));

  const statusFilters = [
    { value: "all", label: "All" },
    { value: "0", label: "Filed" },
    { value: "2", label: "Responded" },
    { value: "3", label: "Escalated" },
    { value: "4", label: "Resolved" },
    { value: "5", label: "Rejected" },
  ];

  return (
    <div className="page">
      <div className="container">
        <div className="page-header animate-in">
          <h1 className="page-title">Complaint Dashboard</h1>
          <p className="page-subtitle">All complaints across departments.</p>
        </div>

        {/* Filters */}
        <div className="dash-filters animate-in" style={{ marginBottom: "32px" }}>
          {statusFilters.map((f) => (
            <button
              key={f.value}
              className={`btn btn-sm ${filter === f.value ? "btn-primary" : "btn-secondary"}`}
              onClick={() => setFilter(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="spinner" />
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <p>No complaints found.</p>
          </div>
        ) : (
          <div className="grid grid-3">
            {filtered.map((c) => (
              <ComplaintCard 
                key={Number(c.id)} 
                complaint={c} 
                isAdminView={true} 
                onDelete={() => simulateDelete(Number(c.id))} 
              />
            ))}
          </div>
        )}
      </div>

      <style>{`
        .dash-filters {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
      `}</style>
    </div>
  );
}
