import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

function Chart(props) {
  const data = {
    labels: props.labels,
    datasets: [
      {
        label: props.title,
        data: props.data,
        borderColor: '#3182ce', // Blue line to match screenshot
        backgroundColor: 'rgba(49, 130, 206, 0.2)', // Light blue fill
        fill: true,
        tension: 0.4, // Smooth curve
        pointRadius: 3,
        pointBackgroundColor: '#3182ce',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#ffffff', // White text for legend
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: false, // Title is handled by h3 in the container
      },
      tooltip: {
        backgroundColor: '#2b3a55',
        titleColor: '#ffffff',
        bodyColor: '#a0aec0',
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#a0aec0', // Light gray ticks
        },
      },
      y: {
        grid: {
          color: 'rgba(160, 174, 192, 0.2)', // Subtle grid lines
        },
        ticks: {
          color: '#a0aec0',
        },
      },
    },
  };

  return (
    <div className="chart-container">
      <h3>{props.title}</h3>
      <div style={{ height: '300px' }}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
}

export default Chart;