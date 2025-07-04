package com.restaurante.restaurante.controller;

import com.restaurante.restaurante.model.DailySalary;
import com.restaurante.restaurante.service.DailySalaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/salary")
public class DailySalaryController {

    @Autowired
    private DailySalaryService dailySalaryService;

    @GetMapping("/{employeeId}/{date}")
    public ResponseEntity<DailySalary> calculateDailySalary(@PathVariable String employeeId, @PathVariable String date) {
        try {
            DailySalary dailySalary = dailySalaryService.calculateDailySalary(employeeId, date);
            return new ResponseEntity<>(dailySalary, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/currentDateSalaries")
    public ResponseEntity<List<DailySalary>> getAllEmployeesDailySalaryForCurrentDate() {
        try {
            List<DailySalary> dailySalaries = dailySalaryService.getAllEmployeesDailySalaryForCurrentDate();
            return new ResponseEntity<>(dailySalaries, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Punto final para calcular y guardar los salarios diarios de todos los empleados para todas las fechas
    @GetMapping("/calculateAll")
    public ResponseEntity<Void> calculateAllEmployeesDailySalaryForAllDates() {
        try {
            dailySalaryService.calculateAndSaveAllEmployeesDailySalary();
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
