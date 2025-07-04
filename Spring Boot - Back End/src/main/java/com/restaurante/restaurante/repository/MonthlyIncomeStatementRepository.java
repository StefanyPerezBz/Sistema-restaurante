package com.restaurante.restaurante.repository;

import com.restaurante.restaurante.model.MonthlyIncomeStatement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.util.Optional;

@Repository
public interface MonthlyIncomeStatementRepository extends JpaRepository<MonthlyIncomeStatement, Integer> {
    // Consulta para encontrar el estado de resultados mensual por mes y año
    @Query("SELECT m FROM MonthlyIncomeStatement m WHERE FUNCTION('MONTH', m.date) = :prevMonth AND FUNCTION('YEAR', m.date) = :prevYear")
    Optional<MonthlyIncomeStatement> findPreviousMonthStatement(@Param("prevMonth") int prevMonth, @Param("prevYear") int prevYear);

    // Encuentra el estado de resultados mensual por fecha
    Optional<MonthlyIncomeStatement> findByDate(Date date);
}

