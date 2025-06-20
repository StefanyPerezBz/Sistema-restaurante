import React, { useState, useEffect } from 'react';
import { Table, Card, Button } from "flowbite-react";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import CafeandEvent from '/src/image/CafeandEvent.png';

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
  const [netProfit, setNetProfit] = useState(0);;
  const currentYear = new Date().getFullYear();

  // States for previous year data
  const [previousYearTotalIncome, setPreviousYearTotalIncome] = useState(0);
  const [previousYearTotalExpenses, setPreviousYearTotalExpenses] = useState(0);
  const [previousYearNetProfit, setPreviousYearNetProfit] = useState(0);
  const previousYear = currentYear - 1;

  useEffect(() => {
    fetchAnnualExpenses(); // Fetch monthly expenses 
    fetchBillTypeAmounts(); // Fetch bill type amounts
    fetchAnnualSalesRevenue(); // Fetch monthly sales revenue 
    fetchEventRevenue(); // Fetch event revenue 
    fetchAnnualSalary(); // Fetch annual salary 
    fetchTotalEventBudgetforYear(); // Fetch total event budget for the year 
    fetchTotalInventoryPurchasesForYear(); // Fetch total inventory purchases for the year
    fetchPreviousYearData(); // Fetch previous year data
  }, []);


  useEffect(() => {
    calculateTotalAnnualRevenue(); // Calculate total revenue 
    calculateTotalAnnaulExpenses(); // Calculate total expenses
    calculateTotalAnnaulIncome(); // Calculate total income 
    calculateTax(); // Calculate tax
    calculateNetProfit(); // Calculate net profit
  }, [billTypeAmounts, salesRevenue, eventRevenue, totalAnnualExpenses, totalRevenue, totalIncome, tax,totalAnnualSalary, totalEventBudgetforYear, totalInventoryPurchasesForYear]);

  // Fetch annual expenses from API
  const fetchAnnualExpenses = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/payment/current-year'); // Fetch annual data from API
      if (!response.ok) {
        throw new Error('No se pudieron obtener los datos');
      }
      const data = await response.json();
      setExpenses(data); // Update state with fetched data
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

 
  // Fetch bill type amounts from the API
  const fetchBillTypeAmounts = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/payment/current-year');
      if (!response.ok) {
        throw new Error('No se pudieron obtener los datos');
      }
      const data = await response.json();
      setBillTypeAmounts(data);
    } catch (error) {
      console.error('Error al obtener los importes del tipo de factura:', error);
    }
  };

  // Fetch annual salary from the API
  const fetchAnnualSalary = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/salary/getTotalGrossPaymentForCurrentYear');
      if (!response.ok) {
        throw new Error('No se pudo obtener el salario anual');
      }
      const annualSalary = await response.json();
      setTotalAnnualSalary(annualSalary);
    } catch (error) {
      console.error('Error al obtener el salario anual:', error);
    }
  };

  // Fetch total event budget for the year from the API
  const fetchTotalEventBudgetforYear = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/events/annual-total-budget');
      if (!response.ok) {
        throw new Error('No se pudo obtener el presupuesto total del evento para el año');
      }
      const totalBudget = await response.json();
      setTotalEventBudgetforYear(totalBudget);
    } catch (error) {
      console.error('Error al obtener el presupuesto total del evento para el año:', error);
    }
  };

  // Fetch total inventory purchases for the year from the API
  const fetchTotalInventoryPurchasesForYear = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/inventory/total-price/year');
      if (!response.ok) {
        throw new Error('No se pudo obtener el total de compras de inventario para el año');
      }
      const totalPurchases = await response.json();
      setTotalInventoryPurchasesForYear(totalPurchases);
    } catch (error) {
      console.error('Error al obtener las compras totales de inventario para el año:', error);
    }
  };


  // Fetch annual sales revenue from the API
   const fetchAnnualSalesRevenue = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/orders/annaul-sales-revenue');
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
      const response = await fetch('http://localhost:8080/api/events/annual-total-revenue');
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

   // Fetch previous year data from the API
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
    }
  };


//send data to database
 const sendReportDataToBackend = () => {
  const reportData = {
    year: currentYear,
    netProfit: netProfit,
    totalIncome: totalIncome,
    totalExpenses: totalAnnualExpenses
  };

  fetch('http://localhost:8080/api/income/save-annual', {
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
    console.log('Los datos del informe anual se enviaron al backend correctamente');
  })
  .catch(error => {
    console.error('Error al guardar los datos del informe anual:', error);
  });
};

 // Calculate total revenue
  const calculateTotalAnnualRevenue = () => {
    const totalRev = salesRevenue + eventRevenue;
    setTotalRevenue(totalRev);
  };

  // Calculate total expenses
  const calculateTotalAnnaulExpenses = () => {
    const totalEx = billTypeAmounts.reduce((accumulator, item) => {
      return accumulator + item.totalAmount;
    }, 0);
  const totalExpenses = totalEx + totalAnnualSalary + totalEventBudgetforYear + totalInventoryPurchasesForYear;
  setTotalAnnualExpenses(totalExpenses);
  };


  // Calculate total income
  const calculateTotalAnnaulIncome = () => {
  const totalIn = totalRevenue  - totalAnnualExpenses;
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

    pdf.save('Declaración de Renta Anual.pdf'); // Save PDF with filename
  });

    sendReportDataToBackend(); // Send report data to backend
  };


  const formatCurrency = (value) => {
  // Format the number
  const formattedValue = new Intl.NumberFormat('en-LK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
  // Replace comma with space
  return formattedValue.replace(/,/g, ' ');
};


  return (
    <div className="w-full pt-10 ">
      <div className='flex'>
        <div className=" w-1/2 pl-5">
          <h1 className=" text-3xl font-bold text-gray-900 dark:text-white">Estado anual de pérdidas y ganancias</h1> <br/>
        </div>
        <div className=" w-1/2 flex justify-end pr-5">
          <Button onClick={handleDownloadPDF} className=" hover:bg-green-700 text-white font-bold mb-5 rounded">Exportar</Button>
        </div>
      </div>
      <hr></hr> <br/>
      {/*   Container for cards arranged horizontally */}
      <div className="flex space-x-4 mb-4 justify-center">
        <Card className="max-w-xs flex-1 text-blue-500">
          <h5 className="text-l font-bold  dark:text-white">
            Ingresos totales <br/>
            S/. {formatCurrency(totalIncome)}
          </h5>
          <p className=" dark:text-gray-400 ">
            Año anterior:  S/. {formatCurrency(previousYearTotalIncome)}
          </p>
        </Card>
        <Card className="max-w-xs flex-1 text-red-500">
          <h5 className="text-l font-bold  dark:text-white">
            Gastos Totales <br/>
            S/. {formatCurrency(totalAnnualExpenses)}
          </h5>
          <p className=" dark:text-gray-400">
            Previous Year:  S/. {formatCurrency(previousYearTotalExpenses)}
          </p>
        </Card>
        <Card className="max-w-xs flex-1 text-green-500">
          <h5 className="text-l font-bold dark:text-white">
            Beneficio neto <br/>
             S/. {formatCurrency(netProfit)}
          </h5>
          <p className=" dark:text-gray-400">
            Año anterior:  S/. {formatCurrency(previousYearNetProfit)}
          </p>
        </Card>
      </div>

      {/* Container for the table */}
      <div id="annual-report" className="overflow-x-auto w-1/2 mx-auto p-5">
        <div className="inline-block border w-full">
          <div className='flex p-4'>
            <div className='w-1/2'>
               <img src={CafeandEvent} alt="Kingsman Cafe Logo" className="h-12 w-auto" />
            </div>
            <div className='w-1/2'>
              <h1 className='font-bold text-right text-xl'>Estado anual de pérdidas y ganancias</h1>
              <h2 className='font-semibold text-right'>Para el año {currentYear}</h2>
            </div>
          </div>

          <Table hoverable className=''>
            <Table.Body className=''>
              <Table.Row className="bg-white text-black dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell className='bg-green-600 text-white font-semibold' >INGRESOS</Table.Cell>
                <Table.Cell className='bg-green-600 text-white font-semibold text-right' >S/.</Table.Cell>
                <Table.Cell className='bg-green-600 text-white font-semibold text-right' >S/.</Table.Cell>
              </Table.Row>
              <Table.Row className="bg-white text-black dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell>Ingresos por ventas</Table.Cell>
                <Table.Cell className='pr-2 text-right'>{formatCurrency(salesRevenue)}</Table.Cell>
                <Table.Cell></Table.Cell>
              </Table.Row>
              <Table.Row className="bg-white text-black dark:bg-gray-800">
                <Table.Cell>Ingresos del evento</Table.Cell>
                <Table.Cell className='pr-2 text-right'>{formatCurrency(eventRevenue)}</Table.Cell>
                <Table.Cell></Table.Cell>
              </Table.Row>
              <Table.Row className='border-t-2 text-blue-700 '>
                <Table.Cell className="font-semibold "> INGRESOS TOTALES</Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell className='pr-2 text-right font-semibold'>{formatCurrency(totalRevenue)}</Table.Cell>
              </Table.Row>
              <Table.Row className=''>
                <Table.Cell className='bg-green-600 text-white font-semibold'>GASTOS</Table.Cell>
                <Table.Cell className='bg-green-600 text-white font-semibold text-right' >S/.</Table.Cell>
                <Table.Cell className='bg-green-600 text-white font-semibold text-right' >S/.</Table.Cell>
              </Table.Row>
              {billTypeAmounts.map((item, index) => (
                <Table.Row key={index} className="bg-white text-black dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>{item.billType}</Table.Cell>
                  <Table.Cell className='pr-2 text-right'>{formatCurrency(item.totalAmount)}</Table.Cell>
                  <Table.Cell></Table.Cell>
                </Table.Row>
              ))}
              <Table.Row className="bg-white text-black dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell>Salarios de los empleados</Table.Cell>
                <Table.Cell className='pr-2 text-right'>{formatCurrency(totalAnnualSalary)}</Table.Cell>
                <Table.Cell></Table.Cell>
              </Table.Row>
               <Table.Row className="bg-white text-black dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell>Presupuesto del evento</Table.Cell>
                <Table.Cell className='pr-2 text-right'>{formatCurrency(totalEventBudgetforYear)}</Table.Cell>
                <Table.Cell></Table.Cell>
              </Table.Row>
              <Table.Row className="bg-white text-black dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell>Compras de artículos de inventario</Table.Cell>
                <Table.Cell className='pr-2 text-right'>{formatCurrency(totalInventoryPurchasesForYear)}</Table.Cell>
                <Table.Cell></Table.Cell>
              </Table.Row>
              <Table.Row className='border-t-2 border-b-2 font-semibold text-red-700'>
                <Table.Cell className=""> GASTOS TOTALES</Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell  className='pr-2 text-right '> {formatCurrency(totalAnnualExpenses)} </Table.Cell>
              </Table.Row>
              <Table.Row className='border-t-2 font-semibold text-green-700'>
                <Table.Cell>INGRESOS TOTALES</Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell className="pr-2 text-right ">{formatCurrency(totalIncome)} </Table.Cell>
              </Table.Row>
              <Table.Row className="bg-white text-black dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell>Menos: Impuestos</Table.Cell>
                <Table.Cell className='pr-2 text-right'> {formatCurrency(tax)}  </Table.Cell>
                <Table.Cell></Table.Cell>
              </Table.Row>
              <Table.Row className='border-t-2 font-semibold text-green-700'>
                <Table.Cell className='bg-green-600 text-white'>GANANCIA / PÉRDIDA NETA</Table.Cell>
                <Table.Cell className='bg-green-600 text-white'></Table.Cell>
                <Table.Cell className="pr-2 text-right bg-green-600 text-white">{formatCurrency(netProfit)} </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default  AnnualIncome;

