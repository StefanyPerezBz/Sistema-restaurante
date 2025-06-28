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
import { Button, Alert } from "flowbite-react";
import { FcAlarmClock, FcDownload } from "react-icons/fc";
import { HiInformationCircle } from "react-icons/hi";
import axios from 'axios';
import DataTable from 'react-data-table-component';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function Attendance() {
  const [attendance, setAttendance] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState({});
  const [isInTime, setIsInTime] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const tableRef = useRef();

  // Get today's date in the format: DD-MM-YYYY
  const todayDate = new Date().toLocaleDateString("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });

  // Effect to handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Function to translate position to Spanish
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

  // Function to format time to 12-hour format with AM/PM
  const formatTime = (timeString) => {
    if (!timeString) return "";

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

  // Function to get current time in 12-hour format
  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  // Function to check if current time is within allowed range
  const isTimeAllowed = (isEntry) => {
    const now = new Date();
    const hours = now.getHours();

    if (isEntry) {
      return hours >= 7 && hours < 11;
    } else {
      return hours >= 19 && hours < 22;
    }
  };

  // Function to fetch employee data from the backend
  const fetchEmployeeData = () => {
    axios.get('http://localhost:8080/employeeIdsAndPositions')
      .then(response => {
        const filteredData = response.data.filter(employee => employee[2] !== "manager");
        setAttendance(filteredData.map(employee => ({
          empId: employee[0],
          empName: employee[1],
          position: employee[2],
          inTime: "",
          outTime: "",
          hasRegisteredIn: false,
          hasRegisteredOut: false
        })));
      })
      .catch(error => {
        console.error('Error al obtener los datos del empleado:', error);
      });
  };

  useEffect(() => {
    fetchEmployeeData();
  }, []);

  // Function to export to PDF
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
      
      // Add title
      doc.setFontSize(18);
      doc.setTextColor(40, 40, 40);
      doc.text(`Reporte de Asistencia - ${todayDate}`, 15, 15);
      
      // Add company info
      doc.setFontSize(12);
      doc.text('Sistema de Control de Asistencia', 15, 25);
      
      // Prepare data for PDF
      const pdfData = attendance.map((emp, index) => [
        index + 1,
        emp.empId,
        emp.empName,
        translatePosition(emp.position),
        emp.inTime ? formatTime(emp.inTime) : "No registrado",
        emp.outTime ? formatTime(emp.outTime) : "No registrado",
        emp.inTime ? (emp.outTime ? "Completo" : "Solo entrada") : "Pendiente"
      ]);

      // Add table to PDF
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
          // Footer
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

  // Responsive columns configuration
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

  // Function to handle taking in time or out time
  const handleTakeTime = (empId, empName, position, isInTime) => {
    if (isInTime && !isTimeAllowed(true)) {
      Swal.fire({
        title: 'Fuera de horario',
        text: 'El horario de entrada es solo hasta las 9:00 AM. No puedes registrar tu entrada ahora.',
        icon: 'error',
        confirmButtonText: 'Entendido'
      });
      return;
    }

    if (!isInTime && !isTimeAllowed(false)) {
      Swal.fire({
        title: 'Fuera de horario',
        text: 'El horario de salida es entre 7:00 PM y 10:00 PM. No puedes registrar tu salida ahora.',
        icon: 'error',
        confirmButtonText: 'Entendido'
      });
      return;
    }

    setSelectedEmployee({ empId, empName, position });
    setIsInTime(isInTime);

    const confirmationText = isInTime 
      ? `¿Estás seguro de registrar tu hora de entrada ahora? (${getCurrentTime()})`
      : `Recuerda que tu horario de salida es hasta las 7:30 PM. ¿Estás seguro de registrar tu hora de salida ahora? (${getCurrentTime()})`;

    Swal.fire({
      title: isInTime ? 'Confirmar entrada' : 'Confirmar salida',
      text: confirmationText,
      icon: isInTime ? 'question' : 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, registrar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        confirmAttendance(empId, empName, position);
      }
    });
  };

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
          text: `Hora ${isInTime ? 'de entrada' : 'de salida'} registrada: ${currentTime}`,
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <h1 className="text-xl sm:text-2xl font-bold">
          Asistencia (Hoy: {todayDate})
        </h1>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <Alert color="failure" icon={HiInformationCircle} className="mb-4">
          <span className="font-medium">Error!</span> {errorMessage}
        </Alert>
      )}

      {/* DataTable */}
      <div className="my-4 shadow rounded-lg overflow-x-auto" ref={tableRef}>
        <DataTable
          columns={getColumns()}
          data={attendance}
          pagination
          responsive
          noHeader
          striped
          highlightOnHover
          paginationPerPage={10}
          paginationRowsPerPageOptions={[5, 10, 15, 20]}
          paginationComponentOptions={{
            rowsPerPageText: 'Filas por página:',
            rangeSeparatorText: 'de',
            noRowsPerPage: false,
            selectAllRowsItem: false
          }}
          noDataComponent={<div className="py-4 text-center">No hay datos disponibles</div>}
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