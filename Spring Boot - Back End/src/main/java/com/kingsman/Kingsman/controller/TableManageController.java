package com.kingsman.Kingsman.controller;

import com.kingsman.Kingsman.model.TableManage;
import com.kingsman.Kingsman.service.TableManageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@CrossOrigin("http://localhost:3000/")
@RequestMapping("/api/table")
public class TableManageController {
    @Autowired
    TableManageService tableManageService;

    @PostMapping("/add")//add the table data
    ResponseEntity<String> addTable(@RequestBody TableManage table){
        try {
            table.setDate(new Date());
            tableManageService.addTable(table);
            return ResponseEntity.ok("Mesa agregada exitosamente");
        } catch (DataIntegrityViolationException e) {
            // Manejar el caso donde ya existe una mesa con el mismo tableNumber
            return ResponseEntity.ok("Ya existe una mesa con el mismo número de tabla");
        }
    }

    @GetMapping("/all")//obtener todos los datos de la mesa
    ResponseEntity<List<TableManage>> getAllTables() {
        List<TableManage> tables = tableManageService.getAllTables();
        return ResponseEntity.ok(tables);
    }

    @DeleteMapping("/delete/{id}") // eliminar mesa por ID
    ResponseEntity<String> deleteTableById(@PathVariable Long id) {
        tableManageService.deleteTableById(id);
        return ResponseEntity.ok("Mesa eliminada exitosamente");
    }

    @PutMapping("/{id}/availability") // Actualizar la disponibilidad de la mesa por ID
    ResponseEntity<String> updateTableAvailability(@PathVariable Long id, @RequestParam boolean availability) {
        tableManageService.updateTableAvailability(id, availability);
        return ResponseEntity.ok("Disponibilidad de mesa actualizada con éxito");
    }

    @GetMapping("/available") // Obtener mesas disponibles
    ResponseEntity<List<TableManage>> getAvailableTables() {
        List<TableManage> availableTables = tableManageService.getAvailableTables();
        return ResponseEntity.ok(availableTables);
    }


}
