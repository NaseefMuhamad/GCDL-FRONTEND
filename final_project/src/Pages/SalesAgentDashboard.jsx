import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import useApi from '../hooks/useApi.js';
import ErrorBoundary from '../components/ErrorBoundary.jsx';

function SalesAgentDashboard() {
  const { user } = useContext(AuthContext);

  const { data: salesData, loading: salesLoading, error: salesError } = useApi(
    'http://localhost:5000/api/sales',
    { sales_agent: user?.username }
  );

  return (
    <ErrorBoundary>
      <div className="dashboard-grid">
        <div className="card">
          <h3>Sales Agent Overview</h3>
          <p className="card-subtext">Agent: {user?.username}</p>
          <p className="card-subtext">Branch: {user?.branch}</p>
        </div>

        <div className="card">
          <h3>My Sales Records</h3>
          {salesLoading && <p className="card-subtext">Loading sales data...</p>}
          {salesError && <p className="card-subtext">{salesError}</p>}
          {salesData && salesData.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Produce Name</th>
                  <th>Tonnage</th>
                  <th>Amount Paid (UGX)</th>
                  <th>Buyer Name</th>
                  <th>Buyer Contact</th>
                  <th>Date</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {salesData.map(function(sale) {
                  return (
                    <tr key={sale.id}>
                      <td>{sale.produce_name}</td>
                      <td>{sale.tonnage}</td>
                      <td>{sale.amount_paid}</td>
                      <td>{sale.buyer_name}</td>
                      <td>{sale.buyer_contact}</td>
                      <td>{sale.date}</td>
                      <td>{sale.time}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <p className="card-subtext">No sales records available.</p>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default SalesAgentDashboard;