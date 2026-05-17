import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { 
  CheckCircle2, ChevronLeft, ChevronRight, Send, 
  Sun, Building2, Zap, MapPin, User, Package, Settings, 
  UploadCloud, AlertTriangle,
  ClipboardList
} from 'lucide-react';

const STEPS = [
  { id: 1, label: 'Survey Type', icon: ClipboardList },
  { id: 2, label: 'Location', icon: MapPin },
  { id: 3, label: 'Beneficiary Info', icon: User },
  { id: 4, label: 'Equipment Details', icon: Package },
  { id: 5, label: 'Review', icon: CheckCircle2 }
];

const RegisterBeneficiary = ({ selectedScope, initialData, onCompleted }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [isGroupRegistration, setIsGroupRegistration] = useState(false);
  const [groupSize, setGroupSize] = useState(1);
  const [savedForms, setSavedForms] = useState([]);
  const [currentFormIndex, setCurrentFormIndex] = useState(0);
  const [suppliersList, setSuppliersList] = useState([]);
  const [agentsList, setAgentsList] = useState([]);
  
  useEffect(() => {
    fetch('http://localhost:8000/api/suppliers')
      .then(res => res.json())
      .then(data => setSuppliersList(Array.isArray(data) ? data : []))
      .catch(console.error);
      
    fetch('http://localhost:8000/api/agents')
      .then(res => res.json())
      .then(data => setAgentsList(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);
  
  const [formData, setFormData] = useState({
    surveyType: initialData?.survey_type || '',
    zone: initialData?.zone || selectedScope.zone,
    woreda: initialData?.woreda || selectedScope.woreda,
    kebele: initialData?.kebele || '',
    village: initialData?.village || '',
    latitude: '',
    longitude: '',
    fullName: initialData?.full_name || '',
    nationalId: initialData?.national_id || '',
    phoneNumber: initialData?.phone || '',
    gender: '',
    disability: '',
    elderlyCount: '',
    householdSize: '',
    monthlyIncome: '',
    institutionName: '',
    institutionType: '',
    representativeName: '',
    representativePhone: '',
    intendedUsage: '',
    monthlyIncomeSource: '',
    lightingSource: '',
    energyNeeds: '',
    electricityAccess: 'Yes',
    devices: [],
    equipmentType: initialData?.equipment_type || 'Home Solar System',
    serialNumber: '',
    assignedSupplier: initialData?.supplier || '',
    unitPrice: '',
    guarantee: '',
    guaranteePeriod: '',
    installationDate: '',
    installerName: '',
    salePrice: '',
    batteryCapacity: '',
    comments: '',
    idPhoto: null,
    proofPhoto: null,
    offGridType: '',
    projectCapacity: '',
    projectCost: '',
    solarPanelType: '',
    noOfSolarPanel: '',
    solarPanelManufacture: '',
    solarPanelModel: '',
    batteryType: '',
    noOfBattery: '',
    batteryManufacture: '',
    batteryModel: '',
    systemVoltage: '',
    totalEnergyOfBattery: '',
    inverterType: '',
    inverterManufacture: '',
    inverterMode: '',
    noOfInverter: '',
    inverterCapacity: '',
    breakerBoard: '',
    hydroPowerType: '',
    minimumFlow: '',
    hydroHead: '',
    estimatedPowerOutput: '',
    windTurbineType: '',
    rotorDiameter: '',
    hubHeight: '',
    ratedPower: ''
  });

    const nextStep = () => {
    const newErrors = {};
    if (currentStep === 1) {
      if (!formData.surveyType) newErrors.surveyType = "Required";
      if (formData.surveyType === 'Off-Grid' && !formData.offGridType) newErrors.offGridType = "Required";
    } else if (currentStep === 2) {
      if (!formData.zone) newErrors.zone = "Required";
      if (!formData.woreda) newErrors.woreda = "Required";
      if (!formData.kebele) newErrors.kebele = "Required";
      if (!formData.village) newErrors.village = "Required";
      if (!formData.latitude) newErrors.latitude = "Required";
      if (!formData.longitude) newErrors.longitude = "Required";
    } else if (currentStep === 3) {
      if (formData.surveyType === 'Institution') {
        if (!formData.institutionName) newErrors.institutionName = "Required";
        if (!formData.institutionType) newErrors.institutionType = "Required";
        if (!formData.representativeName) newErrors.representativeName = "Required";
        if (!formData.representativePhone) newErrors.representativePhone = "Required";
        if (!formData.intendedUsage) newErrors.intendedUsage = "Required";
        if (!formData.monthlyIncomeSource) newErrors.monthlyIncomeSource = "Required";
      } else {
        if (!formData.fullName) newErrors.fullName = "Required";
        if (!formData.nationalId) newErrors.nationalId = "Required";
        if (!formData.phoneNumber) newErrors.phoneNumber = "Required";
        if (!formData.gender) newErrors.gender = "Required";
        if (!formData.householdSize) newErrors.householdSize = "Required";
        if (!formData.monthlyIncome) newErrors.monthlyIncome = "Required";
        if (!formData.lightingSource) newErrors.lightingSource = "Required";
        if (!formData.energyNeeds) newErrors.energyNeeds = "Required";
        if (!formData.electricityAccess) newErrors.electricityAccess = "Required";
        if (formData.devices.length === 0) newErrors.devices = "Required";
      }
    } else if (currentStep === 4) {
      if (formData.surveyType === 'Home/Lantern') {
        if (!formData.equipmentType) newErrors.equipmentType = "Required";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setCurrentStep(prev => Math.min(prev + 1, 5));
  };
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const submitForm = async () => {
    try {
      // Handle group registration logic for Home/Lantern
      if (formData.surveyType === 'Home/Lantern' && isGroupRegistration) {
        // Save current form to savedForms array
        const newForm = { ...formData };
        setSavedForms(prev => [...prev, newForm]);
        
        // Check if we need to continue with more forms
        if (currentFormIndex + 1 < groupSize) {
          // Move to next form
          setCurrentFormIndex(prev => prev + 1);
          // Reset form data but keep survey type and location
          const resetData = {
            ...formData,
            fullName: '',
            nationalId: '',
            phoneNumber: '',
            gender: '',
            householdSize: '',
            monthlyIncome: '',
            lightingSource: '',
            energyNeeds: '',
            electricityAccess: 'Yes',
            devices: [],
            equipmentType: 'Home Solar System',
            comments: '',
            idPhoto: null,
            proofPhoto: null
          };
          setFormData(resetData);
          // Go back to step 1
          setCurrentStep(1);
          toast.error(`Form ${currentFormIndex + 1} saved! Now filling form ${currentFormIndex + 2} of ${groupSize}.`);
          return;
        } else {
          // All forms are completed, submit all saved forms
          const allForms = [...savedForms, formData];
          
          for (const form of allForms) {
            const payload = {
              full_name: form.fullName,
              national_id: form.nationalId || '-',
              phone: form.phoneNumber || '-',
              gender: form.gender,
              household_size: form.householdSize,
              zone: selectedScope.zone,
              woreda: selectedScope.woreda,
              kebele: form.kebele,
              village: form.village,
              survey_type: form.surveyType,
              equipment_type: form.equipmentType,
              supplier: form.assignedSupplier,
              status: 'Pending Woreda',
              details_json: JSON.stringify(form)
            };

            const res = await fetch('http://localhost:8000/api/beneficiaries', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            });
            
            if (!res.ok) {
              throw new Error(`Failed to submit form for ${form.fullName}`);
            }
          }
          
          toast.error(`Successfully registered ${groupSize} beneficiaries!`);
          if (onCompleted) onCompleted();
          else window.location.reload();
          return;
        }
      }

      // Normal single form submission
      const payload = {
        full_name: formData.fullName || formData.institutionName || formData.representativeName,
        national_id: formData.nationalId || '-',
        phone: formData.phoneNumber || formData.representativePhone || '-',
        gender: formData.gender,
        household_size: formData.householdSize,
        zone: selectedScope.zone,
        woreda: selectedScope.woreda,
        kebele: formData.kebele,
        village: formData.village,
        survey_type: formData.surveyType,
        equipment_type: formData.equipmentType,
        supplier: formData.assignedSupplier,
        status: 'Pending Woreda',
        details_json: JSON.stringify(formData)
      };

      const res = await fetch('http://localhost:8000/api/beneficiaries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        toast.success("Beneficiary Successfully Registered!");
        
        // Use an additional endpoint to resolve the demand if this came from a demand
        if (initialData && initialData.id) {
          try {
            await fetch(`http://localhost:8000/api/demands/${initialData.id}/status`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status: 'Resolved to Beneficiary' })
            });
          } catch (err) { console.error(err); }
        }

        if (onCompleted) onCompleted();
        else window.location.reload();
      }
    } catch (e) {
      console.error(e);
      toast.error("Error submitting form");
    }
  };

    const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const toggleDevice = (device) => {
    setFormData(prev => {
      const devices = prev.devices.includes(device)
        ? prev.devices.filter(d => d !== device)
        : [...prev.devices, device];
      return { ...prev, devices };
    });
    setErrors(prev => ({ ...prev, devices: undefined }));
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
        <h4 className="text-xl font-bold text-slate-800 mb-1">What survey data are you collecting?</h4>
        <p className="text-slate-500 text-sm">Select the type of beneficiary or installation you are registering.</p>
      </div>
      
      <div className="grid gap-4 mt-6">
        {errors.surveyType && <p className="text-red-500 text-xs mt-1 mb-2 flex items-center gap-1"><AlertTriangle className="w-3 h-3"/> {errors.surveyType}</p>}
        {[
          { id: 'Home/Lantern', icon: Sun, desc: 'Individual household solar system or solar lantern distribution' },
          { id: 'Institution', icon: Building2, desc: 'School, health post, hospital, government office or mosque' },
          { id: 'Off-Grid', icon: Zap, desc: 'Community solar grid, hydro power, or wind energy project' }
        ].map(type => (
          <div key={type.id}>
            <button
              onClick={() => updateFormData('surveyType', type.id)}
              className={`flex w-full items-start gap-4 p-5 rounded-xl border-2 text-left transition-all ${
                formData.surveyType === type.id 
                  ? 'border-blue-500 bg-blue-50/50 shadow-md shadow-blue-500/10' 
                  : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className={`p-3 rounded-lg ${formData.surveyType === type.id ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                <type.icon className="w-6 h-6" />
              </div>
              <div>
                <h5 className={`font-bold ${formData.surveyType === type.id ? 'text-blue-900' : 'text-slate-700'}`}>{type.id}</h5>
                <p className="text-slate-500 text-sm mt-1">{type.desc}</p>
              </div>
            </button>
            {type.id === 'Off-Grid' && formData.surveyType === 'Off-Grid' && (
              <div className="ml-16 mt-4">
                {errors.offGridType && <p className="text-red-500 text-xs mt-1 mb-2 flex items-center gap-1"><AlertTriangle className="w-3 h-3"/> {errors.offGridType}</p>}
                <div className="grid grid-cols-3 gap-3 animate-in fade-in slide-in-from-top-2">
                  {['Solar Grid', 'Hydro Power', 'Wind'].map(ogt => (
                  <button
                    key={ogt}
                    onClick={() => updateFormData('offGridType', ogt)}
                    className={`p-3 text-sm font-semibold rounded-xl border-2 transition-all ${
                      formData.offGridType === ogt
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {ogt}
                  </button>
                ))}
                </div>
              </div>
            )}
          </div>
        ))}
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
          <div className="flex justify-between"><label className="text-sm font-semibold text-slate-700">Zone *</label>{errors.zone && <span className="text-red-500 text-xs">Required</span>}</div>
          <select 
            className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            value={selectedScope.zone}
            disabled
          >
            <option value={selectedScope.zone}>{selectedScope.zone}</option>
          </select>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between"><label className="text-sm font-semibold text-slate-700">Woreda *</label>{errors.woreda && <span className="text-red-500 text-xs">Required</span>}</div>
          <select 
            className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            value={selectedScope.woreda}
            disabled
          >
            <option value={selectedScope.woreda}>{selectedScope.woreda}</option>
          </select>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between"><label className="text-sm font-semibold text-slate-700">Kebele *</label>{errors.kebele && <span className="text-red-500 text-xs">Required</span>}</div>
          <input 
            type="text" 
            placeholder="Kebele number or name"
            className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.kebele}
            onChange={(e) => updateFormData('kebele', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between"><label className="text-sm font-semibold text-slate-700">Village / Locality *</label>{errors.village && <span className="text-red-500 text-xs">Required</span>}</div>
          <input 
            type="text" 
            placeholder="Village name"
            className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.village}
            onChange={(e) => updateFormData('village', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between"><label className="text-sm font-semibold text-slate-700">GPS Latitude *</label>{errors.latitude && <span className="text-red-500 text-xs">Required</span>}</div>
          <input 
            type="text" 
            placeholder="e.g. 12.9697"
            className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.latitude}
            onChange={(e) => updateFormData('latitude', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between"><label className="text-sm font-semibold text-slate-700">GPS Longitude *</label>{errors.longitude && <span className="text-red-500 text-xs">Required</span>}</div>
          <input 
            type="text" 
            placeholder="e.g. 37.7621"
            className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.longitude}
            onChange={(e) => updateFormData('longitude', e.target.value)}
          />
        </div>
      </div>
    </div>
  );

  const Step3 = () => {
    if (formData.surveyType === 'Institution') {
      return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div>
            <div className="flex items-center gap-2 text-purple-600 font-bold mb-4">
              <Building2 className="w-5 h-5" />
              <h4 className="text-lg text-slate-800">Institution Information</h4>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between"><label className="text-sm font-semibold text-slate-700">Institution Name *</label>{errors.institutionName && <span className="text-red-500 text-xs">Required</span>}</div>
                <input 
                  type="text" 
                  placeholder="e.g. Dabat Primary School"
                  className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={formData.institutionName}
                  onChange={(e) => updateFormData('institutionName', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between"><label className="text-sm font-semibold text-slate-700">Institution Type *</label>{errors.institutionType && <span className="text-red-500 text-xs">Required</span>}</div>
                <select 
                  className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                  value={formData.institutionType}
                  onChange={(e) => updateFormData('institutionType', e.target.value)}
                >
                  <option value="">Select...</option>
                  <option value="School">School</option>
                  <option value="Health Post">Health Post</option>
                  <option value="Health Center">Health Center</option>
                  <option value="Hospital">Hospital</option>
                  <option value="Government Office">Government Office</option>
                  <option value="Mosque">Mosque</option>
                  <option value="Church">Church</option>
                  <option value="Market">Market</option>
                </select>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between"><label className="text-sm font-semibold text-slate-700">Representative Name *</label>{errors.representativeName && <span className="text-red-500 text-xs">Required</span>}</div>
                <input 
                  type="text" 
                  placeholder="Name of institution head"
                  className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={formData.representativeName}
                  onChange={(e) => updateFormData('representativeName', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between"><label className="text-sm font-semibold text-slate-700">Representative Phone *</label>{errors.representativePhone && <span className="text-red-500 text-xs">Required</span>}</div>
                <input 
                  type="text" 
                  placeholder="+251 9..."
                  className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={formData.representativePhone}
                  onChange={(e) => updateFormData('representativePhone', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between"><label className="text-sm font-semibold text-slate-700">Intended Usage *</label>{errors.intendedUsage && <span className="text-red-500 text-xs">Required</span>}</div>
                <input 
                  type="text" 
                  placeholder="e.g. Classroom lighting and computer lab"
                  className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={formData.intendedUsage}
                  onChange={(e) => updateFormData('intendedUsage', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between"><label className="text-sm font-semibold text-slate-700">Monthly Income Source *</label>{errors.monthlyIncomeSource && <span className="text-red-500 text-xs">Required</span>}</div>
                <select 
                  className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                  value={formData.monthlyIncomeSource}
                  onChange={(e) => updateFormData('monthlyIncomeSource', e.target.value)}
                >
                  <option value="">Select...</option>
                  <option value="Government Budget">Government Budget</option>
                  <option value="NGO/Donor">NGO/Donor</option>
                  <option value="Community Contribution">Community Contribution</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <div className="flex items-center gap-2 text-blue-500 font-bold mb-4">
          <User className="w-5 h-5" />
          <h4 className="text-lg text-slate-800">Customer Information</h4>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex justify-between"><label className="text-sm font-semibold text-slate-700">Full Name *</label>{errors.fullName && <span className="text-red-500 text-xs">Required</span>}</div>
            <input 
              type="text" 
              placeholder="e.g. Abebe Bikila"
              className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.fullName}
              onChange={(e) => updateFormData('fullName', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between"><label className="text-sm font-semibold text-slate-700">National ID *</label>{errors.nationalId && <span className="text-red-500 text-xs">Required</span>}</div>
            <input 
              type="text" 
              placeholder="ET-XX-000-0000"
              className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.nationalId}
              onChange={(e) => updateFormData('nationalId', e.target.value)}
            />
          </div>
          <div className="space-y-2">
             <div className="flex justify-between"><label className="text-sm font-semibold text-slate-700">Phone Number *</label>{errors.phoneNumber && <span className="text-red-500 text-xs">Required</span>}</div>
             <input 
              type="text" 
              placeholder="+251 9..."
              className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.phoneNumber}
              onChange={(e) => updateFormData('phoneNumber', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between"><label className="text-sm font-semibold text-slate-700">Gender *</label>{errors.gender && <span className="text-red-500 text-xs">Required</span>}</div>
            <select 
              className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              value={formData.gender}
              onChange={(e) => updateFormData('gender', e.target.value)}
            >
              <option value="">Select...</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between"><label className="text-sm font-semibold text-slate-700">Household Size *</label>{errors.householdSize && <span className="text-red-500 text-xs">Required</span>}</div>
            <select 
              className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              value={formData.householdSize}
              onChange={(e) => updateFormData('householdSize', e.target.value)}
            >
              <option value="">Select...</option>
              <option value="2-4">2-4</option>
              <option value="5+">5+</option>
            </select>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between"><label className="text-sm font-semibold text-slate-700">Estimated Monthly Income *</label>{errors.monthlyIncome && <span className="text-red-500 text-xs">Required</span>}</div>
            <select 
              className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              value={formData.monthlyIncome}
              onChange={(e) => updateFormData('monthlyIncome', e.target.value)}
            >
              <option value="">Select...</option>
              <option value="< 5000">Less than 5,000 ETB</option>
              <option value="5000-10000">5,000 - 10,000 ETB</option>
              <option value="> 10000">Above 10,000 ETB</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Energy Usage</h5>
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <div className="flex justify-between"><label className="text-sm font-semibold text-slate-700">Current Lighting Source *</label>{errors.lightingSource && <span className="text-red-500 text-xs">Required</span>}</div>
            <select 
              className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              value={formData.lightingSource}
              onChange={(e) => updateFormData('lightingSource', e.target.value)}
            >
              <option value="">Select...</option>
              <option value="Kerosene">Kerosene</option>
              <option value="Candles">Candles</option>
              <option value="None">None</option>
            </select>
          </div>
           <div className="space-y-2">
            <div className="flex justify-between"><label className="text-sm font-semibold text-slate-700">Daily Energy Needs *</label>{errors.energyNeeds && <span className="text-red-500 text-xs">Required</span>}</div>
            <select 
              className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              value={formData.energyNeeds}
              onChange={(e) => updateFormData('energyNeeds', e.target.value)}
            >
              <option value="">Select...</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <label className="text-sm font-semibold text-slate-700">Current Electricity Access *</label>
          {errors.electricityAccess && <p className="text-red-500 text-xs mb-2 flex items-center gap-1 w-full"><AlertTriangle className="w-3 h-3"/> {errors.electricityAccess}</p>}
          <div className="flex gap-2">
            <button 
              onClick={() => updateFormData('electricityAccess', 'Yes')}
              className={`flex-1 py-3 font-semibold rounded-xl border ${formData.electricityAccess === 'Yes' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
            >Yes</button>
             <button 
              onClick={() => updateFormData('electricityAccess', 'No')}
               className={`flex-1 py-3 font-semibold rounded-xl border ${formData.electricityAccess === 'No' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
            >No</button>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-700">Devices Used (select all that apply) *</label>
          {errors.devices && <p className="text-red-500 text-xs mb-2 w-full flex items-center gap-1"><AlertTriangle className="w-3 h-3"/> {errors.devices}</p>}
          <div className="flex flex-wrap gap-2">
            {['Phone Charging', 'Radio', 'TV', 'Fan', 'Refrigerator', 'Medical Equipment', 'Water Pump', 'Computer'].map(device => (
              <button
                key={device}
                onClick={() => toggleDevice(device)}
                className={`px-4 py-2 rounded-xl border text-sm font-medium transition-colors ${
                  formData.devices.includes(device) 
                    ? 'border-blue-500 bg-blue-500 text-white shadow-md shadow-blue-500/20' 
                    : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {device}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

  const Step4 = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
       <div className="flex items-center gap-2 text-purple-600 font-bold mb-4">
        <Package className="w-5 h-5" />
        <h4 className="text-lg text-slate-800">Equipment Details</h4>
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-6">
         {formData.surveyType === 'Home/Lantern' && (
         <div className="col-span-2 space-y-2">
          <label className="text-sm font-semibold text-slate-700">Equipment Type *</label>
          <div className="flex gap-2">
            {errors.equipmentType && <p className="text-red-500 text-xs mb-2 flex items-center gap-1 w-full"><AlertTriangle className="w-3 h-3"/> {errors.equipmentType}</p>}
            <button 
              onClick={() => updateFormData('equipmentType', 'Home Solar System')}
              className={`flex-1 py-3 px-4 font-semibold rounded-xl border flex items-center justify-center gap-2 ${formData.equipmentType === 'Home Solar System' ? 'border-blue-300 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
            >
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${formData.equipmentType === 'Home Solar System' ? 'border-blue-500' : 'border-slate-300'}`}>
                {formData.equipmentType === 'Home Solar System' && <div className="w-2 h-2 rounded-full bg-blue-500" />}
              </div>
              Home Solar System
            </button>
            <button 
              onClick={() => updateFormData('equipmentType', 'Solar Lantern')}
              className={`flex-1 py-3 px-4 font-semibold rounded-xl border flex items-center justify-center gap-2 ${formData.equipmentType === 'Solar Lantern' ? 'border-blue-300 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
             >
               <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${formData.equipmentType === 'Solar Lantern' ? 'border-blue-500' : 'border-slate-300'}`}>
                {formData.equipmentType === 'Solar Lantern' && <div className="w-2 h-2 rounded-full bg-blue-500" />}
              </div>
              Solar Lantern
            </button>
          </div>
        </div>
        )}

        {/* Additional Home/Lantern Equipment Details */}
        {formData.surveyType === 'Home/Lantern' && (
          <>
            <div className="space-y-2">
              <div className="flex justify-between"><label className="text-sm font-semibold text-slate-700">Serial Number</label></div>
              <input 
                type="text" 
                placeholder="Enter serial number"
                className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.serialNumber}
                onChange={(e) => updateFormData('serialNumber', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between"><label className="text-sm font-semibold text-slate-700">Assigned Supplier</label></div>
              <select 
                className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                value={formData.assignedSupplier}
                onChange={(e) => updateFormData('assignedSupplier', e.target.value)}
              >
                <option value="">Select Supplier</option>
                {suppliersList.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between"><label className="text-sm font-semibold text-slate-700">Unit Price (ETB)</label></div>
              <input 
                type="number" 
                placeholder="Enter unit price"
                className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.unitPrice}
                onChange={(e) => updateFormData('unitPrice', e.target.value)}
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-700">Guarantee</label>
              <div className="flex gap-2">
                <button 
                  onClick={() => updateFormData('guarantee', 'Guarantee')}
                  className={`flex-1 py-3 font-semibold rounded-xl border ${formData.guarantee === 'Guarantee' ? 'border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                >Guarantee</button>
                <button 
                  onClick={() => updateFormData('guarantee', 'No Guarantee')}
                  className={`flex-1 py-3 font-semibold rounded-xl border ${formData.guarantee === 'No Guarantee' ? 'border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                >No Guarantee</button>
              </div>
            </div>

            {formData.guarantee === 'Guarantee' && (
              <div className="space-y-2">
                <div className="flex justify-between"><label className="text-sm font-semibold text-slate-700">Guarantee Period (Years)</label></div>
                <select 
                  className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  value={formData.guaranteePeriod}
                  onChange={(e) => updateFormData('guaranteePeriod', e.target.value)}
                >
                  <option value="">Select...</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="5">5</option>
                </select>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex justify-between"><label className="text-sm font-semibold text-slate-700">Installation Date</label></div>
              <input 
                type="date"
                className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-600"
                value={formData.installationDate}
                onChange={(e) => updateFormData('installationDate', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between"><label className="text-sm font-semibold text-slate-700">Installer / Agent Name</label></div>
              <select 
                className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                value={formData.installerName}
                onChange={(e) => updateFormData('installerName', e.target.value)}
              >
                <option value="">Select Agent</option>
                {agentsList.map(a => <option key={a.id} value={a.name}>{a.name}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between"><label className="text-sm font-semibold text-slate-700">Sale Price (ETB)</label></div>
              <input 
                type="number"
                className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.salePrice}
                onChange={(e) => updateFormData('salePrice', e.target.value)}
              />
            </div>
          </>
        )}

        {/* Off-Grid Project Details */}
        {formData.surveyType === 'Off-Grid' && (
          <div className="col-span-2 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-2 text-emerald-500 font-bold mb-6 border-b pb-4">
             <Zap className="w-6 h-6" />
             <h4 className="text-xl text-slate-800">Project Technical Details</h4>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between"><label className="text-sm font-semibold text-slate-700">Project Capacity (KW)</label></div>
                <input type="number" className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500" value={formData.projectCapacity} onChange={(e) => updateFormData('projectCapacity', e.target.value)} />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between"><label className="text-sm font-semibold text-slate-700">Project Cost</label></div>
                <input type="number" className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500" value={formData.projectCost} onChange={(e) => updateFormData('projectCost', e.target.value)} />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between"><label className="text-sm font-semibold text-slate-700">Date of Installation / Construction Year</label></div>
                <input type="text" className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500" value={formData.installationDate} onChange={(e) => updateFormData('installationDate', e.target.value)} />
              </div>

              {formData.offGridType === 'Hydro Power' && (
                <>
                  <div className="space-y-2">
                    <div className="flex justify-between"><label className="text-sm font-semibold text-slate-700">Hydro Power Type</label></div>
                    <select className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500" value={formData.hydroPowerType} onChange={(e) => updateFormData('hydroPowerType', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="Run-of-River">Run-of-River</option>
                      <option value="Storage">Storage</option>
                      <option value="Pumped Storage">Pumped Storage</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between"><label className="text-sm font-semibold text-slate-700">Minimum Flow (m³/s)</label></div>
                    <input type="number" className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500" value={formData.minimumFlow} onChange={(e) => updateFormData('minimumFlow', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between"><label className="text-sm font-semibold text-slate-700">Hydro Head (m)</label></div>
                    <input type="number" className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500" value={formData.hydroHead} onChange={(e) => updateFormData('hydroHead', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between"><label className="text-sm font-semibold text-slate-700">Estimated Power Output (KW)</label></div>
                    <input type="number" className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500" value={formData.estimatedPowerOutput} onChange={(e) => updateFormData('estimatedPowerOutput', e.target.value)} />
                  </div>
                </>
              )}

              {formData.offGridType === 'Solar Grid' && (
                <>
                  <div className="space-y-2">
                    <div className="flex justify-between"><label className="text-sm font-semibold text-slate-700">Solar Panel Type</label></div>
                    <select className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500" value={formData.solarPanelType} onChange={(e) => updateFormData('solarPanelType', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="Monocrystalline">Monocrystalline</option>
                      <option value="Polycrystalline">Polycrystalline</option>
                      <option value="Thin-Film">Thin-Film</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between"><label className="text-sm font-semibold text-slate-700">Number of Solar Panels</label></div>
                    <input type="number" className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500" value={formData.noOfSolarPanel} onChange={(e) => updateFormData('noOfSolarPanel', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between"><label className="text-sm font-semibold text-slate-700">Solar Panel Manufacturer</label></div>
                    <input type="text" className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500" value={formData.solarPanelManufacture} onChange={(e) => updateFormData('solarPanelManufacture', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between"><label className="text-sm font-semibold text-slate-700">Solar Panel Model</label></div>
                    <input type="text" className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500" value={formData.solarPanelModel} onChange={(e) => updateFormData('solarPanelModel', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between"><label className="text-sm font-semibold text-slate-700">Battery Type</label></div>
                    <select className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500" value={formData.batteryType} onChange={(e) => updateFormData('batteryType', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="Lithium-ion">Lithium-ion</option>
                      <option value="Lead-Acid">Lead-Acid</option>
                      <option value="Nickel-Cadmium">Nickel-Cadmium</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between"><label className="text-sm font-semibold text-slate-700">Number of Batteries</label></div>
                    <input type="number" className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500" value={formData.noOfBattery} onChange={(e) => updateFormData('noOfBattery', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between"><label className="text-sm font-semibold text-slate-700">Battery Manufacturer</label></div>
                    <input type="text" className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500" value={formData.batteryManufacture} onChange={(e) => updateFormData('batteryManufacture', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between"><label className="text-sm font-semibold text-slate-700">Battery Model</label></div>
                    <input type="text" className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500" value={formData.batteryModel} onChange={(e) => updateFormData('batteryModel', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between"><label className="text-sm font-semibold text-slate-700">System Voltage</label></div>
                    <select className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500" value={formData.systemVoltage} onChange={(e) => updateFormData('systemVoltage', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="12V">12V</option>
                      <option value="24V">24V</option>
                      <option value="48V">48V</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between"><label className="text-sm font-semibold text-slate-700">Total Energy of Battery (kWh)</label></div>
                    <input type="number" className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500" value={formData.totalEnergyOfBattery} onChange={(e) => updateFormData('totalEnergyOfBattery', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between"><label className="text-sm font-semibold text-slate-700">Inverter Type</label></div>
                    <select className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500" value={formData.inverterType} onChange={(e) => updateFormData('inverterType', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="String Inverter">String Inverter</option>
                      <option value="Micro Inverter">Micro Inverter</option>
                      <option value="Power Optimizer">Power Optimizer</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between"><label className="text-sm font-semibold text-slate-700">Inverter Manufacturer</label></div>
                    <input type="text" className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500" value={formData.inverterManufacture} onChange={(e) => updateFormData('inverterManufacture', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between"><label className="text-sm font-semibold text-slate-700">Inverter Mode</label></div>
                    <select className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500" value={formData.inverterMode} onChange={(e) => updateFormData('inverterMode', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="On-Grid">On-Grid</option>
                      <option value="Off-Grid">Off-Grid</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between"><label className="text-sm font-semibold text-slate-700">Number of Inverters</label></div>
                    <input type="number" className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500" value={formData.noOfInverter} onChange={(e) => updateFormData('noOfInverter', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between"><label className="text-sm font-semibold text-slate-700">Inverter Capacity (kW)</label></div>
                    <input type="number" className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500" value={formData.inverterCapacity} onChange={(e) => updateFormData('inverterCapacity', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between"><label className="text-sm font-semibold text-slate-700">Breaker Board</label></div>
                    <select className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500" value={formData.breakerBoard} onChange={(e) => updateFormData('breakerBoard', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="Single Phase">Single Phase</option>
                      <option value="Three Phase">Three Phase</option>
                    </select>
                  </div>
                </>
              )}

              {formData.offGridType === 'Wind' && (
                <>
                  <div className="space-y-2">
                    <div className="flex justify-between"><label className="text-sm font-semibold text-slate-700">Wind Turbine Type</label></div>
                    <select className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500" value={formData.windTurbineType} onChange={(e) => updateFormData('windTurbineType', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="Horizontal Axis">Horizontal Axis</option>
                      <option value="Vertical Axis">Vertical Axis</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between"><label className="text-sm font-semibold text-slate-700">Rotor Diameter (m)</label></div>
                    <input type="number" className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500" value={formData.rotorDiameter} onChange={(e) => updateFormData('rotorDiameter', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between"><label className="text-sm font-semibold text-slate-700">Hub Height (m)</label></div>
                    <input type="number" className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500" value={formData.hubHeight} onChange={(e) => updateFormData('hubHeight', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between"><label className="text-sm font-semibold text-slate-700">Rated Power (kW)</label></div>
                    <input type="number" className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500" value={formData.ratedPower} onChange={(e) => updateFormData('ratedPower', e.target.value)} />
                  </div>
                </>
              )}
            </div>
          </div>
        )}

       <div className="col-span-2 space-y-2 mt-4">
           <label className="text-sm font-semibold text-slate-700">Upload Documents</label>
          <div className="grid grid-cols-2 gap-4">
             <label className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center gap-2 hover:bg-slate-50 hover:border-blue-300 transition-colors cursor-pointer text-blue-600">
               <input type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => updateFormData('idPhoto', e.target.files[0])} />
               <UploadCloud className={`w-6 h-6 ${formData.idPhoto ? 'text-emerald-500' : 'text-slate-400'}`} />
               <span className="text-sm font-semibold text-slate-700">{formData.idPhoto ? 'ID Uploaded' : 'National ID'}</span>
               <span className="text-xs truncate max-w-full text-center px-2">{formData.idPhoto ? formData.idPhoto.name : 'Click or tap to scan ID'}</span>
             </label>
             <label className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center gap-2 hover:bg-slate-50 hover:border-blue-300 transition-colors cursor-pointer text-blue-600">
               <input type="file" accept="image/*, application/pdf" className="hidden" onChange={(e) => updateFormData('proofPhoto', e.target.files[0])} />
               <UploadCloud className={`w-6 h-6 ${formData.proofPhoto ? 'text-emerald-500' : 'text-slate-400'}`} />
               <span className="text-sm font-semibold text-slate-700">{formData.proofPhoto ? 'Document Uploaded' : 'Proof of Residence'}</span>
               <span className="text-xs truncate max-w-full text-center px-2">{formData.proofPhoto ? formData.proofPhoto.name : 'Click to upload proof'}</span>
             </label>
          </div>
        </div>
      </div>
    </div>
  );

  
  const Step6 = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-2 text-emerald-500 font-bold mb-4">
        <CheckCircle2 className="w-5 h-5" />
        <h4 className="text-lg text-slate-800">Review & Submit</h4>
      </div>

      <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6">
        <div className="mb-6">
          <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider block mb-1">SURVEY CLASSIFICATION</span>
          <h5 className="text-blue-900 text-lg font-bold">{formData.surveyType || 'Not Selected'}</h5>
        </div>

        <div className="grid grid-cols-2 gap-y-6">
          <div>
            <span className="text-xs text-blue-500 block mb-1">Zone</span>
            <span className="font-bold text-blue-900">{formData.zone || '-'}</span>
          </div>
          <div>
            <span className="text-xs text-blue-500 block mb-1">Woreda</span>
            <span className="font-bold text-blue-900">{formData.woreda || '-'}</span>
          </div>
           <div>
            <span className="text-xs text-blue-500 block mb-1">Beneficiary / Institution</span>
            <span className="font-bold text-blue-900">{formData.surveyType === 'Institution' ? formData.institutionName : formData.fullName || '-'}</span>
          </div>
           <div>
            <span className="text-xs text-blue-500 block mb-1">Equipment Type</span>
            <span className="font-bold text-blue-900">{formData.surveyType === 'Off-Grid' ? formData.offGridType : formData.surveyType === 'Home/Lantern' ? formData.equipmentType : '-'}</span>
          </div>
           <div>
            <span className="text-xs text-blue-500 block mb-1">Serial Number</span>
            <span className="font-bold text-blue-900">{formData.serialNumber || '-'}</span>
          </div>
           <div>
            <span className="text-xs text-blue-500 block mb-1">Supplier</span>
            <span className="font-bold text-blue-900">{formData.assignedSupplier || '-'}</span>
          </div>
           <div>
            <span className="text-xs text-blue-500 block mb-1">Guarantee</span>
            <span className="font-bold text-blue-900">{formData.guarantee || '-'}</span>
          </div>
           <div>
            <span className="text-xs text-blue-500 block mb-1">Unit Price</span>
            <span className="font-bold text-blue-900">{formData.unitPrice ? `ETB ${formData.unitPrice}` : '-'}</span>
          </div>
        </div>
      </div>

      {/* Group Registration Section - Only for Home/Lantern */}
      {formData.surveyType === 'Home/Lantern' && (
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-purple-600" />
            <h5 className="font-bold text-purple-900">Group Registration (Optional)</h5>
          </div>
          <p className="text-sm text-purple-700 mb-4">
            Register multiple beneficiaries from the same neighborhood or group. 
            The form will be saved and you can fill it out for each person.
          </p>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="text-sm font-semibold text-purple-700 block mb-2">
                Number of People in Group
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={groupSize}
                onChange={(e) => setGroupSize(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full p-3 rounded-xl border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                placeholder="Enter number of people"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="groupRegistration"
                checked={isGroupRegistration}
                onChange={(e) => setIsGroupRegistration(e.target.checked)}
                className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
              />
              <label htmlFor="groupRegistration" className="text-sm font-medium text-purple-700">
                Enable group registration
              </label>
            </div>
          </div>
          {isGroupRegistration && (
            <div className="mt-4 p-3 bg-purple-100 rounded-lg">
              <p className="text-sm text-purple-800">
                <strong>Progress:</strong> {currentFormIndex + 1} of {groupSize} forms completed
              </p>
            </div>
          )}
        </div>
      )}

      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex gap-3 text-yellow-800 text-sm">
        <AlertTriangle className="w-5 h-5 shrink-0 text-yellow-600" />
        <p>By submitting, you confirm that all entered data is accurate. The record will go to the Woreda Approver for review.</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-slate-800">Beneficiary Registration & Survey</h3>
        <p className="text-slate-500">Multi-step smart survey with conditional logic</p>
      </div>

      {renderStepIndicator()}

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 mb-6">
        <div className="min-h-[400px]">
          {currentStep === 1 && Step1()}
          {currentStep > 1 && !['Home/Lantern', 'Institution', 'Off-Grid'].includes(formData.surveyType) ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 py-20">
              <AlertTriangle className="w-12 h-12 mb-4 text-blue-300" />
              <h3 className="text-xl font-bold text-slate-700">Form Not Available</h3>
              <p>The registration flow for '{formData.surveyType}' is currently under construction.</p>
            </div>
          ) : (
            <>
              {currentStep === 2 && Step2()}
              {currentStep === 3 && Step3()}
              {currentStep === 4 && Step4()}
              {currentStep === 5 && Step6()}
            </>
          )}
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
            {[1, 2, 3, 4, 5].map(step => (
              <div 
                key={step} 
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentStep === step ? 'w-6 bg-blue-600' : 
                  currentStep > step ? 'w-2 bg-emerald-500' : 'w-2 bg-slate-200'
                }`}
              />
            ))}
          </div>

          {(currentStep > 1 && !['Home/Lantern', 'Institution', 'Off-Grid'].includes(formData.surveyType)) ? (
            <div className="px-6 py-3 opacity-0 pointer-events-none">Placeholder</div>
          ) : currentStep < 5 ? (
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
              <Send className="w-4 h-4" /> Submit Survey
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterBeneficiary;
