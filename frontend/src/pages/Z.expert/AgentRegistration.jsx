import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Search, UserPlus, Info, Check, X, Shield, Plus } from 'lucide-react';

const AgentRegistration = ({ selectedZone }) => {
  const [agents, setAgents] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, served: 0 });
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [zoneFilter, setZoneFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [zonesList, setZonesList] = useState([]);
  
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
      if (res.ok) {
        const data = await res.json();
        setAgents(data);
        
        // Calculate stats
        const active = data.filter(a => a.status === 'Active').length;
        const served = data.reduce((acc, curr) => acc + (curr.served || 0), 0);
        setStats({ total: data.length, active, served });
      }
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
      const payload = {
        ...formData,
        zone_id: parseInt(formData.zone_id, 10)
      };
      
      const res = await fetch('http://localhost:8000/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        toast.success('Agent Registered Successfully!');
        setShowForm(false);
        setFormData(prev => ({
          name: '',
          email: '',
          phone: '',
          national_id: '',
          zone_id: selectedZone ? prev.zone_id : ''
        }));
        fetchAgents();
      } else {
        toast.error('Failed to register agent.');
      }
    } catch (e) {
      console.error(e);
      toast.error('Error registering agent.');
    }
  };

  const getStatusColor = (status) => {
    return status === 'Active' ? 'text-emerald-500 bg-emerald-50 border-emerald-200' : 'text-red-500 bg-red-50 border-red-200';
  };

  const filteredAgents = agents.filter(a => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = a.name.toLowerCase().includes(term) || (a.phone || '').includes(term);
    const matchesZone = zoneFilter ? a.zone_id === Number(zoneFilter) : true;
    const matchesStatus = statusFilter ? a.status === statusFilter : true;
    return matchesSearch && matchesZone && matchesStatus;
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
          <p className="text-slate-500 mt-1">{filteredAgents.length} registered agents in {selectedZone}</p>
        </div>
        {!showForm && (
          <button 
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-500/30 transition-all active:scale-95"
          >
            <Plus className="w-5 h-5" /> Register Agent
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-3xl font-black text-blue-600">{stats.total}</p>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mt-1">Total Agents</p>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center">
            <UserPlus className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-3xl font-black text-emerald-500">{stats.active}</p>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mt-1">Active</p>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center">
            <Check className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-3xl font-black text-purple-600">{stats.served}</p>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mt-1">Total Served</p>
          </div>
          <div className="w-12 h-12 bg-purple-50 text-purple-500 rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6" />
          </div>
        </div>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-8 mb-8 animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <UserPlus className="w-6 h-6 text-blue-500" /> Register New Agent
            </h3>
            <button onClick={() => setShowForm(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleRegister} className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Full Name *</label>
              <input 
                type="text" required placeholder="Agent full name"
                className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Phone *</label>
              <input 
                type="text" required placeholder="+251 9..."
                className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Email *</label>
              <input 
                type="email" required placeholder="agent@sedms.et"
                className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">National ID *</label>
              <input 
                type="text" required placeholder="ET-AG-0000"
                className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={formData.national_id} onChange={(e) => setFormData({...formData, national_id: e.target.value})}
              />
            </div>
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-semibold text-slate-700">Zone *</label>
              <select 
                required
                disabled={!!selectedZone}
                className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white disabled:bg-slate-100 disabled:text-slate-500"
                value={formData.zone_id} onChange={(e) => setFormData({...formData, zone_id: e.target.value})}
              >
                <option value="">Select Zone</option>
                {zonesList.map(z => <option key={z.id} value={z.id}>{z.name}</option>)}
              </select>
            </div>
            <div className="col-span-2 flex items-center gap-3 pt-4 border-t border-slate-100">
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-md transition-colors active:scale-95">
                Register Agent
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="text-slate-500 font-semibold py-3 px-6 hover:bg-slate-100 rounded-xl transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search agents..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3">
            <select 
              className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium text-slate-700"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-semibold text-xs tracking-wider">
              <tr>
                <th className="p-4">AGENT</th>
                <th className="p-4">ZONE AREA</th>
                <th className="p-4">CONTACT</th>
                <th className="p-4">PERFORMANCE</th>
                <th className="p-4">SERVED</th>
                <th className="p-4">STATUS</th>
                <th className="p-4 text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredAgents.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-500">
                    No agents found matching your criteria.
                  </td>
                </tr>
              ) : filteredAgents.map((agent) => (
                <tr key={agent.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center shrink-0">
                      {getInitials(agent.name)}
                    </div>
                    <div>
                      <div className="font-bold text-slate-800">{agent.name}</div>
                      <div className="text-xs text-slate-400 font-mono">{agent.national_id || `AG-${String(agent.id).padStart(3, '0')}`}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-slate-800 font-medium">{agent.zone_name || 'Zone ' + agent.zone_id}</div>
                    <div className="text-xs text-slate-400">Assigned</div>
                  </td>
                  <td className="p-4">
                    <div className="text-slate-600">{agent.phone}</div>
                    <div className="text-xs text-slate-400">{agent.email}</div>
                  </td>
                  <td className="p-4">
                     <div className="flex items-center gap-2">
                       <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden w-24">
                         <div className={`h-full rounded-full ${agent.performance >= 80 ? 'bg-emerald-500' : agent.performance >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${agent.performance || 0}%` }}></div>
                       </div>
                       <span className="font-bold text-slate-700">{agent.performance || 0}</span>
                     </div>
                  </td>
                  <td className="p-4 font-bold text-slate-700">{agent.served || 0}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getStatusColor(agent.status)}`}>
                      {agent.status}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button className="p-2 text-slate-400 hover:text-blue-500 bg-white hover:bg-blue-50 border border-slate-200 rounded-lg transition-colors">
                      <Info className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AgentRegistration;
