package com.tcs.carpool.dto;

import jakarta.validation.constraints.NotNull;

public record CreateBookingRequest(

        @NotNull(message = "Employee ID is required")
        Long employeeId,

        @NotNull(message = "Car ID is required")
        Long carId
) {
}