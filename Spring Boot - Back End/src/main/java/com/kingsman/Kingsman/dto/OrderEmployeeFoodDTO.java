package com.kingsman.Kingsman.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderEmployeeFoodDTO {
    private Long orderId;
    private int tableNumber;
    private String foodName;
    private String firstName; //employee first name
    private String orderStatus;
    private String cusName;
    private String specialNote;

    public OrderEmployeeFoodDTO(Long orderId, int tableNumber, String foodName, String firstName, String orderStatus, String cusName, String specialNote) {
        this.orderId = orderId;
        this.tableNumber = tableNumber;
        this.foodName = foodName;
        this.firstName = firstName;
        this.orderStatus = orderStatus;
        this.cusName = cusName;
        this.specialNote = specialNote;
    }

}

