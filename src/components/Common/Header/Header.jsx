import React from "react";
import "../Header/style.css";
import { Link } from "react-router-dom";
import AnchorTemporaryDrawer from "./drawer";
import Button from "../Button/Button";
import BasicSelect from "./Menu/Menu";
import { useAuth0 } from "@auth0/auth0-react";
import Profile from "../../Profile/Profile";
import AIAssistant from "./AIAssistant/AIAssistant";

const Header = () => {
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  const handleLogin = () => {
    loginWithRedirect({
      authorizationParams: {
        prompt: "login",
        screen_hint: "login",
      },
    });
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
        {isAuthenticated ? (
          <Profile />
        ) : (
          <div className="login-button" onClick={handleLogin}>
            <Button text={"Login"} />
          </div>
        )}
      </div>

      <div className="mobile-drawer">
        <AnchorTemporaryDrawer />
      </div>
    </div>
  );
};

export default Header;
