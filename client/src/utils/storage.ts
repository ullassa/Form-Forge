import { Form } from '@shared/schema';

const FORMS_STORAGE_KEY = 'dynamic_form_builder_forms';

export const saveFormToStorage = (form: Form): void => {
  try {
    const existingForms = getFormsFromStorage();
    const updatedForms = existingForms.filter(f => f.id !== form.id);
    updatedForms.push(form);
    
    localStorage.setItem(FORMS_STORAGE_KEY, JSON.stringify(updatedForms));
  } catch (error) {
    console.error('Error saving form to storage:', error);
    throw new Error('Failed to save form');
  }
};

export const getFormsFromStorage = (): Form[] => {
  try {
    const formsJson = localStorage.getItem(FORMS_STORAGE_KEY);
    return formsJson ? JSON.parse(formsJson) : [];
  } catch (error) {
    console.error('Error loading forms from storage:', error);
    return [];
  }
};

export const getFormFromStorage = (formId: string): Form | null => {
  try {
    const forms = getFormsFromStorage();
    return forms.find(form => form.id === formId) || null;
  } catch (error) {
    console.error('Error loading form from storage:', error);
    return null;
  }
};

export const deleteFormFromStorage = (formId: string): void => {
  try {
    const forms = getFormsFromStorage();
    const updatedForms = forms.filter(form => form.id !== formId);
    localStorage.setItem(FORMS_STORAGE_KEY, JSON.stringify(updatedForms));
  } catch (error) {
    console.error('Error deleting form from storage:', error);
    throw new Error('Failed to delete form');
  }
};

export const exportForm = (form: Form): void => {
  try {
    const dataStr = JSON.stringify(form, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `${form.name.replace(/\s+/g, '_').toLowerCase()}_form.json`;
    link.click();
    
    URL.revokeObjectURL(link.href);
  } catch (error) {
    console.error('Error exporting form:', error);
    throw new Error('Failed to export form');
  }
};

export const importForm = (file: File): Promise<Form> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const formData = JSON.parse(event.target?.result as string);
        // Validate the imported form structure
        if (!formData.id || !formData.name || !Array.isArray(formData.fields)) {
          throw new Error('Invalid form structure');
        }
        resolve(formData as Form);
      } catch (error) {
        reject(new Error('Failed to parse form file'));
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};
