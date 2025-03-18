import { MenuItem, Select, CircularProgress } from "@mui/material";
import React from "react";
import "./style.css";
import SelectButton from "../../Coin/SelectButton/SelectButton";

const SelectComponent = ({
  crypto1,
  crypto2,
  handleCoinChange,
  handleDaysChange,
  days,
  allCoins = [],
}) => {
  const selectStyles = {
    height: "2.5rem",
    color: "var(--white)",
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "var(--white)",
    },
    "& .MuiSvgIcon-root": {
      color: "var(--white)",
    },
    "&:hover": {
      "&& fieldset": {
        borderColor: "#3a80e9",
      },
    },
    backgroundColor: "#261e35",
    "& .MuiSelect-select": {
      paddingRight: "32px",
    },
  };

  const menuProps = {
    PaperProps: {
      sx: {
        bgcolor: "#9285ea",
        maxHeight: 300,
        "& .MuiMenuItem-root:hover": {
          bgcolor: "#625a98",
        },
        "& .MuiMenuItem-root.Mui-selected": {
          bgcolor: "var(--purple)",
        },
        "& .MuiMenuItem-root.Mui-selected:hover": {
          bgcolor: "#625a98",
        },
      },
    },
  };

  if (!allCoins || allCoins.length === 0) {
    return <CircularProgress sx={{ color: "var(--purple)" }} />;
  }

  return (
    <div className="coin-flex">
      <p>Crypto 1</p>
      <Select
        value={crypto1}
        onChange={(e) => handleCoinChange(e, false)}
        sx={selectStyles}
        MenuProps={menuProps}
      >
        {allCoins.map((coin) => (
          <MenuItem value={coin.id} key={coin.id}>
            {coin.name}
          </MenuItem>
        ))}
      </Select>

      <p>Crypto 2</p>
      <Select
        value={crypto2}
        onChange={(e) => handleCoinChange(e, true)}
        sx={selectStyles}
        MenuProps={menuProps}
      >
        {allCoins.map((coin) => (
          <MenuItem value={coin.id} key={coin.id}>
            {coin.name}
          </MenuItem>
        ))}
      </Select>

      <SelectButton
        days={days}
        handleDaysChange={handleDaysChange}
        noPTag={true}
      />
    </div>
  );
};

export default SelectComponent;
