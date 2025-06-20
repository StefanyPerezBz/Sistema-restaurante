package com.kingsman.Kingsman;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class KingsmanApplication {

	public static void main(String[] args) {SpringApplication.run(KingsmanApplication.class,args);}

}
