package com.kingsman.Kingsman.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Getter
@Setter
public class OrderDTO {
    private Long orderId;
    private Long employeeId;
    private String employeeFirstName;
    private String employeeLastName;
    private Long customerId;
    private List<OrderItemDTO> orderItems;
    private Date orderDateTime;
    private String orderStatus;
    private int tableNumber;
    private double subTotal;
    private double discountValue;
    private double discountPercentage;
    private double totalAfterDiscount;
    private String paymentMethod;
    private boolean paymentStatus;
    private Date createdDate;
    private Date updatedDate;
    private String specialNote;
    private CustomerDTO customer;
}
