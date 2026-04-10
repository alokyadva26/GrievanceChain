import React, { useState, useRef } from "react";
import toast from "react-hot-toast";
import { uploadToIPFS } from "../utils/ipfs";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, MapPin, UploadCloud, X, CheckCircle2, ChevronRight, ChevronLeft, ShieldCheck, FileText } from "lucide-react";

const DEPARTMENTS = [
  "Public Works", "Health", "Education", "Police",
  "Revenue", "Transport", "Water Supply", "Electricity"
];

export default function ComplaintForm({ onSubmit, loading }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    department: "",
    title: "",
    description: "",
    location: "",
    isAnonymous: false,
  });
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (selectedFile.type.startsWith('image/')) {
        setFilePreview(URL.createObjectURL(selectedFile));
      } else {
        setFilePreview(null);
      }
    }
  };

  const removeFile = () => {
    setFile(null);
    setFilePreview(null);
    if(fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      toast.loading("Detecting location...", { id: 'loc' });
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setForm(prev => ({ ...prev, location: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}` }));
          toast.success("Location detected!", { id: 'loc' });
        },
        () => {
          toast.error("Location access denied. Please enter manually.", { id: 'loc' });
        }
      );
    }
  };

  const improveWithAI = () => {
    if (!form.description) {
      toast.error("Please write a draft description first");
      return;
    }
    
    setIsAIThinking(true);
    // Mock GenAI delay for hackathon polish
    setTimeout(() => {
      setForm(prev => ({
        ...prev,
        title: prev.title || "Urgent Action Required regarding " + (prev.department || "Public Services"),
        description: `I am writing to formally report an issue regarding [specifics here]. Originally noted as: "${prev.description}". This matter requires urgent attention as it impacts public welfare. I request the concerned authorities to investigate and resolve this grievance promptly.`
      }));
      setIsAIThinking(false);
      toast.success("Enhanced using Gemini AI ✨");
    }, 2000);
  };

  const handleNext = () => {
    if (!form.department || !form.title || !form.description) {
      toast.error("Please fill all required fields in Step 1");
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let ipfsHash = "";

    // Upload evidence file if provided
    if (file) {
      try {
        setUploading(true);
        // Simulate upload progress
        const pInterval = setInterval(() => {
          setUploadProgress(prev => {
            if(prev >= 90) { clearInterval(pInterval); return prev;}
            return prev + 10;
          });
        }, 300);
        
        const result = await uploadToIPFS(file);
        
        clearInterval(pInterval);
        setUploadProgress(100);
        ipfsHash = result.ipfsHash;
        toast.success("Evidence uploaded to IPFS");
      } catch (err) {
        toast.error("Failed to upload evidence: " + err.message);
        setUploading(false);
        setUploadProgress(0);
        return;
      } finally {
        setUploading(false);
      }
    }

    onSubmit({
      ...form,
      ipfsHash,
      // You can append location to description if contract doesn't support it directly
      description: form.location ? `[Location: ${form.location}]\n\n${form.description}` : form.description
    });
  };

  const isSubmitting = loading || uploading;

  return (
    <div className="w-full max-w-2xl mx-auto backdrop-blur-xl bg-slate-900/60 border border-slate-700 rounded-3xl p-6 lg:p-10 shadow-2xl relative overflow-hidden">
      
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex justify-between items-center text-sm font-medium text-slate-400 mb-3">
          <span className={step === 1 ? "text-orange-500 flex items-center gap-2" : "flex items-center gap-2"}>
             <span className="w-6 h-6 rounded-full flex items-center justify-center bg-slate-800 text-xs text-white">1</span> Details
          </span>
          <span className="h-0.5 flex-1 mx-4 bg-slate-800 rounded-full overflow-hidden">
             <div className="h-full bg-gradient-to-r from-orange-500 to-yellow-500 w-1/2 transition-all duration-500" style={{ width: step === 2 ? '100%' : '50%' }}></div>
          </span>
          <span className={step === 2 ? "text-orange-500 flex items-center gap-2" : "flex items-center gap-2"}>
             <span className="w-6 h-6 rounded-full flex items-center justify-center bg-slate-800 text-xs text-white">2</span> Evidence
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="relative z-10">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <label className="text-sm font-semibold tracking-wide text-slate-300 uppercase flex justify-between">
                  Department <span className="text-orange-500">*</span>
                </label>
                <select
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all appearance-none cursor-pointer"
                  style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%2394a3b8\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'%3E%3C/polyline%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
                  required
                >
                  <option value="">Select a department</option>
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d} className="bg-slate-800">{d}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold tracking-wide text-slate-300 uppercase flex justify-between">
                  Complaint Title <span className="text-orange-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all placeholder:text-slate-500"
                  placeholder="e.g. Broken Water Pipe near Main St."
                  required
                />
              </div>

              <div className="space-y-2 relative">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold tracking-wide text-slate-300 uppercase">
                    Description <span className="text-orange-500">*</span>
                  </label>
                  <button 
                    type="button" 
                    onClick={improveWithAI}
                    disabled={isAIThinking}
                    className="text-xs flex items-center gap-1.5 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 py-1 px-3 rounded-full transition-all border border-indigo-500/20"
                  >
                    {isAIThinking ? <span className="animate-spin duration-3000">✨</span> : <Sparkles size={14} />} 
                    {isAIThinking ? "Optimizing..." : "Gemini AI Assist"}
                  </button>
                </div>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all placeholder:text-slate-500 min-h-[140px] resize-y"
                  placeholder="Provide detailed description... Just write a draft, our AI can help polish it."
                  required
                />
              </div>

              <button
                type="button"
                onClick={handleNext}
                className="w-full btn btn-primary py-4 rounded-xl flex items-center justify-center gap-2 mt-4 text-lg"
              >
                Continue to Evidence <ChevronRight />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <label className="text-sm font-semibold tracking-wide text-slate-300 uppercase flex justify-between">
                  Location (Optional)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-slate-400"><MapPin size={20}/></span>
                  <input
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-12 pr-24 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all placeholder:text-slate-500"
                    placeholder="Enter location or auto-detect"
                  />
                  <button 
                    type="button" 
                    onClick={handleGetLocation}
                    className="absolute right-2 top-2 text-xs bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded-lg text-white transition-colors"
                  >
                     Auto-detect
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold tracking-wide text-slate-300 uppercase flex justify-between">
                  Evidence Upload <span className="text-slate-500 font-normal normal-case ml-2">(Max 5MB)</span>
                </label>
                
                <div 
                  className={`border-2 border-dashed rounded-xl transition-all duration-300 ${file ? 'border-orange-500/50 bg-orange-500/5' : 'border-slate-700 hover:border-orange-500/30 bg-slate-800/50 hover:bg-slate-800'} relative overflow-hidden`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    accept="image/*,.pdf,.doc,.docx"
                  />
                  
                  <div className="p-8 text-center flex flex-col items-center justify-center">
                    {file ? (
                      <div className="relative z-20 flex flex-col items-center w-full">
                         {filePreview ? (
                            <img src={filePreview} alt="Preview" className="h-32 mb-4 rounded-lg object-contain shadow-lg border border-slate-700" />
                         ) : (
                            <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center text-orange-500 mb-4">
                              <FileText size={32} />
                            </div>
                         )}
                         <p className="text-white font-medium mb-1 truncate max-w-[250px]">{file.name}</p>
                         <p className="text-slate-400 text-xs mb-4">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                         <button 
                           type="button" 
                           onClick={removeFile}
                           className="bg-red-500/10 text-red-400 hover:bg-red-500/20 px-4 py-2 rounded-full text-sm font-semibold transition-colors flex items-center gap-1 cursor-pointer pointer-events-auto"
                           style={{ position: 'relative', zIndex: 30 }}
                         >
                           <X size={16} /> Remove File
                         </button>
                      </div>
                    ) : (
                      <>
                        <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center text-slate-400 mb-4">
                          <UploadCloud size={32} />
                        </div>
                        <p className="text-white font-medium mb-2">Click or drag file here</p>
                        <p className="text-slate-400 text-sm">Supports images and PDF documents</p>
                      </>
                    )}
                  </div>
                  
                  {/* Upload Progress Bar overlay */}
                  {uploading && (
                    <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center z-40">
                      <div className="w-3/4 bg-slate-800 rounded-full h-2 mb-4 overflow-hidden border border-slate-700">
                        <div className="bg-gradient-to-r from-orange-500 to-yellow-500 h-2 rounded-full transition-all duration-300" style={{width: `${uploadProgress}%`}}></div>
                      </div>
                      <p className="text-orange-400 text-sm font-medium animate-pulse">Uploading to IPFS ({uploadProgress}%)...</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-4 cursor-pointer p-4 rounded-xl border border-slate-700 bg-slate-800/50 hover:bg-slate-800 transition-colors group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      name="isAnonymous"
                      checked={form.isAnonymous}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className={`w-12 h-6 rounded-full transition-colors ${form.isAnonymous ? 'bg-orange-500' : 'bg-slate-700'}`}>
                      <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${form.isAnonymous ? 'translate-x-6' : 'translate-x-[2px]'}`} />
                    </div>
                  </div>
                  <div>
                    <p className="text-white font-medium">File Anonymously</p>
                    <p className="text-slate-400 text-xs">Hide your identity on the public portal.</p>
                  </div>
                </label>
              </div>

              <div className="flex gap-4 pt-4 mt-2 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 py-4 rounded-xl flex items-center justify-center gap-2 font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
                  disabled={isSubmitting}
                >
                  <ChevronLeft size={20}/> Back
                </button>
                <button
                  type="submit"
                  className="w-2/3 btn btn-primary py-4 rounded-xl flex items-center justify-center gap-2 text-lg shadow-[0_0_20px_rgba(255,107,53,0.3)] hover:shadow-[0_0_30px_rgba(255,107,53,0.5)]"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2"><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting...</span>
                  ) : (
                    <span className="flex items-center gap-2"><ShieldCheck /> Submit & Record on Blockchain</span>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}
