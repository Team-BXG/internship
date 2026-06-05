import React, { useState, useEffect } from 'react';
import { Search, AlertOctagon, Wrench, CheckCircle2, FileText, Eye } from 'lucide-react';
import ProblemDetailsModal from '../../components/ProblemDetailsModal';

const ApproveProblem = ({ selectedScope }) => {
  const [problems, setProblems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [activeProblem, setActiveProblem] = useState(null);

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/problems`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setProblems(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleStatusUpdate = async (problem, newStatus) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/problems/${problem.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setActiveProblem(null);
        fetchProblems();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = problems.filter(p => {
    const term = searchTerm.toLowerCase();
    const matchSearch = p.beneficiary_name?.toLowerCase().includes(term) || 
      p.equipment?.toLowerCase().includes(term);
    const matchZone = p.zone === selectedScope.zone && p.woreda === selectedScope.woreda;
    const matchStatus = statusFilter === 'All Status' ? true : p.status === statusFilter;
    return matchSearch && matchZone && matchStatus;
  });

  const uniqueStatuses = [...new Set(problems.map(p => p.status).filter(Boolean))];

  const stats = {
    total: filtered.length,
    open: filtered.filter(p => p.status === 'Open' || p.status === 'Pending').length,
    repair: filtered.filter(p => p.status === 'Under Repair').length,
    resolved: filtered.filter(p => p.status === 'Resolved').length
  };

  const getStatusColor = (status) => {
    if (status === 'Open' || status === 'Pending') return 'text-red-700 bg-red-50 border-red-200';
    if (status === 'Under Repair') return 'text-amber-700 bg-amber-50 border-amber-200';
    if (status === 'Acknowledged') return 'text-blue-700 bg-blue-50 border-blue-200';
    if (status === 'Resolved') return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    return 'text-slate-600 bg-slate-50 border-slate-200';
  };

  const actionConfig = [
    { label: 'Approve Problem', className: 'bg-blue-500 hover:bg-blue-600 text-white', onClick: (p) => handleStatusUpdate(p, 'Approved') }
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-slate-800">Equipment Issues</h3>
        <p className="text-slate-500 mt-1">Equipment non-functionality in {selectedScope.zone} / {selectedScope.woreda}</p>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
          <div className="flex flex-col justify-between">
            <h2 className="text-3xl font-bold text-slate-800 mt-1">{stats.total}</h2>
            <p className="text-slate-500 font-medium text-sm mt-2">Total Problems Reported</p>
          </div>
        </div>
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
          <div className="flex flex-col justify-between">
            <h2 className="text-3xl font-bold text-red-600 mt-1">{stats.open}</h2>
            <p className="text-slate-500 font-medium text-sm mt-2">Open Issues</p>
          </div>
        </div>
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
          <div className="flex flex-col justify-between">
            <h2 className="text-3xl font-bold text-amber-500 mt-1">{stats.repair}</h2>
             <p className="text-slate-500 font-medium text-sm mt-2">Under Repair</p>
          </div>
        </div>
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
          <div className="flex flex-col justify-between">
             <h2 className="text-3xl font-bold text-emerald-600 mt-1">{stats.resolved}</h2>
             <p className="text-slate-500 font-medium text-sm mt-2">Resolved</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between gap-4">
           <div className="relative flex-1 max-w-xl">
             <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
             <input 
               type="text" 
               placeholder="Search by equipment, beneficiary..."
               className="w-full pl-12 pr-4 py-2.5 bg-white border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
           </div>
           <div className="flex gap-3">
             <select 
               className="px-4 py-2.5 bg-white border border-slate-200 rounded-full text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20"
               value={statusFilter}
               onChange={(e) => setStatusFilter(e.target.value)}
             >
                <option value="All Status">All Status</option>
                {uniqueStatuses.map(s => <option key={s} value={s}>{s}</option>)}
             </select>
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-500">
                    No problem reports found.
                  </td>
                </tr>
              ) : filtered.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 pl-6 flex items-center gap-3">
                    <div className="p-2 bg-red-50 text-red-500 rounded-full">
                       <AlertOctagon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-800">{p.beneficiary_name}</div>
                      <div className="text-xs text-slate-400">{p.equipment} - {p.zone}</div>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                       <span className="font-bold text-red-500 text-xs">{p.issue_type || 'Not Functional'}</span>
                       <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${getStatusColor(p.status)}`}>
                          {p.status}
                       </span>
                       <button onClick={() => setActiveProblem(p)} className="ml-2 p-2 text-slate-400 hover:text-blue-500 rounded-lg transition-colors" title="View Details Log">
                          <Eye className="w-5 h-5" />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {activeProblem && (
        <ProblemDetailsModal 
          problem={activeProblem} 
          onClose={() => setActiveProblem(null)} 
          actionConfig={actionConfig} 
        />
      )}
    </div>
  );
};

export default ApproveProblem;
