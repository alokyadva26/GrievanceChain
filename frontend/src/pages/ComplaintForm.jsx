import { useState } from 'react';
import { Upload, CheckCircle2 } from 'lucide-react';
import { mockDepartments } from '../mockData';

const ComplaintForm = () => {
  const [formData, setFormData] = useState({ title: '', description: '', department: '', anonymous: false });
  const [submitted, setSubmitted] = useState(false);
  const [mockHash, setMockHash] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.department) return;
    
    // Mock blockchain submission delay & sequence
    const hash = '0x' + Math.random().toString(16).substr(2, 40);
    setMockHash(hash);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-8 glass-card text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-green-600"></div>
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-6" />
        <h2 className="text-3xl font-bold mb-4">Transaction Submitted</h2>
        <p className="text-slate-400 mb-6">Your grievance has been permanently recorded on the blockchain.</p>
        <div className="bg-dark-900 p-4 rounded-xl border border-dark-700 font-mono text-sm break-all text-primary-400 mb-8">
          Transaction Hash: {mockHash}
        </div>
        <button onClick={() => setSubmitted(false)} className="btn-secondary">File Another Complaint</button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">File a Grievance</h1>
        <p className="text-slate-400">Submit a new complaint. Your issue will be securely recorded and assigned to the relevant department.</p>
      </div>

      <form onSubmit={handleSubmit} className="glass-card p-6 md:p-8 space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-slate-300">Complaint Title</label>
          <input 
            type="text" 
            className="input-field" 
            placeholder="E.g. Broken water pipe in Sector 4"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-slate-300">Description</label>
          <textarea 
            className="input-field min-h-[120px] resize-y" 
            placeholder="Provide necessary background details..."
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            required
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-slate-300">Target Department</label>
          <select 
            className="input-field bg-dark-900 appearance-none"
            value={formData.department}
            onChange={(e) => setFormData({...formData, department: e.target.value})}
            required
          >
            <option value="" disabled>Select a department</option>
            {mockDepartments.map(dep => (
              <option key={dep.id} value={dep.id}>{dep.name}</option>
            ))}
          </select>
        </div>

        <div className="border border-dashed border-dark-600 rounded-xl p-8 text-center bg-dark-900/50 hover:bg-dark-800 transition cursor-pointer">
          <Upload className="w-8 h-8 text-slate-500 mx-auto mb-2" />
          <p className="text-sm text-slate-400">Click to upload evidence (mock image upload)</p>
        </div>

        <div className="flex items-center space-x-3 bg-dark-900/50 p-4 rounded-xl border border-dark-700">
          <input 
            type="checkbox" 
            id="anonymous" 
            className="w-5 h-5 rounded border-dark-600 text-primary-600 focus:ring-primary-500 bg-dark-800"
            checked={formData.anonymous}
            onChange={(e) => setFormData({...formData, anonymous: e.target.checked})}
          />
          <label htmlFor="anonymous" className="text-sm font-medium text-slate-300 select-none cursor-pointer">
            File anonymously (Identity will not be stored)
          </label>
        </div>

        <button type="submit" className="btn-primary w-full py-4 text-lg mt-4">
          Submit to Blockchain (Mock)
        </button>
      </form>
    </div>
  );
};

export default ComplaintForm;
