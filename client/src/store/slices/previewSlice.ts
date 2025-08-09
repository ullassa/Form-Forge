import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Form } from '@shared/schema';

interface FormValues {
  [fieldId: string]: any;
}

interface FieldErrors {
  [fieldId: string]: string[];
}

interface PreviewState {
  previewForm: Form | null;
  formValues: FormValues;
  fieldErrors: FieldErrors;
  isValid: boolean;
  isSubmitting: boolean;
  submitSuccess: boolean;
}

const initialState: PreviewState = {
  previewForm: null,
  formValues: {},
  fieldErrors: {},
  isValid: false,
  isSubmitting: false,
  submitSuccess: false,
};

const previewSlice = createSlice({
  name: 'preview',
  initialState,
  reducers: {
    setPreviewForm: (state, action: PayloadAction<Form>) => {
      state.previewForm = action.payload;
      state.formValues = {};
      state.fieldErrors = {};
      state.submitSuccess = false;
    },
    updateFieldValue: (state, action: PayloadAction<{ fieldId: string; value: any }>) => {
      const { fieldId, value } = action.payload;
      state.formValues[fieldId] = value;
      
      // Clear errors for this field
      if (state.fieldErrors[fieldId]) {
        delete state.fieldErrors[fieldId];
      }
    },
    setFieldError: (state, action: PayloadAction<{ fieldId: string; errors: string[] }>) => {
      const { fieldId, errors } = action.payload;
      if (errors.length > 0) {
        state.fieldErrors[fieldId] = errors;
      } else {
        delete state.fieldErrors[fieldId];
      }
    },
    setFormValid: (state, action: PayloadAction<boolean>) => {
      state.isValid = action.payload;
    },
    setSubmitting: (state, action: PayloadAction<boolean>) => {
      state.isSubmitting = action.payload;
    },
    setSubmitSuccess: (state, action: PayloadAction<boolean>) => {
      state.submitSuccess = action.payload;
    },
    resetForm: (state) => {
      state.formValues = {};
      state.fieldErrors = {};
      state.isValid = false;
      state.submitSuccess = false;
    },
    resetPreview: () => initialState,
  },
});

export const {
  setPreviewForm,
  updateFieldValue,
  setFieldError,
  setFormValid,
  setSubmitting,
  setSubmitSuccess,
  resetForm,
  resetPreview,
} = previewSlice.actions;

export default previewSlice.reducer;
