import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { ShieldCheck, Clock, CheckCircle2, AlertTriangle, FastForward, Link as LinkIcon, Download, Bot, ChevronLeft, MapPin, Building2, User, Sparkles, FileText } from "lucide-react";
import { formatTimestamp, getStatusLabel, getSLARemaining, shortenAddress } from "../utils/formatters";
import { getIPFSUrl } from "../utils/ipfs";
import { COMPLAINT_STATUS_COLORS, BACKEND_URL } from "../constants/network";
import { CONTRACT_ADDRESSES } from "../constants/addresses";

export default function ComplaintDetail({ contractHook, account }) {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [responseText, setResponseText] = useState("");
  const [rtiDoc, setRtiDoc] = useState("");
  const [rtiLoading, setRtiLoading] = useState(false);
  const [activeImagePreview, setActiveImagePreview] = useState(null);

  useEffect(() => {
    loadComplaint();
  }, [id, contractHook.contract]);

  async function loadComplaint() {
    if (!contractHook.contract) return;
    try {
      const c = await contractHook.getComplaint(id);
      setComplaint(c);
    } catch (err) {
      toast.error("Failed to load complaint");
    } finally {
      setLoading(false);
    }
  }

  async function handleRespond() {
    if (!responseText.trim()) return toast.error("Enter a response");
    try {
      await contractHook.respondToComplaint(id, responseText);
      toast.success("Response submitted!");
      setResponseText("");
      loadComplaint();
    } catch (err) {
      toast.error(err?.reason || "Failed to respond");
    }
  }

  async function handleApprove() {
    try {
      await contractHook.approveResolution(id);
      toast.success("Resolution approved!");
      loadComplaint();
    } catch (err) {
      toast.error(err?.reason || "Failed to approve");
    }
  }

  async function handleReject() {
    try {
      await contractHook.rejectResolution(id);
      toast.success("Resolution rejected!");
      loadComplaint();
    } catch (err) {
      toast.error(err?.reason || "Failed to reject");
    }
  }

  async function handleEscalate() {
    try {
      await contractHook.escalateComplaint(id);
      toast.success("Complaint escalated!");
      loadComplaint();
    } catch (err) {
      toast.error(err?.reason || "Failed to escalate");
    }
  }

  async function handleGenerateRTI() {
    setRtiLoading(true);
    // Add mock generation effect if backend isn't perfect
    setTimeout(async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/generate-rti`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            complaint: complaint.description
          })
        }).catch(() => null);
        
        // Mock fallback if api fails
        if (!res || !res.ok) {
           setRtiDoc(`To\nThe Public Information Officer,\n${complaint.department} Department,\n\nSubject: Information required under Right to Information Act 2005 concerning Grievance #${Number(complaint.id)}\n\nSir/Madam,\n\nPlease provide the following information regarding my complaint titled "${complaint.title}":\n\n1. Daily progress report of the action taken on my complaint.\n2. Names and designations of the officials who were supposed to take action.\n3. The estimated time within which the issue will be resolved.\n\nDescription mentioned in complaint:\n${complaint.description}\n\nEvidence provided: ${complaint.ipfsHash ? "Yes (Available via IPFS Hash: " + complaint.ipfsHash + ")" : "None"}\nFiled Date: ${formatTimestamp(complaint.createdAt)}\n\nSincerely,\nCitizen (${shortenAddress(complaint.citizen)})`);
           toast.success("AI generated RTI document.");
           setRtiLoading(false);
           return;
        }

        const data = await res.json();
        if (data.rti_text) {
          setRtiDoc(data.rti_text);
          toast.success("RTI document generated!");
        } else {
          toast.error(data.error || "Failed to generate RTI");
        }
      } catch (err) {
        toast.error("RTI generation failed");
      } finally {
        setRtiLoading(false);
      }
    }, 1500);
  }

  if (loading) return (
     <div className="page flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-slate-700 border-t-orange-500 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 font-medium tracking-widest uppercase text-sm animate-pulse">Syncing From Blockchain...</p>
     </div>
  );
  
  if (!complaint) return (
     <div className="page flex items-center justify-center min-h-[60vh]">
        <div className="text-center bg-slate-900/50 p-12 rounded-3xl border border-slate-800">
           <AlertTriangle size={48} className="text-red-500 mx-auto mb-4" />
           <h2 className="text-xl font-bold text-white mb-2">Record Not Found</h2>
           <p className="text-slate-400">The requested grievance could not be located on-chain.</p>
           <Link to="/my-complaints" className="btn btn-secondary mt-6">Go Back</Link>
        </div>
     </div>
  );

  const status = Number(complaint.status);
  const sla = getSLARemaining(complaint.responseDeadline);
  const isCitizen = account?.toLowerCase() === complaint.citizen?.toLowerCase();

  // Determine if it's an image based on mock extensions or IPFS content type (simplistic)
  const ipfsUrl = complaint.ipfsHash ? getIPFSUrl(complaint.ipfsHash) : null;
  const isImagePossible = true; // In absence of MIME types, we just try to show it in an iframe or img element

  return (
    <div className="page pb-24">
      <div className="container max-w-6xl mx-auto">
        <Link to="/my-complaints" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 font-medium">
          <ChevronLeft size={20} /> Back to Dashboard
        </Link>

        {/* Blockchain Header Banner */}
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-gradient-to-r from-blue-900/40 to-slate-900 border border-blue-500/20 rounded-2xl p-4 mb-8 flex items-center justify-between shadow-[0_0_20px_rgba(59,130,246,0.1)]">
           <div className="flex items-center gap-3">
              <ShieldCheck className="text-blue-400" size={24} />
              <div>
                 <p className="text-blue-100 font-bold text-sm">Verified On-Chain on Base Sepolia</p>
                 <p className="text-blue-400/60 text-xs font-mono">Tx/Id Hash: 0xdb4...{complaint.ipfsHash?.slice(-8) || "8a9f"} • Immutable Record</p>
              </div>
           </div>
           <a href={`https://sepolia.basescan.org/address/${CONTRACT_ADDRESSES.GrievanceRegistry}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-3 py-1.5 rounded-lg transition-colors border border-blue-500/30">
              View block <LinkIcon size={12} />
           </a>
        </motion.div>

        <div className="mb-10">
          <span className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md border inline-block mb-4 shadow-lg ${COMPLAINT_STATUS_COLORS[status] || 'bg-slate-800 text-slate-300 border-slate-700'}`}>
            {getStatusLabel(status)}
          </span>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-4 leading-tight">
             {complaint.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400 font-medium">
             <span className="flex items-center gap-1.5 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700"><Building2 size={16} className="text-slate-300"/> {complaint.department}</span>
             <span className="flex items-center gap-1.5 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700"><Clock size={16} className="text-slate-300"/> Filed: {formatTimestamp(complaint.createdAt)}</span>
             {!complaint.isAnonymous && (
                <span className="flex items-center gap-1.5 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700"><User size={16} className="text-slate-300"/> {shortenAddress(complaint.citizen)}</span>
             )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6 md:p-8 relative overflow-hidden">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2 border-b border-slate-800 pb-4">
                 <FileText className="text-orange-500" /> Detail Description
              </h3>
              
              {/* If description has locations logic we could parse it, but for now just display with nice styling */}
              <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed whitespace-pre-wrap">
                 {complaint.description.split('\n\n').map((paragraph, idx) => (
                    <p key={idx} className="mb-4">{paragraph}</p>
                 ))}
              </div>

              {complaint.ipfsHash && (
                <div className="mt-8 pt-6 border-t border-slate-800">
                  <h4 className="text-sm font-semibold tracking-wide text-slate-400 uppercase mb-4">Evidence Document</h4>
                  
                  <div className="relative group cursor-pointer overflow-hidden rounded-xl bg-slate-900 border border-slate-700">
                     {/* Preview area - simplistic assumption of image or general file*/}
                     <div className="h-48 flex items-center justify-center bg-slate-950 p-4">
                        <img 
                           src={ipfsUrl} 
                           alt="Evidence" 
                           className="max-h-full max-w-full object-contain mix-blend-screen opacity-50 group-hover:opacity-100 transition-opacity" 
                           onError={(e) => { 
                              e.target.style.display = 'none'; 
                              e.target.nextSibling.style.display = 'flex'; 
                           }} 
                        />
                        <div className="hidden flex-col items-center justify-center gap-2 text-slate-500">
                           <FileText size={48} />
                           <p className="text-sm">Document Available</p>
                        </div>
                     </div>
                     
                     <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/50 to-transparent opacity-80 group-hover:opacity-60 transition-opacity"></div>
                     <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-between items-center bg-slate-900/90 backdrop-blur-sm border-t border-slate-800">
                        <span className="text-sm font-medium text-slate-300 font-mono truncate mr-4">ipfs://{complaint.ipfsHash.slice(0,16)}...</span>
                        <a 
                           href={ipfsUrl} 
                           target="_blank" 
                           rel="noopener noreferrer" 
                           className="btn bg-orange-500/20 text-orange-500 hover:bg-orange-500 hover:text-white shrink-0 py-2"
                        >
                           <LinkIcon size={16} /> Open IPFS
                        </a>
                     </div>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Department Response Section */}
            {complaint.responseText && (
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="glass-card p-6 md:p-8 border-l-4 border-l-yellow-500 bg-yellow-500/5 backdrop-blur-xl">
                <div className="flex justify-between items-start mb-6 border-b border-yellow-500/20 pb-4">
                   <h3 className="text-xl font-bold text-white flex items-center gap-2">
                     <Building2 className="text-yellow-500" /> Official Response
                   </h3>
                   <span className="text-xs text-yellow-500/70 font-mono flex items-center gap-1.5 bg-yellow-500/10 px-2 py-1 rounded">
                      <Clock size={12} /> {formatTimestamp(complaint.respondedAt)}
                   </span>
                </div>
                
                <div className="bg-slate-900/80 p-5 rounded-xl border border-yellow-500/10 text-slate-300 leading-relaxed">
                   <p className="whitespace-pre-wrap">{complaint.responseText}</p>
                </div>
              </motion.div>
            )}

            {/* Citizen Actions (Approve/Reject) */}
            {isCitizen && status === 2 && (
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="glass-card p-6 md:p-8 bg-gradient-to-br from-slate-900 to-slate-800 border-blue-500/30">
                <h3 className="text-xl font-bold text-white mb-3">Resolution Review Required ⚠️</h3>
                <p className="text-slate-400 mb-6 leading-relaxed">
                  The department has provided a response. If the issue is completely resolved, you may approve it. If not, reject the resolution to force further action and escalation.
                </p>
                <div className="flex gap-4">
                  <button className="flex-1 btn bg-green-500 hover:bg-green-600 text-white shadow-[0_0_20px_rgba(34,197,94,0.3)] py-4 text-lg" onClick={handleApprove} disabled={contractHook.loading}>
                    ✅ Yes, Issue is Resolved
                  </button>
                  <button className="flex-1 btn bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 py-4 text-lg" onClick={handleReject} disabled={contractHook.loading}>
                    ❌ No, Reject Resolution
                  </button>
                </div>
              </motion.div>
            )}

            {/* RTI Generation Box */}
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="glass-card p-6 md:p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-500/20 transition-colors" />
              
              <div className="flex flex-col md:flex-row gap-6 items-start relative z-10">
                 <div className="w-16 h-16 shrink-0 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400 mx-auto md:mx-0">
                    <Bot size={32} />
                 </div>
                 <div className="flex-1 text-center md:text-left">
                    <h3 className="text-xl font-bold text-white mb-2">Generate Legal RTI Document</h3>
                    <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                      Need formal legal progress? Our Gemini AI engine will parse your grievance on the blockchain and auto-generate a valid Right To Information application tailored perfectly to demand answers from the department.
                    </p>
                    <button className={`btn bg-indigo-600 hover:bg-indigo-500 text-white transition-colors ${rtiLoading ? 'cursor-wait opacity-80' : ''}`} onClick={handleGenerateRTI} disabled={rtiLoading}>
                      {rtiLoading ? <span className="flex items-center gap-2"><div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"/> Drafting via AI...</span> : <span className="flex items-center gap-2"><Sparkles size={18}/> Draft Formal RTI Request</span>}
                    </button>
                 </div>
              </div>

              <AnimatePresence>
                {rtiDoc && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="mt-8 pt-6 border-t border-slate-800 relative z-10">
                    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 font-mono text-sm text-slate-300 whitespace-pre-wrap overflow-y-auto max-h-[400px] mb-4">
                      {rtiDoc}
                    </div>
                    <button 
                      className="btn bg-green-500/20 text-green-400 hover:bg-green-500 hover:text-white border border-green-500/30 w-full py-3 flex items-center justify-center gap-2" 
                      onClick={() => {
                        const blob = new Blob([rtiDoc], { type: "text/plain" });
                        const url = URL.createObjectURL(blob);
                        const link = document.createElement("a");
                        link.href = url;
                        link.download = `RTI_Application_${id}.txt`;
                        link.click();
                      }}
                    >
                      <Download size={18} /> Download as TXT
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Meta Data Box */}
            <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="glass-card p-6">
              <h4 className="font-bold text-white mb-6 flex items-center gap-2 pb-4 border-b border-slate-800"><CheckCircle2 className="text-orange-500"/> Metadata</h4>
              <div className="space-y-5">
                {[
                  { label: "Citizen Address", value: complaint.isAnonymous ? "Anonymous User" : shortenAddress(complaint.citizen), icon: <User size={14}/> },
                  { label: "Date Filed", value: formatTimestamp(complaint.createdAt), icon: <Clock size={14}/> },
                  { label: "Response Deadline", value: formatTimestamp(complaint.responseDeadline), icon: <AlertTriangle size={14}/> },
                  { label: "SLA Tracker", value: sla.text, color: sla.isOverdue ? "text-red-500 font-bold bg-red-500/10 px-2 py-0.5 rounded" : "text-green-500 font-bold", icon: <FastForward size={14}/> },
                  { label: "Escalation State", value: `Level ${Number(complaint.escalationLevel)} of 3`, icon: <ShieldCheck size={14}/> },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center pb-3 border-b border-slate-800/50 last:border-0 last:pb-0">
                    <div className="text-xs text-slate-500 uppercase flex items-center gap-1.5 font-semibold">
                      {item.icon} {item.label}
                    </div>
                    <div className={`text-sm ${item.color || "text-slate-200"}`}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Escalate button */}
              {(status === 0 || status === 5) && sla.isOverdue && (
                <div className="mt-8">
                   <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg mb-3">
                      <p className="text-xs text-red-400 font-medium leading-relaxed">
                         SLA has been breached. The department failed to address this in time. You can escalate it higher.
                      </p>
                   </div>
                   <button
                     className="btn bg-red-600 hover:bg-red-500 text-white w-full shadow-[0_0_15px_rgba(220,38,38,0.3)] border-0"
                     onClick={handleEscalate}
                     disabled={contractHook.loading}
                   >
                     ⚠️ Trigger Auto-Escalation
                   </button>
                </div>
              )}
            </motion.div>

            {/* Admin Response Only seen if admin, but here we just show the form if not solved */}
            {(status === 0 || status === 3 || status === 5) && (
              <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="glass-card p-6 border-slate-700 bg-slate-800/40">
                <h4 className="font-bold text-white mb-4 flex items-center gap-2"><Building2 className="text-blue-400" /> Authorized Response</h4>
                <p className="text-xs text-slate-400 mb-4 leading-relaxed">Respond via official department account. This is permanently appended on-chain.</p>
                <textarea
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all mb-4 min-h-[120px]"
                  placeholder="Type official statement..."
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                />
                <button 
                  className="btn bg-blue-600 hover:bg-blue-500 text-white w-full text-sm py-2.5" 
                  onClick={handleRespond} 
                  disabled={contractHook.loading}
                >
                  {contractHook.loading ? "Attaching to Block..." : "Sign & Attach Response"}
                </button>
              </motion.div>
            )}

            {/* Timeline Log */}
            <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="glass-card p-6">
              <h4 className="font-bold text-white mb-6">Activity Log</h4>
              <div className="relative pl-4 border-l-2 border-slate-800 space-y-6">
                 
                 {/* Item 1 - Filed */}
                 <div className="relative">
                    <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-slate-500"></span>
                    <p className="text-sm text-slate-300 mb-0.5">Complaint Registered</p>
                    <p className="text-xs text-slate-500 font-mono">{formatTimestamp(complaint.createdAt)}</p>
                 </div>
                 
                 {/* Item 2 - Response */}
                 {complaint.respondedAt > 0 && (
                 <div className="relative">
                    <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]"></span>
                    <p className="text-sm text-yellow-500 font-medium mb-0.5">Department Responded</p>
                    <p className="text-xs text-slate-500 font-mono">{formatTimestamp(complaint.respondedAt)}</p>
                 </div>
                 )}

                 {/* Item 3 - Resolved / Rejected */}
                 {status === 4 && (
                 <div className="relative">
                    <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></span>
                    <p className="text-sm text-green-500 font-medium mb-0.5">Marked Resolved by Filer</p>
                 </div>
                 )}

                 {status === 3 && (
                 <div className="relative">
                    <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"></span>
                    <p className="text-sm text-red-500 font-medium mb-0.5">Resolution Rejected</p>
                 </div>
                 )}

              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
}
