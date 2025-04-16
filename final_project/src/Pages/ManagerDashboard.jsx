import React, { useState, useEffect, useContext } from 'react';
import useApi from '../hooks/useApi.js';
import  {AuthContext}  from '../context/AuthContext.jsx';
import Charts from '../components/Chart.jsx';
import ErrorBoundary from '../components/ErrorBoundary.jsx';

function ManagerDashboard() {
  const { user } = useContext(AuthContext);
  const { fetchData, loading, error } = useApi();
  const [salesData, setSalesData] = useState([]);
  const [procurementData, setProcurementData] = useState([]);
  const [stockData, setStockData] = useState([]);

  useEffect(function() {
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
    labels: salesData.map(function(sale) { return sale.date; }),
    datasets: [
      {
        label: 'Sales (Tonnage)',
        data: salesData.map(function(sale) { return sale.tonnage; }),
        borderColor: 'rgba(75, 192, 192, 1)',
        fill: false,
      },
    ],
  };

  return (
    <ErrorBoundary>
      <div style={{ padding: '20px' }}>
        <h2>Manager Dashboard - {user?.branch}</h2>
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <h3>Sales Trends</h3>
        <Charts type="line" data={salesChartData} options={{ responsive: true }} />
        <h3>Procurement Summary</h3>
        <table border="1">
          <thead>
            <tr>
              <th>Produce</th>
              <th>Tonnage</th>
              <th>Cost</th>
            </tr>
          </thead>
          <tbody>
            {procurementData.map(function(item) {
              return (
                <tr key={item.id}>
                  <td>{item.produce_name}</td>
                  <td>{item.tonnage}</td>
                  <td>{item.cost}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <h3>Stock Levels</h3>
        <table border="1">
          <thead>
            <tr>
              <th>Produce</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {stockData.map(function(item) {
              return (
                <tr key={`${item.produce_id}-${item.branch}`}>
                  <td>{item.produce_name}</td>
                  <td>{item.quantity}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </ErrorBoundary>
  );
}

export default ManagerDashboard;