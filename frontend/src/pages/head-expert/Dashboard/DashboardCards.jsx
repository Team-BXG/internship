import { Truck, Wrench, Users, Zap, CheckCircle, AlertCircle } from "lucide-react";

export default function DashboardCards({ stats, filterGender, setFilterGender, filterEquipment, setFilterEquipment, filterGuarantee, setFilterGuarantee, equipmentOptions = [] }) {
  if (!stats) return null;

  const cardData = [
    { label: "Total Suppliers", value: stats.total_suppliers, icon: Truck, colors: "text-blue-500 bg-blue-50" },
    { label: "Registered Contractors", value: stats.registered_contractors, icon: Wrench, colors: "text-purple-500 bg-purple-50" },
    { label: "Total Beneficiaries", value: stats.total_beneficiaries, icon: Users, colors: "text-cyan-500 bg-cyan-50" },
    { label: "Units Distributed", value: stats.units_distributed, icon: Zap, colors: "text-indigo-500 bg-indigo-50" },
    { label: "Functional Systems", value: stats.functional_systems, icon: CheckCircle, colors: "text-green-500 bg-green-50" },
    { label: "Non-Functional Systems", value: stats.non_functional_systems, icon: AlertCircle, colors: "text-red-500 bg-red-50" },
  ];

  const selectClass = "bg-white border border-slate-200 text-slate-600 text-xs font-semibold rounded-[12px] px-3 py-2 outline-none hover:border-blue-300 hover:text-blue-600 focus:ring-4 focus:ring-blue-500/10 transition-all cursor-pointer shadow-sm";

  return (
    <div className="mb-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Head Office Dashboard</h1>
          <p className="text-sm font-medium text-slate-400 mt-1">Overview as of June 2024 - Amhara Water & Energy Bureau</p>
        </div>

        <div className="flex items-center gap-3 mt-4 md:mt-0 flex-wrap">
          <span className="text-xs font-bold text-slate-400 mr-1 uppercase tracking-wider">Filters:</span>

          <select className={selectClass} value={filterGender} onChange={(e) => setFilterGender(e.target.value)}>
            <option value="">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          <select className={selectClass} value={filterEquipment} onChange={(e) => setFilterEquipment(e.target.value)}>
            <option value="">All Equipment Types</option>
            {equipmentOptions.map((eq) => (
              <option key={eq} value={eq}>{eq}</option>
            ))}
          </select>

          <select className={selectClass} value={filterGuarantee} onChange={(e) => setFilterGuarantee(e.target.value)}>
            <option value="">All Guarantee</option>
            <option value="Guarantee">Guarantee</option>
            <option value="No Guarantee">No Guarantee</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {cardData.map((stat, i) => (
          <div key={i} className="group bg-white p-6 rounded-[24px] shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 hover:border-slate-200 transition-all duration-400 ease-out relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-transparent to-slate-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-bl-[100px] pointer-events-none -z-0"></div>
            <div className="relative z-10 flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-[16px] flex items-center justify-center ${stat.colors} group-hover:scale-110 transition-transform duration-300 ease-in-out`}>
                <stat.icon className="w-6 h-6 stroke-[2.5]" />
              </div>
            </div>
            <h2 className="relative z-10 text-[32px] font-black text-slate-800 tracking-tight leading-none mb-1">{stat.value?.toLocaleString() || '0'}</h2>
            <p className="relative z-10 text-[12px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
