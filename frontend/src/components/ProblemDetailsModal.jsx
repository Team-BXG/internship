import React, { useMemo } from 'react';
import { X, AlertOctagon, User, Wrench } from 'lucide-react';
import { parseDetailsJson, formatRegisteredDate, collectDocumentEntries } from '../utils/detailViewHelpers';
import { DetailSection, DetailRow, DocumentsSection } from './DetailFieldGrid';

const ProblemDetailsModal = ({ problem, onClose, actionConfig = [] }) => {
  if (!problem) return null;

  const details = useMemo(() => parseDetailsJson(problem), [problem]);
  const documents = collectDocumentEntries(details);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h3 className="text-xl font-bold text-slate-800">{problem.title || 'Reported Issue'}</h3>
            <p className="text-sm font-medium text-slate-500 mt-1">
              Status: {problem.status || '-'} • Registered {formatRegisteredDate(problem.created_at)}
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DetailSection title="Issue Details" icon={AlertOctagon} iconClass="text-red-500">
              <DetailRow label="Problem Level" value={problem.title} />
              <DetailRow label="Equipment Type" value={problem.equipment} />
              <DetailRow label="Serial Number" value={problem.serial_number || details.serialNumber} />
              <DetailRow label="Main Cause" value={problem.category || details.mainCause} />
              <DetailRow label="Problem Description" value={details.problemDescription} />
              <DetailRow label="Installation Date" value={details.installationDate} />
              <DetailRow label="Non-Functional Date" value={details.nonFunctionalDate || (problem.occurred_date ? formatRegisteredDate(problem.occurred_date) : null)} />
              <DetailRow label="Supplier" value={problem.supplier || details.supplier} />
            </DetailSection>

            <DetailSection title="Contact & Location" icon={User} iconClass="text-blue-500">
              <DetailRow label="Beneficiary Name" value={problem.beneficiary_name} />
              <DetailRow label="Zone" value={problem.zone || problem.zone_name} />
              <DetailRow label="Woreda" value={problem.woreda || problem.woreda_name} />
              <DetailRow label="Kebele" value={problem.kebele} />
              <DetailRow label="Submitted By" value={problem.submitted_by} />
              <DetailRow label="Registered Date" value={formatRegisteredDate(problem.created_at)} />
            </DetailSection>

            {(problem.status === 'Fixed' || problem.fixed_date) && (
              <DetailSection title="Resolution" icon={Wrench} iconClass="text-amber-500">
                <DetailRow label="Status" value={problem.status} />
                <DetailRow label="Fixed Date" value={problem.fixed_date ? formatRegisteredDate(problem.fixed_date) : null} />
                <DetailRow label="Days Unfunctional" value={problem.days_unfunctional} />
              </DetailSection>
            )}

            <DocumentsSection documents={documents} />
          </div>
        </div>

        {actionConfig.length > 0 && (
          <div className="p-6 border-t border-slate-100 bg-slate-50">
            <h4 className="font-bold text-slate-700 mb-4 text-sm uppercase tracking-wider">Available Actions</h4>
            <div className="flex gap-3 flex-wrap">
              {actionConfig.map((action, i) => (
                <button
                  key={i}
                  onClick={() => { action.onClick(problem); if (action.keepOpen !== true) onClose(); }}
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

export default ProblemDetailsModal;
