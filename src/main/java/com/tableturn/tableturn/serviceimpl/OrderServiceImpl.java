package com.tableturn.tableturn.serviceimpl;

import com.tableturn.tableturn.model.Order;
import com.tableturn.tableturn.model.OrderItem;
import com.tableturn.tableturn.model.RestaurantTable;
import com.tableturn.tableturn.repo.OrderRepository;
import com.tableturn.tableturn.repo.TableRepository;
import com.tableturn.tableturn.service.OrderService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final TableRepository tableRepository;

    public OrderServiceImpl(
            OrderRepository orderRepository,
            TableRepository tableRepository) {
        this.orderRepository = orderRepository;
        this.tableRepository = tableRepository;
    }

    @Override
    public Order createOrder(Order order) {

        if (order.getTable() == null ||
                order.getTable().getId() == null) {
            throw new RuntimeException("Table ID is required");
        }

        Long tableId = order.getTable().getId();

        RestaurantTable table = tableRepository.findById(tableId)
                .orElseThrow(() -> new RuntimeException("Table not found"));

        if (!"FREE".equalsIgnoreCase(table.getStatus())) {
            throw new RuntimeException("Table is not FREE");
        }

        if (order.getItems() == null || order.getItems().isEmpty()) {
            throw new RuntimeException("Order must contain at least one item");
        }

        for (OrderItem item : order.getItems()) {

            if (item.getItemName() == null ||
                    item.getItemName().isBlank()) {
                throw new RuntimeException("Item name is required");
            }

            if (item.getQuantity() == null ||
                    item.getQuantity() <= 0) {
                throw new RuntimeException("Invalid quantity");
            }

            if (item.getPrice() == null ||
                    item.getPrice() < 0) {
                throw new RuntimeException("Invalid price");
            }
        }

        order.setTable(table);
        order.setStatus("OPEN");

        table.setStatus("OCCUPIED");
        tableRepository.save(table);

        return orderRepository.save(order);
    }

    @Override
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @Override
    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }
}