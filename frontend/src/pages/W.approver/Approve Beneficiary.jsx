import React, { useState, useEffect } from 'react';
import { Search, Eye, Filter, Download } from 'lucide-react';
import BeneficiaryDetailsModal from '../../components/BeneficiaryDetailsModal';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ApproveBeneficiary = ({ selectedScope }) => {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [activeBeneficiary, setActiveBeneficiary] = useState(null);

  useEffect(() => {
    fetchBeneficiaries();
  }, []);

  const fetchBeneficiaries = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/beneficiaries?status=Pending Woreda`);
      if (res.ok) {
        const data = await res.json();
        setBeneficiaries(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleStatusUpdate = async (beneficiary, newStatus) => {
    try {
      const res = await fetch(`http://localhost:8000/api/beneficiaries/${beneficiary.id}/status`, {
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

  const exportPDF = () => {
    const doc = new jsPDF()
    doc.text(`Beneficiaries Report - ${selectedScope.zone} / ${selectedScope.woreda}`, 14, 15)
    
    doc.setFontSize(10)
    doc.text(`Total Records: ${filtered.length}`, 14, 25)
    
    const tableColumn = ["Beneficiary", "Location", "Equipment", "Status", "Date"]
    const tableRows = []

    filtered.forEach(b => {
      const bData = [
        `${b.full_name}\n${b.national_id || '-'}`,
        `${b.kebele || b.woreda}\n${b.zone}`,
        b.equipment_type || 'Unknown',
        b.status,
        new Date(b.created_at).toISOString().split('T')[0]
      ]
      tableRows.push(bData)
    })

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 35,
    })

    doc.save(`beneficiaries_${selectedScope.woreda}_${new Date().toISOString().split('T')[0]}.pdf`)
  };

  const filtered = beneficiaries.filter(b => {
    const term = searchTerm.toLowerCase();
    const matchSearch = b.full_name?.toLowerCase().includes(term) || b.national_id?.toLowerCase().includes(term) || b.woreda?.toLowerCase().includes(term);
    const matchZone = b.zone === selectedScope.zone && b.woreda === selectedScope.woreda;
    const matchStatus = statusFilter === 'All Status' ? true : b.status === statusFilter;
    return matchSearch && matchZone && matchStatus;
  });

  const uniqueStatuses = [...new Set(beneficiaries.map(b => b.status).filter(Boolean))];

  const getStatusColor = (status) => {
    if (status === 'Approved') return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (status === 'Pending Woreda' || status === 'Pending Zone') return 'text-orange-700 bg-orange-50 border-orange-200';
    if (status === 'Rejected') return 'text-red-700 bg-red-50 border-red-200';
    return 'text-slate-600 bg-slate-50 border-slate-200';
  };

  const actionConfig = [
    { label: 'Approve Submission', className: 'bg-emerald-500 hover:bg-emerald-600 text-white', onClick: (b) => handleStatusUpdate(b, 'Pending Zone') },
    { label: 'Return for Correction', className: 'bg-amber-500 hover:bg-amber-600 text-white', onClick: (b) => handleStatusUpdate(b, 'Adjustment Needed') },
    { label: 'Reject Submission', className: 'bg-red-500 hover:bg-red-600 text-white', onClick: (b) => handleStatusUpdate(b, 'Rejected') }
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-slate-800">Beneficiaries</h3>
        <p className="text-slate-500 mt-1">{filtered.length} records • {selectedScope.zone} / {selectedScope.woreda}</p>
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
             <button 
               onClick={exportPDF}
               className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition font-medium text-sm"
             >
               <Download className="w-4 h-4" /> Export
             </button>
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
                <tr><td colSpan="7" className="p-8 text-center text-slate-500">No beneficiaries found in Woreda queue.</td></tr>
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
                        {b.status === 'Pending Woreda' ? 'Pending' : b.status}
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

export default ApproveBeneficiary;
