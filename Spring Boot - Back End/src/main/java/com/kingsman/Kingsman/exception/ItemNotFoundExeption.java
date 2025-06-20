package com.kingsman.Kingsman.exception;

public class ItemNotFoundExeption extends RuntimeException{

    public ItemNotFoundExeption(long itemId) {
        super("Artículo no encontrado con Id: "+ itemId);
    }
}