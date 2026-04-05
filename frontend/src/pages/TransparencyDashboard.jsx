import React, { useEffect, useState } from "react";
import DepartmentScoreCard from "../components/DepartmentScoreCard";
import { getScoreLevel } from "../constants/network";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

export default function TransparencyDashboard({ contractHook }) {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    load();
  }, [contractHook.contract]);

  async function load() {
    if (!contractHook.contract) { setLoading(false); return; }
    try {
      const names = await contractHook.getAllDepartmentNames();
      const deptData = await Promise.all(
        names.map(async (name) => {
          try {
            const stats = await contractHook.getDepartmentStats(name);
            const total = Number(stats.totalComplaints || stats[0]);
            
            // Explicit Corruption Score Formula Calculation in Frontend
            let calculatedScore = 0;
            if (total > 0) {
              const slaBreaches = Number(stats.slaBreaches || stats[2]);
              const falseResolutions = Number(stats.falseResolutions || stats[3]);
              const escalations = Number(stats.escalations || stats[4]);
              
              const breachRate = (slaBreaches / total) * 100;
              const falseResRate = (falseResolutions / total) * 100;
              const escRate = (escalations / total) * 100;
              const lowApprovalRate = (falseResolutions / total) * 100; // Proxy for low approval
              
              calculatedScore = (breachRate * 0.4) + (falseResRate * 0.3) + (escRate * 0.2) + (lowApprovalRate * 0.1);
            }

            return {
              name,
              score: Math.min(100, Math.round(calculatedScore)),
              stats: {
                totalComplaints: total,
                resolvedComplaints: Number(stats.resolvedComplaints || stats[1]),
                slaBreaches: Number(stats.slaBreaches || stats[2]),
                falseResolutions: Number(stats.falseResolutions || stats[3]),
                escalations: Number(stats.escalations || stats[4]),
              },
            };
          } catch {
            return { name, score: 0, stats: null };
          }
        })
      );

      // Sort by score descending (worst first)
      deptData.sort((a, b) => b.score - a.score);
      setDepartments(deptData);
    } catch (err) {
      console.error("Error loading transparency data:", err);
    } finally {
      setLoading(false);
    }
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : departments.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < departments.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="page">
      <div className="container">
        <div className="page-header animate-in">
          <h1 className="page-title">Transparency Dashboard</h1>
          <p className="page-subtitle">
            Public Corruption Score Index — calculated from SLA breaches, escalations, and citizen rejections.
          </p>
        </div>

        {/* Legend */}
        <div className="legend animate-in" style={{ display: "flex", gap: "16px", marginBottom: "32px", flexWrap: "wrap", justifyContent: "center" }}>
          {[
            { range: "0–20", label: "Excellent", color: "#00C853" },
            { range: "21–40", label: "Good", color: "#448AFF" },
            { range: "41–60", label: "Fair", color: "#FFD600" },
            { range: "61–80", label: "Poor", color: "#FF6B35" },
            { range: "81–100", label: "Critical", color: "#FF1744" },
          ].map((l) => (
            <div key={l.label} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.82rem" }}>
              <div style={{ width: "12px", height: "12px", borderRadius: "3px", background: l.color }} />
              <span style={{ color: "var(--text-secondary)" }}>{l.range} {l.label}</span>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="spinner" />
        ) : departments.length > 0 ? (
          <>
            <div className="glass-card animate-in" style={{ padding: "24px", maxWidth: "800px", margin: "0 auto 32px" }}>
              <h3 style={{ marginBottom: "16px", fontSize: "1.1rem", color: "var(--text-secondary)" }}>Department Corruption Scores</h3>
              <div style={{ height: "300px", width: "100%" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={departments} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
                    <XAxis 
                      dataKey="name" 
                      type="category" 
                      tick={{ fill: "var(--text-secondary)", fontSize: 12 }}
                      interval={0} 
                      angle={-35} 
                      textAnchor="end" 
                      height={70} 
                    />
                    <YAxis 
                      type="number" 
                      domain={[0, 100]} 
                      stroke="var(--text-muted)" 
                      tick={{ fill: "var(--text-secondary)", fontSize: 13 }} 
                    />
                    <Tooltip 
                      cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} 
                      contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }}
                      formatter={(value) => [value, "Score"]}
                    />
                    <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                      {departments.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getScoreLevel(entry.score).color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="slider-container animate-in">
              {/* Dropdown Menu */}
            <div className="dropdown-wrapper">
              <label htmlFor="dept-select">Select Department: </label>
              <select 
                id="dept-select"
                className="form-input" 
                value={currentIndex}
                onChange={(e) => setCurrentIndex(Number(e.target.value))}
                style={{ width: "100%", maxWidth: "300px", margin: "0 auto", display: "block" }}
              >
                {departments.map((dept, idx) => (
                  <option key={dept.name} value={idx}>{dept.name}</option>
                ))}
              </select>
            </div>

            {/* Carousel Controls and Active Card */}
            <div className="carousel">
              <button 
                className="btn btn-secondary carousel-btn" 
                onClick={handlePrev}
                aria-label="Previous Department"
              >
                ← Prev
              </button>
              
              <div className="carousel-card-wrapper">
                <DepartmentScoreCard
                  name={departments[currentIndex].name}
                  score={departments[currentIndex].score}
                  stats={departments[currentIndex].stats}
                />
              </div>

              <button 
                className="btn btn-secondary carousel-btn" 
                onClick={handleNext}
                aria-label="Next Department"
              >
                Next →
              </button>
            </div>
            
            <div className="carousel-indicator">
              {currentIndex + 1} of {departments.length}
            </div>
          </div>
          </>
        ) : (
          <div className="empty-state">No departments found.</div>
        )}
      </div>

      <style>{`
        .slider-container {
          max-width: 600px;
          margin: 0 auto;
          text-align: center;
        }
        .dropdown-wrapper {
          margin-bottom: 24px;
        }
        .carousel {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
        }
        .carousel-btn {
          padding: 8px 16px;
          border-radius: 50px;
          font-weight: bold;
        }
        .carousel-card-wrapper {
          flex: 1;
          display: flex;
          justify-content: center;
          max-width: 400px;
        }
        .carousel-card-wrapper > div {
          width: 100%;
        }
        .carousel-indicator {
          margin-top: 16px;
          font-size: 0.9rem;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
}
