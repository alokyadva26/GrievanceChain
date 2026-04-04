export const mockDepartments = [
  { id: 'dep1', name: 'Municipal Water Department', score: 87, classification: 'Critical', color: '#ef4444' },
  { id: 'dep2', name: 'Roads and Infrastructure', score: 79, classification: 'Poor', color: '#f97316' },
  { id: 'dep3', name: 'Electricity Board', score: 54, classification: 'Fair', color: '#eab308' },
  { id: 'dep4', name: 'Public Works Department', score: 28, classification: 'Good', color: '#22c55e' },
];

export const initialComplaints = [
  {
    id: 'GC-0XF83A',
    title: 'Severe Water Contamination in Sector 4',
    description: 'The tap water has been muddy and smells like sewage for the past week. Multiple residents falling ill.',
    departmentId: 'dep1',
    department: 'Municipal Water Department',
    status: 'Pending',
    submittedAt: '2026-03-30T10:30:00Z',
    deadline: '2026-04-14T10:30:00Z',
    isAnonymous: false,
    timeline: [
      { status: 'Filed', date: '2026-03-30T10:30:00Z', completed: true },
      { status: 'Under Review', date: null, completed: false },
      { status: 'Escalated', date: null, completed: false },
      { status: 'Resolved', date: null, completed: false }
    ],
    hash: '0x8f3c7e...'
  },
  {
    id: 'GC-0X9B2C',
    title: 'Pothole causing accidents on Main St.',
    description: 'A massive pothole has damaged 5 cars this week. Completely ignored by authorities.',
    departmentId: 'dep2',
    department: 'Roads and Infrastructure',
    status: 'Escalated',
    submittedAt: '2026-03-15T14:20:00Z',
    deadline: '2026-03-29T14:20:00Z',
    isAnonymous: true,
    timeline: [
      { status: 'Filed', date: '2026-03-15T14:20:00Z', completed: true },
      { status: 'Under Review', date: '2026-03-16T09:00:00Z', completed: true },
      { status: 'Escalated', date: '2026-03-30T09:00:00Z', completed: true },
      { status: 'Resolved', date: null, completed: false }
    ],
    hash: '0x1a2b3c...'
  },
  {
    id: 'GC-0X4D5E',
    title: 'Frequent Power Outages during night',
    description: 'Power is cut every night from 1 AM to 4 AM without prior notice.',
    departmentId: 'dep3',
    department: 'Electricity Board',
    status: 'Responded',
    submittedAt: '2026-04-01T08:15:00Z',
    deadline: '2026-04-15T08:15:00Z',
    isAnonymous: false,
    timeline: [
      { status: 'Filed', date: '2026-04-01T08:15:00Z', completed: true },
      { status: 'Under Review', date: '2026-04-02T10:00:00Z', completed: true },
      { status: 'Escalated', date: null, completed: false },
      { status: 'Resolved', date: null, completed: false }
    ],
    hash: '0x5e4d3c...'
  }
];

export const getStatusColor = (status) => {
  switch (status) {
    case 'Pending': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
    case 'Responded': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    case 'Escalated': return 'bg-red-500/10 text-red-500 border-red-500/20';
    case 'Resolved': return 'bg-green-500/10 text-green-500 border-green-500/20';
    default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
  }
};
