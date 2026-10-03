package com.tcs.commute.link.repository;

import com.tcs.commute.link.entity.Car;
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
            WHERE c.id = :id
            """)
    Optional<Car> findByIdForUpdate(@Param("id") Long id);

    @Query("""
            SELECT c
            FROM Car c
            WHERE (:nodalPointId IS NULL OR c.nodalPoint.id = :nodalPointId)
              AND (:timeSlotId IS NULL OR c.timeSlot.id = :timeSlotId)
            ORDER BY c.id
            """)
    List<Car> findCars(
            @Param("nodalPointId") Long nodalPointId,
            @Param("timeSlotId") Long timeSlotId
    );

    @Query("""
            SELECT c
            FROM Car c
            WHERE (:nodalPointId IS NULL OR c.nodalPoint.id = :nodalPointId)
              AND (:timeSlotId IS NULL OR c.timeSlot.id = :timeSlotId)
              AND c.owner.id <> :userId
            ORDER BY c.id
            """)
    List<Car> findCarsExcludingUser(
            @Param("nodalPointId") Long nodalPointId,
            @Param("timeSlotId") Long timeSlotId,
            @Param("userId") Long userId
    );
}