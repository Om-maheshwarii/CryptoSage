import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { addToWishlist, removeFromWishlist } from "../../store"; // Adjust path as needed
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Tooltip from "@mui/material/Tooltip";

const WishlistButton = ({ coinId, size = "medium" }) => {
  const dispatch = useDispatch();
  const wishlistCoins = useSelector((state) => state.wishlist.coins);
  const isInWishlist = wishlistCoins.includes(coinId);

  const handleWishlistToggle = (event) => {
    // Stop propagation to prevent navigation if the button is inside a clickable container
    event.stopPropagation();

    if (isInWishlist) {
      dispatch(removeFromWishlist(coinId));
    } else {
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
