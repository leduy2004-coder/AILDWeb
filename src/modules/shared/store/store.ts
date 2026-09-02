import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';

export const store = configureStore({
  reducer: {},
  devTools: process.env.NODE_ENV !== 'production',
});

const rootReducer = combineReducers({});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppState = ReturnType<typeof rootReducer>;
