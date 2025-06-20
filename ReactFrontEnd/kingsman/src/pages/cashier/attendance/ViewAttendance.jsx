import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Alert } from "flowbite-react";
import { FaEdit, FaTrash } from 'react-icons/fa';
import EditModal from './EditModal';
import AbsentiesModal from './AbsentiesModal';

function ViewAttendance() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedAttendance, setSelectedAttendance] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [openAbsentiesModal, setOpenAbsentiesModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const handleCloseAbsentiesModal = () => {
    setOpenAbsentiesModal(false);
  };

  const fetchAttendanceData = () => {
    axios.get('http://localhost:8080/current-date')
      .then(response => {
        setAttendanceData(response.data);
      })
      .catch(error => {
        console.error('Error al obtener los datos de asistencia:', error);
      });
  };

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  const handleEditClick = (attendance) => {
    setSelectedAttendance(attendance);
    setOpenEditModal(true);
  };

  const handleDeleteClick = (empId, date) => {
    setSelectedAttendance({ empId, date });
    setConfirmDelete(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setSelectedAttendance(null);
  };

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

  return (
    <div className='w-full bg-gray-100' >
      {/* Absentees button */}
      <div className="mt-10 text-right flex justify-end mr-10 ">
        <Button outline gradientDuoTone="greenToBlue" onClick={() => setOpenAbsentiesModal(true)}>
          Ausente
        </Button>
      </div>

      {/* Attendance table */}
      <div className="mt-5 ml-10 mr-10 shadow  ">
        <Table hoverable>
          <Table.Head>
            <Table.HeadCell>#</Table.HeadCell>
            <Table.HeadCell>Nombre del empleado</Table.HeadCell>
            <Table.HeadCell>Rol</Table.HeadCell>
            <Table.HeadCell>Fecha</Table.HeadCell>
            <Table.HeadCell>Hora de entrada</Table.HeadCell>
            <Table.HeadCell>Hora de salida</Table.HeadCell>
            <Table.HeadCell>Acción</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {attendanceData.map((attendance, index) => (
              <Table.Row key={index} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell>{attendance.empId}</Table.Cell>
                <Table.Cell>{attendance.empName}</Table.Cell>
                <Table.Cell>{attendance.position}</Table.Cell>
                <Table.Cell>{attendance.date}</Table.Cell>
                <Table.Cell>{attendance.inTime}</Table.Cell>
                <Table.Cell>{attendance.outTime}</Table.Cell>
                <Table.Cell className="flex">
                  <FaEdit className="text-blue-500 mr-3 hover:text-blue-700 cursor-pointer text-lg" onClick={() => handleEditClick(attendance)} />
                  <FaTrash className="text-red-500 hover:text-red-700 cursor-pointer text-lg" onClick={() => handleDeleteClick(attendance.empId, attendance.date)} />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>

      {/* Delete confirmation modal */}
      <Modal show={confirmDelete} size="md" onClose={() => setConfirmDelete(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <h3 className="mb-2 text-lg font-normal text-gray-500 dark:text-gray-400">
              ¿Está seguro de que desea eliminar el registro de asistencia del empleado {selectedAttendance ? selectedAttendance.empId : ''}?
            </h3>
            <p className="mb-5 text-sm text-gray-400 dark:text-gray-500">
              Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleConfirmDelete}>
                {"Si, estoy seguro"}
              </Button>
              <Button color="gray" onClick={() => setConfirmDelete(false)}>
                No, cancelar
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* Alert for successful deletion */}
      {showAlert && (
        <div className="mt-5 ml-10 mr-10">
          <Alert color="info">
            Registro de asistencia eliminado exitosamente!
          </Alert>
        </div>
      )}

      {/* Render the EditModal component */}
      <EditModal
        isOpen={openEditModal}
        onClose={handleCloseEditModal}
        onSubmit={handleSubmitEdit}
        selectedAttendance={selectedAttendance}
        empId={selectedAttendance ? selectedAttendance.empId : ''}
        date={selectedAttendance ? selectedAttendance.date : ''}
      />

      {/* AbsentiesModal component */}
      <Modal show={openAbsentiesModal} size="lg" onClose={handleCloseAbsentiesModal} popup>
        <Modal.Header>Empleados ausentes hoy</Modal.Header>
        <Modal.Body>
          <AbsentiesModal onClose={handleCloseAbsentiesModal} reloadAttendance={fetchAttendanceData} />
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default ViewAttendance;
