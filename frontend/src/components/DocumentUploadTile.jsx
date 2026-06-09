import React, { useEffect, useState } from 'react';
import { UploadCloud, Eye } from 'lucide-react';
import ImagePreviewModal from './ImagePreviewModal';

export default function DocumentUploadTile({
  label,
  emptyHint,
  file,
  accept = 'image/*',
  onFileSelect,
}) {
  const [objectUrl, setObjectUrl] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (file instanceof File && file.type?.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setObjectUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setObjectUrl(null);
  }, [file]);

  const fileName = file instanceof File ? file.name : file;

  return (
    <>
      <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-slate-50 hover:border-blue-300 transition-colors text-blue-600 relative">
        <label className="flex flex-col items-center justify-center gap-2 cursor-pointer w-full">
          <input
            type="file"
            accept={accept}
            capture={accept.includes('image') ? 'environment' : undefined}
            className="hidden"
            onChange={(e) => onFileSelect(e.target.files?.[0] || null)}
          />
          <UploadCloud className={`w-6 h-6 ${file ? 'text-emerald-500' : 'text-slate-400'}`} />
          <span className="text-sm font-semibold text-slate-700">{file ? `${label} Uploaded` : label}</span>
          <span className="text-xs truncate max-w-full text-center px-2 text-slate-500">
            {fileName || emptyHint}
          </span>
        </label>
        {objectUrl && (
          <button
            type="button"
            onClick={() => setShowPreview(true)}
            className="mt-2 flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg"
          >
            <Eye className="w-3.5 h-3.5" />
            View uploaded image
          </button>
        )}
        {objectUrl && (
          <img
            src={objectUrl}
            alt={label}
            className="mt-2 max-h-24 rounded-lg border border-slate-200 object-contain cursor-pointer"
            onClick={() => setShowPreview(true)}
          />
        )}
      </div>
      {showPreview && objectUrl && (
        <ImagePreviewModal src={objectUrl} title={label} onClose={() => setShowPreview(false)} />
      )}
    </>
  );
}
