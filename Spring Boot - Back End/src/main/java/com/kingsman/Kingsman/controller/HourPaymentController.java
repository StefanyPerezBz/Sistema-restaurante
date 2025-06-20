package com.kingsman.Kingsman.controller;

import com.kingsman.Kingsman.model.HourPayment;
import com.kingsman.Kingsman.repository.HourPaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/hourPayments")
public class HourPaymentController {

    @Autowired
    private HourPaymentRepository hourPaymentRepository;

    @PostMapping("/create")
    public ResponseEntity<HourPayment> createHourPayment(@RequestBody HourPayment hourPayment) {
        try {
            HourPayment savedHourPayment = hourPaymentRepository.save(hourPayment);
            return new ResponseEntity<>(savedHourPayment, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{position}")
    public ResponseEntity<HourPayment> getHourPaymentByPosition(@PathVariable String position) {
        try {
            HourPayment hourPayment = hourPaymentRepository.findByPosition(position);

            if (hourPayment != null) {
                return new ResponseEntity<>(hourPayment, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping
    public ResponseEntity<List<HourPayment>> getAllHourPayments() {
        try {
            List<HourPayment> hourPayments = hourPaymentRepository.findAll();

            if (hourPayments.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(hourPayments, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<HourPayment> updateHourPayment(@PathVariable Long id, @RequestBody HourPayment hourPayment) {
        Optional<HourPayment> hourPaymentData = hourPaymentRepository.findById(id);

        if (hourPaymentData.isPresent()) {
            HourPayment updatedHourPayment = hourPaymentData.get();
            updatedHourPayment.setPosition(hourPayment.getPosition());
            updatedHourPayment.setPayPerHour(hourPayment.getPayPerHour());
            updatedHourPayment.setPayPerOverTimeHour(hourPayment.getPayPerOverTimeHour());

            return new ResponseEntity<>(hourPaymentRepository.save(updatedHourPayment), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteHourPayment(@PathVariable Long id) {
        try {
            hourPaymentRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping
    public ResponseEntity<HttpStatus> deleteAllHourPayments() {
        try {
            hourPaymentRepository.deleteAll();
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}