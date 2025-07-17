package com.restaurante.restaurante.service;

import com.restaurante.restaurante.model.Payment;
import com.restaurante.restaurante.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PaymentService {
    @Autowired
    private PaymentRepository paymentRepository;

    public Payment addPayment(Payment payment) {
        // Verificar si existe un pago con el mismo tipo de factura para el mes actual
        LocalDate payDate = payment.getPayDate();
        int month = payDate.getMonthValue();
        int year = payDate.getYear();

        Optional<Payment> existingPayment = paymentRepository.findByBillTypeAndMonthYear(payment.getBillType(), month, year);
        if (existingPayment.isPresent()) {
            throw new IllegalArgumentException("Ya existe pago para este tipo de factura en el mes actual");
        }

        return paymentRepository.save(payment);
    }

    public Payment updatePayment(Payment payment) {
        return paymentRepository.save(payment);
    }

    //
    public void deletePayment(int paymentId) {
        paymentRepository.deleteById(paymentId);
    }

    public Payment getPayment(int paymentId) {
        Optional<Payment> payment = paymentRepository.findById(paymentId);
        return payment.orElse(null);
    }

    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    //     Method to get total amounts for current month by bill type
    public List<Map<String, Object>> getTotalAmountsForCurrentMonthByBillType() {
        return paymentRepository.findTotalAmountsForCurrentMonthByBillType();
    }

    // Method to get payments for the current year
    public List<Map<String, Object>> getTotalAmountsForCurrentYearByBillType() {
        return paymentRepository.findTotalAmountsForCurrentYearByBillType();
    }

    // get all unique bill types
    public List<String> getAllBillTypes() {
        List<Payment> payments = paymentRepository.findAll();
        return payments.stream()
                .map(Payment::getBillType)
                .distinct()
                .collect(Collectors.toList());
    }
}
