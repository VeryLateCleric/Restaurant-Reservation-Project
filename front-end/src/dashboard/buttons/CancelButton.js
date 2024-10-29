import React from "react";

/**
 *
 * @returns
 */
export default function CancelButton({ reservation, cancelReservation }) {
  const { reservation_id: id, status } = reservation;

  const disabled = status === "booked" ? false : true;

  const onClick = () => {
    const abortController = new AbortController();

    // Window confirmation dialogue
    if (
      !window.confirm(
        "Do you want to cancel this reservation?\nThis cannot be undone."
      )
    )
      return () => abortController.abort();

    // After confirmation, cancel the reservation
    cancelReservation(id, abortController);
  };

  return disabled ? (
    <button type="button" className="btn" disabled>
        Cancel
    </button>
  ) : (
  <button type="button" onClick={onClick} className="btn btn-danger" data-reservation-id-cancel={reservation.reservation_id}>Cancel</button>
)
}
