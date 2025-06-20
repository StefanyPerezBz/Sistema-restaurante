package com.kingsman.Kingsman.controller;

import com.kingsman.Kingsman.model.Employee;
import com.kingsman.Kingsman.model.Event;
import com.kingsman.Kingsman.repository.ManageEmployeeRepository;
import com.kingsman.Kingsman.service.ManageEmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/user")
public class ManageEmployeeController {
    @Autowired
    private ManageEmployeeService manageEmployeeService;

    @Autowired
    private ManageEmployeeRepository manageEmployeeRepository;

    @GetMapping("manage-employees")
    public List<Employee> getAllEmployees() {
        return manageEmployeeService.getAllEmployees();
    }

    @GetMapping("job-roles")
    public ResponseEntity<Set<String>> getAllJobPositions() {
        Set<String> jobPositions = manageEmployeeService.getAllJobPositions();
        return ResponseEntity.ok(jobPositions);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteEmployeeById(@PathVariable Integer id) {
        try {
            Optional<Employee> employeeOptional = manageEmployeeRepository.findById(id); //search employee by id
            if (!employeeOptional.isPresent()) {
                return new ResponseEntity<>("Empleado con identificación " + id + " no encontrado", HttpStatus.NOT_FOUND);
            }

            // Delete the employee
            manageEmployeeRepository.deleteById(id);
            return new ResponseEntity<>("Empleado con identificación " + id + " ha sido eliminado", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("No se pudo eliminar el empleado con identificación " + id, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("getEmployee/{id}")
    public ResponseEntity<?> getEmployeeByEmployeeId(@PathVariable Integer id) {
        try {
            // Delegate retrieval logic to service layer
            Employee employee = manageEmployeeService.getEmployeeById(id);
            return new ResponseEntity<>(employee, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("No se pudo recuperar el empleado: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/updateEmployee/{id}")
    public ResponseEntity<?> updateEmployeeByEmployeeId(@PathVariable Integer id, @RequestBody Employee employee) {
        try {
            // Delegate update logic to service layer
            String updatedEventName = manageEmployeeService.updateEmployeeById(id, employee);
            return new ResponseEntity<>("El empleado ha sido actualizado.", HttpStatus.OK);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>("No se pudo actualizar el empleado: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
