import React, { useState, useEffect } from 'react';
import { Search, Download, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

const Beneficiaries = ({ supplier }) => {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchBeneficiaries = async () => {
      try {
        setLoading(true);
        // We fetch all and filter client side. In production, pass ?supplier_id=1
        const res = await fetch('http://localhost:8000/api/beneficiaries');
        if (res.ok) {
          const data = await res.json();
          // Mock filtering logic assuming half are assigned to this supplier for demo purposes
          // since our seed script assigned random strings or nulls to `supplier` column
          const filtered = data.filter((_, i) => i % 2 === 0);
          setBeneficiaries(filtered);
        }
      } catch (e) {
        console.error(e);
        toast.error('Failed to load beneficiaries');
      } finally {
        setLoading(false);
      }
    };
    fetchBeneficiaries();
  }, [supplier.id]);

  const filteredData = beneficiaries.filter(b => 
    b.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.national_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.woreda?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">My Beneficiaries</h2>
        <p className="text-slate-500 mt-1">View beneficiaries who received your equipment</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between gap-4 bg-slate-50">
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name, ID, or woreda..."
              className="w-full pl-12 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition font-medium text-sm">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
             <div className="p-12 text-center text-slate-500">Loading your data...</div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-white border-b border-slate-100 text-slate-400 font-semibold text-xs tracking-wider">
                <tr>
                  <th className="p-4 pl-6 uppercase">Beneficiary</th>
                  <th className="p-4 uppercase">Location</th>
                  <th className="p-4 uppercase">Equipment</th>
                  <th className="p-4 uppercase">Survey Type</th>
                  <th className="p-4 uppercase">Date Added</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredData.length === 0 ? (
                  <tr><td colSpan="5" className="p-8 text-center text-slate-500">No beneficiaries found.</td></tr>
                ) : filteredData.map((b) => (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default Beneficiaries;
