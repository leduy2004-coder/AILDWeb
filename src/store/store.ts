import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';

import UserProfileReducer from './apps/userProfile/UserProfileSlice';
import UserProfile2Reducer from './apps/userProfile/UserProfileSlice2';
import counterReducer from './counter/counterSlice';
import CustomizerReducer from './customizer/CustomizerSlice';
import loadingIndicatorReducer from './loading-indicator/loadingIndicatorSlice';
import menuReducer from './menu/menuSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    customizer: CustomizerReducer,
    userpostsReducer: UserProfileReducer,
    userpostsReducer2: UserProfile2Reducer,

    loadingIndicator: loadingIndicatorReducer,
    menu: menuReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

const rootReducer = combineReducers({
  counter: counterReducer,
  customizer: CustomizerReducer,
  userpostsReducer: UserProfileReducer,
  userpostsReducer2: UserProfile2Reducer,

  loadingIndicator: loadingIndicatorReducer,
  menu: menuReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppState = ReturnType<typeof rootReducer>;
