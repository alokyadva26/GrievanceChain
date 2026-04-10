import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, FileText, Timer, UserCheck, Search, Activity, ChevronRight, FileBadge } from "lucide-react";
import ComplaintCard from "../components/ComplaintCard";
import CountUp from "../components/CountUp";

export default function Home({ contract }) {
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [stats, setStats] = useState({ total: 0, resolved: 0, departments: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!contract) { setLoading(false); return; }
      try {
        const all = await contract.getAllComplaints();
        const complaints = [...all].reverse().slice(0, 3);
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <div className="home-page overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24">
        <div className="container relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-semibold text-sm mb-6 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
              <ShieldCheck size={16} /> Powered by Base Sepolia
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold mb-6 leading-tight tracking-tight text-white drop-shadow-lg">
              Tamper-Proof <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] to-[#FFD600]">
                Public Grievance
              </span> <br />
              Redressal
            </h1>
            <p className="text-lg lg:text-xl text-slate-300 mb-8 max-w-2xl leading-relaxed">
              Your complaint is permanently stored on the blockchain — no deletion, no manipulation. Hold departments accountable with transparent, automated SLA tracking.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/file">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-primary btn-lg flex items-center gap-2 group"
                >
                  File Complaint in 30s <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
              <Link to="/transparency">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-secondary btn-lg flex items-center gap-2 bg-slate-800/50 hover:bg-slate-800 border-slate-700"
                >
                  <Search size={20} /> View Transparency
                </motion.button>
              </Link>
            </div>
            
            <div className="mt-8 flex items-center gap-4 text-sm text-slate-400 font-medium">
              <span className="flex items-center gap-1.5"><Activity size={16} className="text-green-400" /> Live on Testnet</span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
              <span className="flex items-center gap-1.5"><FileBadge size={16} className="text-blue-400" /> Immutable Records</span>
            </div>
          </motion.div>
        </div>

        {/* Ambient Glows */}
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-orange-500/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[20%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      </section>

      {/* Stats Section */}
      <section className="container mb-20 relative z-10">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <motion.div variants={itemVariants} className="glass-card p-6 flex items-center gap-5 hover:!border-orange-500/50 group transition-colors">
            <div className="w-14 h-14 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
              <FileText size={28} />
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">
                {loading ? "..." : <CountUp end={stats.total} />}
              </div>
              <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Total Filed</div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="glass-card p-6 flex items-center gap-5 hover:!border-green-500/50 group transition-colors">
            <div className="w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 group-hover:scale-110 transition-transform">
              <ShieldCheck size={28} />
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">
                {loading ? "..." : <CountUp end={stats.resolved} />}
              </div>
              <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Resolved successfully</div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="glass-card p-6 flex items-center gap-5 hover:!border-blue-500/50 group transition-colors">
            <div className="w-14 h-14 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
              <Activity size={28} />
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">
                {loading ? "..." : <CountUp end={stats.departments} />}
              </div>
              <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Departments</div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="glass-card p-6 flex items-center gap-5 hover:!border-purple-500/50 group transition-colors">
            <div className="w-14 h-14 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform">
              <Timer size={28} />
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">
                <CountUp end={7} suffix="d" />
              </div>
              <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Avg Resolution</div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* How It Works - Step Flow */}
      <section className="container mb-20 relative z-10">
        <div className="py-20 bg-slate-900/30 rounded-3xl border border-slate-800 backdrop-blur-sm">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">A seamless, trustless verification system that ensures your voice is heard and action is taken.</p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative px-4 lg:px-12"
          >
            {/* Connector Line for Desktop */}
            <div className="hidden lg:block absolute top-[40px] left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-transparent via-slate-700 to-transparent z-0"></div>

            {[
              { icon: <Search size={32} />, title: "Connect Wallet", desc: "Link MetaMask to access the decentralized dashboard safely.", tooltip: "Secure connection via Web3 providers without centralized signup." },
              { icon: <FileText size={32} />, title: "File Complaint", desc: "Submit your problem. Evidence is permanently secured on IPFS.", tooltip: "InterPlanetary File System ensures files can't be deleted." },
              { icon: <Timer size={32} />, title: "Auto Escalation", desc: "A strict 7-day SLA applies. If missed, it auto-escalates.", tooltip: "Smart contract executes escalation if resolution is not met." },
              { icon: <UserCheck size={32} />, title: "Citizen Approval", desc: "Only the filer can sign off and mark the issue as fully resolved.", tooltip: "No department can falsely close a case." },
            ].map((step, i) => (
              <motion.div 
                key={i} 
                variants={itemVariants}
                whileHover={{ y: -10 }}
                className="relative z-10 flex flex-col items-center text-center group"
              >
                <div className="w-20 h-20 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-slate-300 group-hover:border-orange-500 group-hover:text-orange-500 group-hover:shadow-[0_0_20px_rgba(255,107,53,0.3)] transition-all duration-300 mb-6 bg-slate-900 relative">
                  <span className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-sm border-4 border-[#060b18]">
                    {i + 1}
                  </span>
                  {step.icon}
                </div>
                <h4 className="text-xl font-bold text-white mb-2">{step.title}</h4>
                <p className="text-slate-400 text-sm leading-relaxed mb-3">
                  {step.desc}
                </p>
                {/* Tooltip hint instead of actual complex tooltip logic for simplicity */}
                <span className="text-xs text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  💡 {step.tooltip}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Recent Complaints */}
      {recentComplaints.length > 0 ? (
        <section className="container pb-24">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Live Grievances</h2>
              <p className="text-slate-400">Track recently filed issues in real-time across the network.</p>
            </div>
            <Link to="/transparency" className="text-orange-500 hover:text-orange-400 font-semibold flex items-center text-sm gap-1 hover:gap-2 transition-all">
              View All <ChevronRight size={16} />
            </Link>
          </div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {recentComplaints.map((c, i) => (
              <motion.div key={Number(c.id)} variants={itemVariants}>
                <ComplaintCard complaint={c} />
              </motion.div>
            ))}
          </motion.div>
        </section>
      ) : (
        <section className="container pb-24">
           {loading ? (
             <div className="flex flex-col items-center justify-center py-20">
               <div className="spinner mb-4"></div>
               <p className="text-slate-400">Syncing with blockchain...</p>
             </div>
           ) : (
             <div className="flex flex-col items-center justify-center py-20 text-center bg-slate-800/20 rounded-2xl border border-slate-800 border-dashed">
                <Search size={48} className="text-slate-600 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No complaints yet</h3>
                <p className="text-slate-400 mb-6">Be the first to file a grievance and test the system.</p>
                <Link to="/file" className="btn btn-primary">File First Complaint 🚀</Link>
             </div>
           )}
        </section>
      )}
    </div>
  );
}
