// import React, { useState, useEffect } from 'react';
// import { Table, Card, Button } from "flowbite-react";
// import html2canvas from 'html2canvas';
// import jsPDF from 'jspdf';
// import CafeandEvent from '/src/image/logo.jpg';

// const MonthlyProfit = () => {
//   const [expenses, setExpenses] = useState({
//     electricity: 0,
//     water: 0,
//     telephone: 0,
//     internet: 0,
//     insurance: 0,
//     otherExpenses: 0,
//   });
//   const [billTypeAmounts, setBillTypeAmounts] = useState([]);
//   const [totalExpenses, setTotalExpenses] = useState(0);
//   const [totalMonthlySalary, setTotalMonthlySalary] = useState(0);
//   const [totalEventBudgetforMonth, setTotalEventBudgetforMonth] = useState(0);
//   const [totalInventoryPurchasesForMonth, setTotalInventoryPurchasesForMonth] = useState(0);
//   const [salesRevenue, setSalesRevenue] = useState(0);
//   const [eventRevenue, setEventRevenue] = useState(0);
//   const [totalRevenue, setTotalRevenue] = useState(0);
//   const [totalIncome, setTotalIncome] = useState(0);
//   const [tax, setTax] = useState(0);
//   const [netProfit, setNetProfit] = useState(0);
//   const currentMonth = new Date().toLocaleString('default', { month: 'long' });
//   const currentYear = new Date().getFullYear();


//   // States for previous month data
//   const [previousMonthTotalIncome, setPreviousMonthTotalIncome] = useState(0);
//   const [previousMonthTotalExpenses, setPreviousMonthTotalExpenses] = useState(0);
//   const [previousMonthNetProfit, setPreviousMonthNetProfit] = useState(0);
//   const previousMonth = new Date().getMonth();

//   useEffect(() => {
//     fetchMonthlyExpenses(); // Fetch monthly expenses 
//     fetchBillTypeAmounts(); // Fetch bill type amounts
//     fetchMonthlySalesRevenue(); // Fetch monthly sales revenue 
//     fetchEventRevenue(); // Fetch event revenue 
//     fetchMonthlySalary(); // Fetch monthly salary 
//     fetchTotalEventBudgeforMonth(); // Fetch total event budgets 
//     fetchTotalInventoryPurchasesForMonth(); // Fetch total inventory purchases
//     fetchPreviousMonthData(); // Fetch previous month data
//   }, []);

//   useEffect(() => {
//     calculateTotalRevenue(); // Calculate total revenue 
//     calculateTotalExpenses(); // Calculate total expenses whenever billTypeAmounts changes
//     calculateTotalIncome(); // Calculate total income 
//     calculateTax(); // Calculate tax
//     calculateNetProfit(); // Calculate net profit
//     }, [billTypeAmounts, salesRevenue, eventRevenue, totalExpenses, totalRevenue, totalIncome, tax, totalMonthlySalary, totalEventBudgetforMonth, totalInventoryPurchasesForMonth]);

//   // Fetch monthly expenses from the API
//   const fetchMonthlyExpenses = async () => {
//     try {
//       const response = await fetch('http://localhost:8080/api/payment/current-month');
//       if (!response.ok) {
//         throw new Error('No se pudieron obtener los datos');
//       }
//       const data = await response.json();
//       setExpenses(data);
//     } catch (error) {
//       console.error('Error al obtener datos:', error);
//     }
//   };

//   // Fetch bill type amounts from the API
//   const fetchBillTypeAmounts = async () => {
//     try {
//       const response = await fetch('http://localhost:8080/api/payment/current-month');
//       if (!response.ok) {
//         throw new Error('No se pudieron obtener los datos');
//       }
//       const data = await response.json();
//       setBillTypeAmounts(data);
//     } catch (error) {
//       console.error('Error al obtener los importes del tipo de factura:', error);
//     }
//   };

//    // Fetch monthly salary from the API
//   const fetchMonthlySalary = async () => {
//     try {
//       const response = await fetch('http://localhost:8080/api/salary/getTotalGrossPaymentForCurrentMonth');
//       if (!response.ok) {
//         throw new Error('No se pudo obtener el salario mensual');
//       }
//       const totalSalary = await response.json();
//       setTotalMonthlySalary(totalSalary);
//     } catch (error) {
//       console.error('Error al obtener el salario mensual:', error);
//     }
//   };

//    // Fetch monthly event budget from the API
//   const fetchTotalEventBudgeforMonth = async () => {
//     try {
//       const response = await fetch('http://localhost:8080/api/events/monthly-total-budget');
//       if (!response.ok) {
//         throw new Error('No se pudo obtener el salario mensual');
//       }
//       const totalBudget = await response.json();
//       setTotalEventBudgetforMonth(totalBudget);
//     } catch (error) {
//       console.error('Error al obtener el salario mensual:', error);
//     }
//   };

//   // Fetch total inventory purchases for the month from the API
//   const fetchTotalInventoryPurchasesForMonth = async () => {
//     try {
//       const response = await fetch('http://localhost:8080/api/inventory/total-price/month');
//       if (!response.ok) {
//         throw new Error('No se pudo obtener el total de compras de inventario');
//       }
//       const totalPurchases = await response.json();
//       setTotalInventoryPurchasesForMonth(totalPurchases);
//     } catch (error) {
//       console.error('Error al obtener el total de compras de inventario:', error);
//     }
//   };


//   // Fetch monthly sales revenue from the API
//    const fetchMonthlySalesRevenue = async () => {
//     try {
//       const response = await fetch('http://localhost:8080/api/orders/monthly-sales-revenue');
//       if (!response.ok) {
//         throw new Error('No se pudieron obtener ingresos por ventas');
//       }
//       const salesRevenue = await response.json();
//       // console.log('Monthly sales revenue data:', salesRevenue);
//       setSalesRevenue(salesRevenue);
//     } catch (error) {
//       console.error('Error al obtener los ingresos por ventas:', error);
//     }
//   };

//   // Fetch event revenue from the API
//   const fetchEventRevenue = async () => {
//     try {
//       const response = await fetch('http://localhost:8080/api/events/monthly-total-revenue');
//       if (!response.ok) {
//         throw new Error('No se pudieron obtener los ingresos del evento');
//       }
//       const eventRevenue = await response.json();
//       // console.log('Event data:', eventRevenue); // Debugging statement
//       setEventRevenue(eventRevenue);
//     } catch (error) {
//       console.error('Error al obtener los ingresos del evento:', error);
//     }
//   };

//    // Fetch previous month data from the API
//   const fetchPreviousMonthData = async () => {
//     try {
//       const response = await fetch(`http://localhost:8080/api/income/previous-month/${previousMonth}`);
//       if (!response.ok) {
//         throw new Error('No se pudieron obtener los datos del mes anterior');
//       }
//       const data = await response.json();
//       setPreviousMonthTotalIncome(data.totalIncome);
//       setPreviousMonthTotalExpenses(data.totalExpenses);
//       setPreviousMonthNetProfit(data.netProfit);
//     } catch (error) {
//       console.error('Error al obtener los datos del mes anterior:', error);
//     }
//   };


//   //send data to database
//  const sendReportDataToBackend = () => {
//     const reportData = {
//       date: new Date().toISOString(),
//       netProfit: netProfit,
//       totalIncome: totalIncome,
//       totalExpenses: totalExpenses
//     };

//     fetch('http://localhost:8080/api/income/save-monthly', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(reportData)
//     })
//     .then(response => {
//       if (!response.ok) {
//         throw new Error('No se pudieron guardar los datos del informe anual');
//       }
//       console.log('Los datos del informe mensual se enviaron al backend correctamente');
//     })
//     .catch(error => {
//       console.error('Error al guardar los datos del informe anual:', error);
//     });
// };


//    // Calculate total revenue
//   const calculateTotalRevenue = () => {
//     const totalRev = salesRevenue + eventRevenue;
//     setTotalRevenue(totalRev);
//   };

//  // Calculate total expenses
// const calculateTotalExpenses = () => {
//   const totalEx = billTypeAmounts.reduce((accumulator, item) => {
//     return accumulator + item.totalAmount;
//   }, 0);
//   const totalExpenses = totalEx + totalMonthlySalary + totalEventBudgetforMonth + totalInventoryPurchasesForMonth;
//   setTotalExpenses(totalExpenses);
// };



//   // Calculate total income
//   const calculateTotalIncome = () => {
//   const totalIn = totalRevenue  - totalExpenses;
//   console.log('Ingresos totales:', totalRevenue);
//   console.log('TGastos totales:', totalExpenses);
//   console.log('Ingresos totales:', totalIn);
//   setTotalIncome(totalIn);
// };


//   // Calculate tax
//   const calculateTax = () => {
//     const taxAmount = totalIncome * 0.3; // 30% of total income
//     console.log('Monto del impuesto:', taxAmount); // Debugging statement
//     setTax(taxAmount);
//   };


//   // Calculate net profit
//   const calculateNetProfit = () => {
//     const net = totalIncome - tax;
//     setNetProfit(net);
//   };


//   const handleDownloadPDF = () => {
//     // Download PDF of the annual statement
//   const inputElement = document.getElementById('monthly-report'); // Element to capture

//   inputElement.style.width = '800px'; // Set a fixed width
//   inputElement.style.height = 'auto'; // Set auto height to maintain aspect ratio

//   html2canvas(inputElement, {
//     scale: 3, // Increase scale to improve quality (default is 1)
//     useCORS: true // Ensures cross-origin images are handled properly
//   }).then((canvas) => {
//     const imgData = canvas.toDataURL('image/png'); // Convert canvas to image data
//     const pdf = new jsPDF('p', 'mm', 'a4'); // Create new PDF document (portrait mode, millimeters, A4 size)

//     const imgWidth = 210; // A4 width in mm
//     const imgHeight = canvas.height * imgWidth / canvas.width; // Calculate image height based on aspect ratio

//     pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight); // Add image to PDF

//     pdf.save('Estado de Ingresos y Gastos Mensual.pdf'); // Save PDF with filename
//   });
//     sendReportDataToBackend(); // Send report data to the backend
//   };

//   return (
//     <div className="w-full pt-10">
//       <div className='flex'>
//         <div className="w-1/2 pl-5">
//           <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Estado de Ingresos y Gastos Mensual</h1> <br/>
//         </div>
//         <div className="w-1/2 flex justify-end pr-5">
//           <Button onClick={handleDownloadPDF} className="hover:bg-green-700 text-white font-bold mb-5 rounded">Exportar</Button>
//         </div>
//       </div>
//       <hr />
//       <br />

//       <div className="flex space-x-4 mb-4 justify-center">
//         <Card className="max-w-xs flex-1 bg-green-500 text-white dark:bg-green-500">
//           <h5 className="text-l font-bold dark:text-white">
//             Ingresos Totales <br />
//             S/. {totalIncome.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/,/g, ' ')}
//           </h5>
//           <p className='dark:text-gray-200'>
//                Mes anterior: S/. {previousMonthTotalIncome.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/,/g, ' ')}
//           </p>
//         </Card>
//         <Card className="max-w-xs flex-1 bg-red-500 text-white dark:bg-red-500">
//           <h5 className="text-l font-bold dark:text-white">
//             Gastos Totales <br />
//             S/. {totalExpenses.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/,/g, ' ')}
//           </h5>
//           <p className='dark:text-gray-200'>
//               Mes anterior: S/. {previousMonthTotalExpenses.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/,/g, ' ')}
//           </p>
//         </Card>
//         <Card className="max-w-xs flex-1 bg-blue-500 text-white dark:bg-blue-500">
//           <h5 className="text-l font-bold dark:text-white">
//             Ganancia Neta  <br />
//             S/. {netProfit.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/,/g, ' ')}
//           </h5>
//           <p className='dark:text-gray-200'>
//               Mes anterior: S/. {previousMonthNetProfit.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/,/g, ' ')}
//           </p>
//         </Card>
//       </div>

//       <div id="monthly-report" className="overflow-x-auto w-1/2 mx-auto p-5">
//         <div className="inline-block border w-full">
//           <div className='flex p-4'>
//             <div className='w-1/2'>
//                <img src={CafeandEvent} alt="Logo los patos" className="h-12 w-auto" />
//             </div>
//             <div className='w-1/2'>
//               <h1 className='font-bold text-right text-xl'>Estado de Ingresos y Gastos Mensual</h1>
//               <h2 className='font-semibold text-right'>Para el mes de {currentMonth} {currentYear}</h2>
//             </div>
//           </div>

//           <Table hoverable className=''>
//             <Table.Body className=''>
//               {/* Placeholder table rows for revenues and expenses */}
//               <Table.Row className="bg-white text-black dark:border-gray-700 dark:bg-gray-800">
//                 <Table.Cell className='bg-orange-600 text-white font-semibold' >INGRESOS</Table.Cell>
//                 <Table.Cell className='bg-orange-600 text-white font-semibold text-right' >S/.</Table.Cell>
//                 <Table.Cell className='bg-orange-600 text-white font-semibold text-right' >S/.</Table.Cell>
//               </Table.Row>
//               <Table.Row className="bg-white text-black dark:border-gray-700 dark:bg-gray-800 dark:text-white">
//                 <Table.Cell>Ingresos por ventas</Table.Cell>
//                 <Table.Cell className='pr-2 text-right'>{salesRevenue.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/,/g, ' ')}</Table.Cell>
//                 <Table.Cell></Table.Cell>
//               </Table.Row>
//               <Table.Row className="bg-white text-black dark:bg-gray-800 dark:text-white">
//                 <Table.Cell>Ingresos del evento</Table.Cell>
//                 <Table.Cell className='pr-2 text-right'>{eventRevenue.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/,/g, ' ')}</Table.Cell>
//                 <Table.Cell></Table.Cell>
//               </Table.Row>
//               <Table.Row className='border-t-2 text-blue-700 dark:text-blue-300'>
//                 <Table.Cell className="font-semibold "> INGRESOS TOTALES</Table.Cell>
//                 <Table.Cell></Table.Cell>
//                 <Table.Cell className='pr-2 text-right font-semibold'>{totalRevenue.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/,/g, ' ')}</Table.Cell>
//               </Table.Row>
//               <Table.Row className=''>
//                 <Table.Cell className='bg-orange-600 text-white font-semibold'>GASTOS</Table.Cell>
//                 <Table.Cell className='bg-orange-600 text-white font-semibold text-right' >S/.</Table.Cell>
//                 <Table.Cell className='bg-orange-600 text-white font-semibold text-right' >S/.</Table.Cell>
//               </Table.Row>
//               {billTypeAmounts.map((item, index) => (
//                 <Table.Row key={index} className="bg-white text-black dark:border-gray-700 dark:bg-gray-800 dark:text-white">
//                   <Table.Cell>{item.billType}</Table.Cell>
//                   <Table.Cell className='pr-2 text-right'>{item.totalAmount.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/,/g, ' ')}</Table.Cell>
//                   <Table.Cell></Table.Cell>
//                 </Table.Row>
//               ))}
//                <Table.Row className="bg-white text-black dark:border-gray-700 dark:bg-gray-800 dark:text-white">
//                 <Table.Cell>Salarios de los empleados</Table.Cell>
//                 <Table.Cell className='pr-2 text-right'>{totalMonthlySalary.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/,/g, ' ')}</Table.Cell>
//                 <Table.Cell></Table.Cell>
//               </Table.Row>
//                <Table.Row className="bg-white text-black dark:border-gray-700 dark:bg-gray-800 dark:text-white">
//                 <Table.Cell>Presupuesto del evento</Table.Cell>
//                 <Table.Cell className='pr-2 text-right'>{totalEventBudgetforMonth.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/,/g, ' ')}</Table.Cell>
//                 <Table.Cell></Table.Cell>
//               </Table.Row>
//               <Table.Row className="bg-white text-black dark:border-gray-700 dark:bg-gray-800 dark:text-white">
//                 <Table.Cell>Compras de artículos de inventario</Table.Cell>
//                 <Table.Cell className='pr-2 text-right'>{totalInventoryPurchasesForMonth.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/,/g, ' ')}</Table.Cell>
//                 <Table.Cell></Table.Cell>
//               </Table.Row>
//               <Table.Row className='border-t-2 border-b-2 font-semibold text-red-700 dark:text-red-400'>
//                 <Table.Cell className=""> GASTOS TOTALES</Table.Cell>
//                 <Table.Cell></Table.Cell>
//                 <Table.Cell  className='pr-2 text-right '> {totalExpenses.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/,/g, ' ')} </Table.Cell>
//               </Table.Row>
//               <Table.Row className='border-t-2 font-semibold text-green-700 dark:text-green-400'>
//                 <Table.Cell>INGRESOS TOTALES</Table.Cell>
//                 <Table.Cell></Table.Cell>
//                 <Table.Cell className="pr-2 text-right ">{totalIncome.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/,/g, ' ')} </Table.Cell>
//               </Table.Row>
//               <Table.Row className="bg-white text-black dark:border-gray-700 dark:bg-gray-800 dark:text-white">
//                 <Table.Cell>Impuestos</Table.Cell>
//                 <Table.Cell className='pr-2 text-right'> {tax.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/,/g, ' ')}  </Table.Cell>
//                 <Table.Cell></Table.Cell>
//               </Table.Row>
//               <Table.Row className='border-t-2 font-semibold text-orange-700'>
//                 <Table.Cell className='bg-orange-600 text-white font-semibold'>GANANCIA/PÉRDIDA NETA</Table.Cell>
//                 <Table.Cell className='bg-orange-600'></Table.Cell>
//                 <Table.Cell className="pr-2 text-right bg-orange-600 text-white">{netProfit.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/,/g, ' ')} </Table.Cell>
//               </Table.Row>
//             </Table.Body>
//           </Table>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default MonthlyProfit;

import React, { useState, useEffect } from 'react';
import { Table, Card, Button } from "flowbite-react";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Swal from 'sweetalert2';
import CafeandEvent from '/src/image/logo.jpg';

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
  const currentMonth = new Date().toLocaleString('es-PE', { month: 'long' });
  const currentYear = new Date().getFullYear();

  // States for previous month data
  const [previousMonthTotalIncome, setPreviousMonthTotalIncome] = useState(0);
  const [previousMonthTotalExpenses, setPreviousMonthTotalExpenses] = useState(0);
  const [previousMonthNetProfit, setPreviousMonthNetProfit] = useState(0);
  const previousMonth = new Date().getMonth();

  useEffect(() => {
    fetchMonthlyExpenses();
    fetchBillTypeAmounts();
    fetchMonthlySalesRevenue();
    fetchEventRevenue();
    fetchMonthlySalary();
    fetchTotalEventBudgeforMonth();
    fetchTotalInventoryPurchasesForMonth();
    fetchPreviousMonthData();
  }, []);

  useEffect(() => {
    calculateTotalRevenue();
    calculateTotalExpenses();
    calculateTotalIncome();
    calculateTax();
    calculateNetProfit();
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
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar los gastos mensuales',
        footer: error.message
      });
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
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar los salarios',
        footer: error.message
      });
    }
  };

  // Fetch monthly event budget from the API
  const fetchTotalEventBudgeforMonth = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/events/monthly-total-budget');
      if (!response.ok) {
        throw new Error('No se pudo obtener el presupuesto de eventos');
      }
      const totalBudget = await response.json();
      setTotalEventBudgetforMonth(totalBudget);
    } catch (error) {
      console.error('Error al obtener el presupuesto de eventos:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar los presupuestos de eventos',
        footer: error.message
      });
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
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar las compras de inventario',
        footer: error.message
      });
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
      setSalesRevenue(salesRevenue);
    } catch (error) {
      console.error('Error al obtener los ingresos por ventas:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar los ingresos por ventas',
        footer: error.message
      });
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
      setEventRevenue(eventRevenue);
    } catch (error) {
      console.error('Error al obtener los ingresos del evento:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar los ingresos de eventos',
        footer: error.message
      });
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
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar los datos del mes anterior',
        footer: error.message
      });
    }
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
    const totalIn = totalRevenue - totalExpenses;
    setTotalIncome(totalIn);
  };

  // Calculate tax (IGV 18% en Perú)
  const calculateTax = () => {
    if (totalIncome > 0) {
      const taxAmount = totalIncome * 0.18; // IGV general es 18%
      setTax(taxAmount);
    } else {
      setTax(0);
    }
  };

  // Calculate net profit
  const calculateNetProfit = () => {
    const net = totalIncome - tax;
    setNetProfit(net);
  };

  //send data to database
  const sendReportDataToBackend = async () => {
    try {
      const reportData = {
        date: new Date().toISOString(),
        netProfit: netProfit,
        totalIncome: totalIncome,
        totalExpenses: totalExpenses
      };

      const response = await fetch('http://localhost:8080/api/income/save-monthly', {
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
        text: 'Los datos del informe mensual se guardaron correctamente',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error al guardar los datos del informe anual:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron guardar los datos del informe',
        footer: error.message
      });
    }
  };

  const handleDownloadPDF = async () => {
    try {
      // Mostrar carga mientras se genera el PDF
      Swal.fire({
        title: 'Generando PDF',
        html: 'Por favor espere...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      const inputElement = document.getElementById('monthly-report');

      // Estilos temporales para el PDF
      const originalStyles = {
        width: inputElement.style.width,
        height: inputElement.style.height,
        padding: inputElement.style.padding
      };

      inputElement.style.width = '800px';
      inputElement.style.height = 'auto';
      inputElement.style.padding = '20px';

      const canvas = await html2canvas(inputElement, {
        scale: 3,
        useCORS: true,
        logging: true,
        allowTaint: true
      });

      // Restaurar estilos originales
      inputElement.style.width = originalStyles.width;
      inputElement.style.height = originalStyles.height;
      inputElement.style.padding = originalStyles.padding;

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 190; // Ancho reducido para márgenes
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Agregar encabezado profesional
      pdf.setFontSize(16);
      pdf.setTextColor(40, 40, 40);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Reporte Financiero Mensual', 105, 15, null, null, 'center');

      pdf.setFontSize(12);
      pdf.text(`Restaurante: ${currentMonth} ${currentYear}`, 105, 22, null, null, 'center');

      // Agregar logo
      const logoData = await fetch(CafeandEvent).then(res => res.blob());
      const logoUrl = URL.createObjectURL(logoData);
      pdf.addImage(logoUrl, 'JPEG', 15, 10, 30, 15);

      // Agregar contenido principal
      pdf.addImage(imgData, 'PNG', 10, 30, imgWidth, imgHeight);

      // Agregar pie de página profesional
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text('Generado el: ' + new Date().toLocaleDateString(), 15, 285);
      pdf.text('© Los Patos - Todos los derechos reservados', 105, 285, null, null, 'center');

      // Guardar PDF
      pdf.save(`Reporte_Mensual_${currentMonth}_${currentYear}.pdf`);

      // Cerrar alerta de carga
      Swal.close();

      // Enviar datos al backend
      await sendReportDataToBackend();

      Swal.fire({
        icon: 'success',
        title: 'PDF Generado',
        text: 'El reporte se ha descargado correctamente',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error al generar PDF:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo generar el PDF',
        footer: error.message
      });
    }
  };

  return (
    <div className="w-full pt-10 px-4">
      <div className='flex flex-col md:flex-row'>
        <div className="w-full md:w-1/2 pl-5">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Estado de Ingresos y Gastos Mensual</h1> <br />
        </div>
        <div className="w-full md:w-1/2 flex justify-end pr-5">
          <Button onClick={handleDownloadPDF} className="hover:bg-green-700 text-white font-bold mb-5 rounded">
            Exportar a PDF
          </Button>
        </div>
      </div>
      <hr />
      <br />

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
            Ganancia Neta  <br />
            S/. {netProfit.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/,/g, ' ')}
          </h5>
          <p className='dark:text-gray-200'>
            Mes anterior: S/. {previousMonthNetProfit.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/,/g, ' ')}
          </p>
        </Card>
      </div>

      <div id="monthly-report" className="overflow-x-auto w-full lg:w-4/5 mx-auto p-2 lg:p-5">
        <div className="inline-block border w-full">
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

          <Table hoverable className='w-full'>
            <Table.Body className='divide-y'>
              {/* INGRESOS */}
              <Table.Row className="bg-white text-black dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell className='bg-orange-600 text-white font-semibold' colSpan="3">INGRESOS</Table.Cell>
              </Table.Row>
              <Table.Row className="bg-white text-black dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                <Table.Cell>Ingresos por ventas</Table.Cell>
                <Table.Cell className='pr-2 text-right'>{salesRevenue.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/,/g, ' ')}</Table.Cell>
                <Table.Cell></Table.Cell>
              </Table.Row>
              <Table.Row className="bg-white text-black dark:bg-gray-800 dark:text-white">
                <Table.Cell>Ingresos del evento</Table.Cell>
                <Table.Cell className='pr-2 text-right'>{eventRevenue.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/,/g, ' ')}</Table.Cell>
                <Table.Cell></Table.Cell>
              </Table.Row>
              <Table.Row className='border-t-2 text-blue-700 dark:text-blue-300'>
                <Table.Cell className="font-semibold"> INGRESOS TOTALES</Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell className='pr-2 text-right font-semibold'>{totalRevenue.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/,/g, ' ')}</Table.Cell>
              </Table.Row>

              {/* GASTOS */}
              <Table.Row className=''>
                <Table.Cell className='bg-orange-600 text-white font-semibold' colSpan="3">GASTOS</Table.Cell>
              </Table.Row>
              {billTypeAmounts.map((item, index) => (
                <Table.Row key={index} className="bg-white text-black dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                  <Table.Cell>{item.billType}</Table.Cell>
                  <Table.Cell className='pr-2 text-right'>{item.totalAmount.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/,/g, ' ')}</Table.Cell>
                  <Table.Cell></Table.Cell>
                </Table.Row>
              ))}
              <Table.Row className="bg-white text-black dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                <Table.Cell>Salarios de los empleados</Table.Cell>
                <Table.Cell className='pr-2 text-right'>{totalMonthlySalary.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/,/g, ' ')}</Table.Cell>
                <Table.Cell></Table.Cell>
              </Table.Row>
              <Table.Row className="bg-white text-black dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                <Table.Cell>Presupuesto del evento</Table.Cell>
                <Table.Cell className='pr-2 text-right'>{totalEventBudgetforMonth.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/,/g, ' ')}</Table.Cell>
                <Table.Cell></Table.Cell>
              </Table.Row>
              <Table.Row className="bg-white text-black dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                <Table.Cell>Compras de artículos de inventario</Table.Cell>
                <Table.Cell className='pr-2 text-right'>{totalInventoryPurchasesForMonth.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/,/g, ' ')}</Table.Cell>
                <Table.Cell></Table.Cell>
              </Table.Row>
              <Table.Row className='border-t-2 border-b-2 font-semibold text-red-700 dark:text-red-400'>
                <Table.Cell className=""> GASTOS TOTALES</Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell className='pr-2 text-right'> {totalExpenses.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/,/g, ' ')} </Table.Cell>
              </Table.Row>

              {/* RESUMEN FINAL */}
              <Table.Row className='border-t-2 font-semibold text-green-700 dark:text-green-400'>
                <Table.Cell>INGRESOS TOTALES</Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell className="pr-2 text-right">{totalIncome.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/,/g, ' ')}</Table.Cell>
              </Table.Row>
              <Table.Row className="bg-white text-black dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                <Table.Cell>Impuestos (IGV 18%)</Table.Cell>
                <Table.Cell className='pr-2 text-right'> {tax.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/,/g, ' ')} </Table.Cell>
                <Table.Cell></Table.Cell>
              </Table.Row>
              <Table.Row className='border-t-2 font-semibold text-orange-700'>
                <Table.Cell className='bg-orange-600 text-white font-semibold'>GANANCIA/PÉRDIDA NETA</Table.Cell>
                <Table.Cell className='bg-orange-600'></Table.Cell>
                <Table.Cell className="pr-2 text-right bg-orange-600 text-white">{netProfit.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/,/g, ' ')}</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>

          {/* Explicación de cálculos */}
          <div className="p-4 text-sm text-gray-600 dark:text-white dark:bg-gray-800">
            <p className="font-semibold">Cómo se calcula cada valor:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Ingresos Totales:</strong> Ventas (S/. {salesRevenue.toLocaleString('es-PE')}) + Eventos (S/. {eventRevenue.toLocaleString('es-PE')})</li>
              <li><strong>Gastos Totales:</strong> Servicios (S/. {billTypeAmounts.reduce((acc, item) => acc + item.totalAmount, 0).toLocaleString('es-PE')}) + Salarios (S/. {totalMonthlySalary.toLocaleString('es-PE')}) + Presupuesto Eventos (S/. {totalEventBudgetforMonth.toLocaleString('es-PE')}) + Inventario (S/. {totalInventoryPurchasesForMonth.toLocaleString('es-PE')})</li>
              <li><strong>Ingresos Netos:</strong> Ingresos Totales (S/. {totalRevenue.toLocaleString('es-PE')}) - Gastos Totales (S/. {totalExpenses.toLocaleString('es-PE')})</li>
              <li><strong>Impuestos:</strong> 18% de los Ingresos Netos (S/. {tax.toLocaleString('es-PE')})</li>
              <li><strong>Ganancia Neta:</strong> Ingresos Netos (S/. {totalIncome.toLocaleString('es-PE')}) - Impuestos (S/. {tax.toLocaleString('es-PE')})</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MonthlyProfit;