package com.kingsman.Kingsman.repository;

import com.kingsman.Kingsman.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RegistrationRepository extends JpaRepository<Employee, Integer>{
    Employee findByUsername(String username);
    Employee findByEmail(String email);
    Employee save(Employee employee);
}
