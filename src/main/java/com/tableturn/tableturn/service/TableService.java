package com.tableturn.tableturn.service;

import java.util.List;

import com.tableturn.tableturn.model.RestaurantTable;

public interface TableService {

    RestaurantTable createTable(RestaurantTable table);

    List<RestaurantTable> getAllTables();

    RestaurantTable getTableById(Long id);

    RestaurantTable updateTable(Long id, RestaurantTable table);

    void deleteTable(Long id);
}