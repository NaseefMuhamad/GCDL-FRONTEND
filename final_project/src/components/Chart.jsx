import React from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

const Charts = ({ type, data, options }) => {
  const chartComponents = {
    line: Line,
    bar: Bar,
    pie: Pie,
  };

  const ChartComponent = chartComponents[type] || Line;

  return <ChartComponent data={data} options={options} />;
};

export default Charts;