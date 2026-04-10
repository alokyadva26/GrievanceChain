import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FileSearch, Sparkles, Filter, ChevronDown, ListFilter, Wallet } from "lucide-react";
import ComplaintCard from "../components/ComplaintCard";

export default function MyComplaints({ contractHook, account }) {
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    async function load() {
      if (!contractHook.contract || !account) {
        setLoading(false);
        return;
      }
      try {
        const data = await contractHook.getComplaintsByCitizen(account);
        const sorted = [...data].reverse();
        setComplaints(sorted);
        setFilteredComplaints(sorted);
      } catch (err) {
        console.error("Error loading complaints:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [contractHook.contract, account]);

  useEffect(() => {
    if (activeTab === "all") {
      setFilteredComplaints(complaints);
    } else if (activeTab === "active") {
      setFilteredComplaints(complaints.filter(c => Number(c.status) < 4));
    } else if (activeTab === "resolved") {
      setFilteredComplaints(complaints.filter(c => Number(c.status) === 4));
    } else if (activeTab === "critical") {
      // Mock logic: Escalated or older cases
      setFilteredComplaints(complaints.filter(c => c.escalated));
    }
  }, [activeTab, complaints]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="page bg-slate-950 min-h-[calc(100vh-80px)] pt-12 pb-24">
      <div className="container">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6 bg-slate-900/40 p-8 rounded-3xl border border-slate-800">
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-semibold text-xs mb-4">
              <Wallet size={14} /> Connected: {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'None'}
            </div>
            <h1 className="text-4xl font-extrabold text-white mb-3 tracking-tight">My Complaints</h1>
            <p className="text-slate-400 text-lg">
              Track the progress, SLAs, and resolution states of all grievances you've filed.
            </p>
          </motion.div>
          
          {account && complaints.length > 0 && (
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex gap-2 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700">
              {['all', 'active', 'resolved', 'critical'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${
                    activeTab === tab 
                      ? 'bg-slate-700 text-white shadow-md' 
                      : 'text-slate-400 hover:text-slate-300 hover:bg-slate-700/50'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </motion.div>
          )}
        </div>

        {!account ? (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex flex-col items-center justify-center p-16 text-center border border-slate-800 border-dashed rounded-3xl bg-slate-900/20">
             <div className="w-20 h-20 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-500 mb-6">
                <Wallet size={40} />
             </div>
             <h3 className="text-2xl font-bold text-white mb-2">Wallet Disconnected</h3>
             <p className="text-slate-400 mb-8 max-w-md">You need to connect your MetaMask wallet to view your personal grievance history on the blockchain.</p>
          </motion.div>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-12 h-12 border-4 border-slate-700 border-t-orange-500 rounded-full animate-spin mb-4"></div>
            <p className="text-slate-400 font-medium tracking-widest uppercase text-sm animate-pulse">Loading Blockchain Records...</p>
          </div>
        ) : complaints.length === 0 ? (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex flex-col items-center justify-center p-16 text-center border border-slate-800 border-dashed rounded-3xl bg-slate-900/20">
             <div className="w-24 h-24 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 mb-6">
                <FileSearch size={48} />
             </div>
             <h3 className="text-2xl font-bold text-white mb-2">No complaints filed yet</h3>
             <p className="text-slate-400 mb-8 max-w-md">Your dashboard is empty. When you face issues with government departments, file them here to make them immutable and trackable.</p>
             <Link to="/file" className="btn btn-primary px-8 py-3 rounded-xl shadow-[0_0_20px_rgba(255,107,53,0.3)] hover:shadow-[0_0_30px_rgba(255,107,53,0.5)]">
               File Your First Complaint
             </Link>
          </motion.div>
        ) : (
          <>
            {filteredComplaints.length === 0 ? (
              <div className="text-center py-20 text-slate-400">
                No complaints found for the "{activeTab}" filter.
              </div>
            ) : (
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
              >
                {filteredComplaints.map((c) => (
                  <motion.div key={Number(c.id)} variants={{
                    hidden: { y: 20, opacity: 0 },
                    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
                  }}>
                    <ComplaintCard complaint={c} showTimeline={true} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
