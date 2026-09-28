package com.tcs.carpool.repository;

import com.tcs.carpool.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    boolean existsByPhone(String phone);
}