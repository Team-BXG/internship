import React, { useState, useEffect, useMemo, useCallback } from 'react';
import toast from 'react-hot-toast';
import {
  Plus, Search, AlertTriangle, AlertOctagon,
  CheckCircle2, ArrowLeft, UploadCloud, Eye, Wrench, X, Download
} from 'lucide-react';
const MAIN_CAUSES = {
  'Home/Lantern': ['Solar Panels', 'Battery', 'Charge Control', 'Cable', 'Switch On/Off', 'Port', 'Lamp', 'Radio', 'Torch/Hand Battery', 'Tv'],
  'Institution': ['Solar Panels', 'Battery', 'Invertor', 'Cable', 'Barker (Breaker)'],
  'Solar Grid': ['Solar Panels', 'Battery', 'Invertor', 'Combiner Box', 'Control Board', 'Cable/Distribution System', 'Pole', 'Watt Hour Metter'],
  'Hydro Power': ['Intake/Weier', 'Canal', 'Forbay', 'Penstock', 'Turbine', 'Generator', 'Dirving System', 'Control Board', 'Distribution System']
};

const INITIAL_MOCK_PROBLEMS = [];

const RegisterProblem = ({ selectedScope }) => {
  const [problems, setProblems] = useState([]);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const INITIAL_FORM_STATE = {
    beneficiaryName: '',
    serialNumber: '',
    equipmentType: '',
    problemLevel: '',
    installationDate: '',
    nonFunctionalDate: '',
    zone: selectedScope.zone,
    woreda: selectedScope.woreda,
    mainCause: '',
    problemDescription: '',
    photo: null,
    supplier: ''
  };

  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [draftExists, setDraftExists] = useState(false);

  const handleBeneficiarySelect = (bId) => {
    const ben = beneficiaries.find(b => b.id.toString() === bId);
    if (ben) {
      let details = {};
      try { details = ben.details_json ? JSON.parse(ben.details_json) : {}; } catch (e) { }
      setFormData(prev => ({
        ...prev,
        beneficiaryName: ben.full_name,
        equipmentType: ben.equipment_type,
        supplier: ben.supplier || '',
        serialNumber: details.serialNumber || '',
        installationDate: details.installationDate || ''
      }));
    }
  };

  const fetchBeneficiaries = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || (import.meta.env.VITE_API_URL || "http://localhost:8000")}/api/beneficiaries?woreda=${selectedScope.woreda}&approved_only=true`);
      if (res.ok) {
        const data = await res.json();
        const woredaBens = data.filter(b => b.woreda === selectedScope.woreda);
        setBeneficiaries(woredaBens);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchProblems = useCallback(async () => {
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:8000') + '/api/problems');
      if (res.ok) {
        const data = await res.json();
        const mapped = data.map(p => {
          const details = p.details_json ? JSON.parse(p.details_json) : {};
          return {
            id: `PRB-${p.id}`,
            beneficiary: p.beneficiary_name || 'Unknown',
            serialNo: p.serial_number || details.serialNumber || 'Unknown',
            equipmentType: p.equipment,
            equipmentTypeLabel: p.equipment,
            problemLevel: p.title || 'Unknown Level',
            mainCause: p.category || details.mainCause || '-',
            location: `${p.woreda}, ${p.zone}`,
            zone: p.zone,
            woreda: p.woreda,
            reported: new Date(p.created_at || Date.now()).toISOString().split('T')[0],
            installationDate: details.installationDate || '-',
            nonFunctionalDate: details.nonFunctionalDate || '-',
            status: p.status,
            reporter: p.submitted_by
          };
        });
        setProblems(mapped);
      }
    } catch (err) {
      console.error('Failed to fetch problems', err);
    }
  }, []);

  useEffect(() => {
    fetchProblems();
    fetchBeneficiaries();

    const draft = localStorage.getItem('draft_problem');
    if (draft) {
      setDraftExists(true);
    }
  }, [fetchProblems, selectedScope.woreda]);

  const saveDraft = () => {
    localStorage.setItem('draft_problem', JSON.stringify(formData));
    setDraftExists(true);
    toast.success("Draft saved successfully!");
  };

  const restoreDraft = () => {
    const draft = localStorage.getItem('draft_problem');
    if (draft) {
      setFormData(JSON.parse(draft));
      toast.success("Draft restored!");
    }
  };

  const clearDraft = () => {
    localStorage.removeItem('draft_problem');
    setDraftExists(false);
    toast.success("Draft cleared!");
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'zone') {
      setFormData(prev => ({ ...prev, woreda: '' }));
    }
    if (field === 'equipmentType') {
      setFormData(prev => ({ ...prev, mainCause: '' }));
    }
    if (field === 'problemLevel') {
      // Reset mutually exclusive fields when problem level changes
      setFormData(prev => ({
        ...prev,
        mainCause: '',
        nonFunctionalDate: '',
        problemDescription: '',
        photo: null
      }));
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Open': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'Approved': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'Seen': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'Fixed': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'Correction Needed': return 'text-rose-600 bg-rose-50 border-rose-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getProblemLevelStyle = (level) => {
    if (level?.includes('Not functional')) return 'text-red-700 font-medium bg-red-50 px-2 py-1 rounded text-sm';
    if (level?.includes('Partially')) return 'text-orange-700 font-medium bg-orange-50 px-2 py-1 rounded text-sm';
    if (level?.includes('Abandoned')) return 'text-slate-600 font-medium bg-slate-100 px-2 py-1 rounded text-sm';
    return 'text-slate-700 font-medium text-sm';
  };

  const filteredProblems = useMemo(() => {
    return problems.filter(p => {
      const matchSearch = p.beneficiary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.serialNo.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter ? p.status === statusFilter : true;
      const matchScope = p.zone === selectedScope.zone && p.woreda === selectedScope.woreda;
      return matchSearch && matchStatus && matchScope;
    });
  }, [problems, searchQuery, statusFilter, selectedScope.zone, selectedScope.woreda]);

  ;

  const stats = {
    open: filteredProblems.filter(p => p.status === 'Open').length,
    seen: filteredProblems.filter(p => p.status === 'Seen').length,
    fixed: filteredProblems.filter(p => p.status === 'Fixed').length
  };

  const updateProblemStatus = (id, newStatus) => {
    setProblems(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
    setSelectedProblem(prev => prev && prev.id === id ? { ...prev, status: newStatus } : prev);
  };

  const submitProblem = async () => {
    try {
      const { photo, ...dataToSave } = formData;
      const payload = {
        equipment: formData.equipmentType || 'Unknown',
        title: formData.problemLevel || 'Reported Issue',
        category: formData.mainCause || formData.problemDescription || 'Uncategorized',
        zone: selectedScope.zone,
        woreda: selectedScope.woreda,
        kebele: '-',
        urgency: formData.problemLevel?.includes('Not functional') ? 'High' : 'Medium',
        beneficiary_name: formData.beneficiaryName || 'Unknown',
        submitted_by: 'Woreda Encoder',
        status: 'Open',
        supplier: formData.supplier || '',
        occurred_date: formData.nonFunctionalDate || new Date().toISOString(),
        details_json: JSON.stringify(dataToSave)
      };

      const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:8000') + '/api/problems', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        toast.success("Problem successfully registered!");
        setFormData(INITIAL_FORM_STATE);
        setShowForm(false);
        clearDraft();
        fetchProblems();
      } else {
        const errData = await res.json();
        console.error("Backend error:", errData);
        toast.error("Failed to submit. " + (errData.detail || ""));
      }
    } catch (e) {
      console.error(e);
      toast.error("Error submitting problem");
    }
  };

  // ----- DETAIL VIEW -----
  if (selectedProblem) {
    return (
      <div className="max-w-7xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => setSelectedProblem(null)}
            className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-slate-500"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-slate-800">{selectedProblem.beneficiary}</h2>
            <p className="text-slate-500 text-sm">{selectedProblem.id} · Reported {selectedProblem.reported}</p>
          </div>
          <span className={`px-4 py-1.5 rounded-full text-sm font-bold border ${getStatusStyle(selectedProblem.status)}`}>
            {selectedProblem.status}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* Equipment Details Card */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-4 mb-6">Equipment Details</h3>
            <div className="space-y-6 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Serial Number</span>
                <span className="font-semibold text-slate-800">{selectedProblem.serialNo}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Equipment Type</span>
                <span className="font-semibold text-slate-800">{selectedProblem.equipmentTypeLabel}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Problem Level</span>
                <span className="font-semibold text-slate-800">{selectedProblem.problemLevel}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Main Cause</span>
                <span className="font-semibold text-slate-800">{selectedProblem.mainCause || '-'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Installation Date</span>
                <span className="font-semibold text-slate-800">{selectedProblem.installationDate || '-'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Non-Functional Date</span>
                <span className="font-semibold text-slate-800">{selectedProblem.nonFunctionalDate || '-'}</span>
              </div>
            </div>
          </div>

          {/* Location & Reporter Card */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-4 mb-6">Location & Reporter</h3>
            <div className="space-y-6 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Zone</span>
                <span className="font-semibold text-slate-800">{selectedProblem.zone}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Woreda</span>
                <span className="font-semibold text-slate-800">{selectedProblem.woreda}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Reported By</span>
                <span className="font-semibold text-slate-800">{selectedProblem.reporter || 'System User'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Reported Date</span>
                <span className="font-semibold text-slate-800">{selectedProblem.reported}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Update Status Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Update Status</h3>
          <div className="flex gap-4">
            <button
              onClick={() => updateProblemStatus(selectedProblem.id, 'Open')}
              className={`px-6 py-2.5 rounded-full font-bold transition-all text-sm ${selectedProblem.status === 'Open' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
            >
              Open
            </button>
            <button
              onClick={() => updateProblemStatus(selectedProblem.id, 'Under Repair')}
              className={`px-6 py-2.5 rounded-full font-bold transition-all text-sm ${selectedProblem.status === 'Under Repair' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
            >
              Under Repair
            </button>
            <button
              onClick={() => updateProblemStatus(selectedProblem.id, 'Resolved')}
              className={`px-6 py-2.5 rounded-full font-bold transition-all text-sm ${selectedProblem.status === 'Resolved' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
            >
              Resolved
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ----- MAIN VIEW -----
  return (
    <div className="max-w-7xl mx-auto pb-12">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h3 className="text-2xl font-bold text-slate-800">Problem Register</h3>
          <p className="text-slate-500">Report and track equipment non-functionality issues</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all"
        >
          {showForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          {showForm ? 'Close Form' : 'Report Problem'}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-red-50 border border-red-100 p-6 rounded-2xl flex flex-col justify-center">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-red-600">{stats.open}</h2>
              <p className="text-red-800 font-medium mt-1">Open Issues</p>
            </div>
            <div className="p-3 bg-red-100 rounded-xl">
              <AlertOctagon className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
        <div className="bg-purple-50 border border-purple-100 p-6 rounded-2xl flex flex-col justify-center">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-purple-600">{stats.seen}</h2>
              <p className="text-purple-800 font-medium mt-1">Seen</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-xl">
              <Wrench className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl flex flex-col justify-center">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-emerald-600">{stats.fixed}</h2>
              <p className="text-emerald-800 font-medium mt-1">Fixed</p>
            </div>
            <div className="p-3 bg-emerald-100 rounded-xl">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 mb-8 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between bg-slate-50">
            <h4 className="font-bold text-slate-800 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-blue-600" />
              Register Equipment Problem
            </h4>
            <div className="flex items-center gap-4">
              {draftExists && (
                <div className="flex items-center gap-2">
                  <span className="text-yellow-600 text-sm font-bold">Draft saved.</span>
                  <button onClick={restoreDraft} className="px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-lg text-xs font-bold hover:bg-yellow-200 transition-colors">Restore</button>
                  <button onClick={clearDraft} className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-200 transition-colors">Clear</button>
                </div>
              )}
              <button onClick={() => setShowForm(false)} className="p-1 hover:bg-slate-200 rounded-lg text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2 col-span-2">
                <label className="text-sm font-semibold text-slate-700">Search & Select Beneficiary *</label>
                <select
                  className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                  onChange={(e) => handleBeneficiarySelect(e.target.value)}
                  defaultValue=""
                >
                  <option value="" disabled>Select a beneficiary from {selectedScope.woreda}</option>
                  {beneficiaries.map(b => (
                    <option key={b.id} value={b.id}>{b.full_name} ({b.equipment_type || 'No Equipment'})</option>
                  ))}
                </select>
                <p className="text-xs text-slate-500">Only beneficiaries in {selectedScope.woreda} are shown.</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Beneficiary Name *</label>
                <input
                  type="text"
                  placeholder="Full name of beneficiary"
                  className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-100"
                  value={formData.beneficiaryName}
                  onChange={(e) => updateFormData('beneficiaryName', e.target.value)}
                  readOnly
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Equipment Serial Number *</label>
                <input
                  type="text"
                  placeholder="e.g. SHS-NG-007"
                  className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.serialNumber}
                  onChange={(e) => updateFormData('serialNumber', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Equipment Type *</label>
                <select
                  className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  value={formData.equipmentType}
                  onChange={(e) => updateFormData('equipmentType', e.target.value)}
                >
                  <option value="">Select Type</option>
                  <option value="Home/Lantern">Home and Lantern System</option>
                  <option value="Institution">Institution</option>
                  <option value="Solar Grid">Off Grid - Solar Grid</option>
                  <option value="Hydro Power">Off Grid - Hydro Power</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Assigned Supplier</label>
                <input
                  type="text"
                  placeholder="Supplier auto-filled"
                  className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none bg-slate-100 text-slate-500"
                  value={formData.supplier || 'Not assigned'}
                  readOnly
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Problem Level *</label>
                <select
                  className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  value={formData.problemLevel}
                  onChange={(e) => updateFormData('problemLevel', e.target.value)}
                >
                  <option value="">Select Level</option>
                  <option value="Functional">Functional</option>
                  <option value="Partially functional but in need of repair">Partially functional but in need of repair</option>
                  <option value="Not functional">Not functional</option>
                  <option value="Abandoned or no longer exists">Abandoned or no longer exists</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Installation Date *</label>
                <input
                  type="date"
                  className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-600"
                  value={formData.installationDate}
                  onChange={(e) => updateFormData('installationDate', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Non-Functional Date *</label>
                <input
                  type="date"
                  className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-600 bg-white"
                  value={formData.nonFunctionalDate}
                  onChange={(e) => updateFormData('nonFunctionalDate', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Zone *</label>
                <select
                  className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  value={selectedScope.zone}
                  disabled
                >
                  <option value={selectedScope.zone}>{selectedScope.zone}</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Woreda *</label>
                <select
                  className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  value={selectedScope.woreda}
                  disabled
                >
                  <option value={selectedScope.woreda}>{selectedScope.woreda}</option>
                </select>
              </div>

              <div className="col-span-2 space-y-2">
                <label className="text-sm font-semibold text-slate-700">Main Cause *</label>
                <select
                  className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  value={formData.mainCause}
                  onChange={(e) => updateFormData('mainCause', e.target.value)}
                  disabled={!formData.equipmentType}
                >
                  <option value="">{formData.equipmentType ? "Select Cause" : "Select equipment type first"}</option>
                  {formData.equipmentType && MAIN_CAUSES[formData.equipmentType]?.map(cause => (
                    <option key={cause} value={cause}>{cause}</option>
                  ))}
                </select>
              </div>

              <div className="col-span-2 space-y-2 mt-2">
                <label className="text-sm font-semibold text-slate-700">Upload Photo (Optional)</label>
                <label className="w-full h-32 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:border-blue-400 hover:bg-slate-50 transition-colors cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => updateFormData('photo', e.target.files[0])}
                  />
                  <UploadCloud className={`w-8 h-8 mb-2 ${formData.photo ? 'text-emerald-500' : ''}`} />
                  <span className="font-semibold">{formData.photo ? 'Photo Ready' : 'Click to upload equipment photo'}</span>
                  <span className="text-xs mt-1">{formData.photo ? formData.photo.name : 'JPG, PNG up to 10MB'}</span>
                </label>
              </div>

              {formData.problemLevel === 'Functional' && (
                <div className="col-span-2 space-y-4 mt-8 p-6 border-t border-slate-200 bg-slate-50/50 rounded-b-xl">
                  <h5 className="font-bold text-slate-800">Additional Survey Information</h5>
                  <div className="space-y-2">
                    <p className="text-sm text-slate-700">System is fully functional. No additional info needed.</p>
                  </div>
                </div>
              )}

              {['Partially functional but in need of repair', 'Not functional', 'Abandoned or no longer exists'].includes(formData.problemLevel) && (
                <div className="col-span-2 grid grid-cols-2 gap-6 mt-8 p-6 border-t border-slate-200 bg-slate-50/50 rounded-b-xl">
                  <div className="col-span-2">
                    <h5 className="font-bold text-slate-800">Additional Survey Information</h5>
                  </div>

                  <div className="col-span-2 space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Main cause of non-functionality or partial functionality*</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 mt-2">
                      {!formData.equipmentType ? (
                        <p className="text-sm text-slate-500 italic col-span-full">Select equipment type first to see causes.</p>
                      ) : (
                        MAIN_CAUSES[formData.equipmentType]?.map(cause => (
                          <label key={cause} className="flex items-center gap-2 bg-white shadow-sm p-3 border border-slate-200 rounded-lg cursor-pointer hover:border-blue-400">
                            <input
                              type="radio"
                              name="mainCause"
                              value={cause}
                              checked={formData.mainCause === cause}
                              onChange={(e) => updateFormData('mainCause', e.target.value)}
                              className="text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-slate-700">{cause}</span>
                          </label>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">set non functionality date?</label>
                    <input
                      type="date"
                      className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-600 bg-white"
                      value={formData.nonFunctionalDate}
                      onChange={(e) => updateFormData('nonFunctionalDate', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Describe the functionality problem/s</label>
                    <input
                      type="text"
                      placeholder="Brief description..."
                      className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      value={formData.problemDescription}
                      onChange={(e) => updateFormData('problemDescription', e.target.value)}
                    />
                  </div>

                  <div className="col-span-2 space-y-2 mt-4">
                    <label className="text-sm font-semibold text-slate-700">Please take a picture illustrating the non-functionality or partial functionality</label>
                    <label className="w-full h-32 bg-white border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:border-blue-400 hover:bg-blue-50/20 transition-colors cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => updateFormData('photo', e.target.files[0])}
                      />
                      <UploadCloud className={`w-8 h-8 mb-2 ${formData.photo ? 'text-emerald-500' : ''}`} />
                      <span className="font-semibold">{formData.photo ? 'Photo Ready' : 'Click to upload equipment photo'}</span>
                      <span className="text-xs mt-1">{formData.photo ? formData.photo.name : 'JPG, PNG up to 10MB'}</span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 flex gap-4">
              <button
                onClick={submitProblem}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold transition-colors shadow-lg shadow-emerald-500/20"
              >
                Submit Problem Report
              </button>
              <button
                onClick={saveDraft}
                className="text-blue-600 bg-blue-50 border border-blue-200 hover:bg-blue-100 px-6 py-3 rounded-xl font-bold transition-colors"
              >
                Save for Later
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-6 py-3 rounded-xl font-bold transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search problems by beneficiary or serial..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium text-slate-700"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="Open">Open</option>
            <option value="Under Repair">Under Repair</option>
            <option value="Resolved">Resolved</option>
          </select>

        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-semibold text-xs tracking-wider">
              <tr>
                <th className="p-4">BENEFICIARY</th>
                <th className="p-4">SERIAL NO.</th>
                <th className="p-4">EQUIPMENT TYPE</th>
                <th className="p-4">PROBLEM LEVEL</th>
                <th className="p-4">LOCATION</th>
                <th className="p-4">REPORTED</th>
                <th className="p-4">STATUS</th>
                <th className="p-4 text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredProblems.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-slate-500">
                    No problems match your search or filter.
                  </td>
                </tr>
              ) : filteredProblems.map((prob) => (
                <tr key={prob.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-50 text-red-500 rounded-lg shrink-0">
                        <AlertTriangle className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-800">{prob.beneficiary}</div>
                        <div className="text-xs text-slate-400">{prob.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-medium text-slate-600">{prob.serialNo}</td>
                  <td className="p-4 font-bold text-blue-600 text-xs">{prob.equipmentTypeLabel}</td>
                  <td className="p-4 whitespace-nowrap">
                    <span className={getProblemLevelStyle(prob.problemLevel)}>
                      {prob.problemLevel.length > 20 ? prob.problemLevel.slice(0, 20) + '...' : prob.problemLevel}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="text-slate-800 font-medium">{prob.location.split(',')[0]}</div>
                    <div className="text-xs text-slate-400">{prob.location.split(',')[1]?.trim()}</div>
                  </td>
                  <td className="p-4 text-slate-500">{prob.reported}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(prob.status)}`}>
                      {prob.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => setSelectedProblem(prob)}
                      className="p-2 hover:bg-slate-100 rounded-lg text-blue-500 transition-colors"
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
};

export default RegisterProblem;
