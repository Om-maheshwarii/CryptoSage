import React from "react";
import "../Header/style.css";
import { Link } from "react-router-dom";
import AnchorTemporaryDrawer from "./drawer";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import Button from "../Button/Button";
import BasicSelect from "./Menu/Menu";
import { useAuth0 } from "@auth0/auth0-react";

import AIAssistant from "./AIAssistant/AIAssistant";

const Header = () => {
  const { isAuthenticated, logout, loginWithRedirect } = useAuth0();

  const handleLogin = () => {
    loginWithRedirect({
      authorizationParams: {
        prompt: "login",
        screen_hint: "login",
      },
    });
  };

  const handleLogout = () => {
    console.log("Logout button clicked");
    logout({ returnTo: window.location.origin });
  };

  return (
    <div className="navbar">
      <h1 className="logo">
        CryptoSage<span style={{ color: "var(--red)" }}>.</span>
      </h1>
      <div className="links">
        <Link to="/">
          <p className="link">Home</p>
        </Link>
        <Link to="/compare">
          <p className="link">Compare</p>
        </Link>
        <Link to="/watchlist">
          <p className="link">Watchlist</p>
        </Link>
      </div>
      <div className="menu">
        <BasicSelect />
      </div>
      <div className="buttons">
        <AIAssistant />
        <Link to="/dashboard">
          <Button text={"Dashboard"} outlined={true} />
        </Link>
        {!isAuthenticated ? (
          <Button text={"Login"} onClick={handleLogin} />
        ) : (
          <Button text={"Logout"} onClick={handleLogout} />
        )}
      </div>

      <div className="mobile-drawer">
        <AnchorTemporaryDrawer />
      </div>
    </div>
  );
};

export default Header;
