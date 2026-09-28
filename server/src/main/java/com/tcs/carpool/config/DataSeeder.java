package com.tcs.carpool.config;

import com.tcs.carpool.entity.NodalPoint;
import com.tcs.carpool.entity.TimeSlot;
import com.tcs.carpool.repository.NodalPointRepository;
import com.tcs.carpool.repository.TimeSlotRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final NodalPointRepository nodalPointRepository;
    private final TimeSlotRepository timeSlotRepository;

    private static final DateTimeFormatter TIME_FORMATTER =
            DateTimeFormatter.ofPattern("hh:mm a");

    public DataSeeder(
            NodalPointRepository nodalPointRepository,
            TimeSlotRepository timeSlotRepository
    ) {
        this.nodalPointRepository = nodalPointRepository;
        this.timeSlotRepository = timeSlotRepository;
    }

    @Override
    public void run(String... args) {

        System.out.println("========== DATA SEEDER STARTED ==========");

        seedNodalPoints();
        seedTimeSlots();

        System.out.println("========== DATA SEEDER FINISHED ==========");
    }

    private void seedNodalPoints() {

        if (nodalPointRepository.count() > 0) {
            System.out.println("Nodal points already exist. Skipping seed.");
            return;
        }

        List<String> names = List.of(
                "Hebbal",
                "Mekhri Circle",
                "Malleshwaram",
                "Rajajinagar",
                "Peenya",
                "Nagawara",
                "Yelahanka",
                "Jalahalli"
        );

        List<NodalPoint> nodalPoints = names.stream()
                .map(NodalPoint::new)
                .toList();

        nodalPointRepository.saveAll(nodalPoints);

        System.out.println(
                "Seeded " + nodalPoints.size() + " nodal points."
        );
    }

    private void seedTimeSlots() {

        if (timeSlotRepository.count() > 0) {
            System.out.println("Time slots already exist. Skipping seed.");
            return;
        }

        List<TimeSlot> timeSlots = new ArrayList<>();

        LocalTime current = LocalTime.of(7, 0);
        LocalTime end = LocalTime.of(9, 30);

        while (!current.isAfter(end)) {

            String label = current.format(TIME_FORMATTER);

            timeSlots.add(new TimeSlot(label));

            current = current.plusMinutes(30);
        }

        timeSlotRepository.saveAll(timeSlots);

        System.out.println(
                "Seeded " + timeSlots.size() + " time slots."
        );
    }
}