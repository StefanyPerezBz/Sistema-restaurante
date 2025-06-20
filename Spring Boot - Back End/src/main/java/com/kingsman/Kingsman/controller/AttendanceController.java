package com.kingsman.Kingsman.controller;

import com.kingsman.Kingsman.model.*;
import com.kingsman.Kingsman.repository.AttendanceRepository;
import com.kingsman.Kingsman.repository.EmployeeRepository;
import com.kingsman.Kingsman.service.AttendanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@CrossOrigin("http://localhost:3000")
public class AttendanceController {

    //obtener identificaciones de empleados
    @Autowired
    private EmployeeRepository employeeRepository;

    @GetMapping("/employeeIdsAndPositions")
    public List<List<String>> getAllEmployeeIdsAndPositions() {
        //Obtener todos los empleados del repositorio
        List<Employee> employees = employeeRepository.findAll();

        // Extraiga y devuelva los ID, nombres y posiciones como listas separadas
        return employees.stream()
                .map(employee -> {
                    List<String> employeeInfo = Arrays.asList(
                            "EMP" + String.format("%03d", employee.getId()),
                            employee.getFirst_name() + " " + employee.getLast_name(),
                            employee.getPosition()
                    );
                    return employeeInfo;
                })
                .collect(Collectors.toList());
    }

    //test

    @Autowired
    private AttendanceRepository attendanceRepository;

    @PostMapping("/attendance/in")
    public ResponseEntity<String> addInTime(@RequestBody Attendance attendance) {
        try {
            // Verificar si ya existe un registro a tiempo para el ID del empleado y la fecha
            Attendance existingInTime = attendanceRepository.findByEmpIdAndDate(attendance.getEmpId(), LocalDate.now());

            if (existingInTime != null) {
                // Si ya existe un registro a tiempo para el mismo ID de empleado y fecha, devolver una respuesta de error
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Ya existe un registro de tiempo para el empleado: " + attendance.getEmpId());
            } else {
                // Guardar el registro a tiempo
                attendance.setDate(LocalDate.now());
                attendanceRepository.save(attendance);
                return ResponseEntity.ok("A tiempo grabado con éxito..");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("No se pudo grabar a tiempo.");
        }
    }

    @PostMapping("/attendance/out")
    public ResponseEntity<String> addOutTime(@RequestBody Attendance attendance) {
        try {
            // Obtener el registro a tiempo por ID de empleado y fecha
            Attendance existingInTime = attendanceRepository.findByEmpIdAndDate(attendance.getEmpId(), LocalDate.now());

            if (existingInTime != null) {
                // Verificar si ya existe un registro de tiempo de salida para el mismo ID de empleado y fecha
                if (existingInTime.getOutTime() != null) {
                    // Si ya existe un registro de tiempo de salida para el mismo ID de empleado y fecha, devolver una respuesta de error
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Ya existe un registro de tiempo de salida para el empleado: " + attendance.getEmpId());
                } else {
                    // Actualizar el registro existente en tiempo real sin tiempo real
                    existingInTime.setOutTime(attendance.getOutTime());
                    attendanceRepository.save(existingInTime);
                    return ResponseEntity.ok("Tiempo de salida registrado con éxito.");
                }
            } else {
                // Manejar el caso en el que no se encuentra ningún registro coincidente en el tiempo
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No se encontró ningún registro coincidente de tiempo para el empleado: " + attendance.getEmpId());
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("No se pudo registrar la hora.");
        }
    }


    // Obtener asistencia en la fecha actual
    private final AttendanceService attendanceService;


    // Inyección del constructor de AttendanceService
    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    @GetMapping("/current-date")
    public List<AttendanceDTO> getAttendanceForCurrentDate() {
        return attendanceService.getAttendanceForCurrentDate();
    }

    //asistencia del mes actual

    @GetMapping("/current-month")
    public ResponseEntity<List<Attendance>> getAttendanceForCurrentMonth() {
        List<Attendance> attendanceList = attendanceService.getAttendanceForCurrentMonth();
        return new ResponseEntity<>(attendanceList, HttpStatus.OK);
    }


//Actualizar registros de asistencia
    @PutMapping("/update")
    public ResponseEntity<String> updateAttendance(@RequestBody AttendanceUpdateRequest request) {
        //Validar entrada
        if (request.getEmpId() == null || request.getDate() == null ||
                request.getInTime() == null || request.getOutTime() == null) {
            return ResponseEntity.badRequest().body("Faltan campos obligatorios.");
        }

        // Obtener registro de asistencia
        Attendance attendance = attendanceRepository.findByEmpIdAndDate(request.getEmpId(), request.getDate());
        if (attendance == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se encontró el registro de asistencia.");
        }

        // Actualizar registro de asistencia
        attendance.setInTime(request.getInTime());
        attendance.setOutTime(request.getOutTime());

        // Guardar cambios
        attendanceRepository.save(attendance);

        return ResponseEntity.ok("Registro de asistencia actualizado exitosamente.");
    }

    //Eliminar registros de asistencia
    @DeleteMapping("/DeleteAttendance/{empId}/{date}")
    public ResponseEntity<String> deleteAttendance(@PathVariable String empId, @PathVariable String date) {
        try {
            // Analizar la cadena de fecha en un objeto LocalDate
            LocalDate attendanceDate = LocalDate.parse(date);

            // Eliminar el registro de asistencia según empId y fecha
            attendanceService.deleteAttendance(empId, attendanceDate);

            return ResponseEntity.ok("Registro de asistencia eliminado exitosamente.");
        } catch (Exception e) {
            //Manejar cualquier excepción y devolver una respuesta de error
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("No se pudo eliminar el registro de asistencia.");
        }
    }


//Buscar empleados ausentes
    @Autowired
    public AttendanceController(EmployeeRepository employeeRepository, AttendanceRepository attendanceRepository, AttendanceService attendanceService) {
        this.employeeRepository = employeeRepository;
        this.attendanceRepository = attendanceRepository;
        this.attendanceService = attendanceService;
    }

    @GetMapping("/employeeDetails")
    public List<String[]> getEmployeeDetails() {
        // Consigue todos los empleados
        List<Employee> employees = employeeRepository.findAll();

        // Obtener registros de asistencia para la fecha actual
        LocalDate currentDate = LocalDate.now();
        List<Attendance> attendanceRecords = attendanceRepository.findByDate(currentDate);

        // Extraer empIds de los registros de asistencia para comparar
        List<String> attendedEmployeeIds = attendanceRecords.stream()
                .map(Attendance::getEmpId)
                .collect(Collectors.toList());

        // Filtrar empleados que no están en los registros de asistencia para la fecha actual
        List<Employee> employeesNotAttended = employees.stream()
                .filter(employee -> !attendedEmployeeIds.contains("EMP" + String.format("%03d", employee.getId())))
                .collect(Collectors.toList());

        // Asigne los detalles de los empleados al formato deseado
        List<String[]> employeeDetails = employeesNotAttended.stream()
                .map(employee -> new String[]{
                        "EMP" + String.format("%03d", employee.getId()), // Format ID as EMPXXX
                        employee.getFirst_name() + " " + employee.getLast_name(), // Concatenate first and last name
                        employee.getPosition()
                })
                .collect(Collectors.toList());

        return employeeDetails;
    }


    //Marcar empleados ausentes
    @PostMapping("/attendances")
    public ResponseEntity<String> saveAttendances(@RequestBody List<Attendance> attendances) {
        try {
            // Guardar todas las asistencias
            attendanceRepository.saveAll(attendances);
            return ResponseEntity.ok("Asistencias guardadas exitosamente");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("No se pudieron guardar las asistencias: " + e.getMessage());
        }
    }

    // Obtener asistencia según rango de fechas
    @GetMapping("/fetch-by-date-range/{startDate}/{endDate}")
    public ResponseEntity<List<Attendance>> fetchAttendanceByDateRange(
            @PathVariable("startDate") String startDate,
            @PathVariable("endDate") String endDate) {
        // Convertir cadenas de fecha en objetos LocalDate
        LocalDate start = LocalDate.parse(startDate);
        LocalDate end = LocalDate.parse(endDate);

        // Obtener datos de asistencia del repositorio dentro del rango de fechas especificado
        List<Attendance> attendanceList = attendanceRepository.findByDateBetween(start, end);

        // Devuelve los datos de asistencia obtenidos con un código de estado de éxito
        return new ResponseEntity<>(attendanceList, HttpStatus.OK);
    }


//    Emp Ids (EMP001.EMP002)
    @GetMapping("/employeeIds")
    public List<String> getAllEmployeeIds() {
        // Obtener todos los empleados del repositorio
        List<Employee> employees = employeeRepository.findAll();

        // Asigne los ID de los empleados al formato "EMPXXX"
        List<String> formattedEmployeeIds = employees.stream()
                .map(employee -> "EMP" + String.format("%03d", employee.getId()))
                .collect(Collectors.toList());

        return formattedEmployeeIds;
    }


    //buscar según empId un Este mes o Hoy
    @GetMapping("/attendance/{empId}/{dateRange}")
    public ResponseEntity<List<Attendance>> getAttendance(@PathVariable String empId, @PathVariable String dateRange) {
        LocalDate today = LocalDate.now();
        LocalDate startDate, endDate;

        if (dateRange.equals("Today")) {
            startDate = endDate = today;
        } else if (dateRange.equals("This Month")) {
            startDate = today.withDayOfMonth(1);
            endDate = today.withDayOfMonth(today.getMonth().maxLength());
        } else {
            return ResponseEntity.badRequest().body(null); // Handle invalid date range
        }

        List<Attendance> attendanceList = attendanceRepository.findByEmpIdAndDateBetween(empId, startDate, endDate);
        return ResponseEntity.ok(attendanceList);
    }


}