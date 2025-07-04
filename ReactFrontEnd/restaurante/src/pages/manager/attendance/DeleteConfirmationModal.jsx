 

import { Button, Modal } from "flowbite-react";
import { useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export function DeleteConfirmationModal({ show, onClose, onConfirm }) {
  return (
    <Modal show={show} size="md" onClose={onClose} popup>
      <Modal.Header> </Modal.Header>
      <Modal.Body>
        <div className="text-center">
          <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
          <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
            ¿Está seguro de que desea eliminar este registro de asistencia?
          </h3>
          <div className="flex justify-center gap-4">
            <Button color="failure" onClick={onConfirm}>
              {"Si, estoy seguro"}
            </Button>
            <Button color="gray" onClick={onClose}>
              No, cancelar
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
