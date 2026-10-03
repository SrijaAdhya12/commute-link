package com.tcs.commute.link.dto;

import com.tcs.commute.link.entity.CarType;

public record BookingResponse(
        Long id,
        Long employeeId,
        String employeeName,
        Long carId,
        CarType carType,
        String ownerName,
        String nodalPoint,
        String timeSlot,
        int seats,
        int vacancies,
        String dropLocation
) {
}