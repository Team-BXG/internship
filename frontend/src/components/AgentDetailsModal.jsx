import React from 'react';
import { X, User, MapPin } from 'lucide-react';
import { formatRegisteredDate } from '../utils/detailViewHelpers';
import { DetailSection, DetailRow } from './DetailFieldGrid';

const AgentDetailsModal = ({ agent, onClose }) => {
  if (!agent) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h3 className="text-xl font-bold text-slate-800">{agent.name}</h3>
            <p className="text-sm text-slate-500 mt-1">Registered {formatRegisteredDate(agent.created_at)}</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          <div className="grid grid-cols-1 gap-6">
            <DetailSection title="Agent Information" icon={User} iconClass="text-blue-500">
              <DetailRow label="Full Name" value={agent.name} />
              <DetailRow label="National ID" value={agent.national_id} />
              <DetailRow label="Phone" value={agent.phone} />
              <DetailRow label="Email" value={agent.email} />
            </DetailSection>
            <DetailSection title="Assignment" icon={MapPin} iconClass="text-emerald-500">
              <DetailRow label="Zone" value={agent.zone_name} />
              <DetailRow label="Registered Date" value={formatRegisteredDate(agent.created_at)} />
            </DetailSection>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDetailsModal;
