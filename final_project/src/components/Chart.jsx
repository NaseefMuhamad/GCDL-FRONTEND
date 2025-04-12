import { Line, Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

function Chart({ type, data, options }) {
  const Component = type === "line" ? Line : Bar;
  return (
    <div className="dashboard-chart-container">
      <Component data={data} options={options} className="dashboard-chart" />
    </div>
  );
}

export default Chart;