package com.restaurante.restaurante.service;

import com.restaurante.restaurante.dto.CustomerDTO;
import com.restaurante.restaurante.dto.OrderDTO;
import com.restaurante.restaurante.dto.OrderEmployeeFoodDTO;
import com.restaurante.restaurante.dto.OrderItemDTO;
import com.restaurante.restaurante.exception.ResourceNotFoundException;
import com.restaurante.restaurante.model.*;
import com.restaurante.restaurante.repository.OrderItemRepository;
import com.restaurante.restaurante.repository.OrderRepository;
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

    public List<OrderDTO> getAllOrders() { //Este metodo recupera todos los pedidos del repositorio y los asigna a una lista de objetos OrderDTO.
        List<Order> orders = orderRepository.findAll(); // Obtener todos los pedidos
        orders.sort(Comparator.comparing(Order::getOrderDateTime).reversed()); // Ordenar pedidos por orderDateTime en orden descendente
        return mapOrderListToDTOList(orders);
    }

    public OrderDTO getOrderById(Long orderId) {// Dado un orderId, este metodo recupera el pedido correspondiente del repositorio
                                                 // (si existe) y lo convierte en un OrderDTO.
        Order order = getOrderIfExists(orderId);
        return convertToDTO(order);
    }

    public List<OrderDTO> getOrdersByOrderStatus(String orderStatus) {
        List<Order> orders = orderRepository.findByOrderStatusOrderByOrderDateTimeDesc(orderStatus);
        return mapOrderListToDTOList(orders);
    }//Este metodo recupera los pedidos en función de su estado.(e.g., “pending,” “completed,” etc.).
    // Devuelve una lista de objetos de transferencia de datos de pedidos.

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

        //Notificación para el chef
        createNotificationForChef(savedOrder);

        return convertToDTO(savedOrder);
    }

    //Crear la notificación cuando se realiza el pedido
    private void createNotificationForChef(@NotNull Order order) {
        String title = "Nueva orden";
        String foodName = getOrderEmployeeFoodById(order.getOrderId()).stream()
                .map(OrderEmployeeFoodDTO::getFoodName) // Extrayendo el nombre de la comida
                .collect(Collectors.joining(", ")); // Uniéndolos con una coma

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
        // Recuperar pedido existente
        Order existingOrder = getOrderIfExists(orderId);

        // Actualizar detalles del pedido
        updateOrderWithDTO(existingOrder, orderDTO);

        // Actualizar artículos del pedido
        updateOrderItems(existingOrder, orderDTO.getOrderItems());

        // Guardar
        Order updatedOrder = orderRepository.save(existingOrder);

        return convertToDTO(updatedOrder);
    }

    private void updateOrderItems(Order existingOrder, List<OrderItemDTO> updatedOrderItems) {

        Map<Long, OrderItem> existingOrderItemsMap = existingOrder.getOrderItems().stream()
                .collect(Collectors.toMap(OrderItem::getOrderItemId, Function.identity()));


        for (OrderItemDTO updatedOrderItem : updatedOrderItems) {
            Long orderItemId = updatedOrderItem.getOrderItemId();

            // Si el artículo de pedido actualizado existe en el mapa, actualice su cantidad
            if (existingOrderItemsMap.containsKey(orderItemId)) {
                OrderItem existingOrderItem = existingOrderItemsMap.get(orderItemId);
                existingOrderItem.setQuantity(updatedOrderItem.getQuantity());

                // Eliminar el elemento de pedido actualizado del mapa
                existingOrderItemsMap.remove(orderItemId);
            } else {
                // Si el elemento de pedido actualizado no existe en el mapa, cree uno nuevo
                OrderItem newOrderItem = convertToEntity(updatedOrderItem, existingOrder);
                existingOrder.getOrderItems().add(newOrderItem);
                System.out.println("Nuevo artículo de pedido agregado: " + newOrderItem);
            }
        }

        // Eliminar elementos del pedido que no están presentes en los elementos del pedido actualizados
        for (OrderItem orderItemToRemove : existingOrderItemsMap.values()) {
            orderItemRepository.delete(orderItemToRemove);
            System.out.println("Order item removed: " + orderItemToRemove);
        }
    }

    public void deleteOrder(Long orderId) {
        Order existingOrder = getOrderIfExists(orderId);

        // Eliminar los artículos del pedido asociados
        List<OrderItem> orderItems = existingOrder.getOrderItems();
        for (OrderItem orderItem : orderItems) {
            orderItemRepository.deleteById(orderItem.getOrderItemId());
        }
        // Luego borre el pedido
        orderRepository.deleteById(orderId);
    }

    public void deleteOrderItem(Long orderItemId) {
        // Encuentre el artículo del pedido por su ID
        System.out.println("Artículo de pedido eliminado con ID : " + orderItemId);

        OrderItem orderItem = orderItemRepository.findById(orderItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Artículo del pedido no encontrado con id: " + orderItemId));

        // Eliminar el artículo del pedido
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
        // Actualizar los detalles del pedido con nueva información del DTO
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
                .orElseThrow(() -> new ResourceNotFoundException("Pedido no encontrado con id: " + orderId));
    }

    private void setEmployeeForOrder(Order order, Long employeeId) {
        if (employeeId == null) {
            throw new IllegalArgumentException("Se requiere la identificación del empleado para crear un pedido.");
        }
        Employee employee = new Employee();
        employee.setId(Math.toIntExact(employeeId));
        order.setEmployee(employee);
    }


    private List<OrderItem> createOrderItems(List<OrderItemDTO> orderItemDTOs, Order order) {
        return orderItemDTOs.stream()
                .map(itemDTO -> convertToEntity(itemDTO, order))
                .collect(Collectors.toList());
    }

    private OrderDTO convertToDTO(Order order) {
        OrderDTO orderDTO = new OrderDTO();
        BeanUtils.copyProperties(order, orderDTO);

        // Establecer detalles del empleado
        Employee employee = order.getEmployee();
        orderDTO.setEmployeeId(employee.getId().longValue());
        orderDTO.setEmployeeFirstName(employee.getFirst_name());
        orderDTO.setEmployeeLastName(employee.getLast_name());

        // Elementos de orden de mapa
        List<OrderItemDTO> orderItemDTOs = order.getOrderItems().stream()
                .map(this::convertOrderItemToDTO)
                .collect(Collectors.toList());
        orderDTO.setOrderItems(orderItemDTOs);

        // Obtener y configurar los detalles del cliente si customerId no es nulo
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
        String title = "Orden lista";
        String foodName = getOrderEmployeeFoodById(order.getOrderId()).stream()
                .map(OrderEmployeeFoodDTO::getFoodName) // Extrayendo el nombre de la comida
                .collect(Collectors.joining(", ")); // Uniéndolos con una coma

        String forWhoUser = order.getEmployee() != null ? order.getEmployee().getUsername() : "Desconocido";

        String message = forWhoUser+ ", El pedido está listo: " + order.getOrderId() + ", Número de mesa : " + order.getTableNumber() + ", Nombre del menu : " + foodName;
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

    // Obtenga el total después del descuento para el mes actual
    public Double getTotalAfterDiscountForCurrentMonth() {
        Double total = orderRepository.findTotalAfterDiscountForCurrentMonth();
        System.out.println("Total después del descuento del mes actual: " + total); // Depuración
        return total != null ? total : 0.0; // Manejar el caso nulo con elegancia si no existen órdenes
    }

    public List<OrderEmployeeFoodDTO> getOrderEmployeeFoodById (Long orderId){
        List<OrderEmployeeFoodDTO> orderEmployeeFoodDTOs = orderRepository.getOrderEmployeeFoodById(orderId);
        return orderEmployeeFoodDTOs;
    }


    // Obtenga el total después del descuento para el año actual
    public Double findTotalAfterDiscountForCurrentYear() {
        return orderRepository.findTotalAfterDiscountForCurrentYear();
    }

    // Obtenga los recuentos diarios de pedidos de los últimos 30 días para un empleado específico con estado "Listo".
    public Map<LocalDate, Long> getDailyOrderCountsForLast14DaysByEmployee(Long employeeId) {
        LocalDate today = LocalDate.now();
        LocalDate startDate = today.minusDays(29); // Obtenga la fecha de inicio de los últimos 30 días

        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = today.plusDays(1).atStartOfDay(); // Fin del día por hoy

        // Obtener pedidos del repositorio por ID de empleado y estado "Listo"
        List<Order> orders = orderRepository.findOrdersByCreatedDateBetweenAndEmployeeIdAndOrderStatus(startDateTime, endDateTime, employeeId, "Ready");

        // Convierte SQL Date en LocalDate y cuenta los pedidos de cada día
        return orders.stream()
                .map(order -> order.getCreatedDate().toLocalDate())
                .collect(Collectors.groupingBy(date -> date, Collectors.counting()));
    }

    // Obtenga el recuento total de pedidos del mes actual para un empleado específico con estado "Listo"
    public long getOrderCountThisMonthByEmployee(Long employeeId) {
        LocalDate today = LocalDate.now();
        LocalDate startDate = today.withDayOfMonth(1);
        LocalDate endDate = today.withDayOfMonth(today.lengthOfMonth());

        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.plusDays(1).atStartOfDay(); // Fin del día para el último día del mes.

        return orderRepository.findOrdersByCreatedDateBetweenAndEmployeeIdAndOrderStatus(startDateTime, endDateTime, employeeId, "Ready").size();
    }

    // Obtener el recuento de pedidos del mes anterior para un empleado específico con estado "Listo"
    public long getOrderCountPreviousMonthByEmployee(Long employeeId) {
        LocalDate today = LocalDate.now();
        LocalDate startDate = today.minusMonths(1).withDayOfMonth(1);
        LocalDate endDate = today.withDayOfMonth(1).minusDays(1);

        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.plusDays(1).atStartOfDay();

        return orderRepository.findOrdersByCreatedDateBetweenAndEmployeeIdAndOrderStatus(startDateTime, endDateTime, employeeId, "Ready").size();
    }

    // Obtenga recuentos diarios de pedidos de los últimos 14 días y estadísticas adicionales para un empleado específico con estado "Listo".
    public Map<String, Object> getOrderStatisticsByEmployee(Long employeeId) {
        Map<String, Object> statistics = new HashMap<>();
        statistics.put("dailyOrderCounts", getDailyOrderCountsForLast14DaysByEmployee(employeeId));
        statistics.put("orderCountThisMonth", getOrderCountThisMonthByEmployee(employeeId));
        statistics.put("orderCountPreviousMonth", getOrderCountPreviousMonthByEmployee(employeeId));

        return statistics;
    }


}
