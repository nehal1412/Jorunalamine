package com.journalamine.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Entity
@NoArgsConstructor
public class AnalyticsBase {
	public AnalyticsBase(Long id, String description, int percentage) {
		super();
		this.id = id;
		this.description = description;
		this.percentage = percentage;
	}

	@Id
	public Long id;
	public String description;
	public int percentage;
}
