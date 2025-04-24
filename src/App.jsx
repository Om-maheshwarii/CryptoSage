/**
 * App.jsx - Main Application Component
 *
 * This component serves as the main application container.
 * It sets up routing and provides the application structure.
 */

import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/Home";
import DashboardPage from "./pages/Dashboard";
import WishlistPage from "./pages/WishlistPage";
import ComparePage from "./pages/Compare";
// import LoginPage from "./pages/Login";
import CoinPage from "./pages/Coin";
import { Provider } from "react-redux";
import store from "./Store.js";
import ChatBot from "./components/ChatBot/ChatBot";
import APITest from "./components/APITest";

/**
 * App Component
 *
 * Main application component that sets up routing and application structure.
 *
 * @returns {JSX.Element} The rendered application
 */
const App = () => {
  return (
    <div>
      {/* Redux Provider for global state management */}
      <Provider store={store}>
        {/* BrowserRouter for client-side routing */}
        <BrowserRouter>
          {/* Routes define the application's navigation structure */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/watchlist" element={<WishlistPage />} />
            <Route path="/compare" element={<ComparePage />} />
            {/* <Route path="/login" element={<LoginPage />} /> */}
            <Route path="/coin/:id" element={<CoinPage />} />
            <Route path="/api-test" element={<APITest />} />
          </Routes>
          {/* ChatBot component available throughout the application */}
          <ChatBot />
        </BrowserRouter>
      </Provider>
    </div>
  );
};

export default App;
