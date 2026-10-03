package com.tcs.commute.link.controller;

import com.tcs.commute.link.dto.NodalPointResponse;
import com.tcs.commute.link.service.NodalPointService;
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