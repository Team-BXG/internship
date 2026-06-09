import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { 
  Zap, MapPin, Users, TrendingUp, PieChart, 
  Filter, Search, ChevronDown, Download, Eye, Globe,
  Activity, Target, Award, UserCheck
} from 'lucide-react';
const DemandStatistics = () => {
  const [demands, setDemands] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [zoneFilter, setZoneFilter] = useState('');
  const [woredaFilter, setWoredaFilter] = useState('');
  const [solarTypeFilter, setSolarTypeFilter] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Modal State
  const [assignModalData, setAssignModalData] = useState(null);
  const [selectedSupplierId, setSelectedSupplierId] = useState('');
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [demandsRes, suppliersRes] = await Promise.all([
        fetch((import.meta.env.VITE_API_URL || 'http://localhost:8000') + '/api/demands?approved_only=true'),
        fetch((import.meta.env.VITE_API_URL || 'http://localhost:8000') + '/api/suppliers')
      ]);
      
      if (demandsRes.ok) {
        const d = await demandsRes.json();
        setDemands(Array.isArray(d) ? d : []);
      }
      
      if (suppliersRes.ok) {
        const s = await suppliersRes.json();
        setSuppliers(Array.isArray(s) ? s : []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const assignSupplier = async () => {
    if (!selectedSupplierId || !assignModalData) return;
    try {
      setAssigning(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL || (import.meta.env.VITE_API_URL || "http://localhost:8000")}/api/demands/${assignModalData.id}/assign`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ supplier_id: parseInt(selectedSupplierId) })
      });
      if (res.ok) {
        toast.success("Supplier assigned successfully!");
        setAssignModalData(null);
        setSelectedSupplierId('');
        fetchData(); // Refresh list
      } else {
        toast.error("Failed to assign supplier.");
      }
    } catch (e) {
      console.error("Assign error", e);
    } finally {
      setAssigning(false);
    }
  };

  const getUnique = (field) => {
    return [...new Set(demands.map(d => d[field]).filter(Boolean))];
  };

  const filteredDemands = demands.filter(d => {
    if (d.status === 'Pending Woreda Review') return false;
    const matchesSearch = !searchTerm || 
      d.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.zone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.woreda?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch &&
      (!zoneFilter || d.zone === zoneFilter) &&
      (!woredaFilter || d.woreda === woredaFilter) &&
      (!solarTypeFilter || d.solar_panel_type === solarTypeFilter) &&
      (!genderFilter || d.gender === genderFilter) &&
      (!statusFilter || d.status === statusFilter);
  });

  // Aggregations
  const totalDemands = filteredDemands.length;
  const maleCount = filteredDemands.filter(d => d.gender === 'Male').length;
  const femaleCount = filteredDemands.filter(d => d.gender === 'Female').length;
  const disabledCount = filteredDemands.filter(d => d.has_disability === 'Yes' || d.has_disability === 'yes').length;
  const elderlyCount = filteredDemands.filter(d => d.elderly_count === 'Yes' || d.elderly_count === 'yes').length;
  
  const getDemandsByStatus = () => {
    const statusData = {};
    filteredDemands.forEach(d => {
      statusData[d.status] = (statusData[d.status] || 0) + 1;
    });
    return statusData;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending Woreda Review': return 'bg-amber-100 text-amber-800';
      case 'Assigned': return 'bg-emerald-100 text-emerald-800';
      case 'Beneficiary': return 'bg-purple-100 text-purple-800';
      case 'Needs Adjustment': return 'bg-red-100 text-red-800';
      case 'Zone Approved': return 'bg-blue-100 text-blue-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  ;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-slate-800">Demand Statistics & Approvals</h3>
          <p className="text-slate-500">View demographic aggregations and assign suppliers to individual demands</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={fetchData}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Activity className="w-4 h-4" /> Refresh Data
          </button>
          
        </div>
      </div>

      {/* Aggregation Cards */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-600 mb-1">Total Demands</p>
          <p className="text-3xl font-bold text-slate-900">{totalDemands}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-600 mb-1">Gender Distribution</p>
          <p className="text-lg font-bold text-slate-900">M: {maleCount} / F: {femaleCount}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-600 mb-1">Disabled Beneficiaries</p>
          <p className="text-3xl font-bold text-slate-900">{disabledCount}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-600 mb-1">Elderly Presence</p>
          <p className="text-3xl font-bold text-slate-900">{elderlyCount}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex gap-4 items-center flex-wrap">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search details..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select className="px-4 py-2 border border-slate-200 rounded-lg bg-white" value={zoneFilter} onChange={(e) => setZoneFilter(e.target.value)}>
          <option value="">All Zones</option>
          {getUnique('zone').map(z => <option key={z} value={z}>{z}</option>)}
        </select>
        <select className="px-4 py-2 border border-slate-200 rounded-lg bg-white" value={woredaFilter} onChange={(e) => setWoredaFilter(e.target.value)}>
          <option value="">All Woredas</option>
          {getUnique('woreda').map(w => <option key={w} value={w}>{w}</option>)}
        </select>
        <select className="px-4 py-2 border border-slate-200 rounded-lg bg-white" value={genderFilter} onChange={(e) => setGenderFilter(e.target.value)}>
          <option value="">All Genders</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <select className="px-4 py-2 border border-slate-200 rounded-lg bg-white" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          {getUnique('status').map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Main Demands Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            <h4 className="font-semibold text-slate-800">Individual Demands</h4>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left p-3 text-sm font-semibold text-slate-700">Name</th>
                <th className="text-left p-3 text-sm font-semibold text-slate-700">Location (Zone/Woreda)</th>
                <th className="text-left p-3 text-sm font-semibold text-slate-700">Demographics</th>
                <th className="text-left p-3 text-sm font-semibold text-slate-700">Equipment</th>
                <th className="text-left p-3 text-sm font-semibold text-slate-700">Status</th>
                <th className="text-center p-3 text-sm font-semibold text-slate-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredDemands.map((demand, index) => (
                <tr key={demand.id || index} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-3">
                    <p className="text-sm font-bold text-slate-800">{demand.full_name}</p>
                    <p className="text-xs text-slate-500">{demand.phone}</p>
                  </td>
                  <td className="p-3">
                    <p className="text-sm text-slate-800">{demand.zone}</p>
                    <p className="text-xs text-slate-500">{demand.woreda}</p>
                  </td>
                  <td className="p-3 text-xs text-slate-600 space-y-1">
                    <p>Gen: {demand.gender}</p>
                    <p>Disabled: {demand.has_disability?.toLowerCase() === 'yes' ? 'Yes' : 'No'}</p>
                    <p>Elderly: {demand.elderly_count?.toLowerCase() === 'yes' ? 'Yes' : 'No'}</p>
                  </td>
                  <td className="p-3">
                    <p className="text-sm text-slate-800">{demand.solar_panel_type}</p>
                    <p className="text-xs font-semibold text-blue-600">{demand.watt_level}</p>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(demand.status)}`}>
                      {demand.status}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    {!['Assigned', 'Beneficiary'].includes(demand.status) && (
                      <button 
                        onClick={() => setAssignModalData(demand)}
                        className="px-3 py-1.5 text-xs font-bold bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        Assign Supplier
                      </button>
                    )}
                    {['Assigned', 'Beneficiary'].includes(demand.status) && (
                      <span className="text-xs font-bold text-emerald-600 flex items-center justify-center gap-1">
                        <UserCheck className="w-4 h-4" /> {demand.status === 'Beneficiary' ? 'Registered' : 'Assigned'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {filteredDemands.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-500">
                    No demands matching the criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign Supplier Modal */}
      {assignModalData && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl relative animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-slate-800 mb-2">Assign Supplier</h3>
            <p className="text-sm text-slate-500 mb-6">
              Assign a supplier to <span className="font-bold text-slate-800">{assignModalData.full_name}</span>'s demand in 
              <span className="font-bold text-slate-800"> {assignModalData.woreda}</span>.
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-1 block">Select Supplier</label>
                <select 
                  className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                  value={selectedSupplierId}
                  onChange={(e) => setSelectedSupplierId(e.target.value)}
                >
                  <option value="">-- Choose a Supplier --</option>
                  {suppliers.filter(s => s.status === 'Active').map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.service_type})</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button 
                onClick={() => setAssignModalData(null)}
                className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-50 rounded-lg transition"
              >
                Cancel
              </button>
              <button 
                onClick={assignSupplier}
                disabled={assigning || !selectedSupplierId}
                className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                {assigning ? 'Assigning...' : 'Assign & Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DemandStatistics;
