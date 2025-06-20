package com.kingsman.Kingsman.controller;

public class AttendanceRequest {
    private String empId;
    private String date;
    private String empName;
    private String inTime;
    private String outTime;
    private String position;
    private String status;

    public String getEmpId() {
        return empId;
    }

    public String getDate() {
        return date;
    }

    public String getInTime() {
        return inTime;
    }

    public String getOutTime() {
        return outTime;
    }

    public void setEmpId(String empId) {
        this.empId = empId;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public void setInTime(String inTime) {
        this.inTime = inTime;
    }

    public void setOutTime(String outTime) {
        this.outTime = outTime;
    }

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
