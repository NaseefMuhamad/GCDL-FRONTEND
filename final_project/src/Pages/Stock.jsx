import { useApi } from "../hooks/useApi";
import LiveClock from "./LiveClock";

function Stock() {
  const { data, loading, error } = useApi("stock");

  return (
    <section className="stock-container">
      <h2 className="stock-title">Stock Management</h2>
      <div className="live-clock-container">
        <LiveClock />
      </div>
      <div className="page-image-container">
        <img
          src="/images/stock-inventory.jpg"
          alt="Stock Inventory"
          className="page-image"
        />
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className="form-error">{error}</p>}
      {data && data.length > 0 ? (
        <div className="stock-grid">
          {data.map((item, index) => (
            <div key={index} className="stock-card">
              <h3>{item.produceName.toUpperCase()}</h3>
              <p>{item.tonnage} tons</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No stock data available.</p>
      )}
    </section>
  );
}

export default Stock;