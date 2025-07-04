package com.restaurante.restaurante.repository;

import com.restaurante.restaurante.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RegistrationRepository extends JpaRepository<Employee, Integer>{
    Employee findByUsername(String username);
    Employee findByEmail(String email);
    Employee save(Employee employee);
}
