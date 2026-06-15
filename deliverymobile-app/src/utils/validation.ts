export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s-]{10,}$/;
  return phoneRegex.test(phone);
};

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  if (password.length < 8) errors.push('Password must be at least 8 characters');
  if (!/[A-Z]/.test(password)) errors.push('Password must contain an uppercase letter');
  if (!/[a-z]/.test(password)) errors.push('Password must contain a lowercase letter');
  if (!/[0-9]/.test(password)) errors.push('Password must contain a number');
  return { isValid: errors.length === 0, errors };
};

export const validateName = (name: string): boolean => {
  return name.trim().length >= 2;
};

export const validateOtp = (otp: string): boolean => {
  return /^\d{6}$/.test(otp);
};

export const validateLicensePlate = (plate: string): boolean => {
  return /^[A-Z0-9]{2,10}$/i.test(plate);
};