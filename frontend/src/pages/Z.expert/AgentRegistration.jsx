import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Search, UserPlus, Eye, X, Plus } from 'lucide-react';
import AgentDetailsModal from '../../components/AgentDetailsModal';

const AgentRegistration = ({ selectedZone }) => {
  const [agents, setAgents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [zoneFilter, setZoneFilter] = useState('');
  const [zonesList, setZonesList] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    zone_id: '',
    national_id: ''
  });

  const fetchAgents = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/agents');
      if (res.ok) setAgents(await res.json());
    } catch (e) {
      console.error('Failed to fetch agents', e);
    }
  };

  useEffect(() => {
    fetchAgents();
    fetch('http://localhost:8000/api/zones')
      .then(res => res.json())
      .then(data => {
        setZonesList(data);
        if (selectedZone) {
          const matched = data.find(z => z.name.toLowerCase().includes(selectedZone.toLowerCase()) || selectedZone.toLowerCase().includes(z.name.toLowerCase()));
          if (matched) {
            setFormData(prev => ({ ...prev, zone_id: matched.id }));
            setZoneFilter(String(matched.id));
          }
        }
      })
      .catch(console.error);
  }, [selectedZone]);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8000/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, zone_id: parseInt(formData.zone_id, 10) })
      });
      if (res.ok) {
        toast.success('Agent registered successfully');
        setShowForm(false);
        setFormData({ name: '', email: '', phone: '', national_id: '', zone_id: selectedZone ? formData.zone_id : '' });
        fetchAgents();
      } else {
        toast.error('Failed to register agent');
      }
    } catch (e) {
      console.error(e);
      toast.error('Error registering agent');
    }
  };

  const filteredAgents = agents.filter(a => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = a.name.toLowerCase().includes(term) || (a.phone || '').includes(term) || (a.email || '').toLowerCase().includes(term);
    const matchesZone = zoneFilter ? a.zone_id === Number(zoneFilter) : true;
    return matchesSearch && matchesZone;
  });

  const getInitials = (name) => {
    const parts = name.split(' ');
    if (parts.length > 1) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Agent Management</h2>
          <p className="text-slate-500 mt-1">{filteredAgents.length} registered agents{selectedZone ? ` in ${selectedZone}` : ''}</p>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-500/30 transition-all active:scale-95">
            <Plus className="w-5 h-5" /> Register Agent
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-8 mb-8">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <UserPlus className="w-6 h-6 text-blue-500" /> Register New Agent
            </h3>
            <button onClick={() => setShowForm(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full">
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleRegister} className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Full Name *</label>
              <input type="text" required className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Phone *</label>
              <input type="text" required className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Email *</label>
              <input type="email" required className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">National ID *</label>
              <input type="text" required className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none" value={formData.national_id} onChange={(e) => setFormData({ ...formData, national_id: e.target.value })} />
            </div>
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-semibold text-slate-700">Zone *</label>
              <select required disabled={!!selectedZone} className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white disabled:bg-slate-100" value={formData.zone_id} onChange={(e) => setFormData({ ...formData, zone_id: e.target.value })}>
                <option value="">Select Zone</option>
                {zonesList.map(z => <option key={z.id} value={z.id}>{z.name}</option>)}
              </select>
            </div>
            <div className="col-span-2 flex gap-3 pt-4 border-t border-slate-100">
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl">Register Agent</button>
              <button type="button" onClick={() => setShowForm(false)} className="text-slate-500 font-semibold py-3 px-6 hover:bg-slate-100 rounded-xl">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search agents..." className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <select className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700" value={zoneFilter} onChange={(e) => setZoneFilter(e.target.value)}>
            <option value="">All Zones</option>
            {zonesList.map(z => <option key={z.id} value={z.id}>{z.name}</option>)}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-semibold text-xs tracking-wider">
              <tr>
                <th className="p-4">Agent</th>
                <th className="p-4">Zone</th>
                <th className="p-4">Contact</th>
                <th className="p-4 text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredAgents.length === 0 ? (
                <tr><td colSpan="4" className="p-8 text-center text-slate-500">No agents found.</td></tr>
              ) : filteredAgents.map((agent) => (
                <tr key={agent.id} className="hover:bg-slate-50/50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center shrink-0">{getInitials(agent.name)}</div>
                      <div>
                        <div className="font-bold text-slate-800">{agent.name}</div>
                        <div className="text-xs text-slate-400 font-mono">{agent.national_id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-slate-800 font-medium">{agent.zone_name || `Zone ${agent.zone_id}`}</td>
                  <td className="p-4">
                    <div className="text-slate-600">{agent.phone}</div>
                    <div className="text-xs text-slate-400">{agent.email}</div>
                  </td>
                  <td className="p-4 text-center">
                    <button onClick={() => setSelectedAgent(agent)} className="p-2 text-blue-500 hover:bg-blue-50 border border-slate-200 rounded-lg" title="View details">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedAgent && <AgentDetailsModal agent={selectedAgent} onClose={() => setSelectedAgent(null)} />}
    </div>
  );
};

export default AgentRegistration;
