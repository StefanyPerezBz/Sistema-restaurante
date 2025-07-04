import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Button } from "flowbite-react";

function EditModal({ isOpen, onClose, onSubmit, selectedAttendance }) {
  const [inTime, setInTime] = useState('');
  const [outTime, setOutTime] = useState('');

  useEffect(() => {
    if (selectedAttendance) {
      setInTime(selectedAttendance.inTime || '');
      setOutTime(selectedAttendance.outTime || '');
    }
  }, [isOpen, selectedAttendance]);

  const formatTimeForDisplay = (time) => {
    if (!time) return 'No registrado';
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  const validateTime = (time, isInTime) => {
    if (!time) return false;
    
    const [hours, minutes] = time.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;
    
    if (isInTime) {
      // Entrada válida entre 7:00 AM (420 min) y 9:00 AM (540 min)
      return totalMinutes >= 420 && totalMinutes <= 540;
    } else {
      // Salida válida entre 3:00 PM (900 min) y 10:00 PM (1320 min)
      // (considerando 8 horas desde la entrada)
      return totalMinutes >= 900 && totalMinutes <= 1320;
    }
  };

  const validateWorkHours = (inTime, outTime) => {
    if (!inTime || !outTime) return true;
    
    const [inHours, inMinutes] = inTime.split(':').map(Number);
    const [outHours, outMinutes] = outTime.split(':').map(Number);
    
    const inTotal = inHours * 60 + inMinutes;
    const outTotal = outHours * 60 + outMinutes;
    
    const workMinutes = outTotal - inTotal;
    
    // Validar que sea al menos 8 horas (480 minutos)
    return workMinutes >= 480;
  };

  const handleSubmit = () => {
    // Validar horarios
    if (inTime && !validateTime(inTime, true)) {
      Swal.fire({
        title: 'Horario inválido',
        text: 'La hora de entrada debe estar entre 7:00 AM y 9:00 AM',
        icon: 'error',
        confirmButtonText: 'Entendido'
      });
      return;
    }

    if (outTime && !validateTime(outTime, false)) {
      Swal.fire({
        title: 'Horario inválido',
        text: 'La hora de salida debe estar entre 3:00 PM y 10:00 PM',
        icon: 'error',
        confirmButtonText: 'Entendido'
      });
      return;
    }

    if (!validateWorkHours(inTime, outTime)) {
      Swal.fire({
        title: 'Jornada incompleta',
        text: 'Debe haber al menos 8 horas entre la entrada y la salida',
        icon: 'error',
        confirmButtonText: 'Entendido'
      });
      return;
    }

    const formData = {
      empId: selectedAttendance ? selectedAttendance.empId : '',
      date: selectedAttendance ? selectedAttendance.date : '',
      inTime: inTime,
      outTime: outTime
    };

    // Mostrar confirmación con SweetAlert
    Swal.fire({
      title: 'Confirmar cambios',
      html: `
        <div class="text-left">
          <p><strong>ID Empleado:</strong> ${formData.empId}</p>
          <p><strong>Fecha:</strong> ${formData.date}</p>
          <p><strong>Nueva Entrada:</strong> ${formatTimeForDisplay(formData.inTime)}</p>
          <p><strong>Nueva Salida:</strong> ${formatTimeForDisplay(formData.outTime)}</p>
          ${formData.inTime && formData.outTime ? 
            `<p><strong>Duración:</strong> ${calculateDuration(formData.inTime, formData.outTime)}</p>` : ''}
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        onSubmit(formData);
        Swal.fire(
          '¡Actualizado!',
          'Los cambios se han guardado correctamente.',
          'success'
        );
        onClose();
      }
    });
  };

  const calculateDuration = (start, end) => {
    const [startHours, startMinutes] = start.split(':').map(Number);
    const [endHours, endMinutes] = end.split(':').map(Number);
    
    const startTotal = startHours * 60 + startMinutes;
    const endTotal = endHours * 60 + endMinutes;
    
    const durationMinutes = endTotal - startTotal;
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    
    return `${hours}h ${minutes}m`;
  };

  const showEditModal = () => {
    Swal.fire({
      title: 'Editar Asistencia',
      html: `
        <div class="text-left">
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2">ID Empleado</label>
            <input 
              id="swal-empId" 
              class="swal2-input" 
              value="${selectedAttendance ? selectedAttendance.empId : ''}" 
              disabled
            >
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2">Fecha</label>
            <input 
              id="swal-date" 
              class="swal2-input" 
              value="${selectedAttendance ? selectedAttendance.date : ''}" 
              disabled
            >
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2">Hora de Entrada (7AM - 9AM)</label>
            <input 
              id="swal-inTime" 
              type="time" 
              class="swal2-input" 
              value="${inTime}" 
              step="300"  <!-- 5 minute steps -->
            >
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2">Hora de Salida (3PM - 10PM)</label>
            <input 
              id="swal-outTime" 
              type="time" 
              class="swal2-input" 
              value="${outTime}" 
              step="300"  <!-- 5 minute steps -->
            >
          </div>
          ${inTime && outTime ? `
            <div class="mt-4 p-2 bg-gray-100 rounded">
              <p class="text-sm"><strong>Duración:</strong> ${calculateDuration(inTime, outTime)}</p>
            </div>
          ` : ''}
        </div>
      `,
      focusConfirm: false,
      preConfirm: () => {
        return {
          inTime: document.getElementById('swal-inTime').value,
          outTime: document.getElementById('swal-outTime').value
        };
      },
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      didOpen: () => {
        // Actualizar la duración cuando cambien los tiempos
        const updateDuration = () => {
          const inTimeVal = document.getElementById('swal-inTime').value;
          const outTimeVal = document.getElementById('swal-outTime').value;
          
          if (inTimeVal && outTimeVal) {
            const durationElement = document.createElement('div');
            durationElement.className = 'mt-4 p-2 bg-gray-100 rounded';
            durationElement.innerHTML = `<p class="text-sm"><strong>Duración:</strong> ${calculateDuration(inTimeVal, outTimeVal)}</p>`;
            
            const existingDuration = document.querySelector('.swal2-html-container .bg-gray-100');
            if (existingDuration) {
              existingDuration.replaceWith(durationElement);
            } else {
              document.querySelector('.swal2-html-container').appendChild(durationElement);
            }
          }
        };

        document.getElementById('swal-inTime').addEventListener('change', (e) => {
          if (e.target.value && !validateTime(e.target.value, true)) {
            Swal.showValidationMessage('Entrada debe ser entre 7:00 AM y 9:00 AM');
          } else {
            Swal.resetValidationMessage();
            updateDuration();
          }
        });

        document.getElementById('swal-outTime').addEventListener('change', (e) => {
          if (e.target.value && !validateTime(e.target.value, false)) {
            Swal.showValidationMessage('Salida debe ser entre 3:00 PM y 10:00 PM');
          } else if (inTime && e.target.value && !validateWorkHours(inTime, e.target.value)) {
            Swal.showValidationMessage('Debe haber al menos 8 horas entre entrada y salida');
          } else {
            Swal.resetValidationMessage();
            updateDuration();
          }
        });
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const { inTime: newInTime, outTime: newOutTime } = result.value;
        
        // Validación final por si acaso
        if (newInTime && !validateTime(newInTime, true)) {
          Swal.fire({
            title: 'Error',
            text: 'La hora de entrada debe estar entre 7:00 AM y 9:00 AM',
            icon: 'error'
          });
          return;
        }

        if (newOutTime && !validateTime(newOutTime, false)) {
          Swal.fire({
            title: 'Error',
            text: 'La hora de salida debe estar entre 3:00 PM y 10:00 PM',
            icon: 'error'
          });
          return;
        }

        if (!validateWorkHours(newInTime, newOutTime)) {
          Swal.fire({
            title: 'Error',
            text: 'Debe haber al menos 8 horas entre la entrada y la salida',
            icon: 'error'
          });
          return;
        }

        const formData = {
          empId: selectedAttendance ? selectedAttendance.empId : '',
          date: selectedAttendance ? selectedAttendance.date : '',
          inTime: newInTime,
          outTime: newOutTime
        };

        onSubmit(formData);
        Swal.fire(
          '¡Actualizado!',
          'Los cambios se han guardado correctamente.',
          'success'
        );
        onClose();
      }
    });
  };

  // Mostrar el modal automáticamente cuando isOpen cambia a true
  useEffect(() => {
    if (isOpen) {
      showEditModal();
    }
  }, [isOpen]);

  // No renderizamos nada ya que SweetAlert maneja el modal
  return null;
}

export default EditModal;