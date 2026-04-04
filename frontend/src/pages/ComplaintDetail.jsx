import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { formatTimestamp, getStatusLabel, getSLARemaining, shortenAddress } from "../utils/formatters";
import { getIPFSUrl } from "../utils/ipfs";
import { COMPLAINT_STATUS_COLORS, BACKEND_URL } from "../constants/network";

export default function ComplaintDetail({ contractHook, account }) {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [responseText, setResponseText] = useState("");
  const [rtiDoc, setRtiDoc] = useState("");
  const [rtiLoading, setRtiLoading] = useState(false);

  useEffect(() => {
    loadComplaint();
  }, [id, contractHook.contract]);

  async function loadComplaint() {
    if (!contractHook.contract) return;
    try {
      const c = await contractHook.getComplaint(id);
      setComplaint(c);
    } catch (err) {
      toast.error("Failed to load complaint");
    } finally {
      setLoading(false);
    }
  }

  async function handleRespond() {
    if (!responseText.trim()) return toast.error("Enter a response");
    try {
      await contractHook.respondToComplaint(id, responseText);
      toast.success("Response submitted!");
      loadComplaint();
    } catch (err) {
      toast.error(err?.reason || "Failed to respond");
    }
  }

  async function handleApprove() {
    try {
      await contractHook.approveResolution(id);
      toast.success("Resolution approved!");
      loadComplaint();
    } catch (err) {
      toast.error(err?.reason || "Failed to approve");
    }
  }

  async function handleReject() {
    try {
      await contractHook.rejectResolution(id);
      toast.success("Resolution rejected!");
      loadComplaint();
    } catch (err) {
      toast.error(err?.reason || "Failed to reject");
    }
  }

  async function handleEscalate() {
    try {
      await contractHook.escalateComplaint(id);
      toast.success("Complaint escalated!");
      loadComplaint();
    } catch (err) {
      toast.error(err?.reason || "Failed to escalate");
    }
  }

  async function handleGenerateRTI() {
    setRtiLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/generate-rti`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          complaint: complaint.description
        })
      });
      const data = await res.json();
      if (data.rti_text) {
        setRtiDoc(data.rti_text);
        toast.success("RTI document generated!");
      } else {
        toast.error(data.error || "Failed to generate RTI");
      }
    } catch (err) {
      toast.error("RTI generation failed");
    } finally {
      setRtiLoading(false);
    }
  }

  if (loading) return <div className="spinner" />;
  if (!complaint) return <div className="container page"><p>Complaint not found.</p></div>;

  const status = Number(complaint.status);
  const sla = getSLARemaining(complaint.responseDeadline);
  const isCitizen = account?.toLowerCase() === complaint.citizen?.toLowerCase();

  return (
    <div className="page">
      <div className="container">
        <Link to="/my-complaints" style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
          ← Back to Complaints
        </Link>

        <div className="detail-header animate-in" style={{ marginTop: "20px" }}>
          <div>
            <span className={`badge ${COMPLAINT_STATUS_COLORS[status]}`} style={{ marginBottom: "8px", display: "inline-block" }}>
              {getStatusLabel(status)}
            </span>
            <h1 className="page-title">{complaint.title}</h1>
            <p className="page-subtitle">Complaint #{Number(complaint.id)} • {complaint.department}</p>
          </div>
        </div>

        <div className="detail-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px", marginTop: "32px" }}>
          {/* Main Content */}
          <div>
            <div className="glass-card animate-in" style={{ padding: "24px", marginBottom: "24px" }}>
              <h3 style={{ marginBottom: "12px" }}>Description</h3>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>{complaint.description}</p>

              {complaint.ipfsHash && (
                <div style={{ marginTop: "16px" }}>
                  <span className="form-label">Evidence</span>
                  <a href={getIPFSUrl(complaint.ipfsHash)} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm" style={{ marginTop: "8px" }}>
                    📎 View on IPFS ↗
                  </a>
                </div>
              )}
            </div>

            {/* Response */}
            {complaint.responseText && (
              <div className="glass-card animate-in" style={{ padding: "24px", marginBottom: "24px", borderLeft: "3px solid var(--accent-yellow)" }}>
                <h3 style={{ marginBottom: "12px" }}>Department Response</h3>
                <p style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>{complaint.responseText}</p>
                <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "12px" }}>
                  Responded at: {formatTimestamp(complaint.respondedAt)}
                </p>
              </div>
            )}

            {/* Department Respond Form */}
            {(status === 0 || status === 3 || status === 5) && (
              <div className="glass-card animate-in" style={{ padding: "24px", marginBottom: "24px" }}>
                <h3 style={{ marginBottom: "12px" }}>Respond to Complaint</h3>
                <textarea
                  className="form-textarea"
                  placeholder="Enter your official response..."
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                />
                <button className="btn btn-primary" onClick={handleRespond} disabled={contractHook.loading} style={{ marginTop: "12px" }}>
                  {contractHook.loading ? "Submitting..." : "Submit Response"}
                </button>
              </div>
            )}

            {/* Citizen Actions */}
            {isCitizen && status === 2 && (
              <div className="glass-card animate-in" style={{ padding: "24px", marginBottom: "24px" }}>
                <h3 style={{ marginBottom: "12px" }}>Review Resolution</h3>
                <p style={{ color: "var(--text-secondary)", marginBottom: "16px" }}>
                  Are you satisfied with the department's response?
                </p>
                <div style={{ display: "flex", gap: "12px" }}>
                  <button className="btn btn-success" onClick={handleApprove} disabled={contractHook.loading}>
                    ✅ Approve
                  </button>
                  <button className="btn btn-danger" onClick={handleReject} disabled={contractHook.loading}>
                    ❌ Reject
                  </button>
                </div>
              </div>
            )}

            {/* RTI Generation */}
            <div className="glass-card animate-in" style={{ padding: "24px" }}>
              <h3 style={{ marginBottom: "12px" }}>🤖 Generate RTI Document</h3>
              <p style={{ color: "var(--text-secondary)", marginBottom: "16px", fontSize: "0.9rem" }}>
                Use AI to generate a formal RTI (Right To Information) application based on this complaint.
              </p>
              <button className="btn btn-secondary" onClick={handleGenerateRTI} disabled={rtiLoading}>
                {rtiLoading ? "Generating..." : "Generate RTI Application"}
              </button>
              {rtiDoc && (
                <pre style={{
                  marginTop: "16px",
                  padding: "16px",
                  background: "var(--bg-secondary)",
                  borderRadius: "var(--radius-sm)",
                  color: "var(--text-secondary)",
                  fontSize: "0.85rem",
                  whiteSpace: "pre-wrap",
                  maxHeight: "400px",
                  overflow: "auto"
                }}>
                  {rtiDoc}
                </pre>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="glass-card animate-in" style={{ padding: "20px", marginBottom: "24px" }}>
              <h4 style={{ marginBottom: "16px" }}>Details</h4>
              {[
                { label: "Citizen", value: complaint.isAnonymous ? "Anonymous" : shortenAddress(complaint.citizen) },
                { label: "Filed At", value: formatTimestamp(complaint.createdAt) },
                { label: "SLA Deadline", value: formatTimestamp(complaint.responseDeadline) },
                { label: "SLA Status", value: sla.text, color: sla.isOverdue ? "var(--accent-red)" : "var(--accent-green)" },
                { label: "Escalation Level", value: `${Number(complaint.escalationLevel)} / 3` },
              ].map((item, i) => (
                <div key={i} style={{ marginBottom: "12px" }}>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: "0.9rem", fontWeight: 600, color: item.color || "var(--text-primary)", marginTop: "2px" }}>
                    {item.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Escalate button */}
            {(status === 0 || status === 5) && sla.isOverdue && (
              <button
                className="btn btn-danger"
                onClick={handleEscalate}
                disabled={contractHook.loading}
                style={{ width: "100%" }}
              >
                ⚠️ Escalate Complaint
              </button>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .detail-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
