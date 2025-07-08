
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from "flowbite-react";
import { FaEdit, FaTrash } from 'react-icons/fa';
import DataTable from 'react-data-table-component';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function ViewAttendance() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [absenteesData, setAbsenteesData] = useState([]);
  const [markedAbsentees, setMarkedAbsentees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingAbsentees, setLoadingAbsentees] = useState(true);
  const currentDate = new Date().toLocaleDateString('es-ES');
  const currentDateForFilename = new Date().toISOString().split('T')[0];

  // Configuración de DataTable para asistencias
  const attendanceColumns = [
    {
      name: 'ID',
      selector: row => row.empId,
      sortable: true,
      width: '80px'
    },
    {
      name: 'Nombre del empleado',
      selector: row => row.empName,
      sortable: true
    },
    {
      name: 'Cargo',
      selector: row => translatePosition(row.position),
      sortable: true
    },
    {
      name: 'Fecha',
      selector: row => row.date,
      sortable: true
    },
    {
      name: 'Hora de entrada',
      selector: row => row.inTime || '--',
      sortable: true
    },
    {
      name: 'Hora de salida',
      selector: row => row.outTime || '--',
      sortable: true
    }
  ];

  // Configuración de DataTable para ausentes
  const absenteesColumns = [
    {
      name: 'ID',
      selector: row => row.empId,
      sortable: true,
      width: '80px'
    },
    {
      name: 'Nombre del empleado',
      selector: row => row.empName,
      sortable: true
    },
    {
      name: 'Cargo',
      selector: row => translatePosition(row.position),
      sortable: true
    },
    {
      name: 'Estado',
      cell: row => (
        <span className={`font-semibold ${isMarkedAbsentee(row.empId) ? 'text-red-600' : 'text-gray-500'}`}>
          {isMarkedAbsentee(row.empId) ? 'Ausente' : 'Sin marcar'}
        </span>
      ),
      sortable: true
    },
    {
      name: 'Acciones',
      cell: row => (
        <Button 
          size="xs" 
          color={isMarkedAbsentee(row.empId) ? "gray" : "blue"} 
          onClick={() => markSingleAbsentee(row)}
          disabled={isMarkedAbsentee(row.empId)}
        >
          {isMarkedAbsentee(row.empId) ? 'Marcado' : 'Marcar Ausente'}
        </Button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: '150px'
    }
  ];

  // Función para traducir cargos
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

  // Verificar si un empleado ya fue marcado como ausente
  const isMarkedAbsentee = (empId) => {
    return markedAbsentees.includes(empId);
  };

  // Obtener datos de asistencia
  const fetchAttendanceData = () => {
    setLoading(true);
    axios.get(`localhost:8080/current-date`)
      .then(response => {
        setAttendanceData(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error al obtener los datos de asistencia:', error);
        setLoading(false);
        showErrorAlert('Error', 'No se pudieron cargar los datos de asistencia');
      });
  };

  // Obtener datos de empleados ausentes
  const fetchAbsenteesData = () => {
    setLoadingAbsentees(true);
    axios.get(`localhost:8080/employeeDetails`)
      .then(response => {
        const employees = response.data.map(employee => ({
          empId: employee[0],
          empName: employee[1],
          position: employee[2]
        }));
        setAbsenteesData(employees);
        
        // Obtener empleados ya marcados como ausentes
        axios.get(`localhost:8080/current-date`)
          .then(attendanceResponse => {
            const absentIds = attendanceResponse.data
              .filter(att => att.inTime === "absent")
              .map(att => att.empId);
            setMarkedAbsentees(absentIds);
            setLoadingAbsentees(false);
          });
      })
      .catch(error => {
        console.error('Error al obtener los datos de empleados:', error);
        setLoadingAbsentees(false);
        showErrorAlert('Error', 'No se pudieron cargar los datos de empleados');
      });
  };

  useEffect(() => {
    fetchAttendanceData();
    fetchAbsenteesData();
  }, []);

  const handleEditClick = (attendance) => {
    Swal.fire({
      title: 'Editar Asistencia',
      html: `
        <div class="text-left">
          <div class="mb-4">
            <label class="block text-gray-700 mb-2">Hora de Entrada</label>
            <input 
              id="inTime" 
              class="w-full px-3 py-2 border rounded" 
              value="${attendance.inTime || ''}"
              placeholder="HH:MM"
            >
          </div>
          <div>
            <label class="block text-gray-700 mb-2">Hora de Salida</label>
            <input 
              id="outTime" 
              class="w-full px-3 py-2 border rounded" 
              value="${attendance.outTime || ''}"
              placeholder="HH:MM"
            >
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      focusConfirm: false,
      preConfirm: () => {
        return {
          empId: attendance.empId,
          date: attendance.date,
          inTime: document.getElementById('inTime').value || null,
          outTime: document.getElementById('outTime').value || null
        };
      },
      customClass: {
        container: 'responsive-swal',
        popup: 'responsive-swal-popup',
        title: 'responsive-swal-title',
        htmlContainer: 'responsive-swal-html',
        confirmButton: 'swal-confirm-button',
        cancelButton: 'swal-cancel-button'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        handleSubmitEdit(result.value);
      }
    });
  };

  const handleDeleteClick = (empId, date) => {
    Swal.fire({
      title: 'Confirmar Eliminación',
      html: `¿Está seguro de que desea eliminar el registro de asistencia del empleado ${empId}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      customClass: {
        container: 'responsive-swal',
        popup: 'responsive-swal-popup',
        title: 'responsive-swal-title',
        htmlContainer: 'responsive-swal-html',
        confirmButton: 'swal-confirm-button',
        cancelButton: 'swal-cancel-button'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        deleteAttendance(empId, date);
      }
    });
  };

  const deleteAttendance = (empId, date) => {
    axios.delete(`localhost:8080/DeleteAttendance/${empId}/${date}`)
      .then(response => {
        showSuccessAlert('Éxito', 'Registro de asistencia eliminado correctamente');
        fetchAttendanceData();
        fetchAbsenteesData(); // Actualizar lista de ausentes
      })
      .catch(error => {
        console.error('Error al eliminar la asistencia:', error);
        showErrorAlert('Error', 'Ocurrió un error al eliminar el registro');
      });
  };

  const handleSubmitEdit = (formData) => {
    axios.put(`localhost:8080/update`, formData)
      .then(response => {
        showSuccessAlert('Éxito', 'Asistencia actualizada correctamente');
        fetchAttendanceData();
      })
      .catch(error => {
        console.error('Error al actualizar la asistencia:', error);
        showErrorAlert('Error', 'Ocurrió un error al actualizar el registro');
      });
  };

  const markAllAbsentees = () => {
    const unmarkedEmployees = absenteesData.filter(emp => !isMarkedAbsentee(emp.empId));
    
    if (unmarkedEmployees.length === 0) {
      showInfoAlert('Información', 'Todos los empleados ya han sido marcados como ausentes');
      return;
    }

    Swal.fire({
      title: 'Marcar Todos como Ausentes',
      html: `¿Desea marcar a <strong>${unmarkedEmployees.length}</strong> empleado(s) como ausente(s) para la fecha ${currentDate}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, marcar todos',
      cancelButtonText: 'Cancelar',
      customClass: {
        container: 'responsive-swal',
        popup: 'responsive-swal-popup',
        title: 'responsive-swal-title',
        htmlContainer: 'responsive-swal-html',
        confirmButton: 'swal-confirm-button',
        cancelButton: 'swal-cancel-button'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const attendanceData = unmarkedEmployees.map(employee => ({
          empId: employee.empId,
          empName: employee.empName,
          date: new Date().toISOString().split('T')[0],
          position: employee.position,
          inTime: "",
          outTime: ""
        }));

        axios.post(`localhost:8080/attendances`, attendanceData)
          .then(response => {
            const newMarkedIds = unmarkedEmployees.map(emp => emp.empId);
            setMarkedAbsentees(prev => [...prev, ...newMarkedIds]);
            showSuccessAlert('Éxito', `${unmarkedEmployees.length} empleados marcados como ausentes`);
            fetchAttendanceData();
          })
          .catch(error => {
            console.error('Error al marcar ausentes:', error);
            showErrorAlert('Error', 'Ocurrió un error al marcar los ausentes');
          });
      }
    });
  };

  const markSingleAbsentee = (employee) => {
    if (isMarkedAbsentee(employee.empId)) {
      return;
    }

    Swal.fire({
      title: 'Confirmar Ausencia',
      html: `¿Desea marcar a <strong>${employee.empName}</strong> como ausente para la fecha ${currentDate}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, marcar',
      cancelButtonText: 'Cancelar',
      customClass: {
        container: 'responsive-swal',
        popup: 'responsive-swal-popup',
        title: 'responsive-swal-title',
        htmlContainer: 'responsive-swal-html',
        confirmButton: 'swal-confirm-button',
        cancelButton: 'swal-cancel-button'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const attendanceData = {
          empId: employee.empId,
          empName: employee.empName,
          date: new Date().toISOString().split('T')[0],
          position: employee.position,
          inTime: "",
          outTime: ""
        };

        axios.post(`localhost:8080/attendances`, [attendanceData])
          .then(response => {
            setMarkedAbsentees(prev => [...prev, employee.empId]);
            showSuccessAlert('Éxito', 'Empleado marcado como ausente');
            fetchAttendanceData();
          })
          .catch(error => {
            console.error('Error al marcar ausente:', error);
            showErrorAlert('Error', 'Ocurrió un error al marcar el ausente');
          });
      }
    });
  };

  const handleExportPDF = (selectedEmployee = null) => {
    const doc = new jsPDF();
    const title = `Reporte de Ausentes - ${currentDate}`;
    
    // Configuración común
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text(title, 14, 15);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);

    if (selectedEmployee) {
      // Exportar solo un empleado en formato de tabla
      doc.text(`Detalle del empleado`, 14, 25);
      
      const tableData = [
        ['ID', selectedEmployee.empId],
        ['Nombre', selectedEmployee.empName],
        ['Cargo', translatePosition(selectedEmployee.position)],
        ['Fecha', currentDate],
        ['Estado', 'Ausente']
      ];

      doc.autoTable({
        startY: 35,
        head: [['Campo', 'Valor']],
        body: tableData,
        margin: { top: 35 },
        styles: {
          fontSize: 10,
          cellPadding: 3,
          valign: 'middle',
          halign: 'left',
          font: 'helvetica'
        },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: 'bold',
          fontSize: 11
        },
        columnStyles: {
          0: { cellWidth: 40, fontStyle: 'bold' },
          1: { cellWidth: 60 }
        },
        bodyStyles: {
          textColor: [50, 50, 50]
        },
        alternateRowStyles: {
          fillColor: [240, 240, 240]
        }
      });

      doc.save(`Ausente_${selectedEmployee.empId}_${currentDateForFilename}.pdf`);
      showSuccessAlert('PDF Generado', 'Reporte de ausente exportado correctamente');
    } else {
      // Exportar todos los ausentes
      const subtitle = `Total: ${absenteesData.length} empleados`;
      doc.text(subtitle, 14, 25);

      const tableData = absenteesData.map((emp, index) => [
        index + 1,
        emp.empId,
        emp.empName,
        translatePosition(emp.position),
        isMarkedAbsentee(emp.empId) ? "Ausente" : "Sin marcar"
      ]);

      doc.autoTable({
        head: [['#', 'ID', 'Nombre Completo', 'Cargo', 'Estado']],
        body: tableData,
        startY: 35,
        margin: { top: 35 },
        styles: {
          fontSize: 10,
          cellPadding: 3,
          valign: 'middle',
          halign: 'center',
          font: 'helvetica'
        },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: 'bold',
          fontSize: 11
        },
        bodyStyles: {
          textColor: [50, 50, 50]
        },
        alternateRowStyles: {
          fillColor: [240, 240, 240]
        },
        columnStyles: {
          0: { cellWidth: 10, halign: 'center' },
          1: { cellWidth: 25, halign: 'center' },
          2: { cellWidth: 60, halign: 'left' },
          3: { cellWidth: 50, halign: 'left' },
          4: { cellWidth: 25, halign: 'center', fontStyle: 'bold', textColor: [255, 0, 0] }
        }
      });

      doc.save(`Reporte_Ausentes_${currentDateForFilename}.pdf`);
      showSuccessAlert('PDF Generado', 'Reporte de ausentes exportado correctamente');
    }
  };

  const showExportOptions = () => {
    Swal.fire({
      title: 'Exportar a PDF',
      text: '¿Qué deseas exportar?',
      icon: 'question',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Todos los empleados',
      denyButtonText: 'Un empleado específico',
      cancelButtonText: 'Cancelar',
      customClass: {
        container: 'responsive-swal',
        popup: 'responsive-swal-popup',
        title: 'responsive-swal-title',
        confirmButton: 'swal-confirm-button',
        denyButton: 'swal-deny-button',
        cancelButton: 'swal-cancel-button'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        handleExportPDF(); // Exportar todos
      } else if (result.isDenied) {
        selectEmployeeForExport();
      }
    });
  };

  const selectEmployeeForExport = () => {
    const employeeOptions = absenteesData.map(emp => ({
      id: emp.empId,
      text: `${emp.empId} - ${emp.empName} (${translatePosition(emp.position)})`
    }));

    Swal.fire({
      title: 'Seleccionar empleado',
      input: 'select',
      inputOptions: employeeOptions.reduce((acc, emp) => {
        acc[emp.id] = emp.text;
        return acc;
      }, {}),
      inputPlaceholder: 'Selecciona un empleado',
      showCancelButton: true,
      confirmButtonText: 'Exportar',
      cancelButtonText: 'Cancelar',
      customClass: {
        container: 'responsive-swal',
        popup: 'responsive-swal-popup',
        title: 'responsive-swal-title',
        confirmButton: 'swal-confirm-button',
        cancelButton: 'swal-cancel-button'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const selectedId = result.value;
        const employee = absenteesData.find(emp => emp.empId === selectedId);
        if (employee) {
          handleExportPDF(employee);
        }
      }
    });
  };

  const showSuccessAlert = (title, text) => {
    Swal.fire({
      title,
      text,
      icon: 'success',
      confirmButtonText: 'Aceptar',
      customClass: {
        container: 'responsive-swal',
        confirmButton: 'swal-confirm-button'
      }
    });
  };

  const showErrorAlert = (title, text) => {
    Swal.fire({
      title,
      text,
      icon: 'error',
      confirmButtonText: 'Entendido',
      customClass: {
        container: 'responsive-swal',
        confirmButton: 'swal-confirm-button'
      }
    });
  };

  const showInfoAlert = (title, text) => {
    Swal.fire({
      title,
      text,
      icon: 'info',
      confirmButtonText: 'Entendido',
      customClass: {
        container: 'responsive-swal',
        confirmButton: 'swal-confirm-button'
      }
    });
  };

  // Estilos personalizados para DataTables
  const customStyles = {
    headCells: {
      style: {
        backgroundColor: '#f3f4f6',
        fontWeight: 'bold',
        fontSize: '14px',
      },
    },
    cells: {
      style: {
        padding: '8px',
      },
    },
    noData: {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100px',
        color: '#6b7280',
        fontSize: '16px'
      }
    }
  };

  return (
    <div className="w-full bg-gray-100 p-4">
      {/* Tabla de Asistencias */}
      <div className="mb-8 bg-white p-4 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Registros de Asistencia</h2>
        </div>
        
        <DataTable
          columns={attendanceColumns}
          data={attendanceData}
          progressPending={loading}
          progressComponent={<div className="py-8">Cargando datos de asistencia...</div>}
          noDataComponent={<div className="py-8">No hay datos de asistencia disponibles</div>}
          pagination
          paginationPerPage={10}
          paginationRowsPerPageOptions={[10, 20, 30]}
          customStyles={customStyles}
          highlightOnHover
          responsive
        />
      </div>


      {/* Estilos para SweetAlert responsive */}
      <style jsx global>{`
        @media (max-width: 768px) {
          .responsive-swal-popup {
            width: 90% !important;
            max-width: 400px !important;
            font-size: 0.9rem !important;
          }
          .responsive-swal-title {
            font-size: 1.2rem !important;
          }
          .responsive-swal-html {
            font-size: 0.9rem !important;
            line-height: 1.4 !important;
          }
          .swal-confirm-button, .swal-deny-button, .swal-cancel-button {
            padding: 0.5rem 1rem !important;
            font-size: 0.9rem !important;
            margin: 0.25rem !important;
          }
        }
        
        .swal-confirm-button {
          background-color: #3085d6 !important;
        }
        
        .swal-deny-button {
          background-color: #6c757d !important;
        }
        
        .swal-cancel-button {
          background-color: #d33 !important;
        }
      `}</style>
    </div>
  );
}

export default ViewAttendance;