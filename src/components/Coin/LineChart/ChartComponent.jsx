import React, { useEffect, useState } from "react";
import axios from "axios";
import { cryptoState } from "../../../CurrencyContext";
import { HistoricalChart } from "../../../config/api";
import LoaderComponent from "../../Common/Loader/Loader";
import { Line } from "react-chartjs-2";
import { chartDays } from "../../../config/data";
import SelectButton from "./SelectBtn/SelectButton";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
const ChartComponent = ({ id }) => {
  const [historicData, setHistoricData] = useState();
  const [days, setDays] = useState(1);
  const { currency } = cryptoState();

  const fetchHistoricData = async () => {
    const { data } = await axios.get(HistoricalChart(id, days, currency));
    setHistoricData(data.prices);
  };
  console.log("DATA", id);
  console.log("DATA", historicData);
  useEffect(() => {
    fetchHistoricData();
  }, [days, currency]);
  return (
    <div
      style={{
        backgroundColor: "#261e35",
        padding: "20px",
        borderRadius: "8px",
      }}
    >
      {" "}
      {/* Purple background */}
      {!historicData ? (
        <LoaderComponent />
      ) : (
        <>
          <Line
            data={{
              labels: historicData.map((coin) => {
                let date = new Date(coin[0]);
                let time =
                  date.getHours() > 12
                    ? `${date.getHours() - 12}:${date.getMinutes()} PM`
                    : `${date.getHours()}:${date.getMinutes()} AM`;
                return days === 1 ? time : date.toLocaleDateString();
              }),
              datasets: [
                {
                  data: historicData.map((coin) => coin[1]),
                  label: `Price ( Past ${days} Days ) in ${currency}`,
                  borderColor: "#9370DB", // Light purple line
                  backgroundColor: "rgba(147, 112, 219, 0.2)", // Light purple fill
                  pointBorderColor: "#9370DB",
                  pointBackgroundColor: "#9370DB",
                },
              ],
            }}
            options={{
              scales: {
                x: {
                  type: "category",
                  ticks: {
                    color: "#D8BFD8", // Light purple text
                  },
                },
                y: {
                  type: "linear",
                  ticks: {
                    color: "#D8BFD8", // Light purple text
                  },
                },
              },
              plugins: {
                legend: {
                  labels: {
                    color: "#D8BFD8", // Light purple legend text
                  },
                },
              },
              elements: {
                point: {
                  radius: 1,
                },
                line: {
                  tension: 0.4, // Optional: smooth the line a bit
                },
              },
            }}
          />
          <div
            style={{
              display: "flex",
              marginTop: 20,
              justifyContent: "space-around",
              width: "100%",
            }}
          >
            {chartDays.map((day) => (
              <SelectButton
                key={day.value}
                onClick={() => {
                  setDays(day.value);
                }}
                selected={day.value === days}
              >
                {day.label}
              </SelectButton>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ChartComponent;
