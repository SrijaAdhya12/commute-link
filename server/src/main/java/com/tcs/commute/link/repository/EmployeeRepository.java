package com.tcs.commute.link.repository;

import com.tcs.commute.link.entity.Employee;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    boolean existsByPhone(String phone);

    @EntityGraph(attributePaths = "nodalPoint")
    Optional<Employee> findById(Long id);

    Optional<Employee> findByNameAndPhone(String name, String phone);
}