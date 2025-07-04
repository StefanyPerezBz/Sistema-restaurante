package com.restaurante.restaurante.exception;

public class UserNotFoundException extends RuntimeException{
    public UserNotFoundException(Long id) {super("No se pudo encontrar el cliente con id"+id);

    }

}
