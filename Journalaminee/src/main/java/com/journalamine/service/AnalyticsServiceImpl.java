package com.journalamine.service;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.journalamine.custommessage.AnalyticsResponse;
import com.journalamine.dto.AddAnalyticsDTO;
import com.journalamine.entities.AnalyticsBase;
import com.journalamine.repository.AnalyticsDao;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class AnalyticsServiceImpl implements AnalyticsService {
	@Autowired
	private final AnalyticsDao analyticsDao;
	@Autowired
	private final ModelMapper mapper;

	@Override
	public AnalyticsResponse addAnalytics(AddAnalyticsDTO addAnalyticsDTO) {
		AnalyticsBase mappedObject = mapper.map(addAnalyticsDTO, AnalyticsBase.class);
		analyticsDao.save(mappedObject);
		return new AnalyticsResponse("Analytics Added Successfully");
	}

}
