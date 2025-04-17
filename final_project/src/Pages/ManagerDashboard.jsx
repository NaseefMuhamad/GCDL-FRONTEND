import React, { useContext } from 'react';
import  AuthContext  from '../context/AuthContext.jsx';
import useApi from '../hooks/useApi.js';
import Chart from '../components/Chart.jsx';
import ErrorBoundary from '../components/ErrorBoundary.jsx';

function ManagerDashboard() {
  const { user } = useContext(AuthContext);

  const { data: salesData, loading: salesLoading, error: salesError } = useApi(
    'http://localhost:5000/api/sales',
    { branch: user?.branch }
  );

  const { data: procurementData, loading: procurementLoading, error: procurementError } = useApi(
    'http://localhost:5000/api/procurement',
    { branch: user?.branch }
  );

  const { data: stockData, loading: stockLoading, error: stockError } = useApi(
    'http://localhost:5000/api/stock',
    { branch: user?.branch }
  );

  const salesChartData = salesData ? salesData.map(item => item.amount_paid) : [];
  const salesChartLabels = salesData ? salesData.map(item => item.date) : [];

  return (
    <ErrorBoundary>
      <div className="dashboard-grid">
        <div className="card">
          <h3>Branch Overview</h3>
          <p className="card-subtext">Branch: {user?.branch}</p>
        </div>

        <div className="chart-container">
          <Chart title={`Sales Trends - ${user?.branch}`} labels={salesChartLabels} data={salesChartData} />
          {salesLoading && <p className="card-subtext">Loading sales data...</p>}
          {salesError && <p className="card-subtext">{salesError}</p>}
        </div>

        <div className="card">
          <h3>Procurement Summary</h3>
          {procurementLoading && <p className="card-subtext">Loading procurement data...</p>}
          {procurementError && <p className="card-subtext">{procurementError}</p>}
          {procurementData && procurementData.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Produce Name</th>
                  <th>Tonnage</th>
                  <th>Cost (UGX)</th>
                </tr>
              </thead>
              <tbody>
                {procurementData.map(function(procurement) {
                  return (
                    <tr key={procurement.id}>
                      <td>{procurement.produce_name}</td>
                      <td>{procurement.tonnage}</td>
                      <td>{procurement.cost}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <p className="card-subtext">No procurement data available.</p>
          )}
        </div>

        <div className="card">
          <h3>Stock Levels</h3>
          {stockLoading && <p className="card-subtext">Loading stock data...</p>}
          {stockError && <p className="card-subtext">{stockError}</p>}
          {stockData && stockData.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Produce Name</th>
                  <th>Quantity (tons)</th>
                </tr>
              </thead>
              <tbody>
                {stockData.map(function(stock) {
                  return (
                    <tr key={stock.id}>
                      <td>{stock.produce_name}</td>
                      <td>{stock.quantity}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <p className="card-subtext">No stock data available.</p>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default ManagerDashboard;