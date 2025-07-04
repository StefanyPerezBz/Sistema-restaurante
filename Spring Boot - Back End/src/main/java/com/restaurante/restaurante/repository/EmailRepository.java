package com.restaurante.restaurante.repository;

import jakarta.mail.MessagingException;

public interface EmailRepository {
    void sendEmail(String to, String subject, String message) throws MessagingException;
}
