import { useState } from 'react';
import { initialComplaints, getStatusColor } from '../mockData';
import { AlertTriangle, CheckCircle, MessageSquare } from 'lucide-react';

const OfficialApp = () => {
  const [complaints, setComplaints] = useState(initialComplaints);

  const updateStatus = (id, newStatus) => {
    setComplaints(complaints.map(c => 
      c.id === id ? { ...c, status: newStatus } : c
    ));
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold mb-2">Official Dashboard</h1>
          <p className="text-slate-400">Department assigned grievances that require attention.</p>
        </div>
        <div className="bg-dark-800 border border-dark-700 px-4 py-2 rounded-xl text-sm font-mono text-primary-400">
          User: Dept_Admin
        </div>
      </div>

      <div className="bg-dark-900 border border-dark-700 rounded-xl overflow-hidden glass-card">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-dark-800/80 text-slate-400 text-sm">
              <th className="p-4 font-medium">ID</th>
              <th className="p-4 font-medium">Complaint</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-700/50">
            {complaints.map((complaint) => (
              <tr key={complaint.id} className="hover:bg-dark-800/30 transition-colors">
                <td className="p-4 text-xs font-mono text-slate-500">{complaint.id}</td>
                <td className="p-4">
                  <div className="font-medium mb-1">{complaint.title}</div>
                  <div className="text-sm text-slate-500 line-clamp-1">{complaint.description}</div>
                </td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border inline-flex ${getStatusColor(complaint.status)}`}>
                    {complaint.status}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => updateStatus(complaint.id, 'Responded')}
                      className="p-2 bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 rounded-lg transition-colors border border-blue-500/20"
                      title="Respond"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => updateStatus(complaint.id, 'Resolved')}
                      className="p-2 bg-green-500/10 text-green-500 hover:bg-green-500/20 rounded-lg transition-colors border border-green-500/20"
                      title="Resolve"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => updateStatus(complaint.id, 'Escalated')}
                      className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors border border-red-500/20"
                      title="Escalate"
                    >
                      <AlertTriangle className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OfficialApp;
