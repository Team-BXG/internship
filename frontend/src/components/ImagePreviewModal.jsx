import React from 'react';
import { X } from 'lucide-react';

export default function ImagePreviewModal({ src, title, onClose }) {
  if (!src) return null;

  const isPdf = typeof src === 'string' && src.toLowerCase().endsWith('.pdf');

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-800">{title || 'Document Preview'}</h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 overflow-auto flex items-center justify-center bg-slate-50 min-h-[200px]">
          {isPdf ? (
            <p className="text-slate-500 text-sm">PDF preview is not available. File: {src}</p>
          ) : (
            <img src={src} alt={title} className="max-w-full max-h-[70vh] object-contain rounded-lg" />
          )}
        </div>
      </div>
    </div>
  );
}
