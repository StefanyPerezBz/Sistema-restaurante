package com.kingsman.Kingsman.service;

import com.kingsman.Kingsman.model.Employee;
import com.kingsman.Kingsman.model.InAttendance;
import com.kingsman.Kingsman.repository.EmployeeRepository;
import com.kingsman.Kingsman.repository.InAttendanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class EmployeeService {
    @Autowired
    private EmployeeRepository employeeRepository;

    public Employee updateEmployee(Integer id, Employee updateEmployee) {
        Employee existingEmployee = employeeRepository.findById(id).orElse(null);

        if(existingEmployee != null){

            if((updateEmployee.getFirst_name() == null)){ //if updated employee FName is "null", assign the existing emp FName
                existingEmployee.setFirst_name(existingEmployee.getFirst_name());
            }else{
                existingEmployee.setFirst_name(updateEmployee.getFirst_name());
            }

            if((updateEmployee.getLast_name() == null)){//if updated employee LName is "null", assign the existing emp LName
                existingEmployee.setEmail(existingEmployee.getEmail());
            }else{
                existingEmployee.setLast_name(updateEmployee.getLast_name());
            }

            if((updateEmployee.getEmail() == null)){//if updated employee email is "null", assign the existing emp email
                existingEmployee.setEmail(existingEmployee.getEmail());
            }else{
                existingEmployee.setEmail(updateEmployee.getEmail());
            }

            if((updateEmployee.getProfilePicture() == null)){//if updated employee ProfilePic is "null", assign the existing emp ProfilePic
                existingEmployee.setProfilePicture(existingEmployee.getProfilePicture());
            }else {
                existingEmployee.setProfilePicture(updateEmployee.getProfilePicture());
            }

            if((updateEmployee.getPassword() == null)) {//if updated employee Password is "null", assign the existing emp Password
                existingEmployee.setPassword(existingEmployee.getPassword());
            }else{
                existingEmployee.setPassword(updateEmployee.getPassword());
            }

            if((updateEmployee.getContact_number() == null)){//if updated employee ContactNumber is "null", assign the existing emp ContactNumber
                existingEmployee.setContact_number(existingEmployee.getContact_number());
            }else{
                existingEmployee.setContact_number(updateEmployee.getContact_number());
            }

            if((updateEmployee.getAddress() == null)){//if updated employee Address is "null", assign the existing emp Address
                existingEmployee.setAddress(existingEmployee.getAddress());
            }else{
                existingEmployee.setAddress(updateEmployee.getAddress());
            }

            if((updateEmployee.getIdNumber() == null)){//if updated employee IdNumber  is "null", assign the existing emp IdNumber
                existingEmployee.setIdNumber(existingEmployee.getIdNumber());
            }else{
                existingEmployee.setIdNumber(updateEmployee.getIdNumber());
            }

            if((updateEmployee.getUniform_size() == null)){//if updated employee Uniform Size is "null", assign the existing emp Uniform Size
                existingEmployee.setUniform_size(existingEmployee.getUniform_size());
            }else{
                existingEmployee.setUniform_size(updateEmployee.getUniform_size());
            }

            if((updateEmployee.getEmergency_contact() == null)){//if updated employee EmgContact is "null", assign the existing emp Emg
                existingEmployee.setEmergency_contact(existingEmployee.getEmergency_contact());
            }else{
                existingEmployee.setEmergency_contact(updateEmployee.getEmergency_contact());
            }

            return employeeRepository.save(existingEmployee);

        }else {
            System.out.println("error");
            return  null;

        }
    }


//Absent Employees
    @Autowired
    private InAttendanceRepository inAttendanceRepository;

    public List<Map<String, String>> findEmployeesNotInAttendanceToday() {
        // Get current date
        LocalDate currentDate = LocalDate.now();

        // Fetch all employees
        List<Employee> allEmployees = employeeRepository.findAll();

        // Fetch employees present in InAttendance table for the current date
        List<InAttendance> employeesInAttendance = inAttendanceRepository.findByDate(currentDate);

        // Extract empIds from employeesInAttendance
        List<String> empIdsInAttendance = employeesInAttendance.stream()
                .map(InAttendance::getEmpId)
                .collect(Collectors.toList());

        // Filter out employees whose empIds are not in employeesInAttendance
        List<Employee> employeesNotInAttendance = allEmployees.stream()
                .filter(employee -> !empIdsInAttendance.contains("EMP0" + String.format("%02d", employee.getId())))
                .collect(Collectors.toList());

        // Create a list of maps containing employee id and position
        List<Map<String, String>> employeesWithPositions = employeesNotInAttendance.stream()
                .map(employee -> Map.of("empId", "EMP0" + String.format("%02d", employee.getId()), "position", employee.getPosition()))
                .collect(Collectors.toList());

        return employeesWithPositions;
    }



    public String getEmployeeFirstNameById(Integer id) {
        Employee employee = employeeRepository.findById(id).orElse(null);
        return (employee != null) ? employee.getFirst_name() : null;
    }



}
