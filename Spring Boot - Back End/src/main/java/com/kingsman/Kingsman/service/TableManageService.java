package com.kingsman.Kingsman.service;

import com.kingsman.Kingsman.model.TableManage;
import com.kingsman.Kingsman.repository.TableManageRepository;
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
        // Check if the tableNumber is already in use
        if (tableManageRepository.existsByTableNumber(table.getTableNumber())) {
            throw new RuntimeException("Ya existe una mesa con el mismo número de tabla");
        }else {
            // Set the current date
            table.setDate(new Date());
            tableManageRepository.save(table);
        }



    }

    // Method to retrieve all tables
    public List<TableManage> getAllTables() {
        return tableManageRepository.findAll();
    }

    // Method to delete tables by id
    public void deleteTableById(Long id){
        tableManageRepository.deleteById(id);
    }

    // Method to update table availability by ID
    public void updateTableAvailability(Long id, boolean availability) {
        Optional<TableManage> optionalTable = tableManageRepository.findById(id);
        if (optionalTable.isPresent()) {
            TableManage table = optionalTable.get();
            table.setTableAvailability(availability);
            tableManageRepository.save(table);
        } else {
            // Handle the case where the table with the given ID is not found
            throw new RuntimeException("Mesa no encontrada con ID: " + id);
        }
    }

    public List<TableManage> getAvailableTables() {
        return tableManageRepository.findByTableAvailability(true);
    }


}
