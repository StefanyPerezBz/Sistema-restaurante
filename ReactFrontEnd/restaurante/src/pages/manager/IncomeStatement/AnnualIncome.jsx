


import React, { useState, useEffect } from 'react';
import { Table, Card, Button } from "flowbite-react";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Swal from 'sweetalert2';
import CafeandEvent from '/src/image/logo.jpg';

const AnnualIncome = () => {
  const [expenses, setExpenses] = useState({
    electricity: 0,
    water: 0,
    telephone: 0,
    internet: 0,
    insurance: 0,
    otherExpenses: 0,
  });
  const [billTypeAmounts, setBillTypeAmounts] = useState([]);
  const [totalAnnualExpenses, setTotalAnnualExpenses] = useState(0);
  const [totalAnnualSalary, setTotalAnnualSalary] = useState(0);
  const [totalEventBudgetforYear, setTotalEventBudgetforYear] = useState(0);
  const [totalInventoryPurchasesForYear, setTotalInventoryPurchasesForYear] = useState(0);
  const [salesRevenue, setSalesRevenue] = useState(0);
  const [eventRevenue, setEventRevenue] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [tax, setTax] = useState(0);
  const [netProfit, setNetProfit] = useState(0);
  const currentYear = new Date().getFullYear();

  const [previousYearTotalIncome, setPreviousYearTotalIncome] = useState(0);
  const [previousYearTotalExpenses, setPreviousYearTotalExpenses] = useState(0);
  const [previousYearNetProfit, setPreviousYearNetProfit] = useState(0);
  const previousYear = currentYear - 1;

  useEffect(() => {
    fetchAnnualExpenses();
    fetchBillTypeAmounts();
    fetchAnnualSalesRevenue();
    fetchEventRevenue();
    fetchAnnualSalary();
    fetchTotalEventBudgetforYear();
    fetchTotalInventoryPurchasesForYear();
    fetchPreviousYearData();
  }, []);

  useEffect(() => {
    calculateTotalAnnualRevenue();
    calculateTotalAnnualExpenses();
    calculateTotalAnnualIncome();
    calculateTax();
    calculateNetProfit();
  }, [billTypeAmounts, salesRevenue, eventRevenue, totalAnnualExpenses, totalRevenue, totalIncome, tax, totalAnnualSalary, totalEventBudgetforYear, totalInventoryPurchasesForYear]);

  const fetchAnnualExpenses = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/payment/current-year`);
      if (!response.ok) {
        throw new Error('No se pudieron obtener los datos');
      }
      const data = await response.json();
      setExpenses(data);
    } catch (error) {
      console.error('Error fetching data:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar los gastos anuales',
      });
    }
  };

  const fetchBillTypeAmounts = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/payment/current-year`);
      if (!response.ok) {
        throw new Error('No se pudieron obtener los datos');
      }
      const data = await response.json();

      // Traducir los nombres de los tipos de factura
      const translatedData = data.map(item => {
        let translatedType = item.billType;
        if (item.billType === 'Electricity Bill') translatedType = 'Luz Eléctrica';
        if (item.billType === 'Telephone Bill') translatedType = 'Teléfono';
        if (item.billType === 'Water Bill') translatedType = 'Agua';
        if (item.billType === 'Internet Bill') translatedType = 'Internet';
        if (item.billType === 'Insurance Bill') translatedType = 'Seguro';

        return {
          ...item,
          billType: translatedType
        };
      });

      setBillTypeAmounts(translatedData);
    } catch (error) {
      console.error('Error al obtener los importes del tipo de factura:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar los tipos de factura',
        footer: error.message
      });
    }
  };

  const fetchAnnualSalary = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/salary/getTotalGrossPaymentForCurrentYear`);
      if (!response.ok) {
        throw new Error('No se pudo obtener el salario anual');
      }
      const annualSalary = await response.json();
      setTotalAnnualSalary(annualSalary);
    } catch (error) {
      console.error('Error al obtener el salario anual:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar los salarios anuales',
        footer: error.message
      });
    }
  };

  const fetchTotalEventBudgetforYear = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/events/annual-total-budget`);
      if (!response.ok) {
        throw new Error('No se pudo obtener el presupuesto anual de eventos');
      }
      const totalBudget = await response.json();
      setTotalEventBudgetforYear(totalBudget);
    } catch (error) {
      console.error('Error al obtener el presupuesto anual de eventos:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar los presupuestos de eventos',
        footer: error.message
      });
    }
  };

  const fetchTotalInventoryPurchasesForYear = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/inventory/total-price/year`);
      if (!response.ok) {
        throw new Error('No se pudo obtener el total de compras de inventario anual');
      }
      const totalPurchases = await response.json();
      setTotalInventoryPurchasesForYear(totalPurchases);
    } catch (error) {
      console.error('Error al obtener las compras anuales de inventario:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar las compras de inventario',
        footer: error.message
      });
    }
  };

  const fetchAnnualSalesRevenue = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/orders/annaul-sales-revenue`);
      if (!response.ok) {
        throw new Error('No se pudieron obtener ingresos anuales por ventas');
      }
      const salesRevenue = await response.json();
      setSalesRevenue(salesRevenue);
    } catch (error) {
      console.error('Error al obtener los ingresos anuales por ventas:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar los ingresos por ventas',
        footer: error.message
      });
    }
  };

  const fetchEventRevenue = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/events/annual-total-revenue`);
      if (!response.ok) {
        throw new Error('No se pudieron obtener los ingresos anuales de eventos');
      }
      const eventRevenue = await response.json();
      setEventRevenue(eventRevenue);
    } catch (error) {
      console.error('Error al obtener los ingresos anuales de eventos:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar los ingresos de eventos',
        // footer: error.message
      });
    }
  };

  const fetchPreviousYearData = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/income/previous-year/${previousYear}`);
      if (!response.ok) {
        throw new Error('No se pudieron obtener los datos del año anterior');
      }
      const data = await response.json();
      setPreviousYearTotalIncome(data.totalIncome);
      setPreviousYearTotalExpenses(data.totalExpenses);
      setPreviousYearNetProfit(data.netProfit);
    } catch (error) {
      console.error('Error al obtener los datos del año anterior:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar los datos del año anterior',
        footer: error.message
      });
    }
  };

  //send data to database
  const sendReportDataToBackend = async () => {
    try {
      const reportData = {
        year: currentYear,
        netProfit: netProfit,
        totalIncome: totalIncome,
        totalExpenses: totalAnnualExpenses
      };

      const response = await fetch(`http://localhost:8080/api/income/save-annual`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reportData)
      });

      if (!response.ok) {
        throw new Error('No se pudieron guardar los datos del informe anual');
      }

      await Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'Los datos del informe anual se guardaron correctamente',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error al guardar los datos del informe anual:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron guardar los datos del informe anual',
        footer: error.message
      });
    }
  };

  const calculateTotalAnnualRevenue = () => {
    const totalRev = salesRevenue + eventRevenue;
    setTotalRevenue(totalRev);
  };

  const calculateTotalAnnualExpenses = () => {
    const totalEx = billTypeAmounts.reduce((accumulator, item) => {
      return accumulator + item.totalAmount;
    }, 0);
    const totalExpenses = totalEx + totalAnnualSalary + totalEventBudgetforYear + totalInventoryPurchasesForYear;
    setTotalAnnualExpenses(totalExpenses);
  };

  const calculateTotalAnnualIncome = () => {
    const totalIn = totalRevenue - totalAnnualExpenses;
    setTotalIncome(totalIn);
  };

  const calculateTax = () => {
    if (totalIncome > 0) {
      const taxAmount = totalIncome * 0.18; // IGV general es 18%
      setTax(taxAmount);
    } else {
      setTax(0);
    }
  };

  const calculateNetProfit = () => {
    const net = totalIncome - tax;
    setNetProfit(net);
  };

  const handleDownloadPDF = () => {
    // Download PDF of the annual statement
    const inputElement = document.getElementById('annual-report'); // Element to capture

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

      pdf.save('Annual Income Statement.pdf'); // Save PDF with filename
    });

    sendReportDataToBackend(); // Send report data to backend
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-PE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value).replace(/,/g, ' ');
  };

  return (
    <div className="w-full pt-10 px-4">
      <div className='flex flex-col md:flex-row'>
        <div className="w-full md:w-1/2 pl-5">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Estado Anual de Pérdidas y Ganancias</h1> <br />
        </div>
        <div className=" w-1/2 flex justify-end pr-5">
          <Button onClick={handleDownloadPDF} className=" hover:bg-green-700 text-white font-bold mb-5 rounded">Guardar datos</Button>
        </div>
      </div>
      <hr />
      <br />

      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-4 justify-center">
        <Card className="w-full md:max-w-xs flex-1 bg-green-500 text-white dark:bg-green-500">
          <h5 className="text-l font-bold dark:text-white">
            Ingresos Totales <br />
            S/. {formatCurrency(totalIncome)}
          </h5>
          <p className='dark:text-gray-200'>
            Año anterior: S/. {formatCurrency(previousYearTotalIncome)}
          </p>
        </Card>
        <Card className="w-full md:max-w-xs flex-1 bg-red-500 text-white dark:bg-red-500">
          <h5 className="text-l font-bold dark:text-white">
            Gastos Totales <br />
            S/. {formatCurrency(totalAnnualExpenses)}
          </h5>
          <p className='dark:text-gray-200'>
            Año anterior: S/. {formatCurrency(previousYearTotalExpenses)}
          </p>
        </Card>
        <Card className="w-full md:max-w-xs flex-1 bg-blue-500 text-white dark:bg-blue-500">
          <h5 className="text-l font-bold dark:text-white">
            Beneficio Neto <br />
            S/. {formatCurrency(netProfit)}
          </h5>
          <p className='dark:text-gray-200'>
            Año anterior: S/. {formatCurrency(previousYearNetProfit)}
          </p>
        </Card>
      </div>

      <div id="annual-report" className="overflow-x-auto w-full lg:w-4/5 mx-auto p-2 lg:p-5">
        <div className="inline-block border w-full">
          <div className='flex flex-col md:flex-row p-4 dark:bg-gray-800 dark:text-white'>
            <div className='w-full'>
              <h1 className='font-bold text-left md:text-right text-xl dark:text-white dark:bg-gray-800'>
                Estado Anual de Pérdidas y Ganancias
              </h1>
              <h2 className='font-semibold text-left md:text-right'>
                Para el año {currentYear}
              </h2>
            </div>
          </div>

          <Table hoverable className='w-full'>
            <Table.Body className='divide-y'>
              {/* INGRESOS */}
              <Table.Row className="bg-white text-black dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell className='bg-orange-600 text-white font-semibold' colSpan="3">INGRESOS</Table.Cell>
              </Table.Row>
              <Table.Row className="bg-white text-black dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                <Table.Cell>Ingresos por ventas</Table.Cell>
                <Table.Cell className='pr-2 text-right'>{formatCurrency(salesRevenue)}</Table.Cell>
                <Table.Cell></Table.Cell>
              </Table.Row>
              <Table.Row className="bg-white text-black dark:bg-gray-800 dark:text-white">
                <Table.Cell>Ingresos de eventos</Table.Cell>
                <Table.Cell className='pr-2 text-right'>{formatCurrency(eventRevenue)}</Table.Cell>
                <Table.Cell></Table.Cell>
              </Table.Row>
              <Table.Row className='border-t-2 text-blue-700 dark:text-blue-300'>
                <Table.Cell className="font-semibold">INGRESOS TOTALES</Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell className='pr-2 text-right font-semibold'>{formatCurrency(totalRevenue)}</Table.Cell>
              </Table.Row>

              {/* GASTOS */}
              <Table.Row className=''>
                <Table.Cell className='bg-orange-600 text-white font-semibold' colSpan="3">GASTOS</Table.Cell>
              </Table.Row>
              {billTypeAmounts.map((item, index) => (
                <Table.Row key={index} className="bg-white text-black dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                  <Table.Cell>{item.billType}</Table.Cell>
                  <Table.Cell className='pr-2 text-right'>{formatCurrency(item.totalAmount)}</Table.Cell>
                  <Table.Cell></Table.Cell>
                </Table.Row>
              ))}
              <Table.Row className="bg-white text-black dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                <Table.Cell>Salarios de empleados</Table.Cell>
                <Table.Cell className='pr-2 text-right'>{formatCurrency(totalAnnualSalary)}</Table.Cell>
                <Table.Cell></Table.Cell>
              </Table.Row>
              <Table.Row className="bg-white text-black dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                <Table.Cell>Monto recaudado de eventos</Table.Cell>
                <Table.Cell className='pr-2 text-right'>{formatCurrency(totalEventBudgetforYear)}</Table.Cell>
                <Table.Cell></Table.Cell>
              </Table.Row>
              <Table.Row className="bg-white text-black dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                <Table.Cell>Compras de inventario</Table.Cell>
                <Table.Cell className='pr-2 text-right'>{formatCurrency(totalInventoryPurchasesForYear)}</Table.Cell>
                <Table.Cell></Table.Cell>
              </Table.Row>
              <Table.Row className='border-t-2 border-b-2 font-semibold text-red-700 dark:text-red-400'>
                <Table.Cell className="">GASTOS TOTALES</Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell className='pr-2 text-right'>{formatCurrency(totalAnnualExpenses)}</Table.Cell>
              </Table.Row>

              {/* RESUMEN FINAL */}
              <Table.Row className='border-t-2 font-semibold text-green-700 dark:text-green-400'>
                <Table.Cell>INGRESOS NETOS</Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell className="pr-2 text-right">{formatCurrency(totalIncome)}</Table.Cell>
              </Table.Row>
              <Table.Row className="bg-white text-black dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                <Table.Cell>Impuestos (IGV 18%)</Table.Cell>
                <Table.Cell className='pr-2 text-right'>{formatCurrency(tax)}</Table.Cell>
                <Table.Cell></Table.Cell>
              </Table.Row>
              <Table.Row className='border-t-2 font-semibold text-orange-700'>
                <Table.Cell className='bg-orange-600 text-white font-semibold'>GANANCIA/PÉRDIDA NETA</Table.Cell>
                <Table.Cell className='bg-orange-600'></Table.Cell>
                <Table.Cell className="pr-2 text-right bg-orange-600 text-white">{formatCurrency(netProfit)}</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>

          {/* Explicación de cálculos */}
          <div className="p-4 text-sm text-gray-600 dark:text-white dark:bg-gray-800">
            <p className="font-semibold">Cómo se calcula cada valor:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Ingresos Totales:</strong> Ventas (S/. {formatCurrency(salesRevenue)}) + Eventos (S/. {formatCurrency(eventRevenue)})</li>
              <li><strong>Gastos Totales:</strong> Servicios (S/. {formatCurrency(billTypeAmounts.reduce((acc, item) => acc + item.totalAmount, 0))}) + Salarios (S/. {formatCurrency(totalAnnualSalary)}) + Presupuesto Eventos (S/. {formatCurrency(totalEventBudgetforYear)}) + Inventario (S/. {formatCurrency(totalInventoryPurchasesForYear)})</li>
              <li><strong>Ingresos Netos:</strong> Ingresos Totales (S/. {formatCurrency(totalRevenue)}) - Gastos Totales (S/. {formatCurrency(totalAnnualExpenses)})</li>
              <li><strong>Impuestos:</strong> 18% de los Ingresos Netos (S/. {formatCurrency(tax)})</li>
              <li><strong>Beneficio Neto:</strong> Ingresos Netos (S/. {formatCurrency(totalIncome)}) - Impuestos (S/. {formatCurrency(tax)})</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnnualIncome;