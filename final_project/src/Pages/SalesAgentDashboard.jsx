import React, { useState, useEffect, useContext } from 'react';
import useApi from '../hooks/useApi';
import { AuthContext } from '../context/AuthContext';
import ErrorBoundary from '../components/ErrorBoundary';
import { Link } from 'react-router-dom';

function SalesAgentDashboard() {
  const { user } = useContext(AuthContext);
  const { fetchData, loading, error } = useApi();
  const [sales, setSales] = useState([]);

  useEffect(() => {
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
        <h2 style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>Sales Agent Dashboard - {user.branch}</h2>
        <Link to="/sales" style={{ color: '#fff', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
          <img
            src="https://images.unsplash.com/photo-1600585154347-4be52e62b1e1"
            alt="Add Sale Icon"
            style={{ width: '16px', marginRight: '5px' }}
          />
          Add New Sale
        </Link>
        <h3>Your Sales</h3>
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: 'red', background: 'rgba(255,255,255,0.8)', padding: '5px' }}>{error}</p>}
        <table border="1" style={{ background: 'rgba(255,255,255,0.8)', color: '#000' }}>
          <thead>
            <tr>
              <th>Produce</th>
              <th>Tonnage</th>
              <th>Amount Paid</th>
              <th>Buyer</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => (
              <tr key={sale.id}>
                <td>{sale.produce_name}</td>
                <td>{sale.tonnage}</td>
                <td>{sale.amount_paid}</td>
                <td>{sale.buyer_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ErrorBoundary>
  );
}

export default SalesAgentDashboard;