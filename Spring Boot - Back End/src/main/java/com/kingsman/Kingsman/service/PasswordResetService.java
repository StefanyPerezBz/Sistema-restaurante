package com.kingsman.Kingsman.service;

import com.kingsman.Kingsman.dto.PasswordResetRequest;
import com.kingsman.Kingsman.model.Employee;
import com.kingsman.Kingsman.repository.PasswordResetRepository;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
public class PasswordResetService {
    @Autowired
    private PasswordResetRepository passwordResetRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    private Map<String, String> otpMap = new HashMap<>();

    private String generateOTP() {
        Random random = new Random();
        int otp = 1000 + random.nextInt(9000);
        System.out.println("OTP generada: " + otp);
        return String.valueOf(otp);
    }

    @Transactional
    public boolean initiatePasswordReset(String username) throws MessagingException {
        Employee employee = passwordResetRepository.findByUsername(username);
        if (employee == null) {
            return false;
        }

        String generatedOTP = generateOTP();
        otpMap.put(username, generatedOTP);

        String email = employee.getEmail();
        String subject = "Restablecer contraseña OTP";
        String message = "Su OTP para restablecer la contraseña es: " + generatedOTP;
        emailService.sendEmail(email, subject, message);

        return true;
    }

    public boolean verifyOTP(String username, String enteredOTP) {
        if (enteredOTP == null) {
            return false;
        }

        String storedOTP = otpMap.get(username);
        if (storedOTP == null) {
            return false;
        }

        return storedOTP.equals(enteredOTP);
    }

    @Transactional
    public boolean updatePassword(String username, String newPassword) {
        Employee employee = passwordResetRepository.findByUsername(username);
        if (employee == null) {
            return false;
        }

        // Asegurar que la contraseña se encripta con BCrypt
        //String encodedPassword = passwordEncoder.encode(newPassword);
        //employee.setPassword(encodedPassword);
        employee.setPassword(passwordEncoder.encode(newPassword));
        passwordResetRepository.save(employee);

        // Limpiar el OTP después de usar
        otpMap.remove(username);

        return true;
    }

    public boolean resetPassword(PasswordResetRequest passwordResetRequest) {
        String username = passwordResetRequest.getUsername();
        String newPassword = passwordResetRequest.getNewPassword();
        String confirmPassword = passwordResetRequest.getConfirmPassword();

        if (!newPassword.equals(confirmPassword)) {
            return false;
        }

        return updatePassword(username, newPassword);
    }
}
