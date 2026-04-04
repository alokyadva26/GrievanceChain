import { mockDepartments } from '../mockData';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const CorruptionScore = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Department Accountability Tracker</h1>
        <p className="text-slate-400">Real-time corruption and performance scores calculated by AI from historical grievance resolution times on the blockchain.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card p-6 border border-dark-700/50">
          <h3 className="text-xl font-bold mb-6 text-slate-200">Overall Severity Chart</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockDepartments} layout="vertical" margin={{ top: 0, right: 0, left: 30, bottom: 0 }}>
                <XAxis type="number" domain={[0, 100]} stroke="#475569" />
                <YAxis dataKey="name" type="category" width={150} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                />
                <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                  {mockDepartments.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-bold mb-4 text-slate-200">Department Status</h3>
          {mockDepartments.map(dep => (
            <div key={dep.id} className="bg-dark-900 border border-dark-700 rounded-xl p-4 flex flex-col items-start gap-2">
              <span className="font-semibold text-slate-200">{dep.name}</span>
              <div className="w-full flex justify-between items-center text-sm">
                <span className="text-slate-400">Score: <span className="font-mono text-white text-base">{dep.score}</span></span>
                <span className="py-1 px-3 rounded-full text-xs font-bold" style={{ backgroundColor: `${dep.color}20`, color: dep.color, border: `1px solid ${dep.color}40` }}>
                  {dep.classification}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CorruptionScore;
