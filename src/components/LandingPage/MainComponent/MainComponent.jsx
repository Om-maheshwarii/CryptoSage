import React from "react";
import "./style.css";
import Button from "../../Common/Button/Button";
import iphone from "../../../assets/phone.png";
import gradient from "../../../assets/gradient.png";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const MainComponent = () => {
  return (
    <div className="flex-info">
      <div className="left-component">
        <motion.h1
          className="track-crypto-heading"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          Track Crypto
        </motion.h1>
        <motion.h1
          className="real-time-heading"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.75, duration: 1 }}
        >
          Real Time<span style={{ color: "var(--blue)" }}>.</span>
        </motion.h1>
        <motion.span
          className="info"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1, duration: 1 }}
        >
          Welcome to CryptoSage, your all-in-one platform for real-time
          cryptocurrency insights.
        </motion.span>
        <motion.p
          className="info-text"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1, duration: 1 }}
        >
          Whether you're a trader, investor, or enthusiast, our intelligent
          tracker helps you stay ahead of the market with live price updates,
          interactive charts, and Al-powered trend analysis. Unlike traditional
          trackers, we provide personalized recommendations based on search
          patterns and Al-driven insights to highlight the best-performing and
          most trending cryptocurrencies. Stay informed, make smarter decisions,
          and navigate the crypto world with confidence-all in one powerful
          platform.
        </motion.p>
        <motion.div
          className="left-buttons"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.25, duration: 0.75 }}
        >
          <Link to="/dashboard">
            <Button text={"Dashboard"} outlined={true} />
          </Link>
          <Link to="/login">
            <Button text={"Login"} />
          </Link>
        </motion.div>
      </div>
      <div className="phone-container">
        <motion.img
          src={iphone}
          className="iphone"
          initial={{ y: -10 }}
          animate={{ y: 10 }}
          transition={{
            type: "smooth",
            repeatType: "mirror",
            duration: 2,
            repeat: Infinity,
          }}
        />
        <img src={gradient} className="gradient" />
      </div>
    </div>
  );
};

export default MainComponent;
