import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { 
  CheckCircle2, ChevronLeft, ChevronRight, Send, 
  Zap, MapPin, User, Phone, IdCard, AlertTriangle,
  UploadCloud
} from 'lucide-react';

const STEPS = [
  { id: 1, label: 'Personal Info', icon: User },
  { id: 2, label: 'Location', icon: MapPin },
  { id: 3, label: 'Solar Requirements', icon: Zap },
  { id: 4, label: 'Review', icon: CheckCircle2 }
];

const RegisterDemand = ({ selectedScope }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    fullName: '',
    nationalId: '',
    phoneNumber: '',
    zone: selectedScope.zone,
    woreda: selectedScope.woreda,
    kebele: '',
    village: '',
    gender: '',
    hasDisability: '',
    serviceType: '',
    householdSize: '',
    hasElderly: false,
    solarPanelType: '',
    wattLevel: '',
    idPhoto: null
  });

  const nextStep = () => {
    const newErrors = {};
    if (currentStep === 1) {
      if (!formData.fullName) newErrors.fullName = "Required";
      if (!formData.nationalId) newErrors.nationalId = "Required";
      if (!formData.phoneNumber) newErrors.phoneNumber = "Required";
      if (!formData.gender) newErrors.gender = "Required";
      if (!formData.hasDisability) newErrors.hasDisability = "Required";
    } else if (currentStep === 2) {
      if (!formData.kebele) newErrors.kebele = "Required";
      if (!formData.village) newErrors.village = "Required";
      if (!formData.serviceType) newErrors.serviceType = "Required";
      if (!formData.householdSize) newErrors.householdSize = "Required";
    } else if (currentStep === 3) {
      if (!formData.solarPanelType) newErrors.solarPanelType = "Required";
      if (!formData.wattLevel) newErrors.wattLevel = "Required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const submitForm = async () => {
    try {
      const payload = {
        full_name: formData.fullName,
        national_id: formData.nationalId,
        phone: formData.phoneNumber,
        zone: selectedScope.zone,
        woreda: selectedScope.woreda,
        kebele: formData.kebele,
        village: formData.village,
        gender: formData.gender,
        has_disability: formData.hasDisability,
        service_type: formData.serviceType,
        household_size: formData.householdSize,
        elderly_count: formData.hasElderly ? 'Yes' : 'No',
        solar_panel_type: formData.solarPanelType,
        watt_level: formData.wattLevel,
        status: 'Pending Woreda Review',
        details_json: JSON.stringify(formData)
      };

      const res = await fetch('http://localhost:8000/api/demands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        toast.success("Demand Registration Submitted Successfully!");
        window.location.reload();
      }
    } catch (e) {
      console.error(e);
      toast.error("Error submitting demand registration");
    }
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const renderStepIndicator = () => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 mb-6 w-full max-w-4xl mx-auto flex items-center justify-between relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -z-10 -translate-y-4"></div>
      {STEPS.map((step, index) => {
        const isCompleted = currentStep > step.id;
        const isActive = currentStep === step.id;
        
        return (
          <div key={step.id} className="flex flex-col items-center gap-2 bg-white px-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors ${
              isCompleted ? 'bg-emerald-500 border-emerald-500 text-white' :
              isActive ? 'bg-blue-600 border-blue-600 text-white' :
              'bg-slate-50 border-slate-200 text-slate-400'
            }`}>
              {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : step.id}
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-wider ${
              isActive ? 'text-blue-600' : isCompleted ? 'text-emerald-500' : 'text-slate-400'
            }`}>
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );

  const Step1 = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h4 className="text-xl font-bold text-slate-800 mb-1">Personal Information</h4>
        <p className="text-slate-500 text-sm">Enter the basic information of the person requesting solar equipment.</p>
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-semibold text-slate-700">Full Name *</label>
            {errors.fullName && <span className="text-red-500 text-xs">Required</span>}
          </div>
          <input 
            type="text" 
            placeholder="e.g. Abebe Bikila"
            className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.fullName}
            onChange={(e) => updateFormData('fullName', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-semibold text-slate-700">National ID *</label>
            {errors.nationalId && <span className="text-red-500 text-xs">Required</span>}
          </div>
          <input 
            type="text" 
            placeholder="ET-XX-000-0000"
            className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.nationalId}
            onChange={(e) => updateFormData('nationalId', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-semibold text-slate-700">Phone Number *</label>
            {errors.phoneNumber && <span className="text-red-500 text-xs">Required</span>}
          </div>
          <input 
            type="text" 
            placeholder="+251 9..."
            className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.phoneNumber}
            onChange={(e) => updateFormData('phoneNumber', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-semibold text-slate-700">Gender *</label>
            {errors.gender && <span className="text-red-500 text-xs">Required</span>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="gender"
                value="male"
                checked={formData.gender === 'male'}
                onChange={(e) => updateFormData('gender', e.target.value)}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-700">Male</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="gender"
                value="female"
                checked={formData.gender === 'female'}
                onChange={(e) => updateFormData('gender', e.target.value)}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-700">Female</span>
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-semibold text-slate-700">Disability Status *</label>
            {errors.hasDisability && <span className="text-red-500 text-xs">Required</span>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="disability"
                value="no"
                checked={formData.hasDisability === 'no'}
                onChange={(e) => updateFormData('hasDisability', e.target.value)}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-700">No Disability</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="disability"
                value="yes"
                checked={formData.hasDisability === 'yes'}
                onChange={(e) => updateFormData('hasDisability', e.target.value)}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-700">Has Disability</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const Step2 = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-2 text-red-500 font-bold mb-4">
        <MapPin className="w-5 h-5" />
        <h4 className="text-lg text-slate-800">Location Information</h4>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-semibold text-slate-700">Zone</label>
          </div>
          <div className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-600">
            {selectedScope.zone}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-semibold text-slate-700">Woreda</label>
          </div>
          <div className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-600">
            {selectedScope.woreda}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-semibold text-slate-700">Kebele *</label>
            {errors.kebele && <span className="text-red-500 text-xs">Required</span>}
          </div>
          <input 
            type="text" 
            placeholder="Kebele number or name"
            className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.kebele}
            onChange={(e) => updateFormData('kebele', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-semibold text-slate-700">Village / Locality *</label>
            {errors.village && <span className="text-red-500 text-xs">Required</span>}
          </div>
          <input 
            type="text" 
            placeholder="Village name"
            className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.village}
            onChange={(e) => updateFormData('village', e.target.value)}
          />
        </div>

        <div className="space-y-3 col-span-2">
          <div className="flex justify-between">
            <label className="text-sm font-semibold text-slate-700">Service Type *</label>
            {errors.serviceType && <span className="text-red-500 text-xs">Required</span>}
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer bg-white border border-slate-200 p-3 rounded-xl flex-1 hover:border-blue-500 transition-colors">
              <input 
                type="radio" 
                name="serviceType"
                value="Home/Lantern"
                checked={formData.serviceType === 'Home/Lantern'}
                onChange={(e) => updateFormData('serviceType', e.target.value)}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-semibold text-slate-700">Home/Lantern</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer bg-white border border-slate-200 p-3 rounded-xl flex-1 hover:border-blue-500 transition-colors">
              <input 
                type="radio" 
                name="serviceType"
                value="Institution"
                checked={formData.serviceType === 'Institution'}
                onChange={(e) => updateFormData('serviceType', e.target.value)}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-semibold text-slate-700">Institution</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer bg-white border border-slate-200 p-3 rounded-xl flex-1 hover:border-blue-500 transition-colors">
              <input 
                type="radio" 
                name="serviceType"
                value="Off-Grid"
                checked={formData.serviceType === 'Off-Grid'}
                onChange={(e) => updateFormData('serviceType', e.target.value)}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-semibold text-slate-700">Off-Grid</span>
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-semibold text-slate-700">Household Size *</label>
            {errors.householdSize && <span className="text-red-500 text-xs">Required</span>}
          </div>
          <input 
            type="number" 
            placeholder="Number of people in household"
            className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.householdSize}
            onChange={(e) => updateFormData('householdSize', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-semibold text-slate-700">Has Elderly Members (60+ years)?</label>
          </div>
          <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border border-slate-200 bg-white hover:border-blue-500 transition-colors w-full">
            <input 
              type="checkbox" 
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              checked={formData.hasElderly}
              onChange={(e) => updateFormData('hasElderly', e.target.checked)}
            />
            <span className="text-sm font-semibold text-slate-700">Yes, elderly persons present</span>
          </label>
        </div>
      </div>
    </div>
  );

  const Step3 = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-2 text-purple-600 font-bold mb-4">
        <Zap className="w-5 h-5" />
        <h4 className="text-lg text-slate-800">Solar Requirements</h4>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-semibold text-slate-700">Solar Panel Type *</label>
            {errors.solarPanelType && <span className="text-red-500 text-xs">Required</span>}
          </div>
          <select 
            className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
            value={formData.solarPanelType}
            onChange={(e) => updateFormData('solarPanelType', e.target.value)}
          >
            <option value="">Select...</option>
            <option value="Home Solar System">Home Solar System</option>
            <option value="Solar Lantern">Solar Lantern</option>
            <option value="Solar Water Pump">Solar Water Pump</option>
            <option value="Solar Street Light">Solar Street Light</option>
            <option value="Solar Refrigerator">Solar Refrigerator</option>
          </select>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-semibold text-slate-700">Watt Level *</label>
            {errors.wattLevel && <span className="text-red-500 text-xs">Required</span>}
          </div>
          <select 
            className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
            value={formData.wattLevel}
            onChange={(e) => updateFormData('wattLevel', e.target.value)}
          >
            <option value="">Select...</option>
            <option value="10W">10W - Small Lantern</option>
            <option value="20W">20W - Medium Lantern</option>
            <option value="50W">50W - Home System Basic</option>
            <option value="100W">100W - Home System Standard</option>
            <option value="200W">200W - Home System Premium</option>
            <option value="300W">300W - Small Business</option>
            <option value="500W">500W - Medium Business</option>
            <option value="1000W">1000W - Large Business</option>
            <option value="2000W">2000W - Small Institution</option>
            <option value="5000W">5000W - Large Institution</option>
          </select>
        </div>
      </div>

      <div className="col-span-2 space-y-2 mt-4">
        <label className="text-sm font-semibold text-slate-700">Upload ID Document</label>
        <div className="grid grid-cols-2 gap-4">
          <label className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center gap-2 hover:bg-slate-50 hover:border-blue-300 transition-colors cursor-pointer text-blue-600">
            <input type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => updateFormData('idPhoto', e.target.files[0])} />
            <UploadCloud className={`w-6 h-6 ${formData.idPhoto ? 'text-emerald-500' : 'text-slate-400'}`} />
            <span className="text-sm font-semibold text-slate-700">{formData.idPhoto ? 'ID Uploaded' : 'National ID'}</span>
            <span className="text-xs truncate max-w-full text-center px-2">{formData.idPhoto ? formData.idPhoto.name : 'Click or tap to scan ID'}</span>
          </label>
        </div>
      </div>
    </div>
  );

  const Step4 = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-2 text-emerald-500 font-bold mb-4">
        <CheckCircle2 className="w-5 h-5" />
        <h4 className="text-lg text-slate-800">Review & Submit</h4>
      </div>

      <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6">
        <div className="mb-6">
          <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider block mb-1">DEMAND REGISTRATION</span>
          <h5 className="text-blue-900 text-lg font-bold">Solar Equipment Demand</h5>
        </div>

        <div className="grid grid-cols-2 gap-y-6">
          <div>
            <span className="text-xs text-blue-500 block mb-1">Full Name</span>
            <span className="font-bold text-blue-900">{formData.fullName || '-'}</span>
          </div>
          <div>
            <span className="text-xs text-blue-500 block mb-1">National ID</span>
            <span className="font-bold text-blue-900">{formData.nationalId || '-'}</span>
          </div>
          <div>
            <span className="text-xs text-blue-500 block mb-1">Phone Number</span>
            <span className="font-bold text-blue-900">{formData.phoneNumber || '-'}</span>
          </div>
          <div>
            <span className="text-xs text-blue-500 block mb-1">Zone</span>
            <span className="font-bold text-blue-900">{formData.zone || '-'}</span>
          </div>
          <div>
            <span className="text-xs text-blue-500 block mb-1">Woreda</span>
            <span className="font-bold text-blue-900">{formData.woreda || '-'}</span>
          </div>
          <div>
            <span className="text-xs text-blue-500 block mb-1">Kebele</span>
            <span className="font-bold text-blue-900">{formData.kebele || '-'}</span>
          </div>
          <div>
            <span className="text-xs text-blue-500 block mb-1">Village</span>
            <span className="font-bold text-blue-900">{formData.village || '-'}</span>
          </div>
          <div>
            <span className="text-xs text-blue-500 block mb-1">Solar Panel Type</span>
            <span className="font-bold text-blue-900">{formData.solarPanelType || '-'}</span>
          </div>
          <div>
            <span className="text-xs text-blue-500 block mb-1">Watt Level</span>
            <span className="font-bold text-blue-900">{formData.wattLevel || '-'}</span>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex gap-3 text-yellow-800 text-sm">
        <AlertTriangle className="w-5 h-5 shrink-0 text-yellow-600" />
        <p>By submitting, you confirm that all entered information is accurate. This demand registration will be reviewed by the Woreda Approver.</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-slate-800">Demand Registration</h3>
        <p className="text-slate-500">Register solar equipment demand for review and approval</p>
      </div>

      {renderStepIndicator()}

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 mb-6">
        <div className="min-h-[400px]">
          {currentStep === 1 && Step1()}
          {currentStep === 2 && Step2()}
          {currentStep === 3 && Step3()}
          {currentStep === 4 && Step4()}
        </div>
        
        <div className="mt-10 flex items-center justify-between border-t border-slate-100 pt-6">
          <button 
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              currentStep === 1 
                ? 'opacity-0 pointer-events-none' 
                : 'text-slate-500 hover:bg-slate-50 border border-slate-200 hover:text-slate-800'
            }`}
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>

          <div className="flex gap-2">
            {[1, 2, 3, 4].map(step => (
              <div 
                key={step} 
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentStep === step ? 'w-6 bg-blue-600' : 
                  currentStep > step ? 'w-2 bg-emerald-500' : 'w-2 bg-slate-200'
                }`}
              />
            ))}
          </div>

          {currentStep < 4 ? (
            <button 
              onClick={nextStep}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all"
            >
              Next Step <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button 
              onClick={submitForm}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 transition-all"
            >
              <Send className="w-4 h-4" /> Submit Demand
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterDemand;
