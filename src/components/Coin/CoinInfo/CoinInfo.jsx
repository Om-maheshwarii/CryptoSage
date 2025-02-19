import React, { useState } from "react";
import "./coinInfo.css";
import { color } from "framer-motion";
const CoinInfo = ({ heading, description }) => {
  const [expanded, setExpanded] = useState(false);
  const shortDesc =
    description.length > 300
      ? description.substring(0, 300) + "..."
      : description;
  const longDesc = description; // You can set longDesc differently if needed.

  const handleReadMoreClick = () => {
    setExpanded(true);
  };

  const handleReadLessClick = () => {
    setExpanded(false);
  };

  return (
    <div className="purple-wrapper">
      <h2>{heading}</h2>
      <p>
        {description.length > 200 ? (
          <>
            {expanded ? (
              <>
                {description}
                <span
                  style={{ color: "var(--lightpurple)", cursor: "pointer" }}
                  onClick={handleReadLessClick}
                >
                  Read Less
                </span>
              </>
            ) : (
              <>
                {description.substring(0, 200)}...
                <span
                  style={{ color: "var(--lightpurple)", cursor: "pointer" }}
                  onClick={handleReadMoreClick}
                >
                  Read More
                </span>
              </>
            )}
          </>
        ) : (
          description
        )}
      </p>
    </div>
  );
};

export default CoinInfo;
