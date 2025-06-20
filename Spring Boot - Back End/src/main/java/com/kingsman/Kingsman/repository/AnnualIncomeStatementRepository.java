package com.kingsman.Kingsman.repository;

import com.kingsman.Kingsman.model.AnnualIncomeStatement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AnnualIncomeStatementRepository extends JpaRepository<AnnualIncomeStatement, Integer> {
    // Consulta para encontrar el estado de resultados anual por año
    @Query("SELECT a FROM AnnualIncomeStatement a WHERE a.year = :year")
    Optional<AnnualIncomeStatement> findByYear(@Param("year") int year);
}
