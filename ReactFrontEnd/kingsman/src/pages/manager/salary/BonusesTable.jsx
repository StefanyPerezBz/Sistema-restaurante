import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, TextInput } from 'flowbite-react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { HiOutlineExclamationCircle } from 'react-icons/hi';


function BonusesTable({ fetchBonuses }) {
  const [bonuses, setBonuses] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteBonusId, setDeleteBonusId] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editBonusData, setEditBonusData] = useState({
    id: null,
    empName: '',
    bonusType: '',
    bonus: 0
  });

  useEffect(() => {
    fetchBonuses().then(data => {
      setBonuses(data);
    }).catch(error => {
      console.error('Error fetching bonuses:', error);
    });
  }, [fetchBonuses]);

  const handleDeleteBonus = (id) => {
    setDeleteBonusId(id);
    setDeleteModalOpen(true);
  };

  const confirmDeleteBonus = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/bonus/${deleteBonusId}`);
      setBonuses(bonuses.filter(bonus => bonus.id !== deleteBonusId));
      console.log('Bonus deleted successfully');
    } catch (error) {
      console.error('Error deleting bonus:', error);
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
    setEditModalOpen(true);
  };

  const confirmEditBonus = async () => {
    try {
      await axios.put(`http://localhost:8080/api/bonus/${editBonusData.id}`, editBonusData);
      fetchBonuses().then(data => {
        setBonuses(data);
        console.log('Bonificaciones actualizadas con éxito');
      }).catch(error => {
        console.error('Error al obtener bonificaciones después de la actualización:', error);
      });
    } catch (error) {
      console.error('Error al actualizar el bono:', error);
    } finally {
      setEditModalOpen(false);
      setEditBonusData({
        id: null,
        empName: '',
        bonusType: '',
        bonus: 0
      });
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Bonificaciones</h2>
      <Table hoverable className='drop-shadow-lg'>
        <Table.Head>
          <Table.HeadCell>Nombre del Emplead</Table.HeadCell>
          <Table.HeadCell>Tipo de Bonificación</Table.HeadCell>
          <Table.HeadCell>Bonificación (S/)</Table.HeadCell>
          <Table.HeadCell>Acción</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {bonuses.map((bonus, index) => (
            <Table.Row key={index} className="bg-white dark:border-gray-700 dark:bg-gray-800">
              <Table.Cell>{bonus.empName}</Table.Cell>
              <Table.Cell>{bonus.bonusType}</Table.Cell>
              <Table.Cell>{bonus.bonus}</Table.Cell>
              <Table.Cell className="flex">
                <FaEdit
                  className="text-blue-500 mr-2 hover:text-blue-700 cursor-pointer text-lg"
                  onClick={() => handleEditBonus(bonus)}
                />
                <FaTrash
                  className="text-red-500 hover:text-red-700 cursor-pointer text-lg"
                  onClick={() => handleDeleteBonus(bonus.id)}
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
                <TextInput
                  id="editEmpName"
                  type="text"
                  value={editBonusData.empName}
                  disabled
                  placeholder="Nombre del empleado"
                  className="w-full border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 dark:bg-gray-700 dark:border-gray-700 dark:focus:border-gray-500 dark:focus:ring-gray-600 dark:text-gray-300 rounded-md"
                />
              </div>
              <div className="mb-2 block">
                <TextInput
                  id="editBonusType"
                  type="text"
                  value={editBonusData.bonusType}
                  onChange={(e) => setEditBonusData({ ...editBonusData, bonusType: e.target.value })}
                  placeholder="Tipo de bonificación"
                  className="w-full border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 dark:bg-gray-700 dark:border-gray-700 dark:focus:border-gray-500 dark:focus:ring-gray-600 dark:text-gray-300 rounded-md"
                />
              </div>
              <div className="mb-2 block">
                <TextInput
                  id="editBonusAmount"
                  type="number"
                  value={editBonusData.bonus}
                  onChange={(e) => setEditBonusData({ ...editBonusData, bonus: e.target.value })}
                  placeholder="Monto del bono"
                  className="w-full border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 dark:bg-gray-700 dark:border-gray-700 dark:focus:border-gray-500 dark:focus:ring-gray-600 dark:text-gray-300 rounded-md"
                />
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
