package com.tableturn.tableturn.serviceimpl;

import com.tableturn.tableturn.model.Reservation;
import com.tableturn.tableturn.model.RestaurantTable;
import com.tableturn.tableturn.repo.ReservationRepository;
import com.tableturn.tableturn.repo.TableRepository;
import com.tableturn.tableturn.service.ReservationService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReservationServiceImpl implements ReservationService {

    private final ReservationRepository reservationRepository;
    private final TableRepository tableRepository;

    public ReservationServiceImpl(
            ReservationRepository reservationRepository,
            TableRepository tableRepository) {

        this.reservationRepository = reservationRepository;
        this.tableRepository = tableRepository;
    }

    @Override
    public Reservation createReservation(Reservation reservation) {

        if (reservation.getTable() == null ||
                reservation.getTable().getId() == null) {

            throw new RuntimeException("Table ID is required");
        }

        Long tableId = reservation.getTable().getId();

        RestaurantTable table = tableRepository.findById(tableId)
                .orElseThrow(() ->
                        new RuntimeException("Table not found"));

        if (!"FREE".equalsIgnoreCase(table.getStatus())) {
            throw new RuntimeException("Table is not FREE");
        }

        if (reservation.getPartySize() == null ||
                reservation.getPartySize() <= 0) {

            throw new RuntimeException("Invalid party size");
        }

        if (reservation.getPartySize() > table.getCapacity()) {
            throw new RuntimeException(
                    "Party size is greater than table capacity");
        }

        if (reservation.getReservationDate() == null ||
                reservation.getStartTime() == null ||
                reservation.getEndTime() == null) {

            throw new RuntimeException(
                    "Reservation date and time are required");
        }

        if (!reservation.getStartTime()
                .isBefore(reservation.getEndTime())) {

            throw new RuntimeException(
                    "Start time must be before end time");
        }

        List<Reservation> existingReservations =
                reservationRepository.findAll();

        for (Reservation existing : existingReservations) {

            if (existing.getTable() == null) {
                continue;
            }

            if (!existing.getTable().getId().equals(tableId)) {
                continue;
            }

            if (!existing.getReservationDate()
                    .equals(reservation.getReservationDate())) {
                continue;
            }

            if ("CANCELLED".equalsIgnoreCase(existing.getStatus())) {
                continue;
            }

            boolean overlapping =
                    reservation.getStartTime()
                            .isBefore(existing.getEndTime())
                    &&
                    reservation.getEndTime()
                            .isAfter(existing.getStartTime());

            if (overlapping) {
                throw new RuntimeException(
                        "Table already booked for this time slot");
            }
        }

        reservation.setTable(table);
        reservation.setStatus("RESERVED");

        return reservationRepository.save(reservation);
    }

    @Override
    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    @Override
    public Reservation getReservationById(Long id) {

        return reservationRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Reservation not found"));
    }

    @Override
    public void cancelReservation(Long id) {

        Reservation reservation = getReservationById(id);

        reservation.setStatus("CANCELLED");

        reservationRepository.save(reservation);
    }
}