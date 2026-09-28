package com.tcs.carpool.dto;

import com.tcs.carpool.entity.CarType;

public record CarResponse(
        Long id,
        CarType type,
        String ownerName,
        String nodalPoint,
        String timeSlot,
        int seats,
        int vacancies
) {
}