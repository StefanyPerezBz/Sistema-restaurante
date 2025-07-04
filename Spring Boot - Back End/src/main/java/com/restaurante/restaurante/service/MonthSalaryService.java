package com.restaurante.restaurante.service;

import com.restaurante.restaurante.model.MonthSalary;
import com.restaurante.restaurante.model.DailySalary;
import com.restaurante.restaurante.model.Bonus;
import com.restaurante.restaurante.model.Deduction;
import com.restaurante.restaurante.repository.MonthSalaryRepository;
import com.restaurante.restaurante.repository.DailySalaryRepository;
import com.restaurante.restaurante.repository.BonusRepository;
import com.restaurante.restaurante.repository.DeductionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.TextStyle;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.logging.Logger;
import java.util.stream.Collectors;

@Service
public class MonthSalaryService {

    @Autowired
    private MonthSalaryRepository monthSalaryRepository;

    @Autowired
    private DailySalaryRepository dailySalaryRepository;

    @Autowired
    private BonusRepository bonusRepository;

    @Autowired
    private DeductionRepository deductionRepository;

    private static final Logger logger = Logger.getLogger(MonthSalaryService.class.getName());

    public void calculateMonthlySalaries() {
        try {
            YearMonth currentMonth = YearMonth.now();
            LocalDate startOfMonth = currentMonth.atDay(1);
            LocalDate endOfMonth = currentMonth.atEndOfMonth();

            // Fetch all daily salaries for the current month
            List<DailySalary> dailySalaries = dailySalaryRepository.findByDateBetween(startOfMonth, endOfMonth);

            // Group daily salaries by employee name
            Map<String, List<DailySalary>> dailySalariesByEmp = dailySalaries.stream()
                    .collect(Collectors.groupingBy(DailySalary::getEmpName));

            // Fetch all bonuses and deductions
            List<Bonus> bonuses = bonusRepository.findAll();
            Map<String, List<Bonus>> bonusMap = bonuses.stream()
                    .collect(Collectors.groupingBy(Bonus::getEmpName));

            List<Deduction> deductions = deductionRepository.findAll();
            Map<String, List<Deduction>> deductionMap = deductions.stream()
                    .collect(Collectors.groupingBy(Deduction::getEmpName));

            // Calculate monthly salary for each employee
            for (Map.Entry<String, List<DailySalary>> entry : dailySalariesByEmp.entrySet()) {
                String empName = entry.getKey();
                List<DailySalary> empDailySalaries = entry.getValue();

                float totalWorkedHours = 0;
                float totalOTHours = 0;
                float totalHourPayment = 0;
                float totalOvertimePayment = 0;
                Float payPerHours = null;
                Float payPerOvertimeHour = null;

                // Calculate total worked hours, overtime hours, and payments
                for (DailySalary dailySalary : empDailySalaries) {
                    totalWorkedHours += dailySalary.getWorkedHours();
                    totalOTHours += dailySalary.getOTHours();
                    totalHourPayment += dailySalary.getTotalHourPayment();
                    totalOvertimePayment += dailySalary.getTotalOvertimePayment();

                    // Set payPerHours and payPerOvertimeHour from the first record that is not null
                    if (payPerHours == null && dailySalary.getPayPerHours() != null) {
                        payPerHours = dailySalary.getPayPerHours();
                    }
                    if (payPerOvertimeHour == null && dailySalary.getPayPerOvertimeHour() != null) {
                        payPerOvertimeHour = dailySalary.getPayPerOvertimeHour();
                    }
                }

                // Calculate payment without additional (totalHourPayment + totalOvertimePayment)
                float paymentWithoutAdditional = totalHourPayment + totalOvertimePayment;

                // Handle bonus type and deduction type when not present
                String bonusType = bonusMap.containsKey(empName) ? bonusMap.get(empName).get(0).getBonusType() : "No Bonus";
                String deductionType = deductionMap.containsKey(empName) ? deductionMap.get(empName).get(0).getDeductionType() : "No Deduction";

                float bonus = 0f;
                if (bonusMap.containsKey(empName)) {
                    List<Bonus> empBonuses = bonusMap.get(empName);
                    for (Bonus empBonus : empBonuses) {
                        bonus += Float.parseFloat(empBonus.getBonus());
                    }
                }

                float deduction = 0f;
                if (deductionMap.containsKey(empName)) {
                    List<Deduction> empDeductions = deductionMap.get(empName);
                    for (Deduction empDeduction : empDeductions) {
                        deduction += Float.parseFloat(empDeduction.getDeduction());
                    }
                }

                float grossPayment = paymentWithoutAdditional + bonus - deduction;

                // Check if MonthSalary record already exists for this employee and current month
                Optional<MonthSalary> existingMonthSalary = monthSalaryRepository.findByEmpNameAndMonth(empName, currentMonth.getMonth().getDisplayName(TextStyle.FULL, Locale.ENGLISH));

                if (existingMonthSalary.isPresent()) {
                    // Update existing record with new values
                    MonthSalary monthSalary = existingMonthSalary.get();
                    monthSalary.setWorkedHours(totalWorkedHours);
                    monthSalary.setPayPerHours(payPerHours); // Assign the retrieved payPerHours
                    monthSalary.setTotalHourPayment(totalHourPayment);
                    monthSalary.setOTHours(totalOTHours);
                    monthSalary.setPayPerOvertimeHour(payPerOvertimeHour); // Assign the retrieved payPerOvertimeHour
                    monthSalary.setTotalOvertimePayment(totalOvertimePayment);
                    monthSalary.setBonusType(bonusType);
                    monthSalary.setBonus(bonus);
                    monthSalary.setDeductionType(deductionType);
                    monthSalary.setDeduction(deduction);
                    monthSalary.setPaymentWithoutAdditional(paymentWithoutAdditional);
                    monthSalary.setGrossPayment(grossPayment);

                    logger.info("Actualización del salario mensual del empleado: " + empName + ". Pago por hora: " + monthSalary.getPayPerHours());
                    monthSalaryRepository.save(monthSalary);
                } else {
                    // Create new record and save it
                    MonthSalary monthSalary = new MonthSalary();
                    monthSalary.setEmpName(empName);
                    monthSalary.setMonth(currentMonth.getMonth().getDisplayName(TextStyle.FULL, Locale.ENGLISH)); // Set month as month name
                    monthSalary.setWorkedHours(totalWorkedHours);
                    monthSalary.setPayPerHours(payPerHours); // Assign the retrieved payPerHours
                    monthSalary.setTotalHourPayment(totalHourPayment);
                    monthSalary.setOTHours(totalOTHours);
                    monthSalary.setPayPerOvertimeHour(payPerOvertimeHour); // Assign the retrieved payPerOvertimeHour
                    monthSalary.setTotalOvertimePayment(totalOvertimePayment);
                    monthSalary.setBonusType(bonusType);
                    monthSalary.setBonus(bonus);
                    monthSalary.setDeductionType(deductionType);
                    monthSalary.setDeduction(deduction);
                    monthSalary.setPaymentWithoutAdditional(paymentWithoutAdditional);
                    monthSalary.setGrossPayment(grossPayment);

                    logger.info("Ahorro de salario mensual para el empleado: " + empName + ". Pago por hora: " + monthSalary.getPayPerHours());
                    monthSalaryRepository.save(monthSalary);
                }
            }

            logger.info("Salarios mensuales calculados y guardados con éxito.");

        } catch (Exception e) {
            logger.severe("Error al calcular los salarios mensuales: " + e.getMessage());
            e.printStackTrace();
        }
    }

    public List<MonthSalary> getAllMonthSalaries() {
        return monthSalaryRepository.findAll();
    }

    public List<MonthSalary> getThisMonthSalaries() {
        String currentMonth = YearMonth.now().getMonth().getDisplayName(TextStyle.FULL, Locale.ENGLISH);
        return monthSalaryRepository.findByMonth(currentMonth);
    }
 
    public List<MonthSalary> getMonthSalaries(String month) {
        return monthSalaryRepository.findByMonth(month);
    }
 
    public float getTotalGrossPaymentForCurrentMonth() {
        YearMonth currentMonth = YearMonth.now();
        String monthName = currentMonth.getMonth().getDisplayName(TextStyle.FULL, Locale.ENGLISH);

        List<MonthSalary> salaries = monthSalaryRepository.findByMonth(monthName);

        float totalGrossPayment = 0f;
        for (MonthSalary salary : salaries) {
            totalGrossPayment += salary.getGrossPayment();
        }

        return totalGrossPayment;
    }


    public float getTotalGrossPaymentForCurrentYear() {
        int currentYear = YearMonth.now().getYear();

        float totalGrossPayment = 0f;

        // Iterate through each month of the current year
        for (int month = 1; month <= 12; month++) {
            YearMonth yearMonth = YearMonth.of(currentYear, month);
            String monthName = yearMonth.getMonth().getDisplayName(TextStyle.FULL, Locale.ENGLISH);

            List<MonthSalary> salaries = monthSalaryRepository.findByMonth(monthName);

            // Sum up the gross payments for the current month
            for (MonthSalary salary : salaries) {
                totalGrossPayment += salary.getGrossPayment();
            }
        }

        return totalGrossPayment;
 
    }
}
