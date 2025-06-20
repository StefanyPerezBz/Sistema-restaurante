package com.kingsman.Kingsman.service;

import com.kingsman.Kingsman.model.AnnualIncomeStatement;
import com.kingsman.Kingsman.model.MonthlyIncomeStatement;
import com.kingsman.Kingsman.repository.AnnualIncomeStatementRepository;
import com.kingsman.Kingsman.repository.MonthlyIncomeStatementRepository;
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

    // Save monthly income statement data to the database
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

    // save annual income statement data to the database
    public AnnualIncomeStatement saveAnnualIncomeStatement(AnnualIncomeStatement statement) {
        int year = statement.getYear();

        Optional<AnnualIncomeStatement> existingStatement = annualIncomeStatementRepository.findByYear(year);

        if (existingStatement.isPresent()) {
            // Update existing record
            AnnualIncomeStatement currentStatement = existingStatement.get();
            currentStatement.setNetProfit(statement.getNetProfit());
            currentStatement.setTotalIncome(statement.getTotalIncome());
            currentStatement.setTotalExpenses(statement.getTotalExpenses());
            return annualIncomeStatementRepository.save(currentStatement);
        } else {
            // Save new record
            return annualIncomeStatementRepository.save(statement);
        }
    }

    // Get previous income statement by year
    public Optional<AnnualIncomeStatement> getPreviousAnnualIncomeStatementByYear(int year) {
        return annualIncomeStatementRepository.findByYear(year);
    }

    // Get previous month income statement
    public Optional<MonthlyIncomeStatement> getPreviousMonthIncomeStatement() {
        Calendar cal = Calendar.getInstance();
        cal.add(Calendar.MONTH, -1);
        int prevMonth = cal.get(Calendar.MONTH) + 1; // Calendar.MONTH is 0-based, so add 1
        int prevYear = cal.get(Calendar.YEAR);

        return monthlyIncomeStatementRepository.findPreviousMonthStatement(prevMonth, prevYear);
    }
}
