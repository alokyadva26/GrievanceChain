import React, { useEffect, useState } from "react";
import DepartmentScoreCard from "../components/DepartmentScoreCard";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { getScoreLevel } from "../constants/network";

export default function TransparencyDashboard({ contractHook }) {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

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
            return {
              name,
              score: Number(stats.score || stats[5]),
              stats: {
                totalComplaints: Number(stats.totalComplaints || stats[0]),
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

  const chartData = departments.map((d) => ({
    name: d.name.length > 10 ? d.name.slice(0, 10) + "..." : d.name,
    score: d.score,
    fill: getScoreLevel(d.score).color,
  }));

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
        <div className="legend animate-in" style={{ display: "flex", gap: "16px", marginBottom: "32px", flexWrap: "wrap" }}>
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
        ) : (
          <>
            {/* Bar Chart */}
            {chartData.length > 0 && (
              <div className="glass-card animate-in" style={{ padding: "24px", marginBottom: "32px" }}>
                <h3 style={{ marginBottom: "20px" }}>Department Corruption Scores</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                    <XAxis dataKey="name" tick={{ fill: "#90a4ae", fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 100]} tick={{ fill: "#90a4ae", fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        background: "#111c32",
                        border: "1px solid rgba(255,255,255,0.06)",
                        borderRadius: "8px",
                        color: "#e8eaf6",
                      }}
                    />
                    <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                      {chartData.map((entry, i) => (
                        <Cell key={i} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Score Cards */}
            <div className="grid grid-3">
              {departments.map((dept) => (
                <DepartmentScoreCard
                  key={dept.name}
                  name={dept.name}
                  score={dept.score}
                  stats={dept.stats}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
