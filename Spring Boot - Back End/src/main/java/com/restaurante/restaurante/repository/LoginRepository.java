package com.restaurante.restaurante.repository;

import com.restaurante.restaurante.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LoginRepository extends JpaRepository<Employee, Integer> {
    Employee findByUsernameAndPassword(String username, String password);

    //
    Employee findByUsername(String username);

}
