import { ArrowLeft, Building2, Phone } from 'lucide-react';

export default function ContractorDetails({ contractorId, contractor, onBack }) {
  if (!contractor) {
    return <div className="text-center p-8 text-slate-500">Contractor not found</div>;
  }

  return (
    <div className="animate-in fade-in slide-in-from-right-8 duration-300">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 text-slate-400 hover:text-slate-800 hover:bg-white rounded-xl transition-all shadow-sm">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">{contractor.name}</h1>
          <p className="text-sm font-medium text-slate-400 mt-1">Registered {contractor.registered_date}</p>
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
            <DetailRow label="Company Name" value={contractor.name} />
            <DetailRow label="Company Address" value={contractor.address} />
            <DetailRow label="Service Type" value={contractor.service_type} />
            <DetailRow label="Registered Date" value={contractor.registered_date} />
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
            <DetailRow label="Contact Person" value={contractor.contact_person} />
            <DetailRow label="Phone" value={contractor.contact_phone} />
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex justify-between pb-4 border-b border-slate-50 last:border-0">
      <span className="text-sm font-medium text-slate-400">{label}</span>
      <span className="text-sm font-bold text-slate-800 text-right">{value}</span>
    </div>
  );
}
