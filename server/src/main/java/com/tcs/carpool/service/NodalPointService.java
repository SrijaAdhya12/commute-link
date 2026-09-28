package com.tcs.carpool.service;

import com.tcs.carpool.dto.NodalPointResponse;
import com.tcs.carpool.entity.NodalPoint;
import com.tcs.carpool.repository.NodalPointRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NodalPointService {

    private final NodalPointRepository nodalPointRepository;

    public NodalPointService(NodalPointRepository nodalPointRepository) {
        this.nodalPointRepository = nodalPointRepository;
    }

    public List<NodalPointResponse> getAll() {
        return nodalPointRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private NodalPointResponse toResponse(NodalPoint nodalPoint) {
        return new NodalPointResponse(
                nodalPoint.getId(),
                nodalPoint.getName()
        );
    }
}