import { configureStore } from '@reduxjs/toolkit';

import userReducer from './slices/user.slice';
import appReducer from './slices/app.slice';
import listReducer from './slices/list.slice';

const store = configureStore({
  reducer: {
    user: userReducer,
    app: appReducer,
    list: listReducer,
  },
});

export default store;
