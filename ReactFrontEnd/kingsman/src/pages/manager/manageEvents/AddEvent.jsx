// import React, { useEffect, useState } from 'react';
// import { Alert, Label, TextInput } from 'flowbite-react';
// import { useNavigate, Link } from 'react-router-dom';
// import axios from 'axios';
// import GenerateTicketPriceModel from './GenerateTicketPriceModel';
// import { IoChevronBackCircleSharp } from "react-icons/io5";

// const AddEvent = () => {
//   const [formData, setFormData] = useState({
//     eventID: 'evento',
//     eventIDNumber: '',
//     eventName: '',
//     eventDate: '',
//     startTime: '',
//     duration: '',
//     ticketPrice: '',
//     entertainer: '',
//     description: '',
//   });
//   const [errorMessage, setErrorMessage] = useState('');
//   const navigate = useNavigate();
//   const [durationErrorMessage, setDurationErrorMessage] = useState('');
//   const [ticketPriceErrorMessage, setTicketPriceErrorMessage] = useState('');
//   const [showTicketPriceModal, setShowTicketPriceModal] = useState(false);
//   const [minDate, setMinDate] = useState('');

//   const handleShowTicketPriceModal = () => {
//     setShowTicketPriceModal(true);
//   };

//   const handleCloseTicketPriceModal = () => {
//     setShowTicketPriceModal(false);
//   };

//   const handleTicketPriceChange = (price) => {
//     setFormData({
//       ...formData,
//       ticketPrice: price,
//     });
//   };


//   const handleChange = (e) => {
//     console.log(e.target.value);  
//     const { name, value } = e.target;
//     let errorMessage = '';

//     if (name === 'eventID') {
//       // Extract the number part of the eventID entered by the user
//       const eventIDNumber = value.replace(/\D/g, '');
//       // Update the eventID in the formData by concatenating the 'event' part and the user-entered number part
//       setFormData({
//         ...formData,
//         eventID: `event${eventIDNumber.padStart(3, '0')}`, // Concatenate 'event' with the updated number part
//       });
//     } 


//     if (name === 'ticketPrice'){
//       if (value !== '' && !/^\d+(\.\d{1,2})?$/.test(value)) {
//         setTicketPriceErrorMessage('El precio del ticket debe ser un número válido con hasta dos decimales.');
//       }else{
//         setTicketPriceErrorMessage('');
//       }
//     }else if (name === 'duration'){
//       if (value !== '' && !/^\d+(\.\d{1,2})?$/.test(value)) {
//         setDurationErrorMessage('La duración debe ser un número válido con hasta dos decimales.');
//       }else{
//         setDurationErrorMessage('');
//       }
//     }

//     // For the time selects
//     if (name === 'startTime') {
//       // Split the selected time into hours and minutes
//       const [selectedHour, selectedMinute] = formData.startTime.split(':');
//       const selectedTime = value.replace(/^:/, '');
//       setFormData({
//         ...formData,
//         startTime: selectedTime,
//       });
//     } else{
//       setFormData({
//         ...formData,
//         [name]: value,
//       });
//       setErrorMessage(errorMessage); 
//     };
//   };


//     const handleSubmit = async (e) => {
//       e.preventDefault();
//       // handleAddEventForm();

//       // Concatenate 'event' with the manually entered number to form the complete event ID
//       const completeEventID = formData.eventID + formData.eventIDNumber.padStart(3, '0');

//       try {
//           const response = await axios.post('http://localhost:8080/api/add-event', formData);
//           console.log(response.data);
//           const successMessage = `Evento agregado exitosamente ${formData.eventName}`;
//           setErrorMessage(successMessage);

//            navigate('/manager?tab=view-all-events');
//       } catch (error) {
//       if (error.response && error.response.data) {
//         // Handle specific error messages returned from the backend
//         if (error.response.data === "Ya existe un evento con el mismo nombre" ||
//             error.response.data === "Ya existe un evento con el mismo ID" ||
//             error.response.data === "Ya existe un evento el mismo día") {
//           setErrorMessage(error.response.data);
//         } else {
//           // Fallback generic error message if needed
//           setErrorMessage('No se pudo agregar el evento. Inténtalo de nuevo más tarde..');
//         }
//       } else if (error.request) {
//         console.log(error.request);
//         setErrorMessage('Se produjo un error de red. Vuelva a intentarlo más tarde.r.');
//       } else {
//         console.log('Error', error.message);
//         setErrorMessage('No se pudo agregar el evento. Inténtalo de nuevo más tarde..');
//       }
//     }
//   };
//     useEffect(() => {
//         setFormData({
//             ...formData,
//         });

//         const today = new Date();
//         const yyyy = today.getFullYear();
//         const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
//         const dd = String(today.getDate()).padStart(2, '0');
//         setMinDate(`${yyyy}-${mm}-${dd}`);
//     }, []);

//     return (
//         <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row w-full '>
//              <Link to="/manager?tab=view-all-events">
//                 <IoChevronBackCircleSharp size={32} className='flex justify-start' />
//             </Link>
//             <div className='flex-1 flex justify-center'>
//                 <form className='flex flex-col gap-4 w-full' onSubmit={handleSubmit}>
//                     <h1 className='flex justify-center text-3xl font-bold mb-4 '> Agregar nuevo evento</h1> <hr></hr>

//                         <div>
//                           <Label value='ID del evento*' />
//                           <TextInput type='text' placeholder='ID del evento' id='EventID' value={formData.eventID} onChange={handleChange} name="eventID" required />
//                         </div>

//                         <div>
//                             <Label value='Nombre*' />
//                             <TextInput type='text' placeholder='Nombre' id='EventName' value={formData.eventName} onChange={handleChange} name="eventName" required />
//                         </div>

//                         <div>
//                             <Label value='Fecha*' />
//                              <TextInput type='date' placeholder='Fecha' id='EventDate' value={formData.eventDate} onChange={handleChange} name="eventDate" min={minDate} className='text-gray-400' />
//                         </div>

//                         <div>
//                           <Label value='Hora de inicio*' /> <br />
//                           <select
//                             className="border rounded-md dark:bg-gray-600 dark:font-white"
//                             onChange={(e) => handleChange({ target: { name: 'startTime', value: e.target.value } })}
//                           >
//                             {Array.from({ length: 24 }, (_, i) => (
//                               <option key={i} value={i < 10 ? `0${i}:00` : `${i}:00`}>{i < 10 ? `0${i}:00` : `${i}:00`}</option>
//                             ))}
//                           </select>
//                         </div>

//                         <div>
//                            <Label value='Duración (Horas)' />
//                             <TextInput type='text' placeholder='Duración' id='Duration' value={formData.duration} onChange={handleChange} name="duration" />
//                             {durationErrorMessage && <div className="text-red-500">{durationErrorMessage}</div>}
//                         </div>
//                         <div>
//                             <Label value='Artista o Invitado' />
//                             <TextInput type='text' placeholder='Ingresar Artista o invitado' id='Entertainer' value={formData.entertainer} onChange={handleChange} name="entertainer"/>
//                         </div>

//                         <div>
//                             <Label value='Descripción' />
//                             <TextInput type='text' placeholder='Descripción' id='Description' value={formData.description} onChange={handleChange} name="description"/> 
//                         </div>


//                         <div>
//                             <Label value='Precio del ticket (S/.)' />
//                             <div className="flex justify-between">
//                              <TextInput type='text' placeholder='Ingresar precio' value={formData.ticketPrice} onChange={handleChange} name="ticketPrice" className='mt-2 h-10 w-1/2'/>
//                            <button type="button" className="bg-green-500 hover:bg-green-600 text-white font-semibold rounded w-1/2 mt-2 h-10 " onClick={handleShowTicketPriceModal}> Calcular el precio del ticket </button>
//                             <GenerateTicketPriceModel show={showTicketPriceModal} onClose={handleCloseTicketPriceModal} onTicketPriceChange={handleTicketPriceChange}/>        
//                           </div>
//                         </div>

//                     <div className="flex justify-between">
//                         {/* <button type="reset" className="bg-slate-500 hover:bg-slate-700 text-white font-bold py-2 mr-2 rounded w-full md:w-1/2 " id="clearbtn" onClick={handleClear}> Clear </button> */}
//                         <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 ml-2 rounded w-full "> Agregar evento </button>
//                     </div>
//                     {errorMessage && (
//                     <Alert className='mt-5' color='failure'>
//                         {errorMessage}
//                     </Alert>
//                 )}
//                 </form> 
//             </div>
//         </div>
//     );
// }


// export default AddEvent;

import React, { useEffect, useState } from 'react';
import { Alert, Label, TextInput } from 'flowbite-react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import GenerateTicketPriceModel from './GenerateTicketPriceModel';
import { IoChevronBackCircleSharp } from "react-icons/io5";
import Swal from 'sweetalert2';
import Select from 'react-select';

const AddEvent = () => {
  const [formData, setFormData] = useState({
    eventID: `event${Math.floor(100 + Math.random() * 900)}`,
    eventName: '',
    eventDate: '',
    startTime: '00:00',
    duration: '',
    ticketPrice: '',
    entertainer: '',
    description: '',
  });

  const [fieldErrors, setFieldErrors] = useState({
    eventName: '',
    entertainer: '',
    description: '',
    duration: '',
    ticketPrice: '',
    eventDate: '',
    startTime: '',
  });

  const [isCheckingName, setIsCheckingName] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const [showTicketPriceModal, setShowTicketPriceModal] = useState(false);
  const [minDate, setMinDate] = useState('');

  // Time options for Select
  const timeOptions = Array.from({ length: 24 }, (_, i) => ({
    value: i < 10 ? `0${i}:00` : `${i}:00`,
    label: i < 10 ? `0${i}:00` : `${i}:00`
  }));

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat('es-PE', {
      timeZone: 'America/Lima',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    const formattedDate = formatter.format(new Date());
    setMinDate(formattedDate);
  }, []);

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
    setFieldErrors(prev => ({
      ...prev,
      ticketPrice: ''
    }));
  };

  const checkEventNameExists = async (name) => {
    try {
      setIsCheckingName(true);
      const response = await axios.get(
        `http://localhost:8080/api/events/check-name?name=${encodeURIComponent(name)}`
      );
      return response.data.exists;
    } catch (error) {
      console.error('Error al verificar el nombre:', error);
      return false;
    } finally {
      setIsCheckingName(false);
    }
  };

  const validateField = async (name, value) => {
    let error = '';

    if (name === 'eventName') {
      if (!value.trim()) {
        error = 'El nombre del evento es obligatorio';
      } else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(value)) {
        error = 'El nombre solo debe contener letras y espacios';
      } else if (value.length > 50) {
        error = 'El nombre no debe exceder 50 caracteres';
      } else {
        try {
          const exists = await checkEventNameExists(value);
          if (exists) {
            error = 'Ya existe un evento con este nombre';
          }
        } catch (error) {
          console.error('Error al verificar el nombre:', error);
        }
      }
    }


    if (name === 'entertainer') {
      if (value && /[0-9]/.test(value)) {
        error = 'El artista no debe contener números';
      } else if (value.length > 50) {
        error = 'El artista no debe exceder 50 caracteres';
      } else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(value)) {
        error = 'El nombre del artista solo debe contener letras y espacios';
      }
    }

    if (name === 'description') {
      if (value.length > 200) {
        error = 'La descripción no debe exceder 200 caracteres';
      }
    }

    if (name === 'duration') {
      if (!value.trim()) {
        error = 'La duración es obligatoria';
      } else if (!/^\d+$/.test(value)) {
        error = 'La duración debe ser un número entero';
      } else if (parseInt(value) < 1) {
        error = 'La duración debe ser mínimo 1';
      }
    }

    if (name === 'ticketPrice') {
      if (value && (!/^\d+(\.\d)?$/.test(value) || parseFloat(value) <= 0)) {
        error = 'El precio debe ser un número mayor a 0 con como máximo un decimal';
      }
    }


    if (name === 'eventDate') {
      if (!value) {
        error = 'La fecha es obligatoria';
      } else {
        const selectedDate = new Date(value);
        const formatter = new Intl.DateTimeFormat('es-PE', {
          timeZone: 'America/Lima',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        });

        const limaTodayString = formatter.format(new Date());
        const limaToday = new Date(limaTodayString);

        selectedDate.setHours(0, 0, 0, 0);
        limaToday.setHours(0, 0, 0, 0);

        if (selectedDate < limaToday) {
          error = 'No se pueden seleccionar fechas pasadas';
        }
      }
    }

    return error;
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;

    const error = await validateField(name, value);

    setFieldErrors(prev => ({
      ...prev,
      [name]: error
    }));

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleTimeChange = (selectedOption) => {
    setFormData({
      ...formData,
      startTime: selectedOption.value
    });
    setFieldErrors(prev => ({
      ...prev,
      startTime: ''
    }));
  };

  const validateForm = async () => {
    let isValid = true;
    const newErrors = { ...fieldErrors };

   const requiredFields = ['eventName', 'eventDate', 'startTime', 'duration', 'ticketPrice', 'description'];
    for (const field of requiredFields) {
      if (!formData[field]) {
        newErrors[field] = 'Este campo es obligatorio';
        isValid = false;
      }
    }

    for (const [name, value] of Object.entries(formData)) {
      const error = await validateField(name, value);
      if (error) {
        newErrors[name] = error;
        isValid = false;
      }
    }

    setFieldErrors(newErrors);
    return isValid;
  };

  const hasErrors = () => {
    return Object.values(fieldErrors).some(error => error !== '') ||
      !formData.eventName ||
      !formData.eventDate ||
      !formData.startTime;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!await validateForm()) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor complete todos los campos obligatorios y corrija los errores',
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/api/add-event', formData);

      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: `Evento "${formData.eventName}" agregado correctamente`,
        confirmButtonText: 'Aceptar'
      }).then(() => {
        navigate('/manager?tab=view-all-events');
      });

    } catch (error) {
      let errorMsg = 'Error al agregar el evento';

      if (error.response) {
        if (error.response.data === "Ya existe un evento con el mismo nombre") {
          errorMsg = 'Ya existe un evento con ese nombre';
          setFieldErrors(prev => ({
            ...prev,
            eventName: errorMsg
          }));
        } else if (error.response.data === "Ya existe un evento el mismo día") {
          errorMsg = 'Ya existe un evento programado para esa fecha';
          setFieldErrors(prev => ({
            ...prev,
            eventDate: errorMsg
          }));
        }
      }

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMsg,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row w-full'>
      <Link to="/manager?tab=view-all-events" className="mb-4">
        <IoChevronBackCircleSharp size={32} />
      </Link>

      <div className='flex-1 flex justify-center'>
        <form className='flex flex-col gap-4 w-full' onSubmit={handleSubmit}>
          <h1 className='flex justify-center text-3xl font-bold mb-4'>Agregar nuevo evento</h1>
          <hr />

          <div>
            <Label value='ID del evento' />
            <TextInput
              type='text'
              value={formData.eventID}
              readOnly
              disabled
              className="bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div>
            <Label value='Nombre del evento*' />
            <div className="relative">
              <TextInput
                type='text'
                placeholder='Nombre del evento'
                value={formData.eventName}
                onChange={handleChange}
                name="eventName"
                maxLength={50}
                required
                color={fieldErrors.eventName ? 'failure' : ''}
                helperText={fieldErrors.eventName && <span className="text-red-500">{fieldErrors.eventName}</span>}
              />
              <div className="absolute right-2 bottom-2 text-xs text-gray-500">
                {formData.eventName.length}/50
              </div>
            </div>
            {isCheckingName && (
              <span className="text-blue-500 text-sm">Verificando nombre...</span>
            )}
          </div>

          <div>
            <Label value='Fecha del evento*' />
            <TextInput
              type='date'
              value={formData.eventDate}
              onChange={handleChange}
              name="eventDate"
              min={minDate}
              required
              color={fieldErrors.eventDate ? 'failure' : ''}
              helperText={fieldErrors.eventDate && <span className="text-red-500">{fieldErrors.eventDate}</span>}
            />
          </div>

          <div>
            <Label value='Hora de inicio*' />
            <Select
              options={timeOptions}
              value={timeOptions.find(option => option.value === formData.startTime)}
              onChange={handleTimeChange}
              placeholder="Seleccione hora"
              className="basic-single"
              classNamePrefix="select"
              isSearchable
              styles={{
                control: (provided, state) => ({
                  ...provided,
                  backgroundColor: '#f9fafb',
                  borderColor: fieldErrors.startTime ? '#ef4444' : state.isFocused ? '#3b82f6' : '#d1d5db',
                  boxShadow: state.isFocused ? '0 0 0 1px #3b82f6' : 'none',
                  '&:hover': {
                    borderColor: fieldErrors.startTime ? '#ef4444' : '#9ca3af'
                  },
                  minHeight: '42px'
                }),
                option: (provided, state) => ({
                  ...provided,
                  backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#e5e7eb' : 'white',
                  color: state.isSelected ? 'white' : '#1f2937',
                })
              }}
            />
            {fieldErrors.startTime && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.startTime}</p>
            )}
          </div>

          <div>
            <Label value='Duración (horas)' />
            <TextInput
              type='number'
              placeholder='Ejemplo: 2'
              value={formData.duration}
              onChange={handleChange}
              name="duration"
              min="1"
              step="1"
              required
              color={fieldErrors.duration ? 'failure' : ''}
              helperText={fieldErrors.duration && <span className="text-red-500">{fieldErrors.duration}</span>}
            />
          </div>

          <div>
            <Label value='Artista o invitado' />
            <div className="relative">
              <TextInput
                type='text'
                placeholder='Nombre del artista o invitado'
                value={formData.entertainer}
                onChange={handleChange}
                name="entertainer"
                maxLength={50}
                color={fieldErrors.entertainer ? 'failure' : ''}
                helperText={fieldErrors.entertainer && <span className="text-red-500">{fieldErrors.entertainer}</span>}
              />
              <div className="absolute right-2 bottom-2 text-xs text-gray-500">
                {formData.entertainer.length}/50
              </div>
            </div>
          </div>

          <div>
            <Label value='Descripción' />
            <div className="relative">
              <TextInput
                type='text'
                placeholder='Descripción del evento'
                value={formData.description}
                onChange={handleChange}
                name="description"
                maxLength={200}
                required
                color={fieldErrors.description ? 'failure' : ''}
                helperText={fieldErrors.description && <span className="text-red-500">{fieldErrors.description}</span>}
              />
              <div className="absolute right-2 bottom-2 text-xs text-gray-500">
                {formData.description.length}/200
              </div>
            </div>
          </div>

          <div>
            <Label value='Precio del ticket (S/.)' />
            <div className="flex gap-2">
              <TextInput
                type='text'
                placeholder='0.0'
                value={formData.ticketPrice}
                onChange={handleChange}
                name="ticketPrice"
                readOnly
                className="flex-1 bg-gray-100"
                required
                color={fieldErrors.ticketPrice ? 'failure' : ''}
                helperText={fieldErrors.ticketPrice && <span className="text-red-500">{fieldErrors.ticketPrice}</span>}
              />
              <button
                type="button"
                className="bg-green-500 hover:bg-green-600 text-white font-semibold rounded px-4 py-2"
                onClick={handleShowTicketPriceModal}
              >
                Calcular precio
              </button>
            </div>
            <GenerateTicketPriceModel
              show={showTicketPriceModal}
              onClose={handleCloseTicketPriceModal}
              onTicketPriceChange={handleTicketPriceChange}
            />
          </div>

          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className={`${hasErrors() || isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                } text-white font-bold py-3 px-6 rounded w-full md:w-1/2`}

              disabled={hasErrors() || isSubmitting}
            >
              {isSubmitting ? 'Agregando...' : 'Agregar evento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddEvent;