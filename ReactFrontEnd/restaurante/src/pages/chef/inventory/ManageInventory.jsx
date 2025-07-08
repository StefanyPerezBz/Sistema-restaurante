import { React, Fragment, useEffect, useState } from 'react'
import { Button, Spinner } from "flowbite-react";
import axios from 'axios';
import UseItemPopup from './UseItemPopup';
import Swal from 'sweetalert2';
import DataTable from 'react-data-table-component';

export default function ManageInventory() {
  const [items, setItems] = useState([]);
  const [todayUsage, setTodayUsage] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [usageLoading, setUsageLoading] = useState(true);

  useEffect(() => {
    fetchData();
    fetchTodayUsage();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`localhost:8080/api/inventory/view`);
      setItems(response.data);
    } catch (error) {
      console.error("Error al recuperar datos", error);
      Swal.fire({
        title: 'Error!',
        text: 'No se pudo cargar el inventario',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchTodayUsage = async () => {
    setUsageLoading(true);
    try {
      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() + 0);
      const increasedDate = currentDate.toISOString().split('T')[0];
      
      const response = await axios.get(`localhost:8080/api/inventory/inventory-usage-log/${increasedDate}`);
      setTodayUsage(response.data);
    } catch (error) {
      console.error("Error al obtener el uso de hoy", error);
      Swal.fire({
        title: 'Error!',
        text: 'No se pudo cargar el uso de hoy',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
    } finally {
      setUsageLoading(false);
    }
  };

  const handleUseItem = (itemId) => {
    const item = items.find(item => item.id === itemId);
    if (!item) {
      Swal.fire({
        title: 'Error!',
        text: 'Ítem no encontrado',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
      return;
    }
    setSelectedItem(item);
    setShowPopup(true);
  };

  const handleUseItemConfirm = async (quantityUsed) => {
    try {
      await fetchData();
      await fetchTodayUsage();
      setShowPopup(false);
      Swal.fire({
        title: 'Éxito!',
        text: 'Ítem usado correctamente',
        icon: 'success',
        confirmButtonText: 'Ok'
      });
    } catch (error) {
      console.error("Error al usar el artículo", error);
      Swal.fire({
        title: 'Error!',
        text: 'No se pudo usar el ítem',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
    }
  };

  const handleCancelPopup = () => {
    setShowPopup(false);
    setSelectedItem(null);
  };

  // DataTable columns for inventory
  const inventoryColumns = [
    {
      name: '#',
      cell: (row, index) => index + 1,
      width: '70px',
      center: true
    },
    {
      name: 'ID',
      selector: row => row.id,
      sortable: true,
      center: true
    },
    {
      name: 'Nombre del ítem',
      selector: row => row.itemName,
      sortable: true,
      grow: 2
    },
    {
      name: 'Cantidad',
      selector: row => row.quantity,
      sortable: true,
      center: true
    },
    {
      name: 'Nombre del vendedor',
      selector: row => row.vendorId,
      sortable: true,
      center: true
    },
    {
      name: 'Acción',
      cell: row => (
        <Button 
          size='sm' 
          color='success' 
          className='bg-green-500 hover:bg-green-600'
          onClick={() => handleUseItem(row.id)}
        >
          Usar
        </Button>
      ),
      center: true,
      width: '100px'
    }
  ];

  // DataTable columns for today's usage
  const usageColumns = [
    {
      name: '#',
      cell: (row, index) => index + 1,
      width: '70px',
      center: true
    },
    {
      name: 'ID',
      selector: row => row.itemId,
      sortable: true,
      center: true
    },
    {
      name: 'Nombre',
      selector: row => row.itemName,
      sortable: true
    },
    {
      name: 'Cantidad usada',
      selector: row => `${row.decreasedQuantity} ${row.unit}`,
      sortable: true,
      center: true
    },
    {
      name: 'Hora de uso',
      selector: row => new Date(row.usageDateTime).toLocaleTimeString(),
      sortable: true,
      center: true
    }
  ];

  const customStyles = {
    headCells: {
      style: {
        backgroundColor: '#f0fdf4', // green-50
        fontWeight: 'bold',
        fontSize: '0.9rem',
      },
    },
    cells: {
      style: {
        padding: '8px',
      },
    },
  };

  return (
    <Fragment>
      <div className='min-h-screen w-full grid grid-cols-1 lg:grid-cols-2 bg-gray-100'>
        {/* Left column - Inventory */}
        <div className='p-4 border-r border-gray-200'>
          <div className='bg-white p-4 rounded-lg shadow mb-4'>
            <h2 className="text-xl font-bold text-gray-800">Inventario disponible</h2>
          </div>
          
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Spinner size="xl" />
                <span className="ml-3">Cargando inventario...</span>
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No hay items disponibles en el inventario</p>
              </div>
            ) : (
              <DataTable
                columns={inventoryColumns}
                data={items}
                customStyles={customStyles}
                pagination
                paginationPerPage={10}
                paginationRowsPerPageOptions={[5, 10, 15]}
                noDataComponent={<div className="py-8 text-center text-gray-500">No hay datos disponibles</div>}
                striped
                highlightOnHover
                responsive
              />
            )}
          </div>
        </div>

        {/* Right column - Today's Usage */}
        <div className='p-4'>
          <div className='bg-white p-4 rounded-lg shadow mb-4'>
            <h2 className="text-xl font-bold text-gray-800">Uso del artículo hoy</h2>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            {usageLoading ? (
              <div className="flex justify-center items-center h-64">
                <Spinner size="xl" />
                <span className="ml-3">Cargando uso diario...</span>
              </div>
            ) : todayUsage.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No se ha usado ningún item hoy</p>
              </div>
            ) : (
              <DataTable
                columns={usageColumns}
                data={todayUsage}
                customStyles={customStyles}
                pagination
                paginationPerPage={10}
                paginationRowsPerPageOptions={[5, 10, 15]}
                noDataComponent={<div className="py-8 text-center text-gray-500">No hay datos disponibles</div>}
                striped
                highlightOnHover
                responsive
              />
            )}
          </div>
        </div>
      </div>

      {/* Popup window */}
      {showPopup && selectedItem && (
        <UseItemPopup
          item={selectedItem}
          onConfirm={handleUseItemConfirm}
          onCancel={handleCancelPopup}
          onReloadItems={() => {
            fetchData();
            fetchTodayUsage();
          }}
        />
      )}
    </Fragment>
  )
}