import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Search, Filter, Download, AlertOctagon, CheckCircle2, MapPin } from 'lucide-react';
const ProblemHandlings = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filters
  const [filterZone, setFilterZone] = useState('All');
  const [filterWoreda, setFilterWoreda] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  const fetchProblems = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/problems');
      if (res.ok) {
        const data = await res.json();
        setProblems(data);
      } else {
        toast.error("Failed to load problems");
      }
    } catch (e) {
      console.error(e);
      toast.error("Network error while fetching problems");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  const getStatusStyle = (status) => {
    if (status === 'Fixed') return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (status === 'Seen' || status === 'Seen by Supplier') return 'text-blue-600 bg-blue-50 border-blue-200';
    if (status === 'Pending Woreda' || status === 'Pending') return 'text-red-600 bg-red-50 border-red-200';
    if (status === 'Under Repair') return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-slate-600 bg-slate-50 border-slate-200';
  };

  // Derive unique options for filters
  const uniqueZones = [...new Set(problems.map(p => p.zone).filter(Boolean))];
  const uniqueWoredas = [...new Set(problems.map(p => p.woreda).filter(Boolean))];
  const uniqueStatuses = [...new Set(problems.map(p => p.status).filter(Boolean))];

  // Apply filters
  const filtered = problems.filter(p => {
    const matchesSearch = p.beneficiary_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.equipment?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesZone = filterZone === 'All' || p.zone === filterZone;
    const matchesWoreda = filterWoreda === 'All' || p.woreda === filterWoreda;
    const matchesStatus = filterStatus === 'All' || p.status === filterStatus;
    return matchesSearch && matchesZone && matchesWoreda && matchesStatus;
  });

  ;

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <AlertOctagon className="w-8 h-8 text-blue-600" />
            Problem Handlings Monitor
          </h2>
          <p className="text-slate-500 mt-2 max-w-2xl">
            Monitor equipment issues reported globally. Filter by zone, woreda, or status to narrow down your analysis.
          </p>
        </div>
        
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row gap-4 items-center justify-between">
          
          <div className="relative w-full md:max-w-md">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by beneficiary or equipment..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            <div className="flex flex-col gap-1 min-w-[120px]">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Zone</span>
              <select 
                value={filterZone}
                onChange={e => setFilterZone(e.target.value)}
                className="w-full bg-white border border-slate-200 text-slate-700 text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              >
                <option value="All">All Zones</option>
                {uniqueZones.map(z => <option key={z} value={z}>{z}</option>)}
              </select>
            </div>
            
            <div className="flex flex-col gap-1 min-w-[120px]">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Woreda</span>
              <select 
                value={filterWoreda}
                onChange={e => setFilterWoreda(e.target.value)}
                className="w-full bg-white border border-slate-200 text-slate-700 text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              >
                <option value="All">All Woredas</option>
                {uniqueWoredas.map(w => <option key={w} value={w}>{w}</option>)}
              </select>
            </div>

            <div className="flex flex-col gap-1 min-w-[120px]">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Status</span>
              <select 
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="w-full bg-white border border-slate-200 text-slate-700 text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              >
                <option value="All">All Statuses</option>
                {uniqueStatuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 font-semibold text-xs tracking-wider">
                <tr>
                  <th className="p-4 pl-6">BENEFICIARY</th>
                  <th className="p-4">EQUIPMENT</th>
                  <th className="p-4">LOCATION</th>
                  <th className="p-4">SUPPLIER</th>
                  <th className="p-4">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-12 text-center text-slate-500">
                      <AlertOctagon className="w-8 h-8 mx-auto text-slate-300 mb-3" />
                      <p className="text-base font-semibold text-slate-700">No problems found</p>
                      <p className="text-sm">Try adjusting your filters or search query.</p>
                    </td>
                  </tr>
                ) : filtered.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 pl-6 font-bold text-slate-800">{p.beneficiary_name}</td>
                    <td className="p-4 text-slate-600">{p.equipment}</td>
                    <td className="p-4 text-slate-500">
                      <div className="flex items-center gap-1.5 text-xs font-medium">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {p.zone} / {p.woreda}
                      </div>
                    </td>
                    <td className="p-4 text-slate-600 font-medium">{p.supplier || 'Not Assigned'}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(p.status)}`}>
                        {p.status}
                      </span>
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

export default ProblemHandlings;
