import React, { useEffect, useState, useRef } from 'react';
import { Card, Button, Spinner, Alert, Modal } from 'flowbite-react';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import {
  FaClock,
  FaCalendarAlt,
  FaUsers,
  FaUtensils,
  FaMoneyBillWave,
  FaChartLine,
  FaTable,
  FaChair,
  FaSun,
  FaMoon,
  FaCloudSun,
  FaDownload,
  FaFilePdf,
  FaRegCalendarCheck,
  FaRegChartBar,
  FaBoxes,
  FaInfoCircle,
  FaTicketAlt,
  FaReceipt
} from 'react-icons/fa';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

Chart.register(...registerables);
const MySwal = withReactContent(Swal);

export default function ManagerDash() {
  // Estados para datos y carga
  const [tables, setTables] = useState([]);
  const [orders, setOrders] = useState([]);
  const [nextEvent, setNextEvent] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState('');
  const [greetingIcon, setGreetingIcon] = useState(<FaSun />);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [payments, setPayments] = useState([]);
  const [menuItems, setMenuItems] = useState([]); // Nuevo estado para los items del menú

  // Estadísticas
  const [stats, setStats] = useState({
    employees: 0,
    activeEmployees: 0,
    monthlyRevenue: 0,
    dailyRevenue: 0,
    popularItems: [],
    eventCount: 0,
    paymentCount: 0,
    menuItemsCount: 0
  });

  // Datos para gráficos
  const [revenueData, setRevenueData] = useState([]);
  const [dailyRevenueData, setDailyRevenueData] = useState([]);
  const [orderStatusData, setOrderStatusData] = useState([]);
  const [paymentData, setPaymentData] = useState([]);
  const [menuCategoryData, setMenuCategoryData] = useState([]);
  const [eventsData, setEventsData] = useState([]);

  // Refs para exportar a PDF
  const dashboardRef = useRef();
  const chartsRef = useRef([]);

  // Configuración de colores según el tema
  const isDarkMode = document.documentElement.classList.contains('dark');
  const colors = {
    primary: isDarkMode ? '#60a5fa' : '#1d4ed8',
    secondary: isDarkMode ? '#34d399' : '#0d9488',
    accent: isDarkMode ? '#fbbf24' : '#f97316',
    text: isDarkMode ? '#ffffff' : '#0f172a',
    background: isDarkMode ? '#111827' : '#ffffff',
    success: isDarkMode ? '#22c55e' : '#16a34a',
    warning: isDarkMode ? '#facc15' : '#eab308',
    danger: isDarkMode ? '#f87171' : '#dc2626',
    purple: isDarkMode ? '#a78bfa' : '#7c3aed',
    pink: isDarkMode ? '#f472b6' : '#db2777'
  };

  useEffect(() => {
    MySwal.mixin({
      background: isDarkMode ? '#1f2937' : '#ffffff',
      color: isDarkMode ? '#f3f4f6' : '#111827',
      confirmButtonColor: colors.primary,
      cancelButtonColor: '#6b7280'
    });

    fetchAllData();

    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
      updateGreeting();
    }, 60000);

    const dataInterval = setInterval(fetchAllData, 300000);

    return () => {
      clearInterval(timeInterval);
      clearInterval(dataInterval);
    };
  }, [isDarkMode]);

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
      setError(null);

      const [
        tablesRes,
        eventRes,
        employeesRes,
        ordersRes,
        paymentsRes,
        menuItemsRes,
        monthlyRevenueRes,
        allEventsRes
      ] = await Promise.all([
        axios.get(`localhost:8080/api/table/all`),
        axios.get(`localhost:8080/api/events/next-event`),
        axios.get(`localhost:8080/api/user/manage-employees`),
        axios.get(`localhost:8080/api/orders`),
        axios.get(`localhost:8080/api/payment/getAllPayments`),
        axios.get(`localhost:8080/api/food/available`),
        axios.get(`localhost:8080/api/orders/monthly-sales-revenue`),
        axios.get(`localhost:8080/api/events/view-events`)
      ]);

      setTables(tablesRes.data);
      setNextEvent(eventRes.data);
      setOrders(ordersRes.data);
      setPayments(paymentsRes.data);
      setMenuItems(menuItemsRes.data); // Guardar los items del menú

      const activeEmployees = employeesRes.data.filter(e => e.isActive).length;

      const todayOrders = ordersRes.data.filter(order => {
        const orderDate = new Date(order.orderDateTime);
        const today = new Date();
        return (
          orderDate.getDate() === today.getDate() &&
          orderDate.getMonth() === today.getMonth() &&
          orderDate.getFullYear() === today.getFullYear()
        );
      });

      const dailyRevenue = todayOrders.reduce((sum, order) => sum + order.totalAfterDiscount, 0);

      setStats({
        employees: employeesRes.data.length,
        activeEmployees,
        monthlyRevenue: monthlyRevenueRes.data || 0,
        dailyRevenue: dailyRevenue || 0,
        popularItems: getPopularItems(ordersRes.data, menuItemsRes.data), // Pasamos los items del menú
        eventCount: allEventsRes.data.length || 0,
        paymentCount: paymentsRes.data.length || 0,
        menuItemsCount: menuItemsRes.data.length
      });

      setRevenueData(generateMonthlyRevenueData(monthlyRevenueRes.data));
      setDailyRevenueData(generateDailyRevenueData(dailyRevenue));
      setOrderStatusData(generateOrderStatusData(ordersRes.data));
      setPaymentData(generatePaymentData(paymentsRes.data));
      setMenuCategoryData(generateMenuCategoryData(menuItemsRes.data));
      setEventsData(generateEventsData(allEventsRes.data));

    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Error al cargar los datos. Por favor, intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const generateMonthlyRevenueData = (monthlyRevenue) => {
    if (!monthlyRevenue) return [];

    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const currentDay = now.getDate();

    return Array.from({ length: currentDay }, (_, i) => ({
      day: `Día ${i + 1}`,
      revenue: Math.round(monthlyRevenue / daysInMonth * (i + 1))
    }));
  };

  const generateDailyRevenueData = (dailyRevenue) => {
    if (!dailyRevenue) return [];

    return Array.from({ length: 24 }, (_, i) => ({
      hour: `${i}:00`,
      revenue: Math.round(dailyRevenue / 24 * (i + 1))
    }));
  };

  const generateEventsData = (events) => {
    if (!events || events.length === 0) return [];

    const now = new Date();
    const completedEvents = events.filter(event => {
      const eventDate = new Date(event.eventDate);
      return eventDate < now;
    }).length;

    const pendingEvents = events.length - completedEvents;

    return [
      { status: 'Completados', count: completedEvents },
      { status: 'Pendientes', count: pendingEvents }
    ];
  };

  const getPopularItems = (orders, menuItems) => {
    if (!orders || orders.length === 0) return [];

    const itemCounts = {};
    const menuItemsMap = {};

    // Creamos un mapa rápido de los items del menú para búsqueda por ID
    menuItems.forEach(item => {
      menuItemsMap[item.foodId] = item;
    });

    orders.forEach(order => {
      order.orderItems.forEach(item => {
        // Buscamos el nombre correcto: primero en el item del pedido, sino en el menú
        const itemName = item.foodItemName ||
          (menuItemsMap[item.foodItemId]?.foodName) ||
          'Ítem no disponible';

        if (!itemCounts[itemName]) {
          itemCounts[itemName] = 0;
        }
        itemCounts[itemName] += item.quantity;
      });
    });

    return Object.entries(itemCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name, count]) => ({ name, count }));
  };

  const generateOrderStatusData = (orders) => {
    if (!orders || orders.length === 0) return [];

    const statusCounts = orders.reduce((acc, order) => {
      if (!acc[order.orderStatus]) {
        acc[order.orderStatus] = 0;
      }
      acc[order.orderStatus]++;
      return acc;
    }, {});

    return Object.entries(statusCounts).map(([status, count]) => ({
      status: translateOrderStatus(status),
      count
    }));
  };

  const translateOrderStatus = (status) => {
    const translations = {
      'Pending': 'Pendiente',
      'Processing': 'En preparación',
      'Ready': 'Listo',
      'Completed': 'Completado',
      'Canceled': 'Cancelado'
    };
    return translations[status] || status;
  };

  const generatePaymentData = (paymentData) => {
    if (!paymentData || paymentData.length === 0) return [];

    const paymentsByType = paymentData.reduce((acc, curr) => {
      if (!acc[curr.billType]) {
        acc[curr.billType] = 0;
      }
      acc[curr.billType] += curr.amount;
      return acc;
    }, {});

    return Object.entries(paymentsByType).map(([type, amount]) => ({
      category: translateBillType(type),
      amount
    }));
  };

  const generateMenuCategoryData = (menuItems) => {
    if (!menuItems || menuItems.length === 0) return [];

    const categories = {};

    // Mapeo de traducción de categorías
    const categoryTranslations = {
      'Main Course': 'Plato Principal',
      'Side Dish': 'Acompañamiento',
      'Appetizer': 'Entrada',
      'Dessert': 'Postre',
      'Beverage': 'Bebida',
      'Salad': 'Ensalada',
      'Soup': 'Sopa',
      'Breakfast': 'Desayuno',
      'Lunch': 'Almuerzo',
      'Dinner': 'Cena',
      'Kids Menu': 'Menú Infantil',
      'Vegetarian': 'Vegetariano',
      'Vegan': 'Vegano',
      'Gluten Free': 'Sin Gluten'
    };

    menuItems.forEach(item => {
      // Obtener la categoría original o usar 'Sin categoría'
      const originalCategory = item.foodCategory || 'Sin categoría';

      // Traducir la categoría o mantenerla igual si no hay traducción
      const categoryName = categoryTranslations[originalCategory] || originalCategory;

      if (!categories[categoryName]) {
        categories[categoryName] = 0;
      }
      categories[categoryName]++;
    });

    return Object.entries(categories).map(([category, count]) => ({
      type: category,
      count
    }));
  };

  const translateBillType = (type) => {
    const translations = {
      'Electricity Bill': 'Luz Eléctrica',
      'Water Bill': 'Agua',
      'Telephone Bill': 'Teléfono',
      'Internet Bill': 'Internet',
      'Insurance': 'Seguro',
      'Other Expenses': 'Otros'
    };
    return translations[type] || type;
  };

  const exportToPDF = async () => {
    const loadingAlert = MySwal.fire({
      title: 'Generando PDF...',
      allowOutsideClick: false,
      didOpen: () => {
        MySwal.showLoading();
      }
    });

    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      let positionY = 20;
      let positionX = 15;

      // Encabezado del PDF
      pdf.setFontSize(20);
      pdf.setTextColor(colors.primary);
      pdf.text('Reporte de Gestión - Restaurante Los Patos', 105, positionY, { align: 'center' });
      positionY += 10;

      pdf.setFontSize(12);
      pdf.setTextColor(colors.text);
      pdf.text(`Generado el: ${formattedDate} a las ${formattedTime}`, 105, positionY, { align: 'center' });
      positionY += 15;

      // Resumen de estadísticas
      pdf.setFontSize(14);
      pdf.setTextColor(colors.primary);
      pdf.text('Resumen de Estadísticas', positionX, positionY);
      positionY += 10;

      pdf.setFontSize(10);
      pdf.setTextColor(colors.text);

      // Tabla de resumen
      pdf.autoTable({
        startY: positionY,
        head: [['Métrica', 'Valor']],
        body: [
          ['Empleados', stats.employees],
          ['Empleados activos', stats.activeEmployees],
          ['Ingresos mensuales', `S/. ${stats.monthlyRevenue.toLocaleString('es-PE')}`],
          ['Ingresos diarios', `S/. ${stats.dailyRevenue.toLocaleString('es-PE')}`],
          ['Eventos programados', stats.eventCount],
          ['Pagos registrados', stats.paymentCount],
          ['Platos en menú', stats.menuItemsCount],
          ['Mesas disponibles', `${availableTables}/${tables.length}`]
        ],
        theme: 'grid',
        headStyles: {
          fillColor: colors.primary,
          textColor: '#ffffff'
        },
        alternateRowStyles: {
          fillColor: isDarkMode ? '#374151' : '#f3f4f6'
        }
      });

      positionY = pdf.autoTable.previous.finalY + 15;

      // Ingresos mensuales
      pdf.setFontSize(14);
      pdf.setTextColor(colors.primary);
      pdf.text('Ingresos Mensuales', positionX, positionY);
      positionY += 10;

      if (revenueData.length > 0) {
        const revenueTableData = revenueData.map(item => [
          item.day,
          `S/. ${item.revenue.toLocaleString('es-PE')}`
        ]);

        pdf.autoTable({
          startY: positionY,
          head: [['Día', 'Ingresos (S/.)']],
          body: revenueTableData,
          theme: 'grid',
          headStyles: {
            fillColor: colors.primary,
            textColor: '#ffffff'
          },
          alternateRowStyles: {
            fillColor: isDarkMode ? '#374151' : '#f3f4f6'
          }
        });
      } else {
        pdf.setTextColor(colors.text);
        pdf.text('Sin datos de ingresos mensuales', positionX, positionY);
      }

      positionY = revenueData.length > 0 ? pdf.autoTable.previous.finalY + 15 : positionY + 10;

      // Ingresos por hora
      pdf.setFontSize(14);
      pdf.setTextColor(colors.primary);
      pdf.text('Ingresos por Hora', positionX, positionY);
      positionY += 10;

      if (dailyRevenueData.length > 0) {
        const dailyRevenueTableData = dailyRevenueData.map(item => [
          item.hour,
          `S/. ${item.revenue.toLocaleString('es-PE')}`
        ]);

        pdf.autoTable({
          startY: positionY,
          head: [['Hora', 'Ingresos (S/.)']],
          body: dailyRevenueTableData,
          theme: 'grid',
          headStyles: {
            fillColor: colors.primary,
            textColor: '#ffffff'
          },
          alternateRowStyles: {
            fillColor: isDarkMode ? '#374151' : '#f3f4f6'
          }
        });
      } else {
        pdf.setTextColor(colors.text);
        pdf.text('Sin datos de ingresos por hora', positionX, positionY);
      }

      positionY = dailyRevenueData.length > 0 ? pdf.autoTable.previous.finalY + 15 : positionY + 10;

      // Estado de pedidos
      pdf.setFontSize(14);
      pdf.setTextColor(colors.primary);
      pdf.text('Estado de Pedidos', positionX, positionY);
      positionY += 10;

      if (orderStatusData.length > 0) {
        const orderStatusTableData = orderStatusData.map(item => [
          item.status,
          item.count.toString()
        ]);

        pdf.autoTable({
          startY: positionY,
          head: [['Estado', 'Cantidad']],
          body: orderStatusTableData,
          theme: 'grid',
          headStyles: {
            fillColor: colors.primary,
            textColor: '#ffffff'
          },
          alternateRowStyles: {
            fillColor: isDarkMode ? '#374151' : '#f3f4f6'
          }
        });
      } else {
        pdf.setTextColor(colors.text);
        pdf.text('Sin datos de estado de pedidos', positionX, positionY);
      }

      positionY = orderStatusData.length > 0 ? pdf.autoTable.previous.finalY + 15 : positionY + 10;

      // Eventos
      pdf.setFontSize(14);
      pdf.setTextColor(colors.primary);
      pdf.text('Estado de Eventos', positionX, positionY);
      positionY += 10;

      if (eventsData.length > 0) {
        const eventsTableData = eventsData.map(item => [
          item.status,
          item.count.toString()
        ]);

        pdf.autoTable({
          startY: positionY,
          head: [['Estado', 'Cantidad']],
          body: eventsTableData,
          theme: 'grid',
          headStyles: {
            fillColor: colors.primary,
            textColor: '#ffffff'
          },
          alternateRowStyles: {
            fillColor: isDarkMode ? '#374151' : '#f3f4f6'
          }
        });
      } else {
        pdf.setTextColor(colors.text);
        pdf.text('Sin datos de eventos', positionX, positionY);
      }

      positionY = eventsData.length > 0 ? pdf.autoTable.previous.finalY + 15 : positionY + 10;

      // Gastos
      pdf.setFontSize(14);
      pdf.setTextColor(colors.primary);
      pdf.text('Gastos por Categoría', positionX, positionY);
      positionY += 10;

      if (paymentData.length > 0) {
        const paymentsTableData = paymentData.map(item => [
          item.category,
          `S/. ${item.amount.toLocaleString('es-PE')}`
        ]);

        pdf.autoTable({
          startY: positionY,
          head: [['Categoría', 'Monto (S/.)']],
          body: paymentsTableData,
          theme: 'grid',
          headStyles: {
            fillColor: colors.primary,
            textColor: '#ffffff'
          },
          alternateRowStyles: {
            fillColor: isDarkMode ? '#374151' : '#f3f4f6'
          }
        });
      } else {
        pdf.setTextColor(colors.text);
        pdf.text('Sin datos de gastos', positionX, positionY);
      }

      positionY = paymentData.length > 0 ? pdf.autoTable.previous.finalY + 15 : positionY + 10;

      // Categorías del menú
      pdf.setFontSize(14);
      pdf.setTextColor(colors.primary);
      pdf.text('Categorías del Menú', positionX, positionY);
      positionY += 10;

      if (menuCategoryData.length > 0) {
        const menuCategoryTableData = menuCategoryData.map(item => [
          item.type,
          item.count.toString()
        ]);

        pdf.autoTable({
          startY: positionY,
          head: [['Categoría', 'Cantidad']],
          body: menuCategoryTableData,
          theme: 'grid',
          headStyles: {
            fillColor: colors.primary,
            textColor: '#ffffff'
          },
          alternateRowStyles: {
            fillColor: isDarkMode ? '#374151' : '#f3f4f6'
          }
        });
      } else {
        pdf.setTextColor(colors.text);
        pdf.text('Sin datos de categorías del menú', positionX, positionY);
      }

      positionY = menuCategoryData.length > 0 ? pdf.autoTable.previous.finalY + 15 : positionY + 10;

      // Platos populares
      pdf.setFontSize(14);
      pdf.setTextColor(colors.primary);
      pdf.text('Platos Más Populares', positionX, positionY);
      positionY += 10;

      if (stats.popularItems.length > 0) {
        const popularItemsTableData = stats.popularItems.map(item => [
          item.name || 'Ítem no disponible',
          item.count.toString(),
          `S/. ${(menuItems.find(mi => mi.foodName === item.name)?.foodPrice?.toLocaleString('es-PE') || 'N/A')}`
        ]);

        pdf.autoTable({
          startY: positionY,
          head: [['Plato', 'Ventas', 'Precio unitario']],
          body: popularItemsTableData,
          theme: 'grid',
          headStyles: {
            fillColor: colors.primary,
            textColor: '#ffffff'
          },
          alternateRowStyles: {
            fillColor: isDarkMode ? '#374151' : '#f3f4f6'
          }
        });
      } else {
        pdf.setTextColor(colors.text);
        pdf.text('Sin datos de platos populares', positionX, positionY);
      }

      positionY = stats.popularItems.length > 0 ? pdf.autoTable.previous.finalY + 15 : positionY + 10;

      // Próximo evento
      pdf.setFontSize(14);
      pdf.setTextColor(colors.primary);
      pdf.text('Próximo Evento', positionX, positionY);
      positionY += 10;

      if (nextEvent) {
        const eventDate = new Date(nextEvent.eventDate).toLocaleDateString('es-PE', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });

        const eventTableData = [
          ['Nombre', nextEvent.eventName || 'No especificado'],
          ['Fecha', eventDate],
          ['Hora', nextEvent.startTime || 'No especificada'],
          ['Invitado', nextEvent.entertainer || 'No especificado'],
          ['Recaudado', nextEvent.budget ? `S/. ${nextEvent.budget.toLocaleString('es-PE')}` : 'No especificado']
        ];

        pdf.autoTable({
          startY: positionY,
          head: [['Detalle', 'Información']],
          body: eventTableData,
          theme: 'grid',
          headStyles: {
            fillColor: colors.primary,
            textColor: '#ffffff'
          },
          alternateRowStyles: {
            fillColor: isDarkMode ? '#374151' : '#f3f4f6'
          }
        });
      } else {
        pdf.setTextColor(colors.text);
        pdf.text('No hay eventos próximos', positionX, positionY);
      }

      // Pie de página
      pdf.setFontSize(10);
      pdf.setTextColor(colors.text);
      pdf.text('© Restaurante Los Patos - Todos los derechos reservados', 105, 285, { align: 'center' });

      // Guardar el PDF
      pdf.save(`reporte-gestion-${new Date().toISOString().slice(0, 10)}.pdf`);

      loadingAlert.close();
      MySwal.fire({
        title: '¡PDF generado!',
        text: 'El reporte se ha descargado correctamente',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error al generar PDF:', error);
      loadingAlert.close();
      MySwal.fire({
        title: 'Error',
        text: 'No se pudo generar el documento PDF',
        icon: 'error'
      });
    }
  };

  const showEventDetails = (event) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

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

  const availableTables = tables.filter(table => table.tableAvailability === true).length;
  const occupiedTables = tables.length - availableTables;

  // Configuración de gráficos con colores distintos
  const revenueChartData = {
    labels: revenueData.map(item => item.day),
    datasets: [
      {
        label: 'Ingresos (S/.)',
        data: revenueData.map(item => item.revenue),
        backgroundColor: '#3A86FF80', // Azul brillante con transparencia
        borderColor: '#3A86FF',
        tension: 0.3,
        fill: true,
        borderWidth: 2
      }
    ]
  };

  const dailyRevenueChartData = {
    labels: dailyRevenueData.map(item => item.hour),
    datasets: [
      {
        label: 'Ingresos por hora (S/.)',
        data: dailyRevenueData.map(item => item.revenue),
        backgroundColor: '#38B00080', // Verde vibrante con transparencia
        borderColor: '#38B000',
        tension: 0.3,
        borderWidth: 2
      }
    ]
  };

  const orderStatusChartData = {
    labels: orderStatusData.map(item => item.status),
    datasets: [
      {
        label: 'Pedidos por estado',
        data: orderStatusData.map(item => item.count),
        backgroundColor: [
          '#FF006E', // Rosa fuerte
          '#FB5607', // Naranja
          '#FFBE0B', // Amarillo
          '#8338EC', // Morado
          '#3A86FF'  // Azul
        ],
        borderColor: isDarkMode ? '#374151' : '#e5e7eb',
        borderWidth: 1
      }
    ]
  };

  const eventsChartData = {
    labels: eventsData.map(item => item.status),
    datasets: [
      {
        label: 'Eventos por estado',
        data: eventsData.map(item => item.count),
        backgroundColor: [
          '#FF9E00', // Amarillo oscuro
          '#4CC9F0'  // Azul claro
        ],
        borderColor: isDarkMode ? '#374151' : '#e5e7eb',
        borderWidth: 1
      }
    ]
  };

  const paymentsChartData = {
    labels: paymentData.map(item => item.category),
    datasets: [
      {
        label: 'Gastos (S/.)',
        data: paymentData.map(item => item.amount),
        backgroundColor: [
          '#7209B7', // Morado oscuro
          '#F72585', // Rosa
          '#4895EF', // Azul
          '#4CC9F0', // Azul claro
          '#4361EE'  // Azul medio
        ],
        borderColor: isDarkMode ? '#374151' : '#e5e7eb',
        borderWidth: 1
      }
    ]
  };

  const menuCategoryChartData = {
    labels: menuCategoryData.map(item => item.type || 'Sin categoría'),
    datasets: [
      {
        label: 'Platos por Categoría',
        data: menuCategoryData.map(item => item.count),
        backgroundColor: [
          '#F94144', '#F3722C', '#F8961E', '#90BE6D', '#43AA8B', '#577590'
        ],
        borderColor: isDarkMode ? '#374151' : '#e5e7eb',
        borderWidth: 1
      }
    ]
  };

  // Animaciones
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="p-4 w-full min-h-screen bg-gray-50 dark:bg-gray-900" ref={dashboardRef}>
      {/* Encabezado con saludo, fecha y hora */}
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

          <div className="flex gap-2">
            <Button
              onClick={fetchAllData}
              color="light"
              className="px-4 py-2 bg-blue-100 hover:bg-blue-200 dark:bg-gray-700 dark:hover:bg-gray-600"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Actualizando...
                </>
              ) : (
                'Actualizar datos'
              )}
            </Button>

            <Button
              onClick={exportToPDF}
              color="light"
              className="px-4 py-2 bg-green-100 hover:bg-green-200 dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              <FaFilePdf className="mr-2" /> Exportar PDF
            </Button>
          </div>
        </div>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Alert color="failure" icon={FaInfoCircle}>
            {error}
          </Alert>
        </motion.div>
      )}

      {/* Estadísticas rápidas */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6"
      >
        <motion.div variants={itemVariants}>
          <StatCard
            icon={<FaUsers className="text-2xl" />}
            title="Empleados"
            value={stats.employees}
            color="blue"
            loading={loading}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <StatCard
            icon={<FaMoneyBillWave className="text-2xl" />}
            title="Ingresos diarios"
            value={`S/. ${stats.dailyRevenue.toLocaleString('es-PE')}`}
            color="yellow"
            loading={loading}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <StatCard
            icon={<FaTicketAlt className="text-2xl" />}
            title="Eventos"
            value={stats.eventCount}
            color="purple"
            loading={loading}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <StatCard
            icon={<FaReceipt className="text-2xl" />}
            title="Pagos"
            value={stats.paymentCount}
            color="indigo"
            loading={loading}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <StatCard
            icon={<FaUtensils className="text-2xl" />}
            title="Platos del Menú"
            value={stats.menuItemsCount}
            color="green"
            loading={loading}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <StatCard
            icon={<FaTable className="text-2xl" />}
            title="Mesas Disponibles"
            value={tables.length > 0 ? `${availableTables}/${tables.length}` : '0/0'}
            color="pink"
            loading={loading}
          />
        </motion.div>
      </motion.div>

      {/* Gráficos principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Gráfico de ingresos mensuales */}
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-white p-4 rounded-lg shadow"
          ref={el => chartsRef.current[0] = el}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold dark:text-gray-600">Ingresos mensuales</h2>
            <FaRegChartBar className="text-2xl text-blue-600" />
          </div>
          {revenueData.length > 0 ? (
            <div className="h-64">
              <Bar
                data={revenueChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                      labels: {
                        color: colors.text
                      }
                    },
                    tooltip: {
                      callbacks: {
                        label: (context) => `S/. ${context.raw.toLocaleString('es-PE')}`
                      }
                    }
                  },
                  scales: {
                    x: {
                      grid: {
                        color: isDarkMode ? '#374151' : '#e5e7eb',
                        drawBorder: false
                      },
                      ticks: {
                        color: colors.text
                      }
                    },
                    y: {
                      grid: {
                        color: isDarkMode ? '#374151' : '#e5e7eb',
                        drawBorder: false
                      },
                      ticks: {
                        color: colors.text,
                        callback: (value) => `S/. ${value.toLocaleString('es-PE')}`
                      }
                    }
                  }
                }}
              />
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
              {loading ? <Spinner size="xl" /> : 'Datos no disponibles'}
            </div>
          )}
        </motion.div>

        {/* Gráfico de ingresos diarios */}
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-white p-4 rounded-lg shadow"
          ref={el => chartsRef.current[1] = el}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold dark:text-gray-600">Ingresos por hora</h2>
            <FaRegChartBar className="text-2xl text-green-600" />
          </div>
          {dailyRevenueData.length > 0 ? (
            <div className="h-64">
              <Line
                data={dailyRevenueChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                      labels: {
                        color: colors.text
                      }
                    },
                    tooltip: {
                      callbacks: {
                        label: (context) => `S/. ${context.raw.toLocaleString('es-PE')}`
                      }
                    }
                  },
                  scales: {
                    x: {
                      grid: {
                        color: isDarkMode ? '#374151' : '#e5e7eb',
                        drawBorder: false
                      },
                      ticks: {
                        color: colors.text
                      }
                    },
                    y: {
                      grid: {
                        color: isDarkMode ? '#374151' : '#e5e7eb',
                        drawBorder: false
                      },
                      ticks: {
                        color: colors.text,
                        callback: (value) => `S/. ${value.toLocaleString('es-PE')}`
                      }
                    }
                  }
                }}
              />
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-700">
              {loading ? <Spinner size="xl" /> : 'Datos no disponibles'}
            </div>
          )}
        </motion.div>
      </div>

      {/* Segunda fila de gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Gráfico de estado de pedidos */}
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-white p-4 rounded-lg shadow"
          ref={el => chartsRef.current[2] = el}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold dark:text-gray-700">Estado de Pedidos</h2>
            <FaRegCalendarCheck className="text-2xl text-orange-500" />
          </div>
          {orderStatusData.length > 0 ? (
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
                        color: colors.text,
                        boxWidth: 15,
                        padding: 15
                      }
                    }
                  }
                }}
              />
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-700">
              {loading ? <Spinner size="xl" /> : 'Datos no disponibles'}
            </div>
          )}
        </motion.div>

        {/* Gráfico de eventos */}
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-white p-4 rounded-lg shadow"
          ref={el => chartsRef.current[3] = el}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold dark:text-gray-600">Estado de Eventos</h2>
            <FaTicketAlt className="text-2xl text-yellow-600" />
          </div>
          {eventsData.length > 0 ? (
            <div className="h-64">
              <Doughnut
                data={eventsChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right',
                      labels: {
                        color: colors.text,
                        boxWidth: 15,
                        padding: 15
                      }
                    }
                  }
                }}
              />
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
              {loading ? <Spinner size="xl" /> : 'Datos no disponibles'}
            </div>
          )}
        </motion.div>
      </div>

      {/* Tercera fila de gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Gráfico de gastos */}
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-white p-4 rounded-lg shadow"
          ref={el => chartsRef.current[4] = el}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold dark:text-gray-600">Gastos por categoría</h2>
            <FaMoneyBillWave className="text-2xl text-purple-600" />
          </div>
          {paymentData.length > 0 ? (
            <div className="h-64">
              <Pie
                data={paymentsChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right',
                      labels: {
                        color: colors.text,
                        boxWidth: 15,
                        padding: 15
                      }
                    },
                    tooltip: {
                      callbacks: {
                        label: (context) => `S/. ${context.raw.toLocaleString('es-PE')}`
                      }
                    }
                  }
                }}
              />
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
              {loading ? <Spinner size="xl" /> : 'Datos no disponibles'}
            </div>
          )}
        </motion.div>

        {/* Gráfico de categorías de menú */}
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-white p-4 rounded-lg shadow"
          ref={el => chartsRef.current[5] = el}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold dark:text-gray-600">Categorías del Menú</h2>
            <FaUtensils className="text-2xl text-red-500" />
          </div>
          {menuCategoryData.length > 0 ? (
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
                        color: colors.text,
                        boxWidth: 15,
                        padding: 15
                      }
                    }
                  }
                }}
              />
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
              {loading ? <Spinner size="xl" /> : 'Datos no disponibles'}
            </div>
          )}
        </motion.div>
      </div>

      {/* Próximo evento y mesas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Próximo evento */}
        <motion.div variants={itemVariants} className="lg:col-span-1 ">
          <EventCard
            event={nextEvent}
            colors={colors}
            isDarkMode={isDarkMode}
            onViewDetails={showEventDetails}
          />
        </motion.div>

        {/* Estado de mesas */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <TablesStatus
            available={availableTables}
            total={tables.length}
            colors={colors}
            isDarkMode={isDarkMode}
          />
        </motion.div>
      </div>

      {/* Modal de detalles del evento */}
      <Modal show={showEventModal} onClose={() => setShowEventModal(false)} size="lg">
        <Modal.Header>
          Detalles del Evento
        </Modal.Header>
        <Modal.Body>
          {selectedEvent ? (
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold dark:text-white">{selectedEvent.eventName}</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {selectedEvent.description || 'Sin descripción'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold dark:text-white">Fecha:</p>
                  <p className="text-gray-600 dark:text-gray-300">
                    {new Date(selectedEvent.eventDate).toLocaleDateString('es-PE', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>

                {selectedEvent.startTime && (
                  <div>
                    <p className="font-semibold dark:text-white">Hora:</p>
                    <p className="text-gray-600 dark:text-gray-300">{selectedEvent.startTime}</p>
                  </div>
                )}

                <div>
                  <p className="font-semibold dark:text-white">Recaudado:</p>
                  <p className="text-gray-600 dark:text-gray-300">
                    {selectedEvent.budget ? `S/. ${selectedEvent.budget.toLocaleString('es-PE')}` : 'No especificado'}
                  </p>
                </div>

                <div>
                  <p className="font-semibold dark:text-white">Invitado:</p>
                  <p className="text-gray-600 dark:text-gray-300">
                    {selectedEvent.entertainer || 'No especificado'}
                  </p>
                </div>
              </div>

              {selectedEvent.ticketPrice && (
                <div>
                  <p className="font-semibold dark:text-white">Precio del ticket:</p>
                  <p className="text-gray-600 dark:text-gray-300">
                    {`S/. ${selectedEvent.ticketPrice.toLocaleString('es-PE')}`}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-300">No hay información del evento disponible</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShowEventModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

// Componente de tarjeta de estadísticas mejorado
function StatCard({ icon, title, value, change, color, loading }) {
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
    yellow: {
      bg: 'bg-yellow-100 dark:bg-yellow-900',
      text: 'text-yellow-800 dark:text-yellow-200',
      iconBg: 'bg-yellow-200 dark:bg-yellow-800'
    },
    purple: {
      bg: 'bg-purple-100 dark:bg-purple-900',
      text: 'text-purple-800 dark:text-purple-200',
      iconBg: 'bg-purple-200 dark:bg-purple-800'
    },
    indigo: {
      bg: 'bg-indigo-100 dark:bg-indigo-900',
      text: 'text-indigo-800 dark:text-indigo-200',
      iconBg: 'bg-indigo-200 dark:bg-indigo-800'
    },
    pink: {
      bg: 'bg-pink-100 dark:bg-pink-900',
      text: 'text-pink-800 dark:text-pink-200',
      iconBg: 'bg-pink-200 dark:bg-pink-800'
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
          <p className="text-xs mt-2 opacity-80">
            {loading ? 'Cargando...' : change}
          </p>
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color].iconBg} self-center`}>
          {icon}
        </div>
      </div>
    </Card>
  );
}

// Componente de tarjeta de evento mejorado
function EventCard({ event, colors, isDarkMode, onViewDetails }) {
  return (
    <Card className="h-full" style={{ backgroundColor: isDarkMode ? colors.background : '#ffffff' }}>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-bold dark:text-gray-600">Próximo Evento</h2>
        <FaCalendarAlt className="text-2xl" style={{ color: colors.primary }} />
      </div>

      {event ? (
        <>
          <h3 className="text-lg font-semibold mb-1 dark:text-gray-600">{event.eventName}</h3>
          <p className="text-gray-600 dark:text-gray-600 mb-2">
            <span className="font-medium">Fecha:</span> {new Date(event.eventDate).toLocaleDateString('es-PE')}
          </p>
          {event.startTime && (
            <p className="text-gray-600 dark:text-gray-600 mb-2">
              <span className="font-medium">Hora:</span> {event.startTime}
            </p>
          )}
          <p className="text-gray-600 dark:text-gray-600 truncate">
            <span className="font-medium">Invitado:</span> {event.entertainer || 'No especificado'}
          </p>

          <Button
            onClick={() => onViewDetails(event)}
            className="mt-4"
            style={{ backgroundColor: colors.primary, color: '#ffffff' }}
          >
            Ver detalles
          </Button>
        </>
      ) : (
        <div className="text-center py-4">
          <p className="text-gray-500 dark:text-gray-600">No hay eventos próximos</p>
        </div>
      )}
    </Card>
  );
}

// Componente de estado de mesas mejorado
function TablesStatus({ available, total, colors, isDarkMode }) {
  const percentage = total > 0 ? Math.round((available / total) * 100) : 0;

  return (
    <Card className="h-full" style={{ backgroundColor: isDarkMode ? colors.background : '#ffffff' }}>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-bold dark:text-gray-600">Estado de Mesas</h2>
        <FaTable className="text-2xl" style={{ color: colors.primary }} />
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <div className="flex justify-between mb-2">
            <span className="font-medium dark:text-gray-600">Disponibles</span>
            <span className="font-bold" style={{ color: colors.primary }}>{available}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium dark:text-gray-600">Total</span>
            <span className="font-bold dark:text-gray-600">{total}</span>
          </div>

          <div className="mt-6">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              {total > 0 && (
                <div
                  className="h-2.5 rounded-full"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: colors.primary
                  }}
                ></div>
              )}
            </div>
            <p className="text-sm text-right mt-1 text-gray-600 dark:text-gray-600">
              {total > 0 ? `${percentage}% disponibles` : 'No hay mesas disponibles'}
            </p>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="relative w-32 h-32 mb-4">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke={isDarkMode ? '#374151' : '#e5e7eb'}
                strokeWidth="3"
              />
              {total > 0 && (
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke={colors.primary}
                  strokeWidth="3"
                  strokeDasharray={`${percentage}, 100`}
                />
              )}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-bold" style={{ color: colors.primary }}>
                {total > 0 ? `${percentage}%` : '0%'}
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-600">
            {total > 0 ? 'Mesas disponibles' : 'No hay mesas'}
          </p>
        </div>
      </div>
    </Card>
  );
}