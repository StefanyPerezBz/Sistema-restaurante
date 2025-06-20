package com.kingsman.Kingsman.exception;

public class UserNotFoundException extends RuntimeException{
    public UserNotFoundException(Long id) {super("No se pudo encontrar el cliente con id"+id);

    }

}
