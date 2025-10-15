package com.journalamine;

import org.modelmapper.Conditions;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class JournalamineeApplication {

	public static void main(String[] args) {
		SpringApplication.run(JournalamineeApplication.class, args);
	}

	@Bean
	public ModelMapper modelmapper() {
		ModelMapper mapper = new ModelMapper();
		mapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT)
				.setPropertyCondition(Conditions.isNotNull());

		return mapper;
	}
}
