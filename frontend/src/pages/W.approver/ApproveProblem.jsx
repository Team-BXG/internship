import React, { useState, useEffect } from 'react';
import { Search, AlertOctagon, Wrench, CheckCircle2, FileText, Eye } from 'lucide-react';
import ProblemDetailsModal from '../../components/ProblemDetailsModal';

const ApproveProblem = ({ selectedScope }) => {
  const [problems, setProblems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [activeProblem, setActiveProblem] = useState(null);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [adjustmentComment, setAdjustmentComment] = useState('');
  const [problemToAdjust, setProblemToAdjust] = useState(null);

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/problems`);
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
      const res = await fetch(`http://localhost:8000/api/problems/${problem.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          ...(adjustmentComment && { details_json: JSON.stringify({ adjustment_comments: adjustmentComment }) })
        })
      });
      if (res.ok) {
        setActiveProblem(null);
        setShowAdjustModal(false);
        setAdjustmentComment('');
        setProblemToAdjust(null);
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
    open: filtered.filter(p => p.status === 'Open').length,
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

  const getActionConfig = (problem) => {
    if (problem?.status !== 'Open') return [];
    return [
      { label: 'Approve Problem', className: 'bg-emerald-500 hover:bg-emerald-600 text-white', onClick: (p) => handleStatusUpdate(p, 'Approved') },
      { label: 'Return for Correction', className: 'bg-amber-500 hover:bg-amber-600 text-white', keepOpen: true, onClick: (p) => { setProblemToAdjust(p); setShowAdjustModal(true); } }
    ];
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-slate-800">Equipment Issues</h3>
        <p className="text-slate-500 mt-1">Equipment non-functionality in {selectedScope.zone} / {selectedScope.woreda}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-8">
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
            <h2 className="text-3xl font-bold text-blue-600 mt-1">{stats.approved}</h2>
            <p className="text-slate-500 font-medium text-sm mt-2">Approved</p>
          </div>
        </div>
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
          <div className="flex flex-col justify-between">
            <h2 className="text-3xl font-bold text-purple-600 mt-1">{stats.seen}</h2>
            <p className="text-slate-500 font-medium text-sm mt-2">Seen</p>
          </div>
        </div>
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
          <div className="flex flex-col justify-between">
            <h2 className="text-3xl font-bold text-emerald-600 mt-1">{stats.fixed}</h2>
            <p className="text-slate-500 font-medium text-sm mt-2">Fixed</p>
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
                      <button onClick={() => setActiveProblem(p)} className="ml-2 p-2 text-slate-400 hover:text-blue-500 rounded-lg transition-colors" title="View Details">
                        <Eye className="w-5 h-5" />
                      </button>
                      {p.status === 'Open' && (
                        <>
                          <button onClick={() => handleStatusUpdate(p, 'Approved')} className="px-2 py-1 bg-emerald-500 text-white rounded-lg text-xs font-bold hover:bg-emerald-600">Approve</button>
                          <button onClick={() => { setProblemToAdjust(p); setShowAdjustModal(true); }} className="px-2 py-1 bg-amber-500 text-white rounded-lg text-xs font-bold hover:bg-amber-600">Correction</button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {activeProblem && !showAdjustModal && (
        <ProblemDetailsModal
          problem={activeProblem}
          onClose={() => setActiveProblem(null)}
          actionConfig={getActionConfig(activeProblem)}
        />
      )}

      {showAdjustModal && problemToAdjust && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xl font-bold text-slate-800">Request Adjustment</h4>
              <button
                onClick={() => { setShowAdjustModal(false); setProblemToAdjust(null); }}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <div className="w-5 h-5 flex items-center justify-center text-slate-500 font-bold text-xl leading-none">&times;</div>
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-slate-600 mb-2">
                Request adjustment for: <span className="font-semibold">{problemToAdjust.equipment} ({problemToAdjust.beneficiary_name})</span>
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-700 block mb-2">
                  Adjustment Comments *
                </label>
                <textarea
                  className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={4}
                  placeholder="Describe what needs to be adjusted..."
                  value={adjustmentComment}
                  onChange={(e) => setAdjustmentComment(e.target.value)}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleStatusUpdate(problemToAdjust, 'Correction Needed')}
                  className="flex-1 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors flex items-center justify-center gap-2"
                >
                  Send Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApproveProblem;
