import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button } from "flowbite-react";

function AbsentiesModal({ onClose, reloadAttendance }) {
  const [absentees, setAbsentees] = useState([]);
  const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format

  useEffect(() => {
    fetchAbsentees();
  }, []);

  const fetchAbsentees = () => {
    axios.get(`http://localhost:8080/employeeDetails`)
      .then(response => {
        setAbsentees(response.data.map(employee => ({
          empId: employee[0],
          empName: employee[1],
          position: employee[2]
        })));
      })
      .catch(error => {
        console.error('Error fetching absentees:', error);
      });
  };

  const markAttendance = () => {
    const attendanceData = absentees.map(absentee => ({
      empId: absentee.empId,
      empName: absentee.empName,
      date: currentDate,
      position: absentee.position,
      inTime: "Absent",
      outTime: "Absent"
    }));

    axios.post('http://localhost:8080/attendances', attendanceData)
      .then(response => {
        console.log('Asistencia marcada exitosamente:', response.data);
        onClose(); // Close the modal
        reloadAttendance(); // Reload attendance data
      })
      .catch(error => {
        console.error('Error al marcar la asistencia:', error);
      });
  };

  return (
    <div>
      <div className='text-end'>
        <Button color="blue" pill className=" mt-2 mb-2" onClick={markAttendance}>Marcar</Button>
      </div>
      <Table hoverable className='shadow border'>
        <Table.Head>
          <Table.HeadCell>#</Table.HeadCell>
          <Table.HeadCell>Nombre del empleado</Table.HeadCell>
          <Table.HeadCell>Rol</Table.HeadCell>
          <Table.HeadCell>Estado</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {absentees.map((absentee, index) => (
            <Table.Row key={index} className="bg-white dark:border-gray-700 dark:bg-gray-800">
              <Table.Cell>{absentee.empId}</Table.Cell>
              <Table.Cell>{absentee.empName}</Table.Cell>
              <Table.Cell>{absentee.position}</Table.Cell>
              <Table.Cell>Ausente</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
}

export default AbsentiesModal;
