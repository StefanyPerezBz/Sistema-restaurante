

import React, { useState, useEffect } from 'react';
import { Modal, Label, TextInput, Button } from 'flowbite-react';
import axios from 'axios';
import GenerateTicketPriceModel from './GenerateTicketPriceModel';
import Swal from 'sweetalert2';
import Select from 'react-select';

const UpdateEventModal = ({ event, handleClose }) => {
  if (!event) {
    return null;
  }

  const [formData, setFormData] = useState({
    eventName: event.eventName || '',
    eventDate: event.eventDate || '',
    startTime: event.startTime || '00:00',
    duration: event.duration || '',
    ticketPrice: event.ticketPrice || '',
    entertainer: event.entertainer || '',
    description: event.description || ''
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

  const [showTicketPriceModal, setShowTicketPriceModal] = useState(false);
  const [minDate, setMinDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Time options for Select2
  const timeOptions = Array.from({ length: 24 }, (_, i) => ({
    value: i < 10 ? `0${i}:00` : `${i}:00`,
    label: i < 10 ? `0${i}:00` : `${i}:00`
  }));

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

  const validateField = async (name, value) => {
    let error = '';

    if (name === 'eventName') {
      if (!value.trim()) {
        error = 'El nombre del evento es obligatorio';
      } else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(value)) {
        error = 'El nombre solo debe contener letras y espacios';
      } else if (/[0-9]/.test(value)) {
        error = 'El nombre no debe contener números';
      } else if (value.length > 50) {
        error = 'El nombre no debe exceder 50 caracteres';
      } else if (value !== event.eventName) {
        try {
          const response = await axios.get(
            `http://localhost:8080/api/events/check-name?name=${encodeURIComponent(value)}`
          );
          if (response.data.exists) {
            error = 'Ya existe un evento con este nombre';
          }
        } catch (error) {
          console.error('Error al verificar el nombre:', error);
        }
      }
    }

    if (name === 'description') {
      if (!value.trim()) {
        error = 'La descripción es obligatoria';
      } else if (value.length > 200) {
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
    setFieldErrors(prev => ({
      ...prev,
      startTime: ''
    }));

    setFormData({
      ...formData,
      startTime: selectedOption.value
    });
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...fieldErrors };

    if (!formData.eventName.trim()) {
      newErrors.eventName = 'El nombre del evento es obligatorio';
      isValid = false;
    }

    if (!formData.eventDate) {
      newErrors.eventDate = 'La fecha del evento es obligatoria';
      isValid = false;
    }

    if (!formData.startTime) {
      newErrors.startTime = 'La hora de inicio es obligatoria';
      isValid = false;
    }

    if (!formData.duration || parseInt(formData.duration) < 1) {
      newErrors.duration = 'La duración es obligatoria y debe ser mínimo 1';
      isValid = false;
    }

    if (!formData.ticketPrice || parseFloat(formData.ticketPrice) <= 0) {
      newErrors.ticketPrice = 'El precio del ticket es obligatorio y debe ser mayor a 0';
      isValid = false;
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es obligatoria';
      isValid = false;
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

    if (!validateForm()) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor complete todos los campos obligatorios y corrija los errores',
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const updatedEvent = {
        ...event,
        eventName: formData.eventName,
        eventDate: formData.eventDate,
        startTime: formData.startTime,
        duration: formData.duration,
        ticketPrice: formData.ticketPrice,
        entertainer: formData.entertainer,
        description: formData.description
      };

      await axios.put(`http://localhost:8080/api/events/update/${event.eventID}`, updatedEvent);

      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: `Evento "${formData.eventName}" actualizado correctamente`,
        confirmButtonText: 'Aceptar'
      }).then(() => {
        handleClose();
        window.location.reload();
      });

    } catch (error) {
      let errorMsg = 'Error al actualizar el evento';

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

  return (
    <Modal show={true} size="md" onClose={handleClose} popup>
      <Modal.Header>
        <h1 className="text-3xl font-bold text-center">Actualizar Evento</h1>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          {/* Event ID - Readonly */}
          <div>
            <Label value='ID del evento' />
            <TextInput
              type='text'
              value={event.eventID}
              readOnly
              disabled
              className="bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Event Name */}
          <div>
            <Label value='Nombre del evento*' />
            <div className="relative">
              <TextInput
                type='text'
                value={formData.eventName}
                onChange={handleChange}
                name="eventName"
                maxLength={50}
                required
              />
              <div className="absolute right-2 bottom-2 text-xs text-gray-500">
                {formData.eventName.length}/50
              </div>
            </div>
            {fieldErrors.eventName && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.eventName}</p>
            )}
          </div>

          {/* Event Date */}
          <div>
            <Label value='Fecha del evento*' />
            <TextInput
              type='date'
              value={formData.eventDate}
              onChange={handleChange}
              name="eventDate"
              min={minDate}
              required
            />
            {fieldErrors.eventDate && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.eventDate}</p>
            )}
          </div>

          {/* Start Time - Using Select2 */}
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
              required
            />
            {fieldErrors.startTime && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.startTime}</p>
            )}
          </div>

          {/* Duration */}
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
            />
            {fieldErrors.duration && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.duration}</p>
            )}
          </div>

          {/* Entertainer */}
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
              />
              <div className="absolute right-2 bottom-2 text-xs text-gray-500">
                {formData.entertainer.length}/50
              </div>
            </div>
            {fieldErrors.entertainer && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.entertainer}</p>
            )}
          </div>

          {/* Description */}
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
              />
              <div className="absolute right-2 bottom-2 text-xs text-gray-500">
                {formData.description.length}/200
              </div>
            </div>
            {fieldErrors.description && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.description}</p>
            )}
          </div>

          {/* Ticket Price */}
          <div>
            <Label value='Precio del ticket (S/.)' />
            <div className="flex gap-2">
              <TextInput
                type='text'
                placeholder='0.00'
                value={formData.ticketPrice}
                onChange={handleChange}
                name="ticketPrice"
                readOnly
                className="flex-1 bg-gray-100"
                required
              />
              <button
                type="button"
                className="bg-green-500 hover:bg-green-600 text-white font-semibold rounded px-4 py-2"
                onClick={handleShowTicketPriceModal}
              >
                Calcular precio
              </button>
            </div>
            {fieldErrors.ticketPrice && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.ticketPrice}</p>
            )}
            <GenerateTicketPriceModel
              show={showTicketPriceModal}
              onClose={handleCloseTicketPriceModal}
              onTicketPriceChange={handleTicketPriceChange}
            />
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer className="flex justify-center">
        <Button
          onClick={handleSubmit}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded w-full md:w-1/2"
          disabled={hasErrors() || isSubmitting}
        >
          {isSubmitting ? 'Actualizando...' : 'Actualizar evento'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UpdateEventModal;