package com.kingsman.Kingsman.service;

import com.kingsman.Kingsman.model.Employee;
import com.kingsman.Kingsman.repository.ManageEmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ManageEmployeeService {
    @Autowired
    private ManageEmployeeRepository manageEmployeeRepository;

    public List<Employee> getAllEmployees() {
        return manageEmployeeRepository.findAll();
    }

    public Employee getEmployeeById(Integer id) {
        return manageEmployeeRepository.findById(id).orElse(null);
    }

    public String updateEmployeeById(Integer id, Employee employee) {
        Employee existingEmployee = manageEmployeeRepository.findById(id).orElse(null);
        if (existingEmployee == null) {
            throw new IllegalArgumentException("El empleado no existe");
        }
        existingEmployee.setUsername(employee.getUsername());
        existingEmployee.setEmail(employee.getEmail());
        existingEmployee.setAddress(employee.getAddress());
        existingEmployee.setContact_number(employee.getContact_number());
        existingEmployee.setPosition(employee.getPosition());
        existingEmployee.setGender(employee.getGender());
        existingEmployee.setUniform_size(employee.getUniform_size());
        existingEmployee.setEmergency_contact(employee.getEmergency_contact());
        manageEmployeeRepository.save(existingEmployee);

        return existingEmployee.getUsername();
    }

    public Set<String> getAllJobPositions() {
        return manageEmployeeRepository.findAll().stream()
                .map(Employee::getPosition)
                .collect(Collectors.toSet());
    }

}
