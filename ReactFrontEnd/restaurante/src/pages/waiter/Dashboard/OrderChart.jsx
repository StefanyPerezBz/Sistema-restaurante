import React, { useEffect, useState, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import PropTypes from 'prop-types';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import html2canvas from 'html2canvas';

const MySwal = withReactContent(Swal);

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function OrderChart({ dailyOrderCounts, userName }) {
  const chartRef = useRef(null);
  // Estado para el saludo según la hora
  const [greeting, setGreeting] = useState('');
  const [currentTime, setCurrentTime] = useState('');

  // Efecto para actualizar el saludo y la hora
  useEffect(() => {
    const updateGreeting = () => {
      const now = new Date();
      const peruTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Lima' }));
      const hours = peruTime.getHours();
      
      // Formatear hora en formato 12h
      const formattedTime = peruTime.toLocaleTimeString('es-PE', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });

      setCurrentTime(formattedTime);

      // Determinar el saludo
      if (hours >= 5 && hours < 12) {
        setGreeting('Buenos días');
      } else if (hours >= 12 && hours < 18) {
        setGreeting('Buenas tardes');
      } else {
        setGreeting('Buenas noches');
      }
    };

    updateGreeting();
    // Actualizar cada minuto
    const interval = setInterval(updateGreeting, 60000);
    return () => clearInterval(interval);
  }, []);

  // Prepare the data for the chart
  const labels = Object.keys(dailyOrderCounts).sort();
  const data = labels.map(date => dailyOrderCounts[date]);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Pedidos diarios',
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
        text: 'Pedidos diarios de los últimos 30 días',
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Día',
        },
        grid: {
          color: 'rgba(200, 200, 200, 0.2)',
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Recuento de pedidos',
        },
        grid: {
          color: 'rgba(200, 200, 200, 0.2)',
        },
      },
    },
  };


  return (
    <div className="p-4 bg-white border rounded-sm shadow dark:bg-white dark:border-gray-700 dark:shadow-gray-600">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-800">
            {greeting}, {userName}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-600">
            {currentTime} - Hora peruana
          </p>
        </div>
      </div>
      <div className="chart-container">
        <Line ref={chartRef} data={chartData} options={options} />
      </div>
    </div>
  );
}

OrderChart.propTypes = {
  dailyOrderCounts: PropTypes.object.isRequired,
  userName: PropTypes.string.isRequired,
};