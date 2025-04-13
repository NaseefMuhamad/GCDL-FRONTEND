import { useEffect } from "react";
import Chart from "../components/Chart";
import { useApi } from "../hooks/useApi";

function SalesAgentDashboard() {
  const { data: analyticsData, loading, error, fetchData } = useApi("/api/analytics");

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const kpis = analyticsData?.kpis || {
    totalSales: 0,
    procurementCosts: 0,
    stockTurnover: 0,
    profitMargin: 0,
  };

  const salesTrend = analyticsData?.salesTrend || {
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
  };

  const stockLevels = analyticsData?.stockLevels || {
    labels: ["Beans", "Rice", "Maize"],
    datasets: [
      {
        label: "Stock (tons)",
        data: [10, 8, 15],
        backgroundColor: "#1e40af",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
    },
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Dashboard</h2>
      <div className="dashboard-kpi-grid">
        <div className="dashboard-kpi-card">
          <h3>Total Sales</h3>
          <p>${kpis.totalSales.toLocaleString()}</p>
        </div>
        <div className="dashboard-kpi-card">
          <h3>Procurement Costs</h3>
          <p>${kpis.procurementCosts.toLocaleString()}</p>
        </div>
        <div className="dashboard-kpi-card">
          <h3>Stock Turnover</h3>
          <p>{kpis.stockTurnover.toFixed(2)}</p>
        </div>
        <div className="dashboard-kpi-card">
          <h3>Profit Margin</h3>
          <p>{kpis.profitMargin.toFixed(1)}%</p>
        </div>
      </div>
      <div className="dashboard-chart-container">
        <h3>Sales Trend</h3>
        <Chart
          type="line"
          data={salesTrend}
          options={{
            ...chartOptions,
            plugins: { ...chartOptions.plugins, title: { display: true, text: "Sales Over Time" } },
          }}
        />
      </div>
      <div className="dashboard-chart-container">
        <h3>Stock Levels</h3>
        <Chart
          type="bar"
          data={stockLevels}
          options={{
            ...chartOptions,
            plugins: { ...chartOptions.plugins, title: { display: true, text: "Stock by Produce" } },
          }}
        />
      </div>
    </div>
  );
}

export default SalesAgentDashboard;