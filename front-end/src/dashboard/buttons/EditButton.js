import React from "react";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

export default function EditButton({ reservation }) {
    const { reservation_id: id, status } = reservation;
    const href = `/reservations/${id}/edit`;
  
    const disabled = status === "booked" ? false : true;
  
    // When disabled, EditButton is a secondary, disabled button element
    return disabled ? (
      <button className="btn btn-secondary" disabled>
        Edit
      </button>
    ) : (
      // Otherwise it's a Link Component to href styled like a primary button
      <Link className="btn btn-warning" to={href}>
        Edit
      </Link>
    );
}