package com.tableturn.tableturn.service;

import com.tableturn.tableturn.model.Reservation;

import java.util.List;

public interface ReservationService {

    Reservation createReservation(Reservation reservation);

    List<Reservation> getAllReservations();

    Reservation getReservationById(Long id);

    void cancelReservation(Long id);
}