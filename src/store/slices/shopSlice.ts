import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Shop } from '../../types/shop';

interface ShopState {
  nearbyShops: Shop[];
  selectedShop: Shop | null;
}

const initialState: ShopState = {
  nearbyShops: [],
  selectedShop: null,
};

const shopSlice = createSlice({
  name: 'shop',
  initialState,
  reducers: {
    setNearbyShops(state, action: PayloadAction<Shop[]>) {
      state.nearbyShops = action.payload;
    },
    setSelectedShop(state, action: PayloadAction<Shop | null>) {
      state.selectedShop = action.payload;
    },
  },
});

export const { setNearbyShops, setSelectedShop } = shopSlice.actions;
export default shopSlice.reducer;
