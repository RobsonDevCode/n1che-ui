import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  userId: string | null;
  username: string | null;
}

const initialState: AuthState = {
  isAuthenticated: true, // mocked true until Cognito is wired
  userId: null,
  username: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<{ userId: string; username: string }>) {
      state.isAuthenticated = true;
      state.userId = action.payload.userId;
      state.username = action.payload.username;
    },
    clearUser(state) {
      state.isAuthenticated = false;
      state.userId = null;
      state.username = null;
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
