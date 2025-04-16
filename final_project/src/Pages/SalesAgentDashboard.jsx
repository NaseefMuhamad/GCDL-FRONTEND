import { useEffect } from "react";
import Chart from "../components/Chart";

import LiveClock from "../components/LiveClock";
import { useApi } from "../hooks/useApi";
import { useAuth } from "../context/AuthContext";

function SalesAgentDashboard() {
  const { user } = useAuth();
  const { data: analyticsData, loading, error, fetchData } = useApi(`/api/analytics?branch=${user.branch}`);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (user.role !== "sales_agent") {
    return <div>Access Denied</div>;
  }

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
        tension: 0.4,
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
        borderColor: "#1e40af",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: { position: "top" },
      title: { display: true },
    },
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Sales Agent Dashboard</h2>
      <div className="live-clock-container">
        <LiveClock />
      </div>
      <div className="dashboard-image-container">
        <img
          src="/images/sales-team.jpg"
          alt="Sales Team"
          className="dashboard-image"
        />
      </div>
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
      <div className="chart-container">
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
      <div className="chart-container">
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
