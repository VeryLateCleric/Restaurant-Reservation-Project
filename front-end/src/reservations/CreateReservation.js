import React from "react";
import { createReservation } from "../utils/api";
import ReservationForm from "./ReservationForm"

export function CreateReservation() {
  const initialTableData = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 0,
  };

//   Call API to create new reservations
  const APICall = (reservation) => {
    return createReservation(reservation);
  };

  return (
    <ReservationForm
      type="New"
      initialTableData={initialTableData}
      APICall={APICall}
    />
  );
}
