package com.tcs.commute.link.controller;

import com.tcs.commute.link.dto.BookingResponse;
import com.tcs.commute.link.dto.CreateBookingRequest;
import com.tcs.commute.link.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BookingResponse create(
            @Valid @RequestBody CreateBookingRequest request
    ) {
        return bookingService.create(request);
    }

    @GetMapping
    public List<BookingResponse> getBookings(
            @RequestParam(required = false) Long employeeId
    ) {
        return bookingService.getBookings(employeeId);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        bookingService.delete(id);
    }
}