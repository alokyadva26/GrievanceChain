import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Info, TrendingDown, TrendingUp, AlertTriangle, Building2, ChevronRight, Activity, ShieldAlert } from "lucide-react";
import DepartmentScoreCard from "../components/DepartmentScoreCard";
import { getScoreLevel } from "../constants/network";
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Cell, LineChart, Line, CartesianGrid } from "recharts";

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
            
            let calculatedScore = 0;
            if (total > 0) {
              const slaBreaches = Number(stats.slaBreaches || stats[2]);
              const falseResolutions = Number(stats.falseResolutions || stats[3]);
              const escalations = Number(stats.escalations || stats[4]);
              
              const breachRate = (slaBreaches / total) * 100;
              const falseResRate = (falseResolutions / total) * 100;
              const escRate = (escalations / total) * 100;
              const lowApprovalRate = (falseResolutions / total) * 100;
              
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

      deptData.sort((a, b) => b.score - a.score);
      setDepartments(deptData);
    } catch (err) {
      console.error("Error loading transparency data:", err);
    } finally {
      setLoading(false);
    }
  }

  // Mock Trend Data for graph since we don't have historical chain data easily queryable without events
  const trendData = [
    { name: "Week 1", score: 65 },
    { name: "Week 2", score: 72 },
    { name: "Week 3", score: 68 },
    { name: "Week 4", score: 85 },
    { name: "Week 5", score: 79 },
    { name: "Current", score: departments[currentIndex]?.score || 0 }
  ];

  return (
    <div className="page bg-slate-950 pb-24">
      <div className="container">
        <div className="mb-12">
           <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center mb-4">
              <span className="px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-semibold text-sm flex items-center gap-2">
                 <ShieldAlert size={16} /> Public Corruption Index
              </span>
           </motion.div>
           <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-extrabold text-white text-center mb-6 leading-tight">
             Transparency Dashboard
           </motion.h1>
           <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-slate-400 text-lg text-center max-w-2xl mx-auto flex items-center justify-center gap-2 group">
             Holding departments accountable through immutable records.
             <span className="relative cursor-help" title="Score based on SLA breaches, false resolutions, and escalations. Higher is worse.">
                <Info size={18} className="text-slate-500 hover:text-orange-500 transition-colors" />
             </span>
           </motion.p>
        </div>

        {/* Legend */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex flex-wrap justify-center gap-4 lg:gap-8 mb-12">
          {[
            { range: "0–20", label: "Excellent", color: "#22c55e" },
            { range: "21–40", label: "Good", color: "#3b82f6" },
            { range: "41–60", label: "Fair", color: "#eab308" },
            { range: "61–80", label: "Poor", color: "#f97316" },
            { range: "81–100", label: "Critical", color: "#ef4444" },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide">
              <div className="w-3 h-3 rounded-sm shadow-sm" style={{ background: l.color }} />
              <span className="text-slate-400">{l.range} <span className="text-slate-300 ml-1">{l.label}</span></span>
            </div>
          ))}
        </motion.div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-12 h-12 border-4 border-slate-700 border-t-orange-500 rounded-full animate-spin mb-4"></div>
            <p className="text-slate-400 font-medium tracking-widest uppercase text-sm animate-pulse">Calculating Scores...</p>
          </div>
        ) : departments.length > 0 ? (
          <>
            {/* Quick Insights Row - Best vs Worst */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
               <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="glass-card p-6 bg-red-500/5 border-red-500/20 flex flex-col md:flex-row items-center gap-6">
                  <div className="w-16 h-16 shrink-0 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
                     <TrendingUp size={32} />
                  </div>
                  <div className="text-center md:text-left">
                     <p className="text-red-400 text-sm font-bold uppercase tracking-wider mb-1">Most Corrupt / Delayed</p>
                     <h3 className="text-2xl font-bold text-white mb-1">{departments[0].name}</h3>
                     <p className="text-slate-400 text-sm">Score: <span className="text-red-500 font-mono font-bold font-xl">{departments[0].score}/100</span></p>
                  </div>
               </motion.div>
               <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="glass-card p-6 bg-green-500/5 border-green-500/20 flex flex-col md:flex-row items-center gap-6">
                  <div className="w-16 h-16 shrink-0 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-500">
                     <TrendingDown size={32} />
                  </div>
                  <div className="text-center md:text-left">
                     <p className="text-green-400 text-sm font-bold uppercase tracking-wider mb-1">Best Performing</p>
                     <h3 className="text-2xl font-bold text-white mb-1">{departments[departments.length - 1].name}</h3>
                     <p className="text-slate-400 text-sm">Score: <span className="text-green-500 font-mono font-bold font-xl">{departments[departments.length - 1].score}/100</span></p>
                  </div>
               </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
               {/* Left Column: Chart */}
               <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="lg:col-span-8 glass-card p-6 lg:p-8 flex flex-col h-full">
                 <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2"><Activity className="text-blue-500"/> Corruption Scores Overview</h3>
                 </div>
                 
                 <div className="h-[350px] w-full mt-auto">
                   <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={departments} margin={{ top: 10, right: 10, left: -20, bottom: 40 }}>
                       <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                       <XAxis 
                         dataKey="name" 
                         tick={{ fill: "#94a3b8", fontSize: 12 }}
                         interval={0} 
                         angle={-35} 
                         textAnchor="end" 
                         height={60} 
                         axisLine={{stroke: "rgba(255,255,255,0.1)"}}
                         tickLine={false}
                       />
                       <YAxis 
                         domain={[0, 100]} 
                         tick={{ fill: "#94a3b8", fontSize: 12 }} 
                         axisLine={false}
                         tickLine={false}
                       />
                       <RechartsTooltip 
                         cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} 
                         contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', color: '#f8fafc', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)' }}
                         itemStyle={{ fontWeight: 'bold' }}
                         formatter={(value) => [`${value} / 100`, "Corruption Score"]}
                       />
                       <Bar dataKey="score" radius={[6, 6, 0, 0]} onClick={(_, idx) => setCurrentIndex(idx)} className="cursor-pointer">
                         {departments.map((entry, index) => (
                           <Cell 
                              key={`cell-${index}`} 
                              fill={getScoreLevel(entry.score).color} 
                              opacity={currentIndex === index ? 1 : 0.7}
                           />
                         ))}
                       </Bar>
                     </BarChart>
                   </ResponsiveContainer>
                 </div>
               </motion.div>

               {/* Right Column: Active Department Detail & Trend */}
               <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="lg:col-span-4 flex flex-col gap-6">
                 
                 {/* Selection Dropdown */}
                 <div className="glass-card p-4 relative z-20">
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Deep Dive</label>
                    <div className="relative">
                       <select 
                         className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500 font-bold"
                         value={currentIndex}
                         onChange={(e) => setCurrentIndex(Number(e.target.value))}
                       >
                         {departments.map((dept, idx) => (
                           <option key={dept.name} value={idx}>{dept.name} ({dept.score})</option>
                         ))}
                       </select>
                       <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                          <ChevronRight className="rotate-90 text-slate-500" size={18} />
                       </div>
                    </div>
                 </div>

                 {/* Focus Card */}
                 <div className="flex-1">
                    <DepartmentScoreCard
                      name={departments[currentIndex].name}
                      score={departments[currentIndex].score}
                      stats={departments[currentIndex].stats}
                    />
                 </div>

                 {/* Trend Mock Graph */}
                 <div className="glass-card p-5">
                    <h4 className="text-sm font-bold text-white mb-4">Historical Trend</h4>
                    <div className="h-[120px] w-full">
                       <ResponsiveContainer width="100%" height="100%">
                         <LineChart data={trendData}>
                            <XAxis dataKey="name" hide />
                            <YAxis domain={['dataMin - 10', 'auto']} hide />
                            <RechartsTooltip 
                               contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                               labelStyle={{ color: '#94a3b8', fontSize: '12px' }}
                               itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                            />
                            <Line 
                               type="monotone" 
                               dataKey="score" 
                               stroke={getScoreLevel(departments[currentIndex].score).color} 
                               strokeWidth={3}
                               dot={{ r: 4, fill: '#0f172a', strokeWidth: 2 }}
                               activeDot={{ r: 6 }}
                            />
                         </LineChart>
                       </ResponsiveContainer>
                    </div>
                 </div>

               </motion.div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center p-16 text-center border border-slate-800 border-dashed rounded-3xl bg-slate-900/20">
             <Building2 size={48} className="text-slate-600 mb-4" />
             <h3 className="text-2xl font-bold text-white mb-2">No department data available</h3>
             <p className="text-slate-400">Scores will generate automatically once citizens start filing grievances.</p>
          </div>
        )}
      </div>
    </div>
  );
}
