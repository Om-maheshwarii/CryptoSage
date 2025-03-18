import React from "react";
import "./style.css";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import TrendingDownRoundedIcon from "@mui/icons-material/TrendingDownRounded";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import WishlistButton from "../../Wishlist/WishlistButton";

const Grid = ({ coin, symbol }) => {
  return (
    <div className="grid-wrapper">
      <motion.div
        className="grid-container"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0 }}
        whileHover={{
          scale: 1.05,
          transition: { duration: 0.5, ease: "circInOut" },
          border: `2px solid ${
            coin.price_change_percentage_24h > 0 ? "var(--green)" : "var(--red)"
          }`,
        }}
      >
        {/* Wishlist button positioned absolutely to avoid interfering with the Link */}
        <div className="wishlist-button-container">
          <WishlistButton coinId={coin.id} size="small" />
        </div>

        <Link to={`/coin/${coin.id}`} className="coin-link">
          <div className="info-flex margin-mid">
            <img src={coin.image} className="coin-logo" alt={coin.name} />
            <div className="name-col">
              <p className="coin-symbol">{coin.symbol}</p>
              <p className="coin-name">{coin.name}</p>
            </div>
          </div>
          <div className="chip-flex margin-mid">
            <div
              className={
                coin.price_change_percentage_24h.toFixed(3) > 0
                  ? "price-chip-green"
                  : "price-chip-red"
              }
            >
              {coin.price_change_percentage_24h.toFixed(3)}%
            </div>
            <div
              className={
                coin.price_change_percentage_24h.toFixed(3) > 0
                  ? "dsp-yes icon-green"
                  : "dsp-no"
              }
            >
              <TrendingUpRoundedIcon />
            </div>
            <div
              className={
                coin.price_change_percentage_24h.toFixed(3) > 0
                  ? "dsp-no "
                  : "dsp-yes icon-red"
              }
            >
              <TrendingDownRoundedIcon />
            </div>
          </div>
          <h3
            className={
              coin.price_change_percentage_24h.toFixed(3) > 0
                ? "price-green margin-mid"
                : "price-red margin-mid"
            }
          >
            {symbol}
            {coin.current_price.toLocaleString()}
          </h3>
          <div className="extra-info">
            <p>
              Total Volume:{symbol}
              {coin.total_volume.toLocaleString()}
            </p>
            <p>
              Market Cap:{symbol}
              {coin.market_cap.toLocaleString()}
            </p>
          </div>
        </Link>
      </motion.div>
    </div>
  );
};

export default Grid;
