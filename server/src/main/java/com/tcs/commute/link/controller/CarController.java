package com.tcs.commute.link.controller;

import com.tcs.commute.link.dto.CarResponse;
import com.tcs.commute.link.dto.CreateCarRequest;
import com.tcs.commute.link.service.CarService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cars")
public class CarController {
    private final CarService carService;

    public CarController(CarService carService) {
        this.carService = carService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CarResponse create( @Valid @RequestBody CreateCarRequest request) {
        return carService.create(request);
    }

    @GetMapping
    public List<CarResponse> getCars(
            @RequestParam(required = false) Long nodalPointId,
            @RequestParam(required = false) Long timeSlotId,
            @RequestHeader("user-id") Long userId
    ) {
        return carService.getCarsFilteredByUser(
                nodalPointId,
                timeSlotId,
                userId
        );
    }
}