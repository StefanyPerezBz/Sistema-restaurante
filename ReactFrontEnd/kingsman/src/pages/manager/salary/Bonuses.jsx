

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Modal, Label, TextInput } from "flowbite-react";
import DeductionsTable from './DeductionsTable';
import BonusesTable from './BonusesTable';
import Select from 'react-select';
import Swal from 'sweetalert2';

function Bonuses() {
  const [bonusModalOpen, setBonusModalOpen] = useState(false);
  const [deductionModalOpen, setDeductionModalOpen] = useState(false);
  const [employeeName, setEmployeeName] = useState('');
  const [bonusType, setBonusType] = useState('');
  const [bonusAmount, setBonusAmount] = useState(0);
  const [deductionType, setDeductionType] = useState('');
  const [deductionAmount, setDeductionAmount] = useState(0);
  const [employees, setEmployees] = useState([]);
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [errors, setErrors] = useState({
    employeeName: '',
    bonusType: '',
    bonusAmount: '',
    deductionType: '',
    deductionAmount: ''
  });

  // Bonus types options
  const bonusTypeOptions = [
    { value: 'Bono por puntualidad', label: 'Bono por puntualidad' },
    { value: 'Bono por asistencia perfecta', label: 'Bono por asistencia perfecta' },
    { value: 'Bono por productividad', label: 'Bono por productividad' },
    { value: 'Bono por buen servicio', label: 'Bono por buen servicio' },
    { value: 'Bono por horas extras', label: 'Bono por horas extras' },
    { value: 'Bono por feriados trabajados', label: 'Bono por feriados trabajados' },
    { value: 'Propina compartida', label: 'Propina compartida' },
    { value: 'Bono nocturno', label: 'Bono nocturno' },
    { value: 'Bono por eventos especiales', label: 'Bono por eventos especiales' },
    { value: 'Bono por recomendación de cliente', label: 'Bono por recomendación de cliente' }
  ];

  // Deduction types options
  const deductionTypeOptions = [
    { value: 'Tardanza reiterada', label: 'Tardanza reiterada' },
    { value: 'Falta injustificada', label: 'Falta injustificada' },
    { value: 'Adelanto de sueldo', label: 'Adelanto de sueldo' },
    { value: 'Descuento por pérdida', label: 'Descuento por pérdida' },
    { value: 'Deducción por préstamo', label: 'Deducción por préstamo' },
    { value: 'Descuento por consumo interno', label: 'Descuento por consumo interno' },
    { value: 'Sanción disciplinaria', label: 'Sanción disciplinaria' },
    { value: 'Descuento por caja', label: 'Descuento por caja' }
  ];

  useEffect(() => {
    const currentUser = localStorage.getItem('username'); 
    
    axios.get('http://localhost:8080/employeeIdsAndPositions')
      .then(response => {
        setEmployees(response.data);
        // Filtrar para excluir al usuario actual
        const options = response.data
          .filter(employee => employee[1] !== currentUser)
          .map(employee => ({
            value: employee[1],
            label: employee[1]
          }));
        setEmployeeOptions(options);
      })
      .catch(error => {
        console.error('Error al obtener los detalles del empleado:', error);
        Swal.fire({
          title: 'Error',
          text: 'No se pudieron cargar los datos de los empleados',
          icon: 'error'
        });
      });
  }, []);

  const validateForm = (type) => {
    const newErrors = {
      employeeName: '',
      bonusType: '',
      bonusAmount: '',
      deductionType: '',
      deductionAmount: ''
    };
    let isValid = true;

    if (!employeeName) {
      newErrors.employeeName = 'Debe seleccionar un empleado';
      isValid = false;
    }

    if (type === 'bonus') {
      if (!bonusType) {
        newErrors.bonusType = 'El tipo de bono es requerido';
        isValid = false;
      } else if (/\d/.test(bonusType)) {
        newErrors.bonusType = 'No se permiten números en el tipo de bono';
        isValid = false;
      } else if (bonusType.length > 50) {
        newErrors.bonusType = 'Máximo 50 caracteres';
        isValid = false;
      }

      if (
        !bonusAmount ||
        isNaN(bonusAmount) ||
        parseFloat(bonusAmount) <= 0 ||
        !/^\d+(\.\d)?$/.test(bonusAmount)
      ) {
        newErrors.bonusAmount = 'Ingrese un monto válido mayor a 0 con máximo un decimal';
        isValid = false;
      }
    } else {
      if (!deductionType) {
        newErrors.deductionType = 'El tipo de deducción es requerido';
        isValid = false;
      } else if (/\d/.test(deductionType)) {
        newErrors.deductionType = 'No se permiten números en el tipo de deducción';
        isValid = false;
      } else if (deductionType.length > 50) {
        newErrors.deductionType = 'Máximo 50 caracteres';
        isValid = false;
      }

      if (!deductionAmount) {
        newErrors.deductionAmount = 'El monto es requerido';
        isValid = false;
      } else if (
        isNaN(deductionAmount) ||
        parseFloat(deductionAmount) <= 0 ||
        !/^\d+(\.\d)?$/.test(deductionAmount)
      ) {
        newErrors.deductionAmount = 'Debe ser un número mayor a 0 con máximo un decimal';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleOpenBonusModal = () => {
    setBonusModalOpen(true);
    setErrors({
      employeeName: '',
      bonusType: '',
      bonusAmount: '',
      deductionType: '',
      deductionAmount: ''
    });
  };

  const handleOpenDeductionModal = () => {
    setDeductionModalOpen(true);
    setErrors({
      employeeName: '',
      bonusType: '',
      bonusAmount: '',
      deductionType: '',
      deductionAmount: ''
    });
  };

  const closeBonusModal = () => {
    setBonusModalOpen(false);
    setEmployeeName('');
    setBonusType('');
    setBonusAmount(0);
    setErrors({
      employeeName: '',
      bonusType: '',
      bonusAmount: '',
      deductionType: '',
      deductionAmount: ''
    });
  };

  const closeDeductionModal = () => {
    setDeductionModalOpen(false);
    setEmployeeName('');
    setDeductionType('');
    setDeductionAmount(0);
    setErrors({
      employeeName: '',
      bonusType: '',
      bonusAmount: '',
      deductionType: '',
      deductionAmount: ''
    });
  };

  const handleAddBonus = () => {
    if (!validateForm('bonus')) return;

    const bonusData = {
      empName: employeeName,
      bonusType: bonusType,
      bonus: bonusAmount.toString()
    };

    axios.post('http://localhost:8080/api/bonus', bonusData)
      .then(response => {
        Swal.fire({
          title: 'Éxito',
          text: 'Bono agregado correctamente',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
        fetchBonuses();
        closeBonusModal();
      })
      .catch(error => {
        console.error('Error al agregar bonificación:', error);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo agregar el bono',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      });
  };

  const handleAddDeduction = () => {
    if (!validateForm('deduction')) return;

    const deductionData = {
      empName: employeeName,
      deductionType: deductionType,
      deduction: deductionAmount.toString()
    };

    axios.post('http://localhost:8080/api/deduction', deductionData)
      .then(response => {
        Swal.fire({
          title: 'Éxito',
          text: 'Deducción agregada correctamente',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
        fetchDeductions();
        closeDeductionModal();
      })
      .catch(error => {
        console.error('Error añadiendo deducción:', error);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo agregar la deducción',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      });
  };

  const fetchBonuses = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/bonus');
      return response.data;
    } catch (error) {
      console.error('Error al obtener las bonificaciones:', error);
      Swal.fire({
        title: 'Error',
        text: 'No se pudieron cargar las bonificaciones',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      return [];
    }
  };

  const fetchDeductions = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/deduction');
      return response.data;
    } catch (error) {
      console.error('Error al obtener deducciones:', error);
      Swal.fire({
        title: 'Error',
        text: 'No se pudieron cargar las deducciones',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      return [];
    }
  };

  const handleBonusAmountChange = (e) => {
    const value = e.target.value;
    if (/^\d*\.?\d{0,1}$/.test(value)) { // Permite números con hasta 1 decimal
      setBonusAmount(value);
    }
  };

  const handleDeductionAmountChange = (e) => {
    const value = e.target.value;
    if (/^\d*\.?\d{0,1}$/.test(value)) { // Permite números con hasta 1 decimal
      setDeductionAmount(value);
    }
  };

  const handleBonusTypeSelect = (selectedOption) => {
    setBonusType(selectedOption ? selectedOption.value : '');
  };

  const handleDeductionTypeSelect = (selectedOption) => {
    setDeductionType(selectedOption ? selectedOption.value : '');
  };

  return (
    <div className='h-screen'>
      <div className='h-20'>
        <div className='flex flex-wrap justify-center gap-10 mt-5'>
          <Button gradientDuoTone="cyanToBlue" onClick={handleOpenBonusModal}>Agregar bono</Button>
          <Button gradientDuoTone="cyanToBlue" onClick={handleOpenDeductionModal}>Agregar deducción</Button>
        </div>
      </div>

      <div className='flex flex-row'>
        <div className="flex-1 ml-2 mr-5 mt-8">
          <BonusesTable fetchBonuses={fetchBonuses} />
        </div>
        <div className="flex-1 ml-3 mr-3 mt-1 mb-6">
          <DeductionsTable fetchDeductions={fetchDeductions} />
        </div>
      </div>

      {/* Add Bonus Modal */}
      <Modal show={bonusModalOpen} size="md" onClose={closeBonusModal} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Agregar bono</h3>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="employeeName" value="Nombre del empleado" />
              </div>
              <Select
                id="employeeName"
                options={employeeOptions}
                value={employeeOptions.find(option => option.value === employeeName)}
                onChange={(selectedOption) => setEmployeeName(selectedOption.value)}
                placeholder="Seleccionar empleado"
                className="basic-single"
                classNamePrefix="select"
                isSearchable
                noOptionsMessage={() => "No hay empleados disponibles"}
              />
              {errors.employeeName && <p className="text-red-500 text-sm mt-1">{errors.employeeName}</p>}
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="bonusType" value="Tipo de bono" />
              </div>
              <Select
                id="bonusType"
                options={bonusTypeOptions}
                onChange={handleBonusTypeSelect}
                placeholder="Seleccione un tipo de bono"
                isSearchable
                isClearable
                noOptionsMessage={() => "No hay opciones disponibles"}
                value={bonusTypeOptions.find(option => option.value === bonusType)}
              />
              {errors.bonusType && <p className="text-red-500 text-sm mt-1">{errors.bonusType}</p>}
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="bonusAmount" value="Monto del bono (S/.)" />
              </div>
              <TextInput
                id="bonusAmount"
                type="text"
                value={bonusAmount}
                onChange={handleBonusAmountChange}
                placeholder="Ingresar monto del bono"
                className="w-full border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 dark:bg-gray-700 dark:border-gray-700 dark:focus:border-gray-500 dark:focus:ring-gray-600 dark:text-gray-300 rounded-md"
              />
              {errors.bonusAmount && <p className="text-red-500 text-sm mt-1">{errors.bonusAmount}</p>}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button gradientDuoTone="cyanToBlue" onClick={handleAddBonus}>Agregar bono</Button>
          <Button gradientDuoTone="gray" onClick={closeBonusModal}>Cancelar</Button>
        </Modal.Footer>
      </Modal>

      {/* Add Deduction Modal */}
      <Modal show={deductionModalOpen} size="md" onClose={closeDeductionModal} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Agregar deducción</h3>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="employeeName" value="Nombre del empleado" />
              </div>
              <Select
                id="employeeName"
                options={employeeOptions}
                value={employeeOptions.find(option => option.value === employeeName)}
                onChange={(selectedOption) => setEmployeeName(selectedOption.value)}
                placeholder="Seleccionar empleado"
                className="basic-single"
                classNamePrefix="select"
                isSearchable
                noOptionsMessage={() => "No hay empleados disponibles"}
              />
              {errors.employeeName && <p className="text-red-500 text-sm mt-1">{errors.employeeName}</p>}
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="deductionType" value="Tipo de deducción" />
              </div>
              <Select
                id="deductionType"
                options={deductionTypeOptions}
                onChange={handleDeductionTypeSelect}
                placeholder="Seleccione un tipo de deducción"
                isSearchable
                isClearable
                noOptionsMessage={() => "No hay opciones disponibles"}
                value={deductionTypeOptions.find(option => option.value === deductionType)}
              />
              {errors.deductionType && <p className="text-red-500 text-sm mt-1">{errors.deductionType}</p>}
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="deductionAmount" value="Monto de deducción (S/.)" />
              </div>
              <TextInput
                id="deductionAmount"
                type="text"
                value={deductionAmount}
                onChange={handleDeductionAmountChange}
                placeholder="Ingrese el monto de la deducción"
                className="w-full border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 dark:bg-gray-700 dark:border-gray-700 dark:focus:border-gray-500 dark:focus:ring-gray-600 dark:text-gray-300 rounded-md"
              />
              {errors.deductionAmount && <p className="text-red-500 text-sm mt-1">{errors.deductionAmount}</p>}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button gradientDuoTone="cyanToBlue" onClick={handleAddDeduction}>Agregar deducción</Button>
          <Button gradientDuoTone="gray" onClick={closeDeductionModal}>Cancelar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Bonuses;