package com.tcs.carpool.repository;

import com.tcs.carpool.entity.TimeSlot;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TimeSlotRepository extends JpaRepository<TimeSlot, Long> {

    boolean existsByLabel(String label);
}