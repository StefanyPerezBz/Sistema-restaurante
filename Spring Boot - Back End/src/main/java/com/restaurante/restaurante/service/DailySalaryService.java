package com.restaurante.restaurante.service;

import com.restaurante.restaurante.model.Attendance;
import com.restaurante.restaurante.model.DailySalary;
import com.restaurante.restaurante.model.HourPayment;
import com.restaurante.restaurante.repository.AttendanceRepository;
import com.restaurante.restaurante.repository.DailySalaryRepository;
import com.restaurante.restaurante.repository.HourPaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DailySalaryService {

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private HourPaymentRepository hourPaymentRepository;

    @Autowired
    private DailySalaryRepository dailySalaryRepository;

    public DailySalary calculateDailySalary(String employeeId, String date) {
        LocalDate dateObj = LocalDate.parse(date);

        // Verificar si ya existe el registro DailySalary para el empleado en la fecha especificada
        Optional<DailySalary> existingDailySalary = dailySalaryRepository.findByEmpIdAndDate(employeeId, dateObj);
        DailySalary dailySalary = existingDailySalary.orElseGet(DailySalary::new); // Create new if not found

        dailySalary.setEmpId(employeeId);
        dailySalary.setDate(dateObj);

        Attendance attendance = attendanceRepository.findByEmpIdAndDate(employeeId, dateObj);
        if (attendance == null) {
            throw new RuntimeException("No se encontró asistencia para el empleado " + employeeId + " en " + date);
        }

        dailySalary.setEmpName(attendance.getEmpName());

        // Calcular el total de horas trabajadas
        double totalWorkedHours = calculateWorkedHours(attendance.getInTime(), attendance.getOutTime());

        // Limitar el total de horas trabajadas a 13 horas
        double workedHours = Math.min(totalWorkedHours, 13.0);
        dailySalary.setWorkedHours((float) workedHours);

        double overtimeHours = totalWorkedHours > 13 ? totalWorkedHours - 13 : 0;
        dailySalary.setOTHours((float) overtimeHours);

        HourPayment hourPayment = hourPaymentRepository.findByPosition(attendance.getPosition());
        if (hourPayment == null) {
            throw new RuntimeException("No se encontró el pago por hora para el puesto de empleado " + attendance.getPosition());
        }

        dailySalary.setPayPerHours(hourPayment.getPayPerHour());

        double totalHourPayment = dailySalary.getPayPerHours() * dailySalary.getWorkedHours();
        dailySalary.setTotalHourPayment((float) totalHourPayment);

        // Establecer el pago por hora extra independientemente de las horas extras
        dailySalary.setPayPerOvertimeHour(hourPayment.getPayPerOverTimeHour());

        if (overtimeHours > 0) {
            double payPerOvertimeMinute = dailySalary.getPayPerOvertimeHour() / 60.0; // Calcular el pago por minuto de horas extra
            double totalOvertimePayment = payPerOvertimeMinute * overtimeHours * 60; //Multiplicar por minutos de horas extras
            dailySalary.setTotalOvertimePayment((float) totalOvertimePayment);
            dailySalary.setGrossPayment(dailySalary.getTotalHourPayment() + dailySalary.getTotalOvertimePayment());
        } else {
            dailySalary.setTotalOvertimePayment((float) 0); // Establecer en 0 si no hay horas extras
            dailySalary.setGrossPayment(dailySalary.getTotalHourPayment());
        }

        dailySalaryRepository.save(dailySalary);
        return dailySalary;
    }

    public void calculateAndSaveAllEmployeesDailySalary() {
        List<LocalDate> distinctDates = attendanceRepository.findAll()
                .stream()
                .map(Attendance::getDate)
                .distinct()
                .collect(Collectors.toList());

        for (LocalDate date : distinctDates) {
            List<Attendance> attendances = attendanceRepository.findByDate(date);
            for (Attendance attendance : attendances) {
                String employeeId = attendance.getEmpId();
                String dateString = date.toString();
                try {
                    calculateDailySalary(employeeId, dateString);
                } catch (Exception e) {
                    // Manejar la excepción según sea necesario
                    System.out.println("Error al calcular el salario del empleado" + employeeId + " on " + dateString + ": " + e.getMessage());
                }
            }
        }
    }

    public List<DailySalary> getAllEmployeesDailySalaryForCurrentDate() {
        LocalDate currentDate = LocalDate.now();
        return dailySalaryRepository.findByDate(currentDate);
    }

    private double calculateWorkedHours(String inTime, String outTime) {
        LocalTime in = LocalTime.parse(inTime);
        LocalTime out = LocalTime.parse(outTime);

        // Calcular la duración entre el tiempo de entrada y el tiempo de salida
        Duration duration = Duration.between(in, out);

        // Convertir duración a horas
        double hours = duration.toMinutes() / 60.0;

        // Asegúrese de que el resultado no sea negativo
        return hours >= 0 ? hours : 0;
    }
}
