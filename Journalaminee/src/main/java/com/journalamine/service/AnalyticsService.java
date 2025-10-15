package com.journalamine.service;

import com.journalamine.custommessage.AnalyticsResponse;
import com.journalamine.dto.AddAnalyticsDTO;

public interface AnalyticsService {

	AnalyticsResponse addAnalytics(  AddAnalyticsDTO addAnalyticsDTO);
 
}
