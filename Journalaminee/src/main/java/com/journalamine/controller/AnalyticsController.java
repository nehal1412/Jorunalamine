package com.journalamine.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.journalamine.dto.AddAnalyticsDTO;
import com.journalamine.service.AnalyticsService;

import lombok.RequiredArgsConstructor;

@RestController
@Component
@RequestMapping("/analytics")
@RequiredArgsConstructor
public class AnalyticsController {
	@Autowired
	private final AnalyticsService analyticsService;

	@PostMapping("/")
	public ResponseEntity<?> getAnalytics(@RequestBody AddAnalyticsDTO addAnalyticsDTO) {
		return ResponseEntity.ok().body(analyticsService.addAnalytics(addAnalyticsDTO));
	}
}
