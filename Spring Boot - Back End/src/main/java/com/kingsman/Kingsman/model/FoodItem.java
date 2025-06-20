package com.kingsman.Kingsman.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "food_item")
public class FoodItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long foodId;

    @Column(nullable = false)     // Details can not be empty
    private String foodName;

    @Column(nullable = false)
    private String foodCategory;

    @Column(nullable = false)
    private double foodPrice;

    @Column(nullable = true)
    private String foodImageURL;

    @Column(nullable = false)
    private boolean available = true;

    public FoodItem(Long foodItemId) {
        foodId = foodItemId;
    }// when you create an instance of FoodItem and pass a foodItemId value, it will assign that value to the foodId

    public FoodItem() {

    }
}
