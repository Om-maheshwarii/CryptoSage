import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { CoinList } from "../config/api";
import { cryptoState } from "../CurrencyContext";
import Header from "../components/Common/Header/Header";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import WishlistButton from "../components/Wishlist/WishlistButton";
import LoaderComponent from "../components/Common/Loader/Loader";
import { Container, Box, Alert } from "@mui/material";

const WishlistPage = () => {
  const { currency } = cryptoState();
  const wishlistCoins = useSelector((state) => state.wishlist.coins);
  const [allCoins, setAllCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(CoinList(currency));

        // Filter only the wishlist coins
        if (data) {
          const wishlistItems = data.filter((coin) =>
            wishlistCoins.includes(coin.id)
          );
          setAllCoins(wishlistItems);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching wishlist coins:", error);
        setError("Failed to load wishlist items. Please try again later.");
        setLoading(false);
      }
    };

    fetchCoins();
  }, [currency, wishlistCoins]);

  return (
    <div>
      <Header />
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{ mb: 4, color: "var(--white)" }}
          >
            My Wishlist
          </Typography>

          {loading ? (
            <div className="center-loader">
              <LoaderComponent />
            </div>
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : wishlistCoins.length === 0 ? (
            <Alert
              severity="info"
              sx={{ backgroundColor: "#261e35", color: "var(--white)" }}
            >
              Your wishlist is empty. Add coins by clicking the heart icon on
              any coin page.
            </Alert>
          ) : (
            <Grid container spacing={3}>
              {allCoins.map((coin) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={coin.id}>
                  <Card
                    sx={{
                      backgroundColor: "#261e35",
                      color: "var(--white)",
                      transition: "transform 0.3s",
                      "&:hover": { transform: "scale(1.03)" },
                    }}
                  >
                    <CardContent sx={{ position: "relative" }}>
                      <Box sx={{ position: "absolute", top: 10, right: 10 }}>
                        <WishlistButton coinId={coin.id} size="small" />
                      </Box>

                      <Link
                        to={`/coins/${coin.id}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", mb: 2 }}
                        >
                          <img
                            src={coin.image}
                            alt={coin.name}
                            style={{ width: 40, height: 40, marginRight: 10 }}
                          />
                          <Box>
                            <Typography variant="h6" component="div">
                              {coin.name}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ color: "var(--grey)" }}
                            >
                              {coin.symbol.toUpperCase()}
                            </Typography>
                          </Box>
                        </Box>

                        <Typography variant="h6" sx={{ mt: 2 }}>
                          {coin.current_price.toLocaleString(undefined, {
                            style: "currency",
                            currency: currency,
                          })}
                        </Typography>

                        <Typography
                          variant="body2"
                          sx={{
                            color:
                              coin.price_change_percentage_24h > 0
                                ? "#4CAF50"
                                : "#f44336",
                            mt: 1,
                          }}
                        >
                          {coin.price_change_percentage_24h > 0 ? "+" : ""}
                          {coin.price_change_percentage_24h.toFixed(2)}%
                        </Typography>
                      </Link>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Container>
    </div>
  );
};

export default WishlistPage;
