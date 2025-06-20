package com.kingsman.Kingsman.repository;

import com.kingsman.Kingsman.dto.OrderEmployeeFoodDTO;
import com.kingsman.Kingsman.model.InventoryItemUsageLog;
import com.kingsman.Kingsman.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    @Query("SELECT o FROM Order o LEFT JOIN FETCH o.orderItems WHERE o.customerId = :customerId ORDER BY o.orderDateTime DESC")   //Este metodo recupera una lista de entidades de pedido asociadas con un ID de cliente específico
    List<Order> findByCustomerId(@Param("customerId") Long customerId);  //realiza una unión izquierda con la colección orderItems y ordena los resultados por orderDateTime en orden descendente.

    @Query("SELECT o FROM Order o LEFT JOIN FETCH o.orderItems WHERE o.employee.id = :employeeId ORDER BY o.orderDateTime DESC") //El metodo recupera una lista de entidades de pedido asociadas con un ID de empleado específico.
    List<Order> findByEmployeeId(@Param("employeeId") Long employeeId);//realiza una unión izquierda con la colección orderItems y ordena los resultados por orderDateTime en orden descendente.

    @Query("SELECT DISTINCT o FROM Order o LEFT JOIN FETCH o.orderItems ORDER BY o.orderDateTime DESC")//recupera una lista distinta de todas las entidades de pedido, incluidos sus artículos de pedido asociados
    List<Order> findAllWithOrderItems();// Los resultados se ordenan por orderDateTime en orden descendente.

    List<Order> findByOrderStatusOrderByOrderDateTimeDesc(String orderStatus);//Recupera una lista de entidades de pedido en función de su estado de pedido
    //Los resultados se ordenan por orderDateTime en orden descendente.

    List<Order> findByPaymentStatusOrderByOrderDateTimeDesc(boolean paymentStatus);// Recupera una lista de entidades de pedido en función de su estado de pago

    @Query("SELECT new com.kingsman.Kingsman.dto.OrderEmployeeFoodDTO(o.orderId , o.tableNumber, f.foodName, e.first_name, o.orderStatus,c.cusName,o.specialNote ) " +
            " FROM "
            + "    Order o "
            + "JOIN "
            + "    OrderItem oi ON o.orderId = oi.order.orderId "
            + "JOIN "
            + "    FoodItem f ON oi.foodItem.foodId = f.foodId "
            + "JOIN "
            + "    Employee e ON o.employee.id = e.id "
            + "LEFT JOIN "
            + "    Customer c ON o.customerId = c.cusId "
            + "WHERE "
            + "    DATE(o.createdDate) = :createdDate")
    List<OrderEmployeeFoodDTO> getOrderEmployeeFoodByCreatedDate(@Param("createdDate") LocalDate createdDate);

    @Query("SELECT new com.kingsman.Kingsman.dto.OrderEmployeeFoodDTO(o.orderId , o.tableNumber, f.foodName, e.first_name, o.orderStatus,c.cusName,o.specialNote ) " +
            " FROM "
            + "    Order o "
            + "JOIN "
            + "    OrderItem oi ON o.orderId = oi.order.orderId "
            + "JOIN "
            + "    FoodItem f ON oi.foodItem.foodId = f.foodId "
            + "JOIN "
            + "    Employee e ON o.employee.id = e.id "
            + "LEFT JOIN "
            + "    Customer c ON o.customerId = c.cusId "
            + "WHERE "
            + "    (o.orderStatus) = :orderStatus")
    List<OrderEmployeeFoodDTO> getOrderEmployeeFoodByOrderStatus(@Param("orderStatus") String orderStatus);

    @Query("SELECT new com.kingsman.Kingsman.dto.OrderEmployeeFoodDTO(o.orderId , o.tableNumber, f.foodName, e.first_name, o.orderStatus,c.cusName,o.specialNote ) " +
            " FROM "
            + "    Order o "
            + "JOIN "
            + "    OrderItem oi ON o.orderId = oi.order.orderId "
            + "JOIN "
            + "    FoodItem f ON oi.foodItem.foodId = f.foodId "
            + "JOIN "
            + "    Employee e ON o.employee.id = e.id "
            + "LEFT JOIN "
            + "    Customer c ON o.customerId = c.cusId "
            + "WHERE "
            + "    (o.orderId) = :orderId")
    List<OrderEmployeeFoodDTO> getOrderEmployeeFoodById(@Param("orderId") Long orderId);

    //  Encuentre el total después del descuento para el mes actual
    @Query("SELECT SUM(o.totalAfterDiscount) FROM Order o WHERE MONTH(o.orderDateTime) = MONTH(CURRENT_DATE) AND YEAR(o.orderDateTime) = YEAR(CURRENT_DATE)")
    Double findTotalAfterDiscountForCurrentMonth();

    //  Encuentre el total después del descuento para el año actual
    @Query("SELECT SUM(o.totalAfterDiscount) FROM Order o WHERE YEAR(o.orderDateTime) = YEAR(CURRENT_DATE)")
    Double findTotalAfterDiscountForCurrentYear();

    List<Order> findOrdersByCreatedDateBetweenAndEmployeeIdAndOrderStatus(LocalDateTime startDate, LocalDateTime endDate, Long employeeId, String orderStatus);
}
