
package com.restaurante.restaurante.controller;

import com.restaurante.restaurante.dto.CustomerDTO;
import com.restaurante.restaurante.exception.CustomerDuplicateMobileNumberException;
import com.restaurante.restaurante.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
//@CrossOrigin("http://localhost:3000")
@CrossOrigin(origins = "https://sistema-restaurante-production-896d.up.railway.app/")
@RequestMapping("/api/customers")
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    @GetMapping                                                                     // Handles HTTP GET requests to retrieve all customers with employee details
    public ResponseEntity<List<CustomerDTO>> getAllWithEmployeeName() {
        List<CustomerDTO> customers = customerService.findAllWithEmployeeDetails();
        return ResponseEntity.ok(customers);
    }

    @GetMapping("/email/{email}")                                                  // Handles HTTP GET requests to retrieve customers by email
    public ResponseEntity<?> getByEmail(@PathVariable String email) {
        List<CustomerDTO> customers = customerService.findByEmail(email);
        if (!customers.isEmpty()) {
            return ResponseEntity.ok(customers);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Ningún cliente encontrado con el correo electrónico dado: " + email);
        }
    }

    @GetMapping("/mobile/{mobile}")                                                 // Handles HTTP GET requests to retrieve customers by mobile number
    public ResponseEntity<?> getByMobile(@PathVariable String mobile) {
        CustomerDTO customer = customerService.findByMobile(mobile);
        return customer != null ?
                ResponseEntity.ok(customer) :
                ResponseEntity.status(HttpStatus.NOT_FOUND).body("Cliente no encontrado con el móvil indicado: " + mobile);
    }

    @GetMapping("/{id}")                                                            // Handles HTTP GET requests to retrieve a customer by ID
    public ResponseEntity<?> getById(@PathVariable Long id) {
        CustomerDTO customer = customerService.findById(id);
        return customer != null ?
                ResponseEntity.ok(customer) :
                ResponseEntity.status(HttpStatus.NOT_FOUND).body("Cliente no encontrado con el ID proporcionado: " + id);
    }

    @PostMapping                                                                     // Handles HTTP POST requests to create a new customer
    public ResponseEntity<?> createCustomer(@RequestBody CustomerDTO customerDTO) {
        try {
            CustomerDTO createdCustomer = customerService.create(customerDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdCustomer);
        } catch (CustomerDuplicateMobileNumberException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Ya existe un cliente con este número de móvil");
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al crear cliente: " + ex.getMessage());
        }
    }

    @PutMapping("/{id}")                                                           // Handles HTTP PUT requests to update an existing customer
    public ResponseEntity<?> updateCustomer(@PathVariable Long id, @RequestBody CustomerDTO customerDTO) {
        try {
            CustomerDTO updatedCustomer = customerService.update(id, customerDTO);
            return updatedCustomer != null ?
                    ResponseEntity.ok(updatedCustomer) :
                    ResponseEntity.status(HttpStatus.NOT_FOUND).body("Cliente no encontrado con ID: " + id);
        } catch (CustomerDuplicateMobileNumberException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Ya existe un cliente con este número de móvil");
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al actualizar el cliente: " + ex.getMessage());
        }
    }

    @DeleteMapping("/{id}")                                                     // Handles HTTP DELETE requests to delete a customer by ID
    public ResponseEntity<String> deleteCustomer(@PathVariable Long id) {
        try {
            customerService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al eliminar el cliente: " + ex.getMessage());
        }
    }
}
