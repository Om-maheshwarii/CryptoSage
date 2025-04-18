/**
 * Dashboard.jsx - Dashboard Page Component
 *
 * This component renders the dashboard page of the application.
 * It displays a list of cryptocurrencies with search and pagination functionality.
 */

import React, { useEffect, useState } from "react";
import Header from "../components/Common/Header/Header";
import TabsComponent from "../components/Dashboard/Tabs/Tabs";
import axios from "axios";
import Search from "../components/Dashboard/Searcch/Search";
import NoResults from "../components/Dashboard/NoResult/NoResult";
import Pagination from "../components/Dashboard/Pagination/Pagination";
import LoaderComponent from "../components/Common/Loader/Loader";
import { cryptoState } from "../CurrencyContext";

/**
 * DashboardPage Component
 *
 * Renders the dashboard page with cryptocurrency data, search, and pagination.
 *
 * @returns {JSX.Element} The rendered dashboard page
 */
const DashboardPage = () => {
  // State for storing cryptocurrency data
  const [coins, setCoins] = useState([]);
  // Get currency context for displaying prices in the correct currency
  const { currency, symbol } = cryptoState();
  // State for paginated coins
  const [paginatedCoins, setPaginatedCoins] = useState([]);
  // State for search input
  const [search, setSearch] = useState("");
  // State for current page number
  const [page, setPage] = useState(1);
  // State for loading status
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Handles page change in pagination
   *
   * @param {Object} event - The event object
   * @param {number} value - The new page number
   */
  const handlePageChange = (event, value) => {
    setPage(value);
    const previousIndex = (value - 1) * 10;
    setPaginatedCoins(coins.slice(previousIndex, previousIndex + 10));
  };

  /**
   * Handles search input change
   *
   * @param {Object} e - The event object
   */
  const onSearchChange = (e) => {
    setSearch(e.target.value);
  };

  /**
   * Clears the search input
   */
  const clearSearch = () => {
    setSearch("");
  };

  // Filter coins based on search input
  const filteredCoins = coins.filter(
    (coin) =>
      coin.name.toLowerCase().includes(search.trim().toLowerCase()) ||
      coin.symbol.toLowerCase().includes(search.trim().toLowerCase())
  );

  // Fetch cryptocurrency data when currency changes
  useEffect(() => {
    axios
      .get(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=100&page=1&sparkline=false`
      )
      .then((response) => {
        setCoins(response.data);
        setPaginatedCoins(response.data.slice(0, 10));
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  }, [currency]);

  return (
    <>
      <Header />
      {isLoading ? (
        <LoaderComponent />
      ) : (
        <div>
          <Search search={search} onSearchChange={onSearchChange} />
          {search.trim() !== "" && filteredCoins.length === 0 ? (
            <NoResults clearSearch={clearSearch} />
          ) : (
            <TabsComponent
              coins={search ? filteredCoins : paginatedCoins}
              symbol={symbol}
            />
          )}
          {!search && (
            <Pagination page={page} handlePageChange={handlePageChange} />
          )}
        </div>
      )}
    </>
  );
};

export default DashboardPage;
