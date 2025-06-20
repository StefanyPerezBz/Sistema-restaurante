package com.kingsman.Kingsman.controller;

import com.kingsman.Kingsman.dto.PasswordResetRequest;
import com.kingsman.Kingsman.dto.VerifyOTP;
import com.kingsman.Kingsman.service.PasswordResetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class PasswordResetController {
    @Autowired
    private PasswordResetService passwordResetService;

    @PostMapping("/reset-password-request")
    public ResponseEntity<String> requestPasswordReset(@RequestBody PasswordResetRequest passwordResetRequest) {
        try {
            boolean success = passwordResetService.initiatePasswordReset(passwordResetRequest.getUsername());
            if (success) {
                return ResponseEntity.ok("Se ha enviado una contraseña de un solo uso a tu correo electrónico. Revisa tu bandeja de entrada..");
            } else {
                return ResponseEntity.badRequest().body("Nombre de usuario no encontrado.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Se produjo un error: " + e.getMessage());
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOTP(@RequestBody VerifyOTP verifyOTP) {
        try {
            boolean success = passwordResetService.verifyOTP(verifyOTP.getUsername(), verifyOTP.getOtp());
            if (success) {
                return ResponseEntity.ok("OTP verificado exitosamente.");
            } else {
                return ResponseEntity.badRequest().body("OTP no válido.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Se produjo un error: " + e.getMessage());
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, Object>> resetPassword(@RequestBody PasswordResetRequest passwordResetRequest) {
        try {
            boolean success = passwordResetService.resetPassword(passwordResetRequest);
            if (success) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Contraseña actualizada correctamente");
                return ResponseEntity.ok(response);
            } else {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Las contraseñas no coinciden");
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error al restablecer la contraseña: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
