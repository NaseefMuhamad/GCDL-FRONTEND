import React, { useState, useEffect } from 'react';
import useApi from '../hooks/useApi.js';
import ErrorBoundary from '../components/ErrorBoundary.jsx';

function CreditSales() {
  const { fetchData, loading, error } = useApi();
  const [creditSales, setCreditSales] = useState([]);

  useEffect(function() {
    async function loadCreditSales() {
      try {
        const data = await fetchData('/credit-sales');
        setCreditSales(data);
      } catch (err) {
        console.error(err);
      }
    }
    loadCreditSales();
  }, [fetchData]);

  return (
    <ErrorBoundary>
      <div style={{ padding: '20px' }}>
        <h2>Credit Sales</h2>
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <table border="1">
          <thead>
            <tr>
              <th>Produce</th>
              <th>Tonnage</th>
              <th>Amount Owed</th>
              <th>Buyer</th>
              <th>Branch</th>
            </tr>
          </thead>
          <tbody>
            {creditSales.map(function(sale) {
              return (
                <tr key={sale.id}>
                  <td>{sale.produce_name}</td>
                  <td>{sale.tonnage}</td>
                  <td>{sale.amount_owed}</td>
                  <td>{sale.buyer_name}</td>
                  <td>{sale.branch}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </ErrorBoundary>
  );
}

export default CreditSales;