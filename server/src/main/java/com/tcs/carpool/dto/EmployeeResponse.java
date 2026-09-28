package com.tcs.carpool.dto;

public record EmployeeResponse(
        Long id,
        String name,
        String phone,
        String homeAddress,
        String nodalPoint,
        String dropLocation
) {
}