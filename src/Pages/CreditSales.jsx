import { useForm } from "react-hook-form";
import {useApi} from "../hooks/useApi";
import FormError from "../components/FormError";

function CreditSales() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const { data, loading, error, execute } = useApi("credit-sales");

  const onSubmit = async (data) => {
    await execute(data, "POST");
    reset();
  };

  return (
    <section className="credit-sales-container">
      <h2 className="credit-sales-title">Credit Sales Management</h2>
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
          <label>Amount Due (USD)</label>
          <input
            type="number"
            step="0.01"
            {...register("amountDue", {
              required: "Amount due is required",
              min: 0,
            })}
            className="form-input"
          />
          {errors.amountDue && (
            <FormError message={errors.amountDue.message} />
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
          <label>Buyer’s National ID</label>
          <input
            type="text"
            {...register("nationalId", {
              required: "National ID is required",
              pattern: {
                value: /^[A-Z0-9]{8,16}$/,
                message: "Invalid national ID",
              },
            })}
            className="form-input"
          />
          {errors.nationalId && (
            <FormError message={errors.nationalId.message} />
          )}
        </div>
        <div className="form-group">
          <label>Buyer’s Location</label>
          <input
            type="text"
            {...register("location", { required: "Location is required" })}
            className="form-input"
          />
          {errors.location && <FormError message={errors.location.message} />}
        </div>
        <div className="form-group">
          <label>Due Date</label>
          <input
            type="date"
            {...register("dueDate", {
              required: "Due date is required",
              validate: {
                futureDate: (value) =>
                  new Date(value) >= new Date().setHours(0, 0, 0, 0) ||
                  "Due date must be today or later",
              },
            })}
            className="form-input"
            min={new Date().toISOString().split("T")[0]}
          />
          {errors.dueDate && <FormError message={errors.dueDate.message} />}
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
        <h3>Credit Sales Records</h3>
        {loading && <p>Loading...</p>}
        {error && <p className="form-error">{error}</p>}
        {data && data.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>Produce</th>
                <th>Tonnage</th>
                <th>Amount Due</th>
                <th>Buyer</th>
                <th>National ID</th>
                <th>Location</th>
                <th>Due Date</th>
                <th>Contact</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id}>
                  <td>{item.produceName}</td>
                  <td>{item.tonnage}</td>
                  <td>${item.amountDue}</td>
                  <td>{item.buyerName}</td>
                  <td>{item.nationalId}</td>
                  <td>{item.location}</td>
                  <td>{item.dueDate}</td>
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

export default CreditSales;