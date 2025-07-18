

import React, { useState, useEffect } from 'react';
import { Table, Card, Button } from "flowbite-react";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Swal from 'sweetalert2';
import CafeandEvent from '/src/image/logo.jpg';

const MonthlyProfit = () => {
  // Estados para los gastos
  const [expenses, setExpenses] = useState({
    electricity: 0,
    water: 0,
    telephone: 0,
    internet: 0,
    insurance: 0,
    otherExpenses: 0,
  });

  // Estados para los datos financieros
  const [billTypeAmounts, setBillTypeAmounts] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalMonthlySalary, setTotalMonthlySalary] = useState(0);
  const [totalEventBudgetforMonth, setTotalEventBudgetforMonth] = useState(0);
  const [totalInventoryPurchasesForMonth, setTotalInventoryPurchasesForMonth] = useState(0);
  const [salesRevenue, setSalesRevenue] = useState(0);
  const [eventRevenue, setEventRevenue] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [tax, setTax] = useState(0);
  const [netProfit, setNetProfit] = useState(0);

  // Estados para datos del mes anterior
  const [previousMonthTotalIncome, setPreviousMonthTotalIncome] = useState(0);
  const [previousMonthTotalExpenses, setPreviousMonthTotalExpenses] = useState(0);
  const [previousMonthNetProfit, setPreviousMonthNetProfit] = useState(0);

  // Obtener mes y año actual
  const currentMonth = new Date().toLocaleString('es-PE', { month: 'long' });
  const currentYear = new Date().getFullYear();
  const previousMonth = new Date().getMonth();

  // Efectos para cargar datos y calcular valores
  useEffect(() => {
    // Cargar todos los datos necesarios
    const loadData = async () => {
      try {
        await Promise.all([
          fetchMonthlyExpenses(),
          fetchBillTypeAmounts(),
          fetchMonthlySalesRevenue(),
          fetchEventRevenue(),
          fetchMonthlySalary(),
          fetchTotalEventBudgeforMonth(),
          fetchTotalInventoryPurchasesForMonth(),
          fetchPreviousMonthData()
        ]);
      } catch (error) {
        console.error("Error al cargar datos:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al cargar los datos',
          footer: error.message
        });
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    // Calcular todos los valores financieros
    calculateFinancials();
  }, [billTypeAmounts, salesRevenue, eventRevenue, totalMonthlySalary,
    totalEventBudgetforMonth, totalInventoryPurchasesForMonth]);

  // Función para calcular todos los valores financieros
  const calculateFinancials = () => {
    calculateTotalRevenue();
    calculateTotalExpenses();
    calculateTotalIncome();
    calculateTax();
    calculateNetProfit();
  };

  // Función para obtener gastos mensuales
  const fetchMonthlyExpenses = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/payment/current-month`);
      if (!response.ok) throw new Error('Error al obtener gastos mensuales');
      const data = await response.json();
      setExpenses(data);
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar los gastos mensuales',
        footer: error.message
      });
    }
  };

  // Función para obtener importes por tipo de factura
  const fetchBillTypeAmounts = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/payment/current-month`);
      if (!response.ok) throw new Error('Error al obtener tipos de factura');

      const data = await response.json();
      const translatedData = data.map(item => {
        const types = {
          'Electricity Bill': 'Luz Eléctrica',
          'Telephone Bill': 'Teléfono',
          'Water Bill': 'Agua',
          'Internet Bill': 'Internet',
          'Insurance Bill': 'Seguro'
        };

        return {
          ...item,
          billType: types[item.billType] || item.billType
        };
      });

      setBillTypeAmounts(translatedData);
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar los tipos de factura',
        footer: error.message
      });
    }
  };

  // Función para obtener salarios mensuales
  const fetchMonthlySalary = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/salary/getTotalGrossPaymentForCurrentMonth`);
      if (!response.ok) throw new Error('Error al obtener salarios');

      const text = await response.text();
      const totalSalary = text ? JSON.parse(text) : 0;
      setTotalMonthlySalary(totalSalary);
    } catch (error) {
      console.error('Error:', error);
      setTotalMonthlySalary(0);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar los salarios',
        footer: error.message
      });
    }
  };

  // Función para obtener presupuesto de eventos
  const fetchTotalEventBudgeforMonth = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/events/monthly-total-budget`);
      if (!response.ok) throw new Error('Error al obtener presupuesto de eventos');

      const text = await response.text();
      const totalBudget = text ? JSON.parse(text) : 0;
      setTotalEventBudgetforMonth(totalBudget);
    } catch (error) {
      console.error('Error:', error);
      setTotalEventBudgetforMonth(0);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar los presupuestos de eventos',
        // footer: error.message
      });
    }
  };

  // Función para obtener compras de inventario (con manejo robusto de errores)
  const fetchTotalInventoryPurchasesForMonth = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/inventory/total-price/month`);
      if (!response.ok) throw new Error('Error al obtener compras de inventario');

      const text = await response.text();
      const totalPurchases = text ? JSON.parse(text) : 0;
      setTotalInventoryPurchasesForMonth(totalPurchases);
    } catch (error) {
      console.error('Error:', error);
      setTotalInventoryPurchasesForMonth(0);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar las compras de inventario',
        footer: error.message
      });
    }
  };

  // Función para obtener ingresos por ventas
  const fetchMonthlySalesRevenue = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/orders/monthly-sales-revenue`);
      if (!response.ok) throw new Error('Error al obtener ingresos por ventas');

      const salesRevenue = await response.json();
      setSalesRevenue(salesRevenue);
    } catch (error) {
      console.error('Error:', error);
      setSalesRevenue(0);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar los ingresos por ventas',
        footer: error.message
      });
    }
  };

  // Función para obtener ingresos por eventos
  const fetchEventRevenue = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/events/monthly-total-revenue`);
      if (!response.ok) throw new Error('Error al obtener ingresos de eventos');

      const eventRevenue = await response.json();
      setEventRevenue(eventRevenue);
    } catch (error) {
      console.error('Error:', error);
      setEventRevenue(0);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar los ingresos de eventos',
        footer: error.message
      });
    }
  };

  // Función para obtener datos del mes anterior
  const fetchPreviousMonthData = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/income/previous-month/${previousMonth}`);
      if (!response.ok) throw new Error('Error al obtener datos del mes anterior');

      const data = await response.json();
      setPreviousMonthTotalIncome(data.totalIncome || 0);
      setPreviousMonthTotalExpenses(data.totalExpenses || 0);
      setPreviousMonthNetProfit(data.netProfit || 0);
    } catch (error) {
      console.error('Error:', error);
      setPreviousMonthTotalIncome(0);
      setPreviousMonthTotalExpenses(0);
      setPreviousMonthNetProfit(0);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar los datos del mes anterior',
        footer: error.message
      });
    }
  };

  // Funciones de cálculo
  const calculateTotalRevenue = () => {
    const totalRev = (salesRevenue || 0) + (eventRevenue || 0);
    setTotalRevenue(totalRev);
  };

  const calculateTotalExpenses = () => {
    const servicesTotal = billTypeAmounts.reduce((acc, item) => acc + (item.totalAmount || 0), 0);
    const totalEx = servicesTotal +
      (totalMonthlySalary || 0) +
      (totalEventBudgetforMonth || 0) +
      (totalInventoryPurchasesForMonth || 0);
    setTotalExpenses(totalEx);
  };

  const calculateTotalIncome = () => {
    const totalIn = (totalRevenue || 0) - (totalExpenses || 0);
    setTotalIncome(totalIn);
  };

  const calculateTax = () => {
    const taxAmount = (totalIncome > 0) ? totalIncome * 0.18 : 0;
    setTax(taxAmount);
  };

  const calculateNetProfit = () => {
    const net = (totalIncome || 0) - (tax || 0);
    setNetProfit(net);
  };

  // Función para guardar el reporte en el backend
  const sendReportDataToBackend = async () => {
    try {
      const reportData = {
        date: new Date().toISOString(),
        netProfit: netProfit,
        totalIncome: totalIncome,
        totalExpenses: totalExpenses
      };

      const response = await fetch(`http://localhost:8080/api/income/save-monthly`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reportData)
      });

      if (!response.ok) throw new Error('Error al guardar el reporte');

      await Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'Reporte guardado correctamente',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo guardar el reporte',
        footer: error.message
      });
    }
  };

  // Función para generar y descargar PDF
  const handleDownloadPDF = () => {
    // Download PDF of the annual statement
    const inputElement = document.getElementById('monthly-report'); // Element to capture

    inputElement.style.width = '800px'; // Set a fixed width
    inputElement.style.height = 'auto'; // Set auto height to maintain aspect ratio

    html2canvas(inputElement, {
      scale: 3, // Increase scale to improve quality (default is 1)
      useCORS: true // Ensures cross-origin images are handled properly
    }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png'); // Convert canvas to image data
      const pdf = new jsPDF('p', 'mm', 'a4'); // Create new PDF document (portrait mode, millimeters, A4 size)

      const imgWidth = 210; // A4 width in mm
      const imgHeight = canvas.height * imgWidth / canvas.width; // Calculate image height based on aspect ratio

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight); // Add image to PDF

      pdf.save('Monthly Income Statement.pdf'); // Save PDF with filename
    });
    sendReportDataToBackend(); // Send report data to the backend
  };

  // Renderizado del componente
  return (
    <div className="w-full pt-10 px-4">
      {/* Encabezado */}
      <div className='flex flex-col md:flex-row'>
        <div className="w-full md:w-1/2 pl-5">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Estado de Ingresos y Gastos Mensual</h1>
          <br />
        </div>
        <div className="w-full md:w-1/2 flex justify-end pr-5">
          <Button onClick={handleDownloadPDF} className="hover:bg-green-700 text-white font-bold mb-5 rounded">
            Guardar datos
          </Button>
        </div>
      </div>
      <hr />
      <br />

      {/* Tarjetas resumen */}
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-4 justify-center">
        <Card className="w-full md:max-w-xs flex-1 bg-green-500 text-white dark:bg-green-500">
          <h5 className="text-l font-bold dark:text-white">
            Ingresos Totales <br />
            S/. {totalIncome.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/,/g, ' ')}
          </h5>
          <p className='dark:text-gray-200'>
            Mes anterior: S/. {previousMonthTotalIncome.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/,/g, ' ')}
          </p>
        </Card>
        <Card className="w-full md:max-w-xs flex-1 bg-red-500 text-white dark:bg-red-500">
          <h5 className="text-l font-bold dark:text-white">
            Gastos Totales <br />
            S/. {totalExpenses.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/,/g, ' ')}
          </h5>
          <p className='dark:text-gray-200'>
            Mes anterior: S/. {previousMonthTotalExpenses.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/,/g, ' ')}
          </p>
        </Card>
        <Card className="w-full md:max-w-xs flex-1 bg-blue-500 text-white dark:bg-blue-500">
          <h5 className="text-l font-bold dark:text-white">
            Ganancia Neta <br />
            S/. {netProfit.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/,/g, ' ')}
          </h5>
          <p className='dark:text-gray-200'>
            Mes anterior: S/. {previousMonthNetProfit.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/,/g, ' ')}
          </p>
        </Card>
      </div>

      {/* Reporte detallado */}
      <div id="monthly-report" className="overflow-x-auto w-full lg:w-4/5 mx-auto p-2 lg:p-5">
        <div className="inline-block border w-full">
          {/* Encabezado del reporte */}
          <div className='flex flex-col md:flex-row p-4 dark:bg-gray-800 dark:text-white'>
            <div className='w-full'>
              <h1 className='font-bold text-left md:text-right text-xl dark:text-white dark:bg-gray-800'>
                Estado de Ingresos y Gastos Mensual
              </h1>
              <h2 className='font-semibold text-left md:text-right'>
                Para el mes de {currentMonth} {currentYear}
              </h2>
            </div>
          </div>

          {/* Tabla de datos */}
          <Table hoverable className='w-full'>
            <Table.Body className='divide-y'>
              {/* Sección de INGRESOS */}
              <Table.Row className="bg-white text-black dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell className='bg-orange-600 text-white font-semibold' colSpan="3">INGRESOS</Table.Cell>
              </Table.Row>
              <Table.Row className="bg-white text-black dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                <Table.Cell>Ingresos por ventas</Table.Cell>
                <Table.Cell className='pr-2 text-right'>
                  {salesRevenue.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/,/g, ' ')}
                </Table.Cell>
                <Table.Cell></Table.Cell>
              </Table.Row>
              <Table.Row className="bg-white text-black dark:bg-gray-800 dark:text-white">
                <Table.Cell>Ingresos del evento</Table.Cell>
                <Table.Cell className='pr-2 text-right'>
                  {eventRevenue.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/,/g, ' ')}
                </Table.Cell>
                <Table.Cell></Table.Cell>
              </Table.Row>
              <Table.Row className='border-t-2 text-blue-700 dark:text-blue-300'>
                <Table.Cell className="font-semibold"> INGRESOS TOTALES</Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell className='pr-2 text-right font-semibold'>
                  {totalRevenue.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/,/g, ' ')}
                </Table.Cell>
              </Table.Row>

              {/* Sección de GASTOS */}
              <Table.Row className=''>
                <Table.Cell className='bg-orange-600 text-white font-semibold' colSpan="3">GASTOS</Table.Cell>
              </Table.Row>
              {billTypeAmounts.map((item, index) => (
                <Table.Row key={index} className="bg-white text-black dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                  <Table.Cell>{item.billType}</Table.Cell>
                  <Table.Cell className='pr-2 text-right'>
                    {item.totalAmount.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/,/g, ' ')}
                  </Table.Cell>
                  <Table.Cell></Table.Cell>
                </Table.Row>
              ))}
              <Table.Row className="bg-white text-black dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                <Table.Cell>Salarios de los empleados</Table.Cell>
                <Table.Cell className='pr-2 text-right'>
                  {totalMonthlySalary.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/,/g, ' ')}
                </Table.Cell>
                <Table.Cell></Table.Cell>
              </Table.Row>
              <Table.Row className="bg-white text-black dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                <Table.Cell>Monto recaudado de eventos</Table.Cell>
                <Table.Cell className='pr-2 text-right'>
                  {totalEventBudgetforMonth.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/,/g, ' ')}
                </Table.Cell>
                <Table.Cell></Table.Cell>
              </Table.Row>
              <Table.Row className="bg-white text-black dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                <Table.Cell>Compras de artículos de inventario</Table.Cell>
                <Table.Cell className='pr-2 text-right'>
                  {totalInventoryPurchasesForMonth.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/,/g, ' ')}
                </Table.Cell>
                <Table.Cell></Table.Cell>
              </Table.Row>
              <Table.Row className='border-t-2 border-b-2 font-semibold text-red-700 dark:text-red-400'>
                <Table.Cell className=""> GASTOS TOTALES</Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell className='pr-2 text-right'>
                  {totalExpenses.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/,/g, ' ')}
                </Table.Cell>
              </Table.Row>

              {/* Sección de RESUMEN FINAL */}
              <Table.Row className='border-t-2 font-semibold text-green-700 dark:text-green-400'>
                <Table.Cell>INGRESOS TOTALES</Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell className="pr-2 text-right">
                  {totalIncome.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/,/g, ' ')}
                </Table.Cell>
              </Table.Row>
              <Table.Row className="bg-white text-black dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                <Table.Cell>Impuestos (IGV 18%)</Table.Cell>
                <Table.Cell className='pr-2 text-right'>
                  {tax.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/,/g, ' ')}
                </Table.Cell>
                <Table.Cell></Table.Cell>
              </Table.Row>
              <Table.Row className='border-t-2 font-semibold text-orange-700'>
                <Table.Cell className='bg-orange-600 text-white font-semibold'>GANANCIA/PÉRDIDA NETA</Table.Cell>
                <Table.Cell className='bg-orange-600'></Table.Cell>
                <Table.Cell className="pr-2 text-right bg-orange-600 text-white">
                  {netProfit.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/,/g, ' ')}
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>

          {/* Explicación de cálculos */}
          <div className="p-4 text-sm text-gray-600 dark:text-white dark:bg-gray-800">
            <p className="font-semibold">Cómo se calcula cada valor:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                <strong>Ingresos Totales:</strong> Ventas (S/. {salesRevenue.toLocaleString('es-PE')}) +
                Eventos (S/. {eventRevenue.toLocaleString('es-PE')})
              </li>
              <li>
                <strong>Gastos Totales:</strong> Servicios (S/. {billTypeAmounts.reduce((acc, item) => acc + item.totalAmount, 0).toLocaleString('es-PE')}) +
                Salarios (S/. {totalMonthlySalary.toLocaleString('es-PE')}) +
                Presupuesto Eventos (S/. {totalEventBudgetforMonth.toLocaleString('es-PE')}) +
                Inventario (S/. {totalInventoryPurchasesForMonth.toLocaleString('es-PE')})
              </li>
              <li>
                <strong>Ingresos Netos:</strong> Ingresos Totales (S/. {totalRevenue.toLocaleString('es-PE')}) -
                Gastos Totales (S/. {totalExpenses.toLocaleString('es-PE')})
              </li>
              <li>
                <strong>Impuestos:</strong> 18% de los Ingresos Netos (S/. {tax.toLocaleString('es-PE')})
              </li>
              <li>
                <strong>Ganancia Neta:</strong> Ingresos Netos (S/. {totalIncome.toLocaleString('es-PE')}) -
                Impuestos (S/. {tax.toLocaleString('es-PE')})
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyProfit;