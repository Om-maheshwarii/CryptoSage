/**
 * coinObject.js - Coin Data Formatter
 *
 * This file contains a utility function for formatting coin data from the API.
 * It extracts relevant properties from the API response and formats them for use in the application.
 */

/**
 * Formats coin data from the API response
 *
 * Extracts and formats relevant properties from the coin data returned by the API.
 *
 * @param {Function} setState - The state setter function to update the coin data
 * @param {Object} data - The raw coin data from the API
 */
const coinObject = (setState, data) => {
  setState({
    id: data.id,
    name: data.name,
    symbol: data.symbol,
    image: data.image.large,
    desc: data.description.en,
    price_change_percentage_24h: data.market_data.price_change_percentage_24h,
    total_volume: data.market_data.total_volume.usd,
    current_price: data.market_data.current_price.usd,
    market_cap: data.market_data.market_cap.usd,
  });
};

export default coinObject;
