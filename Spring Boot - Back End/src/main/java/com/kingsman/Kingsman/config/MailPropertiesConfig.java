package com.kingsman.Kingsman.config;

import org.springframework.boot.autoconfigure.mail.MailProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

@Configuration
public class MailPropertiesConfig {
    @Primary
    @Bean
    public MailProperties mailProperties() {
        return new MailProperties();
    }
}
