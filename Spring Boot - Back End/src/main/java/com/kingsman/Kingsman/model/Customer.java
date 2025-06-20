package com.kingsman.Kingsman.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "customer")
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long cusId;

    @NotNull(message = "El nombre es obligatorio")
    private String cusName;

    @Column(unique = true)
    @NotNull(message = "Se requiere número de telefono")
    @Size(min = 9, max = 9, message = "El número de telefono debe tener 9 dígitos")
    private String cusMobile;

    private String cusEmail;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", referencedColumnName = "id")
    private Employee employee;

    @Column(name = "added_date", nullable = true, updatable = false)
    private LocalDateTime addedDate;

    @Column(name = "updated_date")
    private LocalDateTime updatedDate;

    @PrePersist
    protected void onCreate() {   //El metodo onCreate se ejecuta antes de persistir un nuevo cliente. Establece la fecha de adición y
        addedDate = LocalDateTime.now();
        updatedDate = addedDate;
    }

    @PreUpdate
    protected void onUpdate() { //The onUpdate method is executed before updating an existing customer. It updates
        updatedDate = LocalDateTime.now();
    }

    public Customer(Long customerId) {
        cusId = customerId;
    } //Cuando recupera datos de un cliente de una base de datos u otra fuente, puede crear un objeto Cliente pasando el ID del cliente existente

    public Customer() { //used for creating new customers

    }
}
