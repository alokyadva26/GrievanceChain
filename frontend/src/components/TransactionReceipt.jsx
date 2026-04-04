import React from "react";
import { shortenAddress } from "../utils/formatters";

export default function TransactionReceipt({ receipt, onClose }) {
  if (!receipt) return null;

  return (
    <div className="receipt-overlay" onClick={onClose}>
      <div className="receipt-modal glass-card animate-in" onClick={(e) => e.stopPropagation()}>
        <div className="receipt-icon">✅</div>
        <h3>Transaction Confirmed!</h3>
        <p className="receipt-sub">Your complaint has been permanently recorded on the blockchain.</p>

        <div className="receipt-details">
          <div className="receipt-row">
            <span className="receipt-label">Transaction Hash</span>
            <a
              href={`https://sepolia.basescan.org/tx/${receipt.hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="receipt-value link"
            >
              {shortenAddress(receipt.hash)}↗
            </a>
          </div>
          <div className="receipt-row">
            <span className="receipt-label">Block Number</span>
            <span className="receipt-value">{Number(receipt.blockNumber)}</span>
          </div>
          <div className="receipt-row">
            <span className="receipt-label">Gas Used</span>
            <span className="receipt-value">{receipt.gasUsed?.toString()}</span>
          </div>
          <div className="receipt-row">
            <span className="receipt-label">Status</span>
            <span className="receipt-value" style={{ color: "var(--accent-green)" }}>
              {receipt.status === 1 ? "✓ Success" : "✗ Failed"}
            </span>
          </div>
        </div>

        <button className="btn btn-primary" onClick={onClose} style={{ width: "100%", marginTop: "16px" }}>
          Done
        </button>
      </div>

      <style>{`
        .receipt-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(4px);
        }
        .receipt-modal {
          max-width: 440px;
          width: 90%;
          padding: 32px;
          text-align: center;
        }
        .receipt-icon {
          font-size: 3rem;
          margin-bottom: 12px;
        }
        .receipt-modal h3 {
          margin-bottom: 8px;
        }
        .receipt-sub {
          color: var(--text-secondary);
          font-size: 0.9rem;
          margin-bottom: 24px;
        }
        .receipt-details {
          text-align: left;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          overflow: hidden;
        }
        .receipt-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          border-bottom: 1px solid var(--border-subtle);
        }
        .receipt-row:last-child {
          border-bottom: none;
        }
        .receipt-label {
          font-size: 0.82rem;
          color: var(--text-muted);
        }
        .receipt-value {
          font-family: var(--font-heading);
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-primary);
        }
        .receipt-value.link {
          color: var(--accent-saffron) !important;
        }
      `}</style>
    </div>
  );
}
