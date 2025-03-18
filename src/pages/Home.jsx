import React, { useState, useEffect } from "react";
import Header from "../components/Common/Header/Header";
import MainComponent from "../components/LandingPage/MainComponent/MainComponent";
import Grid from "../components/Dashboard/Grid/Grid";
import axios from "axios";
import "./home.css";
import { cryptoState } from "../CurrencyContext";
import Carousel from "../components/Dashboard/Carousel/Carousel";

const HomePage = () => {
  return (
    <div>
      <Header />
      <MainComponent />
      <Carousel />
    </div>
  );
};

export default HomePage;
