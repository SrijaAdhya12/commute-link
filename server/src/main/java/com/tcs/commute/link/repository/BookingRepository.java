package com.tcs.commute.link.repository;

import com.tcs.commute.link.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    boolean existsByEmployeeId(Long employeeId);

    long countByCarId(Long carId);

    List<Booking> findByEmployeeId(Long employeeId);

    @Query("""
            SELECT b
            FROM Booking b
            JOIN FETCH b.employee e
            JOIN FETCH b.car c
            JOIN FETCH c.owner
            JOIN FETCH c.nodalPoint
            JOIN FETCH c.timeSlot
            WHERE b.employee.id = :employeeId
            ORDER BY b.id
            """)
    List<Booking> findBookingsByEmployeeId(
            @Param("employeeId") Long employeeId
    );

    @Query("""
            SELECT b
            FROM Booking b
            JOIN FETCH b.employee e
            JOIN FETCH b.car c
            JOIN FETCH c.owner
            JOIN FETCH c.nodalPoint
            JOIN FETCH c.timeSlot
            WHERE b.id = :id
            """)
    java.util.Optional<Booking> findDetailedById(@Param("id") Long id);
}