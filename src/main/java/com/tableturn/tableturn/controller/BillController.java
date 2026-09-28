package com.tableturn.tableturn.controller;

import com.tableturn.tableturn.model.Bill;
import com.tableturn.tableturn.service.BillService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bills")
public class BillController {

    private final BillService billService;

    public BillController(BillService billService) {
        this.billService = billService;
    }

    @PostMapping("/generate/{orderId}")
    public Bill generateBill(@PathVariable Long orderId) {
        return billService.generateBill(orderId);
    }

    @GetMapping("/getAll")
    public List<Bill> getAllBills() {
        return billService.getAllBills();
    }

    @GetMapping("/getById/{id}")
    public Bill getBillById(@PathVariable Long id) {
        return billService.getBillById(id);
    }
}