

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import { Modal, Button, TextInput } from 'flowbite-react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import Swal from 'sweetalert2';

function HourlyPayTable({ refresh, setRefresh }) {
  const [hourPayments, setHourPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteHourPaymentId, setDeleteHourPaymentId] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editHourPaymentData, setEditHourPaymentData] = useState({
    id: null,
    position: '',
    payPerHour: 0,
    payPerOverTimeHour: 0
  });
  const [editErrors, setEditErrors] = useState({
    payPerHour: '',
    payPerOverTimeHour: ''
  });

  useEffect(() => {
    fetchHourPayments();
  }, [refresh]);

  const fetchHourPayments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8080/hourPayments`);
      if (Array.isArray(response.data)) {
        setHourPayments(response.data);
      } else {
        console.error("La respuesta no es un arreglo:", response.data);
        setHourPayments([]);
        Swal.fire({
          title: 'Error',
          text: 'Los datos recibidos no tienen el formato esperado',
          icon: 'error'
        });
      }
    } catch (error) {
      console.error('Error al obtener los pagos de horas:', error);
      Swal.fire({
        title: 'Error',
        text: 'No se pudieron cargar los pagos por hora',
        icon: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteHourPayment = (id) => {
    setDeleteHourPaymentId(id);
    setDeleteModalOpen(true);
  };

  const confirmDeleteHourPayment = async () => {
    try {
      await axios.delete(`http://localhost:8080/hourPayments/${deleteHourPaymentId}`);
      setHourPayments(hourPayments.filter(hourPayment => hourPayment.id !== deleteHourPaymentId));
      Swal.fire({
        title: 'Éxito',
        text: 'Pago por hora eliminado correctamente',
        icon: 'success'
      });
    } catch (error) {
      console.error('Error al eliminar el pago por hora:', error);
      Swal.fire({
        title: 'Error',
        text: 'No se pudo eliminar el pago por hora',
        icon: 'error'
      });
    } finally {
      setDeleteModalOpen(false);
    }
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setDeleteHourPaymentId(null);
  };

  const handleEditHourPayment = (hourPayment) => {
    setEditHourPaymentData({
      id: hourPayment.id,
      position: hourPayment.position,
      payPerHour: hourPayment.payPerHour,
      payPerOverTimeHour: hourPayment.payPerOverTimeHour
    });
    setEditErrors({
      payPerHour: '',
      payPerOverTimeHour: ''
    });
    setEditModalOpen(true);
  };

  const validateEditForm = () => {
    const decimalOrIntegerPattern = /^\d+(\.\d)?$/;

    const newErrors = {
      payPerHour:
        !editHourPaymentData.payPerHour ||
          !decimalOrIntegerPattern.test(editHourPaymentData.payPerHour) ||
          parseFloat(editHourPaymentData.payPerHour) < 1
          ? 'Debe ingresar un monto válido (mínimo 1, con máximo un decimal)'
          : '',

      payPerOverTimeHour:
        !editHourPaymentData.payPerOverTimeHour ||
          !decimalOrIntegerPattern.test(editHourPaymentData.payPerOverTimeHour) ||
          parseFloat(editHourPaymentData.payPerOverTimeHour) < 1
          ? 'Debe ingresar un monto válido (mínimo 1, con máximo un decimal)'
          : ''
    };

    setEditErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };


  const handleEditPayPerHourChange = (e) => {
    const value = e.target.value;
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      setEditHourPaymentData({ ...editHourPaymentData, payPerHour: value });
      setEditErrors({ ...editErrors, payPerHour: '' });
    }
  };

  const handleEditPayPerOverTimeHourChange = (e) => {
    const value = e.target.value;
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      setEditHourPaymentData({ ...editHourPaymentData, payPerOverTimeHour: value });
      setEditErrors({ ...editErrors, payPerOverTimeHour: '' });
    }
  };

  const incrementEditPayPerHour = () => {
    const newValue = parseFloat(editHourPaymentData.payPerHour || 0) + 10;
    setEditHourPaymentData({ ...editHourPaymentData, payPerHour: newValue.toString() });
    setEditErrors({ ...editErrors, payPerHour: '' });
  };

  const incrementEditPayPerOverTimeHour = () => {
    const newValue = parseFloat(editHourPaymentData.payPerOverTimeHour || 0) + 10;
    setEditHourPaymentData({ ...editHourPaymentData, payPerOverTimeHour: newValue.toString() });
    setEditErrors({ ...editErrors, payPerOverTimeHour: '' });
  };

  const confirmEditHourPayment = async () => {
    if (!validateEditForm()) return;

    try {
      await axios.put(`http://localhost:8080/hourPayments/${editHourPaymentData.id}`, {
        position: editHourPaymentData.position,
        payPerHour: parseFloat(editHourPaymentData.payPerHour).toFixed(2),
        payPerOverTimeHour: parseFloat(editHourPaymentData.payPerOverTimeHour).toFixed(2)
      });
      setRefresh(prev => !prev);
      Swal.fire({
        title: 'Éxito',
        text: 'Pago por hora actualizado correctamente',
        icon: 'success'
      });
    } catch (error) {
      console.error('Error al actualizar el pago por hora:', error);
      Swal.fire({
        title: 'Error',
        text: 'No se pudo actualizar el pago por hora',
        icon: 'error'
      });
    } finally {
      setEditModalOpen(false);
    }
  };

  // Diccionario de traducción de roles
  const roleTranslations = {
    'cashier': 'Cajero',
    'waiter': 'Mesero',
    'chef': 'Chef'
  };

  // Función para traducir roles
  const translateRole = (role) => roleTranslations[role] || role;

  const columns = [
    {
      name: 'Rol',
      selector: row => translateRole(row.position),
      sortable: true,
      wrap: true,
      minWidth: '150px'
    },
    {
      name: 'Pago por Hora (S/)',
      selector: row => parseFloat(row.payPerHour).toFixed(2),
      sortable: true,
      right: true,
      minWidth: '150px'
    },
    {
      name: 'Pago por Hora Extra (S/)',
      selector: row => parseFloat(row.payPerOverTimeHour).toFixed(2),
      sortable: true,
      right: true,
      minWidth: '180px'
    },
    {
      name: 'Acciones',
      cell: row => (
        <div className="flex space-x-3">
          <button
            onClick={() => handleEditHourPayment(row)}
            className="text-blue-500 hover:text-blue-700 transition-colors"
            title="Editar"
          >
            <FaEdit size={18} />
          </button>
          <button
            onClick={() => handleDeleteHourPayment(row.id)}
            className="text-red-500 hover:text-red-700 transition-colors"
            title="Eliminar"
          >
            <FaTrash size={18} />
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: '100px'
    }
  ];

  const customStyles = {
    headCells: {
      style: {
        backgroundColor: '#f8fafc',
        fontWeight: 'bold',
        fontSize: '14px',
      },
    },
    cells: {
      style: {
        paddingTop: '0.75rem',
        paddingBottom: '0.75rem',
      },
    },
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Pagos por Hora</h2>

      <DataTable
        columns={columns}
        data={hourPayments}
        progressPending={loading}
        customStyles={customStyles}
        pagination
        paginationPerPage={10}
        paginationRowsPerPageOptions={[5, 10, 15, 20]}
        highlightOnHover
        responsive
        noDataComponent={
          <div className="py-8 text-center text-gray-500">
            {loading ? 'Cargando datos...' : 'No hay pagos por hora registrados'}
          </div>
        }
      />

      {/* Delete Confirmation Modal */}
      <Modal show={deleteModalOpen} size="md" onClose={closeDeleteModal} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400" />
            <h3 className="mb-5 text-lg font-normal text-gray-500">
              ¿Está seguro de que desea eliminar este pago por hora?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={confirmDeleteHourPayment}>
                {"Sí, estoy seguro"}
              </Button>
              <Button color="gray" onClick={closeDeleteModal}>
                No, cancelar
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* Edit Hourly Payment Modal */}
      <Modal show={editModalOpen} size="md" onClose={() => setEditModalOpen(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-4">
            <h3 className="text-xl font-medium text-gray-900">Editar pago por hora</h3>
            <div>
              <div className="mb-2 block">
                <label htmlFor="editPosition" className="text-sm font-medium text-gray-700">Rol</label>
                <TextInput
                  id="editPosition"
                  type="text"
                  value={translateRole(editHourPaymentData.position)}
                  readOnly
                  className="mt-1 bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div className="mb-2 block">
                <label htmlFor="editPayPerHour" className="text-sm font-medium text-gray-700">Pago por hora (S/.) *</label>
                <div className="flex items-center gap-2">
                  <TextInput
                    id="editPayPerHour"
                    type="text"
                    value={editHourPaymentData.payPerHour}
                    onChange={handleEditPayPerHourChange}
                    placeholder="0.00"
                    className="flex-1"
                  />
                  <Button onClick={incrementEditPayPerHour} size="sm">+10</Button>
                </div>
                {editErrors.payPerHour && <p className="text-red-500 text-sm mt-1">{editErrors.payPerHour}</p>}
              </div>
              <div className="mb-2 block">
                <label htmlFor="editPayPerOverTimeHour" className="text-sm font-medium text-gray-700">Pago por hora extra (S/.) *</label>
                <div className="flex items-center gap-2">
                  <TextInput
                    id="editPayPerOverTimeHour"
                    type="text"
                    value={editHourPaymentData.payPerOverTimeHour}
                    onChange={handleEditPayPerOverTimeHourChange}
                    placeholder="0.00"
                    className="flex-1"
                  />
                  <Button onClick={incrementEditPayPerOverTimeHour} size="sm">+10</Button>
                </div>
                {editErrors.payPerOverTimeHour && <p className="text-red-500 text-sm mt-1">{editErrors.payPerOverTimeHour}</p>}
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button gradientDuoTone="cyanToBlue" onClick={confirmEditHourPayment}>
            Actualizar pago
          </Button>
          <Button color="gray" onClick={() => setEditModalOpen(false)}>
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default HourlyPayTable;