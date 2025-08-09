import { configureStore } from '@reduxjs/toolkit';
import formBuilderSlice from './slices/formBuilderSlice';
import previewSlice from './slices/previewSlice';
import savedFormsSlice from './slices/savedFormsSlice';

export const store = configureStore({
  reducer: {
    formBuilder: formBuilderSlice,
    preview: previewSlice,
    savedForms: savedFormsSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
