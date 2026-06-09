import React, { useState, useEffect } from 'react';
import { Search, AlertTriangle, CheckCircle2, Wrench, X } from 'lucide-react';
import toast from 'react-hot-toast';

const Problems = ({ supplier }) => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedProblem, setSelectedProblem] = useState(null);

  useEffect(() => {
    fetchProblems();
  }, [supplier.id]);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:8000/api/problems?supplier=${supplier.id}&approved_only=true`);
      if (res.ok) {
        const data = await res.json();
        const filtered = (data || []).filter(p => ['Approved', 'Seen'].includes(p.status));
        
        const mapped = filtered.map(p => {
          const details = p.details_json ? JSON.parse(p.details_json) : {};
          return {
            id: p.id,
            displayId: `PRB-${p.id}`,
            beneficiary: p.beneficiary_name || 'Unknown',
            serialNo: p.serial_number || details.serialNumber || 'Unknown',
            equipmentType: p.equipment,
            problemLevel: p.title || 'Unknown Level',
            mainCause: p.category || details.mainCause || '-',
            location: `${p.woreda}, ${p.zone}`,
            reported: new Date(p.created_at || Date.now()).toISOString().split('T')[0],
            status: p.status || 'Approved'
          };
        });
        setProblems(mapped);
      }
    } catch (e) {
      console.error(e);
      toast.error('Failed to load equipment issues');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (status) => {
    try {
      const res = await fetch(`http://localhost:8000/api/problems/${selectedProblem.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, submitted_by: supplier?.name })
      });
      if (res.ok) {
        toast.success(`Problem marked as ${status}`);
        fetchProblems();
        if (status === 'Seen') {
          setSelectedProblem(null);
        } else {
          setSelectedProblem(prev => ({...prev, status}));
        }
      }
    } catch (e) {
      toast.error("Failed to update status");
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Open': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'Approved': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'Seen': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'Fixed': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const filteredData = problems.filter(p => {
    const matchSearch = p.beneficiary.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        p.serialNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter ? p.status === statusFilter : true;
    return matchSearch && matchStatus;
  });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Equipment Issues</h2>
        <p className="text-slate-500 mt-1">Manage and resolve problems reported for your distributed equipment.</p>
      </div>

      {selectedProblem ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
          <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between bg-slate-50">
            <h4 className="font-bold text-slate-800">Issue Details: {selectedProblem.displayId}</h4>
            <button onClick={() => { setSelectedProblem(null); }} className="p-1 hover:bg-slate-200 rounded-lg text-slate-400">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-8 mb-8">
               <div className="space-y-4">
                 <div><span className="text-sm text-slate-400 block mb-1">Beneficiary</span><p className="font-semibold">{selectedProblem.beneficiary}</p></div>
                 <div><span className="text-sm text-slate-400 block mb-1">Location</span><p className="font-semibold">{selectedProblem.location}</p></div>
                 <div><span className="text-sm text-slate-400 block mb-1">Date Reported</span><p className="font-semibold">{selectedProblem.reported}</p></div>
               </div>
               <div className="space-y-4">
                 <div><span className="text-sm text-slate-400 block mb-1">Equipment</span><p className="font-semibold text-blue-600">{selectedProblem.equipmentType}</p></div>
                 <div><span className="text-sm text-slate-400 block mb-1">Serial Number</span><p className="font-semibold">{selectedProblem.serialNo}</p></div>
                 <div><span className="text-sm text-slate-400 block mb-1">Problem Category</span><p className="font-semibold">{selectedProblem.mainCause}</p></div>
               </div>
            </div>
            
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 mb-8">
               <h5 className="font-semibold text-slate-800 mb-2">Description / Problem Level</h5>
               <p className="text-slate-600 text-sm">{selectedProblem.problemLevel}</p>
            </div>

            <div>
               <h5 className="font-semibold text-slate-800 mb-4">Update Action Status</h5>
               <div className="flex gap-4 items-end flex-wrap">
                 <div className="flex items-center gap-3 ml-auto">
                   {selectedProblem.status === 'Approved' && (
                     <button onClick={() => handleStatusChange('Seen')} className="flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm transition-all border self-end bg-white text-slate-600 border-slate-200 hover:bg-slate-50">
                       <CheckCircle2 className="w-4 h-4" /> Mark as Seen
                     </button>
                   )}
                 </div>
               </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between gap-4 bg-slate-50">
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by serial or beneficiary..."
              className="w-full pl-12 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="Approved">Approved</option>
            <option value="Seen">Seen</option>
            <option value="Fixed">Fixed</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
             <div className="p-12 text-center text-slate-500">Loading your issues...</div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-white border-b border-slate-100 text-slate-400 font-semibold text-xs tracking-wider">
                <tr>
                  <th className="p-4 pl-6 uppercase">ID</th>
                  <th className="p-4 uppercase">Equipment</th>
                  <th className="p-4 uppercase">Beneficiary</th>
                  <th className="p-4 uppercase">Date Reported</th>
                  <th className="p-4 uppercase">Status</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredData.length === 0 ? (
                  <tr><td colSpan="6" className="p-8 text-center text-slate-500">No issues found.</td></tr>
                ) : filteredData.map((p) => (
                  <tr key={p.id} className={`hover:bg-slate-50/50 transition-colors cursor-pointer ${selectedProblem?.id === p.id ? 'bg-blue-50/30' : ''}`} onClick={() => setSelectedProblem(p)}>
                    <td className="p-4 pl-6 font-medium text-slate-600">{p.displayId}</td>
                    <td className="p-4">
                      <div className="font-bold text-slate-800">{p.equipmentType}</div>
                      <div className="text-xs text-slate-400">SN: {p.serialNo}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-slate-800 font-medium">{p.beneficiary}</div>
                      <div className="text-xs text-slate-400">{p.location}</div>
                    </td>
                    <td className="p-4 text-slate-500">{p.reported}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusStyle(p.status)}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="text-blue-600 font-medium hover:underline text-xs">Manage</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Problems;
