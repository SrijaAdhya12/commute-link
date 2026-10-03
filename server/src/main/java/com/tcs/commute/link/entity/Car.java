package com.tcs.commute.link.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "cars")
public class Car {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CarType type;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "owner_id", nullable = false)
    private Employee owner;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "nodal_point_id", nullable = false)
    private NodalPoint nodalPoint;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "time_slot_id", nullable = false)
    private TimeSlot timeSlot;

    public Car() {
    }

    public Car(
            CarType type,
            Employee owner,
            NodalPoint nodalPoint,
            TimeSlot timeSlot
    ) {
        this.type = type;
        this.owner = owner;
        this.nodalPoint = nodalPoint;
        this.timeSlot = timeSlot;
    }

    public Long getId() {
        return id;
    }

    public CarType getType() {
        return type;
    }

    public Employee getOwner() {
        return owner;
    }

    public NodalPoint getNodalPoint() {
        return nodalPoint;
    }

    public TimeSlot getTimeSlot() {
        return timeSlot;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setType(CarType type) {
        this.type = type;
    }

    public void setOwner(Employee owner) {
        this.owner = owner;
    }

    public void setNodalPoint(NodalPoint nodalPoint) {
        this.nodalPoint = nodalPoint;
    }

    public void setTimeSlot(TimeSlot timeSlot) {
        this.timeSlot = timeSlot;
    }
}