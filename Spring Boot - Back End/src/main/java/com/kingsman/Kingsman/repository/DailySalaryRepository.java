package com.kingsman.Kingsman.repository;

import com.kingsman.Kingsman.model.DailySalary;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface DailySalaryRepository extends JpaRepository<DailySalary, Long> {
    List<DailySalary> findByDate(LocalDate currentDate);

    List<DailySalary> findByDateBetween(LocalDate startOfMonth, LocalDate endOfMonth);


    Optional<DailySalary> findByEmpIdAndDate(String employeeId, LocalDate dateObj);
}
