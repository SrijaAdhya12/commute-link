package com.tcs.carpool.dto;

import com.tcs.carpool.entity.CarType;
import jakarta.validation.constraints.NotNull;

public record CreateCarRequest(

        @NotNull(message = "Owner ID is required")
        Long ownerId,

        @NotNull(message = "Car type is required")
        CarType type,

        @NotNull(message = "Nodal point ID is required")
        Long nodalPointId,

        @NotNull(message = "Time slot ID is required")
        Long timeSlotId
) {
}