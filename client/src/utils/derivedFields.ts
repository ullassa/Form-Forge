import { FormField } from '@shared/schema';

export const calculateDerivedValue = (
  field: FormField,
  formValues: Record<string, any>,
  allFields: FormField[]
): any => {
  if (!field.isDerived || !field.derivedConfig) {
    return field.defaultValue;
  }

  const { parentFieldId, calculation } = field.derivedConfig;
  const parentValue = formValues[parentFieldId];

  if (!parentValue) {
    return '';
  }

  switch (calculation) {
    case 'age':
      return calculateAge(parentValue);
    
    case 'sum':
      return calculateSum(parentValue, formValues, allFields);
    
    case 'difference':
      return calculateDifference(parentValue, formValues, allFields);
    
    case 'custom':
      return evaluateCustomFormula(field.derivedConfig.formula, formValues, allFields);
    
    default:
      return '';
  }
};

const calculateAge = (birthDate: string): number => {
  if (!birthDate) return 0;
  
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return Math.max(0, age);
};

const calculateSum = (
  parentValue: any,
  formValues: Record<string, any>,
  allFields: FormField[]
): number => {
  // Simple sum of numeric fields
  let sum = 0;
  Object.entries(formValues).forEach(([fieldId, value]) => {
    const field = allFields.find(f => f.id === fieldId);
    if (field?.type === 'number' && typeof value === 'number') {
      sum += value;
    }
  });
  return sum;
};

const calculateDifference = (
  parentValue: any,
  formValues: Record<string, any>,
  allFields: FormField[]
): number => {
  // Calculate difference between two date fields
  if (typeof parentValue === 'string' && parentValue.includes('-')) {
    const startDate = new Date(parentValue);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }
  return 0;
};

const evaluateCustomFormula = (
  formula: string,
  formValues: Record<string, any>,
  allFields: FormField[]
): any => {
  // Basic formula evaluation - in production, you'd want a proper expression parser
  try {
    // Replace field references with actual values
    let evaluatedFormula = formula;
    
    allFields.forEach(field => {
      const value = formValues[field.id] || 0;
      evaluatedFormula = evaluatedFormula.replace(
        new RegExp(`\\{${field.label}\\}`, 'g'),
        String(value)
      );
    });
    
    // Simple math operations - be careful with eval in production
    // This is a simplified implementation
    return eval(evaluatedFormula);
  } catch (error) {
    console.error('Error evaluating formula:', error);
    return '';
  }
};

export const updateDerivedFields = (
  changedFieldId: string,
  newValue: any,
  allFields: FormField[],
  currentValues: Record<string, any>
): Record<string, any> => {
  const updatedValues = { ...currentValues, [changedFieldId]: newValue };
  
  // Find all derived fields that depend on the changed field
  const dependentFields = allFields.filter(
    field => field.isDerived && field.derivedConfig?.parentFieldId === changedFieldId
  );
  
  // Recalculate values for dependent fields
  dependentFields.forEach(derivedField => {
    const newDerivedValue = calculateDerivedValue(derivedField, updatedValues, allFields);
    updatedValues[derivedField.id] = newDerivedValue;
  });
  
  return updatedValues;
};
