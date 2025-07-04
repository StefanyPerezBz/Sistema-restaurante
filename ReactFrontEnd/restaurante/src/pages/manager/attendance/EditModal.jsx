import React, { useState, useEffect } from 'react';
import { Modal, TextInput, Button, Label } from "flowbite-react";

function EditModal({ isOpen, onClose, onSubmit, selectedAttendance }) {
  const [inTime, setInTime] = useState('');
  const [outTime, setOutTime] = useState('');

  useEffect(() => {
    if (selectedAttendance) {
      setInTime(selectedAttendance.inTime || '');
      setOutTime(selectedAttendance.outTime || '');
    }
  }, [isOpen, selectedAttendance]);

  const handleInTimeChange = (event) => {
    setInTime(event.target.value);
  };

  const handleOutTimeChange = (event) => {
    setOutTime(event.target.value);
  };

  const handleSubmit = () => {
    const formData = {
      empId: selectedAttendance ? selectedAttendance.empId : '',
      date: selectedAttendance ? selectedAttendance.date : '',
      inTime: inTime,
      outTime: outTime
    };
    onSubmit(formData);
  };
  

  return (
    <Modal show={isOpen} size="md" onClose={onClose} popup>
      <Modal.Header />
      <Modal.Body>
        <div className="space-y-6">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">Editar asistencia</h3>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="empId" value="Emp ID" />
            </div>
            <TextInput
              id="empId"
              value={selectedAttendance ? selectedAttendance.empId : ''}
              disabled
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="date" value="Date" />
            </div>
            <TextInput
              id="date"
              value={selectedAttendance ? selectedAttendance.date : ''}
              disabled
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="inTime" value="In Time" />
            </div>
            <TextInput
              id="inTime"
              type="time"
              value={inTime}
              onChange={handleInTimeChange}
              required
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="outTime" value="Out Time" />
            </div>
            <TextInput
              id="outTime"
              type="time"
              value={outTime}
              onChange={handleOutTimeChange}
              required
            />
          </div>
          <div className="w-full">
            <Button onClick={handleSubmit}>Enviar</Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default EditModal;
