package com.kingsman.Kingsman.controller;

public class DeleteAttendanceRequest {
    private String empId;
    private String date;

    public String getEmpId() {
        return empId;
    }

    public void setEmpId(String empId) {
        this.empId = empId;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }
}
