import React, { useState, useEffect, useRef } from "react";
import axios from 'axios'; // Import axios for HTTP requests
import { Table, Button, Modal, TextInput, Label, Pagination, Alert } from "flowbite-react";
import { FaUserEdit, FaTrash } from "react-icons/fa"; // Importing user edit icon
import { DeleteConfirmationModal } from "./DeleteConfirmationModal"; // Import the new confirmation modal component
import { HiInformationCircle } from "react-icons/hi";
import { FaDownload } from "react-icons/fa6";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

function AttendanceFrManager() {
  const [attendance, setAttendance] = useState([]); // State to hold attendance data
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [showEditModal, setShowEditModal] = useState(false); // State to control edit modal visibility
  const [selectedAttendance, setSelectedAttendance] = useState(null); // State to hold selected attendance for deletion
  const [confirmDelete, setConfirmDelete] = useState(false); // State to confirm delete action
  const emailInputRef = useRef(null); // Reference to email input field
  const [currentPage, setCurrentPage] = useState(1); // State to manage pagination
  const itemsPerPage = 6; // Number of items to display per page
  const [editData, setEditData] = useState({}); // State to hold data for editing
  const [empIds, setEmpIds] = useState([]); // State to hold employee IDs

  useEffect(() => {
    fetchAttendanceData(); // Fetch attendance data for the current date on component mount
    fetchEmployeeIds(); // Fetch employee IDs from backend
  }, []);

  // Function to fetch attendance data for the current date from backend
  const fetchAttendanceData = () => {
    // Make HTTP GET request to fetch attendance data for current date
    axios.get('http://localhost:8080/current-date')
      .then(response => {
        setAttendance(response.data); // Set fetched data to state
      })
      .catch(error => {
        console.error('Error al obtener los datos de asistencia:', error); // Log error if request fails
      });
  };

  // Function to fetch employee IDs from backend
  const fetchEmployeeIds = () => {
    // Make HTTP GET request to fetch employee IDs
    axios.get('http://localhost:8080/employeeIds')
      .then(response => {
        setEmpIds(response.data); // Set fetched employee IDs to state
      })
      .catch(error => {
        console.error('Error al obtener los ID de los empleados:', error); // Log error if request fails
      });
  };

  // Function to fetch attendance data for the current month from backend
  const fetchAttendanceDataForCurrentMonth = () => {
    // Make HTTP GET request to fetch attendance data for current month
    axios.get('http://localhost:8080/current-month')
      .then(response => {
        setAttendance(response.data); // Set fetched data to state
      })
      .catch(error => {
        console.error('Error al obtener los datos de asistencia para el mes actual:', error); // Log error if request fails
      });
  };

  // Calculate indexes for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = attendance.slice(indexOfFirstItem, indexOfLastItem);

  // Function to handle page change
  const onPageChange = (page) => setCurrentPage(page);

  // Function to handle "This Month" button click
  const handleThisMonthClick = () => {
    setShowModal(false); // Close modal if it's open
    fetchAttendanceDataForCurrentMonth(); // Fetch attendance data for current month
  };

  // Function to handle "Current Date" button click
  const handleCurrentDateClick = () => {
    setShowModal(false); // Close modal if it's open
    fetchAttendanceData(); // Fetch attendance data for current month
  };

  // Function to handle edit button click
  const handleEditClick = (data) => {
    setEditData(data);
    setShowEditModal(true);
  };

  // Function to handle delete button click
  const handleDeleteClick = (data) => {
    setSelectedAttendance(data);
    setConfirmDelete(true);
  };

  // Function to handle modal closing
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditData({});
  };

  // Function to handle form submission for editing
  const handleSubmitEdit = (formData) => {
    axios.put('http://localhost:8080/update', formData)
      .then(response => {
        console.log('Asistencia actualizada exitosamente:', response.data);
        handleCloseEditModal();
        fetchAttendanceData(); // Reload attendance data
      })
      .catch(error => {
        console.error('Error al actualizar la asistencia:', error);
      });
  };

  const [showAlert, setShowAlert] = useState(false);

  // Function to handle confirm delete
  const handleConfirmDelete = () => {
    const { empId, date } = selectedAttendance;
    axios.delete(`http://localhost:8080/DeleteAttendance/${empId}/${date}`)
      .then(response => {
        console.log('Asistencia eliminada exitosamente:', response.data);
        setConfirmDelete(false);
        fetchAttendanceData(); // Reload attendance data
        setShowAlert(true); // Show alert
        setTimeout(() => {
          setShowAlert(false); // Hide alert after 2 seconds
        }, 1700);
      })
      .catch(error => {
        console.error('Error al eliminar la asistencia:', error);
      });
  };

  // Add state variables to hold the date range
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Function to handle form submission for date range
  const handleSubmitDateRange = () => {
    // Make sure both start date and end date are provided
    if (!startDate || !endDate) {
      console.error("Seleccione la fecha de inicio y la fecha de finalización..");
      return;
    }

    // Make HTTP GET request to fetch attendance data for the specified date range
    axios.get(`http://localhost:8080/fetch-by-date-range/${startDate}/${endDate}`)
      .then(response => {
        setAttendance(response.data); // Set fetched data to state
        setShowModal(false); // Close the modal after fetching data
      })
      .catch(error => {
        console.error('Error al obtener los datos de asistencia para el rango de fechas especificado:', error); // Log error if request fails
      });
  };

  const handleFilterSubmit = () => {
    // Get selected EMP ID and Type values
    const empId = document.getElementById("attendanceType").value;
    const type = document.getElementById("department").value;

    // Compruebe si el ID o el tipo de EMP no están seleccionados
    if (empId === "select" || type === "select") {
      alert("Seleccione tanto el ID del empleado como el tipo.");
      return;
    }

    // Define the endpoint based on selected Type
    let endpoint = "";
    if (type === "today") {
      endpoint = `http://localhost:8080/attendance/${empId}/Today`;
    } else if (type === "this") {
      endpoint = `http://localhost:8080/attendance/${empId}/This%20Month`;
    }

    // Make GET request to fetch attendance data based on EMP ID and Type
    axios.get(endpoint)
      .then(response => {
        setAttendance(response.data); // Set fetched data to state
      })
      .catch(error => {
        console.error('Error al obtener datos de asistencia según el filtro:', error); // Log error if request fails
      });
  };



  const downloadPDF = () => {
    // Initialize jsPDF
    const doc = new jsPDF();
  
    // Set up table headers
    const headers = [["#", "ID", "Nombre del empleado", "Rol", "Fecha", "Hora de llegada", "Hora de salida"]];
  
    // Extract table data
    const data = currentItems.map((employee, index) => [
      indexOfFirstItem + index + 1,
      employee.empId,
      employee.empName,
      employee.position,
      employee.date,
      employee.inTime,
      employee.outTime
    ]);
  
    // Add headers and data to PDF
    doc.autoTable({
      head: headers,
      body: data
    });
  
    // Save the PDF
    doc.save("asistencia.pdf");
  };

  return (

    <div className="flex flex-col w-full bg-gray-200">
      {/* Filter controls */}
      <div className="flex items-center m-4 justify-between border-b bg-white dark:bg-gray-500 p-3 shadow-md rounded-md">
        {/* Dropdown for Name */}
        <div className="flex gap-4">
          <div>
            <label htmlFor="attendanceType" className="text-lg font-semibold">ID: </label>
            <select id="attendanceType" name="attendanceType" className="p-2 border border-gray-300 rounded-md w-40">
              <option value="select">-- Seleccionar --</option>
              {empIds.map((empId, index) => (
                <option key={index} value={empId}>{empId}</option>
              ))}
            </select>
          </div>
          {/* Dropdown for Type */}
          <div>
            <label htmlFor="department" className="text-lg font-semibold">Tipo: </label>
            <select id="department" name="department" className="p-2 border border-gray-300 rounded-md w-40">
              <option value="select">-- Seleccionar --</option>
              <option value="today">Hoy</option>
              <option value="this">Este mes</option>

              {/* Add more options as needed */}
            </select>
          </div>
          {/* Submit button */}
          <Button color='success' size='s' className="px-4 py-2 bg-green-600 hover:bg-blue-800 text-white rounded-md" onClick={handleFilterSubmit}>Enviar</Button>
        </div>
        {/* Buttons for predefined time periods */}
        <div className="flex gap-4">
          <Button color='success' size='s' className="px-4 py-2 bg-green-500 hover:bg-blue-800 text-white rounded-md" onClick={handleCurrentDateClick}>Hoy</Button>
          <Button color='success' size='s' className="px-4 py-2 bg-green-500 hover:bg-blue-800 text-white rounded-md" onClick={handleThisMonthClick}>Este mes</Button>
          <Button color='success' size='s' className="px-4 py-2 bg-green-500 hover:bg-blue-800 text-white rounded-md" onClick={() => setShowModal(true)}>Por rango de fechas</Button>
        </div>
      </div>

      {/* Attendance table */}
      <div className="m-4 shadow-md bg-white rounded-md">
        <Table hoverable className="mb-5 ">
          <Table.Head>

            <Table.HeadCell>#</Table.HeadCell>
            <Table.HeadCell>ID</Table.HeadCell>
            <Table.HeadCell>Nombre del empleado</Table.HeadCell>
            <Table.HeadCell>Rol</Table.HeadCell>
            <Table.HeadCell>Fecha</Table.HeadCell>
            <Table.HeadCell>Hora de llegada</Table.HeadCell>
            <Table.HeadCell>Hora de salida</Table.HeadCell>
            <Table.HeadCell>
              <div className="flex gap-4 justify-center">
              <div>Acción</div>
              <div><FaDownload className="text-blue-500 mr-3 hover:text-blue-700 cursor-pointer text-lg" onClick={downloadPDF} /></div>

              </div>
              
            </Table.HeadCell>

          </Table.Head>
          <Table.Body className="divide-y">
            {currentItems.map((employee, index) => (
              <Table.Row
                key={index}
                className="bg-slate-900 hover:bg-emerald-400"
              >
                <Table.Cell className="text-white">{indexOfFirstItem + index + 1}</Table.Cell>
                <Table.Cell className="text-white">{employee.empId}</Table.Cell>
                <Table.Cell className="text-white">{employee.empName}</Table.Cell>
                <Table.Cell className="text-white">{employee.position}</Table.Cell>
                <Table.Cell className="text-white">{employee.date}</Table.Cell>
                <Table.Cell className="text-white">{employee.inTime}</Table.Cell>
                <Table.Cell className="text-white">{employee.outTime}</Table.Cell>
                <Table.Cell className="flex">
                  <Button
                    style={{ backgroundColor: "blue", color: "white", outline: "none" }}
                    onClick={() => handleEditClick(employee)}
                  >
                    <FaUserEdit className="w-4 h-4" />
                  </Button>
                  <Button className="ml-3"
                    style={{ backgroundColor: "red", color: "white", outline: "none" }}
                    onClick={() => handleDeleteClick(employee)} // Pass employee data to delete function
                  >
                    <FaTrash className="w-3 h-4" />
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>

            {/* Alert for successful deletion */}
      {showAlert && (
        <div className="mt-5 ml-10 mr-10">
          <Alert color="info">
            Registro de asistencia eliminado exitosamente!
          </Alert>
        </div>
      )}
        {/* Pagination */}
        <div className="flex justify-center">
          <Pagination currentPage={currentPage} totalPages={Math.ceil(attendance.length / itemsPerPage)} onPageChange={onPageChange} />
        </div>
      </div>

  

      {/* Date Range Modal */}
      <Modal show={showModal} size="md" popup onClose={() => setShowModal(false)} initialFocus={emailInputRef}>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Rango de fechas personalizado</h3>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="fromDate" value="From Date" />
              </div>
              <TextInput
                id="fromDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="toDate" value="To Date" />
              </div>
              <TextInput
                id="toDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
            <div className="w-full">
              <Button onClick={handleSubmitDateRange}>Enviar</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* Edit modal */}
      <Modal show={showEditModal} size="md" onClose={handleCloseEditModal} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            {/* EmpId field (disabled) */}
            <div>
              <Label htmlFor="empId" value="Employee ID" />
              <TextInput id="empId" value={editData.empId} disabled />
            </div>
            {/* Date field (disabled) */}
            <div>
              <Label htmlFor="date" value="Date" />
              <TextInput id="date" value={editData.date} disabled />
            </div>
            {/* In Time field */}
            <div>
              <Label htmlFor="inTime" value="In Time" />
              <TextInput
                type="time"
                id="inTime"
                value={editData.inTime}
                onChange={(e) => setEditData({ ...editData, inTime: e.target.value })}
              />
            </div>
            {/* Out Time field */}
            <div>
              <Label htmlFor="outTime" value="Out Time" />
              <TextInput
                type="time"
                id="outTime"
                value={editData.outTime}
                onChange={(e) => setEditData({ ...editData, outTime: e.target.value })}
              />
            </div>
            <div className="w-full">
              <Button onClick={() => handleSubmitEdit(editData)}>Enviar</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* Confirmation modal for delete */}
      <DeleteConfirmationModal
        show={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
export default AttendanceFrManager;
