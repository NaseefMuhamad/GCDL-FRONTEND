import React from 'react';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function Chart(props) {
  // Determine chart type based on props.type or default to line
  const chartType = props.type || 'line';
  const isGauge = chartType === 'gauge';

  // Data configuration based on chart type
  let data;
  if (chartType === 'bar') {
    data = {
      labels: props.labels,
      datasets: [
        {
          label: props.title,
          data: props.data,
          backgroundColor: ['#3182ce', '#f6e05e'], // Blue and yellow bars like screenshot
          borderColor: ['#3182ce', '#f6e05e'],
          borderWidth: 1,
        },
      ],
    };
  } else if (chartType === 'gauge') {
    const value = props.data[0] || 0;
    const maxValue = props.maxValue || 100;
    data = {
      labels: [''],
      datasets: [
        {
          data: [value, maxValue - value], // Current value and remaining
          backgroundColor: ['#38c172', '#2b3a55'], // Green for filled, dark blue for background
          borderWidth: 0,
          circumference: 180,
          rotation: -90,
        },
      ],
    };
  } else {
    // Default to line chart with area fill
    data = {
      labels: props.labels,
      datasets: [
        {
          label: props.title,
          data: props.data,
          borderColor: '#3182ce', // Blue line
          backgroundColor: 'rgba(49, 130, 206, 0.2)', // Light blue fill
          fill: true,
          tension: 0.4, // Smooth curve
          pointRadius: 3,
          pointBackgroundColor: '#3182ce',
        },
      ],
    };
  }

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
        beginAtZero: true,
      },
      r: isGauge ? {
        min: 0,
        max: props.maxValue || 100,
        ticks: {
          display: false,
        },
        pointLabels: {
          display: false,
        },
      } : undefined,
    },
    rotation: isGauge ? -90 : 0,
    circumference: isGauge ? 180 : 360,
  };

  const ChartComponent = isGauge ? Doughnut : chartType === 'bar' ? Bar : Line;

  return (
    <div className="chart-container">
      <h3>{props.title}</h3>
      <div style={{ height: isGauge ? '150px' : '300px' }}>
        <ChartComponent data={data} options={options} />
      </div>
    </div>
  );
}

export default Chart;