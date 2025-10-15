package com.journalamine.custommessage;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class AnalyticsResponse {
	public String message;

	public AnalyticsResponse(String message) {
		this.message = message;
	};
}
