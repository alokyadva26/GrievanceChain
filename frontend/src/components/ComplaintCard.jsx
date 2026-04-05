import React from "react";
import { Link } from "react-router-dom";
import { shortenAddress, formatTimestamp, getStatusLabel, getSLARemaining } from "../utils/formatters";
import { COMPLAINT_STATUS_COLORS } from "../constants/network";

export default function ComplaintCard({ complaint, isAdminView, onDelete }) {
  const status = Number(complaint.status);
  const sla = getSLARemaining(complaint.responseDeadline);

  return (
    <div className="complaint-card glass-card animate-in">
      <div className="cc-header">
        <span className={`badge ${COMPLAINT_STATUS_COLORS[status]}`}>
          {getStatusLabel(status)}
        </span>
        <span className="cc-id">#{Number(complaint.id)}</span>
      </div>

      <h4 className="cc-title">{complaint.title}</h4>
      <p className="cc-desc">{complaint.description?.slice(0, 120)}{complaint.description?.length > 120 ? "..." : ""}</p>

      <div className="cc-meta">
        <div className="cc-meta-item">
          <span className="cc-label">Department</span>
          <span className="cc-value">{complaint.department}</span>
        </div>
        <div className="cc-meta-item">
          <span className="cc-label">Filed</span>
          <span className="cc-value">{formatTimestamp(complaint.createdAt)}</span>
        </div>
        <div className="cc-meta-item">
          <span className="cc-label">SLA</span>
          <span className={`cc-value ${sla.isOverdue ? "overdue" : ""}`}>
            {sla.text}
          </span>
        </div>
        {!complaint.isAnonymous && (
          <div className="cc-meta-item">
            <span className="cc-label">Citizen</span>
            <span className="cc-value">{shortenAddress(complaint.citizen)}</span>
          </div>
        )}
      </div>

      {complaint.escalated && (
        <div className="cc-escalation">
          ⚠️ Escalation Level: {Number(complaint.escalationLevel)}
        </div>
      )}

      <div className="cc-actions">
        <Link to={`/complaint/${Number(complaint.id)}`} className="btn btn-secondary btn-sm cc-view">
          View Details →
        </Link>
        {isAdminView && (
          <button onClick={onDelete} className="btn btn-danger btn-sm cc-view" style={{ marginTop: "8px", width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: "6px" }}>
            🗑️ Delete Record
          </button>
        )}
      </div>

      <style>{`
        .complaint-card {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .cc-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .cc-id {
          font-family: var(--font-heading);
          font-weight: 700;
          color: var(--text-muted);
          font-size: 0.85rem;
        }
        .cc-title {
          font-size: 1.1rem;
          margin: 0;
        }
        .cc-desc {
          color: var(--text-secondary);
          font-size: 0.9rem;
          line-height: 1.5;
        }
        .cc-meta {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-top: 4px;
        }
        .cc-meta-item {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .cc-label {
          font-size: 0.7rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .cc-value {
          font-size: 0.85rem;
          color: var(--text-primary);
          font-weight: 500;
        }
        .cc-value.overdue {
          color: var(--accent-red);
          font-weight: 700;
        }
        .cc-escalation {
          padding: 8px 12px;
          background: rgba(255, 23, 68, 0.1);
          border: 1px solid rgba(255, 23, 68, 0.2);
          border-radius: var(--radius-sm);
          font-size: 0.82rem;
          color: var(--accent-red);
          font-weight: 600;
        }
        .cc-actions {
          margin-top: 8px;
        }
        .cc-view {
          text-align: center;
          font-size: 0.85rem;
          width: 100%;
          display: block;
        }
      `}</style>
    </div>
  );
}
