import { useEffect, useState } from "react";
import Chart from "../components/Chart"; // Correct path based on your file structure
import LiveClock from "../components/LiveClock";
import { useApi } from "../hooks/useApi";
import { useAuth } from "../context/AuthContext";

function CEODashboard() {
  const { user } = useAuth();
  const [branchFilter, setBranchFilter] = useState("all");
  const { data: analyticsData, loading, error, execute } = useApi(`/api/ceo-analytics?branch=${branchFilter}`);

  useEffect(() => {
    execute({}, "GET");
  }, [execute, branchFilter]);

  if (user.role !== "ceo") {
    return <div>Access Denied</div>;
  }

  const kpis = analyticsData?.kpis || {
    totalSales: 0,
    procurementCosts: 0,
    stockTurnover: 0,
    userCount: 0,
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

  const procurementTrend = analyticsData?.procurementTrend || {
    labels: ["Jan", "Feb", "Mar", "Apr"],
    datasets: [
      {
        label: "Procurement ($)",
        data: [2000, 3000, 2500, 4000],
        borderColor: "#059669",
        backgroundColor: "rgba(5, 150, 105, 0.2)",
        fill: true,
        tension: 0.4,
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
      <h2 className="dashboard-title">CEO Dashboard</h2>
      <div className="live-clock-container">
        <LiveClock />
      </div>
      <p className="welcome-message">
        Welcome, CEO! Here's the overview for{" "}
        {branchFilter === "all"
          ? "both branches"
          : branchFilter.charAt(0).toUpperCase() + branchFilter.slice(1)}
        .
      </p>
      <div className="branch-filter">
        <label htmlFor="branch-select">Select Branch: </label>
        <select
          id="branch-select"
          value={branchFilter}
          onChange={(e) => setBranchFilter(e.target.value)}
          className="form-input"
        >
          <option value="all">All Branches</option>
          <option value="maganjo">Maganjo</option>
          <option value="matugga">Matugga</option>
        </select>
      </div>
      <div className="dashboard-image-container">
        <img
          src="/images/crop-warehouse.jpg"
          alt="Golden Crop Warehouse"
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
          <h3>Total Users</h3>
          <p>{kpis.userCount}</p>
        </div>
      </div>
      <div className="chart-container">
        <h3>Sales Trend</h3>
        <Chart
          type="line"
          data={salesTrend}
          options={{
            ...chartOptions,
            plugins: {
              ...chartOptions.plugins,
              title: { display: true, text: "Sales Over Time" },
            },
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
            plugins: {
              ...chartOptions.plugins,
              title: { display: true, text: "Stock by Produce" },
            },
          }}
        />
      </div>
      <div className="chart-container">
        <h3>Procurement Trend</h3>
        <Chart
          type="line"
          data={procurementTrend}
          options={{
            ...chartOptions,
            plugins: {
              ...chartOptions.plugins,
              title: { display: true, text: "Procurement Over Time" },
            },
          }}
        />
      </div>
    </div>
  );
}

export default CEODashboard;
