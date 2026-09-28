package com.tcs.carpool.repository;

import com.tcs.carpool.entity.NodalPoint;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NodalPointRepository extends JpaRepository<NodalPoint, Long> {

    boolean existsByName(String name);
}