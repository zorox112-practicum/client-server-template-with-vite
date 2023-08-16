import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'
import { SERVER_HOST } from '../constants'

interface Friend {
  name: string
  secondName: string
  avatar: string
}

export interface FriendsState {
  data: Array<Friend>
  isLoading: boolean
}

const initialState: FriendsState = {
  data: [],
  isLoading: false,
}

export const fetchFriendsThunk = createAsyncThunk(
  'user/fetchFriendsThunk',
  async (_: void, { dispatch }) => {
    dispatch(friendsSlice.actions.fetchFriendsStart())
    const url = `${SERVER_HOST}/friends`
    console.log('url = ', url)
    return fetch(url)
      .then(res => res.json())
      .then(res => dispatch(friendsSlice.actions.fetchFriendsSuccess(res)))
      .catch(err => dispatch(friendsSlice.actions.fetchFriendsFail(err)))
  }
)

export const friendsSlice = createSlice({
  name: 'friends',
  initialState,
  reducers: {
    fetchFriendsStart: state => {
      state.data = []
      state.isLoading = true
    },
    fetchFriendsSuccess: (state, { payload }: PayloadAction<Friend[]>) => {
      state.data = payload
      state.isLoading = false
    },
    fetchFriendsFail: state => {
      state.isLoading = false
    },
  },
})

export const selectFriends = (state: RootState) => state.friends.data

export const selectIsLoadingFriends = (state: RootState) =>
  state.friends.isLoading

export const { fetchFriendsStart, fetchFriendsSuccess, fetchFriendsFail } =
  friendsSlice.actions

export default friendsSlice.reducer
