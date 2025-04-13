
// import { useForm } from 'react-hook-form';
// import { useApi } from '../hooks/useApi';
// import FormError from '../components/FormError';

// function Sales() {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//   } = useForm();
//   const { data, loading, error, execute } = useApi('sales');

//   const onSubmit = async (data) => {
//     try {
//       // Add current date and time if not provided
//       const payload = {
//         ...data,
//         date: data.date || new Date().toISOString().split('T')[0], // e.g., "2025-04-12"
//         time: data.time || new Date().toTimeString().split(' ')[0].slice(0, 5), // e.g., "14:30"
//       };
//       await execute(payload, 'POST');
//       reset();
//     } catch (err) {
//       // Error is handled by useApi
//     }
//   };

//   return (
//     <section className="sales-container">
//       <h2 className="sales-title">Sales Management</h2>
//       <form onSubmit={handleSubmit(onSubmit)} className="form">
//         <div className="form-group">
//           <label>Produce Name</label>
//           <select
//             {...register('produceName', { required: 'Produce name is required' })}
//             className="form-input"
//           >
//             <option value="">Select Produce</option>
//             <option value="beans">Beans</option>
//             <option value="grain_maize">Grain Maize</option>
//             <option value="cowpeas">Cowpeas</option>
//             <option value="groundnuts">Groundnuts</option>
//             <option value="rice">Rice</option>
//             <option value="soybeans">Soybeans</option>
//           </select>
//           {errors.produceName && <FormError message={errors.produceName.message} />}
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
//             })}
//             className="form-input"
//           />
//           {errors.amountPaid && <FormError message={errors.amountPaid.message} />}
//         </div>
//         <div className="form-group">
//           <label>Buyer’s Name</label>
//           <input
//             type="text"
//             {...register('buyerName', { required: 'Buyer’s name is required' })}
//             className="form-input"
//           />
//           {errors.buyerName && <FormError message={errors.buyerName.message} />}
//         </div>
//         <div className="form-group">
//           <label>Sales Agent’s Name</label>
//           <input
//             type="text"
//             {...register('salesAgentName', {
//               required: 'Sales agent’s name is required',
//             })}
//             className="form-input"
//           />
//           {errors.salesAgentName && <FormError message={errors.salesAgentName.message} />}
//         </div>
//         <div className="form-group">
//           <label>Buyer’s Contact</label>
//           <input
//             type="tel"
//             {...register('buyerContact', {
//               required: 'Contact is required',
//               pattern: {
//                 value: /^\+?\d{10,12}$/,
//                 message: 'Invalid phone number',
//               },
//             })}
//             className="form-input"
//             placeholder="+1234567890"
//           />
//           {errors.buyerContact && <FormError message={errors.buyerContact.message} />}
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
//         {data && data.length > 0 ? (
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
//               {data.map((item) => (
//                 <tr key={item.id}>
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

import { useForm } from 'react-hook-form';
import { useApi } from '../hooks/useApi';
import FormError from '../components/FormError';

function Sales() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const { data, loading, error, execute } = useApi('sales');

  const onSubmit = async (data) => {
    try {
      // Log form data for debugging
      console.log('Form data:', data);

      // Sanitize payload
      const payload = {
        produceName: String(data.produceName),
        tonnage: parseFloat(data.tonnage),
        amountPaid: parseFloat(data.amountPaid),
        buyerName: String(data.buyerName),
        salesAgentName: String(data.salesAgentName),
        date: String(data.date),
        time: String(data.time),
        buyerContact: String(data.buyerContact), // Ensure string
      };

      await execute(payload, 'POST');
      reset();
    } catch (err) {
      console.error('Submit error:', err);
    }
  };

  return (
    <section className="sales-container">
      <h2 className="sales-title">Sales Management</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <div className="form-group">
          <label>Produce Name</label>
          <select
            {...register('produceName', { required: 'Produce name is required' })}
            className="form-input"
          >
            <option value="">Select Produce</option>
            <option value="beans">Beans</option>
            <option value="grain_maize">Grain Maize</option>
            <option value="cowpeas">Cowpeas</option>
            <option value="groundnuts">Groundnuts</option>
            <option value="rice">Rice</option>
            <option value="soybeans">Soybeans</option>
          </select>
          {errors.produceName && <FormError message={errors.produceName.message} />}
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
          <label>Buyer’s Name</label>
          <input
            type="text"
            {...register('buyerName', { required: 'Buyer’s name is required' })}
            className="form-input"
          />
          {errors.buyerName && <FormError message={errors.buyerName.message} />}
        </div>
        <div className="form-group">
          <label>Sales Agent’s Name</label>
          <input
            type="text"
            {...register('salesAgentName', {
              required: 'Sales agent’s name is required',
            })}
            className="form-input"
          />
          {errors.salesAgentName && <FormError message={errors.salesAgentName.message} />}
        </div>
        <div className="form-group">
          <label>Buyer’s Contact</label>
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
        <h3>Sales Records</h3>
        {loading && <p>Loading...</p>}
        {error && <p className="form-error">{error}</p>}
        {data && data.length > 0 ? (
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
              {data.map((item) => (
                <tr key={item.id}>
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