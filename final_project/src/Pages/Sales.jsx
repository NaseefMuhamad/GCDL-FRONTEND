import { useForm } from "react-hook-form";
import {useApi} from "../hooks/useApi";
import FormError from "../components/FormError";

function Sales() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const { data, loading, error, execute } = useApi("sales");

  const onSubmit = async (data) => {
    await execute(data, "POST");
    reset();
  };

  return (
    <section className="sales-container">
      <h2 className="sales-title">Sales Management</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <div className="form-group">
          <label>Produce Name</label>
          <select
            {...register("produceName", { required: "Produce name is required" })}
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
          {errors.produceName && (
            <FormError message={errors.produceName.message} />
          )}
        </div>
        <div className="form-group">
          <label>Tonnage (tons)</label>
          <input
            type="number"
            step="0.1"
            min="0.1"
            {...register("tonnage", {
              required: "Tonnage is required",
              min: { value: 0.1, message: "Minimum 0.1 ton" },
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
            {...register("amountPaid", {
              required: "Amount paid is required",
              min: 0,
            })}
            className="form-input"
          />
          {errors.amountPaid && (
            <FormError message={errors.amountPaid.message} />
          )}
        </div>
        <div className="form-group">
          <label>Buyer’s Name</label>
          <input
            type="text"
            {...register("buyerName", { required: "Buyer’s name is required" })}
            className="form-input"
          />
          {errors.buyerName && <FormError message={errors.buyerName.message} />}
        </div>
        <div className="form-group">
          <label>Sales Agent’s Name</label>
          <input
            type="text"
            {...register("salesAgent", {
              required: "Sales agent’s name is required",
            })}
            className="form-input"
          />
          {errors.salesAgent && (
            <FormError message={errors.salesAgent.message} />
          )}
        </div>
        <div className="form-group">
          <label>Buyer’s Contact</label>
          <input
            type="tel"
            {...register("buyerContact", {
              required: "Contact is required",
              pattern: {
                value: /^\+?\d{10,12}$/,
                message: "Invalid phone number",
              },
            })}
            className="form-input"
            placeholder="+1234567890"
          />
          {errors.buyerContact && (
            <FormError message={errors.buyerContact.message} />
          )}
        </div>
        <button type="submit" className="form-button" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
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
                  <td>{item.salesAgent}</td>
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