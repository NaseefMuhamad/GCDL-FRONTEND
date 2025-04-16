import React, { useState, useEffect } from "react";
import useApi from "../hooks/useApi.js";
import Charts from "../components/Chart.jsx";
import ErrorBoundary from "../components/ErrorBoundary.jsx";

function CEODashboard() {
  const { fetchData, loading, error } = useApi();
  const [branchFilter, setBranchFilter] = useState('all');
  const [salesData, setSalesData] = useState([]);
  const [procurementData, setProcurementData] = useState([]);
  const [stockData, setStockData] = useState([]);

  useEffect(function() {
    async function loadData() {
      try {
        const params = branchFilter !== 'all' ? { branch: branchFilter } : {};
        const [sales, procurement, stock] = await Promise.all([
          fetchData('/sales', 'GET', null, params),
          fetchData('/procurement', 'GET', null, params),
          fetchData('/stock', 'GET', null, params),
        ]);
        setSalesData(sales);
        setProcurementData(procurement);
        setStockData(stock);
      } catch (err) {
        console.error(err);
      }
    }
    loadData();
  }, [branchFilter, fetchData]);

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
        <h2 style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>CEO Dashboard</h2>
        <div>
          <label style={{ marginRight: '10px' }}>Filter by Branch: </label>
          <select value={branchFilter} onChange={function(e) { setBranchFilter(e.target.value); }}>
            <option value="all">All Branches</option>
            <option value="Maganjo">Maganjo</option>
            <option value="Matugga">Matugga</option>
          </select>
        </div>
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
              <th>Branch</th>
            </tr>
          </thead>
          <tbody>
            {procurementData.map(function(item) {
              return (
                <tr key={item.id}>
                  <td>{item.produce_name}</td>
                  <td>{item.tonnage}</td>
                  <td>{item.cost}</td>
                  <td>{item.branch}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <h3>Stock Levels</h3>
        <table border="1" style={{ background: 'rgba(255,255,255,0.8)', color: '#000' }}>
          <thead>
            <tr>
              <th>Produce</th>
              <th>Branch</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {stockData.map(function(item) {
              return (
                <tr key={`${item.produce_id}-${item.branch}`}>
                  <td>{item.produce_name}</td>
                  <td>{item.branch}</td>
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

export default CEODashboard;