package com.restaurante.restaurante.exception;


public class CustomerDuplicateMobileNumberException extends RuntimeException {
    public CustomerDuplicateMobileNumberException(String message) {
        super(message);
    }
}