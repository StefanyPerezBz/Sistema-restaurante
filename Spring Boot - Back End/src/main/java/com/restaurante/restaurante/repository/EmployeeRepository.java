package com.restaurante.restaurante.repository;

import com.restaurante.restaurante.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeRepository extends JpaRepository<Employee , Integer> {
 //
 Employee findByEmail(String email);
}
