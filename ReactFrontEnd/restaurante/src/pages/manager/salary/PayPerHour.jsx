

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Modal, Label, TextInput } from "flowbite-react";
import Select from 'react-select';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import HourlyPayTable from './HourlyPayTable';

const MySwal = withReactContent(Swal);

// Diccionario de traducción de roles
const roleTranslations = {
  'cashier': 'Cajero',
  'waiter': 'Mesero',
  'chef': 'Chef'
};

function PayPerHour() {
  const [hourlyModalOpen, setHourlyModalOpen] = useState(false);
  const [hourlyPay, setHourlyPay] = useState('');
  const [otPay, setOTPay] = useState('');
  const [positions, setPositions] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [errors, setErrors] = useState({
    position: '',
    hourlyPay: '',
    otPay: ''
  });
  const [refreshHourlyTable, setRefreshHourlyTable] = useState(false);

  useEffect(() => {
    fetchPositions();
  }, []);

  const fetchPositions = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/employeeIdsAndPositions`);
      const filteredPositions = response.data.filter(item => item[2] !== 'manager');

      const uniquePositions = [...new Set(filteredPositions.map(item => item[2]))];

      const positionOptions = uniquePositions.map(position => ({
        value: position, // Guardamos el valor original en inglés
        label: roleTranslations[position] || position // Mostramos la traducción o el original si no existe
      }));

      setPositions(positionOptions);
    } catch (error) {
      console.error('Error al buscar roles:', error);
      showError('Error al cargar los puestos disponibles');
    }
  };

  const showSuccess = (message) => {
    MySwal.fire({
      title: 'Éxito',
      text: message,
      icon: 'success',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Aceptar'
    });
  };

  const showError = (message) => {
    MySwal.fire({
      title: 'Error',
      text: message,
      icon: 'error',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Aceptar'
    });
  };

  const validateForm = () => {
    const decimalOrIntegerPattern = /^\d+(\.\d)?$/; // entero o decimal con un solo decimal

    const newErrors = {
      position: !selectedPosition ? 'Debe seleccionar un puesto' : '',

      hourlyPay: !hourlyPay || !decimalOrIntegerPattern.test(hourlyPay) || parseFloat(hourlyPay) < 1
        ? 'Debe ingresar un monto válido mayor o igual a 1, con máximo un decimal'
        : '',

      otPay: !otPay || !decimalOrIntegerPattern.test(otPay) || parseFloat(otPay) < 1
        ? 'Debe ingresar un monto válido mayor o igual a 1, con máximo un decimal'
        : ''
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };


  const handleOpenHourlyModal = () => {
    setHourlyModalOpen(true);
    setSelectedPosition(null);
    setHourlyPay('');
    setOTPay('');
    setErrors({
      position: '',
      hourlyPay: '',
      otPay: ''
    });
  };

  const closeHourlyModal = () => {
    setHourlyModalOpen(false);
  };

  const handleHourlyPayChange = (e) => {
    const value = e.target.value;
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      setHourlyPay(value);
      setErrors({ ...errors, hourlyPay: '' });
    }
  };

  const handleOTPayChange = (e) => {
    const value = e.target.value;
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      setOTPay(value);
      setErrors({ ...errors, otPay: '' });
    }
  };

  const incrementHourlyPay = () => {
    const newValue = parseFloat(hourlyPay || 0) + 10;
    setHourlyPay(newValue.toString());
    setErrors({ ...errors, hourlyPay: '' });
  };

  const incrementOTPay = () => {
    const newValue = parseFloat(otPay || 0) + 10;
    setOTPay(newValue.toString());
    setErrors({ ...errors, otPay: '' });
  };

  const handleAddHourlyPay = async () => {
    if (!validateForm()) return;

    const hourlyPayData = {
      position: selectedPosition.value, // Enviamos el valor original en inglés
      payPerHour: parseFloat(hourlyPay).toFixed(2),
      payPerOverTimeHour: parseFloat(otPay).toFixed(2)
    };

    try {
      await axios.post(`http://localhost:8080/hourPayments/create`, hourlyPayData);
      showSuccess('Pago por hora registrado correctamente');
      setRefreshHourlyTable(prev => !prev);
      closeHourlyModal();
    } catch (error) {
      console.error('Error al añadir el pago por hora:', error);
      showError('Error al registrar el pago por hora');
    }
  };

  return (
    <div className="min-h-screen p-4">
      <div className="dark:bg-slate-800 mb-6">
        <div className="flex justify-center">
          <Button
            gradientDuoTone="cyanToBlue"
            onClick={handleOpenHourlyModal}
            className="min-w-[200px]"
          >
            Registrar Pago por Hora
          </Button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <HourlyPayTable refresh={refreshHourlyTable} setRefresh={setRefreshHourlyTable} />
      </div>

      {/* Modal para agregar pago por hora */}
      <Modal show={hourlyModalOpen} size="md" onClose={closeHourlyModal} popup>
        <Modal.Header className="border-b pb-3">
          <h3 className="text-lg font-medium text-gray-900">Registrar Pago por Hora</h3>
        </Modal.Header>
        <Modal.Body className="space-y-4">
          <div>
            <Label htmlFor="position" value="Puesto *" className="mb-1 block" />
            <Select
              id="position"
              options={positions}
              value={selectedPosition}
              onChange={setSelectedPosition}
              placeholder="Seleccione un puesto"
              className="basic-single"
              classNamePrefix="select"
              isSearchable
              noOptionsMessage={() => "No hay puestos disponibles"}
            />
            {errors.position && <p className="text-red-500 text-sm mt-1">{errors.position}</p>}
          </div>

          <div>
            <Label htmlFor="hourlyPay" value="Pago por Hora (S/.) *" className="mb-1 block" />
            <div className="flex items-center gap-2">
              <TextInput
                id="hourlyPay"
                type="text"
                value={hourlyPay}
                onChange={handleHourlyPayChange}
                placeholder="0.0"
                className="flex-1"
              />
              <Button onClick={incrementHourlyPay} size="sm">+10</Button>
            </div>
            {errors.hourlyPay && <p className="text-red-500 text-sm mt-1">{errors.hourlyPay}</p>}
          </div>

          <div>
            <Label htmlFor="otPay" value="Pago por Horas Extra (S/.) *" className="mb-1 block" />
            <div className="flex items-center gap-2">
              <TextInput
                id="otPay"
                type="text"
                value={otPay}
                onChange={handleOTPayChange}
                placeholder="0.0"
                className="flex-1"
              />
              <Button onClick={incrementOTPay} size="sm">+10</Button>
            </div>
            {errors.otPay && <p className="text-red-500 text-sm mt-1">{errors.otPay}</p>}
          </div>
        </Modal.Body>
        <Modal.Footer className="border-t pt-3">
          <div className="flex justify-end space-x-3">
            <Button color="gray" onClick={closeHourlyModal}>Cancelar</Button>
            <Button gradientDuoTone="cyanToBlue" onClick={handleAddHourlyPay}>Guardar</Button>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default PayPerHour;