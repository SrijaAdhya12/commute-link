package com.tcs.commute.link.dto;

public record EmployeeResponse(
        Long id,
        String name,
        String phone,
        String homeAddress,
        String nodalPoint,
        String dropLocation
) {
}