/**
 * api.js - API Endpoint Configuration
 *
 * This file contains the API endpoint URLs for the CoinGecko API.
 * These endpoints are used to fetch cryptocurrency data throughout the application.
 */

/**
 * Returns the API endpoint for fetching a list of coins
 *
 * @param {string} currency - The currency code (e.g., 'usd', 'inr', 'eur')
 * @returns {string} The complete API endpoint URL
 */
export const CoinList = (currency) =>
  `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=100&page=1&sparkline=false`;

/**
 * Returns the API endpoint for fetching details of a single coin
 *
 * @param {string} id - The coin ID
 * @returns {string} The complete API endpoint URL
 */
export const SingleCoin = (id) =>
  `https://api.coingecko.com/api/v3/coins/${id}`;

/**
 * Returns the API endpoint for fetching historical chart data for a coin
 *
 * @param {string} id - The coin ID
 * @param {number} days - Number of days of historical data to fetch (default: 365)
 * @param {string} currency - The currency code
 * @returns {string} The complete API endpoint URL
 */
export const HistoricalChart = (id, days = 365, currency) =>
  `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=${currency}&days=${days}`;

/**
 * Returns the API endpoint for fetching price data for a coin
 *
 * @param {string} id - The coin ID
 * @param {number} days - Number of days of price data to fetch
 * @param {string} currency - The currency code
 * @returns {string} The complete API endpoint URL
 */
export const coinPrices = (id, days, currency) =>
  `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=${currency}&days=${days}`;

/**
 * Returns the API endpoint for fetching trending coins
 *
 * @param {string} currency - The currency code
 * @returns {string} The complete API endpoint URL
 */
export const TrendingCoins = (currency) =>
  `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=gecko_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h`;
