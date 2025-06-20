package com.kingsman.Kingsman.repository;

import com.kingsman.Kingsman.model.InventoryItemUsageLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface InventoryItemUsageLogRepository extends JpaRepository<InventoryItemUsageLog, Long> {
    List<InventoryItemUsageLog> findByUsageDateTimeBetween(LocalDateTime startDate,LocalDateTime endDate);
}
