package com.kingsman.Kingsman.service;

import com.kingsman.Kingsman.dto.CustomerDTO;
import com.kingsman.Kingsman.dto.OrderDTO;
import com.kingsman.Kingsman.dto.OrderEmployeeFoodDTO;
import com.kingsman.Kingsman.dto.OrderItemDTO;
import com.kingsman.Kingsman.exception.ResourceNotFoundException;
import com.kingsman.Kingsman.model.*;
import com.kingsman.Kingsman.repository.OrderItemRepository;
import com.kingsman.Kingsman.repository.OrderRepository;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class OrderService {
    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private CustomerService customerService;

    @Autowired
    private FoodItemService foodItemService;

    @Autowired
    private NotificationService notificationService;
    private final OrderRepository orderRepository;

    private final OrderItemRepository orderItemRepository;
    @Autowired
    public OrderService(OrderRepository orderRepository, OrderItemRepository orderItemRepository, CustomerService customerService) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.customerService = customerService;
    }

    public List<OrderDTO> getAllOrders() { //This method retrieves all orders from the repository and maps them to a list of OrderDTO objects.
        List<Order> orders = orderRepository.findAll(); // Fetch all orders
        orders.sort(Comparator.comparing(Order::getOrderDateTime).reversed()); // Sort orders by orderDateTime in descending order
        return mapOrderListToDTOList(orders);
    }

    public OrderDTO getOrderById(Long orderId) {// Given an orderId, this method retrieves the corresponding order from the repository
                                                 // (if it exists) and converts it to an OrderDTO.
        Order order = getOrderIfExists(orderId);
        return convertToDTO(order);
    }

    public List<OrderDTO> getOrdersByOrderStatus(String orderStatus) {
        List<Order> orders = orderRepository.findByOrderStatusOrderByOrderDateTimeDesc(orderStatus);
        return mapOrderListToDTOList(orders);
    }//This method fetches orders based on their status (e.g., “pending,” “completed,” etc.).
    // It returns a list of order data transfer objects.

    public List<OrderDTO> getOrdersByPaymentStatus(boolean paymentStatus) {
        List<Order> orders = orderRepository.findByPaymentStatusOrderByOrderDateTimeDesc(paymentStatus);
        return mapOrderListToDTOList(orders);
    }


    public OrderDTO createOrder(OrderDTO orderDTO) {
        Order order = convertToEntity(orderDTO);

        setEmployeeForOrder(order, orderDTO.getEmployeeId());
        List<OrderItem> orderItems = createOrderItems(orderDTO.getOrderItems(), order);
        order.setOrderItems(orderItems);
        Order savedOrder = orderRepository.save(order);

        //crate notification for chef
        createNotificationForChef(savedOrder);

        return convertToDTO(savedOrder);
    }

    //create the notification when place the order
    private void createNotificationForChef(@NotNull Order order) {
        String title = "Nueva orden";
        String foodName = getOrderEmployeeFoodById(order.getOrderId()).stream()
                .map(OrderEmployeeFoodDTO::getFoodName) // Extracting the foodName
                .collect(Collectors.joining(", ")); // Joining them with a comma

        String message = "Orden ID: " + order.getOrderId() + ", Número de mesa : " + order.getTableNumber() + ", Nombre del menú : " + foodName;
        boolean isRead = false;
        LocalDateTime createdAt = LocalDateTime.now();
        LocalDateTime updatedAt = createdAt;
        String forWho = "chef";
        String forWhoUser ="";

        Notification notification = new Notification(title, message, isRead, createdAt, updatedAt, forWho, forWhoUser);
        notificationService.createNotification(notification);
    }

    public OrderDTO updateOrder(Long orderId, OrderDTO orderDTO) {
        // Fetch existing order
        Order existingOrder = getOrderIfExists(orderId);

        // Update order details
        updateOrderWithDTO(existingOrder, orderDTO);

        // Update order items
        updateOrderItems(existingOrder, orderDTO.getOrderItems());

        // Save
        Order updatedOrder = orderRepository.save(existingOrder);

        return convertToDTO(updatedOrder);
    }

    private void updateOrderItems(Order existingOrder, List<OrderItemDTO> updatedOrderItems) {

        Map<Long, OrderItem> existingOrderItemsMap = existingOrder.getOrderItems().stream()
                .collect(Collectors.toMap(OrderItem::getOrderItemId, Function.identity()));


        for (OrderItemDTO updatedOrderItem : updatedOrderItems) {
            Long orderItemId = updatedOrderItem.getOrderItemId();

            // If the updated order item exists in the map, update its quantity
            if (existingOrderItemsMap.containsKey(orderItemId)) {
                OrderItem existingOrderItem = existingOrderItemsMap.get(orderItemId);
                existingOrderItem.setQuantity(updatedOrderItem.getQuantity());

                // Remove the updated order item from the map
                existingOrderItemsMap.remove(orderItemId);
            } else {
                // If the updated order item doesn't exist in the map, create a new one
                OrderItem newOrderItem = convertToEntity(updatedOrderItem, existingOrder);
                existingOrder.getOrderItems().add(newOrderItem);
                System.out.println("New order item added: " + newOrderItem);
            }
        }

        // Delete order items that are not present in the updated order items
        for (OrderItem orderItemToRemove : existingOrderItemsMap.values()) {
            orderItemRepository.delete(orderItemToRemove);
            System.out.println("Order item removed: " + orderItemToRemove);
        }
    }

    public void deleteOrder(Long orderId) {
        Order existingOrder = getOrderIfExists(orderId);

        // Delete the associated order items
        List<OrderItem> orderItems = existingOrder.getOrderItems();
        for (OrderItem orderItem : orderItems) {
            orderItemRepository.deleteById(orderItem.getOrderItemId());
        }
        // Then delete the order
        orderRepository.deleteById(orderId);
    }

    public void deleteOrderItem(Long orderItemId) {
        // Find the order item by its ID
        System.out.println("Deleted order item with ID : " + orderItemId);

        OrderItem orderItem = orderItemRepository.findById(orderItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Order item not found with id: " + orderItemId));

        // Delete the order item
        orderItemRepository.delete(orderItem);
    }



    public List<OrderDTO> getOrdersByCustomerId(Long customerId) {
        List<Order> orders = orderRepository.findByCustomerId(customerId);
        return mapOrderListToDTOList(orders);
    }

    public List<OrderDTO> getOrdersByEmployeeId(Long employeeId) {
        List<Order> orders = orderRepository.findByEmployeeId(employeeId);
        return mapOrderListToDTOList(orders);
    }

    private void updateOrderWithDTO(Order existingOrder, OrderDTO orderDTO) {
        // Update order details with new information from the DTO
        BeanUtils.copyProperties(orderDTO, existingOrder);
        existingOrder.setUpdatedDate(LocalDateTime.now());
    }

    private List<OrderDTO> mapOrderListToDTOList(List<Order> orders) {
        return orders.isEmpty() ? Collections.emptyList() :
                orders.stream()
                        .map(this::convertToDTO)
                        .collect(Collectors.toList());
    }

    private Order getOrderIfExists(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));
    }

    private void setEmployeeForOrder(Order order, Long employeeId) {
        if (employeeId == null) {
            throw new IllegalArgumentException("Employee ID is required for creating an order.");
        }
        Employee employee = new Employee();
        employee.setId(Math.toIntExact(employeeId));
        order.setEmployee(employee);
    }


    private List<OrderItem> createOrderItems(List<OrderItemDTO> orderItemDTOs, Order order) {
        return orderItemDTOs.stream()
                .map(itemDTO -> convertToEntity(itemDTO, order))
                .collect(Collectors.toList());
    }                                       // orde ewa anith paththata deno wger dto eka thiyana

    private OrderDTO convertToDTO(Order order) {
        OrderDTO orderDTO = new OrderDTO();
        BeanUtils.copyProperties(order, orderDTO);

        // Set employee details
        Employee employee = order.getEmployee();
        orderDTO.setEmployeeId(employee.getId().longValue());
        orderDTO.setEmployeeFirstName(employee.getFirst_name());
        orderDTO.setEmployeeLastName(employee.getLast_name());

        // Map order items
        List<OrderItemDTO> orderItemDTOs = order.getOrderItems().stream()
                .map(this::convertOrderItemToDTO)
                .collect(Collectors.toList());
        orderDTO.setOrderItems(orderItemDTOs);

        // Fetch and set customer details if customerId is not null
        if (order.getCustomerId() != null) {
            CustomerDTO customerDTO = customerService.findById(order.getCustomerId());
            orderDTO.setCustomer(customerDTO);
        }

        return orderDTO;
    }



    private OrderItemDTO convertOrderItemToDTO(OrderItem orderItem) {
        OrderItemDTO orderItemDTO = new OrderItemDTO();
        orderItemDTO.setOrderItemId(orderItem.getOrderItemId());
        orderItemDTO.setFoodItemId(orderItem.getFoodItem().getFoodId());
        orderItemDTO.setFoodItemName(orderItem.getFoodItem().getFoodName());
        orderItemDTO.setQuantity(orderItem.getQuantity());
        orderItemDTO.setFoodPrice(orderItem.getFoodItem().getFoodPrice());
        return orderItemDTO;
    }



    private Order convertToEntity(OrderDTO orderDTO) {
        Order order = new Order();
        BeanUtils.copyProperties(orderDTO, order);
        return order;
    }

    private OrderItem convertToEntity(OrderItemDTO itemDTO, Order order) {
        OrderItem orderItem = new OrderItem();
        orderItem.setOrder(order);
        FoodItem foodItem = new FoodItem();
        foodItem.setFoodId(itemDTO.getFoodItemId());
        orderItem.setFoodItem(foodItem);
        orderItem.setQuantity(itemDTO.getQuantity());
        return orderItem;
    }

    public List<OrderEmployeeFoodDTO> getOrderEmployeeFoodByCreatedDate(LocalDate createdDate) {
        List<OrderEmployeeFoodDTO> orderEmployeeFoodDTOs = orderRepository.getOrderEmployeeFoodByCreatedDate(createdDate);
        return orderEmployeeFoodDTOs;
    }

    public boolean updateOrderStatus(Long orderId, String orderStatus){

        Optional<Order> existingOrderOptional = orderRepository.findById(orderId);
        if (existingOrderOptional.isPresent()){
            Order existingOrder = existingOrderOptional.get();
            existingOrder.setOrderStatus(orderStatus);

            orderRepository.save(existingOrder);
            if(orderStatus.equals("Ready")){
                crateOrderReadyWaiterNotification(existingOrder);
            }
        }
        return true;
    }

    public void crateOrderReadyWaiterNotification(Order order){
        String title = "Order Ready";
        String foodName = getOrderEmployeeFoodById(order.getOrderId()).stream()
                .map(OrderEmployeeFoodDTO::getFoodName) // Extracting the foodName
                .collect(Collectors.joining(", ")); // Joining them with a comma

        String forWhoUser = order.getEmployee() != null ? order.getEmployee().getUsername() : "Unknown";;

        String message = forWhoUser+ ", Order is ready ID: " + order.getOrderId() + ", Table Number : " + order.getTableNumber() + ", Food Name : " + foodName;
        boolean isRead = false;
        LocalDateTime createdAt = LocalDateTime.now();
        LocalDateTime updatedAt = createdAt;
        String forWho = "waiter";


        Notification notification = new Notification(title, message, isRead, createdAt, updatedAt, forWho , forWhoUser);
        notificationService.createNotification(notification);
    }

    public List<OrderEmployeeFoodDTO> getOrderEmployeeFoodByOrderStatus(String orderStatus) {
        List<OrderEmployeeFoodDTO> orderEmployeeFoodDTOs = orderRepository.getOrderEmployeeFoodByOrderStatus(orderStatus);
        return orderEmployeeFoodDTOs;
    }

    // Get Total After Discount For Current Month
    public Double getTotalAfterDiscountForCurrentMonth() {
        Double total = orderRepository.findTotalAfterDiscountForCurrentMonth();
        System.out.println("Total after discount for current month: " + total); // Debugging
        return total != null ? total : 0.0; // Handle null case gracefully if no orders exist
    }

    public List<OrderEmployeeFoodDTO> getOrderEmployeeFoodById (Long orderId){
        List<OrderEmployeeFoodDTO> orderEmployeeFoodDTOs = orderRepository.getOrderEmployeeFoodById(orderId);
        return orderEmployeeFoodDTOs;
    }


    // Get Total After Discount For Current Year
    public Double findTotalAfterDiscountForCurrentYear() {
        return orderRepository.findTotalAfterDiscountForCurrentYear();
    }

    // Get daily order counts for the last 30 days for a specific employee with status "Ready"
    public Map<LocalDate, Long> getDailyOrderCountsForLast14DaysByEmployee(Long employeeId) {
        LocalDate today = LocalDate.now();
        LocalDate startDate = today.minusDays(29); // Get the start date for the last 30 days

        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = today.plusDays(1).atStartOfDay(); // End of the day for today

        // Fetch orders from the repository by employeeId and status "Ready"
        List<Order> orders = orderRepository.findOrdersByCreatedDateBetweenAndEmployeeIdAndOrderStatus(startDateTime, endDateTime, employeeId, "Ready");

        // Convert SQL Date to LocalDate and count orders for each day
        return orders.stream()
                .map(order -> order.getCreatedDate().toLocalDate())
                .collect(Collectors.groupingBy(date -> date, Collectors.counting()));
    }

    // Get total order count for the current month for a specific employee with status "Ready"
    public long getOrderCountThisMonthByEmployee(Long employeeId) {
        LocalDate today = LocalDate.now();
        LocalDate startDate = today.withDayOfMonth(1);
        LocalDate endDate = today.withDayOfMonth(today.lengthOfMonth());

        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.plusDays(1).atStartOfDay(); // End of the day for the last day of the month

        return orderRepository.findOrdersByCreatedDateBetweenAndEmployeeIdAndOrderStatus(startDateTime, endDateTime, employeeId, "Ready").size();
    }

    // Get order count for the previous month for a specific employee with status "Ready"
    public long getOrderCountPreviousMonthByEmployee(Long employeeId) {
        LocalDate today = LocalDate.now();
        LocalDate startDate = today.minusMonths(1).withDayOfMonth(1);
        LocalDate endDate = today.withDayOfMonth(1).minusDays(1);

        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.plusDays(1).atStartOfDay(); // End of the day for the last day of the previous month

        return orderRepository.findOrdersByCreatedDateBetweenAndEmployeeIdAndOrderStatus(startDateTime, endDateTime, employeeId, "Ready").size();
    }

    // Get daily order counts for the last 14 days and additional statistics for a specific employee with status "Ready"
    public Map<String, Object> getOrderStatisticsByEmployee(Long employeeId) {
        Map<String, Object> statistics = new HashMap<>();
        statistics.put("dailyOrderCounts", getDailyOrderCountsForLast14DaysByEmployee(employeeId));
        statistics.put("orderCountThisMonth", getOrderCountThisMonthByEmployee(employeeId));
        statistics.put("orderCountPreviousMonth", getOrderCountPreviousMonthByEmployee(employeeId));

        return statistics;
    }


}
