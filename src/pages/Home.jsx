/**
 * Home.jsx - Home Page Component
 *
 * This component renders the home page of the application.
 * It displays the header, main component, and a carousel of trending cryptocurrencies.
 */

import React from "react";
import Header from "../components/Common/Header/Header";
import MainComponent from "../components/LandingPage/MainComponent/MainComponent";
import Grid from "../components/Dashboard/Grid/Grid";
import axios from "axios";
import "./home.css";
import { cryptoState } from "../CurrencyContext";
import Carousel from "../components/Dashboard/Carousel/Carousel";

/**
 * HomePage Component
 *
 * Renders the main landing page of the application.
 *
 * @returns {JSX.Element} The rendered home page
 */
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
