package com.restaurante.restaurante.repository;

import com.restaurante.restaurante.model.InventoryItemUsageLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface InventoryItemUsageLogRepository extends JpaRepository<InventoryItemUsageLog, Long> {
    List<InventoryItemUsageLog> findByUsageDateTimeBetween(LocalDateTime startDate,LocalDateTime endDate);
}
