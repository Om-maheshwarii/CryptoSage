/**
 * Store.js - Redux Store Configuration
 *
 * This file configures the Redux store for the application.
 * It manages the wishlist state and provides actions for manipulating it.
 * The wishlist data is persisted in localStorage for user convenience.
 */

import { createSlice, configureStore } from "@reduxjs/toolkit";

/**
 * Wishlist Slice
 *
 * Manages the state and actions for the cryptocurrency wishlist feature.
 * Provides functionality to add, remove, and clear items from the wishlist.
 */
const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    // Initialize from localStorage or empty array if not found
    coins: JSON.parse(localStorage.getItem("cryptoWishlist")) || [],
  },
  reducers: {
    /**
     * Adds a coin to the wishlist if it doesn't already exist
     * @param {Object} state - Current state
     * @param {Object} action - Action containing the coin ID to add
     */
    addToWishlist: (state, action) => {
      const coinId = action.payload;
      // Check if coin already exists in wishlist
      if (!state.coins.includes(coinId)) {
        state.coins.push(coinId);
        // Persist to localStorage
        localStorage.setItem("cryptoWishlist", JSON.stringify(state.coins));
      }
    },

    /**
     * Removes a coin from the wishlist
     * @param {Object} state - Current state
     * @param {Object} action - Action containing the coin ID to remove
     */
    removeFromWishlist: (state, action) => {
      const coinId = action.payload;
      state.coins = state.coins.filter((id) => id !== coinId);
      // Update localStorage
      localStorage.setItem("cryptoWishlist", JSON.stringify(state.coins));
    },

    /**
     * Clears all coins from the wishlist
     * @param {Object} state - Current state
     */
    clearWishlist: (state) => {
      state.coins = [];
      localStorage.removeItem("cryptoWishlist");
    },
  },
});

// Export actions for use in components
export const { addToWishlist, removeFromWishlist, clearWishlist } =
  wishlistSlice.actions;

/**
 * Redux Store Configuration
 *
 * Creates and configures the Redux store with the wishlist reducer.
 * Additional reducers can be added here as the application grows.
 */
const store = configureStore({
  reducer: {
    wishlist: wishlistSlice.reducer,
    // Add your other reducers here
  },
});

export default store;
