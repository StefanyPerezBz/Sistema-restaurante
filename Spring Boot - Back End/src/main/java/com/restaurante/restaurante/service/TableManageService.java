package com.restaurante.restaurante.service;

import com.restaurante.restaurante.model.TableManage;
import com.restaurante.restaurante.repository.TableManageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class TableManageService {
    @Autowired
    TableManageRepository tableManageRepository;

    public void addTable(TableManage table){
        // Comprueba si el tableNumber ya está en uso
        if (tableManageRepository.existsByTableNumber(table.getTableNumber())) {
            throw new RuntimeException("Ya existe una mesa con el mismo número de tabla");
        }else {
            // establecer la fecha actual
            //table.setDate(new Date());
            table.setDate(new Date());
            table.setTableAvailability(true); // Por defecto disponible al crear
            tableManageRepository.save(table);
        }
    }

    // Metodo para recuperar todas las mesas
    public List<TableManage> getAllTables() {
        return tableManageRepository.findAll();
    }

    // Metodo para eliminar mesas por id
    public void deleteTableById(Long id){
        tableManageRepository.deleteById(id);
    }

    // Metodo para actualizar la disponibilidad de la mesa por ID
    public void updateTableAvailability(Long id, boolean availability) {
        Optional<TableManage> optionalTable = tableManageRepository.findById(id);
        if (optionalTable.isPresent()) {
            TableManage table = optionalTable.get();
            table.setTableAvailability(availability);
            tableManageRepository.save(table);
        } else {
            // Manejar el caso donde no se encuentra la tabla con el ID dado
            throw new RuntimeException("Mesa no encontrada con ID: " + id);
        }
    }

    public List<TableManage> getAvailableTables() {
        return tableManageRepository.findByTableAvailability(true);
    }

    //
    public TableManage getTableById(Long id) {
        return tableManageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Mesa no encontrada con ID: " + id));
    }

    //
    public void updateTableAvailabilityByNumber(int tableNumber, boolean availability) {
        TableManage table = tableManageRepository.findByTableNumber(tableNumber);
        if (table != null) {
            table.setTableAvailability(availability);
            tableManageRepository.save(table);
        } else {
            throw new RuntimeException("Mesa no encontrada con número: " + tableNumber);
        }
    }

    public TableManage getTableByNumber(int tableNumber) {
        return tableManageRepository.findByTableNumber(tableNumber);
    }

}
