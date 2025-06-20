package com.kingsman.Kingsman.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderItemDTO {
    private Long orderItemId;
    private Long foodItemId;
    private String foodItemName;
    private int quantity;
    private double foodPrice;
}
