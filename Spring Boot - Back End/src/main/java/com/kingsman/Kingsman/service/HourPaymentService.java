package com.kingsman.Kingsman.service;

import com.kingsman.Kingsman.model.HourPayment;
import com.kingsman.Kingsman.repository.HourPaymentRepository;
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