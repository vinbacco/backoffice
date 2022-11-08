import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  sidebarShow: true,
}

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarShow = !state.sidebarShow
    },
    setSidebar: (state, action) => {
      state.sidebarShow = action.payload
    },
  },
})

export const { toggleSidebar, setSidebar } = appSlice.actions

export default appSlice.reducer
