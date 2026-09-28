package com.tcs.carpool.controller;

import com.tcs.carpool.dto.CarResponse;
import com.tcs.carpool.dto.CreateCarRequest;
import com.tcs.carpool.service.CarService;
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
    public CarResponse create(
            @Valid @RequestBody CreateCarRequest request
    ) {
        return carService.create(request);
    }

    @GetMapping
    public List<CarResponse> getCars(
            @RequestParam(required = false) Long nodalPointId,
            @RequestParam(required = false) Long timeSlotId
    ) {
        return carService.getCars(
                nodalPointId,
                timeSlotId
        );
    }
}