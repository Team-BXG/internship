import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Search, AlertOctagon, CheckCircle2, Wrench, ChevronRight, X, Calendar, Download } from 'lucide-react';
import Papa from 'papaparse';

const ProblemHandlings = ({ selectedScope }) => {
  const [problems, setProblems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [activeProblem, setActiveProblem] = useState(null);
  const [fixedDate, setFixedDate] = useState('');

  const fetchProblems = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/problems');
      if (res.ok) {
        const data = await res.json();
        const filtered = data.filter(p =>
          p.woreda === selectedScope.woreda &&
          p.zone === selectedScope.zone
        );
        setProblems(filtered);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, [selectedScope]);

  const handleFixSubmit = async () => {
    if (!fixedDate) {
      toast.error('Please provide a fixed date');
      return;
    }

    try {
      const res = await fetch(`http://localhost:8000/api/problems/${activeProblem.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Fixed', fixed_date: new Date(fixedDate).toISOString(), submitted_by: 'Woreda Encoder' })
      });
      if (res.ok) {
        toast.success("Problem marked as Fixed!");
        setActiveProblem(null);
        setFixedDate('');
        fetchProblems();
      } else {
        toast.error("Failed to update status");
      }
    } catch (e) {
      console.error(e);
      toast.error("Error updating status");
    }
  };

  const getStatusStyle = (status) => {
    if (status === 'Seen') return 'text-blue-600 bg-blue-50 border-blue-200';
    if (status === 'Pending Woreda') return 'text-red-600 bg-red-50 border-red-200';
    if (status === 'Correction Needed') return 'text-rose-600 bg-rose-50 border-rose-200';
    if (status === 'Under Repair') return 'text-orange-600 bg-orange-50 border-orange-200';
    if (status === 'Fixed') return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    return 'text-slate-600 bg-slate-50 border-slate-200';
  };

  const filtered = problems.filter(p => {
    const matchSearch = p.beneficiary_name?.toLowerCase().includes(searchQuery.toLowerCase()) || p.equipment?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'All Status' ? true : p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const uniqueStatuses = [...new Set(problems.map(p => p.status).filter(Boolean))];

  ;

  const exportToCSV = () => {
    if (filtered.length === 0) {
      toast.error("No data to export");
      return;
    }
    const dataToExport = filtered.map(p => ({
      Beneficiary: p.beneficiary_name,
      Equipment: p.equipment,
      Supplier: p.supplier || 'Not Assigned',
      Status: p.status
    }));
    const csv = Papa.unparse(dataToExport);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Problem_Handlings_${selectedScope.woreda}.csv`;
    link.click();
  };

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Problem Handlings</h2>
        <p className="text-slate-500 mt-1">Track and finalize equipment issues resolved by suppliers in {selectedScope.woreda}</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="relative max-w-md flex-1">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by beneficiary or equipment..."
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <select
              className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium text-slate-700"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All Status">All Status</option>
              {uniqueStatuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-4 py-3 bg-white text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-semibold border border-slate-200"
            >
              <Download className="w-4 h-4" />
              CSV
            </button>

          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-semibold text-xs tracking-wider">
              <tr>
                <th className="p-4 pl-6">BENEFICIARY</th>
                <th className="p-4">EQUIPMENT</th>
                <th className="p-4">SUPPLIER</th>
                <th className="p-4">STATUS</th>
                <th className="p-4 text-center">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-500">No active problems to handle.</td>
                </tr>
              ) : filtered.map(p => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 pl-6 font-bold text-slate-800">{p.beneficiary_name}</td>
                  <td className="p-4 text-slate-600">{p.equipment}</td>
                  <td className="p-4 text-slate-600">{p.supplier || 'Not Assigned'}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(p.status)}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    {p.status !== 'Fixed' && (
                      <button
                        onClick={() => setActiveProblem(p)}
                        className="px-4 py-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 font-bold rounded-lg transition-colors inline-flex items-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Finalize Fix
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {activeProblem && (
        <div className="fixed inset-0 bg-white/40 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-800">Finalize Fix</h3>
              <button onClick={() => setActiveProblem(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-blue-50 p-4 rounded-xl text-sm text-blue-800">
                You are marking the issue for <strong>{activeProblem.beneficiary_name}</strong>'s <strong>{activeProblem.equipment}</strong> as fully fixed.
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Date Fixed *</label>
                <div className="relative">
                  <Calendar className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="date"
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={fixedDate}
                    onChange={e => setFixedDate(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
              <button onClick={() => setActiveProblem(null)} className="px-5 py-2.5 text-slate-600 font-semibold hover:bg-slate-200 rounded-xl transition-colors">
                Cancel
              </button>
              <button onClick={handleFixSubmit} className="px-5 py-2.5 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition-colors shadow-md shadow-emerald-500/20">
                Confirm Fixed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProblemHandlings;
