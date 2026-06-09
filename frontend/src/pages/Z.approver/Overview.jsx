import React, { useState, useEffect } from 'react';
import { Truck, Wrench, Users, Zap, MapPin, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { DistributionTrendChart, EquipmentTypeChart, FunctionalStatusChart } from '../head-expert/Dashboard/Charts';

export default function Overview({ selectedZone }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [woredas, setWoredas] = useState([]);
  
  const [filterWoreda, setFilterWoreda] = useState("");
  const [filterGender, setFilterGender] = useState("");
  const [filterEquipment, setFilterEquipment] = useState("");
  const [filterGuarantee, setFilterGuarantee] = useState("");

  useEffect(() => {
     // Fetch woredas for this zone
     fetch((import.meta.env.VITE_API_URL || 'http://localhost:8000') + '/api/area-options')
       .then(res => res.json())
       .then(opts => {
          const zoneObj = opts.zones.find(z => z.name === selectedZone);
          if (zoneObj) {
            const zoneWoredas = opts.woredas.filter(w => w.zone_id === zoneObj.id);
            setWoredas(zoneWoredas);
          } else {
            // fallback if zone name in select doesn't strictly match DB
            setWoredas(opts.woredas);
          }
       })
       .catch(err => console.error(err));
  }, [selectedZone]);

  useEffect(() => {
    let url = `${import.meta.env.VITE_API_URL || (import.meta.env.VITE_API_URL || "http://localhost:8000")}/api/dashboard?zone=${encodeURIComponent(selectedZone)}`;
    if (filterWoreda) url += `&woreda=${encodeURIComponent(filterWoreda)}`;
    if (filterGender) url += `&gender=${encodeURIComponent(filterGender)}`;
    if (filterEquipment) url += `&equipment_type=${encodeURIComponent(filterEquipment)}`;
    if (filterGuarantee) url += `&guarantee=${encodeURIComponent(filterGuarantee)}`;

    setLoading(true);
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [selectedZone, filterWoreda, filterGender, filterEquipment, filterGuarantee]);

  if (loading) return <div className="flex h-full items-center justify-center font-bold text-slate-400">Loading Dashboard...</div>;
  if (!data || data.error) return <div className="flex h-full items-center justify-center font-bold text-red-500">Error loading data.</div>;

  const stats = data.stats;
  const cardData = [
    { label: "Total Suppliers", value: stats.total_suppliers, trend: stats.suppliers_trend, icon: Truck, colors: "text-blue-500 bg-blue-50" },
    { label: "Registered Contractors", value: stats.registered_contractors, trend: stats.contractors_trend, icon: Wrench, colors: "text-purple-500 bg-purple-50" },
    { label: "Total Beneficiaries", value: stats.total_beneficiaries, trend: stats.beneficiaries_trend, icon: Users, colors: "text-cyan-500 bg-cyan-50" },
    { label: "Units Distributed", value: stats.units_distributed, trend: stats.units_trend, icon: Zap, colors: "text-indigo-500 bg-indigo-50" },
    { label: "Active Zones", value: stats.active_zones, trend: 0, icon: MapPin, colors: "text-green-500 bg-green-50" },
    { label: "Pending Approvals", value: stats.pending_approvals, trend: stats.pending_trend, icon: Clock, colors: "text-orange-500 bg-orange-50" },
    { label: "Functional Systems", value: stats.functional_systems, trend: stats.functional_trend, icon: CheckCircle, colors: "text-green-500 bg-green-50" },
    { label: "Non-Functional Systems", value: stats.non_functional_systems, trend: stats.non_functional_trend, icon: AlertCircle, colors: "text-red-500 bg-red-50" },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">{selectedZone} Dashboard</h1>
          <p className="text-sm font-medium text-slate-400 mt-1">Overview specific to {selectedZone} Zone</p>
        </div>
        
        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <span className="text-xs font-bold text-slate-400 mr-1 uppercase tracking-wider">Filters:</span>
          
          <select value={filterWoreda} onChange={e => setFilterWoreda(e.target.value)} className="bg-white border border-slate-200 text-slate-600 text-xs font-semibold rounded-[12px] px-3 py-2 outline-none hover:border-blue-300 hover:text-blue-600 focus:ring-4 focus:ring-blue-500/10 transition-all cursor-pointer shadow-sm">
            <option value="">All Woredas</option>
            {woredas.map(w => <option key={w.id} value={w.name}>{w.name}</option>)}
          </select>
          
          <select value={filterGender} onChange={e => setFilterGender(e.target.value)} className="bg-white border border-slate-200 text-slate-600 text-xs font-semibold rounded-[12px] px-3 py-2 outline-none hover:border-blue-300 hover:text-blue-600 focus:ring-4 focus:ring-blue-500/10 transition-all cursor-pointer shadow-sm">
            <option value="">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          <select value={filterEquipment} onChange={e => setFilterEquipment(e.target.value)} className="bg-white border border-slate-200 text-slate-600 text-xs font-semibold rounded-[12px] px-3 py-2 outline-none hover:border-blue-300 hover:text-blue-600 focus:ring-4 focus:ring-blue-500/10 transition-all cursor-pointer shadow-sm">
            <option value="">All Equipment Types</option>
            {(data?.equipment_options || []).map(eq => <option key={eq} value={eq}>{eq}</option>)}
          </select>

          <select value={filterGuarantee} onChange={e => setFilterGuarantee(e.target.value)} className="bg-white border border-slate-200 text-slate-600 text-xs font-semibold rounded-[12px] px-3 py-2 outline-none hover:border-blue-300 hover:text-blue-600 focus:ring-4 focus:ring-blue-500/10 transition-all cursor-pointer shadow-sm">
            <option value="">All Guarantee</option>
            <option value="Guarantee">Guarantee</option>
            <option value="No Guarantee">No Guarantee</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {cardData.map((stat, i) => {
          const isPositive = stat.trend > 0;
          return (
            <div key={i} className="group bg-white p-6 rounded-[24px] shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 hover:border-slate-200 transition-all duration-400 ease-out cursor-pointer relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-transparent to-slate-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-bl-[100px] pointer-events-none -z-0"></div>
               <div className="relative z-10 flex justify-between items-start mb-4">
                  <div className={`w-12 h-12 rounded-[16px] flex items-center justify-center ${stat.colors} group-hover:scale-110 transition-transform duration-300 ease-in-out`}>
                     <stat.icon className="w-6 h-6 stroke-[2.5]" />
                  </div>
                  {stat.trend !== 0 && (
                    <span className={`text-[12px] font-bold flex items-center gap-0.5 px-2 py-1 rounded-full ${isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'} group-hover:bg-opacity-80 transition-colors`}>
                      {isPositive ? "↗" : "↘"} {Math.abs(stat.trend)}%
                    </span>
                  )}
               </div>
               <h2 className="relative z-10 text-[32px] font-black text-slate-800 tracking-tight leading-none mb-1">{stat.value?.toLocaleString() || '0'}</h2>
               <p className="relative z-10 text-[12px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
        <div className="xl:col-span-2">
          <DistributionTrendChart data={data.distribution_trend} />
        </div>
        <div>
          <EquipmentTypeChart data={data.equipment_type} />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
        <FunctionalStatusChart data={data.functional_status} />
      </div>
    </div>
  );
}
