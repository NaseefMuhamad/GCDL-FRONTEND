import { useEffect } from "react";
import Chart from "../components/Chart";
import { useApi } from "../hooks/useApi";
import { useAuth } from "../context/AuthContext";

function ManagerDashboard() {
  const { user } = useAuth();
  const { data: analyticsData, loading, error, fetchData } = useApi(/api/manager-analytics?branch=${user.branch});

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (user.role !== "manager") {
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

  const procurementTrend = analyticsData?.procurementTrend || {
    labels: ["Jan", "Feb", "Mar", "Apr"],
    datasets: [
      {
        label: "Procurement ($)",
        data: [2000, 3000, 2500, 4000],
        borderColor: "#059669",
        backgroundColor: "rgba(5, 150, 105, 0.2)",
        fill: true,
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
      <h2 className="dashboard-title">Manager Dashboard - {user.branch.charAt(0).toUpperCase() + user.branch.slice(1)}</h2>
      <div className="dashboard-image-container">
        <img
          src="/images/branch-office.jpg"
          alt="Branch Office"
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
      <div className="dashboard-chart-container">
        <h3>Procurement Trend</h3>
        <Chart
          type="line"
          data={procurementTrend}
          options={{
            ...chartOptions,
            plugins: { ...chartOptions.plugins, title: { display: true, text: "Procurement Over Time" } },
          }}
        />
      </div>
    </div>
  );
}

export default ManagerDashboard;