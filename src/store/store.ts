import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from './slices/tasksSlice';
import filtersReducer, { filterPersistenceMiddleware } from './slices/filterSlice';

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    filters: filtersReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(filterPersistenceMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
