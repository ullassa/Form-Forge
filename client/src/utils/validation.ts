import { FormField, ValidationRule } from '@shared/schema';

export const validateField = (field: FormField, value: any): string[] => {
  const errors: string[] = [];

  if (!field.validationRules || field.validationRules.length === 0) {
    return errors;
  }

  for (const rule of field.validationRules) {
    const error = validateRule(rule, value, field);
    if (error) {
      errors.push(error);
    }
  }

  return errors;
};

const validateRule = (rule: ValidationRule, value: any, field: FormField): string | null => {
  switch (rule.type) {
    case 'required':
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        return rule.message || `${field.label} is required`;
      }
      break;

    case 'minLength':
      if (value && typeof value === 'string' && value.length < (rule.value || 0)) {
        return rule.message || `${field.label} must be at least ${rule.value} characters`;
      }
      break;

    case 'maxLength':
      if (value && typeof value === 'string' && value.length > (rule.value || 0)) {
        return rule.message || `${field.label} must be no more than ${rule.value} characters`;
      }
      break;

    case 'email':
      if (value && typeof value === 'string') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return rule.message || `${field.label} must be a valid email address`;
        }
      }
      break;

    case 'password':
      if (value && typeof value === 'string') {
        const minLength = 8;
        const hasNumber = /\d/.test(value);
        const hasLetter = /[a-zA-Z]/.test(value);
        
        if (value.length < minLength) {
          return rule.message || `${field.label} must be at least ${minLength} characters`;
        }
        if (!hasNumber) {
          return rule.message || `${field.label} must contain at least one number`;
        }
        if (!hasLetter) {
          return rule.message || `${field.label} must contain at least one letter`;
        }
      }
      break;

    case 'min':
      if (value !== undefined && value !== null && Number(value) < (rule.value || 0)) {
        return rule.message || `${field.label} must be at least ${rule.value}`;
      }
      break;

    case 'max':
      if (value !== undefined && value !== null && Number(value) > (rule.value || 0)) {
        return rule.message || `${field.label} must be no more than ${rule.value}`;
      }
      break;

    default:
      break;
  }

  return null;
};

export const validateForm = (fields: FormField[], values: Record<string, any>): Record<string, string[]> => {
  const errors: Record<string, string[]> = {};

  fields.forEach(field => {
    const fieldErrors = validateField(field, values[field.id]);
    if (fieldErrors.length > 0) {
      errors[field.id] = fieldErrors;
    }
  });

  return errors;
};
