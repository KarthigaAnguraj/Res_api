package com.tableturn.tableturn.service;

import com.tableturn.tableturn.model.Bill;
import java.util.List;

public interface BillService {

    Bill generateBill(Long orderId);

    List<Bill> getAllBills();

    Bill getBillById(Long id);
}