import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Spinner } from 'flowbite-react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { 
  FaClock, 
  FaCalendarAlt, 
  FaSun, 
  FaMoon, 
  FaCloudSun,
  FaFilePdf,
  FaUsers,
  FaUtensils,
  FaMoneyBillWave,
  FaTable,
  FaUserCheck,
  FaUserTimes,
  FaExclamationTriangle
} from 'react-icons/fa';
import { PieChart } from '@mui/x-charts/PieChart';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

Chart.register(...registerables);

export default function CashierDashboard() {
  // Estados para datos y tiempo
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState('');
  const [greetingIcon, setGreetingIcon] = useState(<FaSun />);
  const [loading, setLoading] = useState(true);
  
  // Contadores
  const [employeeCount, setEmployeeCount] = useState(null);
  const [menuItemsCount, setMenuItemsCount] = useState(null);
  const [dailyRevenue, setDailyRevenue] = useState(null);
  const [availableTables, setAvailableTables] = useState(null);
  
  // Datos para gráficos
  const [attendanceData, setAttendanceData] = useState(null);
  const [revenueData, setRevenueData] = useState(null);
  const [orderStatusData, setOrderStatusData] = useState(null);
  const [menuCategoryData, setMenuCategoryData] = useState(null);
  
  // Refs para exportar PDF
  const dashboardRef = useRef();
  const chartsRef = useRef([]);

  // Configuración de colores
  const colors = {
    primary: '#3A86FF',
    secondary: '#8338EC',
    accent: '#FF006E',
    success: '#06D6A0',
    warning: '#FFBE0B',
    danger: '#EF476F',
    text: document.documentElement.classList.contains('dark') ? '#ffffff' : '#111827',
    background: document.documentElement.classList.contains('dark') ? '#111827' : '#ffffff'
  };

  useEffect(() => {
    // Configurar intervalo de tiempo
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
      updateGreeting();
    }, 60000);

    // Cargar datos iniciales
    fetchAllData();
    updateGreeting();

    return () => clearInterval(timeInterval);
  }, []);

  const updateGreeting = () => {
    const hours = currentTime.getHours();
    if (hours >= 6 && hours < 12) {
      setGreeting('Buenos días');
      setGreetingIcon(<FaSun className="text-yellow-400" />);
    } else if (hours >= 12 && hours < 19) {
      setGreeting('Buenas tardes');
      setGreetingIcon(<FaCloudSun className="text-orange-400" />);
    } else {
      setGreeting('Buenas noches');
      setGreetingIcon(<FaMoon className="text-blue-300" />);
    }
  };

  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      // Resetear datos antes de cargar nuevos
      setEmployeeCount(null);
      setMenuItemsCount(null);
      setDailyRevenue(null);
      setAvailableTables(null);
      setAttendanceData(null);
      setOrderStatusData(null);
      setRevenueData(null);
      setMenuCategoryData(null);

      // Obtener datos de empleados
      const employeesRes = await axios.get(`${import.meta.env.REACT_APP_API_URL}api/user/manage-employees`);
      setEmployeeCount(employeesRes.data?.length ?? 0);

      // Obtener datos del menú
      const menuItemsRes = await axios.get(`${import.meta.env.REACT_APP_API_URL}/api/food/available`);
      setMenuItemsCount(menuItemsRes.data?.length ?? 0);

      // Obtener datos de mesas
      const tablesRes = await axios.get(`${import.meta.env.REACT_APP_API_URL}/api/table/all`);
      setAvailableTables(tablesRes.data?.filter(table => table.tableAvailability)?.length ?? 0);

      // Obtener datos de órdenes
      const ordersRes = await axios.get(`${import.meta.env.REACT_APP_API_URL}/api/orders/all-orders-general`);
      
      // Calcular ingresos diarios (solo órdenes completadas hoy)
      const today = new Date().toISOString().split('T')[0];
      const todayCompletedOrders = ordersRes.data?.filter(order => 
        new Date(order.orderDateTime).toISOString().split('T')[0] === today && 
        order.orderStatus === 'Completed'
      ) ?? [];
      
      const todayRevenue = todayCompletedOrders.reduce((sum, order) => sum + (order.totalAfterDiscount || 0), 0);
      setDailyRevenue(todayRevenue);

      // Procesar datos de asistencia (si hay endpoint disponible)
      try {
        const attendanceRes = await axios.get(`${import.meta.env.REACT_APP_API_URL}/current-date`);
        if (attendanceRes.data && Array.isArray(attendanceRes.data)) {
          const present = attendanceRes.data.filter(a => a.inTime && a.inTime !== "absent").length;
          const absent = attendanceRes.data.filter(a => a.inTime === "absent").length;
          setAttendanceData([
            { id: 0, value: present, label: 'Presente' },
            { id: 1, value: absent, label: 'Ausente' }
          ]);
        }
      } catch (attendanceError) {
        console.log("No se pudo cargar datos de asistencia:", attendanceError);
        setAttendanceData(null);
      }

      // Generar datos para gráficos basados en datos reales
      generateOrderStatusData(ordersRes.data);
      generateRevenueData(ordersRes.data);
      generateMenuCategoryData(menuItemsRes.data);

    } catch (error) {
      console.error("Error fetching data:", error);
      Swal.fire({
        title: 'Error',
        text: 'Error al cargar algunos datos del dashboard',
        icon: 'error',
        confirmButtonText: 'Entendido',
        background: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff',
        color: document.documentElement.classList.contains('dark') ? '#ffffff' : '#111827'
      });
    } finally {
      setLoading(false);
    }
  };

  // Generar datos para gráficos basados en datos reales
  const generateOrderStatusData = (orders) => {
    if (!orders || !Array.isArray(orders) || orders.length === 0) {
      setOrderStatusData(null);
      return;
    }

    const statusCounts = orders.reduce((acc, order) => {
      const status = order.orderStatus;
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    const translatedStatuses = {
      'Pending': 'Pendiente',
      'Processing': 'En proceso',
      'Ready': 'Listo',
      'Completed': 'Completado',
      'Canceled': 'Cancelado'
    };

    const data = Object.entries(statusCounts).map(([status, count]) => ({
      status: translatedStatuses[status] || status,
      count
    }));

    setOrderStatusData(data);
  };

  const generateRevenueData = (orders) => {
    if (!orders || !Array.isArray(orders) || orders.length === 0) {
      setRevenueData(null);
      return;
    }

    // Agrupar ingresos por día de la semana actual
    const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    const today = new Date();
    const currentWeekStart = new Date(today.setDate(today.getDate() - today.getDay() + 1)); // Lunes de esta semana
    
    const weekData = days.map((day, index) => {
      const dayDate = new Date(currentWeekStart);
      dayDate.setDate(dayDate.getDate() + index);
      const dayStr = dayDate.toISOString().split('T')[0];
      
      const dayOrders = orders.filter(order => 
        new Date(order.orderDateTime).toISOString().split('T')[0] === dayStr && 
        order.orderStatus === 'Completed'
      );
      
      const revenue = dayOrders.reduce((sum, order) => sum + (order.totalAfterDiscount || 0), 0);
      
      return {
        day,
        revenue
      };
    });

    setRevenueData(weekData);
  };

  const generateMenuCategoryData = (menuItems) => {
    if (!menuItems || !Array.isArray(menuItems) || menuItems.length === 0) {
      setMenuCategoryData(null);
      return;
    }

    const categories = menuItems.reduce((acc, item) => {
      const category = item.category || 'Otros';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    const data = Object.entries(categories).map(([category, count]) => ({
      category,
      count
    }));

    setMenuCategoryData(data);
  };

  // Formatear fecha y hora
  const formattedDate = currentTime.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const formattedTime = currentTime.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  });

  // Configuración de gráficos con colores vibrantes
  const orderStatusChartData = {
    labels: orderStatusData?.map(item => item.status) || [],
    datasets: [{
      label: 'Pedidos por estado',
      data: orderStatusData?.map(item => item.count) || [],
      backgroundColor: [
        '#FF006E', // Rosa fuerte
        '#FB5607', // Naranja
        '#FFBE0B', // Amarillo
        '#8338EC', // Morado
        '#3A86FF'  // Azul
      ],
      borderColor: '#ffffff',
      borderWidth: 1
    }]
  };

  const revenueChartData = {
    labels: revenueData?.map(item => item.day) || [],
    datasets: [{
      label: 'Ingresos diarios (S/.)',
      data: revenueData?.map(item => item.revenue) || [],
      backgroundColor: '#06D6A0', // Verde
      borderColor: '#06D6A0',
      tension: 0.3,
      fill: true
    }]
  };

  const menuCategoryChartData = {
    labels: menuCategoryData?.map(item => item.category) || [],
    datasets: [{
      label: 'Platos por categoría',
      data: menuCategoryData?.map(item => item.count) || [],
      backgroundColor: [
        '#FF006E', // Rosa
        '#FFBE0B', // Amarillo
        '#8338EC', // Morado
        '#06D6A0', // Verde
        '#3A86FF'  // Azul
      ],
      borderColor: '#ffffff',
      borderWidth: 1
    }]
  };

  // Exportar a PDF
  const exportToPDF = async () => {
    const { value: option } = await Swal.fire({
      title: 'Exportar Dashboard',
      text: 'Seleccione qué desea exportar:',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Todo el dashboard',
      cancelButtonText: 'Cancelar',
      showDenyButton: true,
      denyButtonText: 'Solo los gráficos',
      customClass: {
        popup: 'dark:bg-gray-800 dark:text-white',
        confirmButton: 'bg-blue-500 hover:bg-blue-600',
        cancelButton: 'bg-green-500 hover:bg-green-600'
      }
    });

    if (option === undefined) return; // Cancelado

    const loadingAlert = Swal.fire({
      title: 'Generando PDF...',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
      background: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff',
      color: document.documentElement.classList.contains('dark') ? '#ffffff' : '#111827'
    });

    try {
      const pdf = new jsPDF('l', 'mm', 'a4');
      let positionY = 20;

      // Encabezado
      pdf.setFontSize(20);
      pdf.setTextColor(colors.primary);
      pdf.text('Reporte del Dashboard', 105, positionY, { align: 'center' });
      positionY += 10;

      pdf.setFontSize(12);
      pdf.setTextColor(colors.text);
      pdf.text(`Generado el: ${formattedDate} a las ${formattedTime}`, 105, positionY, { align: 'center' });
      positionY += 15;

      if (option === true) { // Exportar todo
        // Estadísticas
        pdf.setFontSize(14);
        pdf.setTextColor(colors.primary);
        pdf.text('Resumen de Estadísticas', 20, positionY);
        positionY += 10;

        pdf.setFontSize(10);
        pdf.setTextColor(colors.text);
        pdf.text(`• Empleados: ${employeeCount ?? 'N/A'}`, 20, positionY);
        pdf.text(`• Platos en menú: ${menuItemsCount ?? 'N/A'}`, 70, positionY);
        pdf.text(`• Ingresos diarios: ${dailyRevenue !== null ? `S/. ${dailyRevenue.toLocaleString('es-PE')}` : 'N/A'}`, 120, positionY);
        pdf.text(`• Mesas disponibles: ${availableTables ?? 'N/A'}`, 180, positionY);
        positionY += 20;
      }

      // Gráficos
      const chartsToExport = option === true ? 
        [0, 1, 2, 3] : // Todos los gráficos
        [0, 1, 2, 3];   // Solo gráficos

      for (const index of chartsToExport) {
        if (index > 0 && (index % 2 === 0 || option !== true)) {
          pdf.addPage();
          positionY = 20;
        }

        const canvas = await html2canvas(chartsRef.current[index]);
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 
          index % 2 === 0 ? 20 : 110, 
          positionY, 
          80, 
          60
        );

        if (index % 2 !== 0) positionY += 70;
      }

      pdf.save(`dashboard-reporte-${new Date().toISOString().slice(0, 10)}.pdf`);
      
      loadingAlert.close();
      Swal.fire({
        title: '¡PDF generado!',
        text: 'El reporte se ha descargado correctamente',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
        background: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff',
        color: document.documentElement.classList.contains('dark') ? '#ffffff' : '#111827'
      });
    } catch (error) {
      console.error('Error al generar PDF:', error);
      loadingAlert.close();
      Swal.fire({
        title: 'Error',
        text: 'No se pudo generar el documento PDF',
        icon: 'error',
        background: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff',
        color: document.documentElement.classList.contains('dark') ? '#ffffff' : '#111827'
      });
    }
  };

  // Componente para mostrar cuando no hay datos
  const NoDataMessage = () => (
    <div className="h-64 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
      <FaExclamationTriangle className="text-3xl mb-2" />
      <p>No hay datos disponibles</p>
    </div>
  );

  return (
    <div className="p-4 w-full min-h-screen bg-gray-50 dark:bg-gray-900" ref={dashboardRef}>
      {/* Encabezado */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-6 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold dark:text-white flex items-center gap-3">
              {greetingIcon} {greeting}
            </h1>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-2">
              <p className="text-lg text-gray-600 dark:text-gray-300 flex items-center gap-2">
                <FaCalendarAlt /> {formattedDate}
              </p>
              <p className="text-xl font-semibold dark:text-white flex items-center gap-2">
                <FaClock /> {formattedTime}
              </p>
            </div>
          </div>

          <Button
            onClick={exportToPDF}
            color="light"
            className="px-4 py-2 bg-blue-100 hover:bg-blue-200 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            <FaFilePdf className="mr-2" /> Exportar PDF
          </Button>
        </div>
      </motion.div>

      {/* Contadores */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
      >
        <StatCard 
          icon={<FaUsers className="text-2xl" />} 
          title="Empleados" 
          value={employeeCount !== null ? employeeCount : <Spinner size="sm" />} 
          color="blue" 
          loading={loading && employeeCount === null}
        />
        <StatCard 
          icon={<FaUtensils className="text-2xl" />} 
          title="Platos en menú" 
          value={menuItemsCount !== null ? menuItemsCount : <Spinner size="sm" />} 
          color="green" 
          loading={loading && menuItemsCount === null}
        />
        <StatCard 
          icon={<FaMoneyBillWave className="text-2xl" />} 
          title="Ingresos diarios" 
          value={dailyRevenue !== null ? `S/. ${dailyRevenue.toLocaleString('es-PE')}` : <Spinner size="sm" />} 
          color="purple" 
          loading={loading && dailyRevenue === null}
        />
        <StatCard 
          icon={<FaTable className="text-2xl" />} 
          title="Mesas disponibles" 
          value={availableTables !== null ? availableTables : <Spinner size="sm" />} 
          color="orange" 
          loading={loading && availableTables === null}
        />
      </motion.div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Gráfico 1: Asistencia de hoy */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white p-4 rounded-lg shadow"
          ref={el => chartsRef.current[0] = el}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-600">Asistencia de Hoy</h2>
            {attendanceData && (
              <div className="flex gap-2">
                <span className="flex items-center text-sm text-green-600 dark:text-green-400">
                  <FaUserCheck className="mr-1" /> Presente: {attendanceData[0]?.value || 0}
                </span>
                <span className="flex items-center text-sm text-red-600 dark:text-red-400">
                  <FaUserTimes className="mr-1" /> Ausente: {attendanceData[1]?.value || 0}
                </span>
              </div>
            )}
          </div>
          {loading && attendanceData === null ? (
            <div className="h-64 flex items-center justify-center">
              <Spinner size="xl" />
            </div>
          ) : attendanceData ? (
            <div className="h-64 flex justify-center">
              <PieChart
                series={[{
                  data: attendanceData,
                  highlightScope: { faded: 'global', highlighted: 'item' },
                  faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                  innerRadius: 30,
                  outerRadius: 100,
                  paddingAngle: 5,
                  cornerRadius: 5,
                  cx: 150,
                  cy: 100,
                }]}
                colors={['#06D6A0', '#EF476F']}
                width={400}
                height={200}
              />
            </div>
          ) : (
            <NoDataMessage />
          )}
        </motion.div>

        {/* Gráfico 2: Ingresos */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white p-4 rounded-lg shadow"
          ref={el => chartsRef.current[1] = el}
        >
          <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-600">Ingresos Diarios</h2>
          {loading && revenueData === null ? (
            <div className="h-64 flex items-center justify-center">
              <Spinner size="xl" />
            </div>
          ) : revenueData && revenueData.length > 0 ? (
            <div className="h-64">
              <Bar
                data={revenueChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false
                    },
                    tooltip: {
                      callbacks: {
                        label: (context) => `S/. ${context.raw.toLocaleString('es-PE')}`
                      }
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: (value) => `S/. ${value.toLocaleString('es-PE')}`
                      }
                    }
                  }
                }}
              />
            </div>
          ) : (
            <NoDataMessage />
          )}
        </motion.div>

        {/* Gráfico 3: Estado de pedidos */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white p-4 rounded-lg shadow"
          ref={el => chartsRef.current[2] = el}
        >
          <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-600">Estado de Pedidos</h2>
          {loading && orderStatusData === null ? (
            <div className="h-64 flex items-center justify-center">
              <Spinner size="xl" />
            </div>
          ) : orderStatusData && orderStatusData.length > 0 ? (
            <div className="h-64">
              <Doughnut
                data={orderStatusChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right',
                      labels: {
                        color: colors.text
                      }
                    }
                  }
                }}
              />
            </div>
          ) : (
            <NoDataMessage />
          )}
        </motion.div>

        {/* Gráfico 4: Categorías del menú */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white p-4 rounded-lg shadow"
          ref={el => chartsRef.current[3] = el}
        >
          <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-600">Categorías del Menú</h2>
          {loading && menuCategoryData === null ? (
            <div className="h-64 flex items-center justify-center">
              <Spinner size="xl" />
            </div>
          ) : menuCategoryData && menuCategoryData.length > 0 ? (
            <div className="h-64">
              <Doughnut
                data={menuCategoryChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right',
                      labels: {
                        color: colors.text
                      }
                    }
                  }
                }}
              />
            </div>
          ) : (
            <NoDataMessage />
          )}
        </motion.div>
      </div>
    </div>
  );
}

// Componente de tarjeta de estadísticas
function StatCard({ icon, title, value, color, loading }) {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-100 dark:bg-blue-900',
      text: 'text-blue-800 dark:text-blue-200',
      iconBg: 'bg-blue-200 dark:bg-blue-800'
    },
    green: {
      bg: 'bg-green-100 dark:bg-green-900',
      text: 'text-green-800 dark:text-green-200',
      iconBg: 'bg-green-200 dark:bg-green-800'
    },
    purple: {
      bg: 'bg-purple-100 dark:bg-purple-900',
      text: 'text-purple-800 dark:text-purple-200',
      iconBg: 'bg-purple-200 dark:bg-purple-800'
    },
    orange: {
      bg: 'bg-orange-100 dark:bg-orange-900',
      text: 'text-orange-800 dark:text-orange-200',
      iconBg: 'bg-orange-200 dark:bg-orange-800'
    }
  };

  return (
    <Card className={`h-full transition-all hover:scale-[1.02] ${colorClasses[color].bg} ${colorClasses[color].text}`}>
      <div className="flex justify-between h-full">
        <div className="flex flex-col justify-between">
          <p className="text-sm font-medium">{title}</p>
          <h3 className="text-2xl font-bold mt-1">
            {loading ? <Spinner size="sm" /> : value}
          </h3>
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color].iconBg} self-center`}>
          {icon}
        </div>
      </div>
    </Card>
  );
}