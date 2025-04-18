/**
 * Coin.jsx - Coin Detail Page Component
 *
 * This component renders the detailed view of a specific cryptocurrency.
 * It displays information, charts, and market data for the selected coin.
 */

import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Common/Header/Header";
import LoaderComponent from "../components/Common/Loader/Loader";
import coinObject from "../functions/coinObject";
import List from "../components/Dashboard/List/List";
import Grid from "../components/Dashboard/Grid/Grid";
import CoinInfo from "../components/Coin/CoinInfo/CoinInfo";
import { cryptoState } from "../CurrencyContext";
import ChartComponent from "../components/Coin/LineChart/ChartComponent";

/**
 * CoinPage Component
 *
 * Renders the detailed view of a specific cryptocurrency.
 * Fetches and displays comprehensive information about the selected coin.
 *
 * @returns {JSX.Element} The rendered coin detail page
 */
const CoinPage = () => {
  // Get the coin ID from the URL parameters
  const { id } = useParams();
  // State for loading status
  const [isLoading, setIsLoading] = useState(true);
  // State for storing coin data
  const [coinData, setCoinData] = useState([]);
  // Get currency context for displaying prices in the correct currency
  const { currency, symbol } = cryptoState();

  // Fetch coin data when the ID changes
  useEffect(() => {
    if (id) {
      axios
        .get(`https://api.coingecko.com/api/v3/coins/${id}`)
        .then((response) => {
          // Format and set the coin data
          coinObject(setCoinData, response.data);
          setIsLoading(false);
        })
        .catch((error) => {
          setIsLoading(false);
        });
    }
  }, [id]);

  return (
    <div>
      <Header />
      {isLoading ? (
        <LoaderComponent />
      ) : (
        <>
          <div className="purple-wrapper">
            <List coin={coinData} symbol={symbol} currency={currency} />
          </div>
          <CoinInfo heading={coinData.name} description={coinData.desc} />
          <ChartComponent id={id} />
        </>
      )}
    </div>
  );
};

export default CoinPage;
