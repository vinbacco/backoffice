import { configureStore } from '@reduxjs/toolkit';

import userReducer from './slices/userSlice';
import appReducer from './slices/appSlice';
import listReducer from './slices/listSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    app: appReducer,
    list: listReducer,
  },
});
