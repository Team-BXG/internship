import React, { useState, useEffect } from 'react';
import { Search, Download, Eye, Clock, CheckCircle2, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

const Beneficiaries = ({ supplier }) => {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [demands, setDemands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('beneficiaries'); // 'beneficiaries' or 'demands'

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch beneficiaries
      const benRes = await fetch(`http://localhost:8000/api/beneficiaries?supplier=${supplier.id}`);
      let benData = [];
      if (benRes.ok) {
        benData = await benRes.json();
        setBeneficiaries(benData);
      }

      // Fetch demands
      const demRes = await fetch(`http://localhost:8000/api/demands?supplier_id=${supplier.id}`);
      if (demRes.ok) {
        const demData = await demRes.json();
        setDemands(demData);
      }
    } catch (e) {
      console.error(e);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [supplier.id]);

  const filteredBeneficiaries = beneficiaries.filter(b => 
    b.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.national_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.woreda?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDemands = demands.filter(d => 
    d.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.national_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.woreda_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportCSV = () => {
    let headers, rows;
    if (activeTab === 'beneficiaries') {
      headers = ['Name', 'National ID', 'Location', 'Equipment', 'Survey Type', 'Date Added'];
      rows = filteredBeneficiaries.map(b => [
        b.full_name,
        b.national_id || 'N/A',
        b.kebele || b.woreda || 'N/A',
        b.equipment_type || 'Unknown',
        b.survey_type || '-',
        new Date(b.created_at).toLocaleDateString()
      ]);
    } else {
      headers = ['Name', 'National ID', 'Location', 'Equipment Type', 'Watt Level', 'Date Assigned', 'Status'];
      rows = filteredDemands.map(d => [
        d.full_name,
        d.national_id || 'N/A',
        `${d.kebele || ''}, ${d.woreda_name || ''}`,
        d.solar_panel_type || 'N/A',
        d.watt_level || 'N/A',
        new Date(d.created_at).toLocaleDateString(),
        d.status === 'Resolved to Beneficiary' ? 'Registered Beneficiary' : 'Assigned'
      ]);
    }
    
    const csvContent = [headers.join(','), ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `${activeTab}_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">My Beneficiaries / Assigned Demands</h2>
        <p className="text-slate-500 mt-1">View assigned demands and registered beneficiaries receiving your equipment</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-slate-200 mb-6">
        <button
          onClick={() => setActiveTab('beneficiaries')}
          className={`pb-3 font-semibold text-sm transition-all border-b-2 px-2 ${
            activeTab === 'beneficiaries'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Registered Beneficiaries ({filteredBeneficiaries.length})
        </button>
        <button
          onClick={() => setActiveTab('demands')}
          className={`pb-3 font-semibold text-sm transition-all border-b-2 px-2 ${
            activeTab === 'demands'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Assigned Demands ({filteredDemands.length})
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between gap-4 bg-slate-50/50">
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder={activeTab === 'beneficiaries' ? "Search by name, ID, or woreda..." : "Search by name, ID, or woreda..."}
              className="w-full pl-12 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition font-medium text-sm"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
             <div className="p-12 text-center text-slate-500">Loading your data...</div>
          ) : activeTab === 'beneficiaries' ? (
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 font-semibold text-xs tracking-wider">
                <tr>
                  <th className="p-4 pl-6 uppercase">Beneficiary</th>
                  <th className="p-4 uppercase">Location</th>
                  <th className="p-4 uppercase">Equipment</th>
                  <th className="p-4 uppercase">Survey Type</th>
                  <th className="p-4 uppercase">Date Added</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredBeneficiaries.length === 0 ? (
                  <tr><td colSpan="5" className="p-8 text-center text-slate-500">No beneficiaries found.</td></tr>
                ) : filteredBeneficiaries.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="font-bold text-slate-800">{b.full_name}</div>
                      <div className="text-xs text-slate-400">{b.national_id || 'No ID'}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-slate-800 font-medium">{b.kebele || b.woreda}</div>
                      <div className="text-xs text-slate-400">{b.zone}</div>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded text-xs">{b.equipment_type || 'Unknown'}</span>
                    </td>
                    <td className="p-4 text-slate-600">{b.survey_type || '-'}</td>
                    <td className="p-4 text-slate-500">{new Date(b.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 font-semibold text-xs tracking-wider">
                <tr>
                  <th className="p-4 pl-6 uppercase">Demand Client</th>
                  <th className="p-4 uppercase">Location</th>
                  <th className="p-4 uppercase">Equipment Details</th>
                  <th className="p-4 uppercase">Status / Tag</th>
                  <th className="p-4 uppercase">Date Assigned</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredDemands.length === 0 ? (
                  <tr><td colSpan="5" className="p-8 text-center text-slate-500">No assigned demands found.</td></tr>
                ) : filteredDemands.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="font-bold text-slate-800">{d.full_name}</div>
                      <div className="text-xs text-slate-400">{d.national_id || 'No ID'}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-slate-800 font-medium">{d.kebele || d.woreda_name}</div>
                      <div className="text-xs text-slate-400">{d.zone_name}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-blue-700 bg-blue-50 px-2 py-1 rounded text-xs w-max">{d.solar_panel_type || 'Unknown'}</div>
                      <div className="text-[10px] text-slate-400 mt-1">{d.watt_level ? `${d.watt_level} Watts` : ''}</div>
                    </td>
                    <td className="p-4">
                      {d.status === 'Resolved to Beneficiary' ? (
                        <span className="font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full text-xs inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Beneficiary
                        </span>
                      ) : (
                        <span className="font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full text-xs inline-flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-amber-600" /> Assigned
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-slate-500">{new Date(d.created_at).toLocaleDateString()}</td>
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

export default Beneficiaries;
