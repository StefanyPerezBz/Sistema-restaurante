import React, { useState, useEffect } from 'react';
import { Table, Card, Button } from "flowbite-react";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import CafeandEvent from '/src/image/CafeandEvent.png';

const MonthlyProfit = () => {
  const [expenses, setExpenses] = useState({
    electricity: 0,
    water: 0,
    telephone: 0,
    internet: 0,
    insurance: 0,
    otherExpenses: 0,
  });
  const [billTypeAmounts, setBillTypeAmounts] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState(0);;
  const [totalMonthlySalary, setTotalMonthlySalary] = useState(0);
  const [totalEventBudgetforMonth, setTotalEventBudgetforMonth] = useState(0);
  const [totalInventoryPurchasesForMonth, setTotalInventoryPurchasesForMonth] = useState(0);
  const [salesRevenue, setSalesRevenue] = useState(0);
  const [eventRevenue, setEventRevenue] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [tax, setTax] = useState(0);
  const [netProfit, setNetProfit] = useState(0);
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  const currentYear = new Date().getFullYear();


  // States for previous month data
  const [previousMonthTotalIncome, setPreviousMonthTotalIncome] = useState(0);
  const [previousMonthTotalExpenses, setPreviousMonthTotalExpenses] = useState(0);
  const [previousMonthNetProfit, setPreviousMonthNetProfit] = useState(0);
  const previousMonth = new Date().getMonth();

  useEffect(() => {
    fetchMonthlyExpenses(); // Fetch monthly expenses 
    fetchBillTypeAmounts(); // Fetch bill type amounts
    fetchMonthlySalesRevenue(); // Fetch monthly sales revenue 
    fetchEventRevenue(); // Fetch event revenue 
    fetchMonthlySalary(); // Fetch monthly salary 
    fetchTotalEventBudgeforMonth(); // Fetch total event budgets 
    fetchTotalInventoryPurchasesForMonth(); // Fetch total inventory purchases
    fetchPreviousMonthData(); // Fetch previous month data
  }, []);

  useEffect(() => {
    calculateTotalRevenue(); // Calculate total revenue 
    calculateTotalExpenses(); // Calculate total expenses whenever billTypeAmounts changes
    calculateTotalIncome(); // Calculate total income 
    calculateTax(); // Calculate tax
    calculateNetProfit(); // Calculate net profit
    }, [billTypeAmounts, salesRevenue, eventRevenue, totalExpenses, totalRevenue, totalIncome, tax, totalMonthlySalary, totalEventBudgetforMonth, totalInventoryPurchasesForMonth]);

  // Fetch monthly expenses from the API
  const fetchMonthlyExpenses = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/payment/current-month');
      if (!response.ok) {
        throw new Error('No se pudieron obtener los datos');
      }
      const data = await response.json();
      setExpenses(data);
    } catch (error) {
      console.error('Error al obtener datos:', error);
    }
  };

  // Fetch bill type amounts from the API
  const fetchBillTypeAmounts = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/payment/current-month');
      if (!response.ok) {
        throw new Error('No se pudieron obtener los datos');
      }
      const data = await response.json();
      setBillTypeAmounts(data);
    } catch (error) {
      console.error('Error al obtener los importes del tipo de factura:', error);
    }
  };

   // Fetch monthly salary from the API
  const fetchMonthlySalary = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/salary/getTotalGrossPaymentForCurrentMonth');
      if (!response.ok) {
        throw new Error('No se pudo obtener el salario mensual');
      }
      const totalSalary = await response.json();
      setTotalMonthlySalary(totalSalary);
    } catch (error) {
      console.error('Error al obtener el salario mensual:', error);
    }
  };

   // Fetch monthly event budget from the API
  const fetchTotalEventBudgeforMonth = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/events/monthly-total-budget');
      if (!response.ok) {
        throw new Error('No se pudo obtener el salario mensual');
      }
      const totalBudget = await response.json();
      setTotalEventBudgetforMonth(totalBudget);
    } catch (error) {
      console.error('Error al obtener el salario mensual:', error);
    }
  };

  // Fetch total inventory purchases for the month from the API
  const fetchTotalInventoryPurchasesForMonth = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/inventory/total-price/month');
      if (!response.ok) {
        throw new Error('No se pudo obtener el total de compras de inventario');
      }
      const totalPurchases = await response.json();
      setTotalInventoryPurchasesForMonth(totalPurchases);
    } catch (error) {
      console.error('Error al obtener el total de compras de inventario:', error);
    }
  };


  // Fetch monthly sales revenue from the API
   const fetchMonthlySalesRevenue = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/orders/monthly-sales-revenue');
      if (!response.ok) {
        throw new Error('No se pudieron obtener ingresos por ventas');
      }
      const salesRevenue = await response.json();
      // console.log('Monthly sales revenue data:', salesRevenue);
      setSalesRevenue(salesRevenue);
    } catch (error) {
      console.error('Error al obtener los ingresos por ventas:', error);
    }
  };

  // Fetch event revenue from the API
  const fetchEventRevenue = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/events/monthly-total-revenue');
      if (!response.ok) {
        throw new Error('No se pudieron obtener los ingresos del evento');
      }
      const eventRevenue = await response.json();
      // console.log('Event data:', eventRevenue); // Debugging statement
      setEventRevenue(eventRevenue);
    } catch (error) {
      console.error('Error al obtener los ingresos del evento:', error);
    }
  };

   // Fetch previous month data from the API
  const fetchPreviousMonthData = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/income/previous-month/${previousMonth}`);
      if (!response.ok) {
        throw new Error('No se pudieron obtener los datos del mes anterior');
      }
      const data = await response.json();
      setPreviousMonthTotalIncome(data.totalIncome);
      setPreviousMonthTotalExpenses(data.totalExpenses);
      setPreviousMonthNetProfit(data.netProfit);
    } catch (error) {
      console.error('Error al obtener los datos del mes anterior:', error);
    }
  };


  //send data to database
 const sendReportDataToBackend = () => {
    const reportData = {
      date: new Date().toISOString(),
      netProfit: netProfit,
      totalIncome: totalIncome,
      totalExpenses: totalExpenses
    };

    fetch('http://localhost:8080/api/income/save-monthly', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reportData)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('No se pudieron guardar los datos del informe anual');
      }
      console.log('Los datos del informe mensual se enviaron al backend correctamente');
    })
    .catch(error => {
      console.error('Error al guardar los datos del informe anual:', error);
    });
};


   // Calculate total revenue
  const calculateTotalRevenue = () => {
    const totalRev = salesRevenue + eventRevenue;
    setTotalRevenue(totalRev);
  };

 // Calculate total expenses
const calculateTotalExpenses = () => {
  const totalEx = billTypeAmounts.reduce((accumulator, item) => {
    return accumulator + item.totalAmount;
  }, 0);
  const totalExpenses = totalEx + totalMonthlySalary + totalEventBudgetforMonth + totalInventoryPurchasesForMonth;
  setTotalExpenses(totalExpenses);
};



  // Calculate total income
  const calculateTotalIncome = () => {
  const totalIn = totalRevenue  - totalExpenses;
  console.log('Ingresos totales:', totalRevenue);
  console.log('TGastos totales:', totalExpenses);
  console.log('Ingresos totales:', totalIn);
  setTotalIncome(totalIn);
};


  // Calculate tax
  const calculateTax = () => {
    const taxAmount = totalIncome * 0.3; // 30% of total income
    console.log('Monto del impuesto:', taxAmount); // Debugging statement
    setTax(taxAmount);
  };


  // Calculate net profit
  const calculateNetProfit = () => {
    const net = totalIncome - tax;
    setNetProfit(net);
  };

 
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

    pdf.save('Estado de Ingresos y Gastos Mensual.pdf'); // Save PDF with filename
  });
    sendReportDataToBackend(); // Send report data to the backend
  };

  return (
    <div className="w-full pt-10">
      <div className='flex'>
        <div className="w-1/2 pl-5">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Estado de Ingresos y Gastos Mensual</h1> <br/>
        </div>
        <div className="w-1/2 flex justify-end pr-5">
          <Button onClick={handleDownloadPDF} className="hover:bg-green-700 text-white font-bold mb-5 rounded">Exportar</Button>
        </div>
      </div>
      <hr />
      <br />

      <div className="flex space-x-4 mb-4 justify-center">
        <Card className="max-w-xs flex-1 text-blue-500">
          <h5 className="text-l font-bold dark:text-white">
            Ingresos Totales <br />
            S/. {totalIncome.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/,/g, ' ')}
          </h5>
          <p className='dark:text-gray-400'>
               Mes anterior: S/. {previousMonthTotalIncome.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/,/g, ' ')}
          </p>
        </Card>
        <Card className="max-w-xs flex-1 text-red-500">
          <h5 className="text-l font-bold dark:text-white">
            Gastos Totales <br />
            S/. {totalExpenses.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/,/g, ' ')}
          </h5>
          <p className='dark:text-gray-400'>
              Mes anterior: S/. {previousMonthTotalExpenses.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/,/g, ' ')}
          </p>
        </Card>
        <Card className="max-w-xs flex-1 text-green-500">
          <h5 className="text-l font-bold dark:text-white">
            Ganancia Neta  <br />
            S/. {netProfit.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/,/g, ' ')}
          </h5>
          <p className='dark:text-gray-400'>
              Mes anterior: S/. {previousMonthNetProfit.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/,/g, ' ')}
          </p>
        </Card>
      </div>

      <div id="monthly-report" className="overflow-x-auto w-1/2 mx-auto p-5">
        <div className="inline-block border w-full">
          <div className='flex p-4'>
            <div className='w-1/2'>
               <img src={CafeandEvent} alt="Kingsman Cafe Logo" className="h-12 w-auto" />
            </div>
            <div className='w-1/2'>
              <h1 className='font-bold text-right text-xl'>Estado de Ingresos y Gastos Mensual</h1>
              <h2 className='font-semibold text-right'>Para el mes de {currentMonth} {currentYear}</h2>
            </div>
          </div>
          
          <Table hoverable className=''>
            <Table.Body className=''>
              {/* Placeholder table rows for revenues and expenses */}
              <Table.Row className="bg-white text-black dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell className='bg-green-600 text-white font-semibold' >INGRESOS</Table.Cell>
                <Table.Cell className='bg-green-600 text-white font-semibold text-right' >S/.</Table.Cell>
                <Table.Cell className='bg-green-600 text-white font-semibold text-right' >S/.</Table.Cell>
              </Table.Row>
              <Table.Row className="bg-white text-black dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell>Ingresos por ventas</Table.Cell>
                <Table.Cell className='pr-2 text-right'>{salesRevenue.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/,/g, ' ')}</Table.Cell>
                <Table.Cell></Table.Cell>
              </Table.Row>
              <Table.Row className="bg-white text-black dark:bg-gray-800">
                <Table.Cell>Ingresos del evento</Table.Cell>
                <Table.Cell className='pr-2 text-right'>{eventRevenue.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/,/g, ' ')}</Table.Cell>
                <Table.Cell></Table.Cell>
              </Table.Row>
              <Table.Row className='border-t-2 text-blue-700 '>
                <Table.Cell className="font-semibold "> INGRESOS TOTALES</Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell className='pr-2 text-right font-semibold'>{totalRevenue.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/,/g, ' ')}</Table.Cell>
              </Table.Row>
              <Table.Row className=''>
                <Table.Cell className='bg-green-600 text-white font-semibold'>GASTOS</Table.Cell>
                <Table.Cell className='bg-green-600 text-white font-semibold text-right' >S/.</Table.Cell>
                <Table.Cell className='bg-green-600 text-white font-semibold text-right' >S/.</Table.Cell>
              </Table.Row>
              {billTypeAmounts.map((item, index) => (
                <Table.Row key={index} className="bg-white text-black dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>{item.billType}</Table.Cell>
                  <Table.Cell className='pr-2 text-right'>{item.totalAmount.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/,/g, ' ')}</Table.Cell>
                  <Table.Cell></Table.Cell>
                </Table.Row>
              ))}
               <Table.Row className="bg-white text-black dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell>Salarios de los empleados</Table.Cell>
                <Table.Cell className='pr-2 text-right'>{totalMonthlySalary.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/,/g, ' ')}</Table.Cell>
                <Table.Cell></Table.Cell>
              </Table.Row>
               <Table.Row className="bg-white text-black dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell>Presupuesto del evento</Table.Cell>
                <Table.Cell className='pr-2 text-right'>{totalEventBudgetforMonth.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/,/g, ' ')}</Table.Cell>
                <Table.Cell></Table.Cell>
              </Table.Row>
              <Table.Row className="bg-white text-black dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell>Compras de artículos de inventario</Table.Cell>
                <Table.Cell className='pr-2 text-right'>{totalInventoryPurchasesForMonth.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/,/g, ' ')}</Table.Cell>
                <Table.Cell></Table.Cell>
              </Table.Row>
              <Table.Row className='border-t-2 border-b-2 font-semibold text-red-700'>
                <Table.Cell className=""> GASTOS TOTALES</Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell  className='pr-2 text-right '> {totalExpenses.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/,/g, ' ')} </Table.Cell>
              </Table.Row>
              <Table.Row className='border-t-2 font-semibold text-green-700'>
                <Table.Cell>INGRESOS TOTALES</Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell className="pr-2 text-right ">{totalIncome.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/,/g, ' ')} </Table.Cell>
              </Table.Row>
              <Table.Row className="bg-white text-black dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell>Menos: Impuestos</Table.Cell>
                <Table.Cell className='pr-2 text-right'> {tax.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/,/g, ' ')}  </Table.Cell>
                <Table.Cell></Table.Cell>
              </Table.Row>
              <Table.Row className='border-t-2 font-semibold text-green-700'>
                <Table.Cell className='bg-green-600 text-white font-semibold'>GANANCIA/PÉRDIDA NETA</Table.Cell>
                <Table.Cell className='bg-green-600'></Table.Cell>
                <Table.Cell className="pr-2 text-right bg-green-600 text-white">{netProfit.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/,/g, ' ')} </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default MonthlyProfit;
