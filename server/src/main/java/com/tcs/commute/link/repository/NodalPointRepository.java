package com.tcs.commute.link.repository;

import com.tcs.commute.link.entity.NodalPoint;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NodalPointRepository extends JpaRepository<NodalPoint, Long> {

    boolean existsByName(String name);
}