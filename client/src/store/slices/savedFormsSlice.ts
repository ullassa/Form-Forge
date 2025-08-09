import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Form } from '@shared/schema';

interface SavedFormsState {
  forms: Form[];
  searchQuery: string;
  sortBy: 'name' | 'createdAt' | 'updatedAt';
  sortOrder: 'asc' | 'desc';
  isLoading: boolean;
  error: string | null;
}

const initialState: SavedFormsState = {
  forms: [],
  searchQuery: '',
  sortBy: 'updatedAt',
  sortOrder: 'desc',
  isLoading: false,
  error: null,
};

const savedFormsSlice = createSlice({
  name: 'savedForms',
  initialState,
  reducers: {
    setForms: (state, action: PayloadAction<Form[]>) => {
      state.forms = action.payload;
    },
    addForm: (state, action: PayloadAction<Form>) => {
      state.forms.unshift(action.payload);
    },
    updateForm: (state, action: PayloadAction<Form>) => {
      const index = state.forms.findIndex(form => form.id === action.payload.id);
      if (index !== -1) {
        state.forms[index] = action.payload;
      }
    },
    deleteForm: (state, action: PayloadAction<string>) => {
      state.forms = state.forms.filter(form => form.id !== action.payload);
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSortBy: (state, action: PayloadAction<'name' | 'createdAt' | 'updatedAt'>) => {
      state.sortBy = action.payload;
    },
    setSortOrder: (state, action: PayloadAction<'asc' | 'desc'>) => {
      state.sortOrder = action.payload;
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
  setForms,
  addForm,
  updateForm,
  deleteForm,
  setSearchQuery,
  setSortBy,
  setSortOrder,
  setLoading,
  setError,
} = savedFormsSlice.actions;

export default savedFormsSlice.reducer;
