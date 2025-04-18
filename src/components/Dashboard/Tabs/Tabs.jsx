import * as React from "react";
import { useState } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { colors, createTheme } from "@mui/material";
import { ThemeProvider } from "@emotion/react";
import Grid from "../Grid/Grid";
import "./style.css";
import List from "../List/List";

/**
 * TabsComponent - Dashboard Tabs Component
 *
 * Provides tabs for different views of cryptocurrency data:
 * - Grid view: Displays cryptocurrencies in a grid layout
 * - List view: Displays cryptocurrencies in a list layout
 *
 * @param {Object} props - Component props
 * @param {Array} props.coins - Array of cryptocurrency data
 * @param {string} props.symbol - Currency symbol for displaying prices
 * @returns {JSX.Element} The rendered tabs component
 */
export default function TabsComponent({ coins, symbol }) {
  const [value, setValue] = useState("grid");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const theme = createTheme({
    palette: {
      primary: {
        main: "#fff",
      },
    },
  });

  const style = {
    color: "var(--lightwhite)",
    width: "50vw",
    fontSize: "1rem",
    fontWeight: "600",
    fontFamily: "Montserrat",
    textTansform: "capitalize",
  };

  return (
    <ThemeProvider theme={theme}>
      <TabContext value={value}>
        <TabList onChange={handleChange} variant="fullWidth">
          <Tab label="Grid" value="grid" sx={style} />
          <Tab label="List" value="list" sx={style} />
        </TabList>
        <TabPanel value="grid">
          <div className="grid-flex">
            {coins.map((coin, i) => {
              return <Grid coin={coin} symbol={symbol} key={i} />;
            })}
          </div>
        </TabPanel>
        <TabPanel value="list" style={{ padding: "0", margin: "0" }}>
          <table className="list-table">
            <tbody>
              {coins.map((coin, i) => {
                return (
                  <List
                    coin={coin}
                    symbol={symbol}
                    key={i}
                    delay={(i % 8) * 0.2}
                  />
                );
              })}
            </tbody>
          </table>
        </TabPanel>
      </TabContext>
    </ThemeProvider>
  );
}
