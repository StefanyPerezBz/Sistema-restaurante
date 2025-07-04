package com.restaurante.restaurante.repository;

import com.restaurante.restaurante.model.HourPayment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HourPaymentRepository extends JpaRepository<HourPayment,Long> {
    HourPayment findByPosition(String position);
}
