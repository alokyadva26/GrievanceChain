import React, { useEffect, useState } from "react";
import ComplaintCard from "../components/ComplaintCard";

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
              <ComplaintCard key={Number(c.id)} complaint={c} />
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
