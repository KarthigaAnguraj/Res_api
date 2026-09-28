package com.tableturn.tableturn.controller;

import com.tableturn.tableturn.model.Reservation;
import com.tableturn.tableturn.service.ReservationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    private final ReservationService reservationService;

    public ReservationController(
            ReservationService reservationService) {

        this.reservationService = reservationService;
    }

    // Create Reservation
    @PostMapping("/create")
    public Reservation createReservation(
            @RequestBody Reservation reservation) {

        return reservationService.createReservation(reservation);
    }

    // Get All Reservations
    @GetMapping("/getAll")
    public List<Reservation> getAllReservations() {

        return reservationService.getAllReservations();
    }

    // Get Reservation By ID
    @GetMapping("/getById/{id}")
    public Reservation getReservationById(
            @PathVariable Long id) {

        return reservationService.getReservationById(id);
    }

    // Cancel Reservation
    @PutMapping("/cancel/{id}")
    public String cancelReservation(
            @PathVariable Long id) {

        reservationService.cancelReservation(id);

        return "Reservation cancelled successfully";
    }
}