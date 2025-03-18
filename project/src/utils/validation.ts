export interface ValidationError {
  field: string;
  message: string;
}

export const validateEmail = (email: string): string | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return "Email is required";
  if (!emailRegex.test(email)) return "Please enter a valid email address";
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) return "Password is required";
  if (password.length < 6) return "Password must be at least 6 characters";
  if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter";
  if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter";
  if (!/[0-9]/.test(password)) return "Password must contain at least one number";
  return null;
};

export const validateName = (name: string): string | null => {
  if (!name) return "Name is required";
  if (name.length < 2) return "Name must be at least 2 characters";
  if (!/^[a-zA-Z\s]*$/.test(name)) return "Name can only contain letters and spaces";
  return null;
};

export const validateAge = (age: string): string | null => {
  if (!age) return "Age is required";
  const ageNum = parseInt(age);
  if (isNaN(ageNum)) return "Age must be a number";
  if (ageNum < 13) return "You must be at least 13 years old";
  if (ageNum > 120) return "Please enter a valid age";
  return null;
};

export interface FormValidation {
  isValid: boolean;
  errors: ValidationError[];
}
