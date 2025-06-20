package com.kingsman.Kingsman.exception;


public class CustomerDuplicateMobileNumberException extends RuntimeException {
    public CustomerDuplicateMobileNumberException(String message) {
        super(message);
    }
}