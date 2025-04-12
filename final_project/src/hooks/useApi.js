import { useState, useCallback } from "react";

export function useApi(endpoint) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      if (endpoint === "/api/analytics") {
        setData({
          kpis: {
            totalSales: 12500,
            procurementCosts: 7500,
            stockTurnover: 2.5,
            profitMargin: 28,
          },
          salesTrend: {
            labels: ["Jan", "Feb", "Mar", "Apr"],
            datasets: [
              {
                label: "Sales ($)",
                data: [5000, 7000, 6000, 8000],
                borderColor: "#1e40af",
                backgroundColor: "rgba(30, 64, 175, 0.2)",
                fill: true,
              },
            ],
          },
          stockLevels: {
            labels: ["Beans", "Rice", "Maize"],
            datasets: [
              {
                label: "Stock (tons)",
                data: [10, 8, 15],
                backgroundColor: "#1e40af",
              },
            ],
          },
        });
      } else if (endpoint === "/api/credit-sales") {
        setData([]);
      } else if (endpoint === "/api/sales") {
        setData([]);
      } else if (endpoint === "/api/procurements") {
        setData([]);
      } else if (endpoint === "/api/stock") {
        setData([]);
      } else if (endpoint === "/api/login") {
        setData({ token: "mock-token", username: "user" });
      }
      setError(null);
    } catch (err) {
      setError("Failed to fetch data");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [endpoint]); // Dependency: endpoint

  return { data, loading, error, fetchData };
}