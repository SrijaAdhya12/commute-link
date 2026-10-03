package com.tcs.commute.link.service;

import com.tcs.commute.link.dto.CarResponse;
import com.tcs.commute.link.dto.CreateCarRequest;
import com.tcs.commute.link.entity.Car;
import com.tcs.commute.link.entity.Employee;
import com.tcs.commute.link.entity.NodalPoint;
import com.tcs.commute.link.entity.TimeSlot;
import com.tcs.commute.link.repository.BookingRepository;
import com.tcs.commute.link.repository.CarRepository;
import com.tcs.commute.link.repository.EmployeeRepository;
import com.tcs.commute.link.repository.NodalPointRepository;
import com.tcs.commute.link.repository.TimeSlotRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
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

        Car car = new Car(request.type(), owner, nodalPoint, timeSlot);

        Car savedCar = carRepository.save(car);

        return toResponse(savedCar, 0);
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

    @Transactional
    public List<CarResponse> getCarsFilteredByUser(Long nodalPointId, Long timeSlotId, Long userId) {
        if (nodalPointId != null && !nodalPointRepository.existsById(nodalPointId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Nodal point not found with id: " + nodalPointId);
        }

        if (timeSlotId != null && !timeSlotRepository.existsById(timeSlotId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Time slot not found with id: " + timeSlotId);
        }

        return carRepository.findCarsExcludingUser(nodalPointId, timeSlotId, userId)
                .stream()
                .map(car -> {
                    int bookings = (int) bookingRepository.countByCarId(
                            car.getId()
                    );
                    return toResponse(car, bookings);
                })
                .toList();
    }
}