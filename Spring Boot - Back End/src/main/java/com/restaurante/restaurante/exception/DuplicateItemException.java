package com.restaurante.restaurante.exception;

public class DuplicateItemException extends RuntimeException {
    public DuplicateItemException(String message) {
        super(message);
    }
}
