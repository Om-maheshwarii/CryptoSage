/**
 * CurrencyContext.jsx - Currency Context Provider
 *
 * This file provides a context for managing currency-related state across the application.
 * It allows components to access and update the current currency and its symbol.
 */

import React, { useContext, useEffect, useState } from "react";
import { createContext } from "react";

// Create the context for currency-related state
const Crypto = createContext();

/**
 * CurrencyContext Component
 *
 * Provider component that manages currency state and provides it to child components.
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to be wrapped by the context
 * @returns {JSX.Element} The context provider with currency state
 */
const CurrencyContext = ({ children }) => {
  // Default currency is INR (Indian Rupee)
  const [currency, setCurrency] = useState("inr");
  // Default symbol is ₹ (Rupee symbol)
  const [symbol, setSymbol] = useState("₹");

  // Update the currency symbol when the currency changes
  useEffect(() => {
    if (currency === "inr") setSymbol("₹");
    else if (currency === "usd") setSymbol("$");
    else if (currency === "eur") setSymbol("€");
  }, [currency]);

  return (
    <Crypto.Provider value={{ currency, setCurrency, symbol }}>
      {children}
    </Crypto.Provider>
  );
};

export default CurrencyContext;

/**
 * Custom hook to access the currency context
 *
 * @returns {Object} The currency context containing currency, setCurrency, and symbol
 */
export const cryptoState = () => {
  return useContext(Crypto);
};
