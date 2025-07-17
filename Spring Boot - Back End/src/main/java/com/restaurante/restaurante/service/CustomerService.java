package com.restaurante.restaurante.service;

import com.restaurante.restaurante.dto.CustomerDTO;
import com.restaurante.restaurante.exception.CustomerDuplicateMobileNumberException;
import com.restaurante.restaurante.exception.ResourceNotFoundException;
import com.restaurante.restaurante.model.Customer;
import com.restaurante.restaurante.model.Employee;
import com.restaurante.restaurante.repository.CustomerRepository;
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

        if (email != null && !email.isEmpty() && !isValidEmail(email)) {  //Si el correo electrónico no es nulo, no está vacío y no coincide con el formato de correo electrónico válido
            throw new IllegalArgumentException("Formato de correo electrónico no válido: " + email);  // Se lanza con el mensaje “Formato de correo electrónico no válido: {email}”.
        }

        if (!isValidMobileNumber(mobileNumber)) { //El metodo verifica si el número de móvil es válido
            throw new IllegalArgumentException("Número de móvil no válido: " + mobileNumber);
        }

        if (customerRepository.existsByCusMobile(mobileNumber) && Objects.equals(processType, "Create")) {    //Si el tipo de proceso es “Crear” y un cliente con
                                                                                                                  // El mismo número de móvil ya existe en el repositorio
            throw new CustomerDuplicateMobileNumberException("El número de móvil ya existe: " + mobileNumber);
        }

        if (customerRepository.existsByCusMobileAndCusIdNot(mobileNumber, customerId) && Objects.equals(processType, "Update")){
            throw new CustomerDuplicateMobileNumberException("El número de móvil ya existe: " + mobileNumber);
        }//Si el tipo de proceso es “Actualizar” y existe un cliente con el mismo número de teléfono móvil (excluyendo el ID del cliente actual), se lanza la misma excepción.
    }

    private boolean isValidEmail(String email) { //El metodo verifica si el correo electrónico proporcionado coincide con la expresión regular especificada para formatos de correo electrónico válidos.
        String emailRegex = "^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$";
        return email.matches(emailRegex);
    }

    private boolean isValidMobileNumber(String mobileNumber) {      //El metodo verifica que el número de móvil tenga exactamente 9 dígitos y conste únicamente de caracteres numéricos.
        return mobileNumber.length() == 9 && mobileNumber.matches("\\d+");
    }

    private CustomerDTO convertToDTO(Customer customer) { //Este metodo convierte un objeto de entidad Cliente en un CustomerDTO (Objeto de transferencia de datos)
        CustomerDTO customerDTO = new CustomerDTO();
        BeanUtils.copyProperties(customer, customerDTO); //Inicializa un nuevo CustomerDTO y copia propiedades del objeto de cliente utilizando BeanUtils.copyProperties.
        customerDTO.setEmployeeId(customer.getEmployee().getId());
        return customerDTO;
    }

    private Customer convertToEntity(CustomerDTO customerDTO) { //Este metodo realiza la operación inversa:
                                                                // Convierte un CustomerDTO nuevamente en una entidad Cliente.
        Customer customer = new Customer();
        BeanUtils.copyProperties(customerDTO, customer); //Se crea un nuevo objeto Cliente y se copian las propiedades del customerDTO.
                                                         //También se crea un objeto Empleado, y su identificación se establece en función del EmployeeId del customerDTO.
        Employee employee = new Employee();
        employee.setId(customerDTO.getEmployeeId());
        customer.setEmployee(employee);

        return customer;    //El empleado se asocia con el cliente y se devuelve la entidad de cliente resultante.
    }

    public String getCustomerNameById(Long customerId) {
        Optional<Customer> customerOptional = customerRepository.findById(customerId);
        return customerOptional.map(Customer::getCusName).orElse(null);
    }
}
