import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: null
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.value = { ...action.payload }
    },
    clearUser: (state) => {
      state.value = null
    }
  },
})

export const { setUser, clearUser } = userSlice.actions

export default userSlice.reducer
