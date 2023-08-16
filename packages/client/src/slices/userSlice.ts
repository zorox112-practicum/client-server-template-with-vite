import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'
import { SERVER_HOST } from '../constants'

interface User {
  name: string
  secondName: string
}

export interface UserState {
  data: User | null
  isLoading: boolean
}

const initialState: UserState = {
  data: null,
  isLoading: false,
}

export const fetchUserThunk = createAsyncThunk(
  'user/fetchUserThunk',
  async (_: void, { dispatch }) => {
    dispatch(userSlice.actions.fetchUserStart())
    const url = `${SERVER_HOST}/user`
    console.log('url = ', url)
    return fetch(url)
      .then(res => res.json())
      .then(res => dispatch(userSlice.actions.fetchUserSuccess(res)))
      .catch(err => dispatch(userSlice.actions.fetchUserFail(err)))
  }
)

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    fetchUserStart: state => {
      state.data = null
      state.isLoading = true
    },
    fetchUserSuccess: (state, { payload }: PayloadAction<User>) => {
      state.data = payload
      state.isLoading = false
    },
    fetchUserFail: state => {
      state.isLoading = false
    },
  },
})

export const selectUser = (state: RootState) => state.user.data

export const { fetchUserStart, fetchUserSuccess, fetchUserFail } =
  userSlice.actions

export default userSlice.reducer
