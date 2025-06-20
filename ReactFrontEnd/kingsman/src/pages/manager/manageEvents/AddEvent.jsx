import React, { useEffect, useState } from 'react';
import { Alert, Label, TextInput } from 'flowbite-react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import GenerateTicketPriceModel from './GenerateTicketPriceModel';
import { IoChevronBackCircleSharp } from "react-icons/io5";

const AddEvent = () => {
  const [formData, setFormData] = useState({
    eventID: 'event',
    eventIDNumber: '',
    eventName: '',
    eventDate: '',
    startTime: '',
    duration: '',
    ticketPrice: '',
    entertainer: '',
    description: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
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
    console.log(e.target.value);  
    const { name, value } = e.target;
    let errorMessage = '';

    if (name === 'eventID') {
      // Extract the number part of the eventID entered by the user
      const eventIDNumber = value.replace(/\D/g, '');
      // Update the eventID in the formData by concatenating the 'event' part and the user-entered number part
      setFormData({
        ...formData,
        eventID: `event${eventIDNumber.padStart(3, '0')}`, // Concatenate 'event' with the updated number part
      });
    } 

  
    if (name === 'ticketPrice'){
      if (value !== '' && !/^\d+(\.\d{1,2})?$/.test(value)) {
        setTicketPriceErrorMessage('El precio del ticket debe ser un número válido con hasta dos decimales.');
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


    const handleSubmit = async (e) => {
      e.preventDefault();
      // handleAddEventForm();

      // Concatenate 'event' with the manually entered number to form the complete event ID
      const completeEventID = formData.eventID + formData.eventIDNumber.padStart(3, '0');

      try {
          const response = await axios.post('http://localhost:8080/api/add-event', formData);
          console.log(response.data);
          const successMessage = `Evento agregado exitosamente ${formData.eventName}`;
          setErrorMessage(successMessage);

           navigate('/manager?tab=view-all-events');
      } catch (error) {
      if (error.response && error.response.data) {
        // Handle specific error messages returned from the backend
        if (error.response.data === "Ya existe un evento con el mismo nombre" ||
            error.response.data === "Ya existe un evento con el mismo ID" ||
            error.response.data === "Ya existe un evento el mismo día") {
          setErrorMessage(error.response.data);
        } else {
          // Fallback generic error message if needed
          setErrorMessage('No se pudo agregar el evento. Inténtalo de nuevo más tarde..');
        }
      } else if (error.request) {
        console.log(error.request);
        setErrorMessage('Se produjo un error de red. Vuelva a intentarlo más tarde.r.');
      } else {
        console.log('Error', error.message);
        setErrorMessage('No se pudo agregar el evento. Inténtalo de nuevo más tarde..');
      }
    }
  };
    useEffect(() => {
        setFormData({
            ...formData,
        });

        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
        const dd = String(today.getDate()).padStart(2, '0');
        setMinDate(`${yyyy}-${mm}-${dd}`);
    }, []);

    return (
        <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row w-full '>
             <Link to="/manager?tab=view-all-events">
                <IoChevronBackCircleSharp size={32} className='flex justify-start' />
            </Link>
            <div className='flex-1 flex justify-center'>
                <form className='flex flex-col gap-4 w-full' onSubmit={handleSubmit}>
                    <h1 className='flex justify-center text-3xl font-bold mb-4 '> Agregar nuevo evento</h1> <hr></hr>
                        
                        <div>
                          <Label value='Event ID*' />
                          <TextInput type='text' placeholder='ID del evento' id='EventID' value={formData.eventID} onChange={handleChange} name="eventID" required />
                        </div>

                        <div>
                            <Label value='Event Name*' />
                            <TextInput type='text' placeholder='Nombre' id='EventName' value={formData.eventName} onChange={handleChange} name="eventName" required />
                        </div>

                        <div>
                            <Label value='Event Date*' />
                             <TextInput type='date' placeholder='Fecha' id='EventDate' value={formData.eventDate} onChange={handleChange} name="eventDate" min={minDate} className='text-gray-400' />
                        </div>

                        <div>
                          <Label value='Starting Time*' /> <br />
                          <select
                            className="border rounded-md dark:bg-gray-600 dark:font-white"
                            onChange={(e) => handleChange({ target: { name: 'startTime', value: e.target.value } })}
                          >
                            {Array.from({ length: 24 }, (_, i) => (
                              <option key={i} value={i < 10 ? `0${i}:00` : `${i}:00`}>{i < 10 ? `0${i}:00` : `${i}:00`}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                           <Label value='Duration (Hours)' />
                            <TextInput type='text' placeholder='Duration' id='Duration' value={formData.duration} onChange={handleChange} name="duration" />
                            {durationErrorMessage && <div className="text-red-500">{durationErrorMessage}</div>}
                        </div>
                        <div>
                            <Label value='Entertainer' />
                            <TextInput type='text' placeholder='Entertainer' id='Entertainer' value={formData.entertainer} onChange={handleChange} name="entertainer"/>
                        </div>

                        <div>
                            <Label value='Description' />
                            <TextInput type='text' placeholder='Descripción' id='Description' value={formData.description} onChange={handleChange} name="description"/> 
                        </div>

                      
                        <div>
                            <Label value='Ticket Price (Rs.)' />
                            <div className="flex justify-between">
                             <TextInput type='text' placeholder='Ticket Price' value={formData.ticketPrice} onChange={handleChange} name="ticketPrice" className='mt-2 h-10 w-1/2'/>
                           <button type="button" className="bg-green-500 hover:bg-green-600 text-white font-semibold rounded w-1/2 mt-2 h-10 " onClick={handleShowTicketPriceModal}> Calcular el precio del ticket </button>
                            <GenerateTicketPriceModel show={showTicketPriceModal} onClose={handleCloseTicketPriceModal} onTicketPriceChange={handleTicketPriceChange}/>        
                          </div>
                        </div>
                        
                    <div className="flex justify-between">
                        {/* <button type="reset" className="bg-slate-500 hover:bg-slate-700 text-white font-bold py-2 mr-2 rounded w-full md:w-1/2 " id="clearbtn" onClick={handleClear}> Clear </button> */}
                        <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 ml-2 rounded w-full "> Agregar evento </button>
                    </div>
                    {errorMessage && (
                    <Alert className='mt-5' color='failure'>
                        {errorMessage}
                    </Alert>
                )}
                </form> 
            </div>
        </div>
    );
}


export default AddEvent;
