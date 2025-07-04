
import { useState, useEffect } from 'react';
import { Button, Modal, TextInput, Label } from 'flowbite-react';
import Swal from 'sweetalert2';

const AddPositionModal = ({ isOpen, onClose, onAddPosition, existingPositions = [] }) => {
  const [positionName, setPositionName] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Resetear el estado cuando se abre/cierra el modal
  useEffect(() => {
    if (isOpen) {
      setPositionName('');
      setError('');
    }
  }, [isOpen]);

  const handleAddPosition = () => {
    setIsSubmitting(true);
    
    // Validaciones
    const trimmedName = positionName.trim();
    
    if (trimmedName === '') {
      setError('El nombre del rol es requerido');
      showErrorAlert('Por favor ingrese un nombre para el rol');
      setIsSubmitting(false);
      return;
    }

    if (trimmedName.length > 50) {
      setError('El nombre no debe exceder los 50 caracteres');
      showErrorAlert('El nombre del rol no debe exceder los 50 caracteres');
      setIsSubmitting(false);
      return;
    }

    if (/\d/.test(trimmedName)) {
      setError('El nombre no debe contener números');
      showErrorAlert('El nombre del rol no debe contener números');
      setIsSubmitting(false);
      return;
    }

    // Verificar si el rol ya existe (case insensitive)
    const normalizedInput = trimmedName.toLowerCase();
    const alreadyExists = existingPositions.some(
      pos => pos.label.toLowerCase() === normalizedInput || pos.value.toLowerCase() === normalizedInput
    );

    if (alreadyExists) {
      setError('Este rol ya existe');
      showErrorAlert('El rol que intenta agregar ya existe en la lista');
      setIsSubmitting(false);
      return;
    }

    // Si pasa todas las validaciones
    onAddPosition(trimmedName);
    showSuccessAlert('Rol agregado correctamente');
    onClose();
    setIsSubmitting(false);
  };

  const showErrorAlert = (message) => {
    Swal.fire({
      title: 'Error',
      text: message,
      icon: 'error',
      confirmButtonText: 'Entendido',
      confirmButtonColor: '#3085d6'
    });
  };

  const showSuccessAlert = (message) => {
    Swal.fire({
      title: 'Éxito',
      text: message,
      icon: 'success',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#3085d6'
    });
  };

  const handleChange = (e) => {
    const value = e.target.value;
    // Validar que no contenga números mientras se escribe
    if (!/\d/.test(value)) {
      setPositionName(value);
      
      // Limpiar error si estaba presente
      if (error && error !== 'Este rol ya existe') {
        setError('');
      }
    } else {
      setError('El nombre no debe contener números');
    }
  };

  return (
    <Modal show={isOpen} size="md" onClose={onClose} popup>
      <Modal.Header>
        <h3 className="text-xl font-medium text-gray-900">Agregar nuevo rol</h3>
      </Modal.Header>
      <Modal.Body>
        <div className="space-y-6">
          <div>
            <div className="mb-2 flex justify-between items-center">
              <Label htmlFor="positionName" value="Nombre del rol*" />
              <span className="text-sm text-gray-500">{positionName.length}/50</span>
            </div>
            <TextInput
              id="positionName"
              placeholder="Ej: Gerente, Supervisor, etc."
              value={positionName}
              onChange={handleChange}
              maxLength={50}
              required
              color={error ? 'failure' : 'gray'}
              helperText={
                error && <span className="text-red-500 text-sm">{error}</span>
              }
              autoFocus
            />
          </div>
          <div className="w-full">
            <Button 
              onClick={handleAddPosition}
              className="w-full bg-green-500 hover:bg-green-600 focus:ring-green-500"
              disabled={!!error || positionName.trim() === '' || isSubmitting}
              isProcessing={isSubmitting}
            >
              {isSubmitting ? 'Agregando...' : 'Agregar rol'}
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default AddPositionModal;