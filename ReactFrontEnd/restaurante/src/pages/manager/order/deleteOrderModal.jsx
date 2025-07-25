import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button} from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function deleteOrderModal({ isOpen, onToggle, onDelete }) {

    return (
        <Modal show={isOpen} size="md" onClose={onToggle} popup>
            <Modal.Header />
            <Modal.Body>
                <div className="text-center">
                    <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                    <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                        ¿Está seguro de que desea eliminar permanentemente este pedido?
                    </h3>
                    <p className='text-red-400'>Esta acción no se puede revertir.</p>
                    <br/>
                    <div className="flex justify-center gap-4">
                        <Button color="failure" onClick={onDelete}>
                           Si, estoy seguro
                        </Button>
                        <Button color="gray" onClick={onToggle}>
                            No, regresar
                        </Button>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    )
}

deleteOrderModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
};
