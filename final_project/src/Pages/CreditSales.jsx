import React, { useState, useContext } from 'react';
import axios from 'axios';
import  AuthContext  from '../context/AuthContext.jsx';
import FormError from '../components/FormError.jsx';
import useApi from '../hooks/useApi.js';

function CreditSales() {
  const { user } = useContext(AuthContext);
  const { data: creditSales, loading, error, fetchData } = useApi(
    'http://localhost:5000/api/creditsales',
    user?.role !== 'ceo' ? { branch: user?.branch } : {}
  );
  const [formData, setFormData] = useState({
    produce_name: '',
    tonnage: '',
    amount_owed: '',
    buyer_name: '',
    sales_agent: user?.username || '',
    buyer_contact: '',
    branch: user?.branch || 'Maganjo',
  });
  const [formErrors, setFormErrors] = useState([]);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errors = [];
    if (!formData.produce_name) errors.push('Produce name is required');
    if (!formData.tonnage || formData.tonnage <= 0) errors.push('Tonnage must be a positive number');
    if (!formData.amount_owed || formData.amount_owed <= 0) errors.push('Amount owed must be a positive number');
    if (!formData.buyer_name) errors.push('Buyer name is required');
    if (!formData.buyer_contact || !/^\+256\d{9}$/.test(formData.buyer_contact)) {
      errors.push('Buyer contact must be a valid Ugandan phone number (e.g., +256123456789)');
    }
    if (errors.length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/creditsales', {
        ...formData,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString(),
      });
      setFormData({
        produce_name: '',
        tonnage: '',
        amount_owed: '',
        buyer_name: '',
        sales_agent: user?.username || '',
        buyer_contact: '',
        branch: user?.branch || 'Maganjo',
      });
      setFormErrors([]);
      fetchData();
    } catch (err) {
      setFormErrors([err.response?.data?.message || 'Credit sales submission failed']);
    }
  }

  return (
    <div>
      <div className="form-container">
        <h2>Credit Sales</h2>
        <FormError errors={formErrors} />
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Produce Name:</label>
            <select name="produce_name" value={formData.produce_name} onChange={handleChange}>
              <option value="">Select Produce</option>
              <option value="beans">Beans</option>
              <option value="grain_maize">Grain Maize</option>
              <option value="cowpeas">Cowpeas</option>
              <option value="groundnuts">Groundnuts</option>
              <option value="rice">Rice</option>
              <option value="soybeans">Soybeans</option>
            </select>
          </div>
          <div className="form-group">
            <label>Tonnage (in tons):</label>
            <input type="number" name="tonnage" value={formData.tonnage} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Amount Owed (UGX):</label>
            <input type="number" name="amount_owed" value={formData.amount_owed} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Buyer Name:</label>
            <input type="text" name="buyer_name" value={formData.buyer_name} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Sales Agent:</label>
            <input type="text" name="sales_agent" value={formData.sales_agent} disabled />
          </div>
          <div className="form-group">
            <label>Buyer Contact:</label>
            <input type="text" name="buyer_contact" value={formData.buyer_contact} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Branch:</label>
            <select name="branch" value={formData.branch} onChange={handleChange} disabled={user?.role !== 'ceo'}>
              <option value="Maganjo">Maganjo</option>
              <option value="Matugga">Matugga</option>
            </select>
          </div>
          <button type="submit" className="form-button">
            Submit Credit Sale
          </button>
        </form>
      </div>

      <div className="card">
        <h3>Credit Sales Records</h3>
        {loading && <p className="card-subtext">Loading...</p>}
        {error && <p className="card-subtext">{error}</p>}
        {creditSales && creditSales.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>Produce Name</th>
                <th>Tonnage</th>
                <th>Amount Owed (UGX)</th>
                <th>Buyer Name</th>
                <th>Sales Agent</th>
                <th>Buyer Contact</th>
                <th>Branch</th>
                <th>Date</th>
                <th>Time</th>
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
                    <td>{sale.sales_agent}</td>
                    <td>{sale.buyer_contact}</td>
                    <td>{sale.branch}</td>
                    <td>{sale.date}</td>
                    <td>{sale.time}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p className="card-subtext">No credit sales records available.</p>
        )}
      </div>
    </div>
  );
}

export default CreditSales;