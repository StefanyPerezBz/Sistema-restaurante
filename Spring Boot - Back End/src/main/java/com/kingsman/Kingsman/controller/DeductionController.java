package com.kingsman.Kingsman.controller;

import com.kingsman.Kingsman.model.Deduction;
import com.kingsman.Kingsman.service.DeductionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/deduction")
public class DeductionController {

    @Autowired
    private DeductionService deductionService;

    @PostMapping
    public Deduction createDeduction(@RequestBody Deduction deduction) {
        return deductionService.saveDeduction(deduction);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Deduction> updateDeduction(@PathVariable Long id, @RequestBody Deduction updatedDeduction) {
        Optional<Deduction> deduction = deductionService.getDeductionById(id);

        if (deduction.isPresent()) {
            Deduction updated = deductionService.updateDeduction(id, updatedDeduction);
            return new ResponseEntity<>(updated, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteDeduction(@PathVariable Long id) {
        try {
            deductionService.deleteDeduction(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping
    public List<Deduction> getAllDeductions() {
        return deductionService.getAllDeductions();
    }
}
