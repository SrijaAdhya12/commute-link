package com.tcs.carpool.service;

import com.tcs.carpool.dto.CreateEmployeeRequest;
import com.tcs.carpool.dto.EmployeeResponse;
import com.tcs.carpool.entity.Employee;
import com.tcs.carpool.entity.NodalPoint;
import com.tcs.carpool.repository.EmployeeRepository;
import com.tcs.carpool.repository.NodalPointRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class EmployeeService {

    private static final String DROP_LOCATION = "TCS Yeshwantpur";

    private final EmployeeRepository employeeRepository;
    private final NodalPointRepository nodalPointRepository;

    public EmployeeService(
            EmployeeRepository employeeRepository,
            NodalPointRepository nodalPointRepository
    ) {
        this.employeeRepository = employeeRepository;
        this.nodalPointRepository = nodalPointRepository;
    }

    public EmployeeResponse create(CreateEmployeeRequest request) {

        if (employeeRepository.existsByPhone(request.phone())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "An employee with this phone number already exists"
            );
        }

        NodalPoint nodalPoint = nodalPointRepository.findById(
                request.nodalPointId()
        ).orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Nodal point not found with id: " + request.nodalPointId()
        ));

        Employee employee = new Employee(
                request.name().trim(),
                request.phone(),
                request.homeAddress().trim(),
                nodalPoint
        );

        Employee savedEmployee = employeeRepository.save(employee);

        return toResponse(savedEmployee);
    }

    public EmployeeResponse getById(Long id) {

        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Employee not found with id: " + id
                ));

        return toResponse(employee);
    }

    private EmployeeResponse toResponse(Employee employee) {

        return new EmployeeResponse(
                employee.getId(),
                employee.getName(),
                employee.getPhone(),
                employee.getHomeAddress(),
                employee.getNodalPoint().getName(),
                DROP_LOCATION
        );
    }
}