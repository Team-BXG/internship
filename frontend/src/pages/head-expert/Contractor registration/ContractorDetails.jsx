import { ArrowLeft, Building2, Phone } from 'lucide-react';

export default function ContractorDetails({ contractorId, contractor, onBack }) {
  if (!contractor) {
    return <div className="text-center p-8 text-slate-500">Contractor not found</div>;
  }

  return (
    <div className="animate-in fade-in slide-in-from-right-8 duration-300">
      <div className="flex justify-between items-start mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 text-slate-400 hover:text-slate-800 hover:bg-white rounded-xl transition-all shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">{contractor.name}</h1>
            <p className="text-sm font-medium text-slate-400 mt-1">{contractor.id} · Registered {contractor.registered_date}</p>
          </div>
        </div>
        <div className="flex items-center">
          <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold border ${contractor.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
            {contractor.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Company Information</h2>
          </div>

          <div className="space-y-6">
            <div className="flex justify-between pb-4 border-b border-slate-50">
              <span className="text-sm font-medium text-slate-400">Company Name</span>
              <span className="text-sm font-bold text-slate-800">{contractor.name}</span>
            </div>
            <div className="flex justify-between pb-4 border-b border-slate-50">
              <span className="text-sm font-medium text-slate-400">Company Address</span>
              <span className="text-sm font-bold text-slate-800">{contractor.address || 'N/A'}</span>
            </div>
            <div className="flex justify-between pb-4 border-b border-slate-50">
              <span className="text-sm font-medium text-slate-400">Service Type</span>
              <span className="text-sm font-bold text-slate-800">{contractor.service_type}</span>
            </div>
            <div className="flex justify-between pb-4">
              <span className="text-sm font-medium text-slate-400">Registered Date</span>
              <span className="text-sm font-bold text-slate-800">{contractor.registered_date}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Phone className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Contact Information</h2>
          </div>

          <div className="space-y-6">
            <div className="flex justify-between pb-4 border-b border-slate-50">
              <span className="text-sm font-medium text-slate-400">Contact Person</span>
              <span className="text-sm font-bold text-slate-800">{contractor.contact_person}</span>
            </div>
            <div className="flex justify-between pb-4 border-b border-slate-50">
              <span className="text-sm font-medium text-slate-400">Phone</span>
              <span className="text-sm font-bold text-slate-800">{contractor.contact_phone}</span>
            </div>
            <div className="flex justify-between pb-4">
              <span className="text-sm font-medium text-slate-400">Status</span>
              <span className="text-sm font-bold text-slate-800">{contractor.status}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
