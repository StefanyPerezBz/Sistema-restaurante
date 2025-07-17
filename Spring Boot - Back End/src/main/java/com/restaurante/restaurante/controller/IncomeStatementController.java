package com.restaurante.restaurante.controller;

import com.restaurante.restaurante.model.AnnualIncomeStatement;
import com.restaurante.restaurante.model.MonthlyIncomeStatement;
import com.restaurante.restaurante.service.IncomeStatementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
//@CrossOrigin(origins = "http://localhost:3000")
@CrossOrigin(origins = "https://sistema-restaurante-production-896d.up.railway.app/")
@RequestMapping("/api/income")
public class IncomeStatementController {
    @Autowired
    private IncomeStatementService incomeStatementService;

    // Guardar los datos del estado de resultados mensual en la base de datos
    @PostMapping("/save-monthly")
    public ResponseEntity<MonthlyIncomeStatement> saveMonthlyIncomeStatement(@RequestBody MonthlyIncomeStatement statement) {
        MonthlyIncomeStatement savedStatement = incomeStatementService.saveMonthlyIncomeStatement(statement);
        return new ResponseEntity<>(savedStatement, HttpStatus.CREATED);
    }

    // Guardar los datos del estado de resultados anual en la base de datos
    @PostMapping("/save-annual")
    public ResponseEntity<AnnualIncomeStatement> saveAnnualIncomeStatement(@RequestBody AnnualIncomeStatement statement) {
        try {
            System.out.println("Estado de resultados anual recibido:");
            System.out.println("Año: " + statement.getYear());
            System.out.println("Beneficio neto: " + statement.getNetProfit());
            System.out.println("Ingresos totales: " + statement.getTotalIncome());
            System.out.println("Gastos Totales: " + statement.getTotalExpenses());

            AnnualIncomeStatement savedStatement = incomeStatementService.saveAnnualIncomeStatement(statement);
            return new ResponseEntity<>(savedStatement, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // obtener datos del año anterior
    @GetMapping("/previous-year/{year}")
    public ResponseEntity<AnnualIncomeStatement> getAnnualIncomeStatementByYear(@PathVariable int year) {
        Optional<AnnualIncomeStatement> statement = incomeStatementService.getPreviousAnnualIncomeStatementByYear(year);
        return statement.map(ResponseEntity::ok).orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // obtener datos del mes anterior
    @GetMapping("/previous-month/{month}")
    public ResponseEntity<MonthlyIncomeStatement> getPreviousMonthIncomeStatement() {
        Optional<MonthlyIncomeStatement> statement = incomeStatementService.getPreviousMonthIncomeStatement();
        return statement.map(ResponseEntity::ok).orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

}
