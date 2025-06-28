// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Link } from 'react-router-dom';
// import { Table } from 'flowbite-react';
// import UpdateEventModal from './UpdateEventModal';
// import DoneEventModal from './DoneEventModal';

// const ViewAllEvents = () => {
//     const [events, setEvents] = useState([]);
//     const [showEventUpdateModal, setShowEventUpdateModal] = useState(false);
//     const [eventToUpdate, setEventUpdate] = useState(null);

//     //search bar
//     const [searchQuery, setSearchQuery] = useState('');
//     const [searchCriteria, setSearchCriteria] = useState('');

//     const [showDoneModal, setShowDoneModal] = useState(false);
//     const [eventToMarkDone, setEventToMarkDone] = useState(null);

//     useEffect(() => {
//         const viewEvents = async () => {
//             try {
//                 let url = 'http://localhost:8080/api/events/view-events';
//                 if (searchQuery) {
//                     url += `?${searchCriteria}=${searchQuery}`;
//                 }
//                 const response = await fetch(url);
//                 const data = await response.json();
//                 setEvents(data);
//             } catch (error) {
//                 console.log(error.message);
//             }
//         };
//         viewEvents();
//     }, [searchQuery, searchCriteria]);

//     //Delete employee
//     const handleDelete = async (eventID) => {
//         if (window.confirm(`¿Está seguro de que desea eliminar el evento con ID de evento: ${eventID}?`)) {
//             try {
//                 await axios.delete(`http://localhost:8080/api/events/delete/${eventID}`);
//                 setEvents(events.filter(event => event.eventID !== eventID));
//             } catch (error) {
//                 console.error(error);
//             }
//         }
//     }

//     //handle search
//     const handleSearch = async () => {
//         try {
//             let url = 'http://localhost:8080/api/events/view-events';
//             if (searchQuery && searchCriteria) {
//                 url += `?${searchCriteria}=${searchQuery}`;
//             }
//             const response = await fetch(url);
//             const data = await response.json();
//             setEvents(data);
//             console.log(data);
//         } catch (error) {
//             console.log(error.message);
//         }
//     };

//   // retrieve event details
//     const fetchEventDetails = async (eventID) => {
//     try {
//         const response = await fetch(`http://localhost:8080/api/inform/get/${eventID}`);
//         if (!response.ok) {
//             throw new Error(`Error al obtener los detalles del evento: ${response.statusText}`);
//         }
//         return await response.json();
//     } catch (error) {
//         console.error('Error al obtener los detalles del evento:', error);
//         throw error;
//     }
// };



//    // Function to handle sharing event details
//     const handleShare = async (eventID) => {
//         try {
//             // Fetch event details
//             const eventDetails = await fetchEventDetails(eventID);

//             // Send a POST request to share event details
//             const response = await axios.post('http://localhost:8080/api/inform/share-event-details', { eventID: eventID });

//             // Check if the response is successful
//             if (response.status === 200) {
//                 console.log(response.data);
//                 alert('Correos electrónicos enviados exitosamente!');
//             } else {
//                 // Handle other response statuses if needed
//                 console.error('Respuesta inesperada:', response);
//                 alert('No se pudieron enviar los correos. Inténtelo de nuevo más tarde..');
//             }
//         } catch (error) {
//             console.error('Error al enviar correos electrónicos:', error);
//             alert('No se pudieron enviar los correos. Inténtelo de nuevo más tarde..');
//         }
//     };

//     const handleUpdateClick = (event) => {
//         setEventUpdate(event);  
//         setShowEventUpdateModal(true);
//     };

//     const handleUpdateClose = () => {
//         setShowEventUpdateModal(false);
//     };

//  const handleStatusChange = (event) => {
//   setEventToMarkDone(event);
//   setShowDoneModal(true);
// };


//    const handleDoneModalClose = () => {
//         setShowDoneModal(false);
//     };

//     return (
//       <div className="flex flex-col w-full bg-green-50 ">
//       {/* topic and searchbar & filter */}
//         <div className="flex items-center m-4 justify-between border-b bg-white dark:bg-gray-500 p-3 shadow-md rounded-md">
//           <h1 className="text-2xl font-bold mb-2">Administrar eventos</h1>

//           <div className="flex items-center">
//             {/* Search bar */}
//             <div className="flex-grow px-3 border rounded-full dark:bg-gray-600 ">
//               <input
//                 type="search"
//                 placeholder="Buscar evento..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 id="search"
//                 className="flex-grow px-4 py-2 border-none outline-none focus:ring-0 dark:bg-gray-600 dark:text-white"
//               />
//             </div>

//             {/* Add Event button */}
//             <Link
//               to="/manager?tab=add-event"
//               className="bg-green-500 hover:bg-green-700 text-white font-semibold py-2 ml-2 rounded px-4"
//             >
//               Agregar evento
//             </Link>
//           </div>
//         </div>
//         {/* Table */}
//         <div className="m-4 relative overflow-x-auto shadow-md bg-white rounded-md">
//           <Table hoverable>
//             <Table.Head>
//               <Table.HeadCell className="bg-green-100">ID</Table.HeadCell>
//               <Table.HeadCell className="bg-green-100">Nombre</Table.HeadCell>
//               <Table.HeadCell className="bg-green-100">Fecha</Table.HeadCell>
//               <Table.HeadCell className="bg-green-100"> Hora de inicio </Table.HeadCell>
//               <Table.HeadCell className="bg-green-100"> Duración (h) </Table.HeadCell>
//               <Table.HeadCell className="bg-green-100"> Presupuesto (S/.) </Table.HeadCell>
//               <Table.HeadCell className="bg-green-100"> Precio del ticket (S/.) </Table.HeadCell>
//               <Table.HeadCell className="bg-green-100"> Cantidad de tickets vendidos</Table.HeadCell>
//               <Table.HeadCell className="bg-green-100"> Invitado </Table.HeadCell>
//               <Table.HeadCell className="bg-green-100"> Descripción </Table.HeadCell>
//               <Table.HeadCell className="bg-green-100">  </Table.HeadCell> <Table.HeadCell
//                 className="bg-green-100 text-center"
//                 colSpan={3}
//               ></Table.HeadCell>
//             </Table.Head>
//             <Table.Body>
//               {events
//                 .filter((event) => {
//                   // Filter events based on the search query
//                   if (!searchQuery) {
//                     return true; // Return all events if there's no search query
//                   } else {
//                     // Check if any of the event properties contain the search query
//                     return Object.values(event).some(
//                       (value) =>
//                         value &&
//                         value
//                           .toString()
//                           .toLowerCase()
//                           .includes(searchQuery.toLowerCase())
//                     );
//                   }
//                 })
//                 .map((event, index) => (
//                   <Table.Row key={event.eventID} className={ index % 2 === 0 ? "bg-green-50 dark:bg-gray-500 dark:text-white" : "bg-gray-150 dark:bg-gray-700 dark:text-white" } >
//                     <Table.Cell className="text-black dark:text-slate-200 dark:bg-gray-600"> {event.eventID}</Table.Cell>
//                     <Table.Cell className="text-black dark:text-slate-200 dark:bg-gray-600">{event.eventName}</Table.Cell>
//                     <Table.Cell className="text-black dark:text-slate-200 dark:bg-gray-600">{event.eventDate}</Table.Cell>
//                     <Table.Cell className="text-black dark:text-slate-200 dark:bg-gray-600">{event.startTime}</Table.Cell>
//                     <Table.Cell className="text-black dark:text-slate-200 dark:bg-gray-600">{event.duration}</Table.Cell>
//                     <Table.Cell className="text-black dark:text-slate-200 dark:bg-gray-600">{event.budget}</Table.Cell>
//                     <Table.Cell className="text-black dark:text-slate-200 dark:bg-gray-600">{event.ticketPrice}</Table.Cell>
//                     <Table.Cell className="text-black dark:text-slate-200 dark:bg-gray-600"> {event.soldTicketQuantity}</Table.Cell>
//                     <Table.Cell className="text-black dark:text-slate-200 dark:bg-gray-600"> {event.entertainer}</Table.Cell>
//                     <Table.Cell className="text-black dark:text-slate-200 dark:bg-gray-600">{event.description}</Table.Cell>
//                     <Table.Cell className="text-black dark:text-slate-200 dark:bg-gray-600">
//                       <button onClick={() => handleStatusChange(event)} className="font-medium text-green-800 dark:text-green-400 hover:scale-110"> Mark as Done </button>
//                     </Table.Cell>
//                     <Table.Cell className="dark:bg-gray-600">
//                       <button onClick={() => handleUpdateClick(event)} className="font-medium text-blue-600 dark:text-blue-400 hover:scale-110 ">Actualizar</button>
//                     </Table.Cell>
//                     <Table.Cell className="dark:bg-gray-600">
//                       <button onClick={() => handleDelete(event.eventID)} className="font-medium text-red-800 dark:text-red-400 hover:scale-110" > Eliminar  </button>
//                     </Table.Cell>
//                     <Table.Cell className="dark:bg-gray-600">
//                       <button onClick={() => handleShare(event.eventID)}  className="font-medium text-green-800 dark:text-green-400 hover:scale-110" > Compartir </button>
//                     </Table.Cell>
//                   </Table.Row>
//                 ))}
//             </Table.Body>
//           </Table>

//           {showEventUpdateModal && (
//             <UpdateEventModal
//               event={eventToUpdate}
//               handleClose={handleUpdateClose}
//             />
//           )}

//          {showDoneModal && (
//   <DoneEventModal
//     event={eventToMarkDone}
//     handleClose={handleDoneModalClose}
//   />
// )}

//         </div>
//       </div>
//     );

// };

// export default ViewAllEvents;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import Swal from 'sweetalert2';
import UpdateEventModal from './UpdateEventModal';
import DoneEventModal from './DoneEventModal';
import { FaPlus, FaEdit, FaTrash, FaShare, FaCheck, FaSearch, FaInfoCircle } from 'react-icons/fa';
import { Tooltip } from 'react-tooltip';

const ViewAllEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEventUpdateModal, setShowEventUpdateModal] = useState(false);
  const [eventToUpdate, setEventUpdate] = useState(null);
  const [showDoneModal, setShowDoneModal] = useState(false);
  const [eventToMarkDone, setEventToMarkDone] = useState(null);
  const [filterText, setFilterText] = useState('');
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

  useEffect(() => {
    const viewEvents = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:8080/api/events/view-events');
        setEvents(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error.message);
        setLoading(false);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los eventos',
          confirmButtonColor: '#3085d6',
        });
      }
    };
    viewEvents();
  }, []);

  const filteredItems = events.filter(
    item =>
      (item.eventName && item.eventName.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.eventID && item.eventID.toString().includes(filterText)) ||
      (item.eventDate && item.eventDate.includes(filterText)) ||
      (item.entertainer && item.entertainer.toLowerCase().includes(filterText.toLowerCase()))
  );

  const handleDelete = async (eventID) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar el evento con ID: ${eventID}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:8080/api/events/delete/${eventID}`);
          setEvents(events.filter(event => event.eventID !== eventID));
          Swal.fire(
            'Eliminado!',
            'El evento ha sido eliminado.',
            'success'
          );
        } catch (error) {
          console.error(error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo eliminar el evento',
            confirmButtonColor: '#3085d6',
          });
        }
      }
    });
  };

  const fetchEventDetails = async (eventID) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/inform/get/${eventID}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener los detalles del evento:', error);
      throw error;
    }
  };

  const handleShare = async (eventID) => {
    try {
      const { value: emailCount } = await Swal.fire({
        title: 'Compartir evento',
        text: '¿Cuántos correos deseas enviar?',
        input: 'number',
        inputValue: 1,
        inputAttributes: {
          min: 1,
          max: 100
        },
        showCancelButton: true,
        confirmButtonText: 'Enviar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        inputValidator: (value) => {
          if (!value || value < 1) {
            return 'Debes ingresar un número válido';
          }
        }
      });

      if (emailCount) {
        Swal.fire({
          title: 'Enviando correos...',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        const eventDetails = await fetchEventDetails(eventID);
        const response = await axios.post('http://localhost:8080/api/inform/share-event-details', {
          eventID: eventID,
          emailCount: emailCount
        });

        if (response.status === 200) {
          Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: `Se enviaron ${emailCount} correos electrónicos`,
            confirmButtonColor: '#3085d6',
          });
        }
      }
    } catch (error) {
      console.error('Error al enviar correos electrónicos:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron enviar los correos. Inténtelo de nuevo más tarde.',
        confirmButtonColor: '#3085d6',
      });
    }
  };

  const handleUpdateClick = (event) => {
    setEventUpdate(event);
    setShowEventUpdateModal(true);
  };

  const handleUpdateClose = () => {
    setShowEventUpdateModal(false);
  };

  const handleStatusChange = (event) => {
    setEventToMarkDone(event);
    setShowDoneModal(true);
  };

  const handleDoneModalClose = () => {
    setShowDoneModal(false);
  };

  const subHeaderComponentMemo = React.useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText('');
      }
    };

    return (
      <div className="flex flex-col md:flex-row justify-between items-center w-full gap-4 mb-4">
        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            id="search"
            type="text"
            placeholder="Buscar eventos..."
            className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-white dark:border-gray-600 dark:text-gray-700"
            value={filterText}
            onChange={e => setFilterText(e.target.value)}
          />
          {filterText && (
            <button
              onClick={handleClear}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ×
            </button>
          )}
        </div>
        <Link
          to="/manager?tab=add-event"
          className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg whitespace-nowrap"
        >
          <FaPlus className="mr-2" />
          Agregar evento
        </Link>
      </div>
    );
  }, [filterText, resetPaginationToggle]);

  const columns = [
    {
      name: 'ID',
      selector: row => row.eventID,
      sortable: true,
      width: '80px'
    },
    {
      name: 'Nombre',
      selector: row => row.eventName,
      sortable: true,
      wrap: true
    },
    {
      name: 'Fecha',
      selector: row => row.eventDate,
      sortable: true,
      width: '120px'
    },
    {
      name: 'Hora',
      selector: row => row.startTime,
      sortable: true,
      width: '100px'
    },
    {
      name: 'Duración (h)',
      selector: row => row.duration,
      sortable: true,
      width: '120px'
    },
    {
      name: 'Presupuesto (S/.)',
      selector: row => row.budget,
      sortable: true,
      width: '150px'
    },
    {
      name: 'Precio Ticket',
      selector: row => row.ticketPrice,
      sortable: true,
      width: '130px'
    },
    {
      name: 'Tickets Vendidos',
      selector: row => row.soldTicketQuantity,
      sortable: true,
      width: '150px'
    },
    {
      name: 'Invitado',
      selector: row => row.entertainer,
      sortable: true,
      wrap: true
    },
    {
      name: 'Acciones',
      cell: (row) => (
        <div className="flex space-x-2">
          <button
            data-tooltip-id="actions-tooltip"
            data-tooltip-content="Marcar como completado"
            onClick={() => handleStatusChange(row)}
            className="p-2 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 hover:scale-110"
          >
            <FaCheck />
          </button>
          <button
            data-tooltip-id="actions-tooltip"
            data-tooltip-content="Editar"
            onClick={() => handleUpdateClick(row)}
            className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:scale-110"
          >
            <FaEdit />
          </button>
          <button
            data-tooltip-id="actions-tooltip"
            data-tooltip-content="Eliminar"
            onClick={() => handleDelete(row.eventID)}
            className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 hover:scale-110"
          >
            <FaTrash />
          </button>
          <button
            data-tooltip-id="actions-tooltip"
            data-tooltip-content="Compartir"
            onClick={() => handleShare(row.eventID)}
            className="p-2 text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 hover:scale-110"
          >
            <FaShare />
          </button>
        </div>
      ),
      width: '180px',
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  const customStyles = {
    headRow: {
      style: {
        backgroundColor: '#f3f4f6', // gris claro
        color: '#374151',           // gris oscuro para el texto
        borderBottomWidth: '1px',
        borderBottomColor: '#d1d5db', // gris neutro para la línea
        fontWeight: 'bold',
      },
    },
    headCells: {
      style: {
        paddingLeft: '8px',
        paddingRight: '8px',
      },
    },
    cells: {
      style: {
        paddingLeft: '8px',
        paddingRight: '8px',
      },
    },
    rows: {
      style: {
        minHeight: '72px',
        '&:not(:last-of-type)': {
          borderBottomWidth: '1px',
          borderBottomColor: '#e5e7eb',
        },
      },
      stripedStyle: {
        backgroundColor: '#f0fdf4', // lighter green for striped rows
      },
    },
  };

  const darkModeStyles = {
    headRow: {
      style: {
        backgroundColor: '#374151', // gray-700
        color: '#f3f4f6', // gray-100
        borderBottomWidth: '1px',
        borderBottomColor: '#4b5563', // gray-600
      },
    },
    rows: {
      style: {
        backgroundColor: '#1f2937', // gray-800
        color: '#f9fafb', // gray-50
        '&:not(:last-of-type)': {
          borderBottomWidth: '1px',
          borderBottomColor: '#374151', // gray-700
        },
      },
      stripedStyle: {
        backgroundColor: '#111827', // gray-900
      },
    },
    pagination: {
      style: {
        backgroundColor: '#1f2937', // gray-800
        color: '#f9fafb', // gray-50
        borderTopWidth: '1px',
        borderTopColor: '#374151', // gray-700
      },
      pageButtonsStyle: {
        color: '#f9fafb', // gray-50
        fill: '#f9fafb',
        backgroundColor: 'transparent',
        '&:disabled': {
          color: '#6b7280', // gray-500
          fill: '#6b7280',
        },
        '&:hover:not(:disabled)': {
          backgroundColor: '#374151', // gray-700
        },
        '&:focus': {
          outline: 'none',
          backgroundColor: '#374151', // gray-700
        },
      },
    },
  };

  const ExpandedComponent = ({ data }) => (
    <div className="p-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm">
      <h3 className="font-semibold text-lg mb-2 dark:text-white">Detalles adicionales</h3>
      <p className="text-gray-700 dark:text-gray-300"><span className="font-medium">Descripción:</span> {data.description || 'No disponible'}</p>
    </div>
  );

  return (
    <div className="p-4 dark:bg-gray-700 rounded-lg min-h-screen">
      <div className="max-w-full mx-auto overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold  mb-6 flex items-center">
            Administración de Eventos
          </h1>

          <DataTable
            columns={columns}
            data={filteredItems}
            progressPending={loading}
            pagination
            paginationResetDefaultPage={resetPaginationToggle}
            subHeader
            subHeaderComponent={subHeaderComponentMemo}
            persistTableHead
            responsive
            striped
            highlightOnHover
            customStyles={customStyles}
            theme="light"
            noDataComponent={
              <div className="p-4 text-center text-gray-600 dark:text-gray-300">
                No se encontraron eventos
              </div>
            }
            expandableRows
            expandableRowsComponent={ExpandedComponent}
            expandOnRowClicked
            expandableRowsHideExpander
            onRowClicked={(row) => console.log(row)}
            className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden"
          />
        </div>
      </div>

      {showEventUpdateModal && (
        <UpdateEventModal
          event={eventToUpdate}
          handleClose={handleUpdateClose}
        />
      )}

      {showDoneModal && (
        <DoneEventModal
          event={eventToMarkDone}
          handleClose={handleDoneModalClose}
        />
      )}

      <Tooltip id="actions-tooltip" place="top" effect="solid" className="z-50" />
    </div>
  );
};

export default ViewAllEvents;;