import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FormField, Form } from '@shared/schema';
import { generateId } from '../../utils/helpers';

interface FormBuilderState {
  currentForm: Partial<Form>;
  selectedFieldId: string | null;
  draggedFieldType: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: FormBuilderState = {
  currentForm: {
    name: '',
    description: '',
    fields: [],
  },
  selectedFieldId: null,
  draggedFieldType: null,
  isLoading: false,
  error: null,
};

const formBuilderSlice = createSlice({
  name: 'formBuilder',
  initialState,
  reducers: {
    setFormName: (state, action: PayloadAction<string>) => {
      state.currentForm.name = action.payload;
    },
    setFormDescription: (state, action: PayloadAction<string>) => {
      state.currentForm.description = action.payload;
    },
    addField: (state, action: PayloadAction<Omit<FormField, 'id' | 'order'>>) => {
      const newField: FormField = {
        ...action.payload,
        id: generateId(),
        order: state.currentForm.fields?.length || 0,
      };
      state.currentForm.fields = [...(state.currentForm.fields || []), newField];
    },
    updateField: (state, action: PayloadAction<FormField>) => {
      const fields = state.currentForm.fields || [];
      const index = fields.findIndex(field => field.id === action.payload.id);
      if (index !== -1) {
        fields[index] = action.payload;
      }
    },
    deleteField: (state, action: PayloadAction<string>) => {
      state.currentForm.fields = (state.currentForm.fields || [])
        .filter(field => field.id !== action.payload)
        .map((field, index) => ({ ...field, order: index }));
    },
    reorderFields: (state, action: PayloadAction<FormField[]>) => {
      state.currentForm.fields = action.payload.map((field, index) => ({
        ...field,
        order: index,
      }));
    },
    selectField: (state, action: PayloadAction<string | null>) => {
      state.selectedFieldId = action.payload;
    },
    setDraggedFieldType: (state, action: PayloadAction<string | null>) => {
      state.draggedFieldType = action.payload;
    },
    loadForm: (state, action: PayloadAction<Form>) => {
      state.currentForm = action.payload;
    },
    resetForm: (state) => {
      state.currentForm = {
        name: '',
        description: '',
        fields: [],
      };
      state.selectedFieldId = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setFormName,
  setFormDescription,
  addField,
  updateField,
  deleteField,
  reorderFields,
  selectField,
  setDraggedFieldType,
  loadForm,
  resetForm,
  setLoading,
  setError,
} = formBuilderSlice.actions;

export default formBuilderSlice.reducer;
