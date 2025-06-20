package com.kingsman.Kingsman.service;

import com.kingsman.Kingsman.dto.CustomerDTO;
import com.kingsman.Kingsman.exception.CustomerDuplicateMobileNumberException;
import com.kingsman.Kingsman.exception.ResourceNotFoundException;
import com.kingsman.Kingsman.model.Customer;
import com.kingsman.Kingsman.model.Employee;
import com.kingsman.Kingsman.repository.CustomerRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CustomerService {

    @Autowired //injects an instance of CustomerRepository using @Autowired.
               // Esto permite que el servicio interactúe con la base de datos a través del repositorio..
    private CustomerRepository customerRepository;

    public List<CustomerDTO> findAllWithEmployeeDetails() {   // Recupera una lista de todos los clientes junto con los detalles de sus empleados asociados.
        return customerRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());//Asigna los resultados a objetos CustomerDTO.
    }

    public List<CustomerDTO> findByEmail(String email) {  //Busca clientes según su dirección de correo electrónico y devuelve una lista de objetos CustomerDTO correspondientes
        return customerRepository.findByCusEmail(email)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }


    public CustomerDTO findByMobile(String mobile) { // Recupera a un cliente por su número móvilr.
                                                    // Si se encuentra, devuelve el CustomerDTO correspondiente; de ​​lo contrario, devuelve nulo.
        return customerRepository.findByCusMobile(mobile)
                .map(this::convertToDTO)
                .orElse(null);
    }

    public CustomerDTO findById(Long customerId) {    //Obtiene un cliente por su ID único. Si no lo encuentra, genera una excepción ResourceNotFoundException.
                                                      // De lo contrario, convierte la entidad Cliente en un CustomerDTO.
        Optional<Customer> customerOptional = customerRepository.findById(customerId);
        if (customerOptional.isEmpty()) {
            throw new ResourceNotFoundException("Cliente no encontrado con id: " + customerId);
        }
        Customer customer = customerOptional.get();
        CustomerDTO customerDTO = new CustomerDTO();
        BeanUtils.copyProperties(customer, customerDTO);
        return customerDTO;
    }

    public CustomerDTO create(CustomerDTO customerDTO) {   //Valida la entrada customerDTO y la convierte en una entidad Cliente,
                                                           // Establece marcas de tiempo, las guarda y devuelve el CustomerDTO resultante.
        validateCustomer(customerDTO,  "Create");
        Customer customer = convertToEntity(customerDTO);
        LocalDateTime now = LocalDateTime.now();
        customer.setAddedDate(now);
        customer.setUpdatedDate(now);
        return convertToDTO(customerRepository.save(customer));
    }

    public CustomerDTO update(Long id, CustomerDTO customerDTO) {   //Valida la entrada customerDTO, recupera el cliente existente por ID,
                                                                    // copia propiedades del DTO y actualiza al cliente.
        validateCustomer(customerDTO, "Update");
        Optional<Customer> optionalCustomer = customerRepository.findById(id);
        if (optionalCustomer.isPresent()) {
            Customer existingCustomer = optionalCustomer.get();
            BeanUtils.copyProperties(customerDTO, existingCustomer, "addedDate");
            existingCustomer.setCusId(id);
            existingCustomer.setUpdatedDate(LocalDateTime.now());
            return convertToDTO(customerRepository.save(existingCustomer));
        }
        return null;
    }

    public void delete(Long id) {
        customerRepository.deleteById(id);
    }   //Elimina un registro de cliente del repositorio según la identificación proporcionada.

    private void validateCustomer(CustomerDTO customerDTO, String processType) {//method performs validation checks on a CustomerDTO object and a processType string.
        String email = customerDTO.getCusEmail();
        String mobileNumber = customerDTO.getCusMobile();
        Long customerId = customerDTO.getCusId();

        if (email != null && !email.isEmpty() && !isValidEmail(email)) {  //If the email is not null, not empty, and does not match the valid email format
            throw new IllegalArgumentException("Formato de correo electrónico no válido: " + email);  // is thrown with the message “Invalid email format: {email}”.
        }

        if (!isValidMobileNumber(mobileNumber)) { //The method checks if the mobile number is valid
            throw new IllegalArgumentException("Número de móvil no válido: " + mobileNumber);
        }

        if (customerRepository.existsByCusMobile(mobileNumber) && Objects.equals(processType, "Create")) {    //If the process type is “Create” and a customer with
                                                                                                                  // the same mobile number already exists in the repository
            throw new CustomerDuplicateMobileNumberException("El número de móvil ya existe: " + mobileNumber);
        }

        if (customerRepository.existsByCusMobileAndCusIdNot(mobileNumber, customerId) && Objects.equals(processType, "Update")){
            throw new CustomerDuplicateMobileNumberException("El número de móvil ya existe: " + mobileNumber);
        }//f the process type is “Update” and a customer with the same mobile number (excluding the current customer ID) exists, the same exception is thrown.
    }

    private boolean isValidEmail(String email) { //method checks whether the provided email matches the specified regular expression for valid email formats.
        String emailRegex = "^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$";
        return email.matches(emailRegex);
    }

    private boolean isValidMobileNumber(String mobileNumber) {      //method verifies that the mobile number has exactly 10 digits and consists of numeric characters only.
        return mobileNumber.length() == 10 && mobileNumber.matches("\\d+");
    }

    private CustomerDTO convertToDTO(Customer customer) { //This method converts a Customer entity object into a CustomerDTO (Data Transfer Object)
        CustomerDTO customerDTO = new CustomerDTO();
        BeanUtils.copyProperties(customer, customerDTO); //It initializes a new CustomerDTO and copies properties from the customer object using BeanUtils.copyProperties.
        customerDTO.setEmployeeId(customer.getEmployee().getId());
        return customerDTO;
    }

    private Customer convertToEntity(CustomerDTO customerDTO) { //This method performs the reverse operation:
                                                                // it converts a CustomerDTO back into a Customer entity.
        Customer customer = new Customer();
        BeanUtils.copyProperties(customerDTO, customer); //A new Customer object is created, and properties are copied from the customerDTO.
                                                         // An Employee object is also created, and its id is set based on the employeeId from the customerDTO.
        Employee employee = new Employee();
        employee.setId(customerDTO.getEmployeeId());
        customer.setEmployee(employee);

        return customer;    //the Employee is associated with the customer, and the resulting customer entity is returned.
    }

    public String getCustomerNameById(Long customerId) {
        Optional<Customer> customerOptional = customerRepository.findById(customerId);
        return customerOptional.map(Customer::getCusName).orElse(null);
    }
}
