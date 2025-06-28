package com.kingsman.Kingsman.repository;
import com.kingsman.Kingsman.model.Order;
import com.kingsman.Kingsman.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    @Modifying
    @Query("DELETE FROM OrderItem oi WHERE oi.orderItemId = ?1")   // Este método es una consulta personalizada que elimina un OrderItem en función de su orderItemId
    void deleteByOrderItemId(Long orderItemId);
}

