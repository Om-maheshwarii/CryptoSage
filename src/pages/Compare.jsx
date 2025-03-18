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

const ComparePage = () => {
  const { currency } = cryptoState();
  const [allCoins, setAllCoins] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // Fetch coin data function - reusable for both coins
  const fetchCoinData = useCallback(async (coinId, setCoinData) => {
    try {
      const { data } = await axios.get(SingleCoin(coinId));
      if (data) {
        coinObject(setCoinData, data);
        return true;
      }
      return false;
    } catch (error) {
      console.error(`Error fetching data for ${coinId}:`, error);
      return false;
    }
  }, []);

  // Fetch coins list
  useEffect(() => {
    const fetchCoinsList = async () => {
      try {
        const { data } = await axios.get(CoinList(currency));
        if (data) {
          setAllCoins(data);
        }
      } catch (error) {
        console.error("Error fetching coins list:", error);
      }
    };

    fetchCoinsList();
  }, [currency]);

  // Fetch data for selected coins
  useEffect(() => {
    const fetchSelectedCoinsData = async () => {
      setLoading(true);
      setChartLoading(true);

      try {
        await Promise.all([
          fetchCoinData(crypto1, setCrypto1Data),
          fetchCoinData(crypto2, setCrypto2Data),
        ]);
      } catch (error) {
        console.error("Error fetching selected coins data:", error);
      } finally {
        setLoading(false);

        // Set a short delay before allowing chart to render
        // This ensures the chart component gets fresh props
        setTimeout(() => {
          setChartKey(Date.now());
          setChartLoading(false);
        }, 100);
      }
    };

    // Only fetch if we have valid coin IDs
    if (crypto1 && crypto2) {
      fetchSelectedCoinsData();
    }
  }, [crypto1, crypto2, fetchCoinData]);

  // Handle days change
  const handleDaysChange = (event) => {
    setDays(Number(event.target.value));
    // Force chart re-render after a delay
    setChartLoading(true);
    setTimeout(() => {
      setChartKey(Date.now());
      setChartLoading(false);
    }, 100);
  };

  // Handle coin change
  const handleCoinChange = (event, isCoin2) => {
    const coinId = event.target.value;

    // Set loading state before changing coin
    setChartLoading(true);

    if (isCoin2) {
      setCrypto2(coinId);
    } else {
      setCrypto1(coinId);
    }
  };

  return (
    <div>
      <Header />

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
