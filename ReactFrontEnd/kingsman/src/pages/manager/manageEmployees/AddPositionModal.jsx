import React, { useState } from 'react';
import { Button, Modal, TextInput, Label } from 'flowbite-react'; // Import necessary components from your library

const AddPositionModal = ({ isOpen, onClose, onAddPosition }) => {
  const [positionName, setPositionName] = useState('');

  const handleAddPosition = () => {
    if (positionName.trim() === '') return; // Prevent adding empty position

    onAddPosition(positionName); // Pass the new position data back
    setPositionName(''); // Clear input after adding
    onClose(); // Close the modal after submitting
  };

  return (
    <Modal show={isOpen} size="md" onClose={onClose} popup>
      <Modal.Header>
        <h3 className="text-xl font-medium text-gray-900 dark:text-white">Agregar nuevo rol</h3>
      </Modal.Header>
      <Modal.Body>
        <div className="space-y-6">
          <div>
            <div className="mb-2 block">
              <Label htmlFor="positionName" value="Position Name" />
            </div>
            <TextInput
              id="positionName"
              placeholder="Introduzca el nombre del rol"
              value={positionName}
              onChange={(event) => setPositionName(event.target.value)}
              required
            />
          </div>
          <div className="w-full">
            <Button onClick={handleAddPosition} className='bg-green-500 hover:bg-green-600'>Agregar rol</Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default AddPositionModal;
