import React, { useMemo } from 'react';
import { X, User, MapPin, Package, FileText } from 'lucide-react';
import { parseDetailsJson, formatRegisteredDate, collectDocumentEntries } from '../utils/detailViewHelpers';
import { DetailSection, DetailRow, DocumentsSection } from './DetailFieldGrid';

const BeneficiaryDetailsModal = ({ beneficiary, onClose, actionConfig = [] }) => {
  if (!beneficiary) return null;

  const details = useMemo(() => parseDetailsJson(beneficiary), [beneficiary]);
  const surveyType = beneficiary.survey_type || details.surveyType || '';
  const documents = collectDocumentEntries(details);

  const gps =
    details.latitude && details.longitude
      ? `${details.latitude}, ${details.longitude}`
      : beneficiary.latitude && beneficiary.longitude
        ? `${beneficiary.latitude}, ${beneficiary.longitude}`
        : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h3 className="text-xl font-bold text-slate-800">{beneficiary.full_name || 'Unknown Beneficiary'}</h3>
            <p className="text-sm font-medium text-slate-500 mt-1">
              {surveyType || 'Registration'} • Registered {formatRegisteredDate(beneficiary.created_at)}
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DetailSection title="Location" icon={MapPin} iconClass="text-blue-500">
              <DetailRow label="Zone" value={beneficiary.zone || beneficiary.zone_name || details.zone} />
              <DetailRow label="Woreda" value={beneficiary.woreda || beneficiary.woreda_name || details.woreda} />
              <DetailRow label="Kebele" value={beneficiary.kebele || details.kebele} />
              <DetailRow label="Village" value={beneficiary.village || details.village} />
              <DetailRow label="GPS Coordinates" value={gps} />
            </DetailSection>

            {surveyType === 'Institution' && (
              <DetailSection title="Institution Information" icon={FileText} iconClass="text-purple-500">
                <DetailRow label="Institution Name" value={details.institutionName} />
                <DetailRow label="Institution Type" value={details.institutionType} />
                <DetailRow label="Representative Name" value={details.representativeName} />
                <DetailRow label="Representative Phone" value={details.representativePhone} />
                <DetailRow label="Intended Usage" value={details.intendedUsage} />
                <DetailRow label="Monthly Income Source" value={details.monthlyIncomeSource} />
              </DetailSection>
            )}

            {surveyType === 'Off-Grid' && (
              <DetailSection title="Off-Grid Project" icon={Package} iconClass="text-emerald-500">
                <DetailRow label="Project Type" value={details.offGridType} />
                <DetailRow label="Project Capacity (KW)" value={details.projectCapacity} />
                <DetailRow label="Project Cost" value={details.projectCost} />
                <DetailRow label="Installation / Construction Year" value={details.installationDate} />
                <DetailRow label="Hydro Power Type" value={details.hydroPowerType} />
                <DetailRow label="Minimum Flow (m³/s)" value={details.minimumFlow} />
                <DetailRow label="Hydro Head (m)" value={details.hydroHead} />
                <DetailRow label="Estimated Power Output (KW)" value={details.estimatedPowerOutput} />
                <DetailRow label="Solar Panel Type" value={details.solarPanelType} />
                <DetailRow label="No. of Solar Panels" value={details.noOfSolarPanel} />
                <DetailRow label="Solar Panel Manufacturer" value={details.solarPanelManufacture} />
                <DetailRow label="Solar Panel Model" value={details.solarPanelModel} />
                <DetailRow label="Battery Type" value={details.batteryType} />
                <DetailRow label="No. of Batteries" value={details.noOfBattery} />
                <DetailRow label="Inverter Type" value={details.inverterType} />
                <DetailRow label="Inverter Capacity" value={details.inverterCapacity} />
                <DetailRow label="Wind Turbine Type" value={details.windTurbineType} />
                <DetailRow label="Rated Power" value={details.ratedPower} />
              </DetailSection>
            )}

            {(surveyType === 'Home/Lantern' || !surveyType) && (
              <>
                <DetailSection title="Personal Info" icon={User} iconClass="text-emerald-500">
                  <DetailRow label="Full Name" value={beneficiary.full_name || details.fullName} />
                  <DetailRow label="National ID" value={beneficiary.national_id || details.nationalId} />
                  <DetailRow label="Phone" value={beneficiary.phone || details.phoneNumber} />
                  <DetailRow label="Gender" value={beneficiary.gender || details.gender} />
                  <DetailRow label="Disability" value={details.disability} />
                  <DetailRow label="Household Size" value={beneficiary.household_size || details.householdSize} />
                  <DetailRow label="Elderly Count" value={details.elderlyCount} />
                </DetailSection>

                <DetailSection title="Survey Answers" icon={FileText} iconClass="text-purple-500">
                  <DetailRow label="Monthly Income" value={details.monthlyIncome ? `${details.monthlyIncome} ETB` : null} />
                  <DetailRow label="Current Electricity" value={details.electricityAccess} />
                  <DetailRow label="Lighting Source" value={details.lightingSource} />
                  <DetailRow label="Daily Energy Needs" value={details.energyNeeds} />
                  <DetailRow label="Devices Used" value={details.devices} />
                </DetailSection>
              </>
            )}

            <DetailSection title="Equipment & Assignment" icon={Package} iconClass="text-amber-500">
              <DetailRow label="Survey Type" value={surveyType} />
              <DetailRow label="Equipment Type" value={beneficiary.equipment_type || details.equipmentType} />
              <DetailRow label="Serial Number" value={details.serialNumber} />
              <DetailRow label="Supplier" value={beneficiary.supplier || details.assignedSupplier} />
              <DetailRow label="Contractor" value={details.selectedContractor} />
              <DetailRow label="Unit Price" value={details.unitPrice} />
              <DetailRow label="Sale Price" value={details.salePrice} />
              <DetailRow label="Guarantee" value={details.guarantee} />
              <DetailRow label="Guarantee Period" value={details.guaranteePeriod} />
              <DetailRow label="Installation Date" value={details.installationDate} />
              <DetailRow label="Installer / Agent" value={details.installerName} />
              <DetailRow label="Battery Capacity" value={details.batteryCapacity} />
              <DetailRow label="Comments" value={details.comments} />
            </DetailSection>

            <DocumentsSection documents={documents} />
          </div>
        </div>

        {actionConfig.length > 0 && (
          <div className="p-6 border-t border-slate-100 bg-slate-50">
            <h4 className="font-bold text-slate-700 mb-4 text-sm uppercase tracking-wider">Review Actions</h4>
            <div className="flex gap-3 flex-wrap">
              {actionConfig.map((action, i) => (
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
        )}
      </div>
    </div>
  );
};

export default BeneficiaryDetailsModal;
