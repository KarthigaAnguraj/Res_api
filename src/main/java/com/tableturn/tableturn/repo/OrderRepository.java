package com.tableturn.tableturn.repo;

import com.tableturn.tableturn.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
}