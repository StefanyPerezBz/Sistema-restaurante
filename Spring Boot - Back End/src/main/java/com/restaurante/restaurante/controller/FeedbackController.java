package com.restaurante.restaurante.controller;

import com.restaurante.restaurante.dto.OrderEmployeeFoodDTO;
import com.restaurante.restaurante.model.Feedback;
import com.restaurante.restaurante.model.Notification;
import com.restaurante.restaurante.repository.FeedbackRepository;
import com.restaurante.restaurante.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;


@RestController
//@CrossOrigin("http://localhost:3000")
@CrossOrigin(origins = "https://sistema-restaurante-production-896d.up.railway.app/")
public class FeedbackController {
    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private NotificationService notificationService;

    @PostMapping("/addFeedback")
    public ResponseEntity<String> addFeedback(@RequestBody FeedbackRequest feedbackRequest) {
        try {
            // Crear un nuevo objeto de retroalimentación
            Feedback feedback = new Feedback();
            feedback.setName(feedbackRequest.getName());
            feedback.setFeedback(feedbackRequest.getFeedback());
            feedback.setRate(feedbackRequest.getRate());

            // Guardar los comentarios en la base de datos
            feedbackRepository.save(feedback);

            //createNotificationWhenCrateFeedback
            crateFeedbackNotificationForManager(feedback);

            return new ResponseEntity<>("Comentarios agregados exitosamente", HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al agregar comentarios: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public void crateFeedbackNotificationForManager(Feedback feedback){
        String title = "Comentario";
        String message = feedback.getName() + " calificó el servicio";
        boolean isRead = false;
        LocalDateTime createdAt = LocalDateTime.now();
        LocalDateTime updatedAt = createdAt;
        String forWho = "manager";
        String forWhoUser = "";

        Notification notification = new Notification(title, message, isRead, createdAt, updatedAt, forWho, forWhoUser);
        notificationService.createNotification(notification);
    }

    //show feedback
    @GetMapping("/showFeedback")
    public ResponseEntity<List<Feedback>> getAllFeedback() {
        try {
            List<Feedback> feedbackList = feedbackRepository.findAll();
            return new ResponseEntity<>(feedbackList, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
