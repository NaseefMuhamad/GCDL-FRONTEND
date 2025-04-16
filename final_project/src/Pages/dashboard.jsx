import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApi } from '../hooks/useApi';
import { Bar, Pie, Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement } from 'chart.js';
import io from 'socket.io-client';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement);

function Dashboard() {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);

  // Restrict to CEO
  if (user?.role !== 'ceo') {
    return <div className="text-red-500 text-center mt-10">Access restricted to CEO</div>;
  }

  // API hooks for chart data
  const { data: salesData, loading: salesLoading, error: salesError, execute: fetchSales } = useApi('dashboard/sales-by-produce');
  const { data: stockData, loading: stockLoading, error: stockError, execute: fetchStocks } = useApi('dashboard/stock-levels');
  const { data: procurementData, loading: procurementLoading, error: procurementError, execute: fetchProcurements } = useApi('dashboard/procurements-by-month');
  const { data: creditSalesData, loading: creditSalesLoading, error: creditSalesError, execute: fetchCreditSales } = useApi('dashboard/credit-sales-by-status');

  // Initialize WebSocket
  useEffect(() => {
    const socketInstance = io('http://localhost:5000', {
        transports: ['websocket'], // Ensure WebSocket transport
        cors: {
          origin: 'http://localhost:5173',
          credentials: true,
        },
      });

    socketInstance.on('data-updated', ({ type }) => {
      if (type === 'sales') fetchSales();
      if (type === 'stock') fetchStocks();
      if (type === 'procurements') fetchProcurements();
      if (type === 'credit_sales') fetchCreditSales();
    });

    return () => socketInstance.disconnect();
  }, [fetchSales, fetchStocks, fetchProcurements, fetchCreditSales]);

  // Polling fallback (every 30 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchSales();
      fetchStocks();
      fetchProcurements();
      fetchCreditSales();
    }, 30000);
    return () => clearInterval(interval);
  }, [fetchSales, fetchStocks, fetchProcurements, fetchCreditSales]);

  // Chart data configurations
  const salesChartData = {
    labels: salesData?.data?.map(item => item.produceName) || [],
    datasets: [
      {
        label: 'Total Sales (USD)',
        data: salesData?.data?.map(item => item.totalAmount) || [],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const stockChartData = {
    labels: stockData?.data?.map(item => item.produceName) || [],
    datasets: [
      {
        label: 'Stock Levels (Tons)',
        data: stockData?.data?.map(item => item.totalQuantity) || [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const procurementChartData = {
    labels: procurementData?.data?.map(item => item.month) || [],
    datasets: [
      {
        label: 'Procurement Volume (Tons)',
        data: procurementData?.data?.map(item => item.totalTonnage) || [],
        fill: false,
        borderColor: 'rgba(54, 162, 235, 1)',
        tension: 0.1,
      },
    ],
  };

  const creditSalesChartData = {
    labels: creditSalesData?.data?.map(item => item.status) || [],
    datasets: [
      {
        label: 'Credit Sales Amount (USD)',
        data: creditSalesData?.data?.map(item => item.totalAmount) || [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <section className="dashboard-container p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">CEO Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sales by Produce (Bar Chart) */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Sales by Produce</h3>
          {salesLoading && <p>Loading...</p>}
          {salesError && <p className="text-red-500">{salesError}</p>}
          <Bar
            data={salesChartData}
            options={{
              responsive: true,
              plugins: { legend: { position: 'top' } },
              scales: {
                y: { beginAtZero: true, title: { display: true, text: 'Amount (USD)' } },
              },
            }}
          />
        </div>

        {/* Stock Levels (Pie Chart) */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Stock Levels by Produce</h3>
          {stockLoading && <p>Loading...</p>}
          {stockError && <p className="text-red-500">{stockError}</p>}
          <Pie
            data={stockChartData}
            options={{
              responsive: true,
              plugins: { legend: { position: 'top' } },
            }}
          />
        </div>

        {/* Procurements by Month (Line Chart) */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Procurements by Month</h3>
          {procurementLoading && <p>Loading...</p>}
          {procurementError && <p className="text-red-500">{procurementError}</p>}
          <Line
            data={procurementChartData}
            options={{
              responsive: true,
              plugins: { legend: { position: 'top' } },
              scales: {
                y: { beginAtZero: true, title: { display: true, text: 'Volume (Tons)' } },
                x: { title: { display: true, text: 'Month' } },
              },
            }}
          />
        </div>

        {/* Credit Sales by Status (Doughnut Chart) */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Credit Sales by Status</h3>
          {creditSalesLoading && <p>Loading...</p>}
          {creditSalesError && <p className="text-red-500">{creditSalesError}</p>}
          <Doughnut
            data={creditSalesChartData}
            options={{
              responsive: true,
              plugins: { legend: { position: 'top' } },
            }}
          />
        </div>
      </div>
    </section>
  );
}

export default Dashboard;