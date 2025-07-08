

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Modal, TextInput, Label } from 'flowbite-react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import DataTable from 'react-data-table-component';
import Swal from 'sweetalert2';
import Select from 'react-select';

function BonusesTable({ fetchBonuses }) {
  const [bonuses, setBonuses] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteBonusId, setDeleteBonusId] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editBonusData, setEditBonusData] = useState({
    id: null,
    empName: '',
    bonusType: '',
    bonus: ''
  });
  const [validationErrors, setValidationErrors] = useState({
    bonusType: '',
    bonusAmount: ''
  });
  const [pending, setPending] = useState(true);

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

  useEffect(() => {
    fetchBonuses().then(data => {
      setBonuses(data);
      setPending(false);
    }).catch(error => {
      console.error('Error fetching bonuses:', error);
      setPending(false);
      Swal.fire({
        title: 'Error',
        text: 'No se pudieron cargar las bonificaciones',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    });
  }, [fetchBonuses]);

  const handleDeleteBonus = (id) => {
    setDeleteBonusId(id);
    setDeleteModalOpen(true);
  };

  const confirmDeleteBonus = async () => {
    try {
      await axios.delete(`localhost:8080/api/bonus/${deleteBonusId}`);
      setBonuses(bonuses.filter(bonus => bonus.id !== deleteBonusId));
      Swal.fire({
        title: 'Éxito',
        text: 'Bonificación eliminada correctamente',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });
    } catch (error) {
      console.error('Error deleting bonus:', error);
      Swal.fire({
        title: 'Error',
        text: 'No se pudo eliminar la bonificación',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    } finally {
      setDeleteModalOpen(false);
    }
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setDeleteBonusId(null);
  };

  const handleEditBonus = (bonus) => {
    setEditBonusData({
      id: bonus.id,
      empName: bonus.empName,
      bonusType: bonus.bonusType,
      bonus: bonus.bonus
    });
    setValidationErrors({
      bonusType: '',
      bonusAmount: ''
    });
    setEditModalOpen(true);
  };

  const validateBonusFields = () => {
    const newErrors = {};
    let isValid = true;

    if (!editBonusData.bonusType) {
      newErrors.bonusType = 'El tipo de bono es requerido';
      isValid = false;
    } else if (/\d/.test(editBonusData.bonusType)) {
      newErrors.bonusType = 'No se permiten números en el tipo de bono';
      isValid = false;
    } else if (editBonusData.bonusType.length > 50) {
      newErrors.bonusType = 'Máximo 50 caracteres';
      isValid = false;
    }

    if (
      !editBonusData.bonus ||
      isNaN(editBonusData.bonus) ||
      parseFloat(editBonusData.bonus) <= 0 ||
      !/^\d+(\.\d{0,1})?$/.test(editBonusData.bonus)
    ) {
      newErrors.bonusAmount = 'Ingrese un monto válido mayor a 0 con máximo un decimal';
      isValid = false;
    }

    setValidationErrors(newErrors);
    return isValid;
  };

  const confirmEditBonus = async () => {
    if (!validateBonusFields()) {
      return;
    }

    try {
      await axios.put(`localhost:8080/api/bonus/${editBonusData.id}`, {
        empName: editBonusData.empName,
        bonusType: editBonusData.bonusType,
        bonus: editBonusData.bonus
      });
      
      const updatedBonuses = await fetchBonuses();
      setBonuses(updatedBonuses);
      setEditModalOpen(false);
      
      Swal.fire({
        title: 'Éxito',
        text: 'Bonificación actualizada correctamente',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });
    } catch (error) {
      console.error('Error al actualizar el bono:', error);
      Swal.fire({
        title: 'Error',
        text: 'No se pudo actualizar la bonificación',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    }
  };

  const handleBonusTypeSelect = (selectedOption) => {
    setEditBonusData({
      ...editBonusData,
      bonusType: selectedOption ? selectedOption.value : ''
    });
    setValidationErrors({
      ...validationErrors,
      bonusType: ''
    });
  };

  const handleBonusAmountChange = (e) => {
    const value = e.target.value;
    if (/^\d*\.?\d{0,1}$/.test(value)) {
      setEditBonusData({
        ...editBonusData,
        bonus: value
      });
      setValidationErrors({
        ...validationErrors,
        bonusAmount: ''
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
      name: 'Tipo de Bonificación',
      selector: row => row.bonusType,
      sortable: true,
      wrap: true
    },
    {
      name: 'Bonificación (S/)',
      selector: row => row.bonus,
      sortable: true,
      right: true,
      wrap: true,
      cell: row => `S/ ${parseFloat(row.bonus).toFixed(2)}`
    },
    {
      name: 'Acción',
      cell: (row) => (
        <div className="flex">
          <FaEdit
            className="text-blue-500 mr-2 hover:text-blue-700 cursor-pointer text-lg"
            onClick={() => handleEditBonus(row)}
          />
          <FaTrash
            className="text-red-500 hover:text-red-700 cursor-pointer text-lg"
            onClick={() => handleDeleteBonus(row.id)}
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
      <h2 className="text-xl font-bold mb-4 text-black dark:text-white">Bonificaciones</h2>
      <div className="overflow-x-auto">
        <DataTable
          columns={columns}
          data={bonuses}
          customStyles={customStyles}
          progressPending={pending}
          responsive
          pagination
          highlightOnHover
          noDataComponent="No hay bonificaciones registradas"
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
              ¿Estás seguro de que quieres eliminar este bono?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={confirmDeleteBonus}>
                {"Sí, estoy seguro."}
              </Button>
              <Button color="gray" onClick={closeDeleteModal}>
                No, cancelar
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* Edit Bonus Modal */}
      <Modal show={editModalOpen} size="md" onClose={() => setEditModalOpen(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Editar bonificación</h3>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="editEmpName" value="Nombre del empleado" />
                <TextInput
                  id="editEmpName"
                  type="text"
                  value={editBonusData.empName}
                  disabled
                  className="w-full bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div className="mb-2 block">
                <Label htmlFor="editBonusType" value="Tipo de bonificación" />
                <Select
                  id="editBonusType"
                  options={bonusTypeOptions}
                  onChange={handleBonusTypeSelect}
                  placeholder="Seleccione un tipo de bono"
                  isSearchable
                  isClearable
                  noOptionsMessage={() => "No hay opciones disponibles"}
                  value={bonusTypeOptions.find(option => option.value === editBonusData.bonusType)}
                  className="basic-single"
                  classNamePrefix="select"
                />
                {validationErrors.bonusType && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.bonusType}</p>
                )}
              </div>
              <div className="mb-2 block">
                <Label htmlFor="editBonusAmount" value="Monto (S/.)" />
                <TextInput
                  id="editBonusAmount"
                  type="text"
                  value={editBonusData.bonus}
                  onChange={handleBonusAmountChange}
                  placeholder="Ingrese el monto"
                  className="w-full"
                />
                {validationErrors.bonusAmount && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.bonusAmount}</p>
                )}
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button gradientDuoTone="cyanToBlue" onClick={confirmEditBonus}>Actualizar bonificación</Button>
          <Button gradientDuoTone="gray" onClick={() => setEditModalOpen(false)}>Cancelar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default BonusesTable;