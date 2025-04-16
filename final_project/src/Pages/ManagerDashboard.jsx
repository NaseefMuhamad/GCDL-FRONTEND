import React, { useState, useEffect, useContext } from 'react';
import useApi from '../hooks/useApi';
import { AuthContext } from '../context/AuthContext';
import Charts from '../components/Charts';
import ErrorBoundary from '../components/ErrorBoundary';

function ManagerDashboard() {
  const { user } = useContext(AuthContext);
  const { fetchData, loading, error } = useApi();
  const [salesData, setSalesData] = useState([]);
  const [procurementData, setProcurementData] = useState([]);
  const [stockData, setStockData] = useState([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [sales, procurement, stock] = await Promise.all([
          fetchData('/sales'),
          fetchData('/procurement'),
          fetchData('/stock'),
        ]);
        setSalesData(sales);
        setProcurementData(procurement);
        setStockData(stock);
      } catch (err) {
        console.error(err);
      }
    }
    loadData();
  }, [fetchData]);

  const salesChartData = {
    labels: salesData.map(sale => sale.date),
    datasets: [
      {
        label: 'Sales (Tonnage)',
        data: salesData.map(sale => sale.tonnage),
        borderColor: 'rgba(75, 192, 192, 1)',
        fill: false,
      },
    ],
  };

  return (
    <ErrorBoundary>
      <div
        style={{
          padding: '20px',
          backgroundImage: 'url(https://images.unsplash.com/photo-1600585154347-4be52e62b1e1)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '100vh',
          color: '#fff',
        }}
      >
        <h2 style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>Manager Dashboard - {user.branch}</h2>
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: 'red', background: 'rgba(255,255,255,0.8)', padding: '5px' }}>{error}</p>}
        <h3>Sales Trends</h3>
        <Charts type="line" data={salesChartData} options={{ responsive: true }} />
        <h3>Procurement Summary</h3>
        <table border="1" style={{ background: 'rgba(255,255,255,0.8)', color: '#000' }}>
          <thead>
            <tr>
              <th>Produce</th>
              <th>Tonnage</th>
              <th>Cost</th>
            </tr>
          </thead>
          <tbody>
            {procurementData.map((item) => (
              <tr key={item.id}>
                <td>{item.produce_name}</td>
                <td>{item.tonnage}</td>
                <td>{item.cost}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <h3>Stock Levels</h3>
        <table border="1" style={{ background: 'rgba(255,255,255,0.8)', color: '#000' }}>
          <thead>
            <tr>
              <th>Produce</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {stockData.map((item) => (
              <tr key={`${item.produce_id}`}>
                <td>{item.produce_name}</td>
                <td>{item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ErrorBoundary>
  );
}

export default ManagerDashboard;