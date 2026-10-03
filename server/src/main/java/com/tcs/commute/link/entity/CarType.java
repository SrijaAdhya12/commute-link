package com.tcs.commute.link.entity;

public enum CarType {

    HATCHBACK(4),
    SEDAN(4),
    SUV(6);

    private final int seats;

    CarType(int seats) {
        this.seats = seats;
    }

    public int getSeats() {
        return seats;
    }
}
