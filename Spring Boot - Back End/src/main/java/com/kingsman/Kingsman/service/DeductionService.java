package com.kingsman.Kingsman.service;

import com.kingsman.Kingsman.model.Deduction;
import com.kingsman.Kingsman.repository.DeductionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DeductionService {

    @Autowired
    private DeductionRepository deductionRepository;

    public Deduction saveDeduction(Deduction deduction) {
        return deductionRepository.save(deduction);
    }

    public Optional<Deduction> getDeductionById(Long id) {
        return deductionRepository.findById(id);
    }

    public Deduction updateDeduction(Long id, Deduction updatedDeduction) {
        Optional<Deduction> deductionData = deductionRepository.findById(id);

        if (deductionData.isPresent()) {
            Deduction deduction = deductionData.get();
            deduction.setEmpName(updatedDeduction.getEmpName());
            deduction.setDeductionType(updatedDeduction.getDeductionType());
            deduction.setDeduction(updatedDeduction.getDeduction());
            return deductionRepository.save(deduction);
        } else {
            throw new RuntimeException("Deducción no encontrada con id: " + id);
        }
    }

    public void deleteDeduction(Long id) {
        deductionRepository.deleteById(id);
    }

    public List<Deduction> getAllDeductions() {
        return deductionRepository.findAll();
    }
}
