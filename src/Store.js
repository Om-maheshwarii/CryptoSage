// Store.js - For managing the wishlist state with Redux
// You'll need to install: npm install @reduxjs/toolkit react-redux

import { createSlice, configureStore } from "@reduxjs/toolkit";

// Create a wishlist slice
const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    coins: JSON.parse(localStorage.getItem("cryptoWishlist")) || [],
  },
  reducers: {
    addToWishlist: (state, action) => {
      const coinId = action.payload;
      // Check if coin already exists in wishlist
      if (!state.coins.includes(coinId)) {
        state.coins.push(coinId);
        // Save to localStorage
        localStorage.setItem("cryptoWishlist", JSON.stringify(state.coins));
      }
    },
    removeFromWishlist: (state, action) => {
      const coinId = action.payload;
      state.coins = state.coins.filter((id) => id !== coinId);
      // Update localStorage
      localStorage.setItem("cryptoWishlist", JSON.stringify(state.coins));
    },
    clearWishlist: (state) => {
      state.coins = [];
      localStorage.removeItem("cryptoWishlist");
    },
  },
});

// Export actions
export const { addToWishlist, removeFromWishlist, clearWishlist } =
  wishlistSlice.actions;

// Create store
const store = configureStore({
  reducer: {
    wishlist: wishlistSlice.reducer,
    // Add your other reducers here
  },
});

export default store;
