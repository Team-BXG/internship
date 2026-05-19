import toast from 'react-hot-toast';
import { useState } from 'react';
import { X } from 'lucide-react';

export default function RegisterContractor({ onCancel, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    contact_person: '',
    contact_phone: '',
    service_type: 'Institution'
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    fetch('http://localhost:8000/api/contractors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    .then(res => {
      if (res.ok) {
        onSuccess();
      } else {
        toast.error("Failed to save contractor");
      }
    })
    .catch(err => {
      console.error(err);
      toast.error("Error saving contractor");
    })
    .finally(() => {
      setSaving(false);
    });
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Contractor Registration</h1>
        <p className="text-sm font-medium text-slate-400 mt-1">4 registered contractors · Institutions & Off-Grid projects</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white py-6 rounded-2xl border border-slate-100 flex flex-col items-center justify-center shadow-sm">
          <span className="text-2xl font-black text-slate-800">4</span>
          <span className="text-xs font-bold text-slate-400 mt-1">Total</span>
        </div>
        <div className="bg-white py-6 rounded-2xl border border-slate-100 flex flex-col items-center justify-center shadow-sm">
          <span className="text-2xl font-black text-violet-600">2</span>
          <span className="text-xs font-bold text-slate-400 mt-1">Institution</span>
        </div>
        <div className="bg-white py-6 rounded-2xl border border-slate-100 flex flex-col items-center justify-center shadow-sm">
          <span className="text-2xl font-black text-orange-500">2</span>
          <span className="text-xs font-bold text-slate-400 mt-1">Off-Grid</span>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden p-8 relative">
        <button 
          onClick={onCancel}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-lg font-bold text-slate-800 mb-8">New Contractor Registration</h2>

        <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">Contractor Company Name <span className="text-rose-500">*</span></label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. EthioTech Energy Contractors Ltd" 
                required
                className="w-full bg-slate-50 border border-slate-100 placeholder:text-slate-400 text-slate-700 text-sm rounded-xl px-4 py-3 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">Company Address <span className="text-rose-500">*</span></label>
              <input 
                type="text" 
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="e.g. Bahir Dar, Amhara Region" 
                required
                className="w-full bg-slate-50 border border-slate-100 placeholder:text-slate-400 text-slate-700 text-sm rounded-xl px-4 py-3 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">Contact Person Name <span className="text-rose-500">*</span></label>
              <input 
                type="text" 
                name="contact_person"
                value={formData.contact_person}
                onChange={handleChange}
                placeholder="Full name of contact person" 
                required
                className="w-full bg-slate-50 border border-slate-100 placeholder:text-slate-400 text-slate-700 text-sm rounded-xl px-4 py-3 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">Contact Person Phone <span className="text-rose-500">*</span></label>
              <input 
                type="tel" 
                name="contact_phone"
                value={formData.contact_phone}
                onChange={handleChange}
                placeholder="+251 9..." 
                required
                className="w-full bg-slate-50 border border-slate-100 placeholder:text-slate-400 text-slate-700 text-sm rounded-xl px-4 py-3 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
              />
            </div>
          </div>

          <div className="space-y-3 pt-2 max-w-full">
            <label className="text-xs font-bold text-slate-700 block">Service Type <span className="text-rose-500">*</span></label>
            <div className="grid grid-cols-2 gap-4">
              <button 
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, service_type: 'Institution' }))}
                className={`py-3.5 px-4 rounded-xl text-sm font-bold border transition-all ${
                  formData.service_type === 'Institution' 
                  ? 'border-blue-600 bg-blue-50 text-blue-700' 
                  : 'border-slate-100 bg-slate-50 text-slate-500 hover:bg-slate-100'
                }`}
              >
                Institution
              </button>
              <button 
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, service_type: 'Off-Grid' }))}
                className={`py-3.5 px-4 rounded-xl text-sm font-bold border transition-all ${
                  formData.service_type === 'Off-Grid' 
                  ? 'border-blue-600 bg-blue-50 text-blue-700' 
                  : 'border-slate-100 bg-slate-50 text-slate-500 hover:bg-slate-100'
                }`}
              >
                Off-Grid
              </button>
            </div>
          </div>

          <div className="pt-6 flex items-center gap-3">
            <button 
              type="submit"
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-8 rounded-xl transition-all shadow-md shadow-blue-500/20 active:scale-95 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Register Contractor'}
            </button>
            <button 
              type="button"
              onClick={onCancel}
              className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 font-bold py-2.5 px-6 rounded-xl transition-all active:scale-95"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
