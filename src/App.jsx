import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/Home";
import DashboardPage from "./pages/Dashboard";
import WishlistPage from "./pages/WishlistPage";
import ComparePage from "./pages/Compare";
import LoginPage from "./pages/Login";
import CoinPage from "./pages/Coin";
import { Provider } from "react-redux";
import store from "./Store.js";
import ChatBot from "./components/ChatBot/ChatBot";

const App = () => {
  return (
    <div>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/watchlist" element={<WishlistPage />} />
            <Route path="/compare" element={<ComparePage />} />
            {/* <Route path="/login" element={<LoginPage />} /> */}
            <Route path="/coin/:id" element={<CoinPage />} />
          </Routes>
          <ChatBot />
        </BrowserRouter>
      </Provider>
    </div>
  );
};

export default App;
