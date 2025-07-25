package com.restaurante.restaurante.controller;

import com.restaurante.restaurante.dto.OrderDTO;
import com.restaurante.restaurante.dto.OrderEmployeeFoodDTO;
import com.restaurante.restaurante.exception.ItemNotFoundExeption;
import com.restaurante.restaurante.model.InventoryItemUsageLog;
import com.restaurante.restaurante.model.Order;
import com.restaurante.restaurante.service.OrderService;
import com.restaurante.restaurante.service.TableManageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@CrossOrigin("http://localhost:3000")
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    private final TableManageService tableManageService;

    @Autowired
    public OrderController(OrderService orderService, TableManageService tableManageService) {
        this.orderService = orderService;
        //
        this.tableManageService = tableManageService;
    }

    @GetMapping
    public List<OrderDTO> getAllOrders() {  //method retrieves a list of all orders.
        return orderService.getAllOrders();
    }

    @GetMapping("/all-orders-general")
    public ResponseEntity<List<OrderDTO>> getOrdersWithoutCanceledStatus() {
        String canceledStatus = "Canceled";
        List<OrderDTO> orders = orderService.getAllOrders().stream()
                .filter(order -> !order.getOrderStatus().equalsIgnoreCase(canceledStatus))
                .collect(Collectors.toList());

        return ResponseEntity.ok(orders);
    }


    @GetMapping("/{id}")
    public ResponseEntity<OrderDTO> getOrderById(@PathVariable("id") Long orderId) { // method retrieves an order based on its ID.
        //return ResponseEntity.ok(orderService.getOrderById(orderId));

        OrderDTO order = orderService.getOrderById(orderId);
        if (order == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(order);
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<OrderDTO>> getOrdersByCustomerId(@PathVariable("customerId") Long customerId) {//method retrieves orders associated with a specific customer.
        return ResponseEntity.ok(orderService.getOrdersByCustomerId(customerId));
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<OrderDTO>> getOrdersByEmployeeId(@PathVariable("employeeId") Long employeeId) {//method retrieves orders associated with a specific employee.
        return ResponseEntity.ok(orderService.getOrdersByEmployeeId(employeeId));
    }

    @GetMapping("/status/{orderStatus}")
    public ResponseEntity<List<OrderDTO>> getOrdersByOrderStatus(@PathVariable("orderStatus") String orderStatus) {//method retrieves orders based on a specified order status
        return ResponseEntity.ok(orderService.getOrdersByOrderStatus(orderStatus));
    }

    @GetMapping("/payment-status/{paymentStatus}")
    public ResponseEntity<List<OrderDTO>> getOrdersByPaymentStatus(@PathVariable("paymentStatus") boolean paymentStatus) {//method retrieves orders based on their payment status.
        return ResponseEntity.ok(orderService.getOrdersByPaymentStatus(paymentStatus));
    }

    @PostMapping
    public ResponseEntity<OrderDTO> createOrder(@RequestBody OrderDTO orderDTO) { //method handles the creation of a new order.
        //return new ResponseEntity<>(orderService.createOrder(orderDTO), HttpStatus.CREATED);
        // Verificar y actualizar disponibilidad de la mesa
        if (orderDTO.getTableNumber() > 0) {
            tableManageService.updateTableAvailabilityByNumber(orderDTO.getTableNumber(), false);
        }
        return new ResponseEntity<>(orderService.createOrder(orderDTO), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<OrderDTO> updateOrder(@PathVariable("id") Long orderId, @RequestBody OrderDTO orderDTO) { //method updates an existing order
        //return ResponseEntity.ok(orderService.updateOrder(orderId, orderDTO));

        OrderDTO existingOrder = orderService.getOrderById(orderId);

        if (existingOrder.getTableNumber() != orderDTO.getTableNumber()) {
            if (existingOrder.getTableNumber() > 0) {
                tableManageService.updateTableAvailabilityByNumber(existingOrder.getTableNumber(), true);
            }
            if (orderDTO.getTableNumber() > 0) {
                tableManageService.updateTableAvailabilityByNumber(orderDTO.getTableNumber(), false);
            }
        }

        return ResponseEntity.ok(orderService.updateOrder(orderId, orderDTO));
    }

    @DeleteMapping("/{id}")//method removes an order based on its ID
    public ResponseEntity<Void> deleteOrder(@PathVariable("id") Long orderId) {
        //orderService.deleteOrder(orderId);
        //return ResponseEntity.noContent().build();

        // Antes de eliminar, liberar la mesa si existe
        OrderDTO order = orderService.getOrderById(orderId);
        if (order == null) {
            return ResponseEntity.notFound().build();
        }

        if (order.getTableNumber() > 0) {
            tableManageService.updateTableAvailabilityByNumber(order.getTableNumber(), true);
        }
        orderService.deleteOrder(orderId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/items/{orderItemId}") //method deletes an order item based on its ID.
    public ResponseEntity<Void> deleteOrderItem(@PathVariable("orderItemId") Long orderItemId) {
        orderService.deleteOrderItem(orderItemId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/created-date") // get order details related the specific date
    public ResponseEntity<List<OrderEmployeeFoodDTO>> getOrderEmployeeFoodByCreatedDate(
            @RequestParam("createdDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate createdDate) {
        List<OrderEmployeeFoodDTO> orders = orderService.getOrderEmployeeFoodByCreatedDate(createdDate);
        if (orders.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    @PutMapping("/status-update/{orderId}/{orderStatus}") //update the order status
    public ResponseEntity<String> updateOrderStatus(@PathVariable long orderId, @PathVariable String orderStatus){
       // boolean success = orderService.updateOrderStatus(orderId,orderStatus);
       // if (success){
           // return ResponseEntity.ok("Estado del pedido actualizado correctamente");
       // }else {
       //     throw new ItemNotFoundExeption(orderId);
       // }

        // Si la orden se completa o cancela, liberar la mesa
        // Liberar mesa si se completa o cancela
        if ("Completed".equalsIgnoreCase(orderStatus) || "Canceled".equalsIgnoreCase(orderStatus)) {
            OrderDTO order = orderService.getOrderById(orderId);
            if (order.getTableNumber() > 0) {
                tableManageService.updateTableAvailabilityByNumber(order.getTableNumber(), true);
            }
        }

        boolean success = orderService.updateOrderStatus(orderId, orderStatus);
        return success ?
                ResponseEntity.ok("Estado del pedido actualizado correctamente") :
                ResponseEntity.badRequest().body("No se pudo actualizar el estado");
    }

    @GetMapping("/get-data-by-order-status/{orderStatus}") // get order details related the order Status
    public ResponseEntity<List<OrderEmployeeFoodDTO>> getOrderEmployeeFoodByOrderStatus(
            @PathVariable String orderStatus) {
        List<OrderEmployeeFoodDTO> orders = orderService.getOrderEmployeeFoodByOrderStatus(orderStatus);
        if (orders.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    // Obtenga los ingresos totales por ventas en función de los pedidos del mes actual
    @GetMapping("/monthly-sales-revenue")
    public Double getMonthlySalesRevenue() {
        return orderService.getTotalAfterDiscountForCurrentMonth();
    }

    // Obtenga los ingresos totales por ventas en función de los pedidos del año actual
    @GetMapping("/annaul-sales-revenue")
    public Double getTotalAfterDiscountForCurrentYear() {
        return orderService.findTotalAfterDiscountForCurrentYear();
    }

    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getOrderStatisticsByEmployee(
            @RequestParam Long employeeId) {
        Map<String, Object> statistics = orderService.getOrderStatisticsByEmployee(employeeId);
        return ResponseEntity.ok(statistics);
    }


}

