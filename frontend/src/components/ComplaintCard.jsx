import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, AlertTriangle, Building2, User, ChevronRight, Hash, ShieldAlert } from "lucide-react";
import { shortenAddress, formatTimestamp, getStatusLabel, getSLARemaining } from "../utils/formatters";
import { COMPLAINT_STATUS_COLORS } from "../constants/network";

export default function ComplaintCard({ complaint, isAdminView, onDelete, showTimeline }) {
  const statusNum = Number(complaint.status);
  const sla = getSLARemaining(complaint.responseDeadline);
  
  // Calculate priority based on SLA
  const isCritical = sla.isOverdue || complaint.escalated;
  const isMedium = !isCritical && sla.text.includes("hours");
  
  const priorityColor = isCritical ? "bg-red-500/10 text-red-500 border-red-500/20" : 
                        isMedium ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" : 
                        "bg-green-500/10 text-green-500 border-green-500/20";
  const priorityText = isCritical ? "Critical" : isMedium ? "High" : "Normal";

  return (
    <motion.div 
      whileHover={{ y: -5, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className={`glass-card p-6 relative overflow-hidden flex flex-col group border ${isCritical ? 'border-red-500/30 shadow-[0_0_15px_rgba(255,0,0,0.1)]' : 'border-slate-800'}`}
    >
      {/* Background glow if escalated */}
      {isCritical && <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />}

      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-2 items-center">
          <span className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-md border ${COMPLAINT_STATUS_COLORS[statusNum] || 'bg-slate-800 text-slate-300 border-slate-700'}`}>
            {getStatusLabel(statusNum)}
          </span>
          <span className={`px-2 py-1 text-xs font-bold uppercase tracking-wider rounded-md border ${priorityColor}`}>
            {priorityText}
          </span>
        </div>
        <span className="flex items-center text-slate-500 font-mono text-sm bg-slate-900 px-2 py-1 rounded-md border border-slate-800">
          <Hash size={14} className="opacity-50" />{Number(complaint.id)}
        </span>
      </div>

      <h4 className="text-xl font-bold text-white mb-2 leading-tight group-hover:text-orange-400 transition-colors line-clamp-1">
        {complaint.title}
      </h4>
      
      <p className="text-slate-400 text-sm mb-6 line-clamp-2 min-h-[40px] leading-relaxed">
        {complaint.description}
      </p>

      <div className="grid grid-cols-2 gap-4 mb-6 p-4 rounded-xl bg-slate-900/50 border border-slate-800">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] text-slate-500 uppercase tracking-widest flex items-center gap-1"><Building2 size={12}/> Department</span>
          <span className="text-sm text-slate-200 font-medium truncate" title={complaint.department}>
            {complaint.department}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] text-slate-500 uppercase tracking-widest flex items-center gap-1"><Clock size={12}/> Filed On</span>
          <span className="text-sm text-slate-200 font-medium">
            {formatTimestamp(complaint.createdAt).split(' ')[0]}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] text-slate-500 uppercase tracking-widest flex items-center gap-1"><AlertTriangle size={12}/> SLA Status</span>
          <span className={`text-sm font-bold ${sla.isOverdue ? "text-red-500" : isMedium ? "text-yellow-500" : "text-green-500"}`}>
            {sla.text}
          </span>
        </div>
        {!complaint.isAnonymous && (
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest flex items-center gap-1"><User size={12}/> Citizen</span>
            <span className="text-sm text-slate-200 font-mono">
              {shortenAddress(complaint.citizen)}
            </span>
          </div>
        )}
      </div>

      {/* Mini Timeline for "My Complaints" view */}
      {showTimeline && (
         <div className="mb-6 pt-2">
            <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider relative">
               <div className="absolute top-2.5 left-0 w-full h-0.5 bg-slate-800 -z-10 rounded-full">
                  <div className="h-full bg-orange-500" style={{ width: statusNum === 0 ? '0%' : statusNum === 1 ? '33%' : statusNum === 2 ? '66%' : '100%' }}></div>
               </div>
               
               {['Filed', 'Viewed', 'Responded', 'Resolved'].map((step, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-1.5 focus:outline-none">
                     <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${statusNum >= idx ? (idx === 3 && statusNum === 4 ? 'bg-green-500 border-green-500 text-white' : 'bg-orange-500 border-orange-500 text-white') : 'bg-slate-900 border-slate-700 text-slate-500'}`}>
                        {statusNum >= idx ? '✓' : ''}
                     </div>
                     <span className={statusNum >= idx ? 'text-slate-300' : 'text-slate-600'}>{step}</span>
                  </div>
               ))}
            </div>
         </div>
      )}

      {complaint.escalated && (
        <div className="mb-4 px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg text-xs font-bold text-red-500 flex items-center gap-2">
          <ShieldAlert size={16} /> Escalated (Level {Number(complaint.escalationLevel)})
        </div>
      )}

      <div className="mt-auto pt-2 border-t border-slate-800/50 flex flex-col gap-2">
        <Link to={`/complaint/${Number(complaint.id)}`} className="w-full btn bg-slate-800 hover:bg-slate-700 text-white flex justify-center items-center gap-2 transition-colors border border-slate-700">
          View Full Details <ChevronRight size={16} />
        </Link>
        
        {isAdminView && (
          <button onClick={onDelete} className="w-full btn bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 flex justify-center items-center gap-2 transition-colors mt-2">
            🗑️ Delete Record (Simulate)
          </button>
        )}
      </div>
    </motion.div>
  );
}
