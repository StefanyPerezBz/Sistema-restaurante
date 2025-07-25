package com.restaurante.restaurante.repository;

import com.restaurante.restaurante.model.InventoryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;

public interface InventoryRepository extends JpaRepository<InventoryItem,Long> {

    //
    boolean existsByItemName(String itemName);
    boolean existsByItemNameAndIdNot(String itemName, Long id);

    @Query("SELECT SUM(i.totalPrice) FROM InventoryItem i WHERE i.dateTime BETWEEN :startOfMonth AND :endOfMonth")
    Float findTotalPriceForCurrentMonth(@Param("startOfMonth") LocalDateTime startOfMonth, @Param("endOfMonth") LocalDateTime endOfMonth);

    @Query("SELECT SUM(i.totalPrice) FROM InventoryItem i WHERE i.dateTime BETWEEN :startOfYear AND :endOfYear")
    Float findTotalPriceForCurrentYear(@Param("startOfYear") LocalDateTime startOfYear, @Param("endOfYear") LocalDateTime endOfYear);
}
