package com.tcs.carpool.repository;

import com.tcs.carpool.entity.Car;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CarRepository extends JpaRepository<Car, Long> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
            SELECT c
            FROM Car c
            JOIN FETCH c.owner
            JOIN FETCH c.nodalPoint
            JOIN FETCH c.timeSlot
            WHERE c.id = :id
            """)
    Optional<Car> findByIdForUpdate(@Param("id") Long id);

    @Query("""
            SELECT c
            FROM Car c
            JOIN FETCH c.owner
            JOIN FETCH c.nodalPoint
            JOIN FETCH c.timeSlot
            WHERE (:nodalPointId IS NULL OR c.nodalPoint.id = :nodalPointId)
              AND (:timeSlotId IS NULL OR c.timeSlot.id = :timeSlotId)
            ORDER BY c.id
            """)
    List<Car> findCars(
            @Param("nodalPointId") Long nodalPointId,
            @Param("timeSlotId") Long timeSlotId
    );
}