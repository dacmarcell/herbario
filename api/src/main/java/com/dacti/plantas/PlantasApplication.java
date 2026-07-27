package com.dacti.plantas;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class PlantasApplication {
	public static void main(String[] args) {
		SpringApplication.run(PlantasApplication.class, args);
	}
}
