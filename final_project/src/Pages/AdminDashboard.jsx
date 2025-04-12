import { useEffect } from "react";
import Chart from "../components/Chart";
import { useApi } from "../hooks/useApi";
import { useAuth } from "../context/AuthContext";

function AdminDashboard() {
  const { user } = useAuth();
  const { data: analyticsData, loading, error, fetchData } = useApi("/api/admin-analytics");

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (user.role !== "admin") {
    return <div>Access Denied</div>;
  }

  const kpis = analyticsData?.kpis || {
    stockTurnover: 0,
    totalStock: 0,
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
      <h2 className="dashboard-title">Admin Dashboard</h2>
      <div className="dashboard-kpi-grid">
        <div className="dashboard-kpi-card">
          <h3>Stock Turnover</h3>
          <p>{kpis.stockTurnover.toFixed(2)}</p>
        </div>
        <div className="dashboard-kpi-card">
          <h3>Total Stock</h3>
          <p>{kpis.totalStock} tons</p>
        </div>
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

export default AdminDashboard;