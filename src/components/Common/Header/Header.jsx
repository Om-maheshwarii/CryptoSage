import React from "react";
import "../Header/style.css";
import { Link } from "react-router-dom";
import AnchorTemporaryDrawer from "./drawer";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import Button from "../Button/Button";
import BasicSelect from "./Menu/Menu";
import AIAssistant from "./AIAssistant/AIAssistant";

const Header = () => {
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
        <Link to="/Login" className="login">
          <Button text={"Login"} />
        </Link>
      </div>

      <div className="mobile-drawer">
        <AnchorTemporaryDrawer />
      </div>
    </div>
  );
};

export default Header;
