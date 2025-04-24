import React, { useEffect, useState, useCallback } from "react";
import Header from "../components/Common/Header/Header";
import SelectComponent from "../components/Compare/SelectCoin/SelectComponent";
import axios from "axios";
import { SingleCoin, CoinList } from "../config/api";
import coinObject from "../functions/coinObject";
import { cryptoState } from "../CurrencyContext";
import ChartComponent from "../components/Coin/MultiChart/ChartComponent";
import CoinInfo from "../components/Coin/CoinInfo/CoinInfo";
import LoaderComponent from "../components/Common/Loader/Loader";
import { Alert, Snackbar } from "@mui/material";

const ComparePage = () => {
  const { currency } = cryptoState();
  const [allCoins, setAllCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Default coins
  const defaultCoin1 = "bitcoin";
  const defaultCoin2 = "ethereum";

  // States
  const [crypto1, setCrypto1] = useState(defaultCoin1);
  const [crypto2, setCrypto2] = useState(defaultCoin2);
  const [days, setDays] = useState(30);
  const [crypto1Data, setCrypto1Data] = useState(null);
  const [crypto2Data, setCrypto2Data] = useState(null);
  const [chartLoading, setChartLoading] = useState(true);

  // Add a key state to force chart re-rendering
  const [chartKey, setChartKey] = useState(Date.now());

  // Retry configuration
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 2000; // 2 seconds

  // Fetch coin data function with retry logic
  const fetchCoinData = useCallback(
    async (coinId, setCoinData, retryCount = 0) => {
      try {
        const { data } = await axios.get(SingleCoin(coinId));
        if (data) {
          coinObject(setCoinData, data);
          return true;
        }
        return false;
      } catch (error) {
        console.error(`Error fetching data for ${coinId}:`, error);

        // If we haven't exceeded max retries, try again after delay
        if (retryCount < MAX_RETRIES) {
          console.log(
            `Retrying fetch for ${coinId} (attempt ${
              retryCount + 1
            }/${MAX_RETRIES})`
          );
          await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
          return fetchCoinData(coinId, setCoinData, retryCount + 1);
        }

        setError(
          `Failed to fetch data for ${coinId} after ${MAX_RETRIES} attempts. Please try again later.`
        );
        return false;
      }
    },
    []
  );

  // Fetch coins list with retry logic
  const fetchCoinsList = useCallback(
    async (retryCount = 0) => {
      try {
        const { data } = await axios.get(CoinList(currency));
        if (data) {
          setAllCoins(data);
          setError(null);
        }
      } catch (error) {
        console.error("Error fetching coins list:", error);

        if (retryCount < MAX_RETRIES) {
          console.log(
            `Retrying fetch coins list (attempt ${
              retryCount + 1
            }/${MAX_RETRIES})`
          );
          await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
          return fetchCoinsList(retryCount + 1);
        }

        setError("Failed to fetch coins list. Please try again later.");
      }
    },
    [currency]
  );

  // Fetch coins list
  useEffect(() => {
    fetchCoinsList();
  }, [currency, fetchCoinsList]);

  // Fetch data for selected coins with sequential requests to avoid rate limiting
  useEffect(() => {
    const fetchSelectedCoinsData = async () => {
      setLoading(true);
      setChartLoading(true);
      setError(null);

      try {
        // Fetch coins sequentially with delay to avoid rate limiting
        const results = await Promise.all([
          fetchCoinData(crypto1, setCrypto1Data),
          new Promise((resolve) => setTimeout(resolve, 1000)), // Add delay between requests
          fetchCoinData(crypto2, setCrypto2Data),
        ]);

        if (!results[0] || !results[2]) {
          setError("Failed to fetch one or more coins. Please try again.");
        }
      } catch (error) {
        console.error("Error fetching selected coins data:", error);
        setError(
          "An error occurred while fetching coin data. Please try again."
        );
      } finally {
        setLoading(false);
        setTimeout(() => {
          setChartKey(Date.now());
          setChartLoading(false);
        }, 100);
      }
    };

    if (crypto1 && crypto2) {
      fetchSelectedCoinsData();
    }
  }, [crypto1, crypto2, fetchCoinData]);

  // Handle days change
  const handleDaysChange = (event) => {
    setDays(Number(event.target.value));
    setChartLoading(true);
    setTimeout(() => {
      setChartKey(Date.now());
      setChartLoading(false);
    }, 100);
  };

  // Handle coin change
  const handleCoinChange = (event, isCoin2) => {
    const coinId = event.target.value;
    setChartLoading(true);
    setError(null);

    if (isCoin2) {
      setCrypto2(coinId);
    } else {
      setCrypto1(coinId);
    }
  };

  // Handle error alert close
  const handleErrorClose = () => {
    setError(null);
  };

  return (
    <div>
      <Header />
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleErrorClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleErrorClose}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>

      <div className="coins-day-flex">
        <SelectComponent
          crypto1={crypto1}
          crypto2={crypto2}
          handleCoinChange={handleCoinChange}
          handleDaysChange={handleDaysChange}
          days={days}
          allCoins={allCoins}
        />
      </div>

      {loading ? (
        <div className="center-loader">
          <LoaderComponent />
        </div>
      ) : (
        <>
          <div className="coins-info-container">
            {crypto1Data && (
              <CoinInfo
                heading={crypto1Data.name}
                description={crypto1Data.desc}
              />
            )}

            {crypto2Data && (
              <CoinInfo
                heading={crypto2Data.name}
                description={crypto2Data.desc}
              />
            )}
          </div>

          <div
            className="chart-wrapper"
            style={{
              width: "100%",
              padding: "20px",
              maxWidth: "1200px",
              margin: "0 auto",
            }}
          >
            {chartLoading ? (
              <div className="center-loader">
                <LoaderComponent />
              </div>
            ) : (
              <ChartComponent
                primaryId={crypto1}
                secondaryId={crypto2}
                days={days}
                key={chartKey}
                displayMode="absolute"
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ComparePage;
