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
      const res = await fetch('http://localhost:8000/api/problems');
      if (res.ok) {
        const data = await res.json();
        // Since we don't have supplier ID linked cleanly to problems yet, we mock the filtering a bit
        // by only keeping some problems for this supplier for demo purposes.
        // In a real backend, we'd do: SELECT * FROM problems WHERE ...
        const filtered = data.filter((_, i) => i % 2 === 0);
        
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
            status: p.status || 'Open'
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

  const updateProblemStatus = async (id, newStatus) => {
    // Optimistic UI update
    setProblems(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
    if (selectedProblem && selectedProblem.id === id) {
      setSelectedProblem({ ...selectedProblem, status: newStatus });
    }
    toast.success(`Marked as ${newStatus}`);
    
    // In a real app, send a PUT/PATCH to backend to update the status.
    /*
    try {
      await fetch(`http://localhost:8000/api/problems/${id}`, { method: 'PATCH', body: JSON.stringify({status: newStatus}) })
    } catch (e) {}
    */
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Open': return 'text-red-600 bg-red-50 border-red-200';
      case 'Under Repair': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Resolved': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
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
            <button onClick={() => setSelectedProblem(null)} className="p-1 hover:bg-slate-200 rounded-lg text-slate-400">
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
               <div className="flex gap-4">
                 <button onClick={() => updateProblemStatus(selectedProblem.id, 'Open')} className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm transition-all border ${selectedProblem.status === 'Open' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}>
                   <AlertTriangle className="w-4 h-4" /> Open
                 </button>
                 <button onClick={() => updateProblemStatus(selectedProblem.id, 'Under Repair')} className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm transition-all border ${selectedProblem.status === 'Under Repair' ? 'bg-orange-50 text-orange-600 border-orange-200' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}>
                   <Wrench className="w-4 h-4" /> Under Repair
                 </button>
                 <button onClick={() => updateProblemStatus(selectedProblem.id, 'Resolved')} className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm transition-all border ${selectedProblem.status === 'Resolved' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}>
                   <CheckCircle2 className="w-4 h-4" /> Resolved
                 </button>
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
            <option value="Open">Open</option>
            <option value="Under Repair">Under Repair</option>
            <option value="Resolved">Resolved</option>
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
