package com.kingsman.Kingsman.repository;

import jakarta.mail.MessagingException;

public interface EmailRepository {
    void sendEmail(String to, String subject, String message) throws MessagingException;
}
