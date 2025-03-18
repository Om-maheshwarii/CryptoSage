import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useState } from "react";
import { purple } from "@mui/material/colors";
import { cryptoState } from "../../../../CurrencyContext";

export default function BasicSelect() {
  const { currency, setCurrency } = cryptoState();
  console.log(currency);
  const backgroundColor = "#1c1628";
  const lighterShade = "var(--purple)";
  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel
          id="demo-simple-select-label"
          sx={{
            color: "white",
            "&.Mui-focused": {
              color: "white",
            },
          }}
        >
          Currency
        </InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={currency}
          label="Currency"
          onChange={(e) => {
            setCurrency(e.target.value);
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                bgcolor: backgroundColor,
                "& .MuiMenuItem-root": {
                  color: "white",
                  "&:hover": {
                    bgcolor: lighterShade,
                  },
                  "&.Mui-selected": {
                    bgcolor: lighterShade,
                    "&:hover": {
                      bgcolor: lighterShade,
                    },
                  },
                },
              },
            },
          }}
          sx={{
            backgroundColor: backgroundColor,
            color: "white",
            borderRadius: "4px",
            "& .MuiSelect-select": {
              padding: "10px",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: lighterShade,
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "white",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "white",
            },
            "&.Mui-focused": {
              backgroundColor: lighterShade,
            },
          }}
        >
          <MenuItem value={"usd"}>USD</MenuItem>
          <MenuItem value={"inr"}>INR</MenuItem>
          <MenuItem value={"eur"}>EUR</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
