import { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import AmharaMap from './AmharaMap';

export default function AreaAssignment({ selectedZone }) {
  const [options, setOptions] = useState({ suppliers: [], zones: [], woredas: [] });
  const [formData, setFormData] = useState({
    supplier_id: "",
    zone_id: "",
    woreda_id: "",
    kebele: ""
  });
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchOptions();
    fetchAssignments();
  }, []);

  const fetchOptions = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/area-options');
      const data = await res.json();
      if (res.ok && data.suppliers) {
        setOptions(data);
      } else {
        console.error("Error formatting option data:", data);
        setOptions({ suppliers: [], zones: [], woredas: [] });
      }
    } catch (err) {
      console.error("Error fetching options:", err);
      setOptions({ suppliers: [], zones: [], woredas: [] });
    }
  };

  const fetchAssignments = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/area-assignments');
      const data = await res.json();
      setAssignments(data.assignments || []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching assignments:", err);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "zone_id") {
      // Clear woreda when zone changes
      setFormData(prev => ({ ...prev, zone_id: value, woreda_id: "" }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const calculateCoverage = () => {
    const baseCoverage = 45;
    const additional = assignments.length * 2;
    return Math.min(100, baseCoverage + additional);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    if (!formData.supplier_id || !formData.zone_id || !formData.woreda_id || !formData.kebele) {
      setSaving(false);
      setMessage({ type: 'error', text: 'Please fill out all fields.' });
      return;
    }

    try {
      const res = await fetch('http://localhost:8000/api/area-assignments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          supplier_id: parseInt(formData.supplier_id),
          zone_id: parseInt(formData.zone_id),
          woreda_id: parseInt(formData.woreda_id),
          kebele: formData.kebele
        }),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Assignment saved successfully!' });
        setFormData({ supplier_id: "", zone_id: "", woreda_id: "", kebele: "" });
        fetchAssignments();
      } else {
        const errData = await res.json();
        setMessage({ type: 'error', text: errData.detail || 'Failed to save.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Network error. Could not save.' });
    } finally {
      setSaving(false);
    }
  };

  const filteredWoredas = formData.zone_id
    ? options.woredas.filter(w => w.zone_id === parseInt(formData.zone_id))
    : options.woredas;

  const coverage = calculateCoverage();

  if (loading) return <div className="text-slate-400 font-bold p-8">Loading Area Data...</div>;

  return (
    <div className="max-w-7xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-800">Area Assignment</h1>
        <p className="text-slate-500 text-sm mt-1">Assign suppliers to zones, woredas, and kebeles</p>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 p-8 flex flex-col xl:flex-row gap-8 items-start w-full">

        {/* Form Section (Left Side) */}
        <div className="flex-1 w-full xl:max-w-[450px]">
          <h2 className="text-lg font-bold text-[#1e3a8a] mb-6 flex items-center gap-2">
            Assign Supplier to Area
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">

            {/* Row 1 */}
            <div className="flex flex-row gap-6 w-full">
              <div className="flex flex-col gap-2 flex-1">
                <label className="text-sm font-semibold text-slate-700">Supplier</label>
                <select
                  name="supplier_id"
                  value={formData.supplier_id}
                  onChange={handleChange}
                  className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none w-full"
                >
                  <option value="">Select Supplier</option>
                  {options.suppliers.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2 flex-1">
                <label className="text-sm font-semibold text-slate-700">Zone</label>
                <select
                  name="zone_id"
                  value={formData.zone_id}
                  onChange={handleChange}
                  className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none w-full"
                >
                  <option value="">Select Zone</option>
                  {options.zones
                    .filter(z => !selectedZone || z.name === selectedZone)
                    .map(z => (
                    <option key={z.id} value={z.id}>{z.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 2 */}
            <div className="flex flex-row gap-6 w-full">
              <div className="flex flex-col gap-2 flex-1">
                <label className="text-sm font-semibold text-slate-700">Woreda</label>
                <select
                  name="woreda_id"
                  value={formData.woreda_id}
                  onChange={handleChange}
                  className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none w-full"
                >
                  <option value="">Select Woreda</option>
                  {filteredWoredas.map(w => (
                    <option key={w.id} value={w.id}>{w.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2 flex-1">
                <label className="text-sm font-semibold text-slate-700">Kebele</label>
                <input
                  type="text"
                  name="kebele"
                  value={formData.kebele}
                  onChange={handleChange}
                  placeholder="Enter Kebele"
                  className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                />
              </div>
            </div>

            {/* Message Alert */}
            {message && (
              <div className={`p-4 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {message.text}
              </div>
            )}

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl shadow-md shadow-blue-500/30 transition-all disabled:opacity-70 mt-2"
              >
                {saving ? 'Saving...' : 'New Assignment'}
              </button>
            </div>
          </form>
        </div>

        {/* Map Section (Right Side / Bottom) */}
        <div className="w-full xl:flex-[2] bg-white border border-slate-200 rounded-[24px] p-4 flex flex-col relative overflow-hidden min-h-[600px] shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4 text-[16px] px-2 flex justify-between items-center">
            Amhara Region Distribution
            <span className="text-sm font-normal text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              {assignments.length} Projects Deployed
            </span>
          </h3>

          {/* Interactive Amhara Map (Huge mode!) */}
          <div className="flex-1 w-full min-h-[500px] relative z-10 rounded-[16px] border border-slate-200 overflow-hidden shadow-inner">
            <AmharaMap assignments={assignments} />
          </div>
        </div>

      </div>
    </div>
  );
}
