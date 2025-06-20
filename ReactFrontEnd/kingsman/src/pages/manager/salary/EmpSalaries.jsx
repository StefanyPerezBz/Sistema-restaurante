import React, { useEffect, useState } from 'react';
import { Table, Button, Pagination, Select } from "flowbite-react";
import { FaCloudDownloadAlt } from "react-icons/fa";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

function EmpSalaries() {
  const [salaries, setSalaries] = useState([]);
  const [showExtraColumns, setShowExtraColumns] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState('');
  const itemsPerPage = 5;

  useEffect(() => {
    fetchAllMonthSalaries();
  }, []);

  const fetchAllMonthSalaries = () => {
    fetch('http://localhost:8080/api/salary/getAllMonthSalaries')
      .then(response => response.json())
      .then(data => {
        console.log('Data received:', data);
        setSalaries(data);
      })
      .catch(error => {
        console.error('Error al recuperar los salarios de todos los meses:', error);
      });
  };

  const fetchTodaySalaries = () => {
    fetch('http://localhost:8080/salary/currentDateSalaries')
      .then(response => response.json())
      .then(data => {
        console.log('Data received for today salaries:', data);
        setSalaries(data);
        setShowExtraColumns(false);
        calculateAllEmployeesDailySalary();
      })
      .catch(error => {
        console.error('Error al obtener los salarios de hoy:', error);
      });
  };

  const fetchThisMonthSalaries = () => {
    fetch('http://localhost:8080/api/salary/getThisMonthSalaries')
      .then(response => response.json())
      .then(data => {
        console.log('Datos recibidos para los salarios de este mes:', data);
        setSalaries(data);
        setShowExtraColumns(true);
        calculateMonthlySalaries();
      })
      .catch(error => {
        console.error('Error al obtener los salarios de este mes:', error);
      });
  };

  const fetchMonthSalaries = () => {
    if (selectedMonth !== '') {
      fetch(`http://localhost:8080/api/salary/getMonthSalaries/${selectedMonth}`)
        .then(response => response.json())
        .then(data => {
          console.log(`Datos recibidos para ${selectedMonth} salarios:`, data);
          setSalaries(data);
        })
        .catch(error => {
          console.error(`Error al recuperar ${selectedMonth} salarios:`, error);
        });
    } else {
      console.warn('Por favor seleccione un mes.');
    }
  };

  const calculateAllEmployeesDailySalary = () => {
    fetch('http://localhost:8080/salary/calculateAll')
      .then(response => {
        if (response.ok) {
          console.log('Los salarios diarios de todos los empleados se calcularon correctamente.');
        } else {
          throw new Error('No se pudieron calcular los salarios diarios de todos los empleados.');
        }
      })
      .catch(error => {
        console.error('Error al calcular los salarios diarios de todos los empleados:', error);
      });
  };

  const calculateMonthlySalaries = () => {
    fetch('http://localhost:8080/api/salary/calculateMonthlySalaries', {
      method: 'POST'
    })
      .then(response => response.text())
      .then(data => {
        console.log('Resultado del cálculo de salarios mensuales:', data);
      })
      .catch(error => {
        console.error('Error al calcular los salarios mensuales:', error);
      });
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleSearch = () => {
    fetchMonthSalaries();
  };

  const clearSearch = () => {
    setSelectedMonth('');
    fetchAllMonthSalaries();
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    
    // Adding the title to the PDF
    const title = `${selectedMonth || 'All'} 2024 Salary Report`;
    doc.text(title, 14, 10);
  
    const tableHeaders = showExtraColumns ? [
      'Nombre del Empleado', 'PPH (S/.)', 'HNT', 'PTPHN (S/.)', 'PPOE (S/.)', 'HE',
      'PTPHE (S/.)', 'Pago Total sin Bonos ni Deducciones (S/.)', '	Bonificaciones (S/.)', 'Deducciones (S/.)', 'Mes', 'Pago Bruto (S/.)'
    ] : [
      'Nombre del Empleado', 'Pago por Hora (S/.)', '	Horas Normales Trabajadas', 'Pago Total por Horas Normales (S/.)', 'Pago por Hora Extra (S/.)', 'Horas Extra',
      'Pago Total por Horas Extra (S/.)', 'Pago Bruto (S/.)'
    ];
  
    const tableData = salaries.map(row => showExtraColumns ? [
      row.empName, row.payPerHours, row.workedHours, row.totalHourPayment, row.payPerOvertimeHour, row.othours,
      row.totalOvertimePayment, row.paymentWithoutAdditional, row.bonus, row.deduction, row.month, row.grossPayment
    ] : [
      row.empName, row.payPerHours, row.workedHours, row.totalHourPayment, row.payPerOvertimeHour, row.othours,
      row.totalOvertimePayment, row.grossPayment
    ]);
  
    doc.autoTable({
      head: [tableHeaders],
      body: tableData,
      startY: 20, // Adjusting startY to leave space for the title
      margin: { top: 15 },
      styles: { overflow: 'linebreak' }
    });
  
    doc.save(`monthly_salaries_${selectedMonth || 'all'}.pdf`);
  };
  
  

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = salaries.slice(indexOfFirstItem, indexOfLastItem);

  const onPageChange = (page) => setCurrentPage(page);

  return (
    <div>
      <div className="flex items-center m-4 justify-between border-b bg-white dark:bg-gray-500 p-3 shadow-md rounded-md">
        <div className="flex gap-4 ml-50">
          <Button
            color='success'
            size='s'
            className="px-4 py-2 bg-green-500 hover:bg-blue-800 text-white rounded-md"
            onClick={fetchTodaySalaries}
          >
            Salarios de hoy
          </Button>
          <Button
            color='success'
            size='s'
            className="px-4 py-2 bg-green-500 hover:bg-blue-800 text-white rounded-md"
            onClick={fetchThisMonthSalaries}
          >
            Salarios mensuales
          </Button>
          <Select id="month" value={selectedMonth} onChange={handleMonthChange}>
            <option value="">Seleccionar mes</option>
            <option value="January">Enero</option>
            <option value="February">Febreroy</option>
            <option value="March">Marzo</option>
            <option value="April">Abril</option>
            <option value="May">Mayo</option>
            <option value="June">Junio</option>
            <option value="July">Julio</option>
            <option value="August">Agosto</option>
            <option value="September">Setiembre</option>
            <option value="October">Octubre</option>
            <option value="November">Noviembre</option>
            <option value="December">Diciembre</option>
            {/* Add other months as needed */}
          </Select>
          <Button
            color='success'
            size='s'
            className="px-4 py-2 bg-green-500 hover:bg-blue-800 text-white rounded-md"
            onClick={handleSearch}
          >
            Buscar
          </Button>
          <Button
            color='warning'
            size='s'
            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-800 text-white rounded-md"
            onClick={clearSearch}
          >
            Vaciar
          </Button>
          <FaCloudDownloadAlt size={32} onClick={handleDownloadPDF} />
        </div>
      </div>

      <div className="overflow-x-auto mr-8 ml-8 mt-8 border shadow">
        <Table>
          <Table.Head>
            <Table.HeadCell>Nombre del empleado</Table.HeadCell>
            <Table.HeadCell>Pago por hora (S/.)</Table.HeadCell>
            <Table.HeadCell>Trabajo por horas normales</Table.HeadCell>
            <Table.HeadCell className="text-red-600"> Pago total por horas normales (S/)</Table.HeadCell>
            <Table.HeadCell>Pago por hora extra (S/)</Table.HeadCell>
            <Table.HeadCell>Horas extra</Table.HeadCell>
            <Table.HeadCell className="text-red-600"> Pago total por horas extra (S/)</Table.HeadCell>
            {showExtraColumns && (
              <>
                <Table.HeadCell> Pago total sin bonos ni deducciones (S/)</Table.HeadCell>
                <Table.HeadCell>Tipo de bonificación</Table.HeadCell>
                <Table.HeadCell className="text-green-600">Bonificaciones (S/)</Table.HeadCell>
                <Table.HeadCell>Tipo de deducción</Table.HeadCell>
                <Table.HeadCell className="text-blue-800">Deducciones (S/)</Table.HeadCell>
                <Table.HeadCell>Mes</Table.HeadCell>
              </>
            )}
            <Table.HeadCell className="text-red-600"> Pago bruto (S/)</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {currentItems.map((salary, index) => (
              <Table.Row key={index}>
                <Table.Cell>{salary.empName}</Table.Cell>
                <Table.Cell>{salary.payPerHours}</Table.Cell>
                <Table.Cell>{salary.workedHours}</Table.Cell>
                <Table.Cell>{salary.totalHourPayment}</Table.Cell>
                <Table.Cell>{salary.payPerOvertimeHour}</Table.Cell>
                <Table.Cell>{salary.othours}</Table.Cell>
                <Table.Cell>{salary.totalOvertimePayment}</Table.Cell>
                {showExtraColumns && (
                  <>
                    <Table.Cell>{salary.paymentWithoutAdditional}</Table.Cell>
                    <Table.Cell>{salary.bonusType}</Table.Cell>
                    <Table.Cell>{salary.bonus}</Table.Cell>
                    <Table.Cell>{salary.deductionType}</Table.Cell>
                    <Table.Cell>{salary.deduction}</Table.Cell>
                    <Table.Cell>{salary.month}</Table.Cell>
                  </>
                )}
                <Table.Cell>{salary.grossPayment}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>

      <div className="flex justify-center mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(salaries.length / itemsPerPage)}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
}

export default EmpSalaries;
