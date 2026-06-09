import React, { useState, useEffect, useMemo } from 'react';
import { FileText, Download, Search, Layers, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import Papa from 'papaparse';
import toast from 'react-hot-toast';
import { formatRegisteredDate } from '../../utils/detailViewHelpers';
import BeneficiaryDetailsModal from '../../components/BeneficiaryDetailsModal';
import DemandDetailsModal from '../../components/DemandDetailsModal';
import ProblemDetailsModal from '../../components/ProblemDetailsModal';
import AgentDetailsModal from '../../components/AgentDetailsModal';

const PAGE_SIZE = 50;

const TAB_CONFIGS = {
  Beneficiaries: { endpoint: '/api/beneficiaries?approved_only=true', icon: <Layers className="w-5 h-5" /> },
  Demands: { endpoint: '/api/demands?approved_only=true', icon: <FileText className="w-5 h-5" /> },
  Problems: { endpoint: '/api/problems?approved_only=true', icon: <FileText className="w-5 h-5" /> },
  Suppliers: { endpoint: '/api/suppliers', icon: <Layers className="w-5 h-5" /> },
  Agents: { endpoint: '/api/agents', icon: <Layers className="w-5 h-5" /> },
  Employees: { endpoint: '/api/employees', icon: <Layers className="w-5 h-5" />, paginated: true },
  Contractors: { endpoint: '/api/contractors', icon: <Layers className="w-5 h-5" /> },
};

const TAB_COLUMNS = {
  Beneficiaries: [
    { key: 'full_name', label: 'Full Name' },
    { key: 'national_id', label: 'National ID' },
    { key: 'phone', label: 'Phone' },
    { key: 'gender', label: 'Gender' },
    { key: 'household_size', label: 'Household Size' },
    { key: 'zone_name', label: 'Zone', alt: 'zone' },
    { key: 'woreda_name', label: 'Woreda', alt: 'woreda' },
    { key: 'kebele', label: 'Kebele' },
    { key: 'village', label: 'Village' },
    { key: 'survey_type', label: 'Survey Type' },
    { key: 'equipment_type', label: 'Equipment Type' },
    { key: 'supplier', label: 'Supplier' },
    { key: 'created_at', label: 'Registered Date', format: (r) => formatRegisteredDate(r.created_at) },
  ],
  Demands: [
    { key: 'full_name', label: 'Full Name' },
    { key: 'national_id', label: 'National ID' },
    { key: 'phone', label: 'Phone' },
    { key: 'gender', label: 'Gender' },
    { key: 'has_disability', label: 'Disability' },
    { key: 'zone_name', label: 'Zone', alt: 'zone' },
    { key: 'woreda_name', label: 'Woreda', alt: 'woreda' },
    { key: 'kebele', label: 'Kebele' },
    { key: 'village', label: 'Village' },
    { key: 'service_type', label: 'Service Type' },
    { key: 'household_size', label: 'Household Size' },
    { key: 'elderly_count', label: 'Elderly Count' },
    { key: 'solar_panel_type', label: 'Solar Panel Type' },
    { key: 'watt_level', label: 'Watt Level' },
    { key: 'created_at', label: 'Registered Date', format: (r) => formatRegisteredDate(r.created_at) },
  ],
  Problems: [
    { key: 'beneficiary_name', label: 'Beneficiary' },
    { key: 'equipment', label: 'Equipment' },
    { key: 'title', label: 'Problem Level' },
    { key: 'category', label: 'Main Cause' },
    { key: 'zone_name', label: 'Zone', alt: 'zone' },
    { key: 'woreda_name', label: 'Woreda', alt: 'woreda' },
    { key: 'kebele', label: 'Kebele' },
    { key: 'supplier', label: 'Supplier' },
    { key: 'status', label: 'Status' },
    { key: 'submitted_by', label: 'Submitted By' },
    { key: 'created_at', label: 'Registered Date', format: (r) => formatRegisteredDate(r.created_at) },
  ],
  Suppliers: [
    { key: 'name', label: 'Company Name' },
    { key: 'license_number', label: 'License Number' },
    { key: 'service_type', label: 'Service Type' },
    { key: 'contact_person', label: 'Contact Person' },
    { key: 'contact_phone', label: 'Phone' },
    { key: 'email', label: 'Email' },
    { key: 'address', label: 'Address' },
  ],
  Agents: [
    { key: 'name', label: 'Name' },
    { key: 'national_id', label: 'National ID' },
    { key: 'phone', label: 'Phone' },
    { key: 'email', label: 'Email' },
    { key: 'zone_name', label: 'Zone' },
    { key: 'created_at', label: 'Registered Date', format: (r) => formatRegisteredDate(r.created_at) },
  ],
  Employees: [
    { key: 'username', label: 'Username' },
    { key: 'role', label: 'Role' },
    { key: 'email', label: 'Email' },
    { key: 'created_at', label: 'Registered Date', format: (r) => formatRegisteredDate(r.created_at) },
  ],
  Contractors: [
    { key: 'name', label: 'Company Name' },
    { key: 'service_type', label: 'Service Type' },
    { key: 'contact_person', label: 'Contact Person' },
    { key: 'contact_phone', label: 'Phone' },
    { key: 'address', label: 'Address' },
    { key: 'registered_date', label: 'Registered Date', format: (r) => formatRegisteredDate(r.registered_date) },
  ],
};

function getCellValue(row, col) {
  if (col.format) return col.format(row);
  return row[col.key] ?? (col.alt ? row[col.alt] : '') ?? '';
}

function hasZoneWoredaFilters(tab) {
  return ['Beneficiaries', 'Demands', 'Problems', 'Agents'].includes(tab);
}

function hasGenderDisabilityFilters(tab) {
  return ['Beneficiaries', 'Demands'].includes(tab);
}

export default function Reports() {
  const [activeTab, setActiveTab] = useState('Beneficiaries');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [genderFilter, setGenderFilter] = useState('All');
  const [disabilityFilter, setDisabilityFilter] = useState('All');
  const [zonesList, setZonesList] = useState([]);
  const [woredasList, setWoredasList] = useState([]);
  const [zoneFilter, setZoneFilter] = useState('All');
  const [woredaFilter, setWoredaFilter] = useState('All');
  const [employeePage, setEmployeePage] = useState(0);
  const [employeeTotal, setEmployeeTotal] = useState(0);
  const [viewRecord, setViewRecord] = useState(null);

  const columns = TAB_COLUMNS[activeTab] || [];

  useEffect(() => {
    fetch('http://localhost:8000/api/zones').then(r => r.json()).then(d => setZonesList(Array.isArray(d) ? d : [])).catch(console.error);
    fetch('http://localhost:8000/api/woredas').then(r => r.json()).then(d => setWoredasList(Array.isArray(d) ? d : [])).catch(console.error);
  }, []);

  useEffect(() => {
    fetchData();
  }, [activeTab, employeePage]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const cfg = TAB_CONFIGS[activeTab];
      let url = `http://localhost:8000${cfg.endpoint}`;
      if (cfg.paginated) {
        url += `${url.includes('?') ? '&' : '?'}skip=${employeePage * PAGE_SIZE}&limit=${PAGE_SIZE}`;
      }
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed');
      const result = await res.json();
      if (Array.isArray(result)) {
        setData(result);
        setEmployeeTotal(result.length);
      } else if (result?.items) {
        setData(result.items);
        setEmployeeTotal(result.total || result.items.length);
      } else {
        setData([]);
        setEmployeeTotal(0);
      }
    } catch (e) {
      console.error(e);
      toast.error('Error fetching data');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = useMemo(() => {
    return data.filter(item => {
      const cols = TAB_COLUMNS[activeTab] || [];
      const matchesSearch = !searchTerm || cols.some(col => {
        const val = getCellValue(item, col);
        return String(val).toLowerCase().includes(searchTerm.toLowerCase());
      });

      const matchesStatus = activeTab !== 'Problems' || statusFilter === 'All' || item.status === statusFilter;

      let matchesZone = true;
      if (hasZoneWoredaFilters(activeTab) && zoneFilter !== 'All') {
        const z = item.zone || item.zone_name || '';
        matchesZone = z.toLowerCase().includes(zoneFilter.toLowerCase());
      }

      let matchesWoreda = true;
      if (hasZoneWoredaFilters(activeTab) && woredaFilter !== 'All') {
        const w = item.woreda || item.woreda_name || '';
        matchesWoreda = w.toLowerCase().includes(woredaFilter.toLowerCase());
      }

      let matchesGender = true;
      if (hasGenderDisabilityFilters(activeTab) && genderFilter !== 'All') {
        matchesGender = item.gender === genderFilter;
      }

      let matchesDisability = true;
      if (hasGenderDisabilityFilters(activeTab) && disabilityFilter !== 'All') {
        const d = item.has_disability ?? item.hasDisability;
        const normalized = d === true || d === 'Yes' || d === 'yes' ? 'Yes' : 'No';
        matchesDisability = disabilityFilter === normalized;
      }

      return matchesSearch && matchesStatus && matchesZone && matchesWoreda && matchesGender && matchesDisability;
    });
  }, [data, activeTab, searchTerm, statusFilter, zoneFilter, woredaFilter, genderFilter, disabilityFilter]);

  const uniqueStatuses = useMemo(() => {
    if (activeTab !== 'Problems') return [];
    return [...new Set(data.map(i => i.status).filter(Boolean))];
  }, [data, activeTab]);

  const exportCSV = () => {
    if (!filteredData.length) return toast.error('No data to export');
    const rows = filteredData.map(item => {
      const row = {};
      columns.forEach(col => { row[col.label] = getCellValue(item, col); });
      return row;
    });
    const csv = Papa.unparse(rows);
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    link.download = `${activeTab}_Report_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    toast.success('CSV exported');
  };

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('All');
    setGenderFilter('All');
    setDisabilityFilter('All');
    setZoneFilter('All');
    setWoredaFilter('All');
    setEmployeePage(0);
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    resetFilters();
    setViewRecord(null);
  };

  const employeePages = Math.max(1, Math.ceil(employeeTotal / PAGE_SIZE));
  const viewableTabs = ['Beneficiaries', 'Demands', 'Problems', 'Agents'];

  return (
    <div className="max-w-7xl mx-auto w-full flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="border-b border-slate-100 pb-6">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-2">
          <FileText className="text-blue-600 stroke-[2.5] w-8 h-8" />
          System Reports
        </h1>
        <p className="text-slate-500 text-sm mt-1 font-medium">Generate and export reports across SEDMS entities.</p>
      </div>

      <div className="flex overflow-x-auto gap-2 pb-2">
        {Object.keys(TAB_CONFIGS).map(tab => (
          <button
            key={tab}
            onClick={() => switchTab(tab)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm whitespace-nowrap border transition-all ${
              activeTab === tab ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {TAB_CONFIGS[tab].icon}
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-[500px]">
        <div className="p-5 border-b border-slate-100 flex flex-wrap items-center gap-3 bg-slate-50/50">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={`Search ${activeTab.toLowerCase()}...`}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
            />
          </div>

          {activeTab === 'Problems' && uniqueStatuses.length > 0 && (
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-4 py-2 border border-slate-200 rounded-xl bg-white text-sm font-medium text-slate-700">
              <option value="All">All Statuses</option>
              {uniqueStatuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          )}

          {hasGenderDisabilityFilters(activeTab) && (
            <>
              <select value={genderFilter} onChange={e => setGenderFilter(e.target.value)} className="px-4 py-2 border border-slate-200 rounded-xl bg-white text-sm font-medium text-slate-700">
                <option value="All">All Genders</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <select value={disabilityFilter} onChange={e => setDisabilityFilter(e.target.value)} className="px-4 py-2 border border-slate-200 rounded-xl bg-white text-sm font-medium text-slate-700">
                <option value="All">All Disability</option>
                <option value="Yes">Has Disability</option>
                <option value="No">No Disability</option>
              </select>
            </>
          )}

          {hasZoneWoredaFilters(activeTab) && (
            <>
              <select value={zoneFilter} onChange={e => { setZoneFilter(e.target.value); setWoredaFilter('All'); }} className="px-4 py-2 border border-slate-200 rounded-xl bg-white text-sm font-medium text-slate-700">
                <option value="All">All Zones</option>
                {zonesList.map(z => <option key={z.id} value={z.name}>{z.name}</option>)}
              </select>
              <select value={woredaFilter} onChange={e => setWoredaFilter(e.target.value)} disabled={zoneFilter === 'All'} className="px-4 py-2 border border-slate-200 rounded-xl bg-white text-sm font-medium text-slate-700 disabled:bg-slate-100">
                <option value="All">All Woredas</option>
                {woredasList.filter(w => zoneFilter === 'All' || zonesList.find(z => z.name === zoneFilter)?.id === w.zone_id).map(w => <option key={w.id} value={w.name}>{w.name}</option>)}
              </select>
            </>
          )}

          <button onClick={exportCSV} className="ml-auto flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 font-bold text-sm">
            <Download className="w-4 h-4" /> CSV
          </button>
        </div>

        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left">
            <thead>
              <tr>
                {columns.map(col => (
                  <th key={col.key} className="p-4 border-b border-slate-100 font-bold uppercase tracking-wider text-[11px] text-slate-500 bg-slate-50 whitespace-nowrap">{col.label}</th>
                ))}
                {viewableTabs.includes(activeTab) && <th className="p-4 border-b border-slate-100 bg-slate-50 w-16"></th>}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={columns.length + 1} className="p-12 text-center text-slate-400">Loading...</td></tr>
              ) : filteredData.length === 0 ? (
                <tr><td colSpan={columns.length + 1} className="p-12 text-center text-slate-500">No records found.</td></tr>
              ) : filteredData.map((item, i) => (
                <tr key={item.id || i} className="hover:bg-slate-50/50 border-b border-slate-50">
                  {columns.map(col => (
                    <td key={col.key} className="p-4 text-sm text-slate-700 whitespace-nowrap max-w-[200px] truncate">
                      {col.key === 'status' ? (
                        <span className="px-2 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">{getCellValue(item, col)}</span>
                      ) : String(getCellValue(item, col) || '-')}
                    </td>
                  ))}
                  {viewableTabs.includes(activeTab) && (
                    <td className="p-4 text-center">
                      <button onClick={() => setViewRecord(item)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg" title="View details">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs font-bold text-slate-500">
          <span>Showing {filteredData.length} of {activeTab === 'Employees' ? employeeTotal : data.length} records</span>
          {activeTab === 'Employees' && (
            <div className="flex items-center gap-2">
              <button disabled={employeePage === 0} onClick={() => setEmployeePage(p => p - 1)} className="p-1.5 rounded border border-slate-200 disabled:opacity-40 hover:bg-white">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span>Page {employeePage + 1} of {employeePages}</span>
              <button disabled={employeePage >= employeePages - 1} onClick={() => setEmployeePage(p => p + 1)} className="p-1.5 rounded border border-slate-200 disabled:opacity-40 hover:bg-white">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {viewRecord && activeTab === 'Beneficiaries' && <BeneficiaryDetailsModal beneficiary={viewRecord} onClose={() => setViewRecord(null)} />}
      {viewRecord && activeTab === 'Demands' && <DemandDetailsModal demand={viewRecord} onClose={() => setViewRecord(null)} />}
      {viewRecord && activeTab === 'Problems' && <ProblemDetailsModal problem={viewRecord} onClose={() => setViewRecord(null)} />}
      {viewRecord && activeTab === 'Agents' && <AgentDetailsModal agent={viewRecord} onClose={() => setViewRecord(null)} />}
    </div>
  );
}
