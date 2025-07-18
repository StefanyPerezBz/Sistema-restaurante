import React, { useEffect, useState } from 'react';
import { Button, Alert } from "flowbite-react";
import { FaCloudDownloadAlt } from "react-icons/fa";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import Swal from 'sweetalert2';
import Select from 'react-select';
import DataTable from 'react-data-table-component';

function EmpSalaries() {
  const [salaries, setSalaries] = useState([]);
  const [showExtraColumns, setShowExtraColumns] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

  // Diccionario para traducción de meses
  const monthTranslations = {
    'January': 'Enero',
    'February': 'Febrero',
    'March': 'Marzo',
    'April': 'Abril',
    'May': 'Mayo',
    'June': 'Junio',
    'July': 'Julio',
    'August': 'Agosto',
    'September': 'Setiembre',
    'October': 'Octubre',
    'November': 'Noviembre',
    'December': 'Diciembre'
  };

  // Función para traducir el mes
  const translateMonth = (month) => {
    return monthTranslations[month] || month;
  };

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

  // Columnas básicas
  const baseColumns = [
    {
      name: 'Nombre del empleado',
      selector: row => row.empName,
      sortable: true,
      wrap: true
    },
    {
      name: 'Pago por hora (S/.)',
      selector: row => row.payPerHours,
      sortable: true,
      format: row => parseFloat(row.payPerHours).toFixed(2)
    },
    {
      name: 'Horas normales',
      selector: row => row.workedHours,
      sortable: true
    },
    {
      name: 'Total horas normales (S/.)',
      selector: row => row.totalHourPayment,
      sortable: true,
      format: row => parseFloat(row.totalHourPayment).toFixed(2),
      conditionalCellStyles: [
        {
          when: row => true,
          style: {
            color: 'red'
          }
        }
      ]
    },
    {
      name: 'Pago hora extra (S/.)',
      selector: row => row.payPerOvertimeHour,
      sortable: true,
      format: row => parseFloat(row.payPerOvertimeHour).toFixed(2)
    },
    {
      name: 'Horas extra',
      selector: row => row.othours,
      sortable: true
    },
    {
      name: 'Total horas extra (S/.)',
      selector: row => row.totalOvertimePayment,
      sortable: true,
      format: row => parseFloat(row.totalOvertimePayment).toFixed(2),
      conditionalCellStyles: [
        {
          when: row => true,
          style: {
            color: 'red'
          }
        }
      ]
    }
  ];

  // Columnas adicionales
  const extraColumns = [
    {
      name: 'Total sin bonos (S/.)',
      selector: row => row.paymentWithoutAdditional,
      sortable: true,
      format: row => parseFloat(row.paymentWithoutAdditional).toFixed(2)
    },
    {
      name: 'Tipo bonificación',
      selector: row => row.bonusType,
      sortable: true
    },
    {
      name: 'Bonos (S/.)',
      selector: row => row.bonus,
      sortable: true,
      format: row => parseFloat(row.bonus).toFixed(2),
      conditionalCellStyles: [
        {
          when: row => true,
          style: {
            color: 'green'
          }
        }
      ]
    },
    {
      name: 'Tipo deducción',
      selector: row => row.deductionType,
      sortable: true
    },
    {
      name: 'Deducciones (S/.)',
      selector: row => row.deduction,
      sortable: true,
      format: row => parseFloat(row.deduction).toFixed(2),
      conditionalCellStyles: [
        {
          when: row => true,
          style: {
            color: 'blue'
          }
        }
      ]
    },
    {
      name: 'Mes',
      selector: row => translateMonth(row.month),
      sortable: true
    }
  ];

  // Columna final
  const finalColumn = [
    {
      name: 'Pago bruto (S/.)',
      selector: row => row.grossPayment,
      sortable: true,
      format: row => parseFloat(row.grossPayment).toFixed(2),
      conditionalCellStyles: [
        {
          when: row => true,
          style: {
            color: 'red'
          }
        }
      ]
    }
  ];

  // Columnas combinadas según showExtraColumns
  const columns = showExtraColumns 
    ? [...baseColumns, ...extraColumns, ...finalColumn]
    : [...baseColumns, ...finalColumn];

  useEffect(() => {
    fetchAllMonthSalaries();
  }, []);

  const fetchAllMonthSalaries = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/salary/getAllMonthSalaries');
      const data = await response.json();
      setSalaries(data);
    } catch (error) {
      console.error('Error al recuperar los salarios:', error);
      Swal.fire('Error', 'No se pudieron cargar los salarios', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTodaySalaries = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/salary/currentDateSalaries');
      const data = await response.json();
      setSalaries(data);
      setShowExtraColumns(false);
      setResetPaginationToggle(!resetPaginationToggle);
      await calculateAllEmployeesDailySalary();
    } catch (error) {
      console.error('Error al obtener los salarios:', error);
      Swal.fire('Error', 'No se pudieron cargar los salarios de hoy', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchThisMonthSalaries = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/salary/getThisMonthSalaries');
      const data = await response.json();
      setSalaries(data);
      setShowExtraColumns(true);
      setResetPaginationToggle(!resetPaginationToggle);
      await calculateMonthlySalaries();
    } catch (error) {
      console.error('Error al obtener los salarios:', error);
      Swal.fire('Error', 'No se pudieron cargar los salarios del mes', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMonthSalaries = async () => {
    if (!selectedMonth) {
      Swal.fire('Advertencia', 'Por favor seleccione un mes', 'warning');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/salary/getMonthSalaries/${selectedMonth.value}`);
      const data = await response.json();
      setSalaries(data);
      setResetPaginationToggle(!resetPaginationToggle);
    } catch (error) {
      console.error('Error al obtener los salarios:', error);
      Swal.fire('Error', `No se pudieron cargar los salarios de ${selectedMonth.label}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateAllEmployeesDailySalary = async () => {
    try {
      const response = await fetch('http://localhost:8080/salary/calculateAll');
      if (response.ok) {
        Swal.fire('Éxito', 'Salarios diarios calculados correctamente', 'success');
      } else {
        throw new Error('Error en el cálculo');
      }
    } catch (error) {
      console.error('Error al calcular salarios:', error);
      Swal.fire('Error', 'No se pudieron calcular los salarios diarios', 'error');
    }
  };

  const calculateMonthlySalaries = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/salary/calculateMonthlySalaries', {
        method: 'POST'
      });
      const data = await response.text();
      Swal.fire('Éxito', 'Salarios mensuales calculados correctamente', 'success');
    } catch (error) {
      console.error('Error al calcular salarios:', error);
      Swal.fire('Error', 'No se pudieron calcular los salarios mensuales', 'error');
    }
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
      'PTPHE (S/.)', 'Pago Total sin Bonos ni Deducciones (S/.)', 'Bonificaciones (S/.)', 
      'Deducciones (S/.)', 'Mes', 'Pago Bruto (S/.)'
    ] : [
      'Nombre del Empleado', 'Pago por Hora (S/.)', 'Horas Normales Trabajadas', 
      'Pago Total por Horas Normales (S/.)', 'Pago por Hora Extra (S/.)', 'Horas Extra',
      'Pago Total por Horas Extra (S/.)', 'Pago Bruto (S/.)'
    ];
  
    const data = salaries.map(row => showExtraColumns ? [
      row.empName, 
      parseFloat(row.payPerHours).toFixed(2), 
      row.workedHours, 
      parseFloat(row.totalHourPayment).toFixed(2), 
      parseFloat(row.payPerOvertimeHour).toFixed(2), 
      row.othours, 
      parseFloat(row.totalOvertimePayment).toFixed(2), 
      parseFloat(row.paymentWithoutAdditional).toFixed(2), 
      parseFloat(row.bonus).toFixed(2), 
      parseFloat(row.deduction).toFixed(2), 
      translateMonth(row.month), // Traducimos el mes para el PDF
      parseFloat(row.grossPayment).toFixed(2)
    ] : [
      row.empName, 
      parseFloat(row.payPerHours).toFixed(2), 
      row.workedHours, 
      parseFloat(row.totalHourPayment).toFixed(2), 
      parseFloat(row.payPerOvertimeHour).toFixed(2), 
      row.othours, 
      parseFloat(row.totalOvertimePayment).toFixed(2), 
      parseFloat(row.grossPayment).toFixed(2)
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

  return (
    <div className="p-4">
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

      {isLoading && (
        <div className="text-center my-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-2">Cargando datos...</p>
        </div>
      )}

      <div className="bg-white dark:bg-gray-700 rounded-lg shadow overflow-hidden">
        <DataTable
          columns={columns}
          data={salaries}
          progressPending={isLoading}
          pagination
          paginationResetDefaultPage={resetPaginationToggle}
          persistTableHead
          noDataComponent={
            <div className="text-center p-4 text-gray-500">
              No se encontraron registros de salarios
            </div>
          }
          customStyles={{
            headCells: {
              style: {
                backgroundColor: '#f3f4f6',
                fontWeight: 'bold',
              },
            },
            cells: {
              style: {
                padding: '8px',
              },
            },
          }}
        />
      </div>
    </div>
  );
}

export default EmpSalaries;