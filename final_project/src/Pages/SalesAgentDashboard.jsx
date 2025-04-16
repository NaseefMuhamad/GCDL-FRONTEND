import React, { useState, useEffect, useContext } from 'react';
import useApi from '../hooks/useApi.js';
import  {AuthContext}  from '../context/AuthContext.jsx';
import ErrorBoundary from '../components/ErrorBoundary.jsx';

function SalesAgentDashboard() {
  const { user } = useContext(AuthContext);
  const { fetchData, loading, error } = useApi();
  const [sales, setSales] = useState([]);

  useEffect(function() {
    async function loadSales() {
      try {
        const data = await fetchData('/sales');
        setSales(data);
      } catch (err) {
        console.error(err);
      }
    }
    loadSales();
  }, [fetchData]);

  return (
    <ErrorBoundary>
      <div style={{ padding: '20px' }}>
        <h2>Sales Agent Dashboard - {user?.branch}</h2>
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <h3>Your Sales</h3>
        <table border="1">
          <thead>
            <tr>
              <th>Produce</th>
              <th>Tonnage</th>
              <th>Amount Paid</th>
              <th>Buyer</th>
            </tr>
          </thead>
          <tbody>
            {sales.map(function(sale) {
              return (
                <tr key={sale.id}>
                  <td>{sale.produce_name}</td>
                  <td>{sale.tonnage}</td>
                  <td>{sale.amount_paid}</td>
                  <td>{sale.buyer_name}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </ErrorBoundary>
  );
}

export default SalesAgentDashboard;