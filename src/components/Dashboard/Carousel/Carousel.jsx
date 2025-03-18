import axios from "axios";
import React, { useState } from "react";
import { TrendingCoins } from "../../../config/api";
import { cryptoState } from "../../../CurrencyContext";
import { useEffect } from "react";
import AliceCarousel from "react-alice-carousel";
import { Link } from "react-router-dom";
import { styled } from "@mui/material/styles"; // Import styled

const Carousel = () => {
  const [trending, setTrending] = useState([]);
  const { currency, symbol } = cryptoState();
  const fetchTrendingCoins = async () => {
    const { data } = await axios.get(TrendingCoins(currency));
    setTrending(data);
  };
  useEffect(() => {
    fetchTrendingCoins();
  }, [currency]);

  const CarouselContainer = styled("div")(({ theme }) => ({
    height: "50%",
    display: "flex",
    alignItems: "center",
    marginTop: "10rem",
    padding: "3rem 4rem",
    [theme.breakpoints.down("md")]: {
      // Using Material UI breakpoint md (900px) and down. You can also use sm(600px) or write your own.
      marginTop: "30rem",
    },
    "@media (max-width: 800px)": {
      marginTop: "30rem",
    },
  }));

  const CarouselItem = styled(Link)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    cursor: "pointer",
    textTransform: "uppercase",
    color: "white",
    textDecoration: "none", // Remove default link underline
  }));
  function numberWithCommas(number) {
    return number.toLocaleString();
  }
  const responsive = {
    0: {
      items: 2,
    },
    512: {
      items: 4,
    },
  };
  const items = trending.map((coin) => {
    let profit = coin?.price_change_percentage_24h >= 0;
    return (
      <CarouselItem to={`/coins/${coin.id}`} key={coin.id}>
        <img
          src={coin?.image}
          alt={coin.name}
          height="80"
          style={{ marginBottom: 10 }}
        />
        <span>
          {coin?.symbol}
          &nbsp;
          <span
            style={{
              color: profit > 0 ? "rgb(14, 203, 129)" : "red",
              fontWeight: 500,
            }}
          >
            {profit && "+"}
            {coin?.price_change_percentage_24h?.toFixed(2)}%
          </span>
        </span>
        <span style={{ fontSize: 22, fontWeight: 500 }}>
          {symbol} {numberWithCommas(coin?.current_price.toFixed(2))}
        </span>
      </CarouselItem>
    );
  });
  console.log(trending);
  return (
    <CarouselContainer>
      <AliceCarousel
        mouseTracking
        infinite
        autoPlayInterval={1000}
        animationDuration={1000}
        disableDotsControls
        disableButtonsControls
        responsive={responsive}
        autoPlay
        items={items}
      />
    </CarouselContainer>
  );
};

export default Carousel;
