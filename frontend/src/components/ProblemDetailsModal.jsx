import React from 'react';
import { X, Wrench, AlertOctagon, MapPin, FileText, User } from 'lucide-react';

const ProblemDetailsModal = ({ problem, onClose, actionConfig }) => {
  if (!problem) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h3 className="text-xl font-bold text-slate-800">{problem.title || 'Reported Issue'}</h3>
            <div className="flex items-center gap-3 mt-2">
               <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                 problem.urgency === 'High' ? 'bg-red-100 text-red-700' :
                 problem.urgency === 'Medium' ? 'bg-orange-100 text-orange-700' :
                 'bg-blue-100 text-blue-700'
               }`}>{problem.urgency} Urgency</span>
               <span className="text-xs font-semibold text-slate-500 uppercase">{problem.category}</span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="bg-white border text-sm border-slate-100 rounded-xl p-5 shadow-sm">
              <h4 className="flex items-center gap-2 font-bold text-slate-700 mb-4 pb-2 border-b border-slate-50">
                <AlertOctagon className="w-4 h-4 text-red-500" /> Issue Details
              </h4>
              <div className="space-y-3">
                <div className="flex flex-col"><span className="text-slate-500 text-xs mb-1">Equipment Name</span><span className="font-semibold text-slate-800">{problem.equipment || '-'}</span></div>
                <div className="flex flex-col"><span className="text-slate-500 text-xs mb-1">Serial Number</span><span className="font-semibold text-slate-800">{problem.serial_number || '-'}</span></div>
                <div className="flex flex-col"><span className="text-slate-500 text-xs mb-1">Description</span><span className="font-semibold text-slate-700">{problem.title} requires immediate attention by the technical team to ensure continuous function.</span></div>
              </div>
            </div>

            <div className="bg-white border text-sm border-slate-100 rounded-xl p-5 shadow-sm">
              <h4 className="flex items-center gap-2 font-bold text-slate-700 mb-4 pb-2 border-b border-slate-50">
                <User className="w-4 h-4 text-blue-500" /> Contact Info
              </h4>
              <div className="space-y-3">
                <div className="flex flex-col"><span className="text-slate-500 text-xs mb-1">Beneficiary Name</span><span className="font-semibold text-slate-800">{problem.beneficiary_name || '-'}</span></div>
                <div className="flex flex-col"><span className="text-slate-500 text-xs mb-1">Location</span><span className="font-semibold text-slate-800">{problem.zone}, {problem.woreda}, {problem.kebele}</span></div>
                <div className="flex flex-col"><span className="text-slate-500 text-xs mb-1">Submitted By</span><span className="font-semibold text-slate-800">{problem.submitted_by || '-'}</span></div>
                <div className="flex flex-col"><span className="text-slate-500 text-xs mb-1">Reported On</span><span className="font-semibold text-slate-800">{new Date(problem.created_at).toISOString().split('T')[0]}</span></div>
              </div>
            </div>

             <div className="col-span-1 md:col-span-2 bg-white border text-sm border-slate-100 rounded-xl p-5 shadow-sm mt-2">
              <h4 className="flex items-center gap-2 font-bold text-slate-700 mb-4 pb-2 border-b border-slate-50">
                <Wrench className="w-4 h-4 text-amber-500" /> System Status Log
              </h4>
              <div className="p-4 bg-slate-50 rounded-lg font-mono text-xs text-slate-600">
                 [ {new Date(problem.created_at).toISOString().split('T')[0]} 08:30 ] Problem logged into the system by {problem.submitted_by}.<br/>
                 [ {new Date(problem.created_at).toISOString().split('T')[0]} 08:35 ] Status transitioned to '{problem.status}'.
              </div>
            </div>

          </div>
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50">
           <h4 className="font-bold text-slate-700 mb-4 text-sm uppercase tracking-wider">Available Actions</h4>
           <div className="flex gap-3">
              {actionConfig.length === 0 ? (
                <p className="text-sm text-slate-500">No review actions available for this status.</p>
              ) : actionConfig.map((action, i) => (
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

      </div>
    </div>
  );
};

export default ProblemDetailsModal;
