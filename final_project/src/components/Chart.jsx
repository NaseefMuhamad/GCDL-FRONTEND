import React from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

const chartComponents = {
  line: Line,
  bar: Bar,
  pie: Pie,
};

function Charts({ type, data, options }) {
  const ChartComponent = chartComponents[type] || Line;

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '600px', margin: '0 auto' }}>
      <ChartComponent data={data} options={options} />
    </div>
  );
}

export default Charts;