import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Common/Header/Header";
import LoaderComponent from "../components/Common/Loader/Loader";
import { coinObject } from "../functions/coinObject";
import List from "../components/Dashboard/List/List";
import Grid from "../components/Dashboard/Grid/Grid";
import CoinInfo from "../components/Coin/CoinInfo/CoinInfo";

const CoinPage = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [coinData, setCoinData] = useState([]);

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
            <List coin={coinData} />
          </div>
          <CoinInfo heading={coinData.name} description={coinData.desc} />
        </>
      )}
    </div>
  );
};

export default CoinPage;
