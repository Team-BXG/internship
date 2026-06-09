import React, { useMemo } from 'react';
import { X, User, MapPin, Zap } from 'lucide-react';
import { parseDetailsJson, formatRegisteredDate, collectDocumentEntries } from '../utils/detailViewHelpers';
import { DetailSection, DetailRow, DocumentsSection } from './DetailFieldGrid';

const DemandDetailsModal = ({ demand, onClose }) => {
  if (!demand) return null;

  const details = useMemo(() => parseDetailsJson(demand), [demand]);
  const documents = collectDocumentEntries(details);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h3 className="text-xl font-bold text-slate-800">{demand.full_name || 'Demand Record'}</h3>
            <p className="text-sm font-medium text-slate-500 mt-1">
              Registered {formatRegisteredDate(demand.created_at)}
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DetailSection title="Personal Info" icon={User} iconClass="text-emerald-500">
              <DetailRow label="Full Name" value={demand.full_name} />
              <DetailRow label="National ID" value={demand.national_id} />
              <DetailRow label="Phone" value={demand.phone} />
              <DetailRow label="Gender" value={demand.gender || details.gender} />
              <DetailRow label="Has Disability" value={demand.has_disability ?? details.hasDisability} />
              <DetailRow label="Household Size" value={demand.household_size || details.householdSize} />
              <DetailRow label="Has Elderly" value={demand.elderly_count > 0 || details.hasElderly ? 'Yes' : details.hasElderly === false ? 'No' : null} />
            </DetailSection>

            <DetailSection title="Location" icon={MapPin} iconClass="text-blue-500">
              <DetailRow label="Zone" value={demand.zone || demand.zone_name} />
              <DetailRow label="Woreda" value={demand.woreda || demand.woreda_name} />
              <DetailRow label="Kebele" value={demand.kebele} />
              <DetailRow label="Village" value={demand.village} />
            </DetailSection>

            <DetailSection title="Solar Requirements" icon={Zap} iconClass="text-amber-500">
              <DetailRow label="Service Type" value={demand.service_type || details.serviceType} />
              <DetailRow label="Solar Panel Type" value={demand.solar_panel_type || details.solarPanelType} />
              <DetailRow label="Watt Level" value={demand.watt_level || details.wattLevel} />
            </DetailSection>

            <DocumentsSection documents={documents} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemandDetailsModal;
