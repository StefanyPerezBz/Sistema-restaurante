import React, { useEffect, useState } from 'react';
import { Card, Button, Spinner, ToggleSwitch } from 'flowbite-react';
import { Bar, Pie, Doughnut, Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Swal from 'sweetalert2';
import { FaClock, FaUtensils, FaChartPie, FaChartBar, FaFilePdf, FaMoneyBillWave } from 'react-icons/fa';
import axios from 'axios';

// Registrar componentes de Chart.js
Chart.register(...registerables);

// Traducciones al español
const translations = {
  "Main Course": "Plato Principal",
  "Dessert": "Postre",
  "Appetizer": "Entrante",
  "Beverage": "Bebida",
  "Salad": "Ensalada",
  "Soup": "Sopa",
  "Side Dish": "Acompañamiento",
  "Breakfast": "Desayuno",
  "available": "disponible",
  "unavailable": "no disponible"
};

export default function ChefDashboard() {
  const [time, setTime] = useState(new Date());
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Estado para los datos reales
  const [inventoryData, setInventoryData] = useState([]);
  const [foodData, setFoodData] = useState([]);

  // Actualizar la hora cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Obtener datos de las APIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Obtener datos de inventario
        const inventoryResponse = await axios.get(`${import.meta.env.REACT_APP_API_URL}/api/inventory/view`);
        setInventoryData(inventoryResponse.data);

        // Obtener datos de alimentos
        const foodResponse = await axios.get(`${import.meta.env.REACT_APP_API_URL}/api/food/all`);
        setFoodData(foodResponse.data);

        setLoading(false);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        Swal.fire({
          title: 'Error!',
          text: 'No se pudieron cargar los datos del dashboard',
          icon: 'error',
          confirmButtonText: 'Ok'
        });
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Función para traducir texto
  const translate = (text) => {
    return translations[text] || text;
  };

  // Determinar el saludo según la hora
  const getGreeting = () => {
    const hour = time.getHours();
    if (hour < 12) return "Buenos días";
    if (hour < 18) return "Buenas tardes";
    return "Buenas noches";
  };

  // Formatear la hora
  const formatTime = (date) => {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // Formatear la fecha
  const formatDate = (date) => {
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Preparar datos para gráficos basados en datos reales
  const prepareChartData = () => {
    // 1. Gráfico de categorías de comida (traducido)
    const foodCategories = {};
    foodData.forEach(food => {
      const category = translate(food.foodCategory);
      foodCategories[category] = (foodCategories[category] || 0) + 1;
    });

    const foodCategoryData = {
      labels: Object.keys(foodCategories),
      datasets: [{
        data: Object.values(foodCategories),
        backgroundColor: [
          '#F97316', // Naranja
          '#8B5CF6', // Violeta
          '#EC4899', // Rosa
          '#14B8A6', // Turquesa
          '#F59E0B', // Amarillo
          '#3B82F6'  // Azul
        ],
        borderWidth: 1
      }]
    };

    // 2. Gráfico de disponibilidad de alimentos (traducido)
    const availabilityData = {
      labels: ['Disponibles', 'No disponibles'],
      datasets: [{
        data: [
          foodData.filter(food => food.available).length,
          foodData.filter(food => !food.available).length
        ],
        backgroundColor: [
          '#10B981', // Verde - Disponibles
          '#EF4444'  // Rojo - No disponibles
        ],
        borderWidth: 1
      }]
    };

    // 3. Gráfico de inventario (top 5)
    const sortedInventory = [...inventoryData]
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    const inventoryUsageData = {
      labels: sortedInventory.map(item => item.itemName),
      datasets: [{
        label: 'Cantidad en inventario',
        data: sortedInventory.map(item => item.quantity),
        backgroundColor: '#6366F1', // Índigo
        borderColor: '#4F46E5',
        borderWidth: 1
      }]
    };

    // 4. Gráfico de inventario bajo (bottom 5)
    const lowInventory = [...inventoryData]
      .filter(item => item.quantity < 10)
      .sort((a, b) => a.quantity - b.quantity)
      .slice(0, 5);

    const lowInventoryData = {
      labels: lowInventory.map(item => item.itemName),
      datasets: [{
        label: 'Cantidad en inventario',
        data: lowInventory.map(item => item.quantity),
        backgroundColor: '#EF4444', // Rojo
        borderColor: '#DC2626',
        borderWidth: 1
      }]
    };

    // 5. NUEVO GRÁFICO: Precio promedio por categoría (traducido)
    const priceByCategory = {};
    foodData.forEach(food => {
      const category = translate(food.foodCategory);
      if (!priceByCategory[category]) {
        priceByCategory[category] = {
          sum: 0,
          count: 0
        };
      }
      priceByCategory[category].sum += food.foodPrice;
      priceByCategory[category].count += 1;
    });

    const avgPriceData = {
      labels: Object.keys(priceByCategory),
      datasets: [{
        label: 'Precio (S/.)',
        data: Object.values(priceByCategory).map(item => (item.sum / item.count).toFixed(2)),
        backgroundColor: '#10B981', // Verde
        borderColor: '#059669',
        borderWidth: 1
      }]
    };

    return {
      foodCategoryData,
      availabilityData,
      inventoryUsageData,
      lowInventoryData,
      avgPriceData
    };
  };

  const chartData = prepareChartData();

  // Exportar a PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    const dateStr = time.toLocaleDateString('es-ES');
    
    // Título
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('Reporte del Chef - ' + dateStr, 105, 15, { align: 'center' });
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    
    // Resumen de alimentos
    doc.text('Resumen de alimentos:', 14, 30);
    doc.autoTable({
      startY: 35,
      head: [['Categoría', 'Cantidad']],
      body: Object.entries(chartData.foodCategoryData.labels.reduce((acc, label, index) => {
        acc[label] = chartData.foodCategoryData.datasets[0].data[index];
        return acc;
      }, {})),
      styles: {
        fontSize: 10,
        cellPadding: 3
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold'
      }
    });
    
    // Precio promedio por categoría
    doc.text('Precio promedio por categoría:', 14, doc.lastAutoTable.finalY + 10);
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 15,
      head: [['Categoría', 'Precio (S/.)']],
      body: chartData.avgPriceData.labels.map((label, index) => [
        label,
        parseFloat(chartData.avgPriceData.datasets[0].data[index]).toFixed(2)
      ]),
      styles: {
        fontSize: 9
      }
    });
    
    doc.save(`Reporte_Chef_${dateStr.replace(/\//g, '-')}.pdf`);
    
    Swal.fire({
      title: 'Reporte generado!',
      text: 'El PDF se ha descargado correctamente.',
      icon: 'success',
      confirmButtonText: 'Ok'
    });
  };

  if (loading) {
    return (
      <div className={`flex justify-center items-center h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <Spinner size="xl" />
        <span className="ml-3">Cargando dashboard...</span>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-4 `}>
      {/* Barra superior con saludo, hora y controles */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">{getGreeting()}, Chef!</h1>
          <div className="flex items-center mt-2">
            <FaClock className="mr-2" />
            <span className="text-lg">{formatTime(time)}</span>
            <span className="mx-2">•</span>
            <span>{formatDate(time)}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <Button color="success" onClick={exportToPDF}>
            <FaFilePdf className="mr-2" />
            Exportar PDF
          </Button>
          
        </div>
      </div>

      {/* Contadores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className={`${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Total platos</h3>
              <p className="text-3xl font-bold text-blue-500">{foodData.length}</p>
            </div>
            <FaUtensils className="text-4xl text-blue-300" />
          </div>
        </Card>
        
        <Card className={`${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Platos disponibles</h3>
              <p className="text-3xl font-bold text-green-500">
                {foodData.filter(food => food.available).length}
              </p>
            </div>
            <FaUtensils className="text-4xl text-green-300" />
          </div>
        </Card>
        
        <Card className={`${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Artículos en inventario</h3>
              <p className="text-3xl font-bold text-purple-500">{inventoryData.length}</p>
            </div>
            <FaUtensils className="text-4xl text-purple-300" />
          </div>
        </Card>
        
        <Card className={`${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Artículos bajos</h3>
              <p className="text-3xl font-bold text-red-500">
                {inventoryData.filter(item => item.quantity < 10).length}
              </p>
            </div>
            <FaUtensils className="text-4xl text-red-300" />
          </div>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Gráfico de pie - Categorías de comida */}
        <Card className="dark:bg-white">
          <div className="flex items-center mb-4">
            <FaChartPie className="text-2xl mr-2 text-orange-500" />
            <h2 className="text-xl font-semibold dark:text-gray-600">Categorías de comida</h2>
          </div>
          <div className="h-64">
            <Pie 
              data={chartData.foodCategoryData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'right' },
                  title: { 
                    display: true, 
                    text: 'Distribución por categorías',
                    font: { size: 14 }
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const value = context.raw;
                        const percentage = Math.round((value / total) * 100);
                        return `${context.label}: ${value} (${percentage}%)`;
                      }
                    }
                  }
                }
              }} 
            />
          </div>
        </Card>
        
        {/* NUEVO GRÁFICO: Precio promedio por categoría */}
        <Card className="dark:bg-white">
          <div className="flex items-center mb-4">
            <FaMoneyBillWave className="text-2xl mr-2 text-green-500" />
            <h2 className="text-xl font-semibold dark:text-gray-600">Precio  por categoría</h2>
          </div>
          <div className="h-64">
            <Bar 
              data={chartData.avgPriceData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  title: { 
                    display: true, 
                    text: 'Precio por categoría (S/.)',
                    font: { size: 14 }
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        return `$${context.raw}`;
                      }
                    }
                  }
                },
                scales: { 
                  y: { 
                    beginAtZero: true,
                    ticks: {
                      callback: function(value) {
                        return '$' + value;
                      }
                    }
                  } 
                }
              }} 
            />
          </div>
        </Card>
        
        {/* Gráfico de dona - Disponibilidad */}
        <Card className="dark:bg-white">
          <div className="flex items-center mb-4">
            <FaChartPie className="text-2xl mr-2 text-green-500" />
            <h2 className="text-xl font-semibold dark:text-gray-600">Disponibilidad de platos</h2>
          </div>
          <div className="h-64">
            <Doughnut 
              data={chartData.availabilityData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'right' },
                  title: { 
                    display: true, 
                    text: 'Platos disponibles vs no disponibles',
                    font: { size: 14 }
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const value = context.raw;
                        const percentage = Math.round((value / total) * 100);
                        return `${context.label}: ${value} (${percentage}%)`;
                      }
                    }
                  }
                }
              }} 
            />
          </div>
        </Card>
        
        {/* Gráfico de barras - Inventario */}
        <Card className="dark:bg-white">
          <div className="flex items-center mb-4">
            <FaChartBar className="text-2xl mr-2 text-indigo-500" />
            <h2 className="text-xl font-semibold dark:text-gray-600">Top 5 inventario</h2>
          </div>
          <div className="h-64">
            <Bar 
              data={chartData.inventoryUsageData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  title: { 
                    display: true, 
                    text: 'Ingredientes con mayor cantidad',
                    font: { size: 14 }
                  }
                },
                scales: { 
                  y: { 
                    beginAtZero: true,
                    ticks: {
                      precision: 0
                    }
                  } 
                }
              }} 
            />
          </div>
        </Card>
      </div>

      {/* Tablas de datos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Tabla de inventario bajo */}
        {inventoryData.filter(item => item.quantity < 10).length > 0 && (
          <Card className={`${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className="text-xl font-semibold mb-4">Inventario bajo (menos de 10 unidades)</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={`${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'}`}>
                  <tr>
                    <th className="p-3 text-left">Ítem</th>
                    <th className="p-3 text-left">Cantidad</th>
                    <th className="p-3 text-left">Unidad</th>
                  </tr>
                </thead>
                <tbody>
                  {inventoryData
                    .filter(item => item.quantity < 10)
                    .sort((a, b) => a.quantity - b.quantity)
                    .map((item, index) => (
                      <tr key={index} className={`${darkMode ? 'border-gray-700' : 'border-gray-200'} border-b`}>
                        <td className="p-3">{item.itemName}</td>
                        <td className="p-3">
                          <span className="font-bold text-red-500">{item.quantity}</span>
                        </td>
                        <td className="p-3">{item.unit || 'N/A'}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Tabla de precios por categoría */}
        <Card className="dark:bg-white">
          <h2 className="text-xl font-semibold mb-4 dark:text-gray-600">Precios por categoría</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-orange-400 text-white">
                <tr>
                  <th className="p-3 text-left">Categoría</th>
                  <th className="p-3 text-left">Precio</th>
                  <th className="p-3 text-left">Cantida de platos</th>
                </tr>
              </thead>
              <tbody>
                {chartData.avgPriceData.labels.map((label, index) => (
                  <tr key={index} className="border-b dark:border-gray-700 dark:text-gray-800">
                    <td className="p-3">{label}</td>
                    <td className="p-3 font-bold">S/.{chartData.avgPriceData.datasets[0].data[index]}</td>
                    <td className="p-3">
                      {chartData.foodCategoryData.datasets[0].data[
                        chartData.foodCategoryData.labels.indexOf(label)
                      ]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}