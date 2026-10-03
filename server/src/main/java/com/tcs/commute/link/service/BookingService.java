package com.tcs.commute.link.service;

import com.tcs.commute.link.dto.BookingResponse;
import com.tcs.commute.link.dto.CreateBookingRequest;
import com.tcs.commute.link.entity.Booking;
import com.tcs.commute.link.entity.Car;
import com.tcs.commute.link.entity.Employee;
import com.tcs.commute.link.repository.BookingRepository;
import com.tcs.commute.link.repository.CarRepository;
import com.tcs.commute.link.repository.EmployeeRepository;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class BookingService {

    private static final String DROP_LOCATION = "TCS Yeshwantpur";

    private final BookingRepository bookingRepository;
    private final EmployeeRepository employeeRepository;
    private final CarRepository carRepository;

    public BookingService(
            BookingRepository bookingRepository,
            EmployeeRepository employeeRepository,
            CarRepository carRepository
    ) {
        this.bookingRepository = bookingRepository;
        this.employeeRepository = employeeRepository;
        this.carRepository = carRepository;
    }

    @Transactional
    public BookingResponse create(CreateBookingRequest request) {

        Employee employee = employeeRepository.findById(request.employeeId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Employee not found with id: " + request.employeeId()
                ));

        /*
         * The car row is deliberately locked before checking vacancies.
         * This prevents two concurrent requests from taking the final seat.
         */
        Car car = carRepository.findByIdForUpdate(request.carId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Car not found with id: " + request.carId()
                ));

        if (bookingRepository.existsByEmployeeId(employee.getId())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Employee already has a booking"
            );
        }

        if (car.getOwner().getId().equals(employee.getId())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "An employee cannot book their own car"
            );
        }

        long bookingCount = bookingRepository.countByCarId(car.getId());

        int seats = car.getType().getSeats();

        if (bookingCount >= seats) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "This car is full"
            );
        }

        Booking booking = new Booking(
                employee,
                car
        );

        Booking savedBooking = bookingRepository.save(booking);

        int vacancies = seats - (int) bookingCount - 1;

        return toResponse(savedBooking, vacancies);
    }

    public List<BookingResponse> getBookings(Long employeeId) {

        if (employeeId != null &&
                !employeeRepository.existsById(employeeId)) {

            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Employee not found with id: " + employeeId
            );
        }

        List<Booking> bookings;

        if (employeeId == null) {
            bookings = bookingRepository.findAll();
        } else {
            bookings = bookingRepository.findBookingsByEmployeeId(employeeId);
        }

        return bookings.stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public void delete(Long bookingId) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Booking not found with id: " + bookingId
                ));

        bookingRepository.delete(booking);
    }

    private BookingResponse toResponse(Booking booking) {

        long bookingCount = bookingRepository.countByCarId(
                booking.getCar().getId()
        );

        int seats = booking.getCar().getType().getSeats();

        int vacancies = Math.max(
                0,
                seats - (int) bookingCount
        );

        return toResponse(booking, vacancies);
    }

    private BookingResponse toResponse(
            Booking booking,
            int vacancies
    ) {

        return new BookingResponse(
                booking.getId(),
                booking.getEmployee().getId(),
                booking.getEmployee().getName(),
                booking.getCar().getId(),
                booking.getCar().getType(),
                booking.getCar().getOwner().getName(),
                booking.getCar().getNodalPoint().getName(),
                booking.getCar().getTimeSlot().getLabel(),
                booking.getCar().getType().getSeats(),
                vacancies,
                DROP_LOCATION
        );
    }
}