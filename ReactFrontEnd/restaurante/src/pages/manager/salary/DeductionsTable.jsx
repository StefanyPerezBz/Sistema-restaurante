

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Modal, TextInput, Label } from 'flowbite-react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import DataTable from 'react-data-table-component';
import Swal from 'sweetalert2';
import Select from 'react-select';

function DeductionsTable({ fetchDeductions }) {
  const [deductions, setDeductions] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteDeductionId, setDeleteDeductionId] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editDeductionData, setEditDeductionData] = useState({
    id: null,
    empName: '',
    deductionType: '',
    deduction: ''
  });
  const [validationErrors, setValidationErrors] = useState({
    deductionType: '',
    deductionAmount: ''
  });
  const [pending, setPending] = useState(true);

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
    fetchDeductions().then(data => {
      setDeductions(data);
      setPending(false);
    }).catch(error => {
      console.error('Error fetching deductions:', error);
      setPending(false);
      Swal.fire({
        title: 'Error',
        text: 'No se pudieron cargar las deducciones',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    });
  }, [fetchDeductions]);

  const handleDeleteDeduction = (id) => {
    setDeleteDeductionId(id);
    setDeleteModalOpen(true);
  };

  const confirmDeleteDeduction = async () => {
    try {
      await axios.delete(`${import.meta.env.REACT_APP_API_URL}/api/deduction/${deleteDeductionId}`);
      setDeductions(deductions.filter(deduction => deduction.id !== deleteDeductionId));
      Swal.fire({
        title: 'Éxito',
        text: 'Deducción eliminada correctamente',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });
    } catch (error) {
      console.error('Error deleting deduction:', error);
      Swal.fire({
        title: 'Error',
        text: 'No se pudo eliminar la deducción',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    } finally {
      setDeleteModalOpen(false);
    }
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setDeleteDeductionId(null);
  };

  const handleEditDeduction = (deduction) => {
    setEditDeductionData({
      id: deduction.id,
      empName: deduction.empName,
      deductionType: deduction.deductionType,
      deduction: deduction.deduction
    });
    setValidationErrors({
      deductionType: '',
      deductionAmount: ''
    });
    setEditModalOpen(true);
  };

  const validateDeductionFields = () => {
    const newErrors = {};
    let isValid = true;

    if (!editDeductionData.deductionType) {
      newErrors.deductionType = 'El tipo de deducción es requerido';
      isValid = false;
    } else if (/\d/.test(editDeductionData.deductionType)) {
      newErrors.deductionType = 'No se permiten números en el tipo de deducción';
      isValid = false;
    } else if (editDeductionData.deductionType.length > 50) {
      newErrors.deductionType = 'Máximo 50 caracteres';
      isValid = false;
    }

    if (
      !editDeductionData.deduction ||
      isNaN(editDeductionData.deduction) ||
      parseFloat(editDeductionData.deduction) <= 0 ||
      !/^\d+(\.\d{0,1})?$/.test(editDeductionData.deduction)
    ) {
      newErrors.deductionAmount = 'Ingrese un monto válido mayor a 0 con máximo un decimal';
      isValid = false;
    }

    setValidationErrors(newErrors);
    return isValid;
  };

  const confirmEditDeduction = async () => {
    if (!validateDeductionFields()) {
      return;
    }

    try {
      await axios.put(`${import.meta.env.REACT_APP_API_URL}/api/deduction/${editDeductionData.id}`, {
        empName: editDeductionData.empName,
        deductionType: editDeductionData.deductionType,
        deduction: editDeductionData.deduction
      });
      
      const updatedDeductions = await fetchDeductions();
      setDeductions(updatedDeductions);
      setEditModalOpen(false);
      
      Swal.fire({
        title: 'Éxito',
        text: 'Deducción actualizada correctamente',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });
    } catch (error) {
      console.error('Error al actualizar la deducción:', error);
      Swal.fire({
        title: 'Error',
        text: 'No se pudo actualizar la deducción',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    }
  };

  const handleDeductionTypeSelect = (selectedOption) => {
    setEditDeductionData({
      ...editDeductionData,
      deductionType: selectedOption ? selectedOption.value : ''
    });
    setValidationErrors({
      ...validationErrors,
      deductionType: ''
    });
  };

  const handleDeductionAmountChange = (e) => {
    const value = e.target.value;
    if (/^\d*\.?\d{0,1}$/.test(value)) {
      setEditDeductionData({
        ...editDeductionData,
        deduction: value
      });
      setValidationErrors({
        ...validationErrors,
        deductionAmount: ''
      });
    }
  };

  const columns = [
    {
      name: 'Nombre del Empleado',
      selector: row => row.empName,
      sortable: true,
      wrap: true
    },
    {
      name: 'Tipo de Deducción',
      selector: row => row.deductionType,
      sortable: true,
      wrap: true
    },
    {
      name: 'Deducción (S/)',
      selector: row => row.deduction,
      sortable: true,
      right: true,
      wrap: true,
      cell: row => `S/ ${parseFloat(row.deduction).toFixed(2)}`
    },
    {
      name: 'Acción',
      cell: (row) => (
        <div className="flex">
          <FaEdit
            className="text-blue-500 mr-2 hover:text-blue-700 cursor-pointer text-lg"
            onClick={() => handleEditDeduction(row)}
          />
          <FaTrash
            className="text-red-500 hover:text-red-700 cursor-pointer text-lg"
            onClick={() => handleDeleteDeduction(row.id)}
          />
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: '100px'
    }
  ];

  const customStyles = {
    rows: {
      style: {
        minHeight: '72px',
      }
    },
    headCells: {
      style: {
        paddingLeft: '8px',
        paddingRight: '8px',
        fontWeight: 'bold',
        backgroundColor: '#f9fafb',
      },
    },
    cells: {
      style: {
        paddingLeft: '8px',
        paddingRight: '8px',
      },
    },
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
      <h2 className="text-xl font-bold mb-4 text-black dark:text-white">Deducciones</h2>
      <div className="overflow-x-auto">
        <DataTable
          columns={columns}
          data={deductions}
          customStyles={customStyles}
          progressPending={pending}
          responsive
          pagination
          highlightOnHover
          noDataComponent="No hay deducciones registradas"
          fixedHeader
          fixedHeaderScrollHeight="400px"
        />
      </div>

      {/* Delete Confirmation Modal */}
      <Modal show={deleteModalOpen} size="md" onClose={closeDeleteModal} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              ¿Estás seguro de que quieres eliminar esta deducción?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={confirmDeleteDeduction}>
                {"Sí, estoy seguro."}
              </Button>
              <Button color="gray" onClick={closeDeleteModal}>
                No, cancelar
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* Edit Deduction Modal */}
      <Modal show={editModalOpen} size="md" onClose={() => setEditModalOpen(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Editar deducción</h3>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="editEmpName" value="Nombre del empleado" />
                <TextInput
                  id="editEmpName"
                  type="text"
                  value={editDeductionData.empName}
                  disabled
                  className="w-full bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div className="mb-2 block">
                <Label htmlFor="editDeductionType" value="Tipo de deducción" />
                <Select
                  id="editDeductionType"
                  options={deductionTypeOptions}
                  onChange={handleDeductionTypeSelect}
                  placeholder="Seleccione un tipo de deducción"
                  isSearchable
                  isClearable
                  noOptionsMessage={() => "No hay opciones disponibles"}
                  value={deductionTypeOptions.find(option => option.value === editDeductionData.deductionType)}
                  className="basic-single"
                  classNamePrefix="select"
                />
                {validationErrors.deductionType && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.deductionType}</p>
                )}
              </div>
              <div className="mb-2 block">
                <Label htmlFor="editDeductionAmount" value="Monto (S/.)" />
                <TextInput
                  id="editDeductionAmount"
                  type="text"
                  value={editDeductionData.deduction}
                  onChange={handleDeductionAmountChange}
                  placeholder="Ingrese el monto"
                  className="w-full"
                />
                {validationErrors.deductionAmount && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.deductionAmount}</p>
                )}
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button gradientDuoTone="cyanToBlue" onClick={confirmEditDeduction}>Actualizar deducción</Button>
          <Button gradientDuoTone="gray" onClick={() => setEditModalOpen(false)}>Cancelar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default DeductionsTable;