package com.kingsman.Kingsman.service;

import com.kingsman.Kingsman.model.Event;
import com.kingsman.Kingsman.repository.CustomerRepository;
import com.kingsman.Kingsman.repository.ShareEventDetailsRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ShareEventDetailsService {
    private final EmailService emailService;
    private final ShareEventDetailsRepository shareEventDetailsRepository;
    private final CustomerRepository customerRepository;

    public ShareEventDetailsService(EmailService emailService, ShareEventDetailsRepository shareEventDetailsRepository, CustomerRepository customerRepository) {
        this.emailService = emailService;
        this.shareEventDetailsRepository = shareEventDetailsRepository;
        this.customerRepository = customerRepository;
    }

    public List<String> getCustomerEmails() {
        return customerRepository.findAllEmails();
    }

    public Event getEventDetails(String eventID) {
        return shareEventDetailsRepository.findByEventID(eventID);
    }
}
