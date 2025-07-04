
import { Button, Modal } from "flowbite-react";
import { useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";

function DeleteFoodItem({ foodName, onDelete, onCancel }) {
  const [openModal, setOpenModal] = useState(true);

  const confirmDelete = () => {
    onDelete();
    setOpenModal(false);
  };
  const cancelDelete = () => {
    onCancel();
    setOpenModal(false);
  };
    

  return (
    <>
      {/* <Button onClick={() => setOpenModal(true)}>Toggle modal</Button> */}
      <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
             ¿Estás seguro de que quieres eliminar {'"'+foodName+'"'}?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={confirmDelete}>
                {"Si, estoy seguro"}
              </Button>
              <Button color="gray" onClick={cancelDelete}>
                No, cancelar
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
export default DeleteFoodItem;
