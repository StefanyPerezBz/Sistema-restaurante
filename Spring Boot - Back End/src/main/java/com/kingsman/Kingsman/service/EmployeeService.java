package com.kingsman.Kingsman.service;

import com.kingsman.Kingsman.model.Employee;
import com.kingsman.Kingsman.model.InAttendance;
import com.kingsman.Kingsman.repository.EmployeeRepository;
import com.kingsman.Kingsman.repository.InAttendanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class EmployeeService {
    @Autowired
    private EmployeeRepository employeeRepository;

    //

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Employee getEmployeeById(Integer id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado"));
    }

    public Employee updateEmployee(Integer id, Employee employeeUpdates) {
        Employee existingEmployee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado"));

        // Actualizar solo los campos no nulos
        if (employeeUpdates.getFirst_name() != null && !employeeUpdates.getFirst_name().isEmpty()) {
            existingEmployee.setFirst_name(employeeUpdates.getFirst_name().trim());
        }
        if (employeeUpdates.getLast_name() != null && !employeeUpdates.getLast_name().isEmpty()) {
            existingEmployee.setLast_name(employeeUpdates.getLast_name().trim());
        }
        if (employeeUpdates.getEmail() != null) {
            existingEmployee.setEmail(employeeUpdates.getEmail());
        }
        if (employeeUpdates.getContact_number() != null) {
            existingEmployee.setContact_number(employeeUpdates.getContact_number());
        }
        if (employeeUpdates.getAddress() != null) {
            existingEmployee.setAddress(employeeUpdates.getAddress());
        }
        if (employeeUpdates.getGender() != null) {
            existingEmployee.setGender(employeeUpdates.getGender());
        }
        if (employeeUpdates.getUniform_size() != null) {
            existingEmployee.setUniform_size(employeeUpdates.getUniform_size());
        }
        if (employeeUpdates.getEmergency_contact() != null) {
            existingEmployee.setEmergency_contact(employeeUpdates.getEmergency_contact());
        }
        if (employeeUpdates.getPosition() != null) {
            existingEmployee.setPosition(employeeUpdates.getPosition());
        }
        if (employeeUpdates.getProfilePicture() != null) {
            existingEmployee.setProfilePicture(employeeUpdates.getProfilePicture());
        }

        return employeeRepository.save(existingEmployee);
    }


//Absent Employees
    @Autowired
    private InAttendanceRepository inAttendanceRepository;

    public List<Map<String, String>> findEmployeesNotInAttendanceToday() {
        // Get current date
        LocalDate currentDate = LocalDate.now();

        // Fetch all employees
        List<Employee> allEmployees = employeeRepository.findAll();

        // Fetch employees present in InAttendance table for the current date
        List<InAttendance> employeesInAttendance = inAttendanceRepository.findByDate(currentDate);

        // Extract empIds from employeesInAttendance
        List<String> empIdsInAttendance = employeesInAttendance.stream()
                .map(InAttendance::getEmpId)
                .collect(Collectors.toList());

        // Filter out employees whose empIds are not in employeesInAttendance
        List<Employee> employeesNotInAttendance = allEmployees.stream()
                .filter(employee -> !empIdsInAttendance.contains("EMP0" + String.format("%02d", employee.getId())))
                .collect(Collectors.toList());

        // Create a list of maps containing employee id and position
        List<Map<String, String>> employeesWithPositions = employeesNotInAttendance.stream()
                .map(employee -> Map.of("empId", "EMP0" + String.format("%02d", employee.getId()), "position", employee.getPosition()))
                .collect(Collectors.toList());

        return employeesWithPositions;
    }



    public String getEmployeeFirstNameById(Integer id) {
        Employee employee = employeeRepository.findById(id).orElse(null);
        return (employee != null) ? employee.getFirst_name() : null;
    }


    //
    // Metodo para crear nuevo empleado
    public Employee createEmployee(Employee newEmployee) {
        // Validación básica de campos requeridos
        if(newEmployee.getFirst_name() == null || newEmployee.getFirst_name().isEmpty() ||
                newEmployee.getLast_name() == null || newEmployee.getLast_name().isEmpty() ||
                newEmployee.getUsername() == null || newEmployee.getUsername().isEmpty() ||
                newEmployee.getPosition() == null || newEmployee.getPosition().isEmpty()) {
            throw new IllegalArgumentException("Faltan campos requeridos");
        }

        // Encriptar la contraseña antes de guardar
        if(newEmployee.getPassword() != null && !newEmployee.getPassword().isEmpty()) {
            newEmployee.setPassword(passwordEncoder.encode(newEmployee.getPassword()));
        } else {
            // Generar contraseña automática si no se proporciona
            String generatedPassword = generateRandomPassword();
            newEmployee.setPassword(passwordEncoder.encode(generatedPassword));
        }

        // Establecer valores por defecto si no se proporcionan
        //if(newEmployee.getJoined_date() == null) {
            //newEmployee.setJoined_date(LocalDate.now());
        //}
        if (newEmployee.getJoined_date() == null) {
            LocalDate localDate = LocalDate.now();
            Date date = Date.from(localDate.atStartOfDay(ZoneId.systemDefault()).toInstant());
            newEmployee.setJoined_date(date);
        }

        return employeeRepository.save(newEmployee);
    }

    // Metodo auxiliar para generar contraseña aleatoria
    private String generateRandomPassword() {
        String upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        String lower = "abcdefghijklmnopqrstuvwxyz";
        String digits = "0123456789";
        String special = "!@#$%^&*";
        String combination = upper + lower + digits + special;

        Random random = new Random();
        StringBuilder password = new StringBuilder();

        // Aseguramos al menos un carácter de cada tipo
        password.append(upper.charAt(random.nextInt(upper.length())));
        password.append(lower.charAt(random.nextInt(lower.length())));
        password.append(digits.charAt(random.nextInt(digits.length())));
        password.append(special.charAt(random.nextInt(special.length())));

        // Completamos hasta 12 caracteres
        for(int i = 4; i < 12; i++) {
            password.append(combination.charAt(random.nextInt(combination.length())));
        }

        return password.toString();
    }



}
