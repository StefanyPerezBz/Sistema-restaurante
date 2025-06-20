import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import PropTypes from 'prop-types';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function OrderChart({ dailyOrderCounts }) {

  // Prepare the data for the chart
  const labels = Object.keys(dailyOrderCounts).sort();
  const data = labels.map(date => dailyOrderCounts[date]);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Daily Orders',
        data,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Daily Orders Over the Last 30 Days',
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Day',
        },
        grid: {
          color: 'rgba(200, 200, 200, 0.2)',  // Light grid lines for light mode
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Order Count',
        },
        grid: {
          color: 'rgba(200, 200, 200, 0.2)',  // Light grid lines for light mode
        },
      },
    },
  };

  return (
    <div className="p-4 bg-white border rounded-sm shadow dark:bg-gray-900 dark:border-gray-700 dark:shadow-gray-600">
      <Line data={chartData} options={options} />
    </div>
  );
}

OrderChart.propTypes = {
  dailyOrderCounts: PropTypes.object.isRequired,
};
