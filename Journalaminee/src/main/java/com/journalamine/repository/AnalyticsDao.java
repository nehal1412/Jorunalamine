package com.journalamine.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.journalamine.entities.AnalyticsBase;

public interface AnalyticsDao extends JpaRepository<AnalyticsBase, Long>{

}
