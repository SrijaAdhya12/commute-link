package com.tcs.commute.link.entity;

import jakarta.persistence.*;

@Entity
@Table(
        name = "employees",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_employee_phone", columnNames = "phone")
        }
)
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true, length = 10)
    private String phone;

    @Column(nullable = false)
    private String homeAddress;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "nodal_point_id", nullable = false)
    private NodalPoint nodalPoint;

    public Employee() {
    }

    public Employee(
            String name,
            String phone,
            String homeAddress,
            NodalPoint nodalPoint
    ) {
        this.name = name;
        this.phone = phone;
        this.homeAddress = homeAddress;
        this.nodalPoint = nodalPoint;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getPhone() {
        return phone;
    }

    public String getHomeAddress() {
        return homeAddress;
    }

    public NodalPoint getNodalPoint() {
        return nodalPoint;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public void setHomeAddress(String homeAddress) {
        this.homeAddress = homeAddress;
    }

    public void setNodalPoint(NodalPoint nodalPoint) {
        this.nodalPoint = nodalPoint;
    }
}