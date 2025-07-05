

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Checkbox } from "flowbite-react";
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function AbsentiesModal({ onClose, reloadAttendance }) {
  const [absentees, setAbsentees] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentDate = new Date().toLocaleDateString('es-ES');
  const currentDateForFilename = new Date().toISOString().split('T')[0];

  // Función para traducir los cargos al español
  const translatePosition = (position) => {
    const translations = {
      'manager': 'Gerente',
      'cashier': 'Cajero',
      'waiter': 'Mesero',
      'chef': 'Chef',
      'default': position
    };
    return translations[position] || translations['default'];
  };

  useEffect(() => {
    fetchAbsentees();
  }, []);

  const fetchAbsentees = () => {
    axios.get(`${import.meta.env.REACT_APP_API_URL}/employeeDetails`)
      .then(response => {
        const employees = response.data.map(employee => ({
          empId: employee[0],
          empName: employee[1],
          position: translatePosition(employee[2]), // Traducir el cargo aquí
          selected: false
        }));
        setAbsentees(employees);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching absentees:', error);
        setLoading(false);
        showErrorAlert('Error al cargar empleados', 'No se pudieron cargar los datos de los empleados');
      });
  };

  const handleSelectEmployee = (empId) => {
    setAbsentees(prev => prev.map(emp => 
      emp.empId === empId ? { ...emp, selected: !emp.selected } : emp
    ));
  };

  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    setAbsentees(prev => prev.map(emp => ({ ...emp, selected: isChecked })));
  };

  const showErrorAlert = (title, text) => {
    Swal.fire({
      title,
      text,
      icon: 'error',
      confirmButtonText: 'Entendido',
      customClass: {
        container: 'responsive-swal',
        confirmButton: 'swal-confirm-button'
      }
    });
  };

  const showSuccessAlert = (title, text) => {
    Swal.fire({
      title,
      text,
      icon: 'success',
      confirmButtonText: 'Aceptar',
      customClass: {
        container: 'responsive-swal',
        confirmButton: 'swal-confirm-button'
      }
    });
  };

  const markSelectedAttendance = () => {
    const selected = absentees.filter(emp => emp.selected);
    
    if (selected.length === 0) {
      showErrorAlert('Ningún empleado seleccionado', 'Por favor selecciona al menos un empleado para marcar como ausente');
      return;
    }

    Swal.fire({
      title: 'Confirmar marcación',
      html: `¿Deseas marcar <strong>${selected.length}</strong> empleado(s) como ausente(s) para la fecha <strong>${currentDate}</strong>?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, marcar',
      cancelButtonText: 'Cancelar',
      customClass: {
        container: 'responsive-swal',
        popup: 'responsive-swal-popup',
        title: 'responsive-swal-title',
        htmlContainer: 'responsive-swal-html',
        confirmButton: 'swal-confirm-button',
        cancelButton: 'swal-cancel-button'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const attendanceData = selected.map(employee => ({
          empId: employee.empId,
          empName: employee.empName,
          date: new Date().toISOString().split('T')[0],
          position: employee.position, // Ya está traducido
          inTime: "Ausente",
          outTime: "Ausente"
        }));

        axios.post(`${import.meta.env.REACT_APP_API_URL}/attendances`, attendanceData)
          .then(response => {
            showSuccessAlert('Marcación exitosa', `Se marcaron ${selected.length} empleado(s) como ausente(s) correctamente`);
            onClose();
            reloadAttendance();
          })
          .catch(error => {
            console.error('Error al marcar la asistencia:', error);
            showErrorAlert('Error', 'Ocurrió un error al marcar los ausentes');
          });
      }
    });
  };

  const handleExportPDF = () => {
    const selected = absentees.filter(emp => emp.selected);
    const totalEmployees = absentees.length;

    if (selected.length === 0) {
      Swal.fire({
        title: 'Exportar a PDF',
        html: `No has seleccionado empleados. ¿Deseas exportar <strong>todos</strong> los empleados (${totalEmployees})?`,
        icon: 'question',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Exportar todos',
        denyButtonText: 'Seleccionar algunos',
        cancelButtonText: 'Cancelar',
        customClass: {
          container: 'responsive-swal',
          popup: 'responsive-swal-popup',
          title: 'responsive-swal-title',
          htmlContainer: 'responsive-swal-html',
          confirmButton: 'swal-confirm-button',
          denyButton: 'swal-deny-button',
          cancelButton: 'swal-cancel-button'
        }
      }).then((result) => {
        if (result.isConfirmed) {
          generatePDF(absentees, 'todos');
        }
      });
    } else {
      Swal.fire({
        title: 'Exportar a PDF',
        html: `¿Deseas exportar los <strong>${selected.length}</strong> empleado(s) seleccionado(s)?`,
        icon: 'question',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: `Exportar (${selected.length})`,
        denyButtonText: 'Exportar todos',
        cancelButtonText: 'Cancelar',
        customClass: {
          container: 'responsive-swal',
          popup: 'responsive-swal-popup',
          title: 'responsive-swal-title',
          htmlContainer: 'responsive-swal-html',
          confirmButton: 'swal-confirm-button',
          denyButton: 'swal-deny-button',
          cancelButton: 'swal-cancel-button'
        }
      }).then((result) => {
        if (result.isConfirmed) {
          generatePDF(selected, 'seleccionados');
        } else if (result.isDenied) {
          generatePDF(absentees, 'todos');
        }
      });
    }
  };

  const generatePDF = (employees, type) => {
    const doc = new jsPDF();
    const title = `Reporte de Empleados Ausentes - ${currentDate}`;
    const subtitle = `Total: ${employees.length} empleado(s) ${type}`;
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text(title, 14, 15);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(subtitle, 14, 22);

    const tableData = employees.map((emp, index) => [
      index + 1,
      emp.empId,
      emp.empName,
      emp.position, // Ya está traducido
      "Ausente"
    ]);

    doc.autoTable({
      head: [['#', 'ID', 'Nombre Completo', 'Cargo', 'Estado']],
      body: tableData,
      startY: 30,
      margin: { top: 30 },
      styles: {
        fontSize: 10,
        cellPadding: 3,
        valign: 'middle',
        halign: 'center',
        font: 'helvetica'
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 11
      },
      bodyStyles: {
        textColor: [50, 50, 50]
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240]
      },
      columnStyles: {
        0: { cellWidth: 10, halign: 'center' },
        1: { cellWidth: 25, halign: 'center' },
        2: { cellWidth: 60, halign: 'left' },
        3: { cellWidth: 50, halign: 'left' },
        4: { cellWidth: 25, halign: 'center', fontStyle: 'bold', textColor: [255, 0, 0] }
      }
    });

    doc.save(`Reporte_Ausentes_${type}_${currentDateForFilename}.pdf`);
    showSuccessAlert('PDF Generado', `Se exportaron ${employees.length} empleado(s) ${type} correctamente`);
  };

  const selectedCount = absentees.filter(emp => emp.selected).length;
  const allSelected = absentees.length > 0 && absentees.every(emp => emp.selected);

  return (
    <div className="p-4">
      <div className='flex flex-wrap justify-between gap-2 mb-4'>
        <Button 
          color="gray" 
          pill 
          onClick={handleExportPDF}
          className="min-w-[200px]"
        >
          <span className="mr-2">📄</span>
          Exportar PDF ({selectedCount > 0 ? `${selectedCount} seleccionados` : 'todos'})
        </Button>
        <Button 
          color="blue" 
          pill 
          onClick={markSelectedAttendance}
          className="min-w-[200px]"
          disabled={selectedCount === 0}
        >
          <span className="mr-2">✓</span>
          Marcar Ausentes ({selectedCount})
        </Button>
      </div>
      
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
          <p>Cargando lista de empleados...</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table hoverable className='shadow-lg border'>
            <Table.Head className="bg-gray-100">
              <Table.HeadCell className="w-10">
                <Checkbox 
                  checked={allSelected}
                  onChange={handleSelectAll}
                  className="focus:ring-blue-500 h-4 w-4"
                />
              </Table.HeadCell>
              <Table.HeadCell className="w-20">ID</Table.HeadCell>
              <Table.HeadCell>Nombre del Empleado</Table.HeadCell>
              <Table.HeadCell>Cargo</Table.HeadCell>
              <Table.HeadCell className="w-32">Estado</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {absentees.map((absentee, index) => (
                <Table.Row key={index} className="bg-white hover:bg-gray-50">
                  <Table.Cell>
                    <Checkbox 
                      checked={absentee.selected}
                      onChange={() => handleSelectEmployee(absentee.empId)}
                      className="focus:ring-blue-500 h-4 w-4"
                    />
                  </Table.Cell>
                  <Table.Cell className="font-medium text-gray-900">
                    {absentee.empId}
                  </Table.Cell>
                  <Table.Cell>{absentee.empName}</Table.Cell>
                  <Table.Cell>{absentee.position}</Table.Cell>
                  <Table.Cell className="font-semibold text-red-600">Ausente</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      )}
      
      <style jsx global>{`
        @media (max-width: 768px) {
          .responsive-swal-popup {
            width: 90% !important;
            max-width: 400px !important;
            font-size: 0.9rem !important;
          }
          .responsive-swal-title {
            font-size: 1.2rem !important;
          }
          .responsive-swal-html {
            font-size: 0.9rem !important;
            line-height: 1.4 !important;
          }
          .swal-confirm-button, .swal-deny-button, .swal-cancel-button {
            padding: 0.5rem 1rem !important;
            font-size: 0.9rem !important;
            margin: 0.25rem !important;
          }
        }
        
        .swal-confirm-button {
          background-color: #3085d6 !important;
        }
        
        .swal-deny-button {
          background-color: #6c757d !important;
        }
        
        .swal-cancel-button {
          background-color: #d33 !important;
        }
      `}</style>
    </div>
  );
}

export default AbsentiesModal;