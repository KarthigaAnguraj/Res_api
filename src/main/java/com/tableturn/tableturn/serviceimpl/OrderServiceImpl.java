package com.tableturn.tableturn.serviceimpl;

import com.tableturn.tableturn.model.Order;
import com.tableturn.tableturn.model.OrderItem;
import com.tableturn.tableturn.model.RestaurantTable;
import com.tableturn.tableturn.repo.OrderRepository;
import com.tableturn.tableturn.repo.TableRepository;
import com.tableturn.tableturn.service.OrderService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
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
    @Transactional
    public Order createOrder(Order order) {

        // 1. Check table information
        if (order.getTable() == null ||
                order.getTable().getId() == null) {

            throw new RuntimeException("Table ID is required");
        }

        Long tableId = order.getTable().getId();

        // 2. Find table
        RestaurantTable table = tableRepository.findById(tableId)
                .orElseThrow(() ->
                        new RuntimeException("Table not found"));

        // 3. Check table status
        String tableStatus = table.getStatus();

        if (!"FREE".equalsIgnoreCase(tableStatus)
                && !"OCCUPIED".equalsIgnoreCase(tableStatus)) {

            throw new RuntimeException(
                    "Order cannot be created. Table is " + tableStatus
            );
        }

        // 4. Check order items
        if (order.getItems() == null ||
                order.getItems().isEmpty()) {

            throw new RuntimeException(
                    "Order must contain at least one item"
            );
        }

        // 5. Validate every item
        for (OrderItem item : order.getItems()) {

            if (item.getItemName() == null ||
                    item.getItemName().isBlank()) {

                throw new RuntimeException(
                        "Item name is required"
                );
            }

            if (item.getQuantity() == null ||
                    item.getQuantity() <= 0) {

                throw new RuntimeException(
                        "Invalid quantity"
                );
            }

            if (item.getPrice() == null ||
                    item.getPrice() < 0) {

                throw new RuntimeException(
                        "Invalid price"
                );
            }
        }

        // 6. Set the real table object
        order.setTable(table);

        // 7. Backend automatically sets status
        order.setStatus("OPEN");

        // 8. Backend automatically sets order time
        order.setOrderTime(LocalDateTime.now());

        /*
         * If table is FREE, this is the first order
         * for the current sitting.
         *
         * Change it to OCCUPIED.
         *
         * If table is already OCCUPIED, this is another
         * order for the same sitting.
         *
         * Keep it OCCUPIED.
         */
        if ("FREE".equalsIgnoreCase(table.getStatus())) {

            table.setStatus("OCCUPIED");

            tableRepository.save(table);
        }

        // 9. Save order
        return orderRepository.save(order);
    }

    @Override
    public List<Order> getAllOrders() {

        return orderRepository.findAll();
    }

    @Override
    public Order getOrderById(Long id) {

        return orderRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Order not found"));
    }

    @Override
    @Transactional
    public void deleteOrder(Long id) {

        Order order = orderRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Order not found"));

        /*
         * Don't delete an already billed order.
         * Otherwise bill history could become inconsistent.
         */
        if ("BILLED".equalsIgnoreCase(order.getStatus())) {

            throw new RuntimeException(
                    "Billed order cannot be deleted"
            );
        }

        RestaurantTable table = order.getTable();

        orderRepository.delete(order);

        /*
         * After deleting an OPEN order, check whether
         * another OPEN order still exists for this table.
         *
         * If no OPEN orders remain, make table FREE.
         */
        if (table != null) {

            List<Order> allOrders = orderRepository.findAll();

            boolean hasOpenOrder = false;

            for (Order existingOrder : allOrders) {

                if (existingOrder.getTable() == null) {
                    continue;
                }

                if (!table.getId().equals(
                        existingOrder.getTable().getId())) {
                    continue;
                }

                if ("OPEN".equalsIgnoreCase(
                        existingOrder.getStatus())) {

                    hasOpenOrder = true;
                    break;
                }
            }

            if (!hasOpenOrder) {

                table.setStatus("FREE");

                tableRepository.save(table);
            }
        }
    }
}