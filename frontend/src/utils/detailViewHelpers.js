export function parseDetailsJson(record) {
  if (!record?.details_json) return {};
  if (typeof record.details_json === 'object') return record.details_json;
  try {
    return JSON.parse(record.details_json);
  } catch {
    return {};
  }
}

export function formatRegisteredDate(value) {
  if (!value) return '-';
  try {
    return new Date(value).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return String(value);
  }
}

export function displayValue(value) {
  if (value === null || value === undefined || value === '') return null;
  if (Array.isArray(value)) return value.length ? value.join(', ') : null;
  return String(value);
}

function docEntry(label, name, preview) {
  if (!name && !preview) return null;
  return {
    label,
    name: typeof name === 'string' ? name : name?.name,
    preview: preview || null,
  };
}

export function collectDocumentEntries(details) {
  const docs = [];
  const push = (entry) => { if (entry?.name || entry?.preview) docs.push(entry); };

  push(docEntry('ID Photo', details.idPhoto, details.idPhotoPreview));
  push(docEntry('Proof Photo', details.proofPhoto, details.proofPhotoPreview));
  push(docEntry('Photo', details.photo, details.photoPreview));
  if (Array.isArray(details.documents)) {
    details.documents.forEach((doc, i) => {
      push({
        label: doc.label || doc.name || `Document ${i + 1}`,
        name: doc.name || doc.filename,
        preview: doc.preview || doc.dataUrl || null,
      });
    });
  }
  return docs;
}
