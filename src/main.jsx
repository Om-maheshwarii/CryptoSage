import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import CurrencyContext from "./CurrencyContext.jsx";
import { Provider } from "react-redux";
import store from "./Store.js"; // Your Redux store
import "react-alice-carousel/lib/alice-carousel.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CurrencyContext>
      <Provider store={store}>
        <App />
      </Provider>
    </CurrencyContext>
  </StrictMode>
);
