import React, { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import { cryptoState } from "../../../CurrencyContext";
import { HistoricalChart } from "../../../config/api";
import LoaderComponent from "../../Common/Loader/Loader";
import { Line } from "react-chartjs-2";
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

// Register Chart.js components once
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Constants
const COLORS = {
  PRIMARY: {
    BORDER: "#9370DB",
    BACKGROUND: "rgba(147, 112, 219, 0.2)",
    TEXT: "#D8BFD8",
  },
  SECONDARY: {
    BORDER: "#4CAF50",
    BACKGROUND: "rgba(76, 175, 80, 0.2)",
    TEXT: "#4CAF50",
  },
  BACKGROUND: "#261e35",
  BUTTON: {
    ACTIVE: "#9370DB",
    INACTIVE: "#3d3351",
  },
};

const ChartComponent = ({
  primaryId,
  secondaryId,
  displayMode = "absolute",
  days,
}) => {
  console.log("ChartComponent rendering with:", {
    primaryId,
    secondaryId,
    days,
  });

  const [chartData, setChartData] = useState({
    primary: null,
    secondary: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [viewMode, setViewMode] = useState(displayMode);
  const { currency } = cryptoState();

  // Reset data when IDs change
  useEffect(() => {
    setChartData({
      primary: null,
      secondary: null,
    });
  }, [primaryId, secondaryId]);

  // Fetch data whenever primaryId, secondaryId, days, or currency changes
  useEffect(() => {
    console.log("ChartComponent useEffect triggered");
    let isMounted = true;
    setLoading(true);
    setError(false);

    const fetchData = async () => {
      try {
        console.log("Fetching chart data for:", {
          primaryId,
          secondaryId,
          days,
          currency,
        });

        // Create both requests
        const primaryRequest = axios.get(
          HistoricalChart(primaryId, days, currency)
        );
        const secondaryRequest = secondaryId
          ? axios.get(HistoricalChart(secondaryId, days, currency))
          : Promise.resolve({ data: { prices: [] } });

        // Use Promise.all for parallel requests
        const [primaryResponse, secondaryResponse] = await Promise.all([
          primaryRequest,
          secondaryRequest,
        ]);

        if (isMounted) {
          console.log("Chart data fetched successfully");

          // Validate primary data
          if (
            !primaryResponse.data ||
            !primaryResponse.data.prices ||
            primaryResponse.data.prices.length === 0
          ) {
            console.error("Invalid primary data structure received");
            setError(true);
            return;
          }

          setChartData({
            primary: primaryResponse.data.prices,
            secondary: secondaryResponse.data.prices || null,
          });
        }
      } catch (error) {
        console.error("Error fetching chart data:", error);
        if (isMounted) {
          setError(true);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [primaryId, secondaryId, days, currency]);

  // Format date/time for labels
  const formatTimeLabel = useCallback(
    (timestamp) => {
      const date = new Date(timestamp);

      if (days === 1) {
        const hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, "0");
        return `${hours % 12 || 12}:${minutes} ${hours >= 12 ? "PM" : "AM"}`;
      }

      return date.toLocaleDateString();
    },
    [days]
  );

  // Convert absolute values to percentage change
  const normalizeData = useCallback((data) => {
    if (!data || data.length === 0) return [];

    const initialValue = data[0][1];
    return data.map((point) => [
      point[0],
      ((point[1] - initialValue) / initialValue) * 100,
    ]);
  }, []);

  // Memoize chart data preparation
  const preparedChartData = useMemo(() => {
    if (!chartData.primary) return { labels: [], datasets: [] };

    const { primary, secondary } = chartData;
    const currentMode = viewMode;

    // Ensure we have valid data before proceeding
    if (!primary || primary.length === 0) {
      console.warn("No primary data available");
      return { labels: [], datasets: [] };
    }

    // Get labels from primary data
    const labels = primary.map((coin) => formatTimeLabel(coin[0]));

    const processedPrimary =
      currentMode === "percentage" ? normalizeData(primary) : primary;
    const processedSecondary =
      secondary && currentMode === "percentage"
        ? normalizeData(secondary)
        : secondary;

    const yAxisLabel = currentMode === "percentage" ? "% Change" : "Price";

    const datasets = [
      {
        data: processedPrimary.map((coin) => coin[1]),
        label: `${primaryId} ${yAxisLabel} (Past ${days} Days)`,
        borderColor: COLORS.PRIMARY.BORDER,
        backgroundColor: COLORS.PRIMARY.BACKGROUND,
        pointBorderColor: COLORS.PRIMARY.BORDER,
        pointBackgroundColor: COLORS.PRIMARY.BORDER,
        yAxisID: "y",
      },
    ];

    if (processedSecondary && processedSecondary.length > 0) {
      datasets.push({
        data: processedSecondary.map((coin) => coin[1]),
        label: `${secondaryId} ${yAxisLabel} (Past ${days} Days)`,
        borderColor: COLORS.SECONDARY.BORDER,
        backgroundColor: COLORS.SECONDARY.BACKGROUND,
        pointBorderColor: COLORS.SECONDARY.BORDER,
        pointBackgroundColor: COLORS.SECONDARY.BORDER,
        yAxisID: currentMode === "absolute" ? "y1" : "y",
      });
    }

    return { labels, datasets };
  }, [
    chartData,
    viewMode,
    primaryId,
    secondaryId,
    days,
    formatTimeLabel,
    normalizeData,
  ]);

  // Memoize chart options
  const chartOptions = useMemo(() => {
    const baseOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: "category",
          ticks: {
            color: COLORS.PRIMARY.TEXT,
            maxRotation: 45,
            minRotation: 45,
          },
          grid: {
            color: "rgba(200, 200, 200, 0.1)",
          },
        },
        y: {
          type: "linear",
          display: true,
          position: "left",
          ticks: {
            color: COLORS.PRIMARY.TEXT,
          },
          grid: {
            color: "rgba(200, 200, 200, 0.1)",
          },
          title: {
            display: true,
            text:
              viewMode === "percentage" ? "Percentage Change (%)" : primaryId,
            color: COLORS.PRIMARY.BORDER,
          },
        },
      },
      plugins: {
        legend: {
          labels: {
            color: COLORS.PRIMARY.TEXT,
          },
        },
        tooltip: {
          mode: "index",
          intersect: false,
        },
      },
      elements: {
        point: {
          radius: 1,
        },
        line: {
          tension: 0.4,
        },
      },
      interaction: {
        mode: "nearest",
        axis: "x",
        intersect: false,
      },
    };

    // Add secondary y-axis only when needed
    if (viewMode === "absolute" && chartData.secondary) {
      baseOptions.scales.y1 = {
        type: "linear",
        display: true,
        position: "right",
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          color: COLORS.SECONDARY.TEXT,
        },
        title: {
          display: true,
          text: secondaryId,
          color: COLORS.SECONDARY.BORDER,
        },
      };
    }

    return baseOptions;
  }, [viewMode, primaryId, secondaryId, chartData.secondary]);

  // Render component
  return (
    <div>
      {loading ? (
        <div className="center-loader">
          <LoaderComponent />
        </div>
      ) : error ? (
        <div
          className="error-message"
          style={{ textAlign: "center", padding: "40px 0" }}
        >
          <p>Error loading chart data. Please try again.</p>
        </div>
      ) : (
        <>
          <div className="chart-container">
            <div className="chart-mode-toggle">
              <button
                className={`toggle-button ${
                  viewMode === "absolute" ? "active" : ""
                }`}
                onClick={() => setViewMode("absolute")}
                style={{
                  backgroundColor:
                    viewMode === "absolute"
                      ? COLORS.BUTTON.ACTIVE
                      : COLORS.BUTTON.INACTIVE,
                  color: "white",
                  border: "none",
                  padding: "8px 16px",
                  margin: "0 5px",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Absolute
              </button>
              <button
                className={`toggle-button ${
                  viewMode === "percentage" ? "active" : ""
                }`}
                onClick={() => setViewMode("percentage")}
                style={{
                  backgroundColor:
                    viewMode === "percentage"
                      ? COLORS.BUTTON.ACTIVE
                      : COLORS.BUTTON.INACTIVE,
                  color: "white",
                  border: "none",
                  padding: "8px 16px",
                  margin: "0 5px",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                % Change
              </button>
            </div>
            <div style={{ height: "400px", width: "100%", marginTop: "20px" }}>
              {preparedChartData.labels.length > 0 ? (
                <Line data={preparedChartData} options={chartOptions} />
              ) : (
                <div
                  className="no-data-message"
                  style={{ textAlign: "center", marginTop: "100px" }}
                >
                  No chart data available
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChartComponent;
