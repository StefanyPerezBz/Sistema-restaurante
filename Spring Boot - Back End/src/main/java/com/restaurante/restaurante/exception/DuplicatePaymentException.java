package com.restaurante.restaurante.exception;

public class DuplicatePaymentException extends RuntimeException{
    public DuplicatePaymentException(String message) {
        super(message);
    }
}
