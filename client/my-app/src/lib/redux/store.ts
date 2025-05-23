import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/lib/redux/slices/authSlice';
import uiReducer from '@/lib/redux/slices/uiSlice';
import { authApiSlice } from '@/services/apiAuth';
import { categoryApi } from '@/services/apiCategory';
import { mangaApi } from '@/services/apiManga';
import { userApiSlice } from '@/services/apiUser';
import errorApiSlice from '@/services/apiError';
import chapterImagesReducer from './slices/chapterImagesSlice';

// Fixed reducer mapping - each API needs its own reducer path
const rootReducer = {
  auth: authReducer,
  ui: uiReducer,
  chapterImages: chapterImagesReducer,
  [authApiSlice.reducerPath]: authApiSlice.reducer,
  [categoryApi.reducerPath]: categoryApi.reducer,
  [mangaApi.reducerPath]: mangaApi.reducer, // Corrected mapping
  [userApiSlice.reducerPath]: userApiSlice.reducer, // Added userApiSlice reducer
  [errorApiSlice.reducerPath]: errorApiSlice.reducer // Corrected mapping
};

export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
    // Add middleware in a type-safe way
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
        .concat(errorApiSlice.middleware) // Corrected concatenation
        .concat(authApiSlice.middleware)
        .concat(categoryApi.middleware)
        .concat(mangaApi.middleware)
        .concat(userApiSlice.middleware) // Corrected concatenation
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
