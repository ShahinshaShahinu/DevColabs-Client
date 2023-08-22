import { createAction, createSlice } from '@reduxjs/toolkit';

const INITIAL_STATE = {
    userId: '',
    username: '',
    image: '',
    userEmail: ''
}

export const userSlice = createSlice({
    name: 'User',
    initialState: INITIAL_STATE,
    reducers: {
        updateUser: (state, action) => {
            state.userId = action.payload.userId
            state.username = action.payload.username
            state.image = action.payload.image
            state.userEmail = action.payload.userEmail
        }
    }
  
})

export const { updateUser } = userSlice.actions
export default userSlice.reducer
export const logoutUser = createAction('logoutUser');
