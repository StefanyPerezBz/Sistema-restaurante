

import React, { Fragment, useRef } from 'react'
import { Button, Pagination, Datepicker, Dropdown, Modal, TextInput } from 'flowbite-react'
import { Table } from "flowbite-react";
import { useEffect, useState } from 'react';
import { HiOutlineExclamationCircle } from "react-icons/hi";
import axios from 'axios';
import EditInventoryItem from './EditInventoryItem';
import AddInventoryItem from './AddInventoryItem';
import DeleteInventoryItem from './DeleteInventoryItem';
import DailyInventoryUsage from './DailyInventoryUsage';

export default function AllinventoryItem() {
  const [isAddInventoryOpen, setAddInventoryOpen] = useState(false);
  const [inventoryData, setInventoryData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [editItem, setEditItem] = useState(null);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isOpenDailyUsageWindow, setIsOpenDailyUsageWindow] = useState(false);

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;

  const [selectedDate, setSelectedDate] = useState(formattedDate);

  useEffect(() => { 
    fetchData(); 
  }, []);

  const openAddInventoryPopup = () => {
    setAddInventoryOpen(true);
  };

  const cancelAddInventoryPopup = () => {
    setAddInventoryOpen(false);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/inventory/view`);
      setInventoryData(response.data);
    } catch (error) {
      console.error("Error al obtener datos:", error);
    }
  };

  const handleEditClick = (itemId) => {
    setEditItem(itemId);
    setIsEditPopupOpen(true);
  };

  const handleEditSubmit = (updatedItem) => {
    fetchData();
    console.log("Artículo actualizado:", updatedItem);
  };

  const cancelEdit = () => {
    setIsEditPopupOpen(false);
    setEditItem(null);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentInventoryData = inventoryData.slice(startIndex, endIndex);

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDeleteItem = (itemId) => {
    setShowDeleteConfirmation(true);
    setItemToDelete(itemId);
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
    setItemToDelete(null);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/inventory/delete/${itemToDelete}`);
      setShowDeleteConfirmation(false);
      setItemToDelete(null);
      fetchData();
    } catch (error) {
      console.error("Error al eliminar el elemento", error);
    }
  };

  const handleSubmitDailyUsage = () => {
    setIsOpenDailyUsageWindow(true);
  }

  const cancelDailyUsage = () => {
    setIsOpenDailyUsageWindow(false);
  }

  return (
    <Fragment>
      <section className="bg-gray-100 dark:bg-gray-800 min-h-screen">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left column - Inventory Table */}
            <div className="w-full lg:w-2/3 bg-white dark:bg-gray-700 rounded-lg shadow p-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
                <h2 className="text-2xl font-semibold">Inventario</h2>
                <Button color="success" className="bg-green-500 hover:bg-green-600" onClick={openAddInventoryPopup}>
                  Nuevo +
                </Button>
              </div>

              {/* Pagination Top */}
              <div className="flex justify-end mb-3">
                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(inventoryData.length / itemsPerPage)}
                  onPageChange={onPageChange}
                />
              </div>

              {/* Responsive Table */}
              <div className="overflow-x-auto rounded-lg shadow">
                <Table hoverable className="w-full">
                  <Table.Head className="bg-green-100 dark:bg-gray-700">
                    <Table.HeadCell className="text-center py-3">#</Table.HeadCell>
                    <Table.HeadCell className="text-center py-3 hidden sm:table-cell">ID</Table.HeadCell>
                    <Table.HeadCell className="text-center py-3">Nombre</Table.HeadCell>
                    <Table.HeadCell className="text-center py-3">Cantidad</Table.HeadCell>
                    <Table.HeadCell className="text-center py-3 hidden md:table-cell">Unidad</Table.HeadCell>
                    <Table.HeadCell className="text-center py-3 hidden lg:table-cell">Vendedor</Table.HeadCell>
                    <Table.HeadCell className="text-center py-3 hidden xl:table-cell">Fecha agregada</Table.HeadCell>
                    <Table.HeadCell className="text-center py-3 hidden xl:table-cell">Modificado</Table.HeadCell>
                    <Table.HeadCell className="text-center py-3">Acción</Table.HeadCell>
                  </Table.Head>
                  <Table.Body className="divide-y dark:divide-gray-700">
                    {currentInventoryData.map((item, index) => (
                      <Table.Row key={item.id} className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                        <Table.Cell className="text-center py-3">{startIndex + index + 1}</Table.Cell>
                        <Table.Cell className="text-center py-3 hidden sm:table-cell">{item.id}</Table.Cell>
                        <Table.Cell className="text-center py-3 font-medium text-gray-900 dark:text-white">
                          {item.itemName}
                        </Table.Cell>
                        <Table.Cell className="text-center py-3">{item.quantity}</Table.Cell>
                        <Table.Cell className="text-center py-3 hidden md:table-cell">{item.unit}</Table.Cell>
                        <Table.Cell className="text-center py-3 hidden lg:table-cell">{item.vendorId}</Table.Cell>
                        <Table.Cell className="text-center py-3 hidden xl:table-cell">
                          {new Date(item.dateTime).toLocaleDateString()}
                        </Table.Cell>
                        <Table.Cell className="text-center py-3 hidden xl:table-cell">
                          {new Date(item.lastModified).toLocaleDateString()}
                        </Table.Cell>
                        <Table.Cell className="text-center py-3">
                          <Dropdown label="Acciones" inline>
                            <Dropdown.Item onClick={() => handleEditClick(item.id)}>Editar</Dropdown.Item>
                            <Dropdown.Item onClick={() => handleDeleteItem(item.id)} className="text-red-600">
                              Eliminar
                            </Dropdown.Item>
                          </Dropdown>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              </div>

              {/* Pagination Bottom */}
              <div className="flex justify-end mt-3">
                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(inventoryData.length / itemsPerPage)}
                  onPageChange={onPageChange}
                />
              </div>
            </div>

            {/* Right column - Daily Usage */}
            <div className="w-full lg:w-1/3 bg-white dark:bg-gray-700 rounded-lg shadow p-6 flex flex-col items-center">
              <h2 className="text-2xl font-semibold mb-6 text-center">Verificar uso diario</h2>
              
              <div className="w-full max-w-xs">
                <div className="mb-6">
                  <label htmlFor="formDate" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Seleccionar fecha
                  </label>
                  <TextInput
                    id="formDate"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full"
                  />
                </div>
                
                <Button 
                  color="success" 
                  className="w-full bg-green-500 hover:bg-green-600"
                  onClick={handleSubmitDailyUsage}
                >
                  Verificar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modals */}
      {isOpenDailyUsageWindow && (
        <DailyInventoryUsage
          selectedDate={selectedDate}
          onCancel={cancelDailyUsage}
        />
      )}

      {showDeleteConfirmation && (
        <DeleteInventoryItem
          itemName={inventoryData.find(item => item.id === itemToDelete)?.itemName}
          onCancel={cancelDelete}
          onConfirm={confirmDelete}
        />
      )}

      {isEditPopupOpen && (
        <EditInventoryItem
          itemId={editItem}
          onCancel={cancelEdit}
          onSubmit={handleEditSubmit}
        />
      )}

      {isAddInventoryOpen && (
        <AddInventoryItem
          onCancel={cancelAddInventoryPopup}
          onSubmit={fetchData}
        />
      )}
    </Fragment>
  )
}