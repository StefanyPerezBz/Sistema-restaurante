package com.kingsman.Kingsman.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

import java.time.LocalDate;

@Entity
public class Event {
    @Id
    private String eventID;
    private String eventName;
    private LocalDate eventDate;
    private String startTime;
    private String duration;
    private float budget;
    private float ticketPrice;
    private String entertainer;
    private Integer soldTicketQuantity;
    private String description;
    private String eventStatus;

    public String getEventID() {
        return eventID;
    }

    public void setEventID(String eventID) {
        this.eventID = eventID;
    }

    public String getEventName() {
        return eventName;
    }

    public void setEventName(String eventName) {
        this.eventName = eventName;
    }

    public LocalDate getEventDate() {
        return eventDate;
    }

    public void setEventDate(LocalDate eventDate) {
        this.eventDate = eventDate;
    }

    public String getStartTime() {
        return startTime;
    }

    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String eventDuration) {
        this.duration = eventDuration;
    }

    public float getBudget() {
        return budget;
    }

    public void setBudget(float budget) {
        this.budget = budget;
    }

    public float getTicketPrice() {
        return ticketPrice;
    }

    public void setTicketPrice(float ticketPrice) {
        this.ticketPrice = ticketPrice;
    }

    public String getEntertainer() {
        return entertainer;
    }

    public void setEntertainer(String entertainer) {
        this.entertainer = entertainer;
    }
    public Integer getSoldTicketQuantity() {
        return soldTicketQuantity;
    }

    public void setSoldTicketQuantity(Integer capacity) {
        this.soldTicketQuantity = capacity;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getEventStatus() {
        return eventStatus;
    }

    public void setEventStatus(String eventStatus) {
        this.eventStatus = eventStatus;
    }
}
