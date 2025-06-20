
// import { Button, Modal } from "flowbite-react";
// import { useState } from "react";
// import { HiOutlineExclamationCircle } from "react-icons/hi";

// function DeleteInventoryItem({ itemName, onConfirm, onCancel }) {
//   const [openModal, setOpenModal] = useState(true);

//   const confirmDelete = () => {
//     onConfirm();
//     setOpenModal(false);
//   };
//   const cancelDelete = () => {
//     onCancel();
//     setOpenModal(false);
//   };
    

//   return (
//     <>
//       {/* <Button onClick={() => setOpenModal(true)}>Toggle modal</Button> */}
//       <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
//         <Modal.Header />
//         <Modal.Body>
//           <div className="text-center">
//             <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
//             <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
//               ¿Estás seguro de que quieres eliminar {'"'+itemName+'"'}?
//             </h3>
//             <div className="flex justify-center gap-4">
//               <Button color="failure" onClick={confirmDelete}>
//                 {"Si, estoy seguro"}
//               </Button>
//               <Button color="gray" onClick={cancelDelete}>
//                 No, cancelar
//               </Button>
//             </div>
//           </div>
//         </Modal.Body>
//       </Modal>
//     </>
//   );
// }
// export default DeleteInventoryItem;

// src/components/inventory/DeleteInventoryItem.jsx

import { useEffect } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

function DeleteInventoryItem({ itemName, onConfirm, onCancel }) {
  useEffect(() => {
    const handleDelete = async () => {
      const result = await MySwal.fire({
        title: '¿Estás seguro?',
        html: `¿Realmente deseas eliminar <strong>"${itemName}"</strong>?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#6b7280', // Gris
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        background: '#fff',
        color: '#1f2937'
      });

      if (result.isConfirmed) {
        onConfirm();
        await MySwal.fire({
          title: 'Eliminado',
          text: `"${itemName}" ha sido eliminado correctamente.`,
          icon: 'success',
          confirmButtonColor: '#16a34a',
          background: '#fff',
          color: '#1f2937'
        });
      } else {
        if (onCancel) onCancel();
      }
    };

    handleDelete();
  }, [itemName, onConfirm, onCancel]);

  return null; // No renderiza nada, solo lanza la alerta
}

export default DeleteInventoryItem;
