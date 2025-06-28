package com.kingsman.Kingsman.controller;

import com.kingsman.Kingsman.model.Event;
import com.kingsman.Kingsman.repository.ShareEventDetailsRepository;
import com.kingsman.Kingsman.service.EmailService;
import com.kingsman.Kingsman.service.ShareEventDetailsService;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/inform")
public class ShareEventDetailsController {
    private final EmailService emailService;
    private final ShareEventDetailsService shareEventDetailsService;

    private final ShareEventDetailsRepository shareEventDetailsRepository;
    public ShareEventDetailsController(EmailService emailService, ShareEventDetailsService shareEventDetailsService, ShareEventDetailsRepository shareEventDetailsRepository) {
        this.emailService = emailService;
        this.shareEventDetailsService = shareEventDetailsService;
        this.shareEventDetailsRepository = shareEventDetailsRepository;
    }

    @GetMapping("/get/{eventID}")
    public Event getEventDetails(@PathVariable String eventID) {
        return shareEventDetailsService.getEventDetails(eventID);
    }

    @PostMapping("/share-event-details")
    public void shareEventDetails(@RequestBody Event event) {
        // Retrieve event details from the database
//        Event storedEvent = shareEventDetailsRepository.findByEventID(event.getEventID());
//        System.out.println(storedEvent);

        event = shareEventDetailsRepository.findByEventID(event.getEventID());
        System.out.println("Detalles del evento: " + event.getEventName() + " " + event.getEventDate() + " " + event.getStartTime() + " " + event.getTicketPrice());

        String subject = "Invitación a " + event.getEventName();
        String message = "Estimado cliente,\n" +
                "Nos complace invitarlo a un evento especial que se llevará a cabo para que disfrute de una experiencia atractiva y memorable, y sería un honor para nosotros que se una a nosotros..\n" +
                "\n" +
                "Detalles del evento:\n" +
                "Fecha: " + event.getEventDate() + "\n" +
                "Tiempo: " + event.getStartTime() + "\n" +
                "Precio del ticket: " + event.getTicketPrice() + "\n" + "\n" +
                "Esperamos verte allí.!\n" + "\n" +
                "Best Regards,\n" +
                "Restaurante, \nLos Patos, \nLo esperamos";

        for (String email : shareEventDetailsService.getCustomerEmails()) {
            try {
                emailService.sendEmail(email, subject, message);
                System.out.println("Correo electrónico enviado");
            } catch (Exception e) {
                e.printStackTrace();
                System.out.println(e);
            }
        }
    }
}
