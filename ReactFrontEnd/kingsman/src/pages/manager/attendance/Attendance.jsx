// import React, { useState, useEffect } from "react";
// import { Table, Button, Modal, Alert, Pagination } from "flowbite-react";
// import { FcAlarmClock } from "react-icons/fc"; // Importing FcAlarmClock icon
// import { HiOutlineExclamationCircle, HiInformationCircle } from "react-icons/hi";
// import axios from 'axios';

// function Attendance() {
//   const [attendance, setAttendance] = useState([]);
//   const [openModal, setOpenModal] = useState(false);
//   const [selectedEmployee, setSelectedEmployee] = useState({});
//   const [isInTime, setIsInTime] = useState(true); // Track if it's in time or out time
//   const [errorMessage, setErrorMessage] = useState(""); // State for error message
//   const [currentPage, setCurrentPage] = useState(1); // State for current page
//   const itemsPerPage = 10; // Number of items per page

//   // Get today's date in the format: DD-MM-YYYY
//   const todayDate = new Date().toLocaleDateString("en-US", {
//     day: "2-digit",
//     month: "2-digit",
//     year: "numeric"
//   });

//   // Function to fetch employee data from the backend
//   const fetchEmployeeData = () => {
//     axios.get('http://localhost:8080/employeeIdsAndPositions')
//       .then(response => {
//         const filteredData = response.data.filter(employee => employee[2] !== "manager");
//         setAttendance(filteredData.map(employee => ({
//           empId: employee[0],
//           empName: employee[1],
//           position: employee[2],
//           inTime: "",
//           outTime: ""
//         })));
//       })
//       .catch(error => {
//         console.error('Error al obtener los datos del empleado:', error);
//       });
//   };

//   useEffect(() => {
//     fetchEmployeeData();
//   }, []); // Run only once on component mount

//   // Pagination calculations
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentAttendance = attendance.slice(indexOfFirstItem, indexOfLastItem);

//   // Function to handle page change
//   const onPageChange = (page) => {
//     setCurrentPage(page);
//   };

//   // Function to handle taking in time or out time
//   const handleTakeTime = (empId, empName, position, isInTime) => {
//     setSelectedEmployee({ empId, empName, position });
//     setIsInTime(isInTime);
//     setOpenModal(true);
//   };

//   const confirmAttendance = () => {
//     const currentTime = new Date().toLocaleTimeString();
//     console.log("Hora actual::", currentTime); // Check if currentTime is correct
//     // Mark in attendance
//     if (isInTime) {
//       axios.post('http://localhost:8080/attendance/in', {
//         empId: selectedEmployee.empId,
//         empName: selectedEmployee.empName,
//         position: selectedEmployee.position,
//         inTime: currentTime,
//       })
//         .then(response => {
//           setAttendance(prevAttendance => prevAttendance.map(emp => {
//             if (emp.empId === selectedEmployee.empId) {
//               return { ...emp, inTime: currentTime };
//             }
//             return emp;
//           }));
//           setOpenModal(false);
//         })
//         .catch(error => {
//           console.error('Marcado de errores en la asistencia:', error);
//           setOpenModal(false);
//           if (error.response && error.response.status === 400) {
//             // Set error message state
//             setErrorMessage(error.response.data);
//             // Clear error message after 1.5 seconds
//             setTimeout(() => {
//               setErrorMessage("");
//             }, 1500);
//           }
//         });
//     } else {
//       // Mark out attendance
//       axios.post('http://localhost:8080/attendance/out', {
//         empId: selectedEmployee.empId, // Corrected field name to empId
//         empName: selectedEmployee.empName,
//         position: selectedEmployee.position,
//         outTime: currentTime,
//       })
//         .then(response => {
//           console.log("Tiempo fuera:", currentTime); // Check if outTime is being set correctly
//           setAttendance(prevAttendance => prevAttendance.map(emp => {
//             if (emp.empId === selectedEmployee.empId) {
//               return { ...emp, outTime: currentTime };
//             }
//             return emp;
//           }));
//           setOpenModal(false);
//         })
//         .catch(error => {
//           console.error('Error al marcar la asistencia:', error);
//           setOpenModal(false);
//           if (error.response && error.response.status === 400) {
//             // Set error message state
//             setErrorMessage(error.response.data);
//             // Clear error message after 1.8 seconds
//             setTimeout(() => {
//               setErrorMessage("");
//             }, 1800);
//           }
//         });
//     }
//   };

//   return (
//     <div className="mr-16 ml-16 mt-5 mb-5 w-full">
//       {/* Header */}
//       <h1 style={{ fontFamily: "Arial", fontSize: "24px", fontWeight: "bold" }}>
//         Tomar asistencia (La fecha de hoy: {todayDate})
//       </h1>

//       {/* Table container */}
//       <div>
//         {/* Error Alert */}
//         {errorMessage && (
//           <Alert color="failure" icon={HiInformationCircle}>
//             <span className="font-medium">Error!</span> {errorMessage}
//           </Alert>
//         )}
//         <Table hoverable className="my-4 shadow">
//           <Table.Head>
//             <Table.HeadCell>#</Table.HeadCell>
//             <Table.HeadCell>ID del empleado</Table.HeadCell>
//             <Table.HeadCell>Nombre del empleado</Table.HeadCell>
//             <Table.HeadCell>Rol</Table.HeadCell>
//             <Table.HeadCell>Hora de entrada</Table.HeadCell>
//             <Table.HeadCell>Marcar entrada</Table.HeadCell>
//             <Table.HeadCell>Hora de salida</Table.HeadCell>
//             <Table.HeadCell>Marcar salida</Table.HeadCell>
//           </Table.Head>
//           <Table.Body className="divide-y">
//             {currentAttendance.map((employee, index) => (
//               <Table.Row 
//                 key={index} 
//                 className="bg-slate-800 hover:bg-emerald-400"
//               >
//                 <Table.Cell className="text-white">{indexOfFirstItem + index + 1}</Table.Cell>
//                 <Table.Cell className="text-white">{employee.empId}</Table.Cell>
//                 <Table.Cell className="text-white">{employee.empName}</Table.Cell>
//                 <Table.Cell className="text-white">{employee.position}</Table.Cell>
//                 <Table.Cell>
//                   {employee.inTime ? employee.inTime : (
//                     <FcAlarmClock style={{ cursor: 'pointer', fontSize: '24px', color: 'blue' }}/>
//                   )}
//                 </Table.Cell>
//                 <Table.Cell>
//                   <Button color="blue" pill onClick={() => handleTakeTime(employee.empId, employee.empName, employee.position, true)}>Registrar hora de entrada</Button>
//                 </Table.Cell>
//                 <Table.Cell>
//                   {employee.outTime ? employee.outTime : (
//                     <FcAlarmClock  style={{ cursor: 'pointer', fontSize: '24px', color: 'red' }} />
//                   )}
//                 </Table.Cell>
//                 <Table.Cell>
//                   <Button color="success" pill onClick={() => handleTakeTime(employee.empId, employee.empName, employee.position, false)}>Registrar hora de salida</Button>
//                 </Table.Cell>
//               </Table.Row>
//             ))}
//           </Table.Body>
//         </Table>
//       </div>

//       {/* Pagination */}
//       <div className="flex justify-center my-4">
//         <Pagination
//           currentPage={currentPage}
//           totalPages={Math.ceil(attendance.length / itemsPerPage)}
//           onPageChange={onPageChange}
//           showIcons
//         />
//       </div>

//       {/* Confirmation Modal */}
//       <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
//         <Modal.Header />
//         <Modal.Body>
//           <div className="text-center">
//             <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
//             <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
//               {isInTime ? `Confirm in time for ${selectedEmployee.empId}?` : `Confirm out time for ${selectedEmployee.empId}?`}
//             </h3>
//             <div className="flex justify-center gap-4">
//               <Button color="success" onClick={confirmAttendance}>
//                 Si, estoy seguro
//               </Button>
//               <Button color="gray" onClick={() => setOpenModal(false)}>
//                 No, cancelar
//               </Button>
//             </div>
//           </div>
//         </Modal.Body>
//       </Modal>
//     </div>
//   );
// }

// export default Attendance;

import React, { useState, useEffect, useRef } from "react";
import { Button, Alert, Modal, TextInput, Label } from "flowbite-react";
import { FcAlarmClock, FcDownload } from "react-icons/fc";
import { HiInformationCircle, HiX, HiCheck } from "react-icons/hi";
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
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState({});
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
    if (timeString === "absent") return "Ausente";

    if (timeString.includes("AM") || timeString.includes("PM")) {
      return timeString;
    }

    const timeParts = timeString.split(':');
    let hours = parseInt(timeParts[0]);
    const minutes = timeParts[1];
    const seconds = timeParts[2]?.split(' ')[0] || '';

    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;

    return `${hours}:${minutes}:${seconds} ${ampm}`;
  };

  // Obtener hora actual en formato 12 horas
  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  // Validar si la hora actual está dentro del rango permitido
  const isTimeAllowed = (isEntry) => {
    const now = new Date();
    const hours = now.getHours();

    if (isEntry) {
      return hours >= 7 && hours < 11; // Entrada permitida de 7AM a 11AM
    } else {
      return hours >= 19 && hours < 22; // Salida permitida de 7PM a 10PM
    }
  };

  // Obtener datos de empleados
  const fetchEmployeeData = () => {
    setLoading(true);
    axios.get('http://localhost:8080/employeeIdsAndPositions')
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
          isAbsent: false,
          date: new Date().toISOString().split('T')[0]
        }));

        // Obtener registros existentes para hoy
        axios.get('http://localhost:8080/current-date')
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
                  hasRegisteredIn: !!existingRecord.inTime || existingRecord.inTime === "absent",
                  hasRegisteredOut: !!existingRecord.outTime,
                  isAbsent: existingRecord.inTime === "absent"
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
        emp.isAbsent ? "Ausente" : formatTime(emp.inTime),
        emp.isAbsent ? "N/A" : formatTime(emp.outTime),
        emp.isAbsent ? "Ausente" : (emp.inTime ? (emp.outTime ? "Completo" : "Solo entrada") : "Pendiente")
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
          row.isAbsent ? "Ausente" : (row.inTime ? formatTime(row.inTime) : (
            <FcAlarmClock style={{ fontSize: '24px', color: 'blue' }} />
          ))
        ),
        sortable: true,
        width: '120px'
      },
      {
        name: windowWidth < 640 ? 'Entrada' : 'Marcar entrada',
        cell: row => (
          <div className="flex flex-col gap-1">
            <Button
              color="blue"
              size="xs"
              pill
              onClick={() => handleTakeTime(row.empId, row.empName, row.position, true)}
              disabled={row.hasRegisteredIn || row.isAbsent || !isTimeAllowed(true)}
              className="text-xs sm:text-sm"
            >
              {windowWidth < 640 ? 'Entrada' : 'Registrar entrada'}
            </Button>
            <Button
              color="gray"
              size="xs"
              pill
              onClick={() => handleMarkAbsent(row.empId, row.empName, row.position)}
              disabled={row.hasRegisteredIn || row.isAbsent}
              className="text-xs sm:text-sm"
            >
              {windowWidth < 640 ? 'Ausente' : 'Marcar ausente'}
            </Button>
          </div>
        ),
        width: windowWidth < 640 ? '100px' : '150px'
      },
      {
        name: windowWidth < 640 ? 'Salida' : 'Hora de salida',
        cell: row => (
          row.isAbsent ? "N/A" : (row.outTime ? formatTime(row.outTime) : (
            <FcAlarmClock style={{ fontSize: '24px', color: 'red' }} />
          ))
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
            disabled={!row.hasRegisteredIn || row.hasRegisteredOut || row.isAbsent || !isTimeAllowed(false)}
            className="text-xs sm:text-sm"
          >
            {windowWidth < 640 ? 'Salida' : 'Registrar salida'}
          </Button>
        ),
        width: windowWidth < 640 ? '100px' : '150px'
      },
      {
        name: 'Acciones',
        cell: row => (
          <div className="flex gap-1">
            <Button
              size="xs"
              color="warning"
              onClick={() => handleEditClick(row)}
              disabled={!row.hasRegisteredIn && !row.isAbsent}
            >
              Editar
            </Button>
            <Button
              size="xs"
              color="failure"
              onClick={() => handleDeleteClick(row)}
              disabled={!row.hasRegisteredIn && !row.isAbsent}
            >
              Eliminar
            </Button>
          </div>
        ),
        width: '120px',
        omit: windowWidth < 768
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
              hasRegisteredOut: !isInTime ? true : emp.hasRegisteredOut,
              isAbsent: false
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

  // Marcar como ausente
  const handleMarkAbsent = (empId, empName, position) => {
    Swal.fire({
      title: 'Marcar como ausente',
      html: `¿Estás seguro de marcar a <strong>${empName}</strong> como ausente hoy?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, marcar ausente',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        markAsAbsent(empId, empName, position);
      }
    });
  };

  const markAsAbsent = (empId, empName, position) => {
    axios.post(`http://localhost:8080/attendance/in`, {
      empId: empId,
      empName: empName,
      position: position,
      inTime: "absent",
      date: new Date().toISOString().split('T')[0]
    })
      .then(response => {
        setAttendance(prevAttendance => prevAttendance.map(emp => {
          if (emp.empId === empId) {
            return {
              ...emp,
              inTime: "absent",
              outTime: "",
              hasRegisteredIn: true,
              hasRegisteredOut: false,
              isAbsent: true
            };
          }
          return emp;
        }));

        Swal.fire({
          title: 'Ausente registrado',
          text: `${empName} ha sido marcado como ausente hoy`,
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
      })
      .catch(error => {
        console.error('Error al marcar como ausente:', error);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo marcar como ausente',
          icon: 'error',
          confirmButtonText: 'Entendido'
        });
      });
  };

  // Editar registro
  const handleEditClick = (data) => {
    setEditData({
      ...data,
      originalInTime: data.inTime,
      originalOutTime: data.outTime,
      inTime: data.inTime === "absent" ? "" : data.inTime,
      outTime: data.outTime,
      isAbsent: data.isAbsent
    });
    setEditModalOpen(true);
  };

  const handleEditSubmit = () => {
    // Validar que al menos haya hora de entrada o esté marcado como ausente
    if (!editData.inTime && !editData.isAbsent) {
      Swal.fire({
        title: 'Error',
        text: 'La hora de entrada es requerida o debe marcar como ausente',
        icon: 'error',
        confirmButtonText: 'Entendido'
      });
      return;
    }

    // Validar rangos horarios si no es ausente
    if (editData.inTime && !editData.isAbsent) {
      const [hours, minutes] = editData.inTime.split(':').map(Number);
      const totalMinutes = hours * 60 + minutes;
      
      if (totalMinutes < 420 || totalMinutes > 660) { // 7:00 AM a 11:00 AM
        Swal.fire({
          title: 'Error',
          text: 'La hora de entrada debe estar entre 7:00 AM y 11:00 AM',
          icon: 'error',
          confirmButtonText: 'Entendido'
        });
        return;
      }
    }

    if (editData.outTime && !editData.isAbsent) {
      const [hours, minutes] = editData.outTime.split(':').map(Number);
      const totalMinutes = hours * 60 + minutes;
      
      if (totalMinutes < 1140 || totalMinutes > 1320) { // 7:00 PM a 10:00 PM
        Swal.fire({
          title: 'Error',
          text: 'La hora de salida debe estar entre 7:00 PM y 10:00 PM',
          icon: 'error',
          confirmButtonText: 'Entendido'
        });
        return;
      }
    }

    // Si no hay cambios, no hacemos la petición
    if (editData.inTime === editData.originalInTime && 
        editData.outTime === editData.originalOutTime &&
        editData.isAbsent === (editData.originalInTime === "absent")) {
      Swal.fire({
        title: 'Sin cambios',
        text: 'No se detectaron cambios para guardar',
        icon: 'info',
        confirmButtonText: 'Entendido'
      });
      setEditModalOpen(false);
      return;
    }

    // Confirmar antes de actualizar
    Swal.fire({
      title: 'Confirmar cambios',
      html: `¿Estás seguro de actualizar el registro de asistencia de <strong>${editData.empName}</strong>?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, actualizar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        updateAttendance();
      }
    });
  };

  const updateAttendance = () => {
    const inTimeValue = editData.isAbsent ? "absent" : editData.inTime;
    const outTimeValue = editData.isAbsent ? "" : editData.outTime;

    axios.put('http://localhost:8080/update', {
      empId: editData.empId,
      empName: editData.empName,
      position: editData.position,
      inTime: inTimeValue,
      outTime: outTimeValue,
      date: editData.date
    })
      .then(response => {
        setAttendance(prevAttendance => prevAttendance.map(emp => {
          if (emp.empId === editData.empId) {
            return {
              ...emp,
              inTime: inTimeValue,
              outTime: outTimeValue,
              hasRegisteredIn: !!inTimeValue || editData.isAbsent,
              hasRegisteredOut: !!outTimeValue,
              isAbsent: editData.isAbsent
            };
          }
          return emp;
        }));

        Swal.fire({
          title: 'Actualizado',
          text: 'El registro de asistencia ha sido actualizado',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
        setEditModalOpen(false);
      })
      .catch(error => {
        console.error('Error al actualizar la asistencia:', error);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo actualizar el registro',
          icon: 'error',
          confirmButtonText: 'Entendido'
        });
      });
  };

  // Eliminar registro
  const handleDeleteClick = (data) => {
    Swal.fire({
      title: 'Confirmar eliminación',
      html: `¿Estás seguro de eliminar el registro de asistencia de <strong>${data.empName}</strong>?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteAttendance(data.empId, data.date);
      }
    });
  };

  const deleteAttendance = (empId, date) => {
    axios.delete(`http://localhost:8080/DeleteAttendance/${empId}/${date}`)
      .then(response => {
        setAttendance(prevAttendance => prevAttendance.map(emp => {
          if (emp.empId === empId) {
            return {
              ...emp,
              inTime: "",
              outTime: "",
              hasRegisteredIn: false,
              hasRegisteredOut: false,
              isAbsent: false
            };
          }
          return emp;
        }));

        Swal.fire({
          title: 'Eliminado',
          text: 'El registro de asistencia ha sido eliminado',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
      })
      .catch(error => {
        console.error('Error al eliminar la asistencia:', error);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo eliminar el registro',
          icon: 'error',
          confirmButtonText: 'Entendido'
        });
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

      {/* Modal de edición */}
      <Modal show={editModalOpen} size="md" onClose={() => setEditModalOpen(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Editar asistencia</h3>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="empId" value="ID Empleado" />
              </div>
              <TextInput
                id="empId"
                value={editData.empId || ''}
                disabled
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="empName" value="Nombre" />
              </div>
              <TextInput
                id="empName"
                value={editData.empName || ''}
                disabled
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="date" value="Fecha" />
              </div>
              <TextInput
                id="date"
                value={editData.date ? new Date(editData.date).toLocaleDateString('es-ES') : ''}
                disabled
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="inTime" value="Hora de entrada (7AM - 11AM)" />
              </div>
              <div className="flex gap-2">
                <TextInput
                  id="inTime"
                  type="time"
                  value={editData.inTime || ''}
                  onChange={(e) => setEditData({...editData, inTime: e.target.value, isAbsent: false})}
                  className="flex-1"
                  disabled={editData.originalInTime === "absent"}
                />
                <Button 
                  color={editData.isAbsent ? "success" : "gray"} 
                  onClick={() => setEditData({
                    ...editData, 
                    inTime: "",
                    outTime: "",
                    isAbsent: !editData.isAbsent
                  })}
                  disabled={editData.originalInTime === "absent"}
                >
                  {editData.isAbsent ? <HiCheck /> : <HiX />}
                  <span className="ml-1">Ausente</span>
                </Button>
              </div>
              {editData.originalInTime === "absent" && (
                <p className="text-sm text-gray-500 mt-1">Este empleado fue marcado como ausente y no puede editarse</p>
              )}
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="outTime" value="Hora de salida (7PM - 10PM)" />
              </div>
              <TextInput
                id="outTime"
                type="time"
                value={editData.outTime || ''}
                onChange={(e) => setEditData({...editData, outTime: e.target.value})}
                disabled={editData.isAbsent || editData.originalInTime === "absent"}
              />
            </div>
            <div className="w-full flex justify-end space-x-3">
              <Button color="gray" onClick={() => setEditModalOpen(false)}>
                Cancelar
              </Button>
              <Button 
                onClick={handleEditSubmit}
                disabled={editData.originalInTime === "absent"}
              >
                Guardar cambios
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Attendance;