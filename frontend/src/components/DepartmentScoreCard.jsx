import React from "react";
import { getScoreLevel } from "../constants/network";

export default function DepartmentScoreCard({ name, score, stats }) {
  const level = getScoreLevel(Number(score));
  const pct = Number(score);

  return (
    <div className="score-card glass-card animate-in">
      <div className="sc-header">
        <h4 className="sc-name">{name}</h4>
        <span className="sc-label" style={{ color: level.color }}>{level.label}</span>
      </div>

      <div className="sc-gauge">
        <svg viewBox="0 0 120 60" className="sc-arc">
          {/* Background arc */}
          <path
            d="M 10 55 A 50 50 0 0 1 110 55"
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="8"
            strokeLinecap="round"
          />
          {/* Filled arc */}
          <path
            d="M 10 55 A 50 50 0 0 1 110 55"
            fill="none"
            stroke={level.color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${pct * 1.57} 157`}
            style={{ filter: `drop-shadow(0 0 6px ${level.color}40)` }}
          />
        </svg>
        <div className="sc-score" style={{ color: level.color }}>
          {pct}
        </div>
      </div>

      {stats && (
        <div className="sc-stats">
          <div className="sc-stat">
            <span className="sc-stat-val">{Number(stats.totalComplaints)}</span>
            <span className="sc-stat-lbl">Total</span>
          </div>
          <div className="sc-stat">
            <span className="sc-stat-val">{Number(stats.resolvedComplaints)}</span>
            <span className="sc-stat-lbl">Resolved</span>
          </div>
          <div className="sc-stat">
            <span className="sc-stat-val">{Number(stats.slaBreaches)}</span>
            <span className="sc-stat-lbl">SLA Breach</span>
          </div>
          <div className="sc-stat">
            <span className="sc-stat-val">{Number(stats.escalations)}</span>
            <span className="sc-stat-lbl">Escalated</span>
          </div>
        </div>
      )}

      <style>{`
        .score-card {
          padding: 24px;
          text-align: center;
        }
        .sc-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        .sc-name {
          font-size: 1rem;
          margin: 0;
        }
        .sc-label {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .sc-gauge {
          position: relative;
          width: 160px;
          height: 90px;
          margin: 0 auto 16px;
        }
        .sc-arc {
          width: 100%;
          height: 100%;
        }
        .sc-score {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          font-family: var(--font-heading);
          font-size: 2rem;
          font-weight: 800;
        }
        .sc-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
          margin-top: 8px;
          padding-top: 16px;
          border-top: 1px solid var(--border-subtle);
        }
        .sc-stat {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .sc-stat-val {
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 1.1rem;
          color: var(--text-white);
        }
        .sc-stat-lbl {
          font-size: 0.65rem;
          color: var(--text-muted);
          text-transform: uppercase;
        }
      `}</style>
    </div>
  );
}
