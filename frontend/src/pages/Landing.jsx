import { Link } from 'react-router-dom';
import { ArrowRight, Lock, Database, Search } from 'lucide-react';

const Landing = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <div className="text-center max-w-3xl">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
          The complaint they can <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-secondary-500">never delete.</span>
        </h1>
        <p className="text-xl text-slate-400 mb-10 leading-relaxed">
          GrievanceChain is a tamper-proof public grievance redressal platform. By recording complaints on the blockchain, we ensure public officials are accountable and issues cannot be swept under the rug.
        </p>
        
        <div className="flex justify-center gap-4">
          <Link to="/file" className="btn-primary flex items-center gap-2 text-lg px-8 py-3">
            File a Complaint <ArrowRight className="w-5 h-5" />
          </Link>
          <Link to="/track" className="btn-secondary flex items-center gap-2 text-lg px-8 py-3 bg-dark-800">
            Track Existing <Search className="w-5 h-5" />
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mt-24">
        <div className="glass-card p-6 border-t-2 border-t-primary-500">
          <div className="w-12 h-12 rounded-full bg-primary-500/20 flex items-center justify-center mb-4 text-primary-400">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold mb-2">Immutable Records</h3>
          <p className="text-slate-400">Complaints are securely stored on a blockchain. Once filed, no one can erase or hide them.</p>
        </div>
        <div className="glass-card p-6 border-t-2 border-t-secondary-500">
          <div className="w-12 h-12 rounded-full bg-secondary-500/20 flex items-center justify-center mb-4 text-secondary-400">
            <Database className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold mb-2">Total Transparency</h3>
          <p className="text-slate-400">Public visibility ensures departments act on issues to maintain their operational scores.</p>
        </div>
        <div className="glass-card p-6 border-t-2 border-t-green-500">
          <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mb-4 text-green-400">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold mb-2">Real-time Tracking</h3>
          <p className="text-slate-400">Follow your grievance at every stage until resolved, with public SLAs enforced.</p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
