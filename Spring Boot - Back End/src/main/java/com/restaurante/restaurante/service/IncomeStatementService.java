package com.restaurante.restaurante.service;

import com.restaurante.restaurante.model.AnnualIncomeStatement;
import com.restaurante.restaurante.model.MonthlyIncomeStatement;
import com.restaurante.restaurante.repository.AnnualIncomeStatementRepository;
import com.restaurante.restaurante.repository.MonthlyIncomeStatementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Calendar;
import java.util.Optional;

@Service
public class IncomeStatementService {
    @Autowired
    private MonthlyIncomeStatementRepository monthlyIncomeStatementRepository;

    @Autowired
    private AnnualIncomeStatementRepository annualIncomeStatementRepository;

    // Guardar los datos del estado de resultados mensual en la base de datos
    public MonthlyIncomeStatement saveMonthlyIncomeStatement(MonthlyIncomeStatement statement) {
        Optional<MonthlyIncomeStatement> existingStatement = monthlyIncomeStatementRepository.findByDate(statement.getDate());

        if (existingStatement.isPresent()) {
            MonthlyIncomeStatement currentStatement = existingStatement.get();
            currentStatement.setNetProfit(statement.getNetProfit());
            currentStatement.setTotalIncome(statement.getTotalIncome());
            currentStatement.setTotalExpenses(statement.getTotalExpenses());
            return monthlyIncomeStatementRepository.save(currentStatement);
        } else {
            return monthlyIncomeStatementRepository.save(statement);
        }
    }

    // Guardar los datos del estado de resultados anual en la base de datos
    public AnnualIncomeStatement saveAnnualIncomeStatement(AnnualIncomeStatement statement) {
        int year = statement.getYear();

        Optional<AnnualIncomeStatement> existingStatement = annualIncomeStatementRepository.findByYear(year);

        if (existingStatement.isPresent()) {
            // Actualizar registro existente
            AnnualIncomeStatement currentStatement = existingStatement.get();
            currentStatement.setNetProfit(statement.getNetProfit());
            currentStatement.setTotalIncome(statement.getTotalIncome());
            currentStatement.setTotalExpenses(statement.getTotalExpenses());
            return annualIncomeStatementRepository.save(currentStatement);
        } else {
            // Guardar nuevo registro
            return annualIncomeStatementRepository.save(statement);
        }
    }

    // Obtener el estado de resultados anterior por año
    public Optional<AnnualIncomeStatement> getPreviousAnnualIncomeStatementByYear(int year) {
        return annualIncomeStatementRepository.findByYear(year);
    }

    // Obtener el estado de resultados del mes anterior
    public Optional<MonthlyIncomeStatement> getPreviousMonthIncomeStatement() {
        Calendar cal = Calendar.getInstance();
        cal.add(Calendar.MONTH, -1);
        int prevMonth = cal.get(Calendar.MONTH) + 1; // Calendar.MONTH está basado en 0, por lo que se debe agregar 1
        int prevYear = cal.get(Calendar.YEAR);

        return monthlyIncomeStatementRepository.findPreviousMonthStatement(prevMonth, prevYear);
    }
}
