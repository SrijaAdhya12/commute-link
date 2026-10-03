package com.tcs.commute.link.repository;

import com.tcs.commute.link.entity.TimeSlot;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TimeSlotRepository extends JpaRepository<TimeSlot, Long> {

    boolean existsByLabel(String label);
}