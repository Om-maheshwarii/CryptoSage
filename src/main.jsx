/**
 * main.jsx - Application Entry Point
 *
 * This file serves as the entry point for the React application.
 * It sets up the root rendering with necessary providers and context.
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import CurrencyContext from "./CurrencyContext.jsx";
import { Provider } from "react-redux";
import store from "./Store.js"; // Redux store for state management
import "react-alice-carousel/lib/alice-carousel.css";
import { Auth0Provider } from "@auth0/auth0-react";

// Create and render the root component with necessary providers
createRoot(document.getElementById("root")).render(
  <Auth0Provider
    domain="dev-2yg11x7vceeoskjq.us.auth0.com"
    clientId="lQxGbUAR2yATW82kdf7oiXvfcIIMoaYL"
    authorizationParams={{
      redirect_uri: window.location.origin,
    }}
  >
    <StrictMode>
      {/* CurrencyContext provides currency-related state to the app */}
      <CurrencyContext>
        {/* Redux Provider for global state management */}
        <Provider store={store}>
          <App />
        </Provider>
      </CurrencyContext>
    </StrictMode>
  </Auth0Provider>
);
