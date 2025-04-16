

// import { useAuth } from '../context/AuthContext';
// import { useForm } from 'react-hook-form';
// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import FormError from '../components/FormError';

// function Sales() {
//   const { user } = useAuth();
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//   } = useForm();
  
//   const [salesData, setSalesData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // Create axios instance with auth header
//   const api = axios.create({
//     baseURL: 'http://localhost:5000/api',
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${localStorage.getItem('token')}`,
//     },
//   });

//   // Fetch sales data on component mount
//   useEffect(() => {
//     const fetchSales = async () => {
//       setLoading(true);
//       try {
//         const response = await api.get('/sales');
//         setSalesData(response.data.data);
//         setError(null);
//       } catch (err) {
//         setError(err.response?.data?.error || 'Failed to fetch sales');
//         console.error('Fetch error:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSales();
//   }, []);

//   const onSubmit = async (formData) => {
//     try {
//       setLoading(true);
//       console.log('Form data:', formData);

//       // Prepare payload matching backend expectations
//       const payload = {
//         produceId: parseInt(formData.produceId),
//         tonnage: parseFloat(formData.tonnage),
//         amountPaid: parseFloat(formData.amountPaid),
//         buyerName: formData.buyerName.trim(),
//         salesAgentId: parseInt(formData.salesAgentId), // Use the logged-in user's ID
//         date: formData.date,
//         time: formData.time,
//         buyerContact: formData.buyerContact.trim(),
//       };

//       const response = await api.post('/sales', payload);
//       console.log('Sale recorded:', response.data);
//       reset();
      
//       // Refresh the sales list after successful submission
//       const refreshResponse = await api.get('/sales');
//       setSalesData(refreshResponse.data.data);
//     } catch (err) {
//       setError(err.response?.data?.error || 'Failed to submit sale');
//       console.error('Submit error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <section className="sales-container">
//       <h2 className="sales-title">Sales Management</h2>
//       <form onSubmit={handleSubmit(onSubmit)} className="form">
//         <div className="form-group">
//           <label>Produce ID</label>
//           <input
//             type="number"
//             {...register('produceId', { required: 'Produce ID is required' })}
//             className="form-input"
//           />
//           {errors.produceId && <FormError message={errors.produceId.message} />}
//         </div>
//         <div className="form-group">
//           <label>Tonnage (tons)</label>
//           <input
//             type="number"
//             step="0.1"
//             min="0.1"
//             {...register('tonnage', {
//               required: 'Tonnage is required',
//               min: { value: 0.1, message: 'Minimum 0.1 ton' },
//               valueAsNumber: true,
//             })}
//             className="form-input"
//           />
//           {errors.tonnage && <FormError message={errors.tonnage.message} />}
//         </div>
//         <div className="form-group">
//           <label>Amount Paid (USD)</label>
//           <input
//             type="number"
//             step="0.01"
//             {...register('amountPaid', {
//               required: 'Amount paid is required',
//               min: { value: 0, message: 'Amount cannot be negative' },
//               valueAsNumber: true,
//             })}
//             className="form-input"
//           />
//           {errors.amountPaid && <FormError message={errors.amountPaid.message} />}
//         </div>
//         <div className="form-group">
//           <label>Buyer's Name</label>
//           <input
//             type="text"
//             {...register('buyerName', { required: 'Buyers name is required' })}
//             className="form-input"
//           />
//           {errors.buyerName && <FormError message={errors.buyerName.message} />}
//         </div>
//         <div className="form-group">
//           <label>Buyer's Contact</label>
//           <input
//             type="tel"
//             {...register('buyerContact', {
//               required: 'Contact is required',
//               pattern: {
//                 value: /^\+?\d{10,12}$/,
//                 message: 'Invalid phone number (e.g., +1234567890 or 0734128903)',
//               },
//             })}
//             className="form-input"
//             placeholder="0734128903"
//           />
//           {errors.buyerContact && <FormError message={errors.buyerContact.message} />}
//         </div>
//         <div className="form-group">
//           <label>Sales Agent ID</label>
//           <input
//             type="number"
//             {...register('salesAgentId', { required: 'Sales Agent ID is required' })}
//             className="form-input"
//           />
//           {errors.produceId && <FormError message={errors.produceId.message} />}
//         </div>
//         <div className="form-group">
//           <label>Date</label>
//           <input
//             type="date"
//             {...register('date', { required: 'Date is required' })}
//             className="form-input"
//           />
//           {errors.date && <FormError message={errors.date.message} />}
//         </div>
//         <div className="form-group">
//           <label>Time</label>
//           <input
//             type="time"
//             {...register('time', { required: 'Time is required' })}
//             className="form-input"
//           />
//           {errors.time && <FormError message={errors.time.message} />}
//         </div>
//         <button type="submit" className="form-button" disabled={loading}>
//           {loading ? 'Submitting...' : 'Submit'}
//         </button>
//       </form>

//       <div className="table-container">
//         <h3>Sales Records</h3>
//         {loading && <p>Loading...</p>}
//         {error && <p className="form-error">{error}</p>}
//         {salesData.length > 0 ? (
//           <table className="table">
//             <thead>
//               <tr>
//                 <th>Produce</th>
//                 <th>Tonnage</th>
//                 <th>Amount Paid</th>
//                 <th>Buyer</th>
//                 <th>Agent</th>
//                 <th>Contact</th>
//                 <th>Date</th>
//               </tr>
//             </thead>
//             <tbody>
//               {salesData.map((item) => (
//                 <tr key={item.saleId}>
//                   <td>{item.produceName}</td>
//                   <td>{item.tonnage}</td>
//                   <td>${item.amountPaid}</td>
//                   <td>{item.buyerName}</td>
//                   <td>{item.salesAgentName}</td>
//                   <td>{item.buyerContact}</td>
//                   <td>{item.date}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         ) : (
//           <p>No records found.</p>
//         )}
//       </div>
//     </section>
//   );
// }

// export default Sales; 

import { useAuth } from '../context/AuthContext';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import axios from 'axios';
import FormError from '../components/FormError';

function Sales() {
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showMySalesOnly, setShowMySalesOnly] = useState(false); // New state for filtering

  // Create axios instance with auth header
  const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  // Fetch sales data on component mount
  useEffect(() => {
    const fetchSales = async () => {
      setLoading(true);
      try {
        const response = await api.get('/sales');
        setSalesData(response.data.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch sales');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, []);

  const onSubmit = async (formData) => {
    try {
      setLoading(true);
      console.log('Form data:', formData);

      // Prepare payload matching backend expectations
      const payload = {
        produceId: parseInt(formData.produceId),
        tonnage: parseFloat(formData.tonnage),
        amountPaid: parseFloat(formData.amountPaid),
        buyerName: formData.buyerName.trim(),
        salesAgentId: parseInt(formData.salesAgentId),
        date: formData.date,
        time: formData.time,
        buyerContact: formData.buyerContact.trim(),
      };

      const response = await api.post('/sales', payload);
      console.log('Sale recorded:', response.data);
      reset();
      
      // Refresh the sales list after successful submission
      const refreshResponse = await api.get('/sales');
      setSalesData(refreshResponse.data.data);
      setShowMySalesOnly(false); // Reset filter after new submission
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit sale');
      console.error('Submit error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter sales based on the current user if showMySalesOnly is true
  const filteredSales = showMySalesOnly
    ? salesData.filter(sale => sale.salesAgentId === user?.user_id)
    : salesData;

  return (
    <section className="sales-container">
      <h2 className="sales-title">Sales Management</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <div className="form-group">
          <label>Produce ID</label>
          <input
            type="number"
            {...register('produceId', { required: 'Produce ID is required' })}
            className="form-input"
          />
          {errors.produceId && <FormError message={errors.produceId.message} />}
        </div>
        <div className="form-group">
          <label>Tonnage (tons)</label>
          <input
            type="number"
            step="0.1"
            min="0.1"
            {...register('tonnage', {
              required: 'Tonnage is required',
              min: { value: 0.1, message: 'Minimum 0.1 ton' },
              valueAsNumber: true,
            })}
            className="form-input"
          />
          {errors.tonnage && <FormError message={errors.tonnage.message} />}
        </div>
        <div className="form-group">
          <label>Amount Paid (USD)</label>
          <input
            type="number"
            step="0.01"
            {...register('amountPaid', {
              required: 'Amount paid is required',
              min: { value: 0, message: 'Amount cannot be negative' },
              valueAsNumber: true,
            })}
            className="form-input"
          />
          {errors.amountPaid && <FormError message={errors.amountPaid.message} />}
        </div>
        <div className="form-group">
          <label>Buyer's Name</label>
          <input
            type="text"
            {...register('buyerName', { required: 'Buyers name is required' })}
            className="form-input"
          />
          {errors.buyerName && <FormError message={errors.buyerName.message} />}
        </div>
        <div className="form-group">
          <label>Buyer's Contact</label>
          <input
            type="tel"
            {...register('buyerContact', {
              required: 'Contact is required',
              pattern: {
                value: /^\+?\d{10,12}$/,
                message: 'Invalid phone number (e.g., +1234567890 or 0734128903)',
              },
            })}
            className="form-input"
            placeholder="0734128903"
          />
          {errors.buyerContact && <FormError message={errors.buyerContact.message} />}
        </div>
        <div className="form-group">
          <label>Sales Agent ID</label>
          <input
            type="number"
            {...register('salesAgentId', { required: 'Sales Agent ID is required' })}
            className="form-input"
          />
          {errors.salesAgentId && <FormError message={errors.salesAgentId.message} />}
        </div>
        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            {...register('date', { required: 'Date is required' })}
            className="form-input"
          />
          {errors.date && <FormError message={errors.date.message} />}
        </div>
        <div className="form-group">
          <label>Time</label>
          <input
            type="time"
            {...register('time', { required: 'Time is required' })}
            className="form-input"
          />
          {errors.time && <FormError message={errors.time.message} />}
        </div>
        <button type="submit" className="form-button" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>

      <div className="table-container">
        <div className="table-header">
          <h3>Sales Records</h3>
          <button 
            onClick={() => setShowMySalesOnly(!showMySalesOnly)}
            className={`filter-button ${showMySalesOnly ? 'active' : ''}`}
            disabled={loading}
          >
            {showMySalesOnly ? 'Show All Sales' : 'Show My Sales Only'}
          </button>
        </div>
        {loading && <p>Loading...</p>}
        {error && <p className="form-error">{error}</p>}
        {filteredSales.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>Produce</th>
                <th>Tonnage</th>
                <th>Amount Paid</th>
                <th>Buyer</th>
                <th>Agent</th>
                <th>Contact</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.map((item) => (
                <tr key={item.saleId}>
                  <td>{item.produceName}</td>
                  <td>{item.tonnage}</td>
                  <td>${item.amountPaid}</td>
                  <td>{item.buyerName}</td>
                  <td>{item.salesAgentName}</td>
                  <td>{item.buyerContact}</td>
                  <td>{item.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No records found.</p>
        )}
      </div>
    </section>
  );
}

export default Sales;