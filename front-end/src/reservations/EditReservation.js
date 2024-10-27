import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { formatAsDate } from "../utils/date-time";
import { editReservation, readReservation } from "../utils/api";
import ReservationForm from "./ReservationForm";

export default function EditReservation() {
  const { reservationId } = useParams();
  const [defaultFormData] = useState({
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 0,
  });

  useEffect(() => {
    readReservation(reservationId)
      .then((reservation) => {
        // Format the reservation_date Date object automatically using
        reservation.reservation_date = formatAsDate(
          reservation.reservation_date
        );
        return reservation;
      })
      // .then(setDefaultFormData);
  }, [reservationId]);

  // Higher order function to update the Reservation
  const APICall = (reservation) => {
    return editReservation(reservationId, reservation);
  };

  return (
    <ReservationForm type="Edit" defaultFormData={defaultFormData} APICall={APICall} />
  );
}
