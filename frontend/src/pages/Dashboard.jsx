import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BarChart as BarChartIcon, LineChart as LineChartIcon, PieChart, Sparkles, Filter, AlertCircle, TrendingUp } from "lucide-react";
import ComplaintCard from "../components/ComplaintCard";
import toast from "react-hot-toast";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function Dashboard({ contractHook, account }) {
  const [complaints, setComplaints] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({ breachPercent: 0, highestDelayDept: "" });

  useEffect(() => {
    async function load() {
      if (!contractHook.contract) { setLoading(false); return; }
      try {
        const all = await contractHook.getAllComplaints();
        const reversed = [...all].reverse();
        setComplaints(reversed);
        
        // Calculate basic analytics
        if(reversed.length > 0) {
           const breached = reversed.filter(c => c.escalated || c.status === 3).length; // simple approximation
           setAnalytics({
              breachPercent: Math.round((breached / reversed.length) * 100),
              highestDelayDept: "Transport" // Mmock AI insight
           });
        }
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
      const tx = await contractHook.contract.runner.sendTransaction({
        to: contractHook.contract.target,
        data: "0xdeadbeef", 
      });
      await tx.wait();
    } catch (error) {
      toast.error(
        <div className="flex flex-col gap-1">
           <span className="font-bold text-base flex items-center gap-2"><AlertCircle size={18}/> Deletion Rejected</span>
           <span className="text-sm">Blockchain record is immutable. Smart Contract reverted the transaction.</span>
        </div>, 
        {
          style: { background: "#1f0f0f", color: "#ef4444", border: "1px solid #7f1d1d" },
          duration: 5000
        }
      );
    }
  };

  const filtered = filter === "all"
    ? complaints
    : complaints.filter((c) => Number(c.status) === Number(filter));

  const statusFilters = [
    { value: "all", label: "All Cases" },
    { value: "0", label: "Newly Filed" },
    { value: "2", label: "Action Taken" },
    { value: "3", label: "Escalated" },
    { value: "4", label: "Resolved" },
    { value: "5", label: "Rejected" },
  ];

  // Mock data for Line Chart
  const lineData = [
    { name: "Mon", complaints: 12 },
    { name: "Tue", complaints: 19 },
    { name: "Wed", complaints: 15 },
    { name: "Thu", complaints: 25 },
    { name: "Fri", complaints: 22 },
    { name: "Sat", complaints: 30 },
    { name: "Sun", complaints: Math.max(10, complaints.length) },
  ];

  return (
    <div className="page bg-slate-950 pb-24">
      <div className="container max-w-7xl mx-auto">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
           <div>
              <h1 className="text-4xl font-extrabold text-white mb-2">Admin Command Center</h1>
              <p className="text-slate-400">Deep analytics and management hub for all public grievances.</p>
           </div>
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
           
           {/* Chart */}
           <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="lg:col-span-2 glass-card p-6 bg-gradient-to-br from-slate-900 to-slate-800">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                 <LineChartIcon className="text-blue-500" /> Complaints Volume Over Time
              </h3>
              <div className="h-[220px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={lineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                     <defs>
                        <linearGradient id="colorComplaints" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                           <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                     <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
                     <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
                     <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                        itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                     />
                     <Area type="monotone" dataKey="complaints" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorComplaints)" />
                   </AreaChart>
                 </ResponsiveContainer>
              </div>
           </motion.div>

           {/* Metrics & Insights */}
           <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="flex flex-col gap-6">
              
              <div className="glass-card p-6 border-l-4 border-l-red-500 flex items-center justify-between">
                 <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Global SLA Breach</p>
                    <p className="text-3xl font-extrabold text-white">{analytics.breachPercent}%</p>
                 </div>
                 <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                    <PieChart size={24} />
                 </div>
              </div>

              <div className="glass-card p-6 border-indigo-500/30 flex-1 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-colors pointer-events-none" />
                 <h4 className="text-sm font-bold flex items-center gap-2 text-indigo-400 mb-4">
                    <Sparkles size={16} /> Gemini AI Insights
                 </h4>
                 <div className="space-y-4 relative z-10">
                    <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-lg text-sm text-slate-300 shadow-lg">
                       "Transport department is causing <span className="text-red-400 font-bold">85%</span> of recent SLA delays."
                    </div>
                    <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-lg text-sm text-slate-300 shadow-lg flex justify-between items-center gap-2">
                       <span>"Water pipeline issues surged by <span className="text-orange-400 font-bold">40%</span> this week in Central District."</span>
                       <TrendingUp className="text-orange-400 shrink-0" size={16} />
                    </div>
                 </div>
              </div>

           </motion.div>
        </div>

        {/* Complaints List Section */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
           
           <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 border-b border-slate-800/50 pb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2"><BarChartIcon size={20} className="text-slate-400"/> Case Log</h3>
              
              {/* Filters */}
              <div className="flex gap-2 p-1 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto w-full sm:w-auto">
                <div className="flex items-center px-3 text-slate-500"><Filter size={16}/></div>
                {statusFilters.map((f) => (
                  <button
                    key={f.value}
                    className={`whitespace-nowrap px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                       filter === f.value ? "bg-slate-700 text-white shadow" : "text-slate-400 hover:text-slate-300 hover:bg-slate-800"
                    }`}
                    onClick={() => setFilter(f.value)}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
           </div>

           {loading ? (
             <div className="flex flex-col items-center justify-center py-20">
               <div className="w-8 h-8 border-2 border-slate-700 border-t-blue-500 rounded-full animate-spin mb-4"></div>
             </div>
           ) : filtered.length === 0 ? (
             <div className="glass-card p-12 text-center border-dashed border-slate-800 bg-slate-900/20">
               <AlertCircle size={40} className="text-slate-600 mx-auto mb-4" />
               <p className="text-slate-400 font-medium">No records found matching the current filter.</p>
             </div>
           ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {filtered.map((c) => (
                 <ComplaintCard 
                   key={Number(c.id)} 
                   complaint={c} 
                   isAdminView={true} 
                   showTimeline={false}
                   onDelete={() => simulateDelete(Number(c.id))} 
                 />
               ))}
             </div>
           )}

        </motion.div>
      </div>
    </div>
  );
}
