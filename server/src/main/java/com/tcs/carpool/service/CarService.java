package com.tcs.carpool.service;

import com.tcs.carpool.dto.CarResponse;
import com.tcs.carpool.dto.CreateCarRequest;
import com.tcs.carpool.entity.Car;
import com.tcs.carpool.entity.Employee;
import com.tcs.carpool.entity.NodalPoint;
import com.tcs.carpool.entity.TimeSlot;
import com.tcs.carpool.repository.BookingRepository;
import com.tcs.carpool.repository.CarRepository;
import com.tcs.carpool.repository.EmployeeRepository;
import com.tcs.carpool.repository.NodalPointRepository;
import com.tcs.carpool.repository.TimeSlotRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class CarService {

    private final CarRepository carRepository;
    private final EmployeeRepository employeeRepository;
    private final NodalPointRepository nodalPointRepository;
    private final TimeSlotRepository timeSlotRepository;
    private final BookingRepository bookingRepository;

    public CarService(
            CarRepository carRepository,
            EmployeeRepository employeeRepository,
            NodalPointRepository nodalPointRepository,
            TimeSlotRepository timeSlotRepository,
            BookingRepository bookingRepository
    ) {
        this.carRepository = carRepository;
        this.employeeRepository = employeeRepository;
        this.nodalPointRepository = nodalPointRepository;
        this.timeSlotRepository = timeSlotRepository;
        this.bookingRepository = bookingRepository;
    }

    public CarResponse create(CreateCarRequest request) {

        Employee owner = employeeRepository.findById(request.ownerId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Employee not found with id: " + request.ownerId()
                ));

        NodalPoint nodalPoint = nodalPointRepository.findById(
                request.nodalPointId()
        ).orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Nodal point not found with id: " + request.nodalPointId()
        ));

        TimeSlot timeSlot = timeSlotRepository.findById(
                request.timeSlotId()
        ).orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Time slot not found with id: " + request.timeSlotId()
        ));

        Car car = new Car(
                request.type(),
                owner,
                nodalPoint,
                timeSlot
        );

        Car savedCar = carRepository.save(car);

        return toResponse(savedCar, 0);
    }

    public List<CarResponse> getCars(
            Long nodalPointId,
            Long timeSlotId
    ) {

        if (nodalPointId != null &&
                !nodalPointRepository.existsById(nodalPointId)) {

            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Nodal point not found with id: " + nodalPointId
            );
        }

        if (timeSlotId != null &&
                !timeSlotRepository.existsById(timeSlotId)) {

            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Time slot not found with id: " + timeSlotId
            );
        }

        return carRepository.findCars(nodalPointId, timeSlotId)
                .stream()
                .map(car -> {
                    int bookings = (int) bookingRepository.countByCarId(
                            car.getId()
                    );
                    return toResponse(car, bookings);
                })
                .toList();
    }

    private CarResponse toResponse(Car car, int bookingCount) {

        int seats = car.getType().getSeats();
        int vacancies = Math.max(0, seats - bookingCount);

        return new CarResponse(
                car.getId(),
                car.getType(),
                car.getOwner().getName(),
                car.getNodalPoint().getName(),
                car.getTimeSlot().getLabel(),
                seats,
                vacancies
        );
    }
}