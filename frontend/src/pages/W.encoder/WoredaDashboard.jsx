import React, { useState, useEffect } from 'react';
import { Users, AlertTriangle, CheckCircle, Package } from 'lucide-react';

const getStatusStyle = (status, type) => {
  if (type === 'problem') {
    if (status === 'Fixed') return 'bg-emerald-50 text-emerald-600 border-emerald-200';
    if (status === 'Seen') return 'bg-blue-50 text-blue-600 border-blue-200';
    if (status === 'Approved') return 'bg-purple-50 text-purple-600 border-purple-200';
    if (status === 'Open') return 'bg-amber-50 text-amber-600 border-amber-200';
    if (status === 'Correction Needed') return 'bg-rose-50 text-rose-600 border-rose-200';
  } else {
    if (status === 'Approved') return 'bg-emerald-50 text-emerald-600 border-emerald-200';
    if (status === 'Pending') return 'bg-amber-50 text-amber-600 border-amber-200';
    if (status === 'Correction Needed') return 'bg-rose-50 text-rose-600 border-rose-200';
    if (status === 'Assigned' || status === 'Beneficiary') return 'bg-blue-50 text-blue-600 border-blue-200';
  }
  return 'bg-slate-50 text-slate-600 border-slate-200';
};

export default function WoredaDashboard({ selectedScope }) {
  const [stats, setStats] = useState({
    beneficiaries: 0,
    demands: 0,
    problems: 0,
    assignedDemands: 0,
    pendingBeneficiaries: 0,
    pendingDemands: 0,
    openProblems: 0
  });

  const [recentBeneficiaries, setRecentBeneficiaries] = useState([]);
  const [recentDemands, setRecentDemands] = useState([]);
  const [recentProblems, setRecentProblems] = useState([]);
  const [activeTab, setActiveTab] = useState('beneficiaries');

  useEffect(() => {
    fetch((import.meta.env.VITE_API_URL || 'http://localhost:8000') + '/api/beneficiaries')
      .then(res => res.json())
      .then(data => {
        const woredaBens = data.filter(b => b.zone === selectedScope.zone && b.woreda === selectedScope.woreda);
        setStats(prev => ({
          ...prev,
          beneficiaries: woredaBens.length,
          pendingBeneficiaries: woredaBens.filter(b => b.status === 'Pending').length
        }));
        setRecentBeneficiaries(woredaBens.slice(0, 5));
      })
      .catch(console.error);

    fetch((import.meta.env.VITE_API_URL || 'http://localhost:8000') + '/api/demands')
      .then(res => res.json())
      .then(data => {
        const woredaDemands = data.filter(d => d.zone === selectedScope.zone && d.woreda === selectedScope.woreda);
        const assigned = woredaDemands.filter(d => d.status === 'Assigned').length;
        setStats(prev => ({
          ...prev,
          demands: woredaDemands.length,
          assignedDemands: assigned,
          pendingDemands: woredaDemands.filter(d => d.status === 'Pending').length
        }));
        setRecentDemands(woredaDemands.slice(0, 5));
      })
      .catch(console.error);

    fetch((import.meta.env.VITE_API_URL || 'http://localhost:8000') + '/api/problems')
      .then(res => res.json())
      .then(data => {
        const woredaProblems = data.filter(p => p.zone === selectedScope.zone && p.woreda === selectedScope.woreda);
        setStats(prev => ({
          ...prev,
          problems: woredaProblems.length,
          openProblems: woredaProblems.filter(p => p.status === 'Open').length
        }));
        setRecentProblems(woredaProblems.slice(0, 5));
      })
      .catch(console.error);
  }, [selectedScope]);

  const tabs = [
    { id: 'beneficiaries', label: 'Beneficiaries', icon: Users, data: recentBeneficiaries },
    { id: 'demands', label: 'Demands', icon: Package, data: recentDemands },
    { id: 'problems', label: 'Problems', icon: AlertTriangle, data: recentProblems }
  ];

  const activeList = tabs.find(t => t.id === activeTab)?.data || [];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-slate-800">Woreda Dashboard</h2>
        <p className="text-slate-500 mt-2 font-medium">
          Overview of operations in <span className="font-bold text-blue-600">{selectedScope.woreda}</span>, {selectedScope.zone}.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-3xl font-black text-blue-600">{stats.beneficiaries}</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Beneficiaries</p>
            <p className="text-[10px] text-amber-600 font-semibold mt-1">{stats.pendingBeneficiaries} pending</p>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-3xl font-black text-purple-600">{stats.demands}</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Total Demands</p>
            <p className="text-[10px] text-amber-600 font-semibold mt-1">{stats.pendingDemands} pending</p>
          </div>
          <div className="w-12 h-12 bg-purple-50 text-purple-500 rounded-xl flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-3xl font-black text-emerald-500">{stats.assignedDemands}</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Assigned Demands</p>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-3xl font-black text-rose-500">{stats.problems}</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Reported Problems</p>
            <p className="text-[10px] text-amber-600 font-semibold mt-1">{stats.openProblems} open</p>
          </div>
          <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center gap-4">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                Recent {tab.label}
              </button>
            );
          })}
        </div>

        <div className="divide-y divide-slate-100">
          {activeList.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              No {activeTab} registered yet.
            </div>
          ) : activeTab === 'beneficiaries' ? activeList.map(b => (
            <div key={b.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div>
                <p className="font-bold text-slate-800">{b.full_name}</p>
                <p className="text-xs text-slate-500 mt-1">{b.equipment_type} • Kebele {b.kebele}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase ${getStatusStyle(b.status)}`}>
                {b.status}
              </span>
            </div>
          )) : activeTab === 'demands' ? activeList.map(d => (
            <div key={d.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div>
                <p className="font-bold text-slate-800">{d.full_name}</p>
                <p className="text-xs text-slate-500 mt-1">{d.solar_panel_type} • {d.watt_level} • Kebele {d.kebele}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase ${getStatusStyle(d.status)}`}>
                {d.status}
              </span>
            </div>
          )) : activeList.map(p => (
            <div key={p.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div>
                <p className="font-bold text-slate-800">{p.title}</p>
                <p className="text-xs text-slate-500 mt-1">{p.equipment} • Kebele {p.kebele}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase ${getStatusStyle(p.status, 'problem')}`}>
                {p.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
