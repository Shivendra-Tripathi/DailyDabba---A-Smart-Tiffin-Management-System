package io.github.trip.shiv.dailydabba;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class DailydabbaApplication {

	public static void main(String[] args) {
		SpringApplication.run(DailydabbaApplication.class, args);
	}

}
