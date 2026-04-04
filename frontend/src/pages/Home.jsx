import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ComplaintCard from "../components/ComplaintCard";

export default function Home({ contract }) {
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [stats, setStats] = useState({ total: 0, resolved: 0, departments: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!contract) { setLoading(false); return; }
      try {
        const all = await contract.getAllComplaints();
        const complaints = [...all].reverse().slice(0, 6);
        setRecentComplaints(complaints);

        const resolved = all.filter((c) => Number(c.status) === 4).length;
        const deptNames = await contract.getAllDepartmentNames();

        setStats({
          total: all.length,
          resolved,
          departments: deptNames.length,
        });
      } catch (err) {
        console.error("Error loading homepage data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [contract]);

  return (
    <div className="home-page">
      {/* Hero */}
      <section className="hero">
        <div className="container">
          <div className="hero-content animate-in">
            <div className="hero-badge">🛡️ Blockchain-Powered Transparency</div>
            <h1 className="hero-title">
              Tamper-Proof<br />
              <span className="gradient-text">Public Grievance</span><br />
              Redressal
            </h1>
            <p className="hero-desc">
              File complaints against government departments that cannot be deleted, falsely closed, or ignored.
              Every grievance is permanently recorded on the blockchain.
            </p>
            <div className="hero-actions">
              <Link to="/file" className="btn btn-primary btn-lg">
                📝 File a Complaint
              </Link>
              <Link to="/transparency" className="btn btn-secondary btn-lg">
                📊 View Transparency Dashboard
              </Link>
            </div>
          </div>
        </div>

        {/* Background effects */}
        <div className="hero-glow hero-glow-1" />
        <div className="hero-glow hero-glow-2" />
      </section>

      {/* Stats */}
      <section className="container">
        <div className="grid grid-3" style={{ marginBottom: "60px" }}>
          <div className="glass-card stat-card animate-in animate-in-delay-1">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Complaints</div>
          </div>
          <div className="glass-card stat-card animate-in animate-in-delay-2">
            <div className="stat-value">{stats.resolved}</div>
            <div className="stat-label">Resolved</div>
          </div>
          <div className="glass-card stat-card animate-in animate-in-delay-3">
            <div className="stat-value">{stats.departments}</div>
            <div className="stat-label">Departments</div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container how-section">
        <h2 className="section-title animate-in">How It Works</h2>
        <div className="grid grid-4 how-grid">
          {[
            { icon: "🔗", title: "Connect Wallet", desc: "Link your MetaMask wallet to Base Sepolia" },
            { icon: "📝", title: "File Complaint", desc: "Submit your grievance with evidence on IPFS" },
            { icon: "⏱️", title: "SLA Timer", desc: "7-day auto-escalation if department ignores" },
            { icon: "✅", title: "Citizen Approval", desc: "Only YOU can mark the complaint as resolved" },
          ].map((step, i) => (
            <div key={i} className={`glass-card how-card animate-in animate-in-delay-${i + 1}`}>
              <div className="how-icon">{step.icon}</div>
              <h4>{step.title}</h4>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Complaints */}
      {recentComplaints.length > 0 && (
        <section className="container" style={{ paddingBottom: "60px" }}>
          <h2 className="section-title animate-in">Recent Complaints</h2>
          <div className="grid grid-3">
            {recentComplaints.map((c, i) => (
              <ComplaintCard key={Number(c.id)} complaint={c} />
            ))}
          </div>
        </section>
      )}

      {loading && <div className="spinner" />}

      <style>{`
        .hero {
          position: relative;
          padding: 80px 0 60px;
          overflow: hidden;
        }
        .hero-content {
          position: relative;
          z-index: 2;
          max-width: 700px;
        }
        .hero-badge {
          display: inline-block;
          padding: 6px 16px;
          background: rgba(255, 107, 53, 0.1);
          border: 1px solid rgba(255, 107, 53, 0.2);
          border-radius: 20px;
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--accent-saffron);
          margin-bottom: 24px;
        }
        .hero-title {
          font-size: 3.5rem;
          line-height: 1.1;
          margin-bottom: 24px;
          letter-spacing: -0.02em;
        }
        .gradient-text {
          background: linear-gradient(135deg, var(--accent-saffron), var(--accent-yellow));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hero-desc {
          font-size: 1.15rem;
          color: var(--text-secondary);
          line-height: 1.7;
          margin-bottom: 36px;
          max-width: 560px;
        }
        .hero-actions {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }
        .hero-glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.15;
        }
        .hero-glow-1 {
          width: 500px;
          height: 500px;
          background: var(--accent-saffron);
          top: -100px;
          right: -100px;
        }
        .hero-glow-2 {
          width: 300px;
          height: 300px;
          background: var(--accent-purple);
          bottom: -50px;
          left: 30%;
        }
        .section-title {
          font-size: 1.8rem;
          margin-bottom: 32px;
        }
        .how-section {
          padding: 60px 0;
        }
        .how-card {
          padding: 28px;
          text-align: center;
        }
        .how-icon {
          font-size: 2.5rem;
          margin-bottom: 12px;
        }
        .how-card h4 {
          margin-bottom: 8px;
          font-size: 1rem;
        }
        .how-card p {
          color: var(--text-secondary);
          font-size: 0.85rem;
          line-height: 1.5;
        }

        @media (max-width: 768px) {
          .hero-title { font-size: 2.2rem; }
          .hero { padding: 40px 0 30px; }
          .how-grid { grid-template-columns: 1fr 1fr; }
        }
      `}</style>
    </div>
  );
}
