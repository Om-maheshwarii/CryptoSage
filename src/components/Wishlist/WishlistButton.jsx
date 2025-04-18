/**
 * WishlistButton.jsx - Wishlist Toggle Button Component
 *
 * This component renders a button that allows users to add or remove
 * cryptocurrencies from their wishlist. It uses Redux for state management.
 */

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { addToWishlist, removeFromWishlist } from "../../Store"; // Adjust path as needed
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Tooltip from "@mui/material/Tooltip";

/**
 * WishlistButton Component
 *
 * Renders a button that toggles a cryptocurrency in the user's wishlist.
 *
 * @param {Object} props - Component props
 * @param {string} props.coinId - The ID of the cryptocurrency
 * @param {string} props.size - The size of the button (default: "medium")
 * @returns {JSX.Element} The rendered wishlist button
 */
const WishlistButton = ({ coinId, size = "medium" }) => {
  // Get the Redux dispatch function
  const dispatch = useDispatch();
  // Get the list of coins in the wishlist from Redux state
  const wishlistCoins = useSelector((state) => state.wishlist.coins);
  // Check if the current coin is in the wishlist
  const isInWishlist = wishlistCoins.includes(coinId);

  /**
   * Handles toggling a coin in the wishlist
   *
   * @param {Object} event - The event object
   */
  const handleWishlistToggle = (event) => {
    // Stop propagation to prevent navigation if the button is inside a clickable container
    event.stopPropagation();

    if (isInWishlist) {
      // Remove the coin from the wishlist
      dispatch(removeFromWishlist(coinId));
    } else {
      // Add the coin to the wishlist
      dispatch(addToWishlist(coinId));
    }
  };

  return (
    <Tooltip title={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}>
      <IconButton
        onClick={handleWishlistToggle}
        size={size}
        sx={{
          color: isInWishlist ? "#f44336" : "grey",
          "&:hover": { color: isInWishlist ? "#d32f2f" : "#f44336" },
        }}
        aria-label={isInWishlist ? "remove from wishlist" : "add to wishlist"}
      >
        {isInWishlist ? <FavoriteIcon /> : <FavoriteBorderIcon />}
      </IconButton>
    </Tooltip>
  );
};

export default WishlistButton;
