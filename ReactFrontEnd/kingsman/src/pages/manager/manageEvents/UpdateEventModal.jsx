import React, { useState, useEffect } from 'react';
import { Modal, Label, TextInput, Button, Alert } from 'flowbite-react';
import axios from 'axios';
import GenerateTicketPriceModel from './GenerateTicketPriceModel';

const UpdateEventModal = ({ event, handleClose}) => {
    if (!event) {
        return null; // Handle case where employee prop is not yet available
    }
    const [formData, setFormData] = useState({
        eventName: event.eventName || '',
        eventDate: event.eventDate || '',
        startTime: event.startTime || '',
        duration: event.duration || '',
        ticketPrice: event.ticketPrice || '',
        entertainer: event.entertainer || '',
        description: event.description || ''
    });

    const [errorMessage, setErrorMessage] = useState('');
    const [durationErrorMessage, setDurationErrorMessage] = useState('');
    const [ticketPriceErrorMessage, setTicketPriceErrorMessage] = useState('');
    const [showTicketPriceModal, setShowTicketPriceModal] = useState(false);
    const [minDate, setMinDate] = useState('');

  const handleShowTicketPriceModal = () => {
    setShowTicketPriceModal(true);
  };

  const handleCloseTicketPriceModal = () => {
    setShowTicketPriceModal(false);
  };

  const handleTicketPriceChange = (price) => {
      setFormData({
        ...formData,
        ticketPrice: price,
      });
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
         let errorMessage = '';
    if (name === 'ticketPrice'){
      if (value !== '' && !/^\d+(\.\d{1,2})?$/.test(value)) {
        setTicketPriceErrorMessage('El precio del ticket debe ser un número válido con hasta dos decimales..');
      }else{
        setTicketPriceErrorMessage('');
      }
    }else if (name === 'duration'){
      if (value !== '' && !/^\d+(\.\d{1,2})?$/.test(value)) {
        setDurationErrorMessage('La duración debe ser un número válido con hasta dos decimales.');
      }else{
        setDurationErrorMessage('');
      }
    }
    
    // For the time selects
    if (name === 'startTime') {
      // Split the selected time into hours and minutes
      const [selectedHour, selectedMinute] = formData.startTime.split(':');
      const selectedTime = value.replace(/^:/, '');
      setFormData({
        ...formData,
        startTime: selectedTime,
      });
    } else{
      setFormData({
        ...formData,
        [name]: value,
      });
      setErrorMessage(errorMessage); 
    };
  };

  useEffect(() => {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
      const dd = String(today.getDate()).padStart(2, '0');
      setMinDate(`${yyyy}-${mm}-${dd}`);
  }, []);


    const handleSubmit = async (e) => {
        try {
            const updatedEvent = {
                ...event,
                ...formData
            };

            await axios.put(`http://localhost:8080/api/events/update/${event.eventID}`, updatedEvent);
            // handleUpdateEvent(updatedEvent);
            handleClose();
        } catch (error) {
            console.error('No se pudo actualizar el evento', error);
            setErrorMessage('No se pudo actualizar el evento. Inténtalo de nuevo..');
        }
    };

    return (
        <Modal show={true} size="md" onClose={handleClose} popup>
            <Modal.Header>
                <h1 className="text-3xl font-bold mb-4 text-center">Update Event</h1>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                    <div>
                        <Label value='Event ID' />
                        <TextInput type='text' id='eventID' value={event.eventID} name="eventID" readOnly />
                    </div>
                    <div>
                        <Label value='Event Name*' />
                        <TextInput type='text' id='eventName' value={formData.eventName} name="eventName" onChange={handleChange} required />
                    </div>
                    <div>
                        <Label value='Event Date*' />
                        <TextInput type='date' id='eventDate' value={formData.eventDate} name="eventDate" onChange={handleChange} min={minDate} required/>
                    </div>

                    <div>
                        <select className="border rounded-md dark:bg-gray-600 dark:font-white" onChange={(e) => setFormData({ ...formData, startTime: `${e.target.value}:${formData.startTime ? formData.startTime.split(':')[1] : ''}` })}
                            value={formData.startTime ? formData.startTime.split(':')[0] : ''}>
                            {Array.from({ length: 24 }, (_, i) => (
                                <option key={i} value={i < 10 ? `0${i}` : `${i}`}>
                                    {i < 10 ? `0${i}` : `${i}`}
                                </option>
                            ))}
                        </select>
                        <span className="text-xl font-bold">:</span>
                        <select
                            className="border rounded-md dark:bg-gray-600 dark:font-white"
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    startTime: `${formData.startTime ? formData.startTime.split(':')[0] : ''}:${e.target.value}`
                                })
                            }
                            value={formData.startTime ? formData.startTime.split(':')[1] : ''}
                        >
                            {Array.from({ length: 60 }, (_, i) => (
                                <option key={i} value={i < 10 ? `0${i}` : `${i}`}>
                                    {i < 10 ? `0${i}` : `${i}`}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <Label value='Duration (Hours)' />
                        <TextInput type='text' id='duration' value={formData.duration} name="duration" onChange={handleChange} />
                        {durationErrorMessage && <div className="text-red-500 text-sm">{durationErrorMessage}</div>}
                    </div>
                    <div>
                        <Label value='Entertainer' />
                        <TextInput type='text' id='entertainer' value={formData.entertainer} name="entertainer" onChange={handleChange} />
                    </div>
                    <div>
                        <Label value='Description' />
                        <TextInput type='text' id='description' value={formData.description} name="description" onChange={handleChange} />
                    </div>

                    <div>
                        <Label value='Ticket Price (S/.)' />
                        <div className="flex justify-between">
                            <TextInput
                              type='text'
                              value={formData.ticketPrice}
                              onChange={handleChange}
                              name="ticketPrice" 
                              className='mt-2 h-10 w-1/2'
                            />
                            <button className="bg-green-500 hover:bg-green-600 text-white font-semibold rounded w-1/2 mt-2 h-10 "
                              type="button"
                              onClick={handleShowTicketPriceModal}> Calcular </button>
                                <GenerateTicketPriceModel show={showTicketPriceModal} onClose={handleCloseTicketPriceModal} onTicketPriceChange={handleTicketPriceChange}/>        
                        </div>
                    </div>
                </form>
            </Modal.Body>
            <Modal.Footer>
                {/* <Button onClick={handleClose} className="bg-slate-500 hover:bg-slate-700 text-white font-bold py-2 mr-2 rounded w-full">Close</Button> */}
                <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 ml-2 rounded w-full">Update Event</Button>
            </Modal.Footer>
            {errorMessage && (
                <Alert className='mt-5' color='failure'>
                    {errorMessage}
                </Alert>
            )}


        </Modal>
    );
};

export default UpdateEventModal;
