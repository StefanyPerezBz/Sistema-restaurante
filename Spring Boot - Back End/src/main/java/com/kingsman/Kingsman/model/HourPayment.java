package com.kingsman.Kingsman.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;


@Entity
public class HourPayment {
    @GeneratedValue
    @Id
    private Long id;
    @Column(unique = true) // Ensure position is unique
    private String position;
    private Float payPerHour;
    private Float payPerOverTimeHour;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    public Float getPayPerHour() {
        return payPerHour;
    }

    public void setPayPerHour(Float payPerHour) {
        this.payPerHour = payPerHour;
    }

    public Float getPayPerOverTimeHour() {
        return payPerOverTimeHour;
    }

    public void setPayPerOverTimeHour(Float payPerOverTimeHour) {
        this.payPerOverTimeHour = payPerOverTimeHour;
    }
}
