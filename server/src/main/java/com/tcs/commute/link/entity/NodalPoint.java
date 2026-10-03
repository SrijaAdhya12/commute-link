package com.tcs.commute.link.entity;

import jakarta.persistence.*;

@Entity
@Table(
        name = "nodal_points",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_nodal_point_name", columnNames = "name")
        }
)
public class NodalPoint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    public NodalPoint() {
    }

    public NodalPoint(String name) {
        this.name = name;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }
}