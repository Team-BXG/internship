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
  if (id.length < 4) return "National ID must be at least 4 characters";
  // Assuming alphanumeric hyphen format
  if (!/^[a-zA-Z0-9\-]+$/.test(id)) return "National ID can only contain letters, numbers, and hyphens";
  return null;
};
