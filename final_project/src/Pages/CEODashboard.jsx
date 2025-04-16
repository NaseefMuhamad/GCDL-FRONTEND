import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import useApi from '../hooks/useApi.js';
import Chart from '../components/Chart.jsx';
import ErrorBoundary from '../components/ErrorBoundary.jsx';

function CEODashboard() {
  const { user } = useContext(AuthContext);
  const [branchFilter, setBranchFilter] = useState('All Branches');

  const { data: salesData, loading: salesLoading, error: salesError } = useApi(
    'http://localhost:5000/api/sales',
    branchFilter === 'All Branches' ? {} : { branch: branchFilter }
  );

  const { data: procurementData, loading: procurementLoading, error: procurementError } = useApi(
    'http://localhost:5000/api/procurement',
    branchFilter === 'All Branches' ? {} : { branch: branchFilter }
  );

  const { data: stockData, loading: stockLoading, error: stockError } = useApi(
    'http://localhost:5000/api/stock',
    branchFilter === 'All Branches' ? {} : { branch: branchFilter }
  );

  const salesChartData = salesData ? salesData.map(item => item.amount_paid) : [];
  const salesChartLabels = salesData ? salesData.map(item => item.date) : [];

  function handleBranchFilter(e) {
    setBranchFilter(e.target.value);
  }

  return (
    <ErrorBoundary>
      <div className="dashboard-grid">
        <div className="card">
          <h3>Branch Filter</h3>
          <div className="form-group">
            <select value={branchFilter} onChange={handleBranchFilter}>
              <option value="All Branches">All Branches</option>
              <option value="Maganjo">Maganjo</option>
              <option value="Matugga">Matugga</option>
            </select>
          </div>
        </div>

        <div className="chart-container">
          <Chart title="Sales Trends" labels={salesChartLabels} data={salesChartData} />
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
                  <th>Branch</th>
                </tr>
              </thead>
              <tbody>
                {procurementData.map(function(procurement) {
                  return (
                    <tr key={procurement.id}>
                      <td>{procurement.produce_name}</td>
                      <td>{procurement.tonnage}</td>
                      <td>{procurement.cost}</td>
                      <td>{procurement.branch}</td>
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
                  <th>Branch</th>
                </tr>
              </thead>
              <tbody>
                {stockData.map(function(stock) {
                  return (
                    <tr key={stock.id}>
                      <td>{stock.produce_name}</td>
                      <td>{stock.quantity}</td>
                      <td>{stock.branch}</td>
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

export default CEODashboard;