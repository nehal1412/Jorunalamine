package com.journalamine.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class AddAnalyticsDTO {
	public Long id;
	public String description;
	public int percentage;
}
