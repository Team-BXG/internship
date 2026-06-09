import toast from 'react-hot-toast';
import { useState } from 'react';
import { X, Check } from 'lucide-react';
import { sanitizeText, sanitizeNationalId } from '../../../utils/formHelpers';

export default function RegisterSupplier({ onCancel, onSuccess }) {
  const [formData, setFormData] = useState({
    contact_person: '',
    contact_phone: '',
    name: '',
    license_number: '',
    address: '',
    email: '',
    service_type: 'Home Solar System'
  });
  const [saving, setSaving] = useState(false);
  const [alsoContractor, setAlsoContractor] = useState(false);
  const [contractorServiceType, setContractorServiceType] = useState('Institution');
  const serviceOptions = [
    "Home Solar System", "Solar Lantern", "Institutional Solar",
    "Off-grid Solar Grid", "Off-grid Hydro Power", "Off-grid Wind"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    let sanitized = value;
    if (['name', 'contact_person', 'address'].includes(name)) sanitized = sanitizeText(value, name === 'address' ? 60 : 30);
    if (name === 'license_number') sanitized = sanitizeNationalId(value);
    setFormData(prev => ({ ...prev, [name]: sanitized }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    fetch('http://localhost:8000/api/suppliers', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-User-Name': JSON.parse(localStorage.getItem('user'))?.username || 'Unknown',
        'X-User-Role': JSON.parse(localStorage.getItem('user'))?.role || 'Unknown'
      },
      body: JSON.stringify(formData)
    })
    .then(res => {
      if (!res.ok) throw new Error("Failed to save supplier");
      
      if (alsoContractor) {
        const contractorPayload = {
          name: formData.name,
          contact_person: formData.contact_person,
          contact_phone: formData.contact_phone,
          address: formData.address || 'Not Provided',
          service_type: contractorServiceType
        };
        return fetch('http://localhost:8000/api/contractors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(contractorPayload)
        }).then(cRes => {
          if (!cRes.ok) throw new Error("Supplier saved, but failed to save contractor");
        });
      }
    })
    .then(() => {
      onSuccess();
    })
    .catch(err => {
      console.error(err);
      toast.error(err.message || "Error saving supplier");
    })
    .finally(() => {
      setSaving(false);
    });
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
        <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
          <h2 className="text-xl font-bold text-slate-800">Register New Supplier</h2>
          <button onClick={onCancel} className="text-slate-400 hover:text-slate-700 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-8">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Supplier Company Contact Name *</label>
              <input 
                required
                type="text" 
                name="contact_person"
                value={formData.contact_person}
                onChange={handleChange}
                placeholder="Contact person full name" 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Company Contact Phone *</label>
              <input 
                required
                type="text" 
                name="contact_phone"
                value={formData.contact_phone}
                onChange={handleChange}
                placeholder="+251 9..." 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Company Name *</label>
              <input 
                required
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Official company name" 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">License Number *</label>
              <input 
                required
                type="text" 
                name="license_number"
                value={formData.license_number}
                onChange={handleChange}
                placeholder="LIC-XXXX-XXX" 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Address</label>
              <input 
                type="text" 
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="City, Region" 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Email</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="info@company.et" 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800"
              />
            </div>
          </div>

          <div className="mb-10">
            <label className="block text-xs font-bold text-slate-700 mb-4">Service Type *</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {serviceOptions.map((type, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => setFormData(prev => ({ ...prev, service_type: type }))}
                  className={`py-3 px-4 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 border ${
                    formData.service_type === type 
                    ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm' 
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {formData.service_type === type && <Check className="w-4 h-4 text-blue-600" />}
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-10 bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <label className="flex items-start gap-3 cursor-pointer">
              <div className="flex items-center h-5">
                <input 
                  type="checkbox" 
                  checked={alsoContractor}
                  onChange={(e) => setAlsoContractor(e.target.checked)}
                  className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20"
                />
              </div>
              <div>
                <span className="text-sm font-bold text-slate-800">Also register this entity as a Contractor</span>
                <p className="text-xs text-slate-500 mt-1">Check this box if the supplier also provides contractor services. Details like name, contact, and address will be automatically copied to the Contractor database.</p>
              </div>
            </label>

            {alsoContractor && (
              <div className="mt-6 pt-6 border-t border-slate-200 animate-in fade-in slide-in-from-top-2">
                <label className="block text-xs font-bold text-slate-700 mb-3">Contractor Service Type *</label>
                <div className="grid grid-cols-2 gap-3 max-w-md">
                  <button
                    type="button"
                    onClick={() => setContractorServiceType('Institution')}
                    className={`py-2.5 px-4 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 border ${
                      contractorServiceType === 'Institution' 
                      ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20' 
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    Institution
                  </button>
                  <button
                    type="button"
                    onClick={() => setContractorServiceType('Off-Grid')}
                    className={`py-2.5 px-4 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 border ${
                      contractorServiceType === 'Off-Grid' 
                      ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20' 
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    Off-Grid
                  </button>
                </div>
              </div>
            )}
          </div>

          <div>
            <button 
              type="submit" 
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl flex items-center justify-center transition-all hover:shadow-lg hover:shadow-blue-600/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Register Supplier'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
