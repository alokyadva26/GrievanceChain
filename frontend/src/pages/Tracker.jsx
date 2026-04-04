import { Link } from 'react-router-dom';
import { initialComplaints, getStatusColor } from '../mockData';
import { Clock, ExternalLink } from 'lucide-react';

const Tracker = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Track Public Grievances</h1>
        <p className="text-slate-400">View and track existing complaints. Data is persistently sourced from the mock platform.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {initialComplaints.map((complaint) => (
          <Link to={`/detail/${complaint.id}`} key={complaint.id} className="glass-card hover:border-primary-500/50 transition-colors group p-6 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-mono text-slate-500">{complaint.id}</span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(complaint.status)}`}>
                  {complaint.status}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-2 line-clamp-2 h-[56px] group-hover:text-primary-400 transition-colors">
                {complaint.title}
              </h3>
              <p className="text-sm text-slate-400 mb-6">{complaint.department}</p>
            </div>
            
            <div className="mt-auto border-t border-dark-700/50 pt-4 flex items-center justify-between">
              <div className="flex items-center text-xs text-slate-500 space-x-1">
                <Clock className="w-3 h-3" />
                <span>Deadline: {new Date(complaint.deadline).toLocaleDateString()}</span>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-600 group-hover:text-primary-500 transition-colors" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Tracker;
