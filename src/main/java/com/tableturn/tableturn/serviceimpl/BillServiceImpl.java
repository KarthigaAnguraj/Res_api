package com.tableturn.tableturn.serviceimpl;

import com.tableturn.tableturn.model.Bill;
import com.tableturn.tableturn.model.Order;
import com.tableturn.tableturn.model.OrderItem;
import com.tableturn.tableturn.model.RestaurantTable;
import com.tableturn.tableturn.repo.BillRepository;
import com.tableturn.tableturn.repo.OrderRepository;
import com.tableturn.tableturn.repo.TableRepository;
import com.tableturn.tableturn.service.BillService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BillServiceImpl implements BillService {

    private final BillRepository billRepository;
    private final OrderRepository orderRepository;
    private final TableRepository tableRepository;

    public BillServiceImpl(
            BillRepository billRepository,
            OrderRepository orderRepository,
            TableRepository tableRepository) {

        this.billRepository = billRepository;
        this.orderRepository = orderRepository;
        this.tableRepository = tableRepository;
    }

    @Override
    public Bill generateBill(Long orderId) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        double total = 0.0;

        for (OrderItem item : order.getItems()) {
            total += item.getQuantity() * item.getPrice();
        }

        Bill bill = new Bill();
        bill.setOrder(order);
        bill.setTotalAmount(total);
        bill.setStatus("PAID");

        order.setStatus("BILLED");
        orderRepository.save(order);

        RestaurantTable table = order.getTable();

        if (table != null) {
            table.setStatus("FREE");
            tableRepository.save(table);
        }

        return billRepository.save(bill);
    }

    @Override
    public List<Bill> getAllBills() {
        return billRepository.findAll();
    }

    @Override
    public Bill getBillById(Long id) {
        return billRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bill not found"));
    }
}