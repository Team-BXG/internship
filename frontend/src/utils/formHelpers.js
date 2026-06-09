/** Text-only input: letters, spaces, hyphens. Max 30 chars by default. */
export const sanitizeText = (value, maxLen = 30) =>
  String(value ?? '').replace(/[^a-zA-Z\s\-]/g, '').slice(0, maxLen);

/** Digits only, non-negative. */
export const sanitizeNumber = (value) =>
  String(value ?? '').replace(/\D/g, '');

/** National ID: exactly up to 12 digits. */
export const sanitizeNationalId = (value) =>
  String(value ?? '').replace(/\D/g, '').slice(0, 12);

/** Apply onChange handler for controlled text fields */
export const onTextChange = (setter, field, maxLen = 30) => (e) =>
  setter(field, sanitizeText(e.target.value, maxLen));

export const onNumberChange = (setter, field) => (e) =>
  setter(field, sanitizeNumber(e.target.value));

export const onNationalIdChange = (setter, field) => (e) =>
  setter(field, sanitizeNationalId(e.target.value));
