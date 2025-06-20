import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Modal, Button, TextInput } from 'flowbite-react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

function HourlyPayTable({ refresh, setRefresh }) {
  const [hourPayments, setHourPayments] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteHourPaymentId, setDeleteHourPaymentId] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editHourPaymentData, setEditHourPaymentData] = useState({
    id: null,
    position: '',
    payPerHour: 0,
    payPerOverTimeHour: 0
  });

  useEffect(() => {
    fetchHourPayments();
  }, [refresh]); // Refresh effect triggered by changes in 'refresh'

  const fetchHourPayments = async () => {
    try {
      const response = await axios.get('http://localhost:8080/hourPayments');
      // setHourPayments(response.data);
      if (Array.isArray(response.data)) {
        setHourPayments(response.data);
      } else {
        console.error("La respuesta no es un arreglo:", response.data);
        setHourPayments([]);
      }

    } catch (error) {
      console.error('Error al obtener los pagos de horas:', error);
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
      console.log('Pago por hora eliminado exitosamente');
    } catch (error) {
      console.error('Error al eliminar el pago por hora:', error);
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
    setEditModalOpen(true);
  };

  const confirmEditHourPayment = async () => {
    try {
      await axios.put(`http://localhost:8080/hourPayments/${editHourPaymentData.id}`, editHourPaymentData);
      setRefresh(prev => !prev); // Toggle refresh state to trigger fetch
      console.log('Pago por hora actualizado exitosamente');
    } catch (error) {
      console.error('Error al actualizar el pago por hora:', error);
    } finally {
      setEditModalOpen(false);
      setEditHourPaymentData({
        id: null,
        position: '',
        payPerHour: 0,
        payPerOverTimeHour: 0
      });
    }
  };

  return (
    <div className='w-full'>
      <h2 className="text-xl font-bold mb-4 ">Pagos por Hora</h2>
      <Table hoverable className='drop-shadow-lg'>
        <Table.Head>
          <Table.HeadCell>Rol</Table.HeadCell>
          <Table.HeadCell>Pago por Hora (S/)</Table.HeadCell>
          <Table.HeadCell>Pago por Hora Extra (S/)</Table.HeadCell>
          <Table.HeadCell>Acción</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {hourPayments.map((hourPayment, index) => (
            <Table.Row key={index} className="bg-white dark:border-gray-700 dark:bg-gray-800">
              <Table.Cell>{hourPayment.position}</Table.Cell>
              <Table.Cell>{hourPayment.payPerHour}</Table.Cell>
              <Table.Cell>{hourPayment.payPerOverTimeHour}</Table.Cell>
              <Table.Cell className="flex">
                <FaEdit
                  className="text-blue-500 mr-2 hover:text-blue-700 cursor-pointer text-lg"
                  onClick={() => handleEditHourPayment(hourPayment)}
                />
                <FaTrash
                  className="text-red-500 hover:text-red-700 cursor-pointer text-lg"
                  onClick={() => handleDeleteHourPayment(hourPayment.id)}
                />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      {/* Delete Confirmation Modal */}
      <Modal show={deleteModalOpen} size="md" onClose={closeDeleteModal} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              ¿Está seguro de que desea eliminar este pago por hora?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={confirmDeleteHourPayment}>
                {"Si, estoy seguro"}
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
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Editar pago por hora</h3>
            <div>
              <div className="mb-2 block">
                <TextInput
                  id="editPosition"
                  type="text"
                  value={editHourPaymentData.position}
                  onChange={(e) => setEditHourPaymentData({ ...editHourPaymentData, position: e.target.value })}
                  placeholder="Rol"
                  className="w-full border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 dark:bg-gray-700 dark:border-gray-700 dark:focus:border-gray-500 dark:focus:ring-gray-600 dark:text-gray-300 rounded-md"
                />
              </div>
              <div className="mb-2 block">
                <TextInput
                  id="editPayPerHour"
                  type="number"
                  value={editHourPaymentData.payPerHour}
                  onChange={(e) => setEditHourPaymentData({ ...editHourPaymentData, payPerHour: e.target.value })}
                  placeholder="Pago por hora (S/.)"
                  className="w-full border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 dark:bg-gray-700 dark:border-gray-700 dark:focus:border-gray-500 dark:focus:ring-gray-600 dark:text-gray-300 rounded-md"
                />
              </div>
              <div className="mb-2 block">
                <TextInput
                  id="editPayPerOverTimeHour"
                  type="number"
                  value={editHourPaymentData.payPerOverTimeHour}
                  onChange={(e) => setEditHourPaymentData({ ...editHourPaymentData, payPerOverTimeHour: e.target.value })}
                  placeholder="Pago por hora extra (S/.)"
                  className="w-full border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 dark:bg-gray-700 dark:border-gray-700 dark:focus:border-gray-500 dark:focus:ring-gray-600 dark:text-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button gradientDuoTone="cyanToBlue" onClick={confirmEditHourPayment}>Actualizar pago por hora</Button>
          <Button gradientDuoTone="gray" onClick={() => setEditModalOpen(false)}>Cancelar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default HourlyPayTable;
