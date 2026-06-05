import React, { useState, useEffect } from 'react';
import { Search, Eye, Filter, Download } from 'lucide-react';
import BeneficiaryDetailsModal from '../../components/BeneficiaryDetailsModal';
import Papa from 'papaparse';

const BeneficiaryView = ({ selectedZone }) => {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [woredas, setWoredas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [woredaFilter, setWoredaFilter] = useState('All Woredas');
  const [activeBeneficiary, setActiveBeneficiary] = useState(null);

  useEffect(() => {
    fetchBeneficiaries();
    fetchWoredas();
  }, []);

  const fetchBeneficiaries = async () => {
    try {
      // Fetch all beneficiaries for the zone
      const res = await fetch(`http://127.0.0.1:8000/api/beneficiaries`);
      if (res.ok) {
        const data = await res.json();
        setBeneficiaries(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchWoredas = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/locations/woredas`);
      if (res.ok) {
        const data = await res.json();
        // Filter woredas that belong to the selectedZone
        // Note: The API returns woredas with a zone_id, we need to match the zone name.
        // As a shortcut, we can fetch zones to map name -> id, or if data includes zone name, use that.
        // Assuming woreda has zone_id, let's fetch zones first or just rely on backend zone matching.
        // Alternatively, the API might not include zone_name. We'll fetch zones to map it.
        const zonesRes = await fetch(`http://127.0.0.1:8000/api/locations/zones`);
        if (zonesRes.ok) {
           const zones = await zonesRes.json();
           const currentZone = zones.find(z => z.name === selectedZone);
           if (currentZone) {
               setWoredas(data.filter(w => w.zone_id === currentZone.id));
           } else {
               setWoredas(data); // Fallback
           }
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleStatusUpdate = async (beneficiary, newStatus) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/beneficiaries/${beneficiary.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setActiveBeneficiary(null);
        fetchBeneficiaries();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = beneficiaries.filter(b => {
    const term = searchTerm.toLowerCase();
    const matchSearch = b.full_name?.toLowerCase().includes(term) || b.national_id?.toLowerCase().includes(term) || b.woreda?.toLowerCase().includes(term);
    const matchZone = !selectedZone || 
                      (b.zone && b.zone.toLowerCase().includes(selectedZone.toLowerCase())) || 
                      (b.zone_name && b.zone_name.toLowerCase().includes(selectedZone.toLowerCase())) ||
                      selectedZone.toLowerCase().includes(String(b.zone || '').toLowerCase());
    const matchStatus = statusFilter === 'All Status' ? true : b.status === statusFilter;
    const matchWoreda = woredaFilter === 'All Woredas' ? true : b.woreda === woredaFilter;
    return matchSearch && matchZone && matchStatus && matchWoreda;
  });

  const uniqueStatuses = [...new Set(beneficiaries.map(b => b.status).filter(Boolean))];

  const exportCSV = () => {
    if (filtered.length === 0) return;
    const dataToExport = filtered.map(b => ({
      Beneficiary: b.full_name,
      ID: b.national_id || '',
      Kebele: b.kebele || b.woreda,
      Zone: b.zone,
      Equipment: b.equipment_type || 'Unknown',
      Status: b.status,
      Date: new Date(b.created_at).toISOString().split('T')[0]
    }));
    const csv = Papa.unparse(dataToExport);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `ApprovalQueue_${selectedZone}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const getStatusColor = (status) => {
    if (status === 'Approved') return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (status === 'Pending' || status === 'Pending Zone' || status === 'Pending Woreda') return 'text-orange-700 bg-orange-50 border-orange-200';
    if (status === 'Correction Needed' || status === 'Rejected') return 'text-red-700 bg-red-50 border-red-200';
    return 'text-slate-600 bg-slate-50 border-slate-200';
  };

  const actionConfig = [
    { label: 'Approve Zone', className: 'bg-emerald-500 hover:bg-emerald-600 text-white', onClick: (b) => handleStatusUpdate(b, 'Approved') },
    { label: 'Return for Correction', className: 'bg-amber-500 hover:bg-amber-600 text-white', onClick: (b) => handleStatusUpdate(b, 'Correction Needed') }
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-slate-800">Beneficiary View</h3>
        <p className="text-slate-500 mt-1">{filtered.length} records • Final verification for {selectedZone}</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between gap-4">
           <div className="relative flex-1 max-w-xl">
             <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
             <input 
               type="text" 
               placeholder="Search name, ID, woreda..."
               className="w-full pl-12 pr-4 py-2.5 bg-white border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
           </div>
           <div className="flex gap-3">
             <select 
               className="px-4 py-2.5 bg-white border border-slate-200 rounded-full text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20"
               value={woredaFilter}
               onChange={(e) => setWoredaFilter(e.target.value)}
             >
                <option value="All Woredas">All Woredas</option>
                {woredas.map(w => <option key={w.id} value={w.name}>{w.name}</option>)}
             </select>
             <select 
               className="px-4 py-2.5 bg-white border border-slate-200 rounded-full text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20"
               value={statusFilter}
               onChange={(e) => setStatusFilter(e.target.value)}
             >
                 <option value="All Status">All Status</option>
                 {uniqueStatuses.map(s => <option key={s} value={s}>{s}</option>)}
               </select>
               <button 
                 onClick={exportCSV}
                 className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition font-medium text-sm"
               >
                 <Download className="w-4 h-4" /> CSV
               </button>
            </div>
         </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 font-semibold text-xs tracking-wider">
               <tr>
                 <th className="p-4 pl-6 uppercase">Beneficiary</th>
                 <th className="p-4 uppercase">Location</th>
                 <th className="p-4 uppercase">Equipment</th>
                 <th className="p-4 uppercase">Supplier</th>
                 <th className="p-4 uppercase">Status</th>
                 <th className="p-4 uppercase">Date</th>
                 <th className="p-4 text-center"></th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 ? (
                <tr><td colSpan="7" className="p-8 text-center text-slate-500">No beneficiaries found in Zone queue.</td></tr>
              ) : filtered.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs uppercase flex-shrink-0">
                        {b.full_name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <div className="font-bold text-slate-800">{b.full_name}</div>
                        <div className="text-xs text-slate-400">{b.national_id || 'No ID'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-slate-800 font-medium">{b.kebele || b.woreda}</div>
                    <div className="text-xs text-slate-400">{b.zone}</div>
                  </td>
                  <td className="p-4">
                     <span className="font-bold text-blue-700 text-xs px-2 py-0.5">{b.equipment_type || 'Unknown'}</span>
                  </td>
                  <td className="p-4 text-slate-600 max-w-[150px] truncate">{b.supplier || 'Unassigned'}</td>
                  <td className="p-4">
                     <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(b.status)}`}>
                        {b.status === 'Pending Zone' ? 'Pending' : b.status}
                     </span>
                  </td>
                  <td className="p-4 text-slate-500">{new Date(b.created_at).toISOString().split('T')[0]}</td>
                  <td className="p-4 text-center">
                     <button onClick={() => setActiveBeneficiary(b)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors inline-block" title="View Details Log">
                        <Eye className="w-5 h-5" />
                     </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
           <span>Page 1 of 1</span>
        </div>
      </div>

      {activeBeneficiary && (
        <BeneficiaryDetailsModal 
          beneficiary={activeBeneficiary} 
          onClose={() => setActiveBeneficiary(null)} 
          actionConfig={actionConfig} 
        />
      )}
    </div>
  );
};

export default BeneficiaryView;
