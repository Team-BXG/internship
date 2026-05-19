import { useState, useEffect } from 'react';
import { ArrowLeft, Building2, PhoneCall, MapPin, FileText, CheckCircle2 } from 'lucide-react';

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
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">{supplier.name}</h1>
            <p className="text-sm font-medium text-slate-400 mt-1">{supplier.license_number} • Registered recently</p>
          </div>
        </div>
        <div>
          <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold border ${supplier.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
            {supplier.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Company Information */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Company Information</h2>
          </div>
          
          <div className="space-y-5">
             <DetailRow label="Company Name" value={supplier.name} />
             <DetailRow label="Company Type" value={supplier.company_type || "Private Limited"} />
             <DetailRow label="License Number" value={supplier.license_number} />
             <DetailRow label="Service Type" value={supplier.service_type} />
             <DetailRow label="Address" value={supplier.address} />
          </div>
        </div>

        {/* Contact Details */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <PhoneCall className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Contact Details</h2>
          </div>
          
          <div className="space-y-4">
             <DetailRow label="Contact Person" value={supplier.contact_person} />
             <DetailRow label="Company Contact Name" value={supplier.contact_person} />
             <DetailRow label="Company Contact Phone" value={supplier.contact_phone} />
             <DetailRow label="Phone" value={supplier.contact_phone} />
             <DetailRow label="Email" value={supplier.email} />
             
             <div className="pt-2 border-t border-slate-50 mt-4">
               <div className="flex justify-between items-end mb-2 mt-4">
                 <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Performance Score</span>
                 <span className="text-sm font-black text-slate-800">{supplier.score}/100</span>
               </div>
               <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                 <div 
                   className={`h-full rounded-full ${supplier.score > 80 ? 'bg-emerald-500' : supplier.score > 60 ? 'bg-amber-400' : 'bg-rose-500'}`} 
                   style={{ width: `${supplier.score}%` }}
                 ></div>
               </div>
             </div>
          </div>
        </div>

        {/* Assigned Areas */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Assigned Areas</h2>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Zones</h3>
            <div className="flex flex-wrap gap-2">
              {supplier.coverage_zones?.length > 0 ? supplier.coverage_zones.map((zone, i) => (
                <span key={i} className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-50 text-blue-700">
                  {zone}
                </span>
              )) : <span className="text-sm text-slate-400 font-medium">No zones assigned</span>}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Woredas</h3>
            <div className="flex flex-wrap gap-2">
              {supplier.coverage_woredas?.length > 0 ? supplier.coverage_woredas.map((woreda, i) => (
                <span key={i} className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold bg-cyan-50 text-cyan-700">
                  {woreda}
                </span>
              )) : <span className="text-sm text-slate-400 font-medium">No woredas assigned</span>}
            </div>
          </div>
        </div>

        {/* Documents */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Documents</h2>
          </div>
          
          <div className="space-y-4">
            <DocumentRow name="Supplier Agreement" />
            <DocumentRow name="Business License" />
            <DocumentRow name="Tax Certificate" />
            <DocumentRow name="Product Certification" />
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest shrink-0">{label}</span>
      <span className="text-sm font-bold text-slate-800 text-right break-words">{value || '-'}</span>
    </div>
  );
}

function DocumentRow({ name }) {
  return (
    <div className="flex justify-between items-center p-3 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100/50 transition-colors cursor-pointer">
       <span className="text-sm font-semibold text-slate-700">{name}</span>
       <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
         <CheckCircle2 className="w-3.5 h-3.5" />
         <span className="text-[10px] font-bold uppercase tracking-wider">Verified</span>
       </div>
    </div>
  );
}
