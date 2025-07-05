

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, TextInput } from "flowbite-react";
import DataTable from 'react-data-table-component';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function ViewAttendance() {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const currentDate = new Date().toISOString().split('T')[0];
  const formattedDate = new Date().toLocaleDateString('es-ES');

  // Configuración de columnas responsivas
  const columns = [
    {
      name: 'ID',
      selector: row => row.empId,
      sortable: true,
      width: '80px',
      omit: window.innerWidth < 768
    },
    {
      name: window.innerWidth < 640 ? 'Nombre' : 'Nombre del empleado',
      selector: row => row.empName,
      sortable: true,
      grow: 1,
      wrap: true
    },
    {
      name: 'Rol',
      selector: row => translatePosition(row.position),
      sortable: true,
      width: '100px',
      omit: window.innerWidth < 640
    },
    {
      name: 'Estado',
      cell: row => {
        const isAbsent = attendanceRecords.some(
          record => record.empId === row.empId && record.inTime === "00:00"
        );
        return (
          <span className={`font-semibold ${isAbsent ? 'text-red-600' : 'text-gray-500'}`}>
            {isAbsent ? 'Ausente' : 'Sin marcar'}
          </span>
        );
      },
      sortable: true,
      width: '100px'
    },
    {
      name: 'Acciones',
      cell: row => {
        const isAbsent = attendanceRecords.some(
          record => record.empId === row.empId && record.inTime === "00:00"
        );
        return (
          <Button 
            size="xs" 
            color={isAbsent ? "gray" : "blue"} 
            onClick={() => markAsAbsent(row)}
            disabled={isAbsent}
          >
            {window.innerWidth < 640 ? (isAbsent ? '✓' : 'Marcar') : (isAbsent ? 'Marcado' : 'Marcar Ausente')}
          </Button>
        );
      },
      width: window.innerWidth < 640 ? '80px' : '150px'
    }
  ];

  // Traducir el cargo
  const translatePosition = (position) => {
    const translations = {
      'manager': 'Gerente',
      'cashier': 'Cajero',
      'waiter': 'Mesero',
      'chef': 'Chef',
      'default': position
    };
    return translations[position?.toLowerCase()] || translations['default'];
  };

  // Cargar datos iniciales
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Obtener lista de empleados (excluyendo al manager)
      const [empResponse, attResponse] = await Promise.all([
        axios.get(`${import.meta.env.REACT_APP_API_URL}/employeeDetails`),
        axios.get(`${import.meta.env.REACT_APP_API_URL}/current-date`)
      ]);

      // Procesar empleados
      const employeeList = empResponse.data
        .filter(emp => emp[2].toLowerCase() !== 'manager')
        .map(emp => ({
          empId: emp[0],
          empName: emp[1],
          position: emp[2]
        }));

      setEmployees(employeeList);
      setFilteredEmployees(employeeList);
      setAttendanceRecords(attResponse.data);
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      setLoading(false);
      Swal.fire({
        title: 'Error',
        text: 'No se pudieron cargar los datos',
        icon: 'error',
        confirmButtonText: 'Entendido',
        customClass: {
          container: 'swal-responsive',
          popup: 'swal-responsive-popup',
          title: 'swal-responsive-title',
          confirmButton: 'swal-responsive-confirm'
        }
      });
    }
  };

  useEffect(() => {
    fetchData();
    const handleResize = () => window.dispatchEvent(new Event('resize'));
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filtrar empleados por término de búsqueda
  useEffect(() => {
    if (searchTerm === '') {
      setFilteredEmployees(employees);
    } else {
      const filtered = employees.filter(emp => 
        emp.empName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.empId.toString().includes(searchTerm)
      );
      setFilteredEmployees(filtered);
    }
  }, [searchTerm, employees]);

  // Marcar empleado como ausente
  const markAsAbsent = (employee) => {
    Swal.fire({
      title: 'Confirmar Ausencia',
      html: `¿Marcar a <strong>${employee.empName}</strong> como ausente hoy?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, marcar',
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: true,
      customClass: {
        container: 'swal-responsive',
        popup: 'swal-responsive-popup',
        title: 'swal-responsive-title',
        htmlContainer: 'swal-responsive-html',
        confirmButton: 'swal-responsive-confirm',
        cancelButton: 'swal-responsive-cancel'
      },
      preConfirm: () => {
        return axios.post(`${import.meta.env.REACT_APP_API_URL}attendance/in`, {
          empId: employee.empId,
          empName: employee.empName,
          position: employee.position,
          date: currentDate,
          inTime: "00:00",
          outTime: "00:00"
        }).then(response => response.data)
          .catch(error => {
            Swal.showValidationMessage('Error al marcar como ausente');
            console.error('Error:', error);
          });
      }
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Éxito',
          text: `${employee.empName} marcado como ausente`,
          icon: 'success',
          confirmButtonText: 'Aceptar',
          customClass: {
            container: 'swal-responsive',
            popup: 'swal-responsive-popup',
            title: 'swal-responsive-title',
            confirmButton: 'swal-responsive-confirm'
          }
        });
        fetchData();
      }
    });
  };

  // Marcar todos los empleados como ausentes
  const markAllAbsent = () => {
    const unmarkedEmployees = employees.filter(emp => 
      !attendanceRecords.some(r => r.empId === emp.empId && r.inTime === "00:00")
    );

    if (unmarkedEmployees.length === 0) {
      Swal.fire({
        title: 'Información',
        text: 'Todos los empleados ya están marcados como ausentes',
        icon: 'info',
        confirmButtonText: 'Entendido',
        customClass: {
          container: 'swal-responsive',
          popup: 'swal-responsive-popup',
          title: 'swal-responsive-title',
          confirmButton: 'swal-responsive-confirm'
        }
      });
      return;
    }

    Swal.fire({
      title: 'Confirmar Ausencias',
      html: `¿Marcar a <strong>${unmarkedEmployees.length}</strong> empleado(s) como ausente(s)?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, marcar todos',
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: true,
      customClass: {
        container: 'swal-responsive',
        popup: 'swal-responsive-popup',
        title: 'swal-responsive-title',
        htmlContainer: 'swal-responsive-html',
        confirmButton: 'swal-responsive-confirm',
        cancelButton: 'swal-responsive-cancel'
      },
      preConfirm: () => {
        const attendanceData = unmarkedEmployees.map(employee => ({
          empId: employee.empId,
          empName: employee.empName,
          position: employee.position,
          date: currentDate,
          inTime: "00:00",
          outTime: "00:00"
        }));

        return axios.post(`${import.meta.env.REACT_APP_API_URL}/attendances`, attendanceData)
          .then(response => response.data)
          .catch(error => {
            Swal.showValidationMessage('Error al marcar ausentes');
            console.error('Error:', error);
          });
      }
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Éxito',
          text: `${unmarkedEmployees.length} empleados marcados como ausentes`,
          icon: 'success',
          confirmButtonText: 'Aceptar',
          customClass: {
            container: 'swal-responsive',
            popup: 'swal-responsive-popup',
            title: 'swal-responsive-title',
            confirmButton: 'swal-responsive-confirm'
          }
        });
        fetchData();
      }
    });
  };

  // Exportar PDF de todos los empleados
  const exportAllPDF = () => {
    Swal.fire({
      title: 'Generando reporte',
      html: 'Preparando documento PDF...',
      timerProgressBar: true,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
      customClass: {
        container: 'swal-responsive',
        popup: 'swal-responsive-popup'
      }
    });

    setTimeout(() => {
      try {
        const doc = new jsPDF({
          orientation: 'landscape',
          unit: 'mm'
        });
        
        // Encabezado
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.text(`Reporte de Asistencia - ${formattedDate}`, 14, 15);
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text(`Total empleados: ${employees.length}`, 14, 22);

        // Datos de la tabla (ajustados para landscape)
        const data = employees.map((emp, index) => {
          const isAbsent = attendanceRecords.some(
            record => record.empId === emp.empId && record.inTime === "00:00"
          );
          
          return [
            index + 1,
            emp.empId,
            emp.empName,
            translatePosition(emp.position),
            isAbsent ? 'Ausente' : 'Sin marcar',
            isAbsent ? '00:00' : '--',
            isAbsent ? '00:00' : '--'
          ];
        });

        doc.autoTable({
          startY: 30,
          head: [['#', 'ID', 'Nombre', 'Cargo', 'Estado', 'Entrada', 'Salida']],
          body: data,
          margin: { left: 10, right: 10 },
          styles: {
            fontSize: 8,
            cellPadding: 2,
            overflow: 'linebreak'
          },
          headStyles: {
            fillColor: [41, 128, 185],
            textColor: 255,
            fontStyle: 'bold',
            fontSize: 9
          },
          columnStyles: {
            0: { cellWidth: 8 },
            1: { cellWidth: 15 },
            2: { cellWidth: 40 },
            3: { cellWidth: 25 },
            4: { cellWidth: 15 },
            5: { cellWidth: 15 },
            6: { cellWidth: 15 }
          },
          didDrawPage: function (data) {
            // Pie de página
            doc.setFontSize(8);
            doc.text(`Página ${data.pageNumber}`, data.settings.margin.left, doc.internal.pageSize.height - 10);
          }
        });

        doc.save(`Reporte_Asistencia_${currentDate}.pdf`);
        
        Swal.fire({
          title: 'Reporte generado',
          text: 'El PDF se ha descargado correctamente',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          customClass: {
            container: 'swal-responsive',
            popup: 'swal-responsive-popup',
            title: 'swal-responsive-title',
            confirmButton: 'swal-responsive-confirm'
          }
        });
      } catch (error) {
        console.error('Error al generar PDF:', error);
        Swal.fire({
          title: 'Error',
          text: 'Ocurrió un error al generar el PDF',
          icon: 'error',
          confirmButtonText: 'Entendido',
          customClass: {
            container: 'swal-responsive',
            popup: 'swal-responsive-popup',
            title: 'swal-responsive-title',
            confirmButton: 'swal-responsive-confirm'
          }
        });
      }
    }, 500);
  };

  return (
    <div className="w-full p-2 sm:p-4">
      <div className="bg-white rounded-lg shadow p-2 sm:p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-3 gap-3">
          <div>
            <h1 className="text-lg sm:text-xl font-bold">Control de Ausencias</h1>
            <p className="text-xs sm:text-sm text-gray-500">{formattedDate}</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <TextInput
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs sm:text-sm"
            />
            
            <div className="flex gap-2">
              <Button 
                color="gray" 
                onClick={exportAllPDF}
                className="flex-1 text-xs sm:text-sm"
              >
                Exportar PDF
              </Button>
              <Button 
                color="blue" 
                onClick={markAllAbsent}
                disabled={employees.length === attendanceRecords.filter(r => r.inTime === "00:00").length}
                className="flex-1 text-xs sm:text-sm"
              >
                Marcar Todos
              </Button>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <DataTable
            columns={columns}
            data={filteredEmployees}
            progressPending={loading}
            progressComponent={<div className="py-8 text-sm">Cargando datos...</div>}
            noDataComponent={<div className="py-8 text-sm">No hay empleados registrados</div>}
            pagination
            paginationPerPage={10}
            paginationRowsPerPageOptions={[5, 10, 15]}
            highlightOnHover
            responsive
            customStyles={{
              headCells: {
                style: {
                  backgroundColor: '#f3f4f6',
                  fontWeight: 'bold',
                  fontSize: '12px'
                }
              },
              cells: {
                style: {
                  padding: '6px',
                  fontSize: '12px'
                }
              },
              pagination: {
                style: {
                  fontSize: '12px'
                }
              }
            }}
          />
        </div>
      </div>

      {/* Estilos para SweetAlert responsive */}
      <style jsx global>{`
        @media (max-width: 640px) {
          .swal-responsive-popup {
            width: 90% !important;
            max-width: 300px !important;
            font-size: 0.9rem !important;
          }
          .swal-responsive-title {
            font-size: 1.1rem !important;
          }
          .swal-responsive-html {
            font-size: 0.9rem !important;
          }
          .swal-responsive-confirm, .swal-responsive-cancel {
            padding: 0.4rem 0.8rem !important;
            font-size: 0.9rem !important;
          }
        }
        .swal-responsive-confirm {
          background-color: #3085d6 !important;
        }
        .swal-responsive-cancel {
          background-color: #d33 !important;
        }
      `}</style>
    </div>
  );
}

export default ViewAttendance;