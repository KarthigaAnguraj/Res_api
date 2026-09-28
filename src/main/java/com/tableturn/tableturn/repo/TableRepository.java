package com.tableturn.tableturn.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tableturn.tableturn.model.RestaurantTable;

public interface TableRepository extends JpaRepository<RestaurantTable, Long> {
}