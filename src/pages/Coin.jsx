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

const CoinPage = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [coinData, setCoinData] = useState([]);
  const { currency, symbol } = cryptoState();

  useEffect(() => {
    if (id) {
      axios
        .get(`https://api.coingecko.com/api/v3/coins/${id}`)
        .then((response) => {
          console.log(response);
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
