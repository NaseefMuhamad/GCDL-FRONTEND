import React, { useState, useEffect } from 'react';
import useApi from '../hooks/useApi.js';
import FormError from '../components/FormError.jsx';
import ErrorBoundary from '../components/ErrorBoundary.jsx';

function Procurement() {
  const { fetchData, loading, error } = useApi();
  const [procurements, setProcurements] = useState([]);
  const [formData, setFormData] = useState({
    produce_name: '',
    tonnage: '',
    cost: '',
    supplier_contact: '',
    date: '',
    time: '',
  });
  const [formErrors, setFormErrors] = useState([]);

  useEffect(function() {
    async function loadProcurements() {
      try {
        const data = await fetchData('/procurement');
        setProcurements(data);
      } catch (err) {
        console.error(err);
      }
    }
    loadProcurements();
  }, [fetchData]);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function validateForm() {
    const errors = [];
    if (!formData.produce_name) errors.push('Produce name is required');
    if (!formData.tonnage || isNaN(formData.tonnage) || formData.tonnage <= 0) errors.push('Tonnage must be a positive number');
    if (!formData.cost || isNaN(formData.cost) || formData.cost <= 0) errors.push('Cost must be a positive number');
    if (!formData.supplier_contact.match(/^\+256\d{9}$/)) errors.push('Supplier contact must be a valid Ugandan phone number (e.g., +256123456789)');
    return errors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errors = validateForm();
    if (errors.length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const newProcurement = await fetchData('/procurement', 'POST', formData);
      setProcurements([...procurements, newProcurement]);
      setFormData({
        produce_name: '',
        tonnage: '',
        cost: '',
        supplier_contact: '',
        date: '',
        time: '',
      });
      setFormErrors([]);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <ErrorBoundary>
      <div style={{ padding: '20px' }}>
        <h2>Procurement</h2>
        <h3>Add New Procurement</h3>
        <FormError errors={formErrors} />
        <form onSubmit={handleSubmit} style={{ maxWidth: '500px', marginBottom: '20px' }}>
          <div style={{ marginBottom: '10px' }}>
            <label>Produce Name:</label>
            <input type="text" name="produce_name" value={formData.produce_name} onChange={handleChange} style={{ width: '100%', padding: '5px' }} />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Tonnage:</label>
            <input type="number" name="tonnage" value={formData.tonnage} onChange={handleChange} style={{ width: '100%', padding: '5px' }} />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Cost:</label>
            <input type="number" name="cost" value={formData.cost} onChange={handleChange} style={{ width: '100%', padding: '5px' }} />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Supplier Contact:</label>
            <input type="text" name="supplier_contact" value={formData.supplier_contact} onChange={handleChange} style={{ width: '100%', padding: '5px' }} />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Date:</label>
            <input type="date" name="date" value={formData.date} onChange={handleChange} style={{ width: '100%', padding: '5px' }} />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Time:</label>
            <input type="time" name="time" value={formData.time} onChange={handleChange} style={{ width: '100%', padding: '5px' }} />
          </div>
          <button type="submit" style={{ padding: '10px', width: '100%' }}>
            <img
              src="https://images.unsplash.com/photo-1600585154347-4be52e62b1e1"
              alt="Add Icon"
              style={{ width: '16px', marginRight: '5px', verticalAlign: 'middle' }}
            />
            Add Procurement
          </button>
        </form>
        <h3>Procurement Records</h3>
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <table border="1">
          <thead>
            <tr>
              <th>Produce</th>
              <th>Tonnage</th>
              <th>Cost</th>
              <th>Supplier Contact</th>
            </tr>
          </thead>
          <tbody>
            {procurements.map(function(item) {
              return (
                <tr key={item.id}>
                  <td>{item.produce_name}</td>
                  <td>{item.tonnage}</td>
                  <td>{item.cost}</td>
                  <td>{item.supplier_contact}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </ErrorBoundary>
  );
}

export default Procurement;