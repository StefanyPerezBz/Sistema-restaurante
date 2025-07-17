package com.restaurante.restaurante.controller;

import com.restaurante.restaurante.model.Employee;
import com.restaurante.restaurante.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
//@CrossOrigin(origins = "http://localhost:3000")
@CrossOrigin(origins = "https://sistema-restaurante-production-896d.up.railway.app/")
@RequestMapping("/api/employees")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    //
    @PostMapping("/create")
    public Employee createEmployee(@RequestBody Employee newEmployee) {
        return employeeService.createEmployee(newEmployee);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Employee> updateEmployee(
            @PathVariable Integer id,
            @RequestBody Employee employeeUpdates) {

        Employee updatedEmployee = employeeService.updateEmployee(id, employeeUpdates);
        return ResponseEntity.ok(updatedEmployee);
    }

    //Absent Employees

    @GetMapping("/not-in-attendance-today")
    public List<Map<String, String>> getEmployeesNotInAttendanceToday() {
        return employeeService.findEmployeesNotInAttendanceToday();
    }

}



