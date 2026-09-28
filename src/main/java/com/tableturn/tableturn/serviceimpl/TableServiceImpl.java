package com.tableturn.tableturn.serviceimpl;

import com.tableturn.tableturn.model.RestaurantTable;
import com.tableturn.tableturn.repo.TableRepository;
import com.tableturn.tableturn.service.TableService;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TableServiceImpl implements TableService {

    private final TableRepository tableRepository;

    public TableServiceImpl(TableRepository tableRepository) {
        this.tableRepository = tableRepository;
    }

    @Override
    public RestaurantTable createTable(RestaurantTable table) {

        if (table.getStatus() == null || table.getStatus().isEmpty()) {
            table.setStatus("FREE");
        }

        return tableRepository.save(table);
    }

    @Override
    public List<RestaurantTable> getAllTables() {
        return tableRepository.findAll();
    }

    @Override
    public RestaurantTable getTableById(Long id) {
        return tableRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Table not found"));
    }

    @Override
    public RestaurantTable updateTable(Long id, RestaurantTable table) {

        RestaurantTable existingTable = getTableById(id);

        existingTable.setTableNumber(table.getTableNumber());
        existingTable.setCapacity(table.getCapacity());
        existingTable.setStatus(table.getStatus());

        return tableRepository.save(existingTable);
    }

    @Override
    public void deleteTable(Long id) {

        if (!tableRepository.existsById(id)) {
            throw new RuntimeException("Table not found");
        }

        tableRepository.deleteById(id);
    }
}