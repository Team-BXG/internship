export function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    if (!file || !(file instanceof File)) return resolve(null);
    if (!file.type?.startsWith('image/')) return resolve(null);
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function attachPhotoPreviews(data, fields) {
  const result = { ...data };
  for (const { fileKey, previewKey } of fields) {
    const file = result[fileKey];
    if (file instanceof File) {
      result[previewKey] = await readFileAsDataUrl(file);
      result[fileKey] = file.name;
    }
  }
  return result;
}
