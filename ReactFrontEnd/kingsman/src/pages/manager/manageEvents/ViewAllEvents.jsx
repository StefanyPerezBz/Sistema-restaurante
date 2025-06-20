import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Table } from 'flowbite-react';
import UpdateEventModal from './UpdateEventModal';
import DoneEventModal from './DoneEventModal';

const ViewAllEvents = () => {
    const [events, setEvents] = useState([]);
    const [showEventUpdateModal, setShowEventUpdateModal] = useState(false);
    const [eventToUpdate, setEventUpdate] = useState(null);

    //search bar
    const [searchQuery, setSearchQuery] = useState('');
    const [searchCriteria, setSearchCriteria] = useState('');

    const [showDoneModal, setShowDoneModal] = useState(false);
    const [eventToMarkDone, setEventToMarkDone] = useState(null);

    useEffect(() => {
        const viewEvents = async () => {
            try {
                let url = 'http://localhost:8080/api/events/view-events';
                if (searchQuery) {
                    url += `?${searchCriteria}=${searchQuery}`;
                }
                const response = await fetch(url);
                const data = await response.json();
                setEvents(data);
            } catch (error) {
                console.log(error.message);
            }
        };
        viewEvents();
    }, [searchQuery, searchCriteria]);

    //Delete employee
    const handleDelete = async (eventID) => {
        if (window.confirm(`¿Está seguro de que desea eliminar el evento con ID de evento: ${eventID}?`)) {
            try {
                await axios.delete(`http://localhost:8080/api/events/delete/${eventID}`);
                setEvents(events.filter(event => event.eventID !== eventID));
            } catch (error) {
                console.error(error);
            }
        }
    }

    //handle search
    const handleSearch = async () => {
        try {
            let url = 'http://localhost:8080/api/events/view-events';
            if (searchQuery && searchCriteria) {
                url += `?${searchCriteria}=${searchQuery}`;
            }
            const response = await fetch(url);
            const data = await response.json();
            setEvents(data);
            console.log(data);
        } catch (error) {
            console.log(error.message);
        }
    };

  // retrieve event details
    const fetchEventDetails = async (eventID) => {
    try {
        const response = await fetch(`http://localhost:8080/api/inform/get/${eventID}`);
        if (!response.ok) {
            throw new Error(`Error al obtener los detalles del evento: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error al obtener los detalles del evento:', error);
        throw error;
    }
};



   // Function to handle sharing event details
    const handleShare = async (eventID) => {
        try {
            // Fetch event details
            const eventDetails = await fetchEventDetails(eventID);

            // Send a POST request to share event details
            const response = await axios.post('http://localhost:8080/api/inform/share-event-details', { eventID: eventID });

            // Check if the response is successful
            if (response.status === 200) {
                console.log(response.data);
                alert('Correos electrónicos enviados exitosamente!');
            } else {
                // Handle other response statuses if needed
                console.error('Respuesta inesperada:', response);
                alert('No se pudieron enviar los correos. Inténtelo de nuevo más tarde..');
            }
        } catch (error) {
            console.error('Error al enviar correos electrónicos:', error);
            alert('No se pudieron enviar los correos. Inténtelo de nuevo más tarde..');
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

    return (
      <div className="flex flex-col w-full bg-green-50 ">
      {/* topic and searchbar & filter */}
        <div className="flex items-center m-4 justify-between border-b bg-white dark:bg-gray-500 p-3 shadow-md rounded-md">
          <h1 className="text-2xl font-bold mb-2">Administrar eventos</h1>

          <div className="flex items-center">
            {/* Search bar */}
            <div className="flex-grow px-3 border rounded-full dark:bg-gray-600 ">
              <input
                type="search"
                placeholder="Buscar evento..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                id="search"
                className="flex-grow px-4 py-2 border-none outline-none focus:ring-0 dark:bg-gray-600 dark:text-white"
              />
            </div>

            {/* Add Event button */}
            <Link
              to="/manager?tab=add-event"
              className="bg-green-500 hover:bg-green-700 text-white font-semibold py-2 ml-2 rounded px-4"
            >
              Agregar evento
            </Link>
          </div>
        </div>
        {/* Table */}
        <div className="m-4 relative overflow-x-auto shadow-md bg-white rounded-md">
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell className="bg-green-100">ID</Table.HeadCell>
              <Table.HeadCell className="bg-green-100">Nombre</Table.HeadCell>
              <Table.HeadCell className="bg-green-100">Fecha</Table.HeadCell>
              <Table.HeadCell className="bg-green-100"> Hora de inicio </Table.HeadCell>
              <Table.HeadCell className="bg-green-100"> Duración (h) </Table.HeadCell>
              <Table.HeadCell className="bg-green-100"> Presupuesto (S/.) </Table.HeadCell>
              <Table.HeadCell className="bg-green-100"> Precio del ticket (S/.) </Table.HeadCell>
              <Table.HeadCell className="bg-green-100"> Cantidad de tickets vendidos</Table.HeadCell>
              <Table.HeadCell className="bg-green-100"> Invitado </Table.HeadCell>
              <Table.HeadCell className="bg-green-100"> Descripción </Table.HeadCell>
              <Table.HeadCell className="bg-green-100">  </Table.HeadCell> <Table.HeadCell
                className="bg-green-100 text-center"
                colSpan={3}
              ></Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {events
                .filter((event) => {
                  // Filter events based on the search query
                  if (!searchQuery) {
                    return true; // Return all events if there's no search query
                  } else {
                    // Check if any of the event properties contain the search query
                    return Object.values(event).some(
                      (value) =>
                        value &&
                        value
                          .toString()
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase())
                    );
                  }
                })
                .map((event, index) => (
                  <Table.Row key={event.eventID} className={ index % 2 === 0 ? "bg-green-50 dark:bg-gray-500 dark:text-white" : "bg-gray-150 dark:bg-gray-700 dark:text-white" } >
                    <Table.Cell className="text-black dark:text-slate-200 dark:bg-gray-600"> {event.eventID}</Table.Cell>
                    <Table.Cell className="text-black dark:text-slate-200 dark:bg-gray-600">{event.eventName}</Table.Cell>
                    <Table.Cell className="text-black dark:text-slate-200 dark:bg-gray-600">{event.eventDate}</Table.Cell>
                    <Table.Cell className="text-black dark:text-slate-200 dark:bg-gray-600">{event.startTime}</Table.Cell>
                    <Table.Cell className="text-black dark:text-slate-200 dark:bg-gray-600">{event.duration}</Table.Cell>
                    <Table.Cell className="text-black dark:text-slate-200 dark:bg-gray-600">{event.budget}</Table.Cell>
                    <Table.Cell className="text-black dark:text-slate-200 dark:bg-gray-600">{event.ticketPrice}</Table.Cell>
                    <Table.Cell className="text-black dark:text-slate-200 dark:bg-gray-600"> {event.soldTicketQuantity}</Table.Cell>
                    <Table.Cell className="text-black dark:text-slate-200 dark:bg-gray-600"> {event.entertainer}</Table.Cell>
                    <Table.Cell className="text-black dark:text-slate-200 dark:bg-gray-600">{event.description}</Table.Cell>
                    <Table.Cell className="text-black dark:text-slate-200 dark:bg-gray-600">
                      <button onClick={() => handleStatusChange(event)} className="font-medium text-green-800 dark:text-green-400 hover:scale-110"> Mark as Done </button>
                    </Table.Cell>
                    <Table.Cell className="dark:bg-gray-600">
                      <button onClick={() => handleUpdateClick(event)} className="font-medium text-blue-600 dark:text-blue-400 hover:scale-110 ">Actualizar</button>
                    </Table.Cell>
                    <Table.Cell className="dark:bg-gray-600">
                      <button onClick={() => handleDelete(event.eventID)} className="font-medium text-red-800 dark:text-red-400 hover:scale-110" > Eliminar  </button>
                    </Table.Cell>
                    <Table.Cell className="dark:bg-gray-600">
                      <button onClick={() => handleShare(event.eventID)}  className="font-medium text-green-800 dark:text-green-400 hover:scale-110" > Compartir </button>
                    </Table.Cell>
                  </Table.Row>
                ))}
            </Table.Body>
          </Table>

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

        </div>
      </div>
    );

};

export default ViewAllEvents;
