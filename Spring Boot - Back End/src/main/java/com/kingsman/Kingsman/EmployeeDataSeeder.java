package com.kingsman.Kingsman;

import com.kingsman.Kingsman.model.Employee;
import com.kingsman.Kingsman.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Component
public class EmployeeDataSeeder implements ApplicationListener<ApplicationReadyEvent> {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void onApplicationEvent(ApplicationReadyEvent event) {
        if (employeeRepository.count() == 0) {
            saveDefaultEmployees();
        }
    }

    private void saveDefaultEmployees() {
        List<Employee> employees = new ArrayList<>();

        employees.add(createEmployee("Admin", "User", "admin", "admin123", "manager", "admin@kingsman.com", "555-1001", "123 Admin Street", "M"));
        employees.add(createEmployee("John", "Doe", "cashier", "cashier123", "cashier", "cashier@kingsman.com", "555-1002", "456 Cashier Ave", "M"));
        employees.add(createEmployee("Maria", "Garcia", "chef", "chef123", "chef", "chef@kingsman.com", "555-1003", "789 Chef Road", "F"));
        employees.add(createEmployee("Robert", "Smith", "waiter", "waiter123", "waiter", "waiter@kingsman.com", "555-1004", "321 Waiter Lane", "M"));

        employeeRepository.saveAll(employees);
    }

    private Employee createEmployee(
            String firstName, String lastName, String username, String rawPassword,
            String position, String email, String contactNumber, String address, String gender
    ) {
        Employee employee = new Employee();
        employee.setFirst_name(firstName);
        employee.setLast_name(lastName);
        employee.setUsername(username);
        employee.setPassword(passwordEncoder.encode(rawPassword)); // BCrypt
        employee.setPosition(position);
        employee.setEmail(email);
        employee.setContact_number(contactNumber);
        employee.setAddress(address);
        employee.setGender(gender);
        employee.setUniform_size("M");
        employee.setEmergency_contact("911-0000");
        employee.setProfilePicture(username + ".jpg");
        employee.setIdNumber("EMP" + (int)(Math.random() * 1000));
        employee.setJoined_date(new Date());

        return employee;
    }
}
