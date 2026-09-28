package com.tableturn.tableturn.controller;

import com.tableturn.tableturn.model.RestaurantTable;
import com.tableturn.tableturn.service.TableService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tables")
public class TableController {

    private final TableService tableService;

    public TableController(TableService tableService) {
        this.tableService = tableService;
    }

    // Create Table
    @PostMapping("/create")
    public RestaurantTable createTable(@RequestBody RestaurantTable table) {
        return tableService.createTable(table);
    }

    // Get All Tables
    @GetMapping("/getAll")
    public List<RestaurantTable> getAllTables() {
        return tableService.getAllTables();
    }

    // Get Table By ID
    @GetMapping("/getById/{id}")
    public RestaurantTable getTableById(@PathVariable Long id) {
        return tableService.getTableById(id);
    }

    // Update Table
    @PutMapping("/update/{id}")
    public RestaurantTable updateTable(
            @PathVariable Long id,
            @RequestBody RestaurantTable table) {

        return tableService.updateTable(id, table);
    }

    // Delete Table
    @DeleteMapping("/delete/{id}")
    public String deleteTable(@PathVariable Long id) {

        tableService.deleteTable(id);

        return "Table deleted successfully";
    }
}