package com.kingsman.Kingsman.repository;

import com.kingsman.Kingsman.dto.CustomerDTO;
import com.kingsman.Kingsman.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {    //Repositorio JPA de Spring Data para la entidad Cliente, que tiene una clave principal de tipo Long.
    @Query("SELECT c FROM Customer c WHERE c.cusEmail = :email")  //El metodo consulta la base de datos para encontrar una lista de entidades de Cliente en función de su dirección de correo electrónico.
    List<Customer> findByCusEmail(String email);
    Optional<Customer> findByCusMobile(String mobile);  //Entidad de cliente mediante la búsqueda de un número de móvil específico.

    boolean existsByCusMobile(String cusMobile); // Comprueba si existe un cliente con el número de móvil indicado.

    boolean existsByCusMobileAndCusIdNot(String cusMobile, Long cusId);

    @Query("SELECT c.cusEmail FROM Customer c")//Recupera una lista de todas las direcciones de correo electrónico de los clientes.
    List<String> findAllEmails();

}
