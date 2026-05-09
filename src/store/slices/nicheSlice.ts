import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface NicheState {
  selectedNiche: string | null;
}

const initialState: NicheState = {
  selectedNiche: null,
};

const nicheSlice = createSlice({
  name: 'niche',
  initialState,
  reducers: {
    setNiche(state, action: PayloadAction<string>) {
      state.selectedNiche = action.payload;
    },
  },
});

export const { setNiche } = nicheSlice.actions;
export default nicheSlice.reducer;
