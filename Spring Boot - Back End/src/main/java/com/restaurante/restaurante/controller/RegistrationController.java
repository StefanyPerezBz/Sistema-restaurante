package com.restaurante.restaurante.controller;

import com.restaurante.restaurante.model.Employee;
import com.restaurante.restaurante.repository.RegistrationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
//@CrossOrigin(origins = "http://localhost:3000")
@CrossOrigin(origins = "https://sistema-restaurante-production-896d.up.railway.app/")
public class RegistrationController {
    @Autowired
    private RegistrationRepository registrationRepository;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Employee employee) {
        Employee existingEmployee = registrationRepository.findByUsername(employee.getUsername());
        if (existingEmployee != null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("El nombre de usuario ya existe");
        }

        Employee existingEmployeeEmail = registrationRepository.findByEmail(employee.getEmail());
        if (existingEmployeeEmail != null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("El correo electrónico ya existe");
        }
        System.out.println(employee.getIdNumber());
        registrationRepository.save(employee);

        return ResponseEntity.ok("Empleado registrado exitosamente");
    }
}
