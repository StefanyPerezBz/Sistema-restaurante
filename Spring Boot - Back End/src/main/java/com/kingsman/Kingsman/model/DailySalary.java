package com.kingsman.Kingsman.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

import java.time.LocalDate;

@Entity
public class DailySalary {

    @Id
    @GeneratedValue
    private Long id;
    private String empId;
    private String EmpName;
    private LocalDate date;
    private Float workedHours;
    private Float payPerHours;
    private Float totalHourPayment;
    private Float OTHours;
    private Float payPerOvertimeHour;
    private Float totalOvertimePayment;
    private Float grossPayment;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmpId() {
        return empId;
    }

    public void setEmpId(String empId) {
        this.empId = empId;
    }

    public String getEmpName() {
        return EmpName;
    }

    public void setEmpName(String empName) {
        EmpName = empName;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Float getWorkedHours() {
        return workedHours;
    }

    public void setWorkedHours(Float workedHours) {
        this.workedHours = workedHours;
    }

    public Float getPayPerHours() {
        return payPerHours;
    }

    public void setPayPerHours(Float payPerHours) {
        this.payPerHours = payPerHours;
    }

    public Float getTotalHourPayment() {
        return totalHourPayment;
    }

    public void setTotalHourPayment(Float totalHourPayment) {
        this.totalHourPayment = totalHourPayment;
    }

    public Float getOTHours() {
        return OTHours;
    }

    public void setOTHours(Float OTHours) {
        this.OTHours = OTHours;
    }

    public Float getPayPerOvertimeHour() {
        return payPerOvertimeHour;
    }

    public void setPayPerOvertimeHour(Float payPerOvertimeHour) {
        this.payPerOvertimeHour = payPerOvertimeHour;
    }

    public Float getTotalOvertimePayment() {
        return totalOvertimePayment;
    }

    public void setTotalOvertimePayment(Float totalOvertimePayment) {
        this.totalOvertimePayment = totalOvertimePayment;
    }

    public Float getGrossPayment() {
        return grossPayment;
    }

    public void setGrossPayment(Float grossPayment) {
        this.grossPayment = grossPayment;
    }
}
