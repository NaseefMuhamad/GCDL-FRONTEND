import React, { useState, useEffect } from 'react';
import useApi from '../hooks/useApi';
import ErrorBoundary from '../components/ErrorBoundary';

function CreditSales() {
  const { fetchData, loading, error } = useApi();
  const [creditSales, setCreditSales] = useState([]);

  useEffect(() => {
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
              <th>Buyer</th>
              <th>National ID</th>
              <th>Amount Due</th>
              <th>Due Date</th>
              <th>Branch</th>
            </tr>
          </thead>
          <tbody>
            {creditSales.map((sale) => (
              <tr key={sale.id}>
                <td>{sale.buyer_name}</td>
                <td>{sale.buyer_national_id}</td>
                <td>{sale.amount_due}</td>
                <td>{sale.due_date}</td>
                <td>{sale.branch}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ErrorBoundary>
  );
}

export default CreditSales;