// import React, { useEffect, useState } from 'react';
// import { Table, Button, Pagination, Select } from "flowbite-react";
// import { FaCloudDownloadAlt } from "react-icons/fa";
// import { jsPDF } from 'jspdf';
// import 'jspdf-autotable';

// function EmpSalaries() {
//   const [salaries, setSalaries] = useState([]);
//   const [showExtraColumns, setShowExtraColumns] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [selectedMonth, setSelectedMonth] = useState('');
//   const itemsPerPage = 5;

//   useEffect(() => {
//     fetchAllMonthSalaries();
//   }, []);

//   const fetchAllMonthSalaries = () => {
//     fetch('http://localhost:8080/api/salary/getAllMonthSalaries')
//       .then(response => response.json())
//       .then(data => {
//         console.log('Data received:', data);
//         setSalaries(data);
//       })
//       .catch(error => {
//         console.error('Error al recuperar los salarios de todos los meses:', error);
//       });
//   };

//   const fetchTodaySalaries = () => {
//     fetch('http://localhost:8080/salary/currentDateSalaries')
//       .then(response => response.json())
//       .then(data => {
//         console.log('Data received for today salaries:', data);
//         setSalaries(data);
//         setShowExtraColumns(false);
//         calculateAllEmployeesDailySalary();
//       })
//       .catch(error => {
//         console.error('Error al obtener los salarios de hoy:', error);
//       });
//   };

//   const fetchThisMonthSalaries = () => {
//     fetch('http://localhost:8080/api/salary/getThisMonthSalaries')
//       .then(response => response.json())
//       .then(data => {
//         console.log('Datos recibidos para los salarios de este mes:', data);
//         setSalaries(data);
//         setShowExtraColumns(true);
//         calculateMonthlySalaries();
//       })
//       .catch(error => {
//         console.error('Error al obtener los salarios de este mes:', error);
//       });
//   };

//   const fetchMonthSalaries = () => {
//     if (selectedMonth !== '') {
//       fetch(`http://localhost:8080/api/salary/getMonthSalaries/${selectedMonth}`)
//         .then(response => response.json())
//         .then(data => {
//           console.log(`Datos recibidos para ${selectedMonth} salarios:`, data);
//           setSalaries(data);
//         })
//         .catch(error => {
//           console.error(`Error al recuperar ${selectedMonth} salarios:`, error);
//         });
//     } else {
//       console.warn('Por favor seleccione un mes.');
//     }
//   };

//   const calculateAllEmployeesDailySalary = () => {
//     fetch('http://localhost:8080/salary/calculateAll')
//       .then(response => {
//         if (response.ok) {
//           console.log('Los salarios diarios de todos los empleados se calcularon correctamente.');
//         } else {
//           throw new Error('No se pudieron calcular los salarios diarios de todos los empleados.');
//         }
//       })
//       .catch(error => {
//         console.error('Error al calcular los salarios diarios de todos los empleados:', error);
//       });
//   };

//   const calculateMonthlySalaries = () => {
//     fetch('http://localhost:8080/api/salary/calculateMonthlySalaries', {
//       method: 'POST'
//     })
//       .then(response => response.text())
//       .then(data => {
//         console.log('Resultado del cálculo de salarios mensuales:', data);
//       })
//       .catch(error => {
//         console.error('Error al calcular los salarios mensuales:', error);
//       });
//   };

//   const handleMonthChange = (event) => {
//     setSelectedMonth(event.target.value);
//   };

//   const handleSearch = () => {
//     fetchMonthSalaries();
//   };

//   const clearSearch = () => {
//     setSelectedMonth('');
//     fetchAllMonthSalaries();
//   };

//   const handleDownloadPDF = () => {
//     const doc = new jsPDF();
    
//     // Adding the title to the PDF
//     const title = `${selectedMonth || 'All'} 2024 Salary Report`;
//     doc.text(title, 14, 10);
  
//     const tableHeaders = showExtraColumns ? [
//       'Nombre del Empleado', 'PPH (S/.)', 'HNT', 'PTPHN (S/.)', 'PPOE (S/.)', 'HE',
//       'PTPHE (S/.)', 'Pago Total sin Bonos ni Deducciones (S/.)', '	Bonificaciones (S/.)', 'Deducciones (S/.)', 'Mes', 'Pago Bruto (S/.)'
//     ] : [
//       'Nombre del Empleado', 'Pago por Hora (S/.)', '	Horas Normales Trabajadas', 'Pago Total por Horas Normales (S/.)', 'Pago por Hora Extra (S/.)', 'Horas Extra',
//       'Pago Total por Horas Extra (S/.)', 'Pago Bruto (S/.)'
//     ];
  
//     const tableData = salaries.map(row => showExtraColumns ? [
//       row.empName, row.payPerHours, row.workedHours, row.totalHourPayment, row.payPerOvertimeHour, row.othours,
//       row.totalOvertimePayment, row.paymentWithoutAdditional, row.bonus, row.deduction, row.month, row.grossPayment
//     ] : [
//       row.empName, row.payPerHours, row.workedHours, row.totalHourPayment, row.payPerOvertimeHour, row.othours,
//       row.totalOvertimePayment, row.grossPayment
//     ]);
  
//     doc.autoTable({
//       head: [tableHeaders],
//       body: tableData,
//       startY: 20, // Adjusting startY to leave space for the title
//       margin: { top: 15 },
//       styles: { overflow: 'linebreak' }
//     });
  
//     doc.save(`monthly_salaries_${selectedMonth || 'all'}.pdf`);
//   };
  
  

//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = salaries.slice(indexOfFirstItem, indexOfLastItem);

//   const onPageChange = (page) => setCurrentPage(page);

//   return (
//     <div>
//       <div className="flex items-center m-4 justify-between border-b bg-white dark:bg-gray-500 p-3 shadow-md rounded-md">
//         <div className="flex gap-4 ml-50">
//           <Button
//             color='success'
//             size='s'
//             className="px-4 py-2 bg-green-500 hover:bg-blue-800 text-white rounded-md"
//             onClick={fetchTodaySalaries}
//           >
//             Salarios de hoy
//           </Button>
//           <Button
//             color='success'
//             size='s'
//             className="px-4 py-2 bg-green-500 hover:bg-blue-800 text-white rounded-md"
//             onClick={fetchThisMonthSalaries}
//           >
//             Salarios mensuales
//           </Button>
//           <Select id="month" value={selectedMonth} onChange={handleMonthChange}>
//             <option value="">Seleccionar mes</option>
//             <option value="January">Enero</option>
//             <option value="February">Febrero</option>
//             <option value="March">Marzo</option>
//             <option value="April">Abril</option>
//             <option value="May">Mayo</option>
//             <option value="June">Junio</option>
//             <option value="July">Julio</option>
//             <option value="August">Agosto</option>
//             <option value="September">Setiembre</option>
//             <option value="October">Octubre</option>
//             <option value="November">Noviembre</option>
//             <option value="December">Diciembre</option>
//             {/* Add other months as needed */}
//           </Select>
//           <Button
//             color='success'
//             size='s'
//             className="px-4 py-2 bg-green-500 hover:bg-blue-800 text-white rounded-md"
//             onClick={handleSearch}
//           >
//             Buscar
//           </Button>
//           <Button
//             color='warning'
//             size='s'
//             className="px-4 py-2 bg-yellow-500 hover:bg-yellow-800 text-white rounded-md"
//             onClick={clearSearch}
//           >
//             Vaciar
//           </Button>
//           <FaCloudDownloadAlt size={32} onClick={handleDownloadPDF} />
//         </div>
//       </div>

//       <div className="overflow-x-auto mr-8 ml-8 mt-8 border shadow">
//         <Table>
//           <Table.Head>
//             <Table.HeadCell>Nombre del empleado</Table.HeadCell>
//             <Table.HeadCell>Pago por hora (S/.)</Table.HeadCell>
//             <Table.HeadCell>Trabajo por horas normales</Table.HeadCell>
//             <Table.HeadCell className="text-red-600"> Pago total por horas normales (S/)</Table.HeadCell>
//             <Table.HeadCell>Pago por hora extra (S/)</Table.HeadCell>
//             <Table.HeadCell>Horas extra</Table.HeadCell>
//             <Table.HeadCell className="text-red-600"> Pago total por horas extra (S/)</Table.HeadCell>
//             {showExtraColumns && (
//               <>
//                 <Table.HeadCell> Pago total sin bonos ni deducciones (S/)</Table.HeadCell>
//                 <Table.HeadCell>Tipo de bonificación</Table.HeadCell>
//                 <Table.HeadCell className="text-green-600">Bonificaciones (S/)</Table.HeadCell>
//                 <Table.HeadCell>Tipo de deducción</Table.HeadCell>
//                 <Table.HeadCell className="text-blue-800">Deducciones (S/)</Table.HeadCell>
//                 <Table.HeadCell>Mes</Table.HeadCell>
//               </>
//             )}
//             <Table.HeadCell className="text-red-600"> Pago bruto (S/)</Table.HeadCell>
//           </Table.Head>
//           <Table.Body className="divide-y">
//             {currentItems.map((salary, index) => (
//               <Table.Row key={index}>
//                 <Table.Cell>{salary.empName}</Table.Cell>
//                 <Table.Cell>{salary.payPerHours}</Table.Cell>
//                 <Table.Cell>{salary.workedHours}</Table.Cell>
//                 <Table.Cell>{salary.totalHourPayment}</Table.Cell>
//                 <Table.Cell>{salary.payPerOvertimeHour}</Table.Cell>
//                 <Table.Cell>{salary.othours}</Table.Cell>
//                 <Table.Cell>{salary.totalOvertimePayment}</Table.Cell>
//                 {showExtraColumns && (
//                   <>
//                     <Table.Cell>{salary.paymentWithoutAdditional}</Table.Cell>
//                     <Table.Cell>{salary.bonusType}</Table.Cell>
//                     <Table.Cell>{salary.bonus}</Table.Cell>
//                     <Table.Cell>{salary.deductionType}</Table.Cell>
//                     <Table.Cell>{salary.deduction}</Table.Cell>
//                     <Table.Cell>{salary.month}</Table.Cell>
//                   </>
//                 )}
//                 <Table.Cell>{salary.grossPayment}</Table.Cell>
//               </Table.Row>
//             ))}
//           </Table.Body>
//         </Table>
//       </div>

//       <div className="flex justify-center mt-4">
//         <Pagination
//           currentPage={currentPage}
//           totalPages={Math.ceil(salaries.length / itemsPerPage)}
//           onPageChange={onPageChange}
//         />
//       </div>
//     </div>
//   );
// }

// export default EmpSalaries;

import React, { useEffect, useState, useRef } from 'react';
import { Table, Button, Pagination, Alert } from "flowbite-react";
import { FaCloudDownloadAlt } from "react-icons/fa";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import Swal from 'sweetalert2';
import Select from 'react-select';
import DataTable from 'datatables.net-dt';

function EmpSalaries() {
  const [salaries, setSalaries] = useState([]);
  const [showExtraColumns, setShowExtraColumns] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 5;
  const tableRef = useRef(null);

  // Opciones para el Select
  const monthOptions = [
    { value: 'January', label: 'Enero' },
    { value: 'February', label: 'Febrero' },
    { value: 'March', label: 'Marzo' },
    { value: 'April', label: 'Abril' },
    { value: 'May', label: 'Mayo' },
    { value: 'June', label: 'Junio' },
    { value: 'July', label: 'Julio' },
    { value: 'August', label: 'Agosto' },
    { value: 'September', label: 'Setiembre' },
    { value: 'October', label: 'Octubre' },
    { value: 'November', label: 'Noviembre' },
    { value: 'December', label: 'Diciembre' }
  ];

  useEffect(() => {
    fetchAllMonthSalaries();
    return () => {
      // Clean up DataTable when component unmounts
      if ($.fn.dataTable.isDataTable('#salariesTable')) {
        $('#salariesTable').DataTable().destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (tableRef.current && salaries.length > 0) {
      initializeDataTable();
    }
  }, [salaries, showExtraColumns]);

  const initializeDataTable = () => {
    if ($.fn.dataTable.isDataTable('#salariesTable')) {
      $('#salariesTable').DataTable().destroy();
    }
    
    $(tableRef.current).DataTable({
      responsive: true,
      paging: false,
      searching: true,
      ordering: true,
      info: false,
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json'
      }
    });
  };

  const fetchAllMonthSalaries = () => {
    setIsLoading(true);
    fetch('http://localhost:8080/api/salary/getAllMonthSalaries')
      .then(response => response.json())
      .then(data => {
        setSalaries(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error al recuperar los salarios:', error);
        setIsLoading(false);
        Swal.fire('Error', 'No se pudieron cargar los salarios', 'error');
      });
  };

  const fetchTodaySalaries = () => {
    setIsLoading(true);
    fetch('http://localhost:8080/salary/currentDateSalaries')
      .then(response => response.json())
      .then(data => {
        setSalaries(data);
        setShowExtraColumns(false);
        setIsLoading(false);
        calculateAllEmployeesDailySalary();
      })
      .catch(error => {
        console.error('Error al obtener los salarios:', error);
        setIsLoading(false);
        Swal.fire('Error', 'No se pudieron cargar los salarios de hoy', 'error');
      });
  };

  const fetchThisMonthSalaries = () => {
    setIsLoading(true);
    fetch('http://localhost:8080/api/salary/getThisMonthSalaries')
      .then(response => response.json())
      .then(data => {
        setSalaries(data);
        setShowExtraColumns(true);
        setIsLoading(false);
        calculateMonthlySalaries();
      })
      .catch(error => {
        console.error('Error al obtener los salarios:', error);
        setIsLoading(false);
        Swal.fire('Error', 'No se pudieron cargar los salarios del mes', 'error');
      });
  };

  const fetchMonthSalaries = () => {
    if (!selectedMonth) {
      Swal.fire('Advertencia', 'Por favor seleccione un mes', 'warning');
      return;
    }

    setIsLoading(true);
    fetch(`http://localhost:8080/api/salary/getMonthSalaries/${selectedMonth.value}`)
      .then(response => response.json())
      .then(data => {
        setSalaries(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error al obtener los salarios:', error);
        setIsLoading(false);
        Swal.fire('Error', `No se pudieron cargar los salarios de ${selectedMonth.label}`, 'error');
      });
  };

  const calculateAllEmployeesDailySalary = () => {
    fetch('http://localhost:8080/salary/calculateAll')
      .then(response => {
        if (response.ok) {
          Swal.fire('Éxito', 'Salarios diarios calculados correctamente', 'success');
        } else {
          throw new Error('Error en el cálculo');
        }
      })
      .catch(error => {
        console.error('Error al calcular salarios:', error);
        Swal.fire('Error', 'No se pudieron calcular los salarios diarios', 'error');
      });
  };

  const calculateMonthlySalaries = () => {
    fetch('http://localhost:8080/api/salary/calculateMonthlySalaries', {
      method: 'POST'
    })
      .then(response => response.text())
      .then(data => {
        Swal.fire('Éxito', 'Salarios mensuales calculados correctamente', 'success');
      })
      .catch(error => {
        console.error('Error al calcular salarios:', error);
        Swal.fire('Error', 'No se pudieron calcular los salarios mensuales', 'error');
      });
  };

  const handleSearch = () => {
    fetchMonthSalaries();
  };

  const clearSearch = () => {
    setSelectedMonth(null);
    fetchAllMonthSalaries();
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const title = `${selectedMonth ? selectedMonth.label : 'Todos'} - Reporte de Salarios`;
    
    doc.text(title, 14, 10);
    
    const headers = showExtraColumns ? [
       'Nombre del Empleado', 'PPH (S/.)', 'HNT', 'PTPHN (S/.)', 'PPOE (S/.)', 'HE',
      'PTPHE (S/.)', 'Pago Total sin Bonos ni Deducciones (S/.)', '	Bonificaciones (S/.)', 'Deducciones (S/.)', 'Mes', 'Pago Bruto (S/.)'
    ] : [
      'Nombre del Empleado', 'Pago por Hora (S/.)', '	Horas Normales Trabajadas', 'Pago Total por Horas Normales (S/.)', 'Pago por Hora Extra (S/.)', 'Horas Extra',
      'Pago Total por Horas Extra (S/.)', 'Pago Bruto (S/.)'
    ];
  
    const data = salaries.map(row => showExtraColumns ? [
      row.empName, row.payPerHours, row.workedHours, row.totalHourPayment, row.payPerOvertimeHour, row.othours,
      row.totalOvertimePayment, row.paymentWithoutAdditional, row.bonus, row.deduction, row.month, row.grossPayment
    ] : [
      row.empName, row.payPerHours, row.workedHours, row.totalHourPayment, row.payPerOvertimeHour, row.othours,
      row.totalOvertimePayment, row.grossPayment
    ]);
  
    doc.autoTable({
      head: [headers],
      body: data,
      startY: 20,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [22, 160, 133] }
    });
  
    doc.save(`reporte_salarios_${selectedMonth ? selectedMonth.value : 'todos'}.pdf`);
  };

  const customStyles = {
    control: (provided) => ({
      ...provided,
      minHeight: '42px',
      borderRadius: '6px',
      borderColor: '#d1d5db',
      '&:hover': {
        borderColor: '#9ca3af'
      }
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#e5e7eb' : 'white',
      color: state.isSelected ? 'white' : '#1f2937',
      '&:active': {
        backgroundColor: '#3b82f6',
        color: 'white'
      }
    })
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = salaries.slice(indexOfFirstItem, indexOfLastItem);

  const onPageChange = (page) => setCurrentPage(page);

  return (
    <div className="p-4">
      {/* Filter Controls */}
      <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-4 mb-4">
        <div className="flex flex-wrap items-center gap-4">
          <Button
            color="success"
            onClick={fetchTodaySalaries}
            disabled={isLoading}
            className="flex-1 sm:flex-none"
          >
            Salarios de hoy
          </Button>
          <Button
            color="success"
            onClick={fetchThisMonthSalaries}
            disabled={isLoading}
            className="flex-1 sm:flex-none"
          >
            Salarios mensuales
          </Button>
          
          <div className="flex-1 min-w-[200px]">
            <Select
              value={selectedMonth}
              onChange={setSelectedMonth}
              options={monthOptions}
              placeholder="Seleccionar mes..."
              isClearable
              styles={customStyles}
              isLoading={isLoading}
              noOptionsMessage={() => "No hay opciones disponibles"}
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>

          <Button
            color="success"
            onClick={handleSearch}
            disabled={isLoading || !selectedMonth}
            className="flex-1 sm:flex-none"
          >
            Buscar
          </Button>
          <Button
            color="warning"
            onClick={clearSearch}
            disabled={isLoading}
            className="flex-1 sm:flex-none"
          >
            Limpiar
          </Button>
          <Button
            color="light"
            onClick={handleDownloadPDF}
            disabled={isLoading || salaries.length === 0}
            className="flex-1 sm:flex-none"
          >
            <FaCloudDownloadAlt className="mr-2" /> Exportar PDF
          </Button>
        </div>
      </div>

      {/* Loading Indicator */}
      {isLoading && (
        <div className="text-center my-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-2">Cargando datos...</p>
        </div>
      )}

      {/* Data Table */}
      <div className="bg-white dark:bg-gray-700 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table id="salariesTable" ref={tableRef} className="w-full">
            <thead className="bg-gray-100 dark:bg-gray-600">
              <tr>
                <th>Nombre del empleado</th>
                <th>Pago por hora (S/.)</th>
                <th>Horas normales</th>
                <th className="text-red-600">Total horas normales (S/.)</th>
                <th>Pago hora extra (S/.)</th>
                <th>Horas extra</th>
                <th className="text-red-600">Total horas extra (S/.)</th>
                {showExtraColumns && (
                  <>
                    <th>Total sin bonos (S/.)</th>
                    <th>Tipo bonificación</th>
                    <th className="text-green-600">Bonos (S/.)</th>
                    <th>Tipo deducción</th>
                    <th className="text-blue-800">Deducciones (S/.)</th>
                    <th>Mes</th>
                  </>
                )}
                <th className="text-red-600">Pago bruto (S/.)</th>
              </tr>
            </thead>
            <tbody>
              {salaries.map((salary, index) => (
                <tr key={index} className="border-t hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td>{salary.empName}</td>
                  <td>{salary.payPerHours}</td>
                  <td>{salary.workedHours}</td>
                  <td>{salary.totalHourPayment}</td>
                  <td>{salary.payPerOvertimeHour}</td>
                  <td>{salary.othours}</td>
                  <td>{salary.totalOvertimePayment}</td>
                  {showExtraColumns && (
                    <>
                      <td>{salary.paymentWithoutAdditional}</td>
                      <td>{salary.bonusType}</td>
                      <td>{salary.bonus}</td>
                      <td>{salary.deductionType}</td>
                      <td>{salary.deduction}</td>
                      <td>{salary.month}</td>
                    </>
                  )}
                  <td>{salary.grossPayment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {salaries.length === 0 && !isLoading && (
          <div className="text-center p-4 text-gray-500">
            No se encontraron registros de salarios
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(salaries.length / itemsPerPage)}
          onPageChange={onPageChange}
          showIcons
        />
      </div>
    </div>
  );
}

export default EmpSalaries;