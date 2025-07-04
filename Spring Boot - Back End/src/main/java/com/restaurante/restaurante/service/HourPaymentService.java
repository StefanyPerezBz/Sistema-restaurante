package com.restaurante.restaurante.service;

import com.restaurante.restaurante.model.HourPayment;
import com.restaurante.restaurante.repository.HourPaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class HourPaymentService {

    @Autowired
    private HourPaymentRepository hourPaymentRepository;

    public HourPayment saveHourPayment(HourPayment hourPayment) {
        return hourPaymentRepository.save(hourPayment);
    }
}