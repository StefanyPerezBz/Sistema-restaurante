package com.kingsman.Kingsman.controller;

import com.kingsman.Kingsman.model.Employee;

public class EmployeeDTO {
    private String empId;
    private String empName;
    private String position;

    public EmployeeDTO(String empId, String empName, String position) {
        this.empId = empId;
        this.empName = empName;
        this.position = position;
    }

    public String getEmpId() {
        return empId;
    }

    public void setEmpId(String empId) {
        this.empId = empId;
    }

    public String getEmpName() {
        return empName;
    }

    public void setEmpName(String empName) {
        this.empName = empName;
    }

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    public static EmployeeDTO fromEmployee(Employee employee) {
        String empId = "EMP" + String.format("%03d", employee.getId());
        String empName = employee.getFirst_name() + " " + employee.getLast_name();
        return new EmployeeDTO(empId, empName, employee.getPosition());
    }


}

