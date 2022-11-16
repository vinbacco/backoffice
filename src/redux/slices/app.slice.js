import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sidebarShow: true,
  toast: {
    msg: null,
    type: null,
    show: false,
  },
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarShow = !state.sidebarShow;
    },
    setSidebar: (state, action) => {
      state.sidebarShow = action.payload;
    },
    showSuccessToast: (state, action) => {
      state.toast = { ...action.payload, ...{ show: true, type: 'success' } };
    },
    showErrorToast: (state, action) => {
      state.toast = { ...action.payload, ...{ show: true, type: 'error' } };
    },
    hideToast: (state) => {
      state.toast = { show: false };
    },
  },
});

export const {
  toggleSidebar,
  setSidebar,
  showSuccessToast,
  showErrorToast,
  hideToast,
} = appSlice.actions;

export default appSlice.reducer;
