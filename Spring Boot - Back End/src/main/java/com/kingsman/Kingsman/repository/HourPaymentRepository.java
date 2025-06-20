package com.kingsman.Kingsman.repository;

import com.kingsman.Kingsman.model.HourPayment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HourPaymentRepository extends JpaRepository<HourPayment,Long> {
    HourPayment findByPosition(String position);
}
