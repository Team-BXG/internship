import React, { useState, useEffect } from 'react';
import { Users, AlertTriangle, CheckCircle, Package, UserCheck, Activity } from 'lucide-react';

export default function ZoneDashboard({ selectedZone }) {
  const [stats, setStats] = useState({
    beneficiaries: 0,
    demands: 0,
    problems: 0,
    agents: 0
  });
  
  const [recentBeneficiaries, setRecentBeneficiaries] = useState([]);
  const [recentProblems, setRecentProblems] = useState([]);
  const [recentAgents, setRecentAgents] = useState([]);

  useEffect(() => {
    if (!selectedZone) return;

    const lowerZone = selectedZone.toLowerCase();
    const matchesZoneStr = (name) => {
      if (!name) return false;
      const lowerName = name.toLowerCase();
      return lowerName.includes(lowerZone) || lowerZone.includes(lowerName);
    };

    // Fetch Beneficiaries
    fetch('http://localhost:8000/api/beneficiaries?approved_only=true')
      .then(res => res.json())
      .then(data => {
        const zoneBens = data.filter(b => matchesZoneStr(b.zone) || matchesZoneStr(b.zone_name));
        setStats(prev => ({ ...prev, beneficiaries: zoneBens.length }));
        setRecentBeneficiaries(zoneBens.slice(0, 5));
      })
      .catch(console.error);

    // Fetch Demands
    fetch('http://localhost:8000/api/demands?approved_only=true')
      .then(res => res.json())
      .then(data => {
        const zoneDemands = data.filter(d => matchesZoneStr(d.zone) || matchesZoneStr(d.zone_name));
        setStats(prev => ({ ...prev, demands: zoneDemands.length }));
      })
      .catch(console.error);

    // Fetch Problems
    fetch('http://localhost:8000/api/problems?approved_only=true')
      .then(res => res.json())
      .then(data => {
        const zoneProblems = data.filter(p => matchesZoneStr(p.zone) || matchesZoneStr(p.zone_name));
        setStats(prev => ({ ...prev, problems: zoneProblems.length }));
        setRecentProblems(zoneProblems.slice(0, 5));
      })
      .catch(console.error);

    // Fetch Agents
    fetch('http://localhost:8000/api/agents')
      .then(res => res.json())
      .then(data => {
        const zoneAgents = data.filter(a => matchesZoneStr(a.zone_name));
        setStats(prev => ({ ...prev, agents: zoneAgents.length }));
        setRecentAgents(zoneAgents.slice(0, 5));
      })
      .catch(console.error);
  }, [selectedZone]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto space-y-8">
      {/* Header card with gradient background */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-indigo-800 rounded-3xl p-8 text-white shadow-xl shadow-blue-500/10 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full -translate-y-20 translate-x-20 blur-2xl pointer-events-none" />
        <div className="relative z-10">
          <span className="bg-white/20 text-white font-bold text-xs uppercase tracking-wider px-3 py-1 rounded-full backdrop-blur-md">
            Operational Overview
          </span>
          <h2 className="text-4xl font-extrabold mt-4 tracking-tight">Zone Expert Dashboard</h2>
          <p className="text-blue-100 mt-2 font-medium text-lg">
            Overseeing energy distribution and issues in the <span className="font-bold text-white underline decoration-emerald-400 decoration-2 underline-offset-4">{selectedZone}</span> area.
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Beneficiaries', value: stats.beneficiaries, color: 'text-blue-600', bg: 'bg-blue-50/50 hover:bg-blue-50', icon: Users, iconBg: 'bg-blue-100 text-blue-600' },
          { label: 'Total Demands', value: stats.demands, color: 'text-purple-600', bg: 'bg-purple-50/50 hover:bg-purple-50', icon: Package, iconBg: 'bg-purple-100 text-purple-600' },
          { label: 'Active Agents', value: stats.agents, color: 'text-emerald-600', bg: 'bg-emerald-50/50 hover:bg-emerald-50', icon: UserCheck, iconBg: 'bg-emerald-100 text-emerald-600' },
          { label: 'Reported Problems', value: stats.problems, color: 'text-rose-600', bg: 'bg-rose-50/50 hover:bg-rose-50', icon: AlertTriangle, iconBg: 'bg-rose-100 text-rose-600' }
        ].map((card, i) => (
          <div 
            key={i} 
            className={`p-6 rounded-2xl bg-white border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 flex items-center justify-between group`}
          >
            <div>
              <p className={`text-4xl font-black ${card.color} tracking-tight transition-transform duration-300 group-hover:scale-105 origin-left`}>
                {card.value}
              </p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1.5">{card.label}</p>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${card.iconBg}`}>
              <card.icon className="w-6 h-6" />
            </div>
          </div>
        ))}
      </div>

      {/* Grid of details lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Beneficiaries */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden lg:col-span-2">
          <div className="p-6 border-b border-slate-50 bg-slate-50/40 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" /> Recent Beneficiary Registrations
            </h3>
            <span className="text-xs font-semibold text-slate-400">Latest 5</span>
          </div>
          <div className="divide-y divide-slate-100">
            {recentBeneficiaries.length === 0 ? (
              <div className="p-8 text-center text-slate-400 font-medium">No beneficiaries registered yet.</div>
            ) : recentBeneficiaries.map(b => (
              <div key={b.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                <div>
                  <p className="font-bold text-slate-800">{b.full_name}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {b.equipment_type} • <span className="font-semibold text-slate-700">{b.woreda}</span>, Kebele {b.kebele}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${
                  b.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                  b.status === 'Correction Needed' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                  'bg-blue-50 text-blue-700 border-blue-200'
                }`}>
                  {b.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Active Agents list */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-50 bg-slate-50/40 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-emerald-600" /> Zone Agents
            </h3>
            <span className="text-xs font-semibold text-slate-400">Latest 5</span>
          </div>
          <div className="divide-y divide-slate-100">
            {recentAgents.length === 0 ? (
              <div className="p-8 text-center text-slate-400 font-medium">No agents registered.</div>
            ) : recentAgents.map(a => (
              <div key={a.id} className="p-4 flex items-center gap-3 hover:bg-slate-50/50 transition-colors">
                <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center shrink-0 text-sm">
                  {a.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-800 truncate">{a.name}</p>
                  <p className="text-xs text-slate-500 truncate">{a.phone}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border uppercase ${
                  a.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'
                }`}>
                  {a.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Problems list */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden lg:col-span-3">
          <div className="p-6 border-b border-slate-50 bg-slate-50/40 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-500" /> Recent Reported Problems
            </h3>
            <span className="text-xs font-semibold text-slate-400">Latest 5</span>
          </div>
          <div className="divide-y divide-slate-100">
            {recentProblems.length === 0 ? (
              <div className="p-8 text-center text-slate-400 font-medium">No problems reported.</div>
            ) : recentProblems.map(p => (
              <div key={p.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                <div>
                  <p className="font-bold text-slate-800">{p.title}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {p.equipment} • Woreda: <span className="font-semibold text-slate-700">{p.woreda}</span> • Serial: {p.serial_number}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                    p.urgency === 'High' ? 'bg-rose-100 text-rose-800' :
                    p.urgency === 'Medium' ? 'bg-amber-100 text-amber-800' :
                    'bg-slate-100 text-slate-800'
                  }`}>
                    {p.urgency} Urgency
                  </span>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase ${
                    p.status === 'Resolved' || p.status === 'Fixed' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-rose-50 text-rose-600 border-rose-200'
                  }`}>
                    {p.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
