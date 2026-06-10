import { useState, useEffect } from 'react';
import { ArrowLeft, Building2, PhoneCall } from 'lucide-react';
export default function SupplierDetails({ supplierId, onBack }) {
  const [supplier, setSupplier] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:8000/api/suppliers/${supplierId}`)
      .then(res => res.json())
      .then(data => {
        setSupplier(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [supplierId]);

  if (loading) {
    return <div className="flex h-64 items-center justify-center font-bold text-slate-400">Loading details...</div>;
  }

  if (!supplier) {
    return <div className="flex h-64 items-center justify-center font-bold text-rose-400">Failed to load supplier.</div>;
  }

  return (
    <div className="animate-in fade-in slide-in-from-right-8 duration-300">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">{supplier.name}</h1>
          <p className="text-sm font-medium text-slate-400 mt-1">{supplier.license_number}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Company Information</h2>
          </div>
          <div className="space-y-5">
            <DetailRow label="Company Name" value={supplier.name} />
            <DetailRow label="License Number" value={supplier.license_number} />
            <DetailRow label="Service Type" value={supplier.service_type} />
            <DetailRow label="Address" value={supplier.address} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <PhoneCall className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Contact Details</h2>
          </div>
          <div className="space-y-5">
            <DetailRow label="Contact Person" value={supplier.contact_person} />
            <DetailRow label="Phone" value={supplier.contact_phone} />
            <DetailRow label="Email" value={supplier.email} />
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest shrink-0">{label}</span>
      <span className="text-sm font-bold text-slate-800 text-right break-words">{value}</span>
    </div>
  );
}
