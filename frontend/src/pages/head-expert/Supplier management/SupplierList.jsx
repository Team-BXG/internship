import { Search, Plus, Eye, Truck } from 'lucide-react';

export default function SupplierList({ suppliers, onRegister, onViewDetails }) {
  const activeCount = suppliers.filter(s => s.status === 'Active').length;
  const suspendedCount = suppliers.filter(s => s.status === 'Suspended').length;
  const inactiveCount = suppliers.filter(s => s.status === 'Inactive').length;

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Supplier Management</h1>
          <p className="text-sm font-medium text-slate-400 mt-1">{suppliers.length} registered suppliers</p>
        </div>
        <button 
          onClick={onRegister}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-xl flex items-center gap-2 transition-all hover:shadow-lg hover:shadow-blue-600/20 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Register Supplier
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 flex flex-col items-center justify-center shadow-sm">
          <span className="text-3xl font-black text-emerald-500">{activeCount}</span>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Active</span>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 flex flex-col items-center justify-center shadow-sm">
          <span className="text-3xl font-black text-slate-400">{inactiveCount}</span>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Inactive</span>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 flex flex-col items-center justify-center shadow-sm">
          <span className="text-3xl font-black text-rose-500">{suspendedCount}</span>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Suspended</span>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search suppliers..." 
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-700"
            />
          </div>
          <div className="flex gap-3">
             <select className="bg-slate-50 border border-slate-100 text-slate-600 text-sm font-semibold rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer">
               <option>All Zones</option>
             </select>
             <select className="bg-slate-50 border border-slate-100 text-slate-600 text-sm font-semibold rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer">
               <option>All Status</option>
             </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-xs text-slate-400 font-bold uppercase tracking-wider">
                <th className="px-6 py-4 rounded-tl-lg">Supplier</th>
                <th className="px-6 py-4">Service Type</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Coverage</th>
                <th className="px-6 py-4">Score</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center rounded-tr-lg"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {suppliers.map((supplier) => (
                <tr key={supplier.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center flex-shrink-0">
                        <Truck className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm">{supplier.name}</p>
                        <p className="text-[10px] text-slate-400 font-semibold">{supplier.license_number}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold bg-blue-50 text-blue-600">
                      {supplier.service_type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-700">{supplier.contact_person}</p>
                    <p className="text-[11px] text-slate-400 font-medium">{supplier.contact_phone}</p>
                  </td>
                  <td className="px-6 py-4 max-w-[200px]">
                    <div className="flex flex-wrap gap-1">
                      {supplier.coverage_zones?.slice(0, 2).map((zone, i) => (
                        <span key={i} className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600">
                          {zone}
                        </span>
                      ))}
                      {supplier.coverage_zones?.length > 2 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600">
                          +{supplier.coverage_zones.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${supplier.score > 80 ? 'bg-emerald-500' : supplier.score > 60 ? 'bg-amber-400' : 'bg-rose-500'}`} 
                          style={{ width: `${supplier.score}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-bold text-slate-700">{supplier.score}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                     <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border ${supplier.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                      {supplier.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => onViewDetails(supplier.id)}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Simple pagination footer dummy */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-semibold">
           <span>Page 1 of 2</span>
           <div className="flex gap-1">
              <button className="w-7 h-7 rounded border border-slate-200 flex items-center justify-center hover:bg-slate-50">{"<"}</button>
              <button className="w-7 h-7 rounded bg-blue-600 text-white flex items-center justify-center">1</button>
              <button className="w-7 h-7 rounded border border-slate-200 flex items-center justify-center hover:bg-slate-50">2</button>
              <button className="w-7 h-7 rounded border border-slate-200 flex items-center justify-center hover:bg-slate-50">{">"}</button>
           </div>
        </div>
      </div>
    </div>
  );
}
