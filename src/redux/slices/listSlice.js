import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  content: [],
  total: 0,
  paginate: 10,
  page: 1,
};

export const listSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    increasePage: (state) => {
      state.page += 1;
    },
    decreasePage: (state) => {
      if (state.page > 0) state.page -= 1;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setPaginate: (state, action) => {
      state.paginate = action.payload;
    },
    setContent: (state, action) => {
      state.content = action.payload;
    },
    setTotal: (state, action) => {
      state.total = action.payload;
    },
    clearContent: (state, action) => {
      state.content = [];
    },
    clearList: (state) => {
      state = { ...initialState };
    },
  },
});

export const {
  increasePage,
  decreasePage,
  setPage,
  setPaginate,
  setContent,
  clearContent,
  clearList,
  setTotal,
} = listSlice.actions;

export default listSlice.reducer;
