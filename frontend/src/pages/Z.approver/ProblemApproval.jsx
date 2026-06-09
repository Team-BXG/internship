import React, { useState, useEffect } from 'react';
import { Search, AlertOctagon, Wrench, CheckCircle2, FileText, Eye } from 'lucide-react';
import ProblemDetailsModal from '../../components/ProblemDetailsModal';

const ProblemApproval = ({ selectedZone }) => {
  const [problems, setProblems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [activeProblem, setActiveProblem] = useState(null);

  useEffect(() => {
    fetchProblems();
  }, [selectedZone]);

  const fetchProblems = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || (import.meta.env.VITE_API_URL || "http://localhost:8000")}/api/problems?approved_only=true&zone=${encodeURIComponent(selectedZone)}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setProblems(data.filter(p => ['Approved', 'Seen'].includes(p.status)));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = problems.filter(p => {
    const term = searchTerm.toLowerCase();
    const matchSearch = p.beneficiary_name?.toLowerCase().includes(term) || 
      p.equipment?.toLowerCase().includes(term);
    const matchZone = !selectedZone || 
                      (p.zone && p.zone.toLowerCase().includes(selectedZone.toLowerCase())) || 
                      (p.zone_name && p.zone_name.toLowerCase().includes(selectedZone.toLowerCase())) ||
                      selectedZone.toLowerCase().includes(String(p.zone || '').toLowerCase());
    const matchStatus = statusFilter === 'All Status' ? true : p.status === statusFilter;
    return matchSearch && matchZone && matchStatus;
  });

  const uniqueStatuses = [...new Set(problems.map(p => p.status).filter(Boolean))];

  const stats = {
    total: filtered.length,
    approved: filtered.filter(p => p.status === 'Approved').length,
    seen: filtered.filter(p => p.status === 'Seen').length,
    fixed: filtered.filter(p => p.status === 'Fixed').length
  };

  const getStatusColor = (status) => {
    if (status === 'Open') return 'text-amber-700 bg-amber-50 border-amber-200';
    if (status === 'Approved') return 'text-blue-700 bg-blue-50 border-blue-200';
    if (status === 'Seen') return 'text-purple-700 bg-purple-50 border-purple-200';
    if (status === 'Fixed') return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (status === 'Correction Needed') return 'text-red-700 bg-red-50 border-red-200';
    return 'text-slate-600 bg-slate-50 border-slate-200';
  };

  const actionConfig = [];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-slate-800">Problem Review</h3>
        <p className="text-slate-500 mt-1">View woreda-approved problem reports in {selectedZone}.</p>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 font-medium text-sm">Total Reported</p>
              <h2 className="text-3xl font-bold text-slate-800 mt-1">{stats.total}</h2>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl">
              <FileText className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-800 font-medium text-sm">Approved</p>
              <h2 className="text-3xl font-bold text-blue-600 mt-1">{stats.approved}</h2>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <AlertOctagon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-purple-50 border border-purple-100 p-6 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-800 font-medium text-sm">Seen</p>
              <h2 className="text-3xl font-bold text-purple-600 mt-1">{stats.seen}</h2>
            </div>
            <div className="p-3 bg-purple-100 rounded-xl">
              <Wrench className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
               <p className="text-emerald-800 font-medium text-sm">Fixed</p>
               <h2 className="text-3xl font-bold text-emerald-600 mt-1">{stats.fixed}</h2>
            </div>
            <div className="p-3 bg-emerald-100 rounded-xl">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            </div>
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
            <thead className="bg-slate-50 text-slate-500 font-semibold text-xs tracking-wider">
               <tr>
                 <th className="p-4 border-b border-slate-100">EQUIPMENT / S.NO</th>
                 <th className="p-4 border-b border-slate-100">BENEFICIARY</th>
                 <th className="p-4 border-b border-slate-100">LOCATION</th>
                 <th className="p-4 border-b border-slate-100">REPORTED</th>
                 <th className="p-4 border-b border-slate-100">STATUS</th>
                 <th className="p-4 border-b border-slate-100 text-center">ACTION</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-500">
                    No problem reports found.
                  </td>
                </tr>
              ) : filtered.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 flex items-center gap-2">
                    <AlertOctagon className="w-4 h-4 text-red-400" />
                    <div>
                      <div className="font-bold text-slate-800">{p.equipment}</div>
                      <div className="text-xs text-slate-400">{p.details?.serialNumber || 'N/A'}</div>
                    </div>
                  </td>
                  <td className="p-4 text-slate-600 font-medium">{p.beneficiary_name}</td>
                  <td className="p-4">
                    <div className="text-slate-800 font-medium">{p.woreda}</div>
                    <div className="text-xs text-slate-400">{p.zone}</div>
                  </td>
                  <td className="p-4 text-slate-500">{new Date(p.created_at).toISOString().split('T')[0]}</td>
                  <td className="p-4">
                     <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(p.status)}`}>
                        {p.status}
                     </span>
                  </td>
                  <td className="p-4 text-center">
                     <button onClick={() => setActiveProblem(p)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors inline-block" title="View Details">
                        <Eye className="w-5 h-5" />
                     </button>
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

export default ProblemApproval;
