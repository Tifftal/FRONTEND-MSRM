import { configureStore } from '@reduxjs/toolkit';
import toolkitSlice from './toolkitSlice';

const store = configureStore({
  reducer: {
    toolkit: toolkitSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
