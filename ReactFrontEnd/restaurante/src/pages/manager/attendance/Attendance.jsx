

import React, { useState, useEffect, useRef } from "react";
import { Button, Alert, Modal, TextInput, Label } from "flowbite-react";
import { FcAlarmClock, FcDownload } from "react-icons/fc";
import { HiInformationCircle } from "react-icons/hi";
import axios from 'axios';
import DataTable from 'react-data-table-component';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function Attendance() {
  // Estados principales
  const [attendance, setAttendance] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState({});
  const [isInTime, setIsInTime] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [loading, setLoading] = useState(true);
  const tableRef = useRef();

  // Fecha actual formateada
  const todayDate = new Date().toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });

  // Efecto para manejar el redimensionamiento de la ventana
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Traducción de roles
  const translatePosition = (position) => {
    const translations = {
      'chef': 'Chef',
      'waiter': 'Mesero',
      'cashier': 'Cajero',
      'cleaner': 'Limpieza',
      'manager': 'Gerente'
    };
    return translations[position.toLowerCase()] || position;
  };

  // Formateo de hora a formato 12 horas AM/PM
  const formatTime = (timeString) => {
    if (!timeString) return "No registrado";
    
    // Si ya está en formato AM/PM, devolver tal cual
    if (timeString.includes("AM") || timeString.includes("PM")) {
      return timeString;
    }

    // Convertir formato 24h a 12h AM/PM
    const timeParts = timeString.split(':');
    let hours = parseInt(timeParts[0]);
    const minutes = timeParts[1];
    const seconds = timeParts[2] || '00';

    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // La hora 0 se convierte en 12 AM

    return `${hours}:${minutes} ${ampm}`;
  };

  // Obtener hora actual en formato 12 horas AM/PM
  const getCurrentTime = () => {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12; // La hora 0 se convierte en 12
    
    // Asegurar formato de 2 dígitos
    minutes = minutes < 10 ? '0' + minutes : minutes;
    
    return `${hours}:${minutes} ${ampm}`;
  };

  // Convertir hora AM/PM a minutos para validación
  const timeToMinutes = (timeStr) => {
    if (!timeStr) return 0;
    
    // Extraer partes del tiempo
    const [time, period] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    
    // Ajustar horas para PM
    if (period === 'PM' && hours !== 12) {
      hours += 12;
    }
    if (period === 'AM' && hours === 12) {
      hours = 0;
    }
    
    return hours * 60 + minutes;
  };

  // Validar si la hora actual está dentro del rango permitido
  const isTimeAllowed = (isEntry) => {
    const currentTime = getCurrentTime();
    const currentMinutes = timeToMinutes(currentTime);
    
    if (isEntry) {
      // Entrada permitida: desde las 7:00 AM (420) hasta antes de las 7:00 PM (1140)
      return currentMinutes >= 420 && currentMinutes < 1140;
    } else {
      // Salida permitida de 7:00 PM a 10:00 PM (1140 a 1320 minutos)
      return currentMinutes >= 1140 && currentMinutes < 1320;
    }
  };

  // Obtener datos de empleados
  const fetchEmployeeData = () => {
    setLoading(true);
    axios.get(`http://localhost:8080/employeeIdsAndPositions`)
      .then(response => {
        const filteredData = response.data.filter(employee => employee[2] !== "manager");
        const initialAttendance = filteredData.map(employee => ({
          empId: employee[0],
          empName: employee[1],
          position: employee[2],
          inTime: "",
          outTime: "",
          hasRegisteredIn: false,
          hasRegisteredOut: false,
          date: new Date().toISOString().split('T')[0]
        }));

        // Obtener registros existentes para hoy
        axios.get(`http://localhost:8080/current-date`)
          .then(attendanceResponse => {
            const updatedAttendance = initialAttendance.map(emp => {
              const existingRecord = attendanceResponse.data.find(
                record => record.empId === emp.empId
              );
              
              if (existingRecord) {
                return {
                  ...emp,
                  inTime: existingRecord.inTime || "",
                  outTime: existingRecord.outTime || "",
                  hasRegisteredIn: !!existingRecord.inTime,
                  hasRegisteredOut: !!existingRecord.outTime
                };
              }
              return emp;
            });
            
            setAttendance(updatedAttendance);
            setLoading(false);
          })
          .catch(error => {
            console.error('Error al obtener registros existentes:', error);
            setAttendance(initialAttendance);
            setLoading(false);
          });
      })
      .catch(error => {
        console.error('Error al obtener los datos del empleado:', error);
        setLoading(false);
        setErrorMessage('Error al cargar los datos de empleados');
      });
  };

  useEffect(() => {
    fetchEmployeeData();
  }, []);

  // Exportar a PDF
  const exportToPDF = () => {
    Swal.fire({
      title: 'Generando reporte PDF',
      html: 'Preparando documento...',
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    setTimeout(() => {
      const doc = new jsPDF();
      
      // Título
      doc.setFontSize(18);
      doc.setTextColor(40, 40, 40);
      doc.text(`Reporte de Asistencia - ${todayDate}`, 15, 15);
      
      // Información de la empresa
      doc.setFontSize(12);
      doc.text('Sistema de Control de Asistencia', 15, 25);
      
      // Preparar datos para la tabla
      const pdfData = attendance.map((emp, index) => [
        index + 1,
        emp.empId,
        emp.empName,
        translatePosition(emp.position),
        formatTime(emp.inTime),
        formatTime(emp.outTime),
        emp.inTime ? (emp.outTime ? "Completo" : "Solo entrada") : "Pendiente"
      ]);

      // Agregar tabla al PDF
      doc.autoTable({
        head: [['#', 'ID', 'Nombre', 'Rol', 'Entrada', 'Salida', 'Estado']],
        body: pdfData,
        startY: 35,
        styles: {
          fontSize: 8,
          cellPadding: 3,
          valign: 'middle',
          halign: 'center'
        },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245]
        },
        columnStyles: {
          0: { cellWidth: 10 },
          1: { cellWidth: 15 },
          2: { cellWidth: 40 },
          3: { cellWidth: 30 },
          4: { cellWidth: 25 },
          5: { cellWidth: 25 },
          6: { cellWidth: 25 }
        },
        didDrawPage: function (data) {
          // Pie de página
          const pageCount = doc.internal.getNumberOfPages();
          doc.setFontSize(10);
          doc.text(`Página ${data.pageNumber} de ${pageCount}`, data.settings.margin.left, doc.internal.pageSize.height - 10);
        }
      });

      doc.save(`asistencia_${todayDate.replace(/\//g, '-')}.pdf`);
      
      Swal.fire({
        title: 'Reporte generado',
        text: 'El PDF se ha descargado correctamente',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });
    }, 1000);
  };

  // Configuración de columnas responsivas
  const getColumns = () => {
    const baseColumns = [
      {
        name: '#',
        selector: (row, index) => index + 1,
        sortable: true,
        width: '60px',
        omit: windowWidth < 768
      },
      {
        name: 'ID',
        selector: row => row.empId,
        sortable: true,
        width: '80px'
      },
      {
        name: windowWidth < 640 ? 'Nombre' : 'Nombre del empleado',
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
        omit: windowWidth < 640
      }
    ];

    const timeColumns = [
      {
        name: windowWidth < 640 ? 'Entrada' : 'Hora de entrada',
        cell: row => (
          row.inTime ? formatTime(row.inTime) : (
            <FcAlarmClock style={{ fontSize: '24px', color: 'blue' }} />
          )
        ),
        sortable: true,
        width: '120px'
      },
      {
        name: windowWidth < 640 ? 'Entrada' : 'Marcar entrada',
        cell: row => (
          <Button
            color="blue"
            size="xs"
            pill
            onClick={() => handleTakeTime(row.empId, row.empName, row.position, true)}
            disabled={row.hasRegisteredIn || !isTimeAllowed(true)}
            className="text-xs sm:text-sm"
          >
            {windowWidth < 640 ? 'Entrada' : 'Registrar entrada'}
          </Button>
        ),
        width: windowWidth < 640 ? '100px' : '150px'
      },
      {
        name: windowWidth < 640 ? 'Salida' : 'Hora de salida',
        cell: row => (
          row.outTime ? formatTime(row.outTime) : (
            <FcAlarmClock style={{ fontSize: '24px', color: 'red' }} />
          )
        ),
        sortable: true,
        width: '120px',
        omit: windowWidth < 768
      },
      {
        name: windowWidth < 640 ? 'Salida' : 'Marcar salida',
        cell: row => (
          <Button
            color="success"
            size="xs"
            pill
            onClick={() => handleTakeTime(row.empId, row.empName, row.position, false)}
            disabled={!row.hasRegisteredIn || row.hasRegisteredOut || !isTimeAllowed(false)}
            className="text-xs sm:text-sm"
          >
            {windowWidth < 640 ? 'Salida' : 'Registrar salida'}
          </Button>
        ),
        width: windowWidth < 640 ? '100px' : '150px'
      }
    ];

    return [...baseColumns, ...timeColumns];
  };

  // Manejar registro de entrada/salida
  const handleTakeTime = (empId, empName, position, isInTime) => {
    if (isInTime && !isTimeAllowed(true)) {
      Swal.fire({
        title: 'Fuera de horario',
        text: 'El horario de entrada es de 7:00 AM a 11:00 AM. No puedes registrar tu entrada ahora.',
        icon: 'error',
        confirmButtonText: 'Entendido'
      });
      return;
    }

    if (!isInTime && !isTimeAllowed(false)) {
      Swal.fire({
        title: 'Fuera de horario',
        text: 'El horario de salida es de 7:00 PM a 10:00 PM. No puedes registrar tu salida ahora.',
        icon: 'error',
        confirmButtonText: 'Entendido'
      });
      return;
    }

    setSelectedEmployee({ empId, empName, position });
    setIsInTime(isInTime);

    const confirmationText = isInTime 
      ? `¿Estás seguro de registrar tu hora de entrada ahora? (${getCurrentTime()})`
      : `¿Estás seguro de registrar tu hora de salida ahora? (${getCurrentTime()})`;

    Swal.fire({
      title: isInTime ? 'Confirmar entrada' : 'Confirmar salida',
      text: confirmationText,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, registrar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        confirmAttendance(empId, empName, position);
      }
    });
  };

  // Confirmar asistencia
  const confirmAttendance = (empId, empName, position) => {
    const currentTime = getCurrentTime();

    const endpoint = isInTime ? 'attendance/in' : 'attendance/out';
    const timeField = isInTime ? 'inTime' : 'outTime';
    const successMessage = isInTime ? 'Entrada registrada' : 'Salida registrada';

    axios.post(`http://localhost:8080/${endpoint}`, {
      empId: empId,
      empName: empName,
      position: position,
      [timeField]: currentTime,
      date: new Date().toISOString().split('T')[0]
    })
      .then(response => {
        setAttendance(prevAttendance => prevAttendance.map(emp => {
          if (emp.empId === empId) {
            return {
              ...emp,
              [timeField]: currentTime,
              hasRegisteredIn: isInTime ? true : emp.hasRegisteredIn,
              hasRegisteredOut: !isInTime ? true : emp.hasRegisteredOut
            };
          }
          return emp;
        }));

        Swal.fire({
          title: successMessage,
          text: `Hora ${isInTime ? 'de entrada' : 'de salida'} registrada: ${formatTime(currentTime)}`,
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
      })
      .catch(error => {
        console.error('Error al marcar la asistencia:', error);
        if (error.response && error.response.status === 400) {
          Swal.fire({
            title: 'Error',
            text: error.response.data,
            icon: 'error',
            confirmButtonText: 'Entendido'
          });
        }
      });
  };

  return (
    <div className="mx-4 sm:mx-8 md:mx-16 mt-5 mb-5 w-auto">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <h1 className="text-xl sm:text-2xl font-bold">
          Asistencia (Hoy: {todayDate})
        </h1>
        <Button 
          color="gray" 
          onClick={exportToPDF}
          className="flex items-center gap-2"
        >
          <FcDownload className="text-lg" />
          <span>Exportar PDF</span>
        </Button>
      </div>

      {/* Alerta de error */}
      {errorMessage && (
        <Alert color="failure" icon={HiInformationCircle} className="mb-4">
          <span className="font-medium">Error!</span> {errorMessage}
        </Alert>
      )}

      {/* Información de horarios */}
      <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
        <Alert color="info" className="text-sm">
          <span className="font-medium">Horario de entrada:</span> De 7:00 AM a 9:00 AM
        </Alert>
        <Alert color="info" className="text-sm">
          <span className="font-medium">Horario de salida:</span> De 7:00 PM a 10:00 PM
        </Alert>
      </div>

      {/* Tabla de datos */}
      <div className="my-4 shadow rounded-lg overflow-x-auto" ref={tableRef}>
        <DataTable
          columns={getColumns()}
          data={attendance}
          pagination
          responsive
          noHeader
          striped
          highlightOnHover
          progressPending={loading}
          progressComponent={<div className="py-8">Cargando datos...</div>}
          paginationPerPage={10}
          paginationRowsPerPageOptions={[5, 10, 15, 20]}
          paginationComponentOptions={{
            rowsPerPageText: 'Filas por página:',
            rangeSeparatorText: 'de',
            noRowsPerPage: false,
            selectAllRowsItem: false
          }}
          noDataComponent={<div className="py-8 text-center">No hay datos disponibles</div>}
          customStyles={{
            headCells: {
              style: {
                backgroundColor: '#1f2937',
                color: 'white',
                fontWeight: 'bold',
                paddingLeft: '8px',
                paddingRight: '8px',
              },
            },
            cells: {
              style: {
                paddingLeft: '8px',
                paddingRight: '8px',
              },
            },
          }}
          className="text-sm sm:text-base"
        />
      </div>
    </div>
  );
}

export default Attendance;