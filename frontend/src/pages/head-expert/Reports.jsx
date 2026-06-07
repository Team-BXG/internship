import React, { useState, useEffect } from 'react';
import { FileText, Download, Search, Filter, Layers, CheckCircle2, ShieldAlert } from 'lucide-react';
import Papa from 'papaparse';
import toast from 'react-hot-toast';

const TAB_CONFIGS = {
  'Beneficiaries': { endpoint: '/api/beneficiaries', title: 'Beneficiary Reports', icon: <Layers className="w-5 h-5" /> },
  'Demands': { endpoint: '/api/demands', title: 'Demand Reports', icon: <FileText className="w-5 h-5" /> },
  'Suppliers': { endpoint: '/api/suppliers', title: 'Supplier Reports', icon: <Layers className="w-5 h-5" /> },
  'Agents': { endpoint: '/api/agents', title: 'Agent Reports', icon: <Layers className="w-5 h-5" /> },
  'Employees': { endpoint: '/api/employees', title: 'Employee Reports', icon: <Layers className="w-5 h-5" /> },
  'Contractors': { endpoint: '/api/contractors', title: 'Contractor Reports', icon: <Layers className="w-5 h-5" /> },
};

const EXCLUDED_KEYS = [
  'details_json', 'password', 'hashed_password', 'id', 
  'woreda_id', 'zone_id', 'created_at', 'last_activity', 
  'requires_password_change', 'assigned_supplier_id'
];

export default function Reports() {
  const [activeTab, setActiveTab] = useState('Beneficiaries');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  const [zonesList, setZonesList] = useState([]);
  const [woredasList, setWoredasList] = useState([]);
  const [zoneFilter, setZoneFilter] = useState('All');
  const [woredaFilter, setWoredaFilter] = useState('All');

  useEffect(() => {
    fetch('http://localhost:8000/api/zones')
      .then(res => res.json())
      .then(data => setZonesList(Array.isArray(data) ? data : []))
      .catch(console.error);

    fetch('http://localhost:8000/api/woredas')
      .then(res => res.json())
      .then(data => setWoredasList(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const endpoint = TAB_CONFIGS[activeTab].endpoint;
      const res = await fetch(`http://localhost:8000${endpoint}`);
      if (res.ok) {
        const result = await res.json();
        if (Array.isArray(result)) {
          setData(result);
        } else if (result && Array.isArray(result.items)) {
          setData(result.items);
        } else {
          setData([]);
        }
      } else {
        toast.error("Failed to load data");
      }
    } catch (e) {
      console.error(e);
      toast.error("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  const getFilteredData = () => {
    return data.filter(item => {
      // General search logic across string values
      const matchesSearch = Object.keys(item)
        .filter(k => !EXCLUDED_KEYS.includes(k))
        .some(k => String(item[k]).toLowerCase().includes(searchTerm.toLowerCase()));
        
      // Status filter
      const matchesStatus = statusFilter === 'All' || (item.status === statusFilter);
      
      // Zone filter
      let matchesZone = true;
      if (zoneFilter && zoneFilter !== 'All') {
        const itemZone = item.zone || item.zone_name || '';
        matchesZone = itemZone.toLowerCase().includes(zoneFilter.toLowerCase()) || 
                      zoneFilter.toLowerCase().includes(itemZone.toLowerCase());
      }
      
      // Woreda filter
      let matchesWoreda = true;
      if (woredaFilter && woredaFilter !== 'All') {
        const itemWoreda = item.woreda || item.woreda_name || '';
        matchesWoreda = itemWoreda.toLowerCase().includes(woredaFilter.toLowerCase()) || 
                        woredaFilter.toLowerCase().includes(itemWoreda.toLowerCase());
      }
      
      return matchesSearch && matchesStatus && matchesZone && matchesWoreda;
    });
  };

  const filteredData = getFilteredData();

  const getUniqueStatuses = () => {
    const statuses = [...new Set(data.map(item => item.status).filter(Boolean))];
    return statuses;
  };

  ;

  const exportCSV = () => {
    if (filteredData.length === 0) {
      toast.error("No data to export");
      return;
    }

    try {
      // Clean data (remove details_json, passwords, etc)
      const cleanData = filteredData.map(item => {
        const clean = {};
        Object.keys(item).forEach(k => {
          if (!EXCLUDED_KEYS.includes(k)) {
            clean[k] = item[k];
          }
        });
        return clean;
      });

      const csv = Papa.unparse(cleanData);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${activeTab}_Report_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      toast.success("CSV exported successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Error exporting CSV");
    }
  };

  const renderTableHeaders = () => {
    if (filteredData.length === 0) return <tr><th className="p-4">No data available</th></tr>;
    const keys = Object.keys(filteredData[0]).filter(k => !EXCLUDED_KEYS.includes(k));
    return (
      <tr>
        {keys.map(k => (
          <th key={k} className="p-4 border-b border-slate-100 font-bold uppercase tracking-wider text-[11px] text-slate-500 bg-slate-50">
            {k.replace(/_/g, ' ')}
          </th>
        ))}
      </tr>
    );
  };

  const renderTableBody = () => {
    if (filteredData.length === 0) return (
      <tr><td colSpan="12" className="p-8 text-center text-slate-500">No records found matching your criteria.</td></tr>
    );
    const keys = Object.keys(filteredData[0]).filter(k => !EXCLUDED_KEYS.includes(k));
    return filteredData.map((item, i) => (
      <tr key={item.id || i} className="hover:bg-slate-50/50 transition-colors border-b border-slate-50">
        {keys.map(k => (
          <td key={k} className="p-4 text-sm text-slate-700 whitespace-nowrap">
            {k === 'status' ? (
              <span className={`px-2 py-1 rounded-full text-xs font-bold border ${
                item[k]?.includes('Pending') ? 'bg-amber-50 text-amber-600 border-amber-200' :
                item[k]?.includes('Reject') || item[k]?.includes('Correction') ? 'bg-rose-50 text-rose-600 border-rose-200' :
                'bg-emerald-50 text-emerald-600 border-emerald-200'
              }`}>
                {item[k]}
              </span>
            ) : String(item[k] ?? '').substring(0, 30) + (String(item[k] ?? '').length > 30 ? '...' : '')}
          </td>
        ))}
      </tr>
    ));
  };

  return (
    <div className="max-w-7xl mx-auto w-full flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <FileText className="text-blue-600 stroke-[2.5] w-8 h-8" />
            System Reports
          </h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">
            Generate and export comprehensive reports across all SEDMS entities.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
        {Object.keys(TAB_CONFIGS).map(tab => (
          <button
            key={tab}
            onClick={() => { 
              setActiveTab(tab); 
              setStatusFilter('All'); 
              setSearchTerm(''); 
              setZoneFilter('All');
              setWoredaFilter('All');
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all whitespace-nowrap border ${
              activeTab === tab 
                ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20' 
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {TAB_CONFIGS[tab].icon}
            {tab}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-[500px]">
        
        {/* Toolbar */}
        <div className="p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 bg-slate-50/50">
          <div className="flex items-center gap-3 flex-wrap flex-1 min-w-[300px]">
            <div className="relative flex-1 max-w-sm min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder={`Search ${activeTab.toLowerCase()}...`}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
              />
            </div>
            
            {getUniqueStatuses().length > 0 && (
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="pl-4 pr-8 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm font-medium text-slate-700 appearance-none"
                >
                  <option value="All">All Statuses</option>
                  {getUniqueStatuses().map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              </div>
            )}

            {/* Zone Filter */}
            <select
              value={zoneFilter}
              onChange={e => {
                setZoneFilter(e.target.value);
                setWoredaFilter('All');
              }}
              className="px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm font-medium text-slate-700"
            >
              <option value="All">All Zones</option>
              {zonesList.map(z => <option key={z.id} value={z.name}>{z.name}</option>)}
            </select>

            {/* Woreda Filter */}
            <select
              value={woredaFilter}
              onChange={e => setWoredaFilter(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm font-medium text-slate-700 disabled:bg-slate-100 disabled:text-slate-400"
              disabled={zoneFilter === 'All'}
            >
              <option value="All">All Woredas</option>
              {woredasList
                .filter(w => {
                  if (zoneFilter === 'All') return true;
                  const zObj = zonesList.find(z => z.name === zoneFilter);
                  return zObj ? w.zone_id === zObj.id : true;
                })
                .map(w => <option key={w.id} value={w.name}>{w.name}</option>)
              }
            </select>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={exportCSV}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-bold text-sm"
            >
              <Download className="w-4 h-4" /> CSV
            </button>
            
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left">
            <thead>
              {renderTableHeaders()}
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="12" className="p-12 text-center text-slate-400 font-bold">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin"></div>
                      Loading data...
                    </div>
                  </td>
                </tr>
              ) : renderTableBody()}
            </tbody>
          </table>
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs font-bold text-slate-500">
          <span>Showing {filteredData.length} records</span>
          <span>{activeTab} Module</span>
        </div>
      </div>

    </div>
  );
}
