package com.restaurante.restaurante.controller;

import com.restaurante.restaurante.model.Employee;
import com.restaurante.restaurante.repository.LoginRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;


import java.util.Map;



@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/user")
public class LoginController {
    @Autowired
    private LoginRepository loginRepository; // Corrected variable name

    //
    @Autowired
    private PasswordEncoder passwordEncoder;


    //@PostMapping("/login")
    //public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        //String username = credentials.get("username");
        //String password = credentials.get("password");

        //Employee emplogin= loginRepository.findByUsernameAndPassword(username, password);

        //if (emplogin != null) {
            //return ResponseEntity.ok(emplogin); // Return the whole Employee object
        //} else {
            //return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Nombre de usuario o contraseña no válidos");
        //}
    //}

    //
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String rawPassword = credentials.get("password");

        // Buscar solo por username
        Employee emplogin = loginRepository.findByUsername(username);

        // Verificar si existe y la contraseña coincide
        if (emplogin != null && passwordEncoder.matches(rawPassword, emplogin.getPassword())) {
            return ResponseEntity.ok(emplogin);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Nombre de usuario o contraseña no válidos");
        }
    }


//    @GetMapping("/userdetails")
//    public ResponseEntity<?> getUserDetails(@RequestParam String username, @RequestParam String password) {
//        Employee empLogin = loginRepository.findByUsernameAndPassword(username, password);
//
//        if (empLogin != null) {
//            // You can return the entire user object or specific user details here
//            return ResponseEntity.ok(empLogin);
//        } else {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
//        }
//    }



}
