import React, { useContext, useEffect, useState } from "react";
import { createContext } from "react";

const Crypto = createContext();

const CurrencyContext = ({ children }) => {
  const [currency, setCurrency] = useState("inr");
  const [symbol, setSymbol] = useState("₹");

  useEffect(() => {
    if (currency == "inr") setSymbol("₹");
    else if (currency == "usd") setSymbol("$");
    else if (currency == "eur") setSymbol("€");
  }, [currency]);
  return (
    <Crypto.Provider value={{ currency, setCurrency, symbol }}>
      {children}
    </Crypto.Provider>
  );
};

export default CurrencyContext;

export const cryptoState = () => {
  return useContext(Crypto);
};
