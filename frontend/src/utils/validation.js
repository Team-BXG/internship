export const validateName = (name) => {
  if (!name) return "Name is required";
  if (name.length < 3) return "Name must be at least 3 characters long";
  if (!/^[a-zA-Z\s\-]+$/.test(name)) return "Name can only contain letters, spaces, and hyphens";
  return null;
};

export const validatePhone = (phone) => {
  if (!phone) return "Phone number is required";
  // Allows formats like +251911234567, 0911234567, or 0711234567
  if (!/^(\+251\d{9}|0[79]\d{8})$/.test(phone)) return "Invalid Ethiopian phone format (e.g. 09xxxxxxxx or +2519xxxxxxxx)";
  return null;
};

export const validateEmail = (email) => {
  if (!email) return null; // Email might be optional in most cases, adjust if needed
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Invalid email format";
  return null;
};

export const validateNationalId = (id) => {
  if (!id) return "National ID is required";
  if (!/^\d{12}$/.test(id)) return "National ID must be exactly 12 digits";
  return null;
};

export const validateTextField = (value, label, maxLen = 30) => {
  if (!value || !String(value).trim()) return `${label} is required`;
  if (String(value).length > maxLen) return `${label} must be at most ${maxLen} characters`;
  if (!/^[a-zA-Z\s\-]+$/.test(value)) return `${label} can only contain letters, spaces, and hyphens`;
  return null;
};

export const validateNonNegativeNumber = (value, label, required = false) => {
  if (!value && !required) return null;
  if (!value) return `${label} is required`;
  if (!/^\d+$/.test(String(value))) return `${label} must be a non-negative number`;
  if (parseInt(value, 10) < 0) return `${label} cannot be negative`;
  return null;
};
