import { Search, Plus, Eye, Wrench, ChevronDown } from 'lucide-react';

export default function ContractorList({ contractors, onRegister, onViewDetails }) {
  const institutionCount = contractors.filter(c => c.service_type === 'Institution').length;
  const offGridCount = contractors.filter(c => c.service_type === 'Off-Grid').length;

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Contractor Registration</h1>
          <p className="text-sm font-medium text-slate-400 mt-1">{contractors.length} registered contractors · Institutions & Off-Grid projects</p>
        </div>
        <button 
          onClick={onRegister}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-xl flex items-center gap-2 transition-all hover:shadow-lg hover:shadow-blue-600/20 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Register Contractor
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white py-6 rounded-2xl border border-slate-100 flex flex-col items-center justify-center shadow-sm">
          <span className="text-2xl font-black text-slate-800">{contractors.length}</span>
          <span className="text-xs font-bold text-slate-400 mt-1">Total</span>
        </div>
        <div className="bg-white py-6 rounded-2xl border border-slate-100 flex flex-col items-center justify-center shadow-sm">
          <span className="text-2xl font-black text-violet-600">{institutionCount}</span>
          <span className="text-xs font-bold text-slate-400 mt-1">Institution</span>
        </div>
        <div className="bg-white py-6 rounded-2xl border border-slate-100 flex flex-col items-center justify-center shadow-sm">
          <span className="text-2xl font-black text-orange-500">{offGridCount}</span>
          <span className="text-xs font-bold text-slate-400 mt-1">Off-Grid</span>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden p-6 pb-2">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-2xl bg-slate-50 border border-slate-100 rounded-xl overflow-hidden flex items-center">
            <Search className="w-4 h-4 ml-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search contractors..." 
              className="w-full pl-3 pr-4 py-3 bg-transparent text-sm outline-none placeholder:text-slate-400 text-slate-700 font-medium"
            />
          </div>
          <div className="flex gap-3">
             <div className="flex items-center gap-2 border border-slate-100 rounded-xl px-4 py-2.5 cursor-pointer hover:bg-slate-50 transition-colors">
               <span className="text-sm font-semibold text-slate-600">All Services</span>
               <ChevronDown className="w-4 h-4 text-slate-600" />
             </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs text-slate-400 font-bold uppercase tracking-widest border-b border-slate-100">
                <th className="pb-4 pt-2">Company</th>
                <th className="pb-4 pt-2">Service Type</th>
                <th className="pb-4 pt-2">Contact Person</th>
                <th className="pb-4 pt-2">Phone</th>
                <th className="pb-4 pt-2">Registered</th>
                <th className="pb-4 pt-2">Status</th>
                <th className="pb-4 pt-2 text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {contractors.map((contractor) => (
                <tr key={contractor.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-violet-50 text-violet-500 flex items-center justify-center flex-shrink-0">
                        <Wrench className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm">{contractor.name}</p>
                        <p className="text-[11px] text-slate-400 font-medium tracking-wide mt-0.5">{contractor.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold ${contractor.service_type === 'Institution' ? 'bg-violet-50 text-violet-600' : 'bg-orange-50 text-orange-500'}`}>
                      {contractor.service_type}
                    </span>
                  </td>
                  <td className="py-4">
                    <p className="text-sm font-semibold text-slate-700">{contractor.contact_person}</p>
                  </td>
                  <td className="py-4">
                    <p className="text-[13px] font-medium text-slate-500">{contractor.contact_phone}</p>
                  </td>
                  <td className="py-4">
                     <p className="text-[13px] font-medium text-slate-500">{contractor.registered_date}</p>
                  </td>
                  <td className="py-4">
                     <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold border ${contractor.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                      {contractor.status}
                    </span>
                  </td>
                  <td className="py-4 text-center">
                    <button 
                      onClick={() => onViewDetails(contractor.id)}
                      className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100"
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
      </div>
    </div>
  );
}
