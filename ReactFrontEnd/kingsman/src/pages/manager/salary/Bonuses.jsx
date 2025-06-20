import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Modal, Label, TextInput } from "flowbite-react";
import DeductionsTable from './DeductionsTable';
import BonusesTable from './BonusesTable';
 

function Bonuses() {
  const [bonusModalOpen, setBonusModalOpen] = useState(false);
  const [deductionModalOpen, setDeductionModalOpen] = useState(false);
  const [employeeName, setEmployeeName] = useState('');
  const [bonusType, setBonusType] = useState('');
  const [bonusAmount, setBonusAmount] = useState(0);
  const [deductionType, setDeductionType] = useState('');
  const [deductionAmount, setDeductionAmount] = useState(0);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/employeeIdsAndPositions')
      .then(response => {
        setEmployees(response.data);
      })
      .catch(error => {
        console.error('Error al obtener los detalles del empleado:', error);
      });
  }, []);

  const handleOpenBonusModal = () => {
    setBonusModalOpen(true);
  };

  const handleOpenDeductionModal = () => {
    setDeductionModalOpen(true);
  };

  const closeBonusModal = () => {
    setBonusModalOpen(false);
    setEmployeeName('');
    setBonusType('');
    setBonusAmount(0);
  };

  const closeDeductionModal = () => {
    setDeductionModalOpen(false);
    setEmployeeName('');
    setDeductionType('');
    setDeductionAmount(0);
  };

  const handleAddBonus = () => {
    const bonusData = {
      empName: employeeName,
      bonusType: bonusType,
      bonus: bonusAmount.toString()
    };

    axios.post('http://localhost:8080/api/bonus', bonusData)
      .then(response => {
        console.log('Bonus added successfully:', response.data);
        fetchBonuses(); // Refresh bonuses table
        closeBonusModal();
      })
      .catch(error => {
        console.error('Error al agregar bonificación:', error);
      });
  };

  const handleAddDeduction = () => {
    const deductionData = {
      empName: employeeName,
      deductionType: deductionType,
      deduction: deductionAmount.toString()
    };

    axios.post('http://localhost:8080/api/deduction', deductionData)
      .then(response => {
        console.log('Deducción agregada exitosamente:', response.data);
        fetchDeductions(); // Refresh deductions table
        closeDeductionModal();
      })
      .catch(error => {
        console.error('Error añadiendo deducción:', error);
      });
  };

  const fetchBonuses = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/bonus');
      return response.data;
    } catch (error) {
      console.error('Error al obtener las bonificaciones:', error);
      return [];
    }
  };

  const fetchDeductions = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/deduction');
      return response.data;
    } catch (error) {
      console.error('Error al obtener deducciones:', error);
      return [];
    }
  };

  return (
    <div className='bg-gray-200 h-screen'>
      <div className='h-20 border bg-slate-800'>
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
                <Label htmlFor="employeeName" value="Employee Name" />
              </div>
              <select
                id="employeeName"
                value={employeeName}
                onChange={(event) => setEmployeeName(event.target.value)}
                className="w-full border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 dark:bg-gray-700 dark:border-gray-700 dark:focus:border-gray-500 dark:focus:ring-gray-600 dark:text-gray-300 rounded-md"
              >
                <option value="">Seleccionar empleado</option>
                {employees.map(employee => (
                  <option key={employee[0]} value={employee[1]}>{employee[1]}</option>
                ))}
              </select>
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="bonusType" value="Bonus Type" />
              </div>
              <TextInput
                id="bonusType"
                type="text"
                value={bonusType}
                onChange={(event) => setBonusType(event.target.value)}
                placeholder="Enter Bonus Type"
                className="w-full border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 dark:bg-gray-700 dark:border-gray-700 dark:focus:border-gray-500 dark:focus:ring-gray-600 dark:text-gray-300 rounded-md"
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="bonusAmount" value="Bonus Amount (S/.)" />
              </div>
              <TextInput
                id="bonusAmount"
                type="number"
                value={bonusAmount}
                onChange={(event) => setBonusAmount(event.target.value)}
                placeholder="Enter Bonus Amount"
                className="w-full border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 dark:bg-gray-700 dark:border-gray-700 dark:focus:border-gray-500 dark:focus:ring-gray-600 dark:text-gray-300 rounded-md"
              />
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
                <Label htmlFor="employeeName" value="Employee Name" />
              </div>
              <select
                id="employeeName"
                value={employeeName}
                onChange={(event) => setEmployeeName(event.target.value)}
                className="w-full border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 dark:bg-gray-700 dark:border-gray-700 dark:focus:border-gray-500 dark:focus:ring-gray-600 dark:text-gray-300 rounded-md"
              >
                <option value="">Seleccionar empleado</option>
                {employees.map(employee => (
                  <option key={employee[0]} value={employee[1]}>{employee[1]}</option>
                ))}
              </select>
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="deductionType" value="Deduction Type" />
              </div>
              <TextInput
                id="deductionType"
                type="text"
                value={deductionType}
                onChange={(event) => setDeductionType(event.target.value)}
                placeholder="Ingrese el tipo de deducción"
                className="w-full border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 dark:bg-gray-700 dark:border-gray-700 dark:focus:border-gray-500 dark:focus:ring-gray-600 dark:text-gray-300 rounded-md"
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="deductionAmount" value="Deduction Amount (Rs.)" />
              </div>
              <TextInput
                id="deductionAmount"
                type="number"
                value={deductionAmount}
                onChange={(event) => setDeductionAmount(event.target.value)}
                placeholder="Ingrese el monto de la deducción"
                className="w-full border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 dark:bg-gray-700 dark:border-gray-700 dark:focus:border-gray-500 dark:focus:ring-gray-600 dark:text-gray-300 rounded-md"
              />
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
