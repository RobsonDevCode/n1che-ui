import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  userId: string | null;
  username: string | null;
  email: string | null;
}

const initialState: AuthState = {
  isLoading: true,
  isAuthenticated: false,
  userId: null,
  username: null,
  email: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<{ userId: string; username: string; email: string }>) {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.userId = action.payload.userId;
      state.username = action.payload.username;
      state.email = action.payload.email;
    },
    clearUser(state) {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.userId = null;
      state.username = null;
      state.email = null;
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
