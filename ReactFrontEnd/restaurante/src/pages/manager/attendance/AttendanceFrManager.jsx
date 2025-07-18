

import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import { Table, Button, Modal, TextInput, Label, Pagination, Alert, Dropdown } from "flowbite-react";
import { FaUserEdit, FaTrash, FaDownload, FaFilter, FaCalendarAlt, FaUserClock, FaBuilding, FaIdCard, FaUserTie, FaSignOutAlt, FaClock, FaFilePdf } from "react-icons/fa";
import { HiInformationCircle } from "react-icons/hi";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import autoTable from 'jspdf-autotable';
import Swal from 'sweetalert2';

function AttendanceFrManager() {
  // Estados del componente
  const [attendance, setAttendance] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const emailInputRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [editData, setEditData] = useState({});
  const [empIds, setEmpIds] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [selectedEmpId, setSelectedEmpId] = useState("select");
  const [selectedType, setSelectedType] = useState("select");
  const [exceededLimits, setExceededLimits] = useState({ daily: [], weekly: [] });

  // Efecto para cargar datos iniciales
  useEffect(() => {
    fetchAttendanceData();
    fetchEmployeeIds();
  }, []);

  // Función para obtener datos de asistencia
  const fetchAttendanceData = () => {
    axios.get(`http://localhost:8080/current-date`)
      .then(response => {
        setAttendance(response.data);
        checkWorkLimits(response.data);
      })
      .catch(error => {
        console.error('Error al obtener los datos de asistencia:', error);
        showErrorAlert('No se pudieron cargar los datos de asistencia');
      });
  };

  // Función para mostrar alertas de error con SweetAlert2
  const showErrorAlert = (message) => {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message,
      confirmButtonColor: '#3085d6',
      background: '#f8f9fa',
      backdrop: `
        rgba(0,0,0,0.5)
        url("/images/error-icon.png")
        center top
        no-repeat
      `
    });
  };

  // Función para verificar límites laborales
  const checkWorkLimits = (attendanceData) => {
    const dailyExceeded = [];
    const weeklyExceeded = [];
    const weeklyHoursByEmployee = {};

    attendanceData.forEach(employee => {
      if (employee.inTime && employee.outTime) {
        // Calcular horas trabajadas
        const hoursWorked = calculateHoursInMinutes(employee.inTime, employee.outTime);
        const hoursDecimal = (hoursWorked / 60).toFixed(2);

        // Verificar si excede el límite diario (8 horas)
        if (hoursWorked > 8 * 60) {
          dailyExceeded.push({
            empId: employee.empId,
            empName: employee.empName,
            date: employee.date,
            hours: hoursDecimal
          });
        }

        // Preparar verificación semanal
        const date = new Date(employee.date);
        const weekNumber = getWeekNumber(date);
        const weekKey = `${employee.empId}-${date.getFullYear()}-${weekNumber}`;

        if (!weeklyHoursByEmployee[weekKey]) {
          weeklyHoursByEmployee[weekKey] = {
            empId: employee.empId,
            empName: employee.empName,
            year: date.getFullYear(),
            week: weekNumber,
            totalMinutes: 0
          };
        }
        weeklyHoursByEmployee[weekKey].totalMinutes += hoursWorked;
      }
    });

    // Verificar límites semanales (48 horas)
    Object.values(weeklyHoursByEmployee).forEach(employeeWeek => {
      if (employeeWeek.totalMinutes > 48 * 60) {
        weeklyExceeded.push({
          empId: employeeWeek.empId,
          empName: employeeWeek.empName,
          year: employeeWeek.year,
          week: employeeWeek.week,
          hours: (employeeWeek.totalMinutes / 60).toFixed(2)
        });
      }
    });

    setExceededLimits({
      daily: dailyExceeded,
      weekly: weeklyExceeded
    });

    // Mostrar alerta si hay excesos
    if (dailyExceeded.length > 0 || weeklyExceeded.length > 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Horas trabajadas excedidas',
        html: `
          <div class="text-left">
            ${dailyExceeded.length > 0 ? `
              <p class="font-bold">Horas diarias excedidas:</p>
              <ul class="list-disc pl-5">
                ${dailyExceeded.map(e =>
          `<li>${e.empName} (${e.empId}): ${e.hours} hrs el ${new Date(e.date).toLocaleDateString('es-PE')}</li>`
        ).join('')}
              </ul>
            ` : ''}
            ${weeklyExceeded.length > 0 ? `
              <p class="font-bold mt-3">Horas semanales excedidas:</p>
              <ul class="list-disc pl-5">
                ${weeklyExceeded.map(e =>
          `<li>${e.empName} (${e.empId}): ${e.hours} hrs en semana ${e.week} del ${e.year}</li>`
        ).join('')}
              </ul>
            ` : ''}
          </div>
        `,
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#3085d6',
        background: '#f8f9fa',
        width: '600px'
      });
    }
  };

  // Función auxiliar para calcular horas en minutos
  const calculateHoursInMinutes = (inTime, outTime) => {
    // Si es "No asistió" (00:00), retornar 0
    if (outTime === '00:00' || outTime === 'No asistió') return 0;

    if (!inTime || !outTime) return 0;

    const inTime24h = convertTo24HourFormat(inTime);
    const outTime24h = convertTo24HourFormat(outTime);

    const [inHours, inMinutes] = inTime24h.split(':').map(Number);
    const [outHours, outMinutes] = outTime24h.split(':').map(Number);

    let totalHours = outHours - inHours;
    let totalMinutes = outMinutes - inMinutes;

    if (totalMinutes < 0) {
      totalHours--;
      totalMinutes += 60;
    }

    if (totalHours < 0) {
      totalHours += 24;
    }

    return totalHours * 60 + totalMinutes;
  };

  // Función para convertir a formato 12h
  const convertTo12HourFormat = (timeString) => {
    // Caso especial para no asistencia (ambos campos 00:00)
    if (timeString === '00:00') return 'No asistió';
    if (!timeString || timeString === '--') return 'No registrado';

    // Si ya está en formato 12h
    if (timeString.includes('AM') || timeString.includes('PM')) {
      return timeString;
    }

    // Convertir de formato 24h a 12h
    try {
      const [hours, minutes] = timeString.split(':').map(Number);
      const period = hours >= 12 ? 'PM' : 'AM';
      const hours12 = hours % 12 || 12;
      return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
    } catch (e) {
      console.error('Error al convertir hora:', e);
      return timeString;
    }
  };

  // Función para convertir a formato 24h
  const convertTo24HourFormat = (timeString) => {
    if (!timeString || timeString === '--') return '';

    // Si ya está en formato 24h (no contiene AM/PM)
    if (!timeString.includes('AM') && !timeString.includes('PM')) {
      return timeString;
    }

    try {
      const [time, period] = timeString.split(' ');
      let [hours, minutes] = time.split(':').map(Number);

      if (period === 'PM' && hours !== 12) {
        hours += 12;
      } else if (period === 'AM' && hours === 12) {
        hours = 0;
      }

      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    } catch (e) {
      console.error('Error al convertir hora:', e);
      return timeString;
    }
  };

  // Función auxiliar para obtener número de semana
  function getWeekNumber(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
    const week1 = new Date(d.getFullYear(), 0, 4);
    return 1 + Math.round(((d - week1) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
  }

  // Función para obtener IDs de empleados
  const fetchEmployeeIds = () => {
    axios.get(`http://localhost:8080/employeeIds`)
      .then(response => {
        setEmpIds(response.data);
      })
      .catch(error => {
        console.error('Error al obtener los ID de los empleados:', error);
        showErrorAlert('No se pudieron cargar los IDs de empleados');
      });
  };

  // Función para obtener datos del mes actual
  const fetchAttendanceDataForCurrentMonth = () => {
    axios.get(`http://localhost:8080/current-month`)
      .then(response => {
        setAttendance(response.data);
        checkWorkLimits(response.data);
      })
      .catch(error => {
        console.error('Error al obtener los datos de asistencia para el mes actual:', error);
        showErrorAlert('No se pudieron cargar los datos del mes');
      });
  };

  // Lógica de paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = attendance.slice(indexOfFirstItem, indexOfLastItem);

  const onPageChange = (page) => setCurrentPage(page);

  // Manejadores de eventos
  const handleThisMonthClick = () => {
    setShowModal(false);
    fetchAttendanceDataForCurrentMonth();
  };

  const handleCurrentDateClick = () => {
    setShowModal(false);
    fetchAttendanceData();
  };

  const handleEditClick = (data) => {
    const formattedData = {
      ...data,
      inTime: formatTimeForInput(data.inTime),
      outTime: formatTimeForInput(data.outTime)
    };
    setEditData(formattedData);
    setShowEditModal(true);
  };

  const handleDeleteClick = (data) => {
    setSelectedAttendance(data);
    setConfirmDelete(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditData({});
  };

  const handleSubmitEdit = (formData) => {
    if (!formData.inTime || !formData.outTime) {
      Swal.fire({
        icon: 'error',
        title: 'Campos requeridos',
        text: 'Las horas de entrada y salida son obligatorias',
        confirmButtonColor: '#3085d6',
        background: '#f8f9fa'
      });
      return;
    }

    // Validar horarios según las reglas
    const validationResult = validateWorkSchedule(formData.inTime, formData.outTime);
    if (!validationResult.isValid) {
      Swal.fire({
        icon: 'error',
        title: 'Horario no válido',
        text: validationResult.message,
        confirmButtonColor: '#3085d6',
        background: '#f8f9fa'
      });
      return;
    }

    // Solo calcular horas si no es "No asistió"
    if (formData.outTime !== '00:00') {
      const minutesWorked = calculateHoursInMinutes(formData.inTime, formData.outTime);
      const hoursWorked = (minutesWorked / 60).toFixed(2);

      if (minutesWorked > 8 * 60) {
        Swal.fire({
          icon: 'warning',
          title: 'Horas trabajadas',
          html: `El empleado trabajará <strong>${hoursWorked} horas</strong> este día.<br>¿Desea continuar?`,
          showCancelButton: true,
          confirmButtonText: 'Sí, guardar',
          cancelButtonText: 'Cancelar',
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          background: '#f8f9fa'
        }).then((result) => {
          if (result.isConfirmed) {
            saveAttendance(formData);
          }
        });
        return;
      }
    }

    saveAttendance(formData);

  };

  // Función para validar el horario laboral
  const validateWorkSchedule = (inTime, outTime) => {
    if (!inTime || !outTime) {
      return { isValid: false, message: 'Ambos horarios son requeridos' };
    }

    // Convertir a formato 24h
    const inTime24h = convertTo24HourFormat(inTime);
    const outTime24h = convertTo24HourFormat(outTime);

    // Validar horario de entrada (7:00 AM a 9:00 AM)
    const [inHours, inMinutes] = inTime24h.split(':').map(Number);
    if (inHours < 7 || (inHours === 9 && inMinutes > 0) || inHours > 9) {
      return {
        isValid: false,
        message: 'La hora de entrada debe ser entre 7:00 AM y 9:00 AM'
      };
    }

    // Validar horario de salida (6:00 PM a 10:00 PM)
    const [outHours, outMinutes] = outTime24h.split(':').map(Number);

    // Caso especial para no asistencia
    if (outHours === 0 && outMinutes === 0) {
      return { isValid: true, message: 'No asistió' };
    }

    // Convertir a minutos para comparación
    const outTotal = outHours * 60 + outMinutes;
    const minOutTime = 18 * 60; // 6:00 PM (18:00)
    const maxOutTime = 22 * 60; // 10:00 PM (22:00)

    if (outTotal < minOutTime || outTotal > maxOutTime) {
      return {
        isValid: false,
        message: 'La hora de salida debe ser entre 6:00 PM y 10:00 PM'
      };
    }

    // Validar que salida sea después de entrada
    const inTotal = inHours * 60 + inMinutes;
    if (outTotal <= inTotal) {
      return {
        isValid: false,
        message: 'La hora de salida debe ser después de la entrada'
      };
    }

    return { isValid: true, message: 'Horario válido' };
  };

  const saveAttendance = (formData) => {
    // Convertir a formato 24h antes de guardar
    const formattedData = {
      ...formData,
      inTime: convertTo24HourFormat(formData.inTime),
      outTime: convertTo24HourFormat(formData.outTime)
    };

    axios.put(`http://localhost:8080/update`, formattedData)
      .then(response => {
        Swal.fire({
          icon: 'success',
          title: 'Actualizado',
          text: 'Asistencia actualizada correctamente',
          confirmButtonColor: '#3085d6',
          background: '#f8f9fa',
          timer: 1500,
          showConfirmButton: false
        });
        handleCloseEditModal();
        fetchAttendanceData();
      })
      .catch(error => {
        console.error('Error al actualizar la asistencia:', error);
        showErrorAlert('No se pudo actualizar la asistencia');
      });
  };

  const handleConfirmDelete = () => {
    const { empId, date } = selectedAttendance;
    axios.delete(`http://localhost:8080/DeleteAttendance/${empId}/${date}`)
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: 'Asistencia eliminada correctamente',
          confirmButtonColor: '#3085d6',
          background: '#f8f9fa',
          timer: 1500,
          showConfirmButton: false
        });
        setConfirmDelete(false);
        fetchAttendanceData();
      })
      .catch(error => {
        console.error('Error al eliminar la asistencia:', error);
        showErrorAlert('No se pudo eliminar la asistencia');
      });
  };

  const handleSubmitDateRange = () => {
    if (!startDate || !endDate) {
      Swal.fire({
        icon: 'warning',
        title: 'Advertencia',
        text: 'Seleccione ambas fechas',
        confirmButtonColor: '#3085d6',
        background: '#f8f9fa'
      });
      return;
    }

    axios.get(`http://localhost:8080/fetch-by-date-range/${startDate}/${endDate}`)
      .then(response => {
        setAttendance(response.data);
        checkWorkLimits(response.data);
        setShowModal(false);
      })
      .catch(error => {
        console.error('Error al obtener datos por rango de fechas:', error);
        showErrorAlert('No se pudieron cargar los datos del rango seleccionado');
      });
  };

  const handleFilterSubmit = () => {
    if (selectedEmpId === "select" || selectedType === "select") {
      Swal.fire({
        icon: 'warning',
        title: 'Advertencia',
        text: 'Seleccione tanto el ID del empleado como el tipo',
        confirmButtonColor: '#3085d6',
        background: '#f8f9fa'
      });
      return;
    }

    let endpoint = "";
    if (selectedType === "today") {
      endpoint = `http://localhost:8080/attendance/${selectedEmpId}/Today`;
    } else if (selectedType === "this") {
      endpoint = `http://localhost:8080/attendance/${selectedEmpId}/This%20Month`;
    }

    axios.get(endpoint)
      .then(response => {
        setAttendance(response.data);
        checkWorkLimits(response.data);
      })
      .catch(error => {
        console.error('Error al filtrar datos:', error);
        showErrorAlert('No se pudieron filtrar los datos');
      });
  };

  // Función para formatear la hora para inputs
  const formatTimeForInput = (timeString) => {
    if (!timeString || timeString === '--') return '';
    if (timeString === '00:00') return '00:00'; // Caso especial para medianoche

    if (timeString.includes(':')) {
      const parts = timeString.split(':');
      if (parts.length >= 2) {
        return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
      }
    }

    try {
      const date = new Date(timeString);
      if (!isNaN(date.getTime())) {
        return date.toTimeString().substring(0, 5);
      }
    } catch (e) {
      console.error('Error al formatear hora:', e);
    }

    return '';
  };

  // Función para calcular horas trabajadas
  const calculateHoursWorked = (inTime, outTime) => {
    // Si ambos son "00:00" o "No asistió"
    if ((inTime === '00:00' || inTime === 'No asistió') &&
      (outTime === '00:00' || outTime === 'No asistió')) {
      return 'No asistió';
    }

    if (!inTime || !outTime) return '--';

    const minutesWorked = calculateHoursInMinutes(inTime, outTime);
    if (minutesWorked <= 0) return '--';

    const hours = Math.floor(minutesWorked / 60);
    const minutes = minutesWorked % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  };

  // Función para calcular estadísticas de horas
  const calculateHoursStats = (attendanceData) => {
    const validEntries = attendanceData.filter(a => a.inTime && a.outTime);
    let totalMinutes = 0;

    validEntries.forEach(entry => {
      const minutes = calculateHoursInMinutes(entry.inTime, entry.outTime);
      totalMinutes += minutes;
    });

    const totalHours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;
    const avgMinutes = validEntries.length > 0 ? Math.round(totalMinutes / validEntries.length) : 0;
    const avgHours = Math.floor(avgMinutes / 60);
    const avgRemainingMinutes = avgMinutes % 60;

    return {
      totalHoras: `${totalHours}h ${remainingMinutes}m`,
      promedioHoras: `${avgHours}h ${avgRemainingMinutes}m`
    };
  };

  // Función para exportar a PDF
// Añade esta función al componente (cerca de las otras funciones de formato)
const formatDateForPDF = (dateString) => {
  if (!dateString) return '--';
  
  try {
    const date = new Date(dateString);
    const adjustedDate = new Date(date.getTime() + (date.getTimezoneOffset() * 60000));
    return adjustedDate.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (e) {
    console.error('Error al formatear fecha para PDF:', e);
    return dateString;
  }
};

// Función para exportar a PDF - Versión corregida
const downloadPDF = () => {
  try {
    // Función para traducir roles
    const translateRole = (role) => {
      const roles = {
        'manager': 'Gerente',
        'supervisor': 'Supervisor',
        'chef': 'Chef',
        'waiter': 'Mesero',
        'bartender': 'Bartender',
        'cashier': 'Cajero',
        'cleaner': 'Limpieza',
        'other': 'Otro'
      };
      return roles[role?.toLowerCase()] || role || '--';
    };

    // Crear nuevo PDF
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Configuración de colores
    const primaryColor = [22, 160, 133];
    const darkColor = [44, 62, 80];
    const lightColor = [189, 195, 199];
    const margin = 15;
    let yPosition = margin;

    // Encabezado
    doc.setFontSize(20);
    doc.setTextColor(...primaryColor);
    doc.setFont('helvetica', 'bold');
    doc.text('REPORTE DE ASISTENCIAS', 105, yPosition, { align: 'center' });
    yPosition += 10;

    // Información de la empresa
    doc.setFontSize(10);
    doc.setTextColor(...darkColor);
    doc.setFont('helvetica', 'normal');
    doc.text('RESTAURANTE LOS PATOS S.A.C.', margin, yPosition);
    doc.text('RUC: 20605467891', margin, yPosition + 5);
    doc.text('Panamericana Norte Km 712, Chepén, Peru', margin, yPosition + 10);
    yPosition += 15;

    // Línea decorativa
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition, 200 - margin, yPosition);
    yPosition += 5;

    // Período del reporte
    doc.setFontSize(12);
    doc.setTextColor(...darkColor);
    doc.setFont('helvetica', 'bold');
    doc.text('PERÍODO DEL REPORTE:', margin, yPosition);
    yPosition += 5;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    const periodText = startDate && endDate
      ? `Desde ${formatDateForPDF(startDate)} hasta ${formatDateForPDF(endDate)}`
      : 'Todos los registros disponibles';
    doc.text(periodText, margin, yPosition);
    yPosition += 10;

    // Fecha de generación
    doc.setTextColor(...lightColor);
    doc.setFontSize(10);
    doc.text(`Generado el: ${new Date().toLocaleDateString('es-PE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}`, 105, yPosition, { align: 'center' });
    yPosition += 15;

    // Preparar datos para la tabla
    const headers = [
      { title: "#", dataKey: "index" },
      { title: "ID EMPLEADO", dataKey: "empId" },
      { title: "NOMBRE", dataKey: "empName" },
      { title: "CARGO", dataKey: "position" },
      { title: "FECHA", dataKey: "date" },
      { title: "ENTRADA", dataKey: "inTime" },
      { title: "SALIDA", dataKey: "outTime" },
      { title: "HORAS", dataKey: "hoursWorked" },
      { title: "ESTADO", dataKey: "status" }
    ];

    const data = attendance.map((employee, index) => {
      const hoursWorked = calculateHoursWorked(employee.inTime, employee.outTime);
      const minutesWorked = calculateHoursInMinutes(employee.inTime, employee.outTime);

      return {
        index: index + 1,
        empId: employee.empId || '--',
        empName: employee.empName || '--',
        position: translateRole(employee.position),
        date: formatDateForPDF(employee.date),
        inTime: employee.inTime ? convertTo12HourFormat(employee.inTime) : '--',
        outTime: employee.outTime ? convertTo12HourFormat(employee.outTime) : '--',
        hoursWorked: hoursWorked || '--',
        status: minutesWorked > 8 * 60 ? 'Horas excedidas' : 'Normal'
      };
    });

    // Agregar tabla al PDF
    autoTable(doc, {
      head: [headers.map(h => h.title)],
      body: data.map(item => headers.map(h => item[h.dataKey])),
      startY: yPosition,
      margin: { left: margin, right: margin },
      headStyles: {
        fillColor: primaryColor,
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 10
      },
      bodyStyles: {
        textColor: darkColor,
        fontSize: 9
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      styles: {
        cellPadding: 3,
        overflow: 'linebreak',
        halign: 'center'
      },
      didDrawPage: function(data) {
        // Footer
        doc.setFontSize(8);
        doc.setTextColor(...lightColor);
        doc.text(
          `Página ${doc.internal.getNumberOfPages()}`,
          105,
          doc.internal.pageSize.height - 10,
          { align: 'center' }
        );
      }
    });

    // Guardar el PDF
    const fileName = `Reporte_Asistencias_${new Date().toISOString().slice(0, 10)}.pdf`;
    doc.save(fileName);

  } catch (error) {
    console.error('Error al generar PDF:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo generar el PDF',
      confirmButtonColor: '#3085d6',
      background: '#f8f9fa'
    });
  }
};

  // Función para formatear fecha en formato PDF
  // Asegurar que la fecha se maneje consistentemente
  const formatDate = (dateString) => {
    if (!dateString) return '--';

    // Asegurarse de que la fecha se interprete correctamente
    const date = new Date(dateString);
    // Ajustar a la zona horaria de Perú (UTC-5)
    const adjustedDate = new Date(date.getTime() + (date.getTimezoneOffset() * 60000));

    return adjustedDate.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Usar esta función en lugar de toLocaleDateString directamente

  // Renderizado del componente
  return (
    <div className="flex flex-col w-full p-4">
      {/* Controles de filtro */}
      <div className="flex flex-col md:flex-row items-center mb-4 gap-4 p-4 bg-white dark:bg-gray-700 rounded-lg shadow">

        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto mt-4 md:mt-0">
          <Button
            color="success"
            className="w-full md:w-auto"
            onClick={handleThisMonthClick}
          >
            Este mes
          </Button>
          <Button
            color="success"
            className="w-full md:w-auto"
            onClick={() => setShowModal(true)}
          >
            Rango de fechas
          </Button>
          <Button
            color="success"
            className="w-full md:w-auto"
            onClick={downloadPDF}
          >
            <FaFilePdf className="mr-2" /> Exportar PDF
          </Button>
        </div>
      </div>

      {/* Mostrar alerta si hay excesos */}
      {(exceededLimits.daily.length > 0 || exceededLimits.weekly.length > 0) && (
        <Alert color="warning" icon={HiInformationCircle} className="mb-4">
          <span className="font-medium">Advertencia!</span> Hay registros con horas trabajadas excedidas
        </Alert>
      )}

      {/* Tabla de asistencias */}
      <div className="overflow-x-auto bg-white dark:bg-gray-700 rounded-lg shadow">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Registros de Asistencia</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Página {currentPage} de {Math.ceil(attendance.length / itemsPerPage)}
            </span>
          </div>
        </div>

        <Table hoverable className="w-full">
          <Table.Head className="bg-gray-100 dark:bg-gray-600">
            <Table.HeadCell className="w-12">#</Table.HeadCell>
            <Table.HeadCell>ID</Table.HeadCell>
            <Table.HeadCell>Nombre</Table.HeadCell>
            <Table.HeadCell className="hidden md:table-cell">Rol</Table.HeadCell>
            <Table.HeadCell>Fecha</Table.HeadCell>
            <Table.HeadCell className="hidden sm:table-cell">Entrada</Table.HeadCell>
            <Table.HeadCell className="hidden sm:table-cell">Salida</Table.HeadCell>
            <Table.HeadCell>Horas</Table.HeadCell>
            <Table.HeadCell>Acciones</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {currentItems.map((employee, index) => {
              const hoursWorked = calculateHoursWorked(employee.inTime, employee.outTime);
              const minutesWorked = calculateHoursInMinutes(employee.inTime, employee.outTime);
              const exceedsDailyLimit = minutesWorked > 8 * 60;

              // Traducción de los roles
              const translateRole = (role) => {
                const roles = {
                  'manager': 'Gerente',
                  'supervisor': 'Supervisor',
                  'chef': 'Chef',
                  'waiter': 'Mesero',
                  'bartender': 'Bartender',
                  'cashier': 'Cajero',
                  'cleaner': 'Limpieza',
                  'other': 'Otro'
                };
                return roles[role.toLowerCase()] || role;
              };

              return (
                <Table.Row
                  key={index}
                  className={`bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600 ${exceedsDailyLimit ? 'border-l-4 border-yellow-500' : ''}`}
                >
                  <Table.Cell>{indexOfFirstItem + index + 1}</Table.Cell>
                  <Table.Cell>{employee.empId}</Table.Cell>
                  <Table.Cell>{employee.empName}</Table.Cell>
                  <Table.Cell className="hidden md:table-cell">{translateRole(employee.position)}</Table.Cell>
                  <Table.Cell>{employee.date}</Table.Cell>
                  <Table.Cell className="hidden sm:table-cell">
                    {employee.inTime === '00:00' && employee.outTime === '00:00'
                      ? 'No asistió'
                      : convertTo12HourFormat(employee.inTime)}
                  </Table.Cell>
                  <Table.Cell className="hidden sm:table-cell">
                    {employee.inTime === '00:00' && employee.outTime === '00:00'
                      ? 'No asistió'
                      : convertTo12HourFormat(employee.outTime)}
                  </Table.Cell>
                  <Table.Cell className={exceedsDailyLimit ? 'font-bold text-yellow-600' : ''}>
                    {hoursWorked}
                    {exceedsDailyLimit && (
                      <span className="block text-xs text-yellow-600">({hoursWorked} trabajadas)</span>
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex space-x-2">
                      <Button
                        size="xs"
                        color="failure"
                        onClick={() => handleDeleteClick(employee)}
                        aria-label="Eliminar"
                      >
                        <FaTrash />
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>

        {attendance.length === 0 && (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            No se encontraron registros de asistencia
          </div>
        )}

        <div className="flex justify-between items-center p-4 border-t">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Mostrando {indexOfFirstItem + 1} a {Math.min(indexOfLastItem, attendance.length)} de {attendance.length} registros
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(attendance.length / itemsPerPage)}
            onPageChange={onPageChange}
            showIcons
          />
        </div>
      </div>

      {/* Modal Rango de fechas */}
      <Modal show={showModal} size="md" popup onClose={() => setShowModal(false)} initialFocus={emailInputRef}>
        <Modal.Header className="border-b pb-3">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Rango de fechas</h3>
        </Modal.Header>
        <Modal.Body className="space-y-4">
          <div>
            <Label htmlFor="fromDate" value="Desde" />
            <TextInput
              id="fromDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="toDate" value="Hasta" />
            <TextInput
              id="toDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
              className="mt-1"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-2">
            <Button color="gray" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button color="success" onClick={handleSubmitDateRange}>
              Aplicar
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      {/* Modal Editar */}
      <Modal show={showEditModal} size="md" onClose={handleCloseEditModal} popup>
        <Modal.Header className="border-b pb-3">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Editar asistencia</h3>
        </Modal.Header>
        <Modal.Body className="space-y-4">
          <div>
            <Label htmlFor="editEmpId" value="ID Empleado" />
            <TextInput
              id="editEmpId"
              value={editData.empId || ''}
              disabled
            />
          </div>
          <div>
            <Label htmlFor="editDate" value="Fecha" />
            <TextInput
              id="editDate"
              value={editData.date ? new Date(editData.date).toLocaleDateString('es-PE') : ''}
              disabled
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="editInTime" value="Hora de entrada *" />
              <TextInput
                type="time"
                id="editInTime"
                value={editData.inTime || ''}
                onChange={(e) => setEditData({ ...editData, inTime: e.target.value })}
                required
              />
              {!editData.inTime && (
                <p className="text-red-500 text-xs mt-1">Este campo es obligatorio</p>
              )}
              {editData.inTime && (
                <p className="text-xs text-gray-500 mt-1">
                  Horario permitido: 7:00 AM - 9:00 AM
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="editOutTime" value="Hora de salida *" />
              <TextInput
                type="time"
                id="editOutTime"
                value={editData.outTime || ''}
                onChange={(e) => setEditData({ ...editData, outTime: e.target.value })}
                required
              />
              {!editData.outTime && (
                <p className="text-red-500 text-xs mt-1">Este campo es obligatorio</p>
              )}
              {editData.outTime && (
                <p className="text-xs text-gray-500 mt-1">
                  Horario permitido: 6:00 PM - 10:00 PM
                </p>
              )}
            </div>
          </div>
          {editData.inTime && editData.outTime && (
            <div className="text-sm">
              <span className="font-medium">Horas trabajadas: </span>
              {(() => {
                const minutes = calculateHoursInMinutes(editData.inTime, editData.outTime);
                const hours = Math.floor(minutes / 60);
                const mins = minutes % 60;
                const exceedsLimit = minutes > 8 * 60;

                return (
                  <span className={exceedsLimit ? 'text-yellow-600 font-bold' : ''}>
                    {hours}h {mins}m
                    {exceedsLimit && (
                      <span className="block text-yellow-600">
                        (Horas trabajadas: {hours}h {mins}m)
                      </span>
                    )}
                  </span>
                );
              })()}
            </div>
          )}
          <div className="text-xs text-gray-500 mt-2">* Campos obligatorios</div>
          <div className="flex justify-end space-x-3 pt-2">
            <Button color="gray" onClick={handleCloseEditModal}>
              Cancelar
            </Button>
            <Button
              color="success"
              onClick={() => handleSubmitEdit(editData)}
              disabled={!editData.inTime || !editData.outTime}
            >
              Guardar cambios
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      {/* Modal Confirmar Eliminación */}
      <Modal show={confirmDelete} size="md" onClose={() => setConfirmDelete(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiInformationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              ¿Está seguro que desea eliminar este registro de asistencia?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="gray" onClick={() => setConfirmDelete(false)}>
                Cancelar
              </Button>
              <Button color="failure" onClick={handleConfirmDelete}>
                Sí, eliminar
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default AttendanceFrManager;