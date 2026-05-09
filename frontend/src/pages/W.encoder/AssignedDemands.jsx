import React, { useState, useEffect } from 'react';
import { 
  User, CheckCircle2, AlertTriangle, RefreshCw, 
  Eye, ArrowRight, Clock, MapPin, Zap
} from 'lucide-react';
import RegisterBeneficiary from './Register Beneficiary';

const AssignedDemands = ({ selectedScope }) => {
  const [assignedDemands, setAssignedDemands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDemand, setSelectedDemand] = useState(null);
  const [showBeneficiaryModal, setShowBeneficiaryModal] = useState(false);
  const [beneficiaryData, setBeneficiaryData] = useState({});

  useEffect(() => {
    fetchAssignedDemands();
  }, []);

  const fetchAssignedDemands = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8000/api/demands?zone=${selectedScope.zone}&woreda=${selectedScope.woreda}&status=Assigned`);
      
      if (response.ok) {
        const data = await response.json();
        setAssignedDemands(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error fetching assigned demands:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterBeneficiary = (demand) => {
    // Auto-fill beneficiary data based on demand
    const autoFilledData = {
      full_name: demand.full_name,
      national_id: demand.national_id,
      phone: demand.phone,
      zone: demand.zone,
      woreda: demand.woreda,
      kebele: demand.kebele,
      village: demand.village,
      // Auto-select survey type based on service type
      survey_type: demand.service_type === 'home_lantern' ? 'Home/Lantern' : 
                 demand.service_type === 'institution' ? 'Institution' : 'Off-Grid',
      // Auto-select equipment type based on solar panel type
      equipment_type: demand.solar_panel_type,
      // Set supplier if available
      supplier: demand.assigned_supplier_id || '',
      id: demand.id
    };

    setBeneficiaryData(autoFilledData);
    setSelectedDemand(demand);
    setShowBeneficiaryModal(true);
  };

  // We no longer need this as RegisterBeneficiary handles its own submission
  const handleBeneficiarySubmit = async (formData) => {};

  const getStatusColor = (status) => {
    switch (status) {
      case 'Assigned to Supplier': return 'bg-purple-100 text-purple-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getServiceTypeDisplay = (serviceType) => {
    switch (serviceType) {
      case 'home_lantern': return 'Home/Lantern';
      case 'institution': return 'Institution';
      case 'off_grid': return 'Off-Grid';
      default: return serviceType;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading assigned demands...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-slate-800">Assigned Demands</h3>
          <p className="text-slate-500">Demands assigned to suppliers for your area</p>
        </div>
        <button 
          onClick={fetchAssignedDemands}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Assigned Demands List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100">
        <div className="p-4 border-b border-slate-100">
          <h4 className="font-semibold text-slate-800 flex items-center gap-2">
            <User className="w-5 h-5 text-purple-600" />
            Your Assigned Demands
          </h4>
          <p className="text-sm text-slate-500">Demands returned from head office with assigned suppliers</p>
        </div>
        
        <div className="divide-y divide-slate-100">
          {assignedDemands.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">No Assigned Demands</h3>
              <p className="text-slate-500">You don't have any demands assigned to suppliers yet.</p>
            </div>
          ) : (
            assignedDemands.map((demand, index) => (
              <div key={demand.id} className="p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getStatusColor(demand.status)}`}>
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-800">{demand.full_name}</h4>
                        <p className="text-sm text-slate-600">{demand.zone} - {demand.woreda}</p>
                        <div className="flex items-center gap-4 text-sm text-slate-500">
                          <span className="flex items-center gap-1">
                            <Zap className="w-4 h-4" />
                            {demand.solar_panel_type} ({demand.watt_level})
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {new Date(demand.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm text-slate-600">
                      <div>
                        <span className="font-medium">Service Type:</span> {getServiceTypeDisplay(demand.service_type)}
                      </div>
                      <div>
                        <span className="font-medium">Phone:</span> {demand.phone}
                      </div>
                      <div>
                        <span className="font-medium">Kebele:</span> {demand.kebele}
                      </div>
                      <div>
                        <span className="font-medium">Village:</span> {demand.village}
                      </div>
                    </div>

                    {demand.status === 'Needs Adjustment' && (
                      <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <p className="text-sm font-medium text-amber-800 mb-1">Adjustment Required:</p>
                        <p className="text-sm text-slate-700">
                          {JSON.parse(demand.details_json || '{}').adjustment_comments || 'Please review and make necessary adjustments.'}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <button 
                      onClick={() => handleRegisterBeneficiary(demand)}
                      className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Register Beneficiary
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Beneficiary Registration Drop-In */}
      {showBeneficiaryModal && selectedDemand && (
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-blue-50 border-b border-blue-100 p-4 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-blue-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" /> Registering Beneficiary from Demand
              </h3>
              <p className="text-sm text-blue-700">Information from the demand phase has been pre-filled.</p>
            </div>
            <button 
              onClick={() => { setShowBeneficiaryModal(false); setSelectedDemand(null); }}
              className="px-4 py-2 bg-white text-slate-600 rounded-lg shadow-sm hover:bg-slate-50 transition border border-slate-200"
            >
              Cancel Registration
            </button>
          </div>
          <div className="p-6">
            <RegisterBeneficiary 
              selectedScope={selectedScope} 
              initialData={beneficiaryData}
              onCompleted={() => {
                setShowBeneficiaryModal(false);
                setSelectedDemand(null);
                fetchAssignedDemands();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignedDemands;
