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

  const exportToPDF = async () => {
    MySwal.fire({
      title: 'Exportar a PDF',
      html: `<p>¿Desea exportar el gráfico de pedidos a PDF?</p><small>Se generará un reporte con los datos actuales.</small>`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Exportar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
    }).then(async (result) => {
      if (result.isConfirmed) {
        // Mostrar loader mientras se genera el PDF
        MySwal.fire({
          title: 'Generando PDF...',
          html: 'Por favor espere mientras se genera el documento.',
          allowOutsideClick: false,
          didOpen: () => {
            MySwal.showLoading();
          },
        });
        
        try {
          await generatePDF();
          MySwal.close();
        } catch (error) {
          console.error('Error al generar PDF:', error);
          MySwal.fire({
            title: 'Error',
            text: 'Ocurrió un error al generar el PDF',
            icon: 'error',
            confirmButtonColor: '#3085d6',
          });
        }
      }
    });
  };

  const generatePDF = async () => {
    // Create a new PDF instance
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
    });

    // Add title and greeting
    doc.setFontSize(16);
    doc.text('Reporte de Pedidos Diarios', 105, 15, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`${greeting}, ${userName}`, 105, 22, { align: 'center' });

    // Add date and time
    doc.setFontSize(10);
    doc.text(`Generado el: ${new Date().toLocaleDateString('es-PE')} a las ${currentTime}`, 105, 28, { align: 'center' });

    // Convert chart data to table format
    const tableData = labels.map((date, index) => [
      date,
      data[index],
    ]);

    // Add table with the data
    doc.autoTable({
      startY: 35,
      head: [['Fecha', 'Número de Pedidos']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [75, 192, 192],
        textColor: [255, 255, 255],
      },
    });

    // Capturar el gráfico como imagen
    const canvas = await html2canvas(document.querySelector('.chart-container canvas'), {
      scale: 2, // Mejor calidad
      logging: false,
      useCORS: true,
    });

    const imgData = canvas.toDataURL('image/png');
    
    // Calcular posición Y para la imagen
    const imgYPosition = doc.autoTable.previous.finalY + 15;
    
    // Añadir la imagen del gráfico al PDF
    doc.addImage(imgData, 'PNG', 20, imgYPosition, 250, 80); // Ajustar dimensiones según necesidad

    // Save the PDF
    doc.save(`reporte_pedidos_${new Date().toISOString().slice(0, 10)}.pdf`);

    // Show success message
    MySwal.fire({
      title: 'Exportado!',
      text: 'El reporte se ha exportado a PDF correctamente.',
      icon: 'success',
      confirmButtonColor: '#3085d6',
    });
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
        <button
          onClick={exportToPDF}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
          </svg>
          Exportar a PDF
        </button>
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