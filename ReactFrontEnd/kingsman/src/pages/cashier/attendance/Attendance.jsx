import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Alert, Pagination } from "flowbite-react";
import { FcAlarmClock } from "react-icons/fc"; // Importing FcAlarmClock icon
import { HiOutlineExclamationCircle, HiInformationCircle } from "react-icons/hi";
import axios from 'axios';

function Attendance() {
  const [attendance, setAttendance] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState({});
  const [isInTime, setIsInTime] = useState(true); // Track if it's in time or out time
  const [errorMessage, setErrorMessage] = useState(""); // State for error message
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const itemsPerPage = 10; // Number of items per page

  // Get today's date in the format: DD-MM-YYYY
  const todayDate = new Date().toLocaleDateString("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });

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
          outTime: ""
        })));
      })
      .catch(error => {
        console.error('Error al obtener los datos del empleado:', error);
      });
  };

  useEffect(() => {
    fetchEmployeeData();
  }, []); // Run only once on component mount

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAttendance = attendance.slice(indexOfFirstItem, indexOfLastItem);

  // Function to handle page change
  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  // Function to handle taking in time or out time
  const handleTakeTime = (empId, empName, position, isInTime) => {
    setSelectedEmployee({ empId, empName, position });
    setIsInTime(isInTime);
    setOpenModal(true);
  };

  const confirmAttendance = () => {
    const currentTime = new Date().toLocaleTimeString();
    console.log("Hora actual::", currentTime); // Check if currentTime is correct
    // Mark in attendance
    if (isInTime) {
      axios.post('http://localhost:8080/attendance/in', {
        empId: selectedEmployee.empId,
        empName: selectedEmployee.empName,
        position: selectedEmployee.position,
        inTime: currentTime,
      })
        .then(response => {
          setAttendance(prevAttendance => prevAttendance.map(emp => {
            if (emp.empId === selectedEmployee.empId) {
              return { ...emp, inTime: currentTime };
            }
            return emp;
          }));
          setOpenModal(false);
        })
        .catch(error => {
          console.error('Marcado de errores en la asistencia:', error);
          setOpenModal(false);
          if (error.response && error.response.status === 400) {
            // Set error message state
            setErrorMessage(error.response.data);
            // Clear error message after 1.5 seconds
            setTimeout(() => {
              setErrorMessage("");
            }, 1500);
          }
        });
    } else {
      // Mark out attendance
      axios.post('http://localhost:8080/attendance/out', {
        empId: selectedEmployee.empId, // Corrected field name to empId
        empName: selectedEmployee.empName,
        position: selectedEmployee.position,
        outTime: currentTime,
      })
        .then(response => {
          console.log("Tiempo fuera:", currentTime); // Check if outTime is being set correctly
          setAttendance(prevAttendance => prevAttendance.map(emp => {
            if (emp.empId === selectedEmployee.empId) {
              return { ...emp, outTime: currentTime };
            }
            return emp;
          }));
          setOpenModal(false);
        })
        .catch(error => {
          console.error('Error al marcar la asistencia:', error);
          setOpenModal(false);
          if (error.response && error.response.status === 400) {
            // Set error message state
            setErrorMessage(error.response.data);
            // Clear error message after 1.8 seconds
            setTimeout(() => {
              setErrorMessage("");
            }, 1800);
          }
        });
    }
  };

  return (
    <div className="mr-16 ml-16 mt-5 mb-5 w-full">
      {/* Header */}
      <h1 style={{ fontFamily: "Arial", fontSize: "24px", fontWeight: "bold" }}>
        Tomar asistencia (La fecha de hoy: {todayDate})
      </h1>

      {/* Table container */}
      <div>
        {/* Error Alert */}
        {errorMessage && (
          <Alert color="failure" icon={HiInformationCircle}>
            <span className="font-medium">Error!</span> {errorMessage}
          </Alert>
        )}
        <Table hoverable className="my-4 shadow">
          <Table.Head>
            <Table.HeadCell>#</Table.HeadCell>
            <Table.HeadCell>ID del empleado</Table.HeadCell>
            <Table.HeadCell>Nombre del empleado</Table.HeadCell>
            <Table.HeadCell>Rol</Table.HeadCell>
            <Table.HeadCell>Hora de entrada</Table.HeadCell>
            <Table.HeadCell>Marcar entrada</Table.HeadCell>
            <Table.HeadCell>Hora de salida</Table.HeadCell>
            <Table.HeadCell>Marcar salida</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {currentAttendance.map((employee, index) => (
              <Table.Row 
                key={index} 
                className="bg-slate-800 hover:bg-emerald-400"
              >
                <Table.Cell className="text-white">{indexOfFirstItem + index + 1}</Table.Cell>
                <Table.Cell className="text-white">{employee.empId}</Table.Cell>
                <Table.Cell className="text-white">{employee.empName}</Table.Cell>
                <Table.Cell className="text-white">{employee.position}</Table.Cell>
                <Table.Cell>
                  {employee.inTime ? employee.inTime : (
                    <FcAlarmClock style={{ cursor: 'pointer', fontSize: '24px', color: 'blue' }}/>
                  )}
                </Table.Cell>
                <Table.Cell>
                  <Button color="blue" pill onClick={() => handleTakeTime(employee.empId, employee.empName, employee.position, true)}>Registrar hora de entrada</Button>
                </Table.Cell>
                <Table.Cell>
                  {employee.outTime ? employee.outTime : (
                    <FcAlarmClock  style={{ cursor: 'pointer', fontSize: '24px', color: 'red' }} />
                  )}
                </Table.Cell>
                <Table.Cell>
                  <Button color="success" pill onClick={() => handleTakeTime(employee.empId, employee.empName, employee.position, false)}>Registrar hora de salida</Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center my-4">
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(attendance.length / itemsPerPage)}
          onPageChange={onPageChange}
          showIcons
        />
      </div>

      {/* Confirmation Modal */}
      <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              {isInTime ? `Confirm in time for ${selectedEmployee.empId}?` : `Confirm out time for ${selectedEmployee.empId}?`}
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="success" onClick={confirmAttendance}>
                Si, estoy seguro
              </Button>
              <Button color="gray" onClick={() => setOpenModal(false)}>
                No, cancelar
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Attendance;
