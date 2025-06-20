package com.kingsman.Kingsman.controller;

import com.kingsman.Kingsman.model.MonthSalary;
import com.kingsman.Kingsman.service.MonthSalaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/salary")
public class SalaryController {

    @Autowired
    private MonthSalaryService monthSalaryService;

    @PostMapping("/calculateMonthlySalaries")
    public String calculateMonthlySalaries() {
        monthSalaryService.calculateMonthlySalaries();
        return "Monthly salaries calculated and saved successfully.";
    }

    @GetMapping("/getAllMonthSalaries")
    public List<MonthSalary> getAllMonthSalaries() {
        return monthSalaryService.getAllMonthSalaries();
    }

    @GetMapping("/getThisMonthSalaries")
    public List<MonthSalary> getThisMonthSalaries() {
        return monthSalaryService.getThisMonthSalaries();
    }

 
    @GetMapping("/getMonthSalaries/{month}")
    public List<MonthSalary> getMonthSalaries(@PathVariable String month) {
        return monthSalaryService.getMonthSalaries(month);
    }
    @GetMapping("/getTotalGrossPaymentForCurrentMonth")
    public float getTotalGrossPaymentForCurrentMonth() {
        return monthSalaryService.getTotalGrossPaymentForCurrentMonth();
    }

    @GetMapping("/getTotalGrossPaymentForCurrentYear")
    public float getTotalGrossPaymentForCurrentYear() {
        return monthSalaryService.getTotalGrossPaymentForCurrentYear();
 
    }
}
