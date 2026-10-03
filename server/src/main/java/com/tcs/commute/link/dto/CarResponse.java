package com.tcs.commute.link.dto;

import com.tcs.commute.link.entity.CarType;

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