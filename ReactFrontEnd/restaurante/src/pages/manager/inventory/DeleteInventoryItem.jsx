

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
