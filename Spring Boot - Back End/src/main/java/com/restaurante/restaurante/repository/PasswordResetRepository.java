package com.restaurante.restaurante.repository;

import com.restaurante.restaurante.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PasswordResetRepository extends JpaRepository<Employee, Integer> {
    Employee findByUsernameAndEmail(String username, String email);
    Employee findByUsername(String username);
    Employee findByEmail(String email);
}
