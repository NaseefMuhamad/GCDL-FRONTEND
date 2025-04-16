import React, { useState, useEffect, useContext } from 'react';
import useApi from '../hooks/useApi';
import { AuthContext } from '../context/AuthContext';
import FormErrors from '../components/FormErrors';
import ErrorBoundary from '../components/ErrorBoundary';
import jsPDF from 'jspdf';

function Sales() {
  const { user } = useContext(AuthContext);
  const { fetchData, loading, error } = useApi();
  const [sales, setSales] = useState([]);
  const [formData, setFormData] = useState({
    produce_name: '',
    tonnage: '',
    amount_paid: '',
    buyer_name: '',
    date: '',
    time: '',
    buyer_contact: '',
  });
  const [formErrors, setFormErrors] = useState([]);

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

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function validateForm() {
    const errors = [];
    if (!formData.produce_name) errors.push('Produce name is required');
    if (!formData.tonnage || isNaN(formData.tonnage) || formData.tonnage <= 0) errors.push('Tonnage must be a positive number');
    if (!formData.amount_paid || isNaN(formData.amount_paid) || formData.amount_paid <= 0) errors.push('Amount paid must be a positive number');
    if (!formData.buyer_contact.match(/^\+256\d{9}$/)) errors.push('Buyer contact must be a valid Ugandan phone number (e.g., +256123456789)');
    return errors;
  }

  function generateReceipt(sale) {
    const doc = new jsPDF();
    doc.text('Golden Crop Distributors Ltd.', 10, 10);
    doc.text(`Receipt for Sale #${sale.id}`, 10, 20);
    doc.text(`Produce: ${sale.produce_name}`, 10, 30);
    doc.text(`Tonnage: ${sale.tonnage}`, 10, 40);
    doc.text(`Amount Paid: ${sale.amount_paid}`, 10, 50);
    doc.text(`Buyer: ${sale.buyer_name}`, 10, 60);
    doc.text(`Date: ${sale.date}`, 10, 70);
    doc.text(`Branch: ${sale.branch}`, 10, 80);
    doc.save(`receipt_${sale.id}.pdf`);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errors = validateForm();
    if (errors.length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const newSale = await fetchData('/sales', 'POST', {
        ...formData,
        sales_agent: user.username,
        branch: user.branch,
      });
      setSales([...sales, newSale]);
      setFormData({
        produce_name: '',
        tonnage: '',
        amount_paid: '',
        buyer_name: '',
        date: '',
        time: '',
        buyer_contact: '',
      });
      setFormErrors([]);
      generateReceipt(newSale);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <ErrorBoundary>
      <div style={{ padding: '20px' }}>
        <h2>Sales</h2>
        <h3>Add New Sale</h3>
        <FormErrors errors={formErrors} />
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
            <label>Amount Paid:</label>
            <input type="number" name="amount_paid" value={formData.amount_paid} onChange={handleChange} style={{ width: '100%', padding: '5px' }} />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Buyer Name:</label>
            <input type="text" name="buyer_name" value={formData.buyer_name} onChange={handleChange} style={{ width: '100%', padding: '5px' }} />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Date:</label>
            <input type="date" name="date" value={formData.date} onChange={handleChange} style={{ width: '100%', padding: '5px' }} />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Time:</label>
            <input type="time" name="time" value={formData.time} onChange={handleChange} style={{ width: '100%', padding: '5px' }} />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Buyer Contact:</label>
            <input type="text" name="buyer_contact" value={formData.buyer_contact} onChange={handleChange} style={{ width: '100%', padding: '5px' }} />
          </div>
          <button type="submit" style={{ padding: '10px', width: '100%' }}>
            <img
              src="https://images.unsplash.com/photo-1600585154347-4be52e62b1e1"
              alt="Add Icon"
              style={{ width: '16px', marginRight: '5px', verticalAlign: 'middle' }}
            />
            Add Sale
          </button>
        </form>
        <h3>Sales Records</h3>
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <table border="1">
          <thead>
            <tr>
              <th>Produce</th>
              <th>Tonnage</th>
              <th>Amount Paid</th>
              <th>Buyer</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => (
              <tr key={sale.id}>
                <td>{sale.produce_name}</td>
                <td>{sale.tonnage}</td>
                <td>{sale.amount_paid}</td>
                <td>{sale.buyer_name}</td>
                <td>
                  <button onClick={() => generateReceipt(sale)} style={{ display: 'flex', alignItems: 'center' }}>
                    <img
                      src="https://images.unsplash.com/photo-1600585154347-4be52e62b1e1"
                      alt="Download Icon"
                      style={{ width: '16px', marginRight: '5px' }}
                    />
                    Download Receipt
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ErrorBoundary>
  );
}

export default Sales;