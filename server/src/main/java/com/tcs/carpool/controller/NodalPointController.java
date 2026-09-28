package com.tcs.carpool.controller;

import com.tcs.carpool.dto.NodalPointResponse;
import com.tcs.carpool.service.NodalPointService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/nodal-points")
public class NodalPointController {

    private final NodalPointService nodalPointService;

    public NodalPointController(NodalPointService nodalPointService) {
        this.nodalPointService = nodalPointService;
    }

    @GetMapping
    public List<NodalPointResponse> getAll() {
        return nodalPointService.getAll();
    }
}