import React, { useState } from 'react';
import { Eye } from 'lucide-react';
import { displayValue } from '../utils/detailViewHelpers';
import ImagePreviewModal from './ImagePreviewModal';

export function DetailSection({ title, icon: Icon, iconClass, children }) {
  if (!children) return null;
  return (
    <div className="bg-white border text-sm border-slate-100 rounded-xl p-5 shadow-sm">
      <h4 className={`flex items-center gap-2 font-bold text-slate-700 mb-4 pb-2 border-b border-slate-50`}>
        {Icon && <Icon className={`w-4 h-4 ${iconClass || 'text-blue-500'}`} />}
        {title}
      </h4>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

export function DetailRow({ label, value }) {
  const shown = displayValue(value);
  if (shown === null) return null;
  return (
    <div className="flex justify-between gap-4">
      <span className="text-slate-500 shrink-0">{label}</span>
      <span className="font-semibold text-slate-800 text-right break-words">{shown}</span>
    </div>
  );
}

export function DocumentsSection({ documents }) {
  const items = documents.filter(d => d?.name || d?.preview);
  const [preview, setPreview] = useState(null);

  return (
    <>
      <div className="col-span-1 md:col-span-2 bg-white border text-sm border-slate-100 rounded-xl p-5 shadow-sm">
        <h4 className="font-bold text-slate-700 mb-4 pb-2 border-b border-slate-50">Uploaded Documents</h4>
        {items.length === 0 ? (
          <p className="text-sm text-slate-400 font-medium">No upload</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {items.map((doc, idx) => (
              <div key={idx} className="border border-slate-200 rounded-lg p-3 bg-slate-50">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">{doc.label}</span>
                {doc.preview ? (
                  <button
                    type="button"
                    onClick={() => setPreview({ src: doc.preview, title: doc.label })}
                    className="w-full text-left group"
                  >
                    <img
                      src={doc.preview}
                      alt={doc.label}
                      className="w-full max-h-32 object-contain rounded-md border border-slate-200 mb-2 bg-white"
                    />
                    <span className="text-xs font-semibold text-blue-600 flex items-center gap-1 group-hover:underline">
                      <Eye className="w-3.5 h-3.5" />
                      {doc.name || 'View image'}
                    </span>
                  </button>
                ) : (
                  <span className="text-sm font-semibold text-slate-700">{doc.name}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      {preview && (
        <ImagePreviewModal src={preview.src} title={preview.title} onClose={() => setPreview(null)} />
      )}
    </>
  );
}
