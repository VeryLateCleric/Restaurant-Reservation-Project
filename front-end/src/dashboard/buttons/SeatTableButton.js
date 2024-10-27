import React from "react";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

export default function SeatTableButton({ reservation }) {
  const { reservation_id: id, status } = reservation;
  const href = `/reservations/${id}/seat`;

  const disabled = status === "booked" ? false : true;

  // When disabled, SeatButton is a secondary, disabled button element
  return disabled ? (
    <button className="btn btn-secondary" disabled>
      Seat
    </button>
  ) : (
    // Otherwise it's a Link Component to href styled like a primary button
    <Link className="btn btn-primary" to={href}>
      Seat
    </Link>
  );
}
