import React, { useMemo } from 'react';
import { X, User, MapPin, Package, FileText, Upload, File } from 'lucide-react';

const BeneficiaryDetailsModal = ({ beneficiary, onClose, onAction, actionConfig }) => {
  if (!beneficiary) return null;

  const details = useMemo(() => {
    if (typeof beneficiary.details_json === 'string' && beneficiary.details_json.length > 2) {
      try { return JSON.parse(beneficiary.details_json); } catch (e) { return {}; }
    }
    return beneficiary.details_json || {};
  }, [beneficiary.details_json]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h3 className="text-xl font-bold text-slate-800">{beneficiary.full_name || 'Unknown Beneficiary'}</h3>
            <p className="text-sm font-medium text-slate-500 mt-1">
               {beneficiary.national_id || 'No ID'} • {beneficiary.survey_type || 'Survey'} • {new Date(beneficiary.created_at).toISOString().split('T')[0]}
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Personal Info */}
            <div className="bg-white border text-sm border-slate-100 rounded-xl p-5 shadow-sm">
              <h4 className="flex items-center gap-2 font-bold text-slate-700 mb-4 pb-2 border-b border-slate-50">
                <User className="w-4 h-4 text-emerald-500" /> Personal Info
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between"><span className="text-slate-500">Full Name</span><span className="font-semibold text-slate-800">{beneficiary.full_name}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">National ID</span><span className="font-semibold text-slate-800">{beneficiary.national_id || '-'}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Phone</span><span className="font-semibold text-slate-800">{beneficiary.phone || '-'}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Gender</span><span className="font-semibold text-slate-800">{beneficiary.gender || '-'}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Household Size</span><span className="font-semibold text-slate-800">{beneficiary.household_size || '-'}</span></div>
              </div>
            </div>

            {/* Location */}
            <div className="bg-white border text-sm border-slate-100 rounded-xl p-5 shadow-sm">
              <h4 className="flex items-center gap-2 font-bold text-slate-700 mb-4 pb-2 border-b border-slate-50">
                <MapPin className="w-4 h-4 text-blue-500" /> Location
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between"><span className="text-slate-500">Zone</span><span className="font-semibold text-slate-800">{beneficiary.zone || '-'}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Woreda</span><span className="font-semibold text-slate-800">{beneficiary.woreda || '-'}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Kebele</span><span className="font-semibold text-slate-800">{beneficiary.kebele || '01'}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Village</span><span className="font-semibold text-slate-800">{beneficiary.village || '-'}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">GPS Coordinates</span><span className="font-semibold text-blue-600 font-mono text-xs">{details.latitude && details.longitude ? `${details.latitude}, ${details.longitude}` : '-'}</span></div>
              </div>
            </div>

            {/* Equipment Info */}
            <div className="bg-white border text-sm border-slate-100 rounded-xl p-5 shadow-sm">
              <h4 className="flex items-center gap-2 font-bold text-slate-700 mb-4 pb-2 border-b border-slate-50">
                <Package className="w-4 h-4 text-amber-500" /> Equipment Information
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between"><span className="text-slate-500">Equipment Type</span><span className="font-semibold text-slate-800">{beneficiary.equipment_type || '-'}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Equipment Status</span><span className="font-semibold text-slate-800">Functional</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Guarantee Status</span><span className="font-semibold text-slate-800">{details.guarantee || 'Under Guarantee'}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Assigned Supplier</span><span className="font-semibold text-slate-800">{beneficiary.supplier || '-'}</span></div>
              </div>
            </div>

            {/* Survey Answers */}
            <div className="bg-white border text-sm border-slate-100 rounded-xl p-5 shadow-sm">
              <h4 className="flex items-center gap-2 font-bold text-slate-700 mb-4 pb-2 border-b border-slate-50">
                <FileText className="w-4 h-4 text-purple-500" /> Survey Answers
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between"><span className="text-slate-500">Monthly Income</span><span className="font-semibold text-slate-800">{details.monthlyIncome || '-'} ETB</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Current Electricity</span><span className="font-semibold text-slate-800">{details.electricityAccess || 'No'}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Lighting Source</span><span className="font-semibold text-slate-800">{details.lightingSource || 'Candle'}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Daily Energy Needs</span><span className="font-semibold text-slate-800">{details.energyNeeds || '2-4 hours'}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Devices Used</span><span className="font-semibold text-slate-800">{(details.devices || []).join(', ') || '-'}</span></div>
              </div>
            </div>

            {/* Uploaded Documents */}
            <div className="col-span-1 md:col-span-2 bg-white border text-sm border-slate-100 rounded-xl p-5 shadow-sm mt-2">
              <h4 className="flex items-center gap-2 font-bold text-slate-700 mb-4 pb-2 border-b border-slate-50">
                <Upload className="w-4 h-4 text-blue-500" /> Uploaded Documents
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {details.documents && details.documents.length > 0 ? (
                  details.documents.map((doc, idx) => (
                    <div key={idx} className="border border-slate-200 rounded-lg p-4 flex flex-col items-center justify-center gap-2 hover:bg-slate-50 transition-colors cursor-pointer">
                      <File className="w-6 h-6 text-blue-400" />
                      <span className="font-semibold text-slate-700 text-center text-xs">{doc.name || 'Document'}</span>
                      <span className="text-[10px] text-emerald-500 font-bold uppercase">Uploaded</span>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-4 flex flex-col items-center justify-center text-slate-400">
                    <File className="w-8 h-8 mb-2 opacity-50" />
                    <span className="text-sm font-semibold">No Upload</span>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Action Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50">
           <h4 className="font-bold text-slate-700 mb-4 text-sm uppercase tracking-wider">Review Actions</h4>
           <div className="flex gap-3">
              {actionConfig.length === 0 ? (
                <p className="text-sm text-slate-500">No review actions available for this status.</p>
              ) : actionConfig.map((action, i) => (
                <button 
                  key={i} 
                  onClick={() => { action.onClick(beneficiary); if (action.keepOpen !== true) onClose(); }} 
                  className={`px-6 py-2.5 rounded-lg font-bold text-sm shadow-sm transition-all active:scale-95 ${action.className}`}
                >
                  {action.label}
                </button>
              ))}
           </div>
        </div>

      </div>
    </div>
  );
};

export default BeneficiaryDetailsModal;
