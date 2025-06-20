package com.kingsman.Kingsman.controller;

import com.kingsman.Kingsman.exception.DuplicatePaymentException;
import com.kingsman.Kingsman.model.Payment;
import com.kingsman.Kingsman.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/payment")
public class PaymentController {
    @Autowired
    private PaymentService paymentService;

    // Endpoint para agregar un nuevo pago
    @PostMapping("/addPayment")
    public ResponseEntity<?> addPayment(@RequestBody Payment payment) {
        try {
            Payment addedPayment = paymentService.addPayment(payment);
            return ResponseEntity.ok(addedPayment);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // Endpoint para actualizar un pago existente
    @PutMapping("/updatePayment/{paymentId}")
    public ResponseEntity<Payment> updatePayment(@PathVariable int paymentId, @RequestBody Payment updatedPayment) {
        Payment payment = paymentService.getPayment(paymentId);
        if (payment == null) {
            return ResponseEntity.notFound().build();
        }
        updatedPayment.setPayID(paymentId); // Asegúrese de que el ID esté configurado correctamente
        Payment updated = paymentService.updatePayment(updatedPayment);
        return ResponseEntity.ok(updated);
    }

//    // Endpoint para eliminar un pago por ID
//    @DeleteMapping("/{paymentId}")
//    public void deletePayment(@PathVariable int paymentId) {
//        paymentService.deletePayment(paymentId);
//    }

    // Endpoint para recuperar un pago por ID
    @GetMapping("/{paymentId}")
    public Payment getPayment(@PathVariable int paymentId) {
        return paymentService.getPayment(paymentId);
    }

    // Endpoint para recuperar todos los pagos
    @GetMapping("/getAllPayments")
    public List<Payment> getAllPayments() {
        return paymentService.getAllPayments();
    }

    // Recuperar todos los pagos del mes actual
    @GetMapping("/current-month")
    public List<Map<String, Object>> getCurrentMonthPayments() {
        return paymentService.getTotalAmountsForCurrentMonthByBillType();
    }

    // Recuperar todos los pagos del año actual
    @GetMapping("/current-year")
    public List<Map<String, Object>> getCurrentYearPayments() {
        return paymentService.getTotalAmountsForCurrentYearByBillType();
    }

    @GetMapping("/getAllBillTypes")
    public ResponseEntity<List<String>> getAllBillTypes() {
        List<String> billTypes = paymentService.getAllBillTypes();
        return ResponseEntity.ok(billTypes);
    }
}
