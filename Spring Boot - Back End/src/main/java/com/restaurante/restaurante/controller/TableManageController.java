package com.restaurante.restaurante.controller;

import com.restaurante.restaurante.model.TableManage;
import com.restaurante.restaurante.service.TableManageService;
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

    @PostMapping("/add")
//add the table data
    ResponseEntity<String> addTable(@RequestBody TableManage table) {
        try {
            table.setDate(new Date());
            tableManageService.addTable(table);
            return ResponseEntity.ok("Mesa agregada exitosamente");
        } catch (DataIntegrityViolationException e) {
            // Manejar el caso donde ya existe una mesa con el mismo tableNumber
            return ResponseEntity.ok("Ya existe una mesa con el mismo número de tabla");
        }
    }

    @GetMapping("/all")
//obtener todos los datos de la mesa
    ResponseEntity<List<TableManage>> getAllTables() {
        List<TableManage> tables = tableManageService.getAllTables();
        return ResponseEntity.ok(tables);
    }

    @DeleteMapping("/delete/{id}")
        // eliminar mesa por ID
    ResponseEntity<String> deleteTableById(@PathVariable Long id) {
        //tableManageService.deleteTableById(id);
        //return ResponseEntity.ok("Mesa eliminada exitosamente");
        try {
            tableManageService.deleteTableById(id);
            return ResponseEntity.ok("Mesa eliminada exitosamente");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al eliminar la mesa");
        }
    }

    @PutMapping("/{id}/availability")
        // Actualizar la disponibilidad de la mesa por ID
    ResponseEntity<String> updateTableAvailability(@PathVariable Long id,
                                                   @RequestParam boolean tableAvailability) {
        try {
            tableManageService.updateTableAvailability(id, tableAvailability);
            return ResponseEntity.ok("Disponibilidad de mesa actualizada con éxito");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    //

    @PutMapping("/by-number/{tableNumber}/availability")
    public ResponseEntity<String> updateTableAvailabilityByNumber(
            @PathVariable int tableNumber,
            @RequestParam boolean availability) {
        try {
            System.out.println("Actualizando mesa #" + tableNumber + " a disponibilidad: " + availability); // Log para debug
            tableManageService.updateTableAvailabilityByNumber(tableNumber, availability);
            return ResponseEntity.ok("Disponibilidad de mesa actualizada con éxito");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/available")
    public ResponseEntity<List<TableManage>> getAvailableTables() {
        return ResponseEntity.ok(tableManageService.getAvailableTables());
    }

}
